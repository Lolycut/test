/* Конструктор мягкой мебели ИЗЮМ: поддержка Диванов, Кресел и Кроватей с живым SVG-эскизом и расчётом цены. */
(function () {
  var P = IZYUM.PRICING, M = IZYUM.MODELS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var q = new URLSearchParams(location.search);
  var saved = IZYUM.store.get('config', {}) || {};
  var model = M.find(function (m) { return m.id === (q.get('model') || saved.model); }) || M[0];

  function clampForModel(m, v) {
    var minL = m.minLen || 1400;
    var maxL = m.maxLen || 3200;
    var defL = m.defLen || 2400;
    var val = +v || defL;
    return Math.min(maxL, Math.max(minL, Math.round(val / P.stepLength) * P.stepLength));
  }

  var cfg = {
    model: model.id,
    length: clampForModel(model, q.get('len') || (q.get('model') ? model.defLen : saved.length)),
    depth: +q.get('depth') || saved.depth || P.depths[0].mm,
    fabric: q.get('fabric') || saved.fabric || P.fabrics[0].id,
    color: +(q.get('color') || saved.color || 0),
    fill: q.get('fill') || saved.fill || P.fills[0].id,
    legs: q.get('legs') || (q.get('model') ? model.legs : saved.legs) || model.legs,
    sleeper: q.get('sleeper') === '1' || (!q.get('model') && !!saved.sleeper),
    box: q.get('box') === '1' || (!q.get('model') && !!saved.box),
    pillows: +(q.get('pillows') || saved.pillows || 0)
  };

  function curModel() { return M.find(function (m) { return m.id === cfg.model; }) || M[0]; }
  function curFabric() { return P.fabrics.find(function (f) { return f.id === cfg.fabric; }) || P.fabrics[0]; }

  /* ---------- SVG-эскиз ---------- */
  var svg = $('#sofa');
  var stage = $('.stage');
  var F = 372;
  var K = 0.225;
  var LEGC = { metal: '#2A2724', oak: '#B08356', brass: '#B8975A', hidden: '#2A2724' };

  function geometry() {
    var m = curModel();
    var map = {
      slim:  { armW: 22, armH: 120, armR: 6,  backH: 172, seatH: 36, baseH: 42, cushR: 8,  leg: m.tall ? 44 : 26 },
      puffy: { armW: 54, armH: 132, armR: 26, backH: 176, seatH: 48, baseH: 36, cushR: 22, leg: 20 },
      block: { armW: 46, armH: 112, armR: 14, backH: 152, seatH: 42, baseH: 50, cushR: 12, leg: 16 },
      chair: { armW: 36, armH: 126, armR: 18, backH: 170, seatH: 44, baseH: 38, cushR: 16, leg: m.tall ? 40 : 14 },
      round: { armW: 48, armH: 124, armR: 38, backH: 164, seatH: 46, baseH: 34, cushR: 28, leg: 18 },
      bed:   { armW: 28, armH: 86,  armR: 12, backH: 196, seatH: 46, baseH: 56, cushR: 14, leg: 10 }
    };
    var g = map[m.shape] || map.slim;
    var out = Object.assign({}, g);
    out.legH = cfg.legs === 'hidden' ? 5 : g.leg;
    var scaleK = m.cat === 'armchairs' ? 0.31 : (m.cat === 'beds' ? 0.26 : K);
    out.W = cfg.length * scaleK;
    out.depthK = (cfg.depth - 950) / 200;
    return out;
  }

  var shown = null, anim = null;
  function render(g) {
    var m = curModel();
    var n = m.cat === 'armchairs' ? 1 : (m.cat === 'beds' ? 2 : (cfg.length >= 2700 ? 3 : 2));
    var x0 = 400 - g.W / 2, x1 = 400 + g.W / 2;
    var legTop = F - g.legH;
    var baseY = legTop - g.baseH;
    var seatH = g.seatH + g.depthK * 6;
    var seatY = baseY - seatH + 8;
    var backTop = F - g.backH - g.depthK * 4;
    var innerX = x0 + g.armW - 2, innerW = g.W - 2 * g.armW + 4;
    var h = '';
    h += '<ellipse cx="400" cy="' + (F + 4) + '" rx="' + (g.W / 2 + 8) + '" ry="7" fill="rgba(42,35,29,.16)"/>';
    h += '<rect class="s-back" x="' + (x0 + g.armW * 0.5) + '" y="' + (backTop + 10) + '" width="' + (g.W - g.armW) + '" height="' + (legTop - backTop - 10) + '" rx="' + Math.min(g.cushR, 14) + '"/>';
    var cw = innerW / n;
    for (var i = 0; i < n; i++) {
      h += '<rect class="s-bc" x="' + (innerX + i * cw + 3) + '" y="' + backTop + '" width="' + (cw - 6) + '" height="' + (seatY - backTop + 14) + '" rx="' + g.cushR + '"/>';
    }
    h += '<rect class="s-base" x="' + (x0 + 6) + '" y="' + baseY + '" width="' + (g.W - 12) + '" height="' + g.baseH + '" rx="' + Math.min(g.armR, 10) + '"/>';
    for (i = 0; i < n; i++) {
      h += '<rect class="s-seat" x="' + (innerX + i * cw + 2) + '" y="' + seatY + '" width="' + (cw - 4) + '" height="' + seatH + '" rx="' + g.cushR + '"/>';
      h += '<rect class="s-sheen" x="' + (innerX + i * cw + 2) + '" y="' + seatY + '" width="' + (cw - 4) + '" height="' + seatH * 0.5 + '" rx="' + g.cushR + '"/>';
    }
    var pc = Math.min(cfg.pillows, 4);
    var ps = [[0.2, -1], [0.8, 1], [0.38, -1], [0.62, 1]];
    for (i = 0; i < pc; i++) {
      var px = innerX + innerW * ps[i][0], sz = m.cat === 'armchairs' ? 44 : 52;
      h += '<rect class="s-pil" x="' + (px - sz / 2) + '" y="' + (seatY - sz + 10) + '" width="' + sz + '" height="' + sz + '" rx="12" transform="rotate(' + (ps[i][1] * 9) + ' ' + px + ' ' + (seatY - sz / 2 + 10) + ')"/>';
    }
    [x0, x1 - g.armW].forEach(function (ax) {
      h += '<rect class="s-arm" x="' + ax + '" y="' + (F - g.armH) + '" width="' + g.armW + '" height="' + (g.armH - g.legH) + '" rx="' + g.armR + '"/>';
    });
    if (cfg.legs === 'hidden' || m.shape === 'round') {
      var plinthColor = m.shape === 'round' ? '#B8975A' : '';
      h += '<rect class="s-base" x="' + (x0 + 24) + '" y="' + legTop + '" width="' + (g.W - 48) + '" height="' + Math.max(g.legH, 8) + '" rx="4"' + (plinthColor ? ' style="fill:' + plinthColor + '"' : '') + '/>';
    } else {
      var legW = cfg.legs === 'oak' ? 10 : 6;
      var xs = [x0 + 12, x1 - 12 - legW];
      if (g.W > 520) xs.push(400 - legW / 2);
      xs.forEach(function (lx) {
        var shape = cfg.legs === 'oak'
          ? '<path class="s-leg" d="M' + lx + ' ' + legTop + 'h' + legW + 'l-2 ' + g.legH + 'h-' + (legW - 4) + 'z"/>'
          : '<rect class="s-leg" x="' + lx + '" y="' + legTop + '" width="' + legW + '" height="' + g.legH + '" rx="1.5"/>';
        h += shape;
      });
    }
    var dy = F + 50;
    h += '<g class="dimline"><path d="M' + x0 + ' ' + (dy - 6) + 'v12M' + x1 + ' ' + (dy - 6) + 'v12M' + x0 + ' ' + dy + 'H' + x1 + '" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>';
    h += '<text class="dim" x="400" y="' + (dy + 26) + '" text-anchor="middle">' + cfg.length + ' мм</text></g>';
    svg.innerHTML = h;
  }

  function draw() {
    var target = geometry();
    if (!shown || reduce) { shown = target; render(shown); return; }
    var from = Object.assign({}, shown), t0 = performance.now(), dur = 460;
    cancelAnimationFrame(anim);
    (function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      var g = {};
      for (var k in target) g[k] = from[k] + (target[k] - from[k]) * e;
      shown = g; render(g);
      if (t < 1) anim = requestAnimationFrame(step);
    })(t0);
  }

  function paint() {
    var fab = curFabric();
    var col = fab.colors[cfg.color] || fab.colors[0];
    stage.style.setProperty('--fab', col[1]);
    stage.style.setProperty('--leg', LEGC[cfg.legs]);
    var light = parseInt(col[1].slice(1, 3), 16) > 150;
    stage.style.setProperty('--pil', light ? '#6E5D4B' : '#E2DBD2');
  }

  function seg(el, items, get, set) {
    el.innerHTML = '<span class="pill" aria-hidden="true"></span>' + items.map(function (it) {
      return '<button type="button" data-v="' + it[0] + '">' + it[1] + '</button>';
    }).join('');
    var pill = $('.pill', el);
    function sync() {
      $$('button', el).forEach(function (b) {
        var on = b.dataset.v === String(get());
        b.setAttribute('aria-pressed', String(on));
        if (on) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + (b.offsetLeft - 4) + 'px)'; }
      });
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { set(b.dataset.v); update(); } });
    el._sync = sync;
    return sync;
  }

  // Группировка моделей по категориям
  var modelBox = $('#c-model');
  modelBox.innerHTML = M.map(function (m) {
    return '<button type="button" class="chip" data-v="' + m.id + '">' + m.name + ' <small class="muted">(' + m.kind.toLowerCase() + ')</small></button>';
  }).join('');
  modelBox.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.dataset.v === cfg.model) return;
    cfg.model = b.dataset.v;
    var m = curModel();
    cfg.legs = m.legs;
    cfg.length = m.defLen || 2400;
    if (!m.sleeper) cfg.sleeper = false;
    update();
  });

  var len = $('#c-len');
  var lenScale = $('.range-scale');
  len.addEventListener('input', function () { cfg.length = +len.value; update(); });

  var syncDepth = seg($('#c-depth'), P.depths.map(function (d) { return [d.mm, d.label]; }),
    function () { return cfg.depth; }, function (v) { cfg.depth = +v; });

  var syncFabric = seg($('#c-fabric'), P.fabrics.map(function (f) { return [f.id, f.name]; }),
    function () { return cfg.fabric; }, function (v) { cfg.fabric = v; cfg.color = 0; });
  var swBox = $('#c-colors');
  swBox.addEventListener('click', function (e) { var b = e.target.closest('.sw'); if (b) { cfg.color = +b.dataset.i; update(); } });

  var fillBox = $('#c-fill');
  fillBox.innerHTML = P.fills.map(function (f) {
    return '<label class="opt"><input type="radio" name="fill" value="' + f.id + '"><span>' + f.name + '<span class="h">' + f.hint + '</span></span><span class="p">' + (f.k ? '+' + Math.round(f.k * 100) + '%' : 'база') + '</span></label>';
  }).join('');
  fillBox.addEventListener('change', function (e) { cfg.fill = e.target.value; update(); });

  var syncLegs = seg($('#c-legs'), P.legs.map(function (l) { return [l.id, l.name]; }),
    function () { return cfg.legs; }, function (v) { cfg.legs = v; });

  var exBox = $('#c-extra');
  exBox.innerHTML =
    '<label class="opt" data-ex="sleeper"><input type="checkbox" name="sleeper"><span><span data-sleeper-title>' + P.extras.sleeper.name + '</span><span class="h" data-hint></span></span><span class="p">+' + IZYUM.fmt(P.extras.sleeper.add) + ' BYN</span></label>' +
    '<label class="opt"><input type="checkbox" name="box"><span>' + P.extras.box.name + '<span class="h">под сиденьем / основанием</span></span><span class="p">+' + IZYUM.fmt(P.extras.box.add) + ' BYN</span></label>' +
    '<div class="opt" style="grid-template-columns:1fr auto;cursor:default"><span>' + P.extras.pillow.name + '<span class="h">' + P.extras.pillow.add + ' BYN за штуку</span></span>' +
    '<span class="stepper"><button type="button" data-p="-1" aria-label="Меньше подушек">−</button><output id="c-pil">0</output><button type="button" data-p="1" aria-label="Больше подушек">+</button></span></div>';
  exBox.addEventListener('change', function (e) {
    if (e.target.name === 'sleeper') cfg.sleeper = e.target.checked;
    if (e.target.name === 'box') cfg.box = e.target.checked;
    update();
  });
  exBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-p]'); if (!b) return;
    cfg.pillows = Math.max(0, Math.min(P.extras.pillow.max, cfg.pillows + +b.dataset.p)); update();
  });

  var sumEl = $('[data-sum]'), shownSum = 0, sumAnim;
  function animateSum(to) {
    var from = shownSum, t0 = performance.now();
    cancelAnimationFrame(sumAnim);
    if (reduce || !from) { shownSum = to; sumEl.textContent = IZYUM.fmt(to); return; }
    (function step(now) {
      var t = Math.min(1, (now - t0) / 420), e = 1 - Math.pow(1 - t, 3);
      shownSum = from + (to - from) * e;
      sumEl.textContent = IZYUM.fmt(Math.round(shownSum / 10) * 10);
      if (t < 1) sumAnim = requestAnimationFrame(step);
    })(t0);
    var box = sumEl.parentNode; box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump');
  }

  var saveT;
  function update() {
    var m = curModel(), fab = curFabric();
    if (cfg.color >= fab.colors.length) cfg.color = 0;

    var minL = m.minLen || 1400, maxL = m.maxLen || 3200;
    len.min = minL; len.max = maxL; len.step = m.cat === 'armchairs' ? 50 : 100;
    cfg.length = Math.min(maxL, Math.max(minL, cfg.length));
    if (lenScale) {
      lenScale.innerHTML = '<span>' + minL + '</span><span>' + Math.round((minL + maxL) / 2) + '</span><span>' + maxL + '</span>';
    }
    var lenLab = $('label[for="c-len"]');
    if (lenLab) lenLab.textContent = m.cat === 'beds' ? 'Ширина спального места' : (m.cat === 'armchairs' ? 'Ширина кресла' : 'Длина дивана');

    $$('button', modelBox).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === cfg.model)); });
    len.value = cfg.length;
    len.style.setProperty('--p', ((cfg.length - minL) / Math.max(1, maxL - minL) * 100) + '%');
    $('#o-len').textContent = IZYUM.fmt(cfg.length) + ' мм';
    $('#o-depth').textContent = m.cat === 'beds' ? '2000 мм' : (cfg.depth + ' мм');
    $('#o-color').textContent = fab.colors[cfg.color][0];
    syncDepth(); syncFabric(); syncLegs();

    if (swBox.dataset.f !== cfg.fabric) {
      swBox.dataset.f = cfg.fabric;
      swBox.innerHTML = fab.colors.map(function (c, i) {
        return '<button type="button" class="sw" style="--c:' + c[1] + '" data-i="' + i + '" aria-label="' + c[0] + '" title="' + c[0] + '"></button>';
      }).join('');
    }
    $$('.sw', swBox).forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === cfg.color)); });
    $$('input', fillBox).forEach(function (r) { r.checked = r.value === cfg.fill; });

    var sl = $('[data-ex="sleeper"]', exBox), sli = $('input', sl);
    var slTitle = $('[data-sleeper-title]', sl);
    if (slTitle) slTitle.textContent = m.cat === 'beds' ? 'Подъёмный механизм с газлифтами' : 'Механизм раскладки';
    sl.classList.toggle('off', !m.sleeper); sli.disabled = !m.sleeper; sli.checked = cfg.sleeper;
    $('[data-hint]', sl).textContent = m.sleeper ? (m.cat === 'beds' ? 'доступ к бельевому коробу' : 'спальное место') : 'для этой модели не предусмотрен';
    $('input[name="box"]', exBox).checked = cfg.box;
    $('#c-pil').textContent = cfg.pillows;

    var res = IZYUM.priceOf(cfg);
    animateSum(res.total);
    $('[data-lines]').innerHTML = res.lines.map(function (l) {
      return '<tr><td>' + l[0] + '</td><td class="num">' + (l === res.lines[0] ? '' : '+') + IZYUM.fmt(l[1]) + ' BYN</td></tr>';
    }).join('');
    $('.stage-tag').textContent = m.kind.charAt(0) + m.kind.slice(1).toLowerCase() + ' ' + m.name + ', ' + cfg.length + ' × ' + (m.cat === 'beds' ? 2000 : cfg.depth) + ' мм';

    paint(); draw();

    clearTimeout(saveT);
    saveT = setTimeout(function () {
      var fl = P.fills.find(function (f) { return f.id === cfg.fill; });
      var lg = P.legs.find(function (l) { return l.id === cfg.legs; });
      var extras = [];
      if (cfg.sleeper && m.sleeper) extras.push(m.cat === 'beds' ? 'подъёмный механизм' : 'раскладка');
      if (cfg.box) extras.push('ящик для белья');
      if (cfg.pillows) extras.push('подушки × ' + cfg.pillows);
      var kindTitle = m.kind.charAt(0) + m.kind.slice(1).toLowerCase();
      var summary = kindTitle + ' ' + m.name + ', ' + cfg.length + ' × ' + (m.cat === 'beds' ? 2000 : cfg.depth) + ' мм; ' +
        fab.name.toLowerCase() + ' «' + fab.colors[cfg.color][0] + '»; ' + fl.name + '; опора: ' + lg.name.toLowerCase() +
        (extras.length ? '; ' + extras.join(', ') : '') + '. Ориентировочно ' + IZYUM.fmt(res.total) + ' BYN';
      IZYUM.store.set('config', Object.assign({}, cfg, { total: res.total, summary: summary }));
      var p = new URLSearchParams({ model: cfg.model, len: cfg.length, depth: cfg.depth, fabric: cfg.fabric, color: cfg.color, fill: cfg.fill, legs: cfg.legs });
      if (cfg.sleeper) p.set('sleeper', 1);
      if (cfg.box) p.set('box', 1);
      if (cfg.pillows) p.set('pillows', cfg.pillows);
      history.replaceState(null, '', '?' + p.toString());
    }, 250);
  }

  $('[data-share]').addEventListener('click', function () {
    var url = location.href;
    if (navigator.share) navigator.share({ title: 'Моя конфигурация — ИЗЮМ', url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { izyumToast('Ссылка на конфигурацию скопирована'); });
  });

  window.addEventListener('resize', function () { syncDepth(); syncFabric(); syncLegs(); });
  update();
  if (document.fonts) document.fonts.ready.then(function () { syncDepth(); syncFabric(); syncLegs(); });
})();
