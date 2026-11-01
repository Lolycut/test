/* Калькулятор: кредит «На родныя тавары» (4% годовых, Беларусбанк) + рассрочка + доставка, и проверка «пройдёт ли мебель в дверь». */
(function () {
  var C = IZYUM.CALC;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cfg = IZYUM.store.get('config', null);
  var params = new URLSearchParams(location.search);

  var tabs = $$('[role="tab"]');
  function showTab(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    history.replaceState(null, '', location.pathname + location.search + '#' + id);
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
  var progBox = $('#k-prog'), termBox = $('#k-term'), zoneBox = $('#k-zone'), liftBox = $('#k-lift');
  var initMode = params.get('mode') === 'installment' ? 'installment' : 'rodnye';
  var state = {
    prog: initMode,
    term: initMode === 'rodnye' ? 36 : 6,
    zone: C.delivery[0].id,
    lift: 'lift',
    modelName: params.get('model') || ''
  };

  if (params.get('sum') && +params.get('sum') > 0) {
    sum.value = Math.round(+params.get('sum'));
    if (state.modelName) {
      $('#k-from').hidden = false;
      $('#k-from').textContent = 'Выбрана модель из каталога: ' + state.modelName + ' (' + IZYUM.fmt(+sum.value) + ' BYN).';
    }
  } else if (cfg && cfg.total) {
    sum.value = cfg.total;
    $('#k-from').hidden = false;
    $('#k-from').textContent = 'Выбрана модель: ' + cfg.summary.split('.')[0] + '.';
  }

  first.value = state.prog === 'rodnye' ? 0 : 20;

  function curProgram() {
    var list = C.programs || [];
    return list.find(function (p) { return p.id === state.prog; }) || list[0];
  }

  function renderTermChips() {
    var p = curProgram();
    var terms = (p && p.terms) ? p.terms : C.terms.map(function (t) { return { months: t.months, over: t.over, label: t.months + ' мес' }; });
    if (!terms.some(function (t) { return t.months === state.term; })) {
      state.term = p ? p.defTerm : terms[0].months;
    }
    termBox.innerHTML = terms.map(function (t) {
      return '<button type="button" class="chip" data-v="' + t.months + '">' + (t.label || (t.months + ' мес')) + '</button>';
    }).join('');
  }

  if (progBox && C.programs) {
    progBox.innerHTML = C.programs.map(function (p) {
      return '<button type="button" class="chip" data-v="' + p.id + '">' + p.name + '</button>';
    }).join('');
    progBox.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (state.prog === b.dataset.v) return;
      state.prog = b.dataset.v;
      var p = curProgram();
      state.term = p ? p.defTerm : 12;
      first.value = p ? p.defFirst : 0;
      renderTermChips();
      calc();
    });
  }

  renderTermChips();
  termBox.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.term = +b.dataset.v;
    calc();
  });

  function chips(box, items, key) {
    box.innerHTML = items.map(function (it) {
      return '<button type="button" class="chip" data-v="' + it[0] + '">' + it[1] + '</button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state[key] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
      calc();
    });
  }
  chips(zoneBox, C.delivery.map(function (d) { return [d.id, d.name]; }), 'zone');
  chips(liftBox, [['lift', 'Грузовой лифт'], ['stairs', 'По лестнице'], ['none', 'Без подъёма']], 'lift');

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
    var zone = C.delivery.find(function (d) { return d.id === state.zone; }) || C.delivery[0];
    var fl = Math.max(1, +floor.value || 1);
    floor.closest('.field').hidden = state.lift === 'none';

    var firstSum = Math.round(S * fp / 100);
    var rest = Math.max(0, S - firstSum);
    var lift = state.lift === 'lift' ? C.liftFlat : state.lift === 'stairs' ? C.stairsPerFloor * Math.max(0, fl - 1) : 0;
    var delivery = zone.price + lift;

    var isRodnye = state.prog === 'rodnye';
    var termLab = $('#k-term-lab');
    var firstHint = $('#k-first-hint');
    var limitWarn = $('#k-limit-warn');
    var progEl = $('#r-prog');
    var loanLab = $('#r-loan-label');
    var overLab = $('#r-over-label');
    var subEl = $('#r-month-sub');
    var leadBtn = $('#r-lead-btn');

    var over = 0, monthly = 0;

    if (isRodnye) {
      if (termLab) termLab.textContent = 'Срок кредита «На родныя тавары» (4% годовых)';
      if (firstHint) firstHint.textContent = 'По программе «На родныя тавары» первоначальный взнос не обязателен (от 0%).';
      if (limitWarn) limitWarn.hidden = rest <= 13500;
      var cr = IZYUM.calcRodnye(rest, state.term);
      over = cr.over;
      monthly = cr.monthly;
      if (progEl) progEl.textContent = 'Кредит «На родныя тавары» (4%)';
      if (loanLab) loanLab.textContent = 'Сумма в кредит';
      if (overLab) overLab.textContent = 'Проценты за весь срок (4% годовых)';
      $('#r-term').textContent = state.term + ' мес, 4% годовых';
      if (subEl) {
        subEl.hidden = rest <= 0;
        subEl.textContent = '1-й платёж ~' + IZYUM.fmt(cr.firstMonth) + ' BYN, далее на уменьшение до ~' + IZYUM.fmt(cr.lastMonth) + ' BYN (основной долг равными долями + 4% годовых на остаток).';
      }
      if (leadBtn) {
        leadBtn.setAttribute('data-lead', (state.modelName ? state.modelName + ' · ' : '') + 'Кредит «На родныя тавары» 4%: ' + IZYUM.fmt(rest) + ' BYN на ' + state.term + ' мес (~' + IZYUM.fmt(monthly) + ' BYN/мес)');
      }
    } else {
      if (termLab) termLab.textContent = 'Срок рассрочки';
      if (firstHint) firstHint.textContent = 'Выберите комфортный размер первоначального взноса.';
      if (limitWarn) limitWarn.hidden = true;
      var p = curProgram();
      var termObj = (p && p.terms ? p.terms : C.terms).find(function (t) { return t.months === state.term; }) || C.terms[0];
      over = Math.round(rest * (termObj.over || 0));
      monthly = state.term > 0 ? Math.ceil((rest + over) / state.term) : 0;
      if (progEl) progEl.textContent = 'Рассрочка';
      if (loanLab) loanLab.textContent = 'Остаток к оплате';
      if (overLab) overLab.textContent = 'Переплата';
      $('#r-term').textContent = state.term + ' мес' + (termObj.over ? ', +' + Math.round(termObj.over * 100) + '%' : ', без переплаты');
      if (subEl) {
        subEl.hidden = true;
        subEl.textContent = '';
      }
      if (leadBtn) {
        leadBtn.setAttribute('data-lead', (state.modelName ? state.modelName + ' · ' : '') + 'Рассрочка: ' + IZYUM.fmt(rest) + ' BYN на ' + state.term + ' мес (~' + IZYUM.fmt(monthly) + ' BYN/мес)');
      }
    }

    setNum('#r-month', monthly);
    setNum('#r-loan', rest);
    setNum('#r-first', firstSum);
    setNum('#r-over', over);
    setNum('#r-del', delivery);
    setNum('#r-total', S + over + delivery);

    [['#k-prog', state.prog], ['#k-term', state.term], ['#k-zone', state.zone], ['#k-lift', state.lift]].forEach(function (pair) {
      var container = $(pair[0]);
      if (!container) return;
      $$('button', container).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === String(pair[1]))); });
    });
  }

  [sum, first, floor].forEach(function (el) { if (el) el.addEventListener('input', calc); });
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
      '<text x="160" y="292" text-anchor="middle" font-size="13" fill="currentColor" opacity="0.7" font-family="Onest, Manrope, sans-serif">проём ' + W + ' × ' + H + ' мм</text>';
  }
  [dW, dH, sD, sH].forEach(function (el) { el.addEventListener('input', check); });
  check();
})();
