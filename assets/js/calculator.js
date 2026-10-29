/* Калькулятор: рассрочка + доставка, и проверка «пройдёт ли мебель в дверь». */
(function () {
  var C = IZYUM.CALC;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cfg = IZYUM.store.get('config', null);

  var tabs = $$('[role="tab"]');
  function showTab(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    history.replaceState(null, '', '#' + id);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showTab(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      n.focus(); n.click();
    });
  });
  if (location.hash === '#door') showTab('door');

  var sum = $('#k-sum'), first = $('#k-first'), floor = $('#k-floor');
  var state = { term: 6, zone: C.delivery[0].id, lift: 'lift' };

  if (cfg && cfg.total) {
    sum.value = cfg.total;
    $('#k-from').hidden = false;
    $('#k-from').textContent = 'Подставлена цена из конструктора: ' + cfg.summary.split('.')[0] + '.';
  }

  function chips(box, items, key) {
    box.innerHTML = items.map(function (it) {
      return '<button type="button" class="chip" data-v="' + it[0] + '">' + it[1] + '</button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state[key] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; calc();
    });
  }
  chips($('#k-term'), C.terms.map(function (t) { return [t.months, t.months + ' мес']; }), 'term');
  chips($('#k-zone'), C.delivery.map(function (d) { return [d.id, d.name]; }), 'zone');
  chips($('#k-lift'), [['lift', 'Грузовой лифт'], ['stairs', 'По лестнице'], ['none', 'Без подъёма']], 'lift');

  var shown = {};
  function setNum(id, v) {
    var el = $(id); if (!el) return;
    var from = shown[id] || 0, t0 = performance.now();
    shown[id] = v;
    if (!from || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = IZYUM.fmt(v); return; }
    (function step(now) {
      var t = Math.min(1, (now - t0) / 380), e = 1 - Math.pow(1 - t, 3);
      el.textContent = IZYUM.fmt(from + (v - from) * e);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }

  function calc() {
    var S = Math.max(0, +sum.value || 0);
    var fp = +first.value;
    first.style.setProperty('--p', (fp / 50 * 100) + '%');
    $('#o-first').textContent = fp + '%';
    var term = C.terms.find(function (t) { return t.months === state.term; });
    var zone = C.delivery.find(function (d) { return d.id === state.zone; });
    var fl = Math.max(1, +floor.value || 1);
    floor.closest('.field').hidden = state.lift === 'none';

    var firstSum = Math.round(S * fp / 100);
    var rest = S - firstSum;
    var over = Math.round(rest * term.over);
    var monthly = Math.ceil((rest + over) / term.months);
    var lift = state.lift === 'lift' ? C.liftFlat : state.lift === 'stairs' ? C.stairsPerFloor * Math.max(0, fl - 1) : 0;
    var delivery = zone.price + lift;

    setNum('#r-month', monthly);
    setNum('#r-first', firstSum);
    setNum('#r-over', over);
    setNum('#r-del', delivery);
    setNum('#r-total', S + over + delivery);
    $('#r-term').textContent = term.months + ' мес' + (term.over ? ', +' + Math.round(term.over * 100) + '%' : ', без переплаты');

    [['#k-term', state.term], ['#k-zone', state.zone], ['#k-lift', state.lift]].forEach(function (p) {
      $$('button', $(p[0])).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === String(p[1]))); });
    });
  }
  [sum, first, floor].forEach(function (el) { el.addEventListener('input', calc); });
  calc();

  var dW = $('#d-w'), dH = $('#d-h'), sD = $('#s-d'), sH = $('#s-h');
  if (cfg && cfg.depth) sD.value = cfg.depth;
  var door = $('#door-svg');

  function check() {
    var W = +dW.value || 0, H = +dH.value || 0, D = +sD.value || 0, SH = +sH.value || 0;
    var gap = 20;
    var fitA = D + gap <= W && SH + gap <= H;
    var fitB = SH + gap <= W && D + gap <= H;
    var ok = W > 0 && H > 0 && D > 0 && SH > 0 && (fitA || fitB);
    var useB = fitA ? false : fitB ? true : SH < D;
    var bw = useB ? SH : D, bh = useB ? D : SH;

    var v = $('.verdict');
    v.classList.toggle('no', !ok);
    $('[data-verdict]').textContent = ok ? 'Пройдёт, если нести на боку' : 'Целиком не пройдёт';
    $('[data-verdict-hint]').textContent = ok
      ? 'Запас ' + (Math.min(W - bw, H - bh) - 0) + ' мм. Длина изделия при этом не мешает: его заносят вдоль прохода.'
      : 'Не хватает ' + Math.max(0, Math.min(D, SH) + gap - W) + ' мм по ширине. Спросите менеджера о разборной или модульной конструкции.';

    var sc = 230 / Math.max(H, bh, 1);
    var fw = W * sc, fh = H * sc, x = 160 - fw / 2, y = 270 - fh;
    var rw = bw * sc, rh = bh * sc, rx = 160 - rw / 2, ry = 270 - rh;
    door.innerHTML =
      '<rect x="' + (x - 10) + '" y="' + (y - 10) + '" width="' + (fw + 20) + '" height="' + (fh + 10) + '" rx="4" fill="#A3927F"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + fw + '" height="' + fh + '" fill="#EFEBE6"/>' +
      '<rect class="door-sofa" x="' + rx + '" y="' + ry + '" width="' + rw + '" height="' + rh + '" rx="8" fill="' + (ok ? 'rgba(9,85,98,.85)' : 'rgba(164,68,47,.8)') + '"/>' +
      '<line x1="10" y1="270" x2="310" y2="270" stroke="#6A6058" stroke-width="1"/>' +
      '<text x="160" y="292" text-anchor="middle" font-size="13" fill="currentColor" opacity="0.7" font-family="Jost, sans-serif">проём ' + W + ' × ' + H + ' мм</text>';
  }
  [dW, dH, sD, sH].forEach(function (el) { el.addEventListener('input', check); });
  check();
})();
