/* Калькулятор: кредит «На сваё» (4% годовых в первые 12 мес., до 5 лет, ОАО «АСБ Беларусбанк») и рассрочка 0% (3 и 4 мес.),
   плюс проверка «пройдёт ли мебель в дверь». Доставка бесплатная и в расчёт не входит. */
(function () {
  var C = IZYUM.CALC;
  var fmt = IZYUM.fmt;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var cfg = IZYUM.store.get('config', null);
  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- вкладки ---------- */
  var tabs = $$('[role="tab"]');
  var dock = $('#kc-dock');
  function showTab(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    history.replaceState(null, '', location.pathname + location.search + '#' + id);
    updateDock();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showTab(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      n.focus(); n.click();
    });
  });

  /* ---------- состояние ---------- */
  var sum = $('#k-sum'), first = $('#k-first');
  var progBox = $('#k-prog'), termBox = $('#k-term');
  var initMode = params.get('mode') === 'installment' ? 'installment' : 'svaye';
  var paramTerm = +(params.get('term') || 0);
  var state = {
    prog: initMode,
    term: initMode === 'svaye' ? (paramTerm || 36) : (paramTerm === 3 || paramTerm === 4 ? paramTerm : 4),
    modelName: params.get('model') || ''
  };

  if (params.get('sum') && +params.get('sum') > 0) {
    sum.value = Math.round(+params.get('sum'));
    if (state.modelName) {
      $('#k-from').hidden = false;
      $('#k-from').textContent = 'Модель из каталога: ' + state.modelName + ' — ' + fmt(+sum.value) + ' BYN.';
    }
  } else if (cfg && cfg.total) {
    sum.value = cfg.total;
    $('#k-from').hidden = false;
    $('#k-from').textContent = 'Модель из конструктора: ' + cfg.summary.split('.')[0] + '.';
  }

  function curProgram() {
    var list = C.programs || [];
    return list.find(function (p) { return p.id === state.prog; }) || list[0];
  }
  first.value = curProgram() ? curProgram().defFirst : 0;

  /* подписи сегментов */
  var PROG_TEXT = {
    svaye: ['Кредит 4%', '«На сваё» · до 5 лет'],
    installment: ['Рассрочка 0%', 'на 3 или 4 месяца']
  };
  function yearsLabel(m) {
    var y = m / 12;
    if (m % 12) return m + ' мес';
    return y + ' ' + (y === 1 ? 'год' : y < 5 ? 'года' : 'лет');
  }
  function termText(m) {
    if (state.prog === 'svaye') return [yearsLabel(m), m + ' мес'];
    return [m + ' месяца', 'без переплаты'];
  }
  function optHTML(v, t) {
    return '<button type="button" class="kc-opt" data-v="' + v + '" aria-pressed="false">' + t[0] + '<small>' + t[1] + '</small></button>';
  }

  function renderTerms() {
    var p = curProgram();
    var terms = (p && p.terms) ? p.terms : C.terms;
    if (!terms.some(function (t) { return t.months === state.term; })) state.term = p ? p.defTerm : terms[0].months;
    termBox.style.setProperty('--n', terms.length);
    termBox.innerHTML = terms.map(function (t) { return optHTML(t.months, termText(t.months)); }).join('');
  }

  if (progBox && C.programs) {
    progBox.style.setProperty('--n', C.programs.length);
    progBox.innerHTML = C.programs.map(function (p) {
      return optHTML(p.id, PROG_TEXT[p.id] || [p.name, '']);
    }).join('');
    progBox.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || state.prog === b.dataset.v) return;
      state.prog = b.dataset.v;
      var p = curProgram();
      state.term = p ? p.defTerm : (state.prog === 'svaye' ? 36 : 4);
      first.value = p ? p.defFirst : 0;
      renderTerms();
      calc();
    });
  }
  renderTerms();
  termBox.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.term = +b.dataset.v;
    calc();
  });

  /* плавная смена чисел */
  var shown = {};
  function setNum(id, v) {
    var el = $(id); if (!el) return;
    var from = shown[id] || 0, t0 = performance.now();
    shown[id] = v;
    if (!from || reduced) { el.textContent = fmt(v); return; }
    (function step(now) {
      var t = Math.min(1, (now - t0) / 380), e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(from + (v - from) * e);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  function setText(id, txt) { var el = $(id); if (el) el.textContent = txt; }

  /* ---------- расчёт ---------- */
  function calc() {
    var S = Math.max(0, +sum.value || 0);
    var fp = +first.value;
    first.style.setProperty('--p', (fp / 50 * 100) + '%');

    var firstSum = Math.round(S * fp / 100);
    var rest = Math.max(0, S - firstSum);
    $('#o-first').textContent = fp + '% · ' + fmt(firstSum) + ' BYN';

    var isSvaye = state.prog === 'svaye';
    var warn = $('#k-limit-warn');
    var over = 0, monthly = 0, note = '', sub = '', monthLab = '', lead = '';

    if (isSvaye) {
      setText('#k-term-lab', 'Срок кредита');
      setText('#k-first-hint', 'Взнос не обязателен. Сумма кредита — от 200 до 50 000 BYN.');
      if (rest > 0 && rest < 200) {
        warn.hidden = false;
        warn.innerHTML = 'Минимальная сумма кредита «На сваё» — <strong>200 BYN</strong>.';
      } else if (rest > 50000) {
        warn.hidden = false;
        warn.innerHTML = 'Под неустойку можно взять до <strong>50 000 BYN</strong>. Сумму сверх лимита внесите первым взносом или оформите с поручительством.';
      } else warn.hidden = true;

      var cr = IZYUM.calcSvaye(rest, state.term, 'online');
      over = cr.over;
      if (state.term <= 12) {
        monthly = cr.monthly;
        monthLab = 'Платёж в месяц · 4% годовых';
        note = 'Минимум — ~' + fmt(cr.graceInterestOnly) + ' BYN/мес, если платить только проценты';
        sub = 'Долг гасится равными долями за 12 месяцев, весь срок действует ставка 4% годовых: 1-й платёж ~' + fmt(cr.firstMonth) + ' BYN, 12-й ~' + fmt(cr.lastMonth) + ' BYN. По договору можно взять отсрочку основного долга — тогда в первый год платятся только проценты (~' + fmt(cr.graceInterestOnly) + ' BYN/мес). Досрочное погашение — без комиссий.';
        setText('#r-term', '12 мес · 4%');
        setText('#r-over-label', 'Проценты (4%)');
      } else {
        monthly = cr.graceMonthly;
        monthLab = 'Платёж в первые 12 месяцев';
        note = 'С 13-го месяца — ~' + fmt(cr.afterMonthly) + ' BYN/мес (12% онлайн)';
        sub = 'Первые 12 месяцев (4% годовых): ~' + fmt(cr.graceMonthly) + ' BYN/мес при равномерном погашении долга или ~' + fmt(cr.graceInterestOnly) + ' BYN/мес, если платить только проценты (отсрочка основного долга). С 13-го месяца ставка — СР НБ РБ + 2,75 п.п. = 12% при оформлении онлайн (12,25% в отделении): ~' + fmt(cr.afterMonthly) + ' BYN/мес, а после полной отсрочки — ~' + fmt(cr.afterMonthlyDefer) + ' BYN/мес. Средний платёж за весь срок — ~' + fmt(cr.monthly) + ' BYN. Досрочное погашение — без комиссий.';
        setText('#r-term', state.term + ' мес · 4% → 12%');
        setText('#r-over-label', 'Проценты за срок');
      }
      setText('#r-prog', 'Кредит «На сваё»');
      setText('#r-loan-label', 'Сумма в кредит');
      lead = 'Кредит «На сваё» 4%: ' + fmt(rest) + ' BYN на ' + state.term + ' мес (~' + fmt(monthly) + ' BYN/мес в 1-й год)';
    } else {
      setText('#k-term-lab', 'Срок рассрочки');
      setText('#k-first-hint', 'Без переплаты: остаток делится на равные платежи.');
      warn.hidden = true;
      var p = curProgram();
      var termObj = ((p && p.terms) || C.terms).find(function (t) { return t.months === state.term; }) || C.terms[0];
      over = Math.round(rest * (termObj.over || 0));
      monthly = state.term > 0 ? Math.ceil((rest + over) / state.term) : 0;
      monthLab = 'Платёж в месяц · 0%';
      note = state.term + ' равных платежа, без переплаты';
      sub = 'Внутренняя рассрочка салона на 3 или 4 месяца без удорожания мебели. Остаток ' + fmt(rest) + ' BYN делится на ' + state.term + ' равных ежемесячных платежа.';
      setText('#r-prog', 'Рассрочка 0%');
      setText('#r-term', state.term + ' мес · 0%');
      setText('#r-loan-label', 'В рассрочку');
      setText('#r-over-label', 'Переплата');
      lead = 'Рассрочка 0%: ' + fmt(rest) + ' BYN на ' + state.term + ' мес (~' + fmt(monthly) + ' BYN/мес)';
    }

    if (rest <= 0) { note = 'Первый взнос покрывает всю сумму'; }
    setText('#r-month-label', monthLab);
    setText('#r-month-note', note);
    setText('#r-month-sub', sub);
    setText('#d-lab', monthLab);
    lead = (state.modelName ? state.modelName + ' · ' : '') + lead;
    $('#r-lead-btn').setAttribute('data-lead', lead);
    $('#d-lead').setAttribute('data-lead', lead);

    setNum('#r-month', monthly);
    setNum('#d-month', monthly);
    setNum('#r-loan', rest);
    setNum('#r-first', firstSum);
    setNum('#r-over', over);
    setNum('#r-total', S + over);

    [[progBox, state.prog], [termBox, state.term]].forEach(function (pair) {
      $$('button', pair[0]).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === String(pair[1]))); });
    });
  }

  [sum, first].forEach(function (el) { el.addEventListener('input', calc); });
  calc();

  /* ---------- мобильная плашка: видна, пока карточка результата за экраном ---------- */
  var resultVisible = true;
  function updateDock() {
    if (!dock) return;
    var on = !$('#pay').hidden && !resultVisible;
    dock.classList.toggle('on', on);
    dock.setAttribute('aria-hidden', String(!on));
  }
  if (dock && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      resultVisible = entries[0].isIntersecting;
      updateDock();
    }, { rootMargin: '0px 0px -120px 0px' }).observe($('#kc-result'));
  }
  if (dock) {
    $('.kc-dock-sum', dock).addEventListener('click', function (e) {
      e.preventDefault();
      $('#kc-result').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  }

  if (location.hash === '#door') showTab('door');

  /* ---------- «Пройдёт в дверь?» ---------- */
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

    $('.verdict').classList.toggle('no', !ok);
    $('[data-verdict]').textContent = ok ? 'Пройдёт, если нести на боку' : 'Целиком не пройдёт';
    $('[data-verdict-hint]').textContent = ok
      ? 'Запас ' + Math.min(W - bw, H - bh) + ' мм. Длина изделия не мешает: его заносят вдоль прохода.'
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
