/* ИЗЮМ — общий скрипт: тёмная тема, меню, нижняя навигация, куки-баннер (99-З), форма заявки (под K-9 Mail / hoster.by), PWA. */
(function () {
  var doc = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- ТЁМНАЯ / СВЕТЛАЯ ТЕМА ---------- */
  function getPreferredTheme() {
    var saved = IZYUM.store.get('theme', null);
    if (saved === 'dark' || saved === 'light') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  function applyTheme(theme, save) {
    doc.setAttribute('data-theme', theme);
    var metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#141210' : '#095562');
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
      btn.setAttribute('title', theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    });
    if (save) IZYUM.store.set('theme', theme);
  }
  applyTheme(getPreferredTheme(), false);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    if (window.izyumToast) window.izyumToast(next === 'dark' ? 'Тёмная тема включена' : 'Светлая тема включена');
  });

  /* ---------- три точки → крестик ---------- */
  var dots = $('.dots');
  var menu = $('#menu');
  function setMenu(open) {
    if (!dots || !menu) return;
    doc.classList.toggle('menu-open', open);
    dots.setAttribute('aria-expanded', String(open));
    dots.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) setTimeout(function () { var a = $('nav a', menu); a && a.focus({ preventScroll: true }); }, 350);
  }
  if (dots) dots.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });

  /* ---------- нижняя навигация ---------- */
  var bar = $('.tabbar');
  if (bar) {
    var links = $$('a', bar);
    var cur = links.findIndex(function (a) { return a.getAttribute('aria-current') === 'page'; });
    var prev = null;
    try { prev = parseInt(sessionStorage.getItem('izyum_tab'), 10); } catch (e) {}
    if (cur < 0) { bar.style.setProperty('--i', 0); bar.classList.add('no-tab'); }
    else {
      if (prev !== null && !isNaN(prev) && prev !== cur && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bar.classList.add('no-anim');
        bar.style.setProperty('--i', prev);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.classList.remove('no-anim'); bar.style.setProperty('--i', cur); });
        });
      } else bar.style.setProperty('--i', cur);
      try { sessionStorage.setItem('izyum_tab', cur); } catch (e) {}
    }
    links.forEach(function (a, i) {
      a.addEventListener('click', function () {
        if (i === cur) return;
        bar.style.setProperty('--i', i);
      });
    });
  }

  /* ---------- тост ---------- */
  var toastEl;
  window.izyumToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2800);
  };

  /* ---------- маска телефона +375 (XX) XXX-XX-XX ---------- */
  function maskPhone(input) {
    if (!input) return;
    function format() {
      var d = input.value.replace(/\D/g, '');
      if (d.indexOf('375') === 0) d = d.slice(3);
      else if (d.indexOf('80') === 0) d = d.slice(2);
      d = d.slice(0, 9);
      var out = '+375';
      if (d.length) out += ' (' + d.slice(0, 2);
      if (d.length > 2) out += ') ' + d.slice(2, 5);
      if (d.length > 5) out += '-' + d.slice(5, 7);
      if (d.length > 7) out += '-' + d.slice(7, 9);
      input.value = out;
      input.classList.remove('bad');
      return d;
    }
    input.addEventListener('focus', function () { if (!input.value) input.value = '+375 ('; });
    input.addEventListener('blur', function () { if (input.value.replace(/\D/g, '').length <= 3) input.value = ''; });
    input.addEventListener('input', format);
    input.digits = function () {
      var d = input.value.replace(/\D/g, '');
      if (d.indexOf('375') === 0) return d.slice(3);
      if (d.indexOf('80') === 0) return d.slice(2);
      return d;
    };
  }
  window.izyumMaskPhone = maskPhone;

  /* ---------- отправка заявки на доменную почту (api/lead.php -> K-9 Mail) ---------- */
  function sendLead(data) {
    var leads = IZYUM.store.get('leads', []);
    data.at = new Date().toISOString();
    data.page = location.pathname;
    data.consentLaw99Z = true;
    leads.push(data);
    IZYUM.store.set('leads', leads);

    var url = IZYUM.SITE.leadEndpoint;
    if (!url || location.protocol === 'file:') {
      return Promise.resolve({ ok: true, mode: 'local' });
    }
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json().catch(function () { return { ok: true }; });
    }).catch(function () {
      // При тестировании на статическом превью без PHP сохраняем локально
      return { ok: true, mode: 'local_fallback' };
    });
  }

  function bindForm(form, opts) {
    if (!form) return;
    var phone = $('input[name="phone"]', form);
    var agree = $('input[name="agree"]', form);
    var consentBox = $('.consent-box', form);
    maskPhone(phone);
    var err = $('.err', form);

    if (agree) {
      agree.addEventListener('change', function () {
        if (consentBox) consentBox.classList.remove('bad');
        if (err && err.textContent.indexOf('согласие') > -1) err.textContent = '';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = $('input[name="website_hp"]', form);
      if (hp && hp.value) return; // антиспам-ловушка

      var digits = phone ? phone.digits() : '';
      var codes = ['17', '25', '29', '33', '44'];
      var msg = '';
      var phoneBad = false;
      var agreeBad = false;

      if (digits.length !== 9) {
        msg = 'Введите белорусский номер полностью: +375 (XX) XXX-XX-XX.';
        phoneBad = true;
      } else if (codes.indexOf(digits.slice(0, 2)) < 0) {
        msg = 'Проверьте код оператора РБ: 25, 29, 33, 44 или 17.';
        phoneBad = true;
      } else if (!agree || !agree.checked) {
        msg = 'Отметьте галочкой ознакомление с Политикой и согласие на обработку данных (Закон РБ № 99-З).';
        agreeBad = true;
      }

      if (phone) phone.classList.toggle('bad', phoneBad);
      if (consentBox) consentBox.classList.toggle('bad', agreeBad);
      if (err) err.textContent = msg;
      if (msg) return;

      var btn = $('button[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }
      var val = function (n) { var el = $('[name="' + n + '"]', form); return el ? el.value.trim() : ''; };
      var data = {
        name: val('name'),
        phone: '+375' + digits,
        phoneFormatted: phone ? phone.value : ('+375' + digits),
        comment: val('comment'),
        model: form.dataset.leadModel || '',
        config: form.dataset.withConfig ? IZYUM.store.get('config', null) : null
      };
      sendLead(data).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Отправить заявку'; }
        form.reset();
        if (agree) agree.checked = false; // чекбокс остаётся неотмеченным по умолчанию согласно ст. 5 Закона № 99-З
        opts && opts.onDone ? opts.onDone(data) : window.izyumToast('Заявка принята! Перезвоним вам с номера +375 (29) 670-97-84.');
      });
    });
  }
  window.izyumBindForm = bindForm;

  /* ---------- нижний лист «Оставить заявку» ---------- */
  var sheetHTML =
    '<div class="sheet-backdrop" data-close></div>' +
    '<section class="sheet" id="lead" role="dialog" aria-modal="true" aria-labelledby="lead-title" aria-hidden="true">' +
    '<div class="grab"></div>' +
    '<button class="round x" type="button" data-close aria-label="Закрыть"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<div class="sheet-intro"><h2 id="lead-title">Оставить заявку</h2>' +
    '<p class="muted">Перезвоним с номера <a class="link" href="tel:+375296709784">+375 (29) 670-97-84</a>, ответим на вопросы и поможем с выбором ткани и размеров.</p></div>' +
    '<form class="lead-form" novalidate>' +
    '<input type="text" name="website_hp" class="hp-field" tabindex="-1" autocomplete="off">' +
    '<div class="cfg-summary" hidden></div>' +
    '<div class="field"><label for="l-name">Ваше имя</label><input class="input" id="l-name" name="name" autocomplete="given-name" placeholder="Как к вам обращаться"></div>' +
    '<div class="field"><label for="l-phone">Номер телефона *</label><input class="input" id="l-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+375 (29) 123-45-67" required></div>' +
    '<div class="field"><label for="l-com">Комментарий или модель</label><textarea class="input" id="l-com" name="comment" placeholder="Например: интересует кресло Shon в светлом букле или диван 2,6 м"></textarea></div>' +
    '<div class="consent-box">' +
      '<label class="check"><input type="checkbox" name="agree" required>' +
      '<span>Я ознакомлен(а) с <a class="link" href="privacy.html">Политикой обработки персональных данных</a> и даю согласие ООО «АЛБРО» (УНП 193731127) на обработку моего номера телефона и имени для обратной связи.</span></label>' +
      '<p class="consent-note">Обработка ведётся внутри РБ согласно Закону № 99-З (срок хранения — 1 год либо до отзыва согласия).</p>' +
    '</div>' +
    '<p class="err" role="alert"></p>' +
    '<button class="btn block" type="submit">Отправить заявку</button>' +
    '</form>' +
    '<div class="done"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38"/><path d="M26 43l11 11 21-23"/></svg>' +
    '<h2>Заявка отправлена</h2><p class="muted">Спасибо! Обращение передано менеджеру салона «ИЗЮМ» на доменную почту. Мы свяжемся с вами в рабочее время.</p>' +
    '<button class="btn ghost" type="button" data-close>Хорошо</button></div>' +
    '</section>';
  document.body.insertAdjacentHTML('beforeend', sheetHTML);
  var sheet = $('#lead');
  var leadForm = $('.lead-form', sheet);
  var lastFocus;

  function openSheet(modeOrModel) {
    lastFocus = document.activeElement;
    sheet.classList.remove('sent');
    var sum = $('.cfg-summary', sheet);
    var com = $('#l-com', sheet);
    delete leadForm.dataset.withConfig;
    delete leadForm.dataset.leadModel;

    if (modeOrModel === 'config') {
      var cfg = IZYUM.store.get('config', null);
      if (cfg && cfg.summary) {
        sum.hidden = false;
        sum.textContent = cfg.summary;
        leadForm.dataset.withConfig = '1';
      } else {
        sum.hidden = true;
      }
    } else if (modeOrModel && modeOrModel !== '1' && modeOrModel !== 'true') {
      sum.hidden = false;
      sum.textContent = 'Модель: ' + modeOrModel;
      leadForm.dataset.leadModel = modeOrModel;
      if (com && !com.value) com.value = 'Интересует ' + modeOrModel + '. Подскажите по срокам и тканям.';
    } else {
      sum.hidden = true;
    }

    doc.classList.add('sheet-open');
    sheet.setAttribute('aria-hidden', 'false');
    setTimeout(function () { var p = $('#l-phone'); p && p.focus({ preventScroll: true }); }, 420);
  }
  function closeSheet() {
    doc.classList.remove('sheet-open');
    sheet.setAttribute('aria-hidden', 'true');
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  window.izyumLead = openSheet;
  bindForm(leadForm, { onDone: function () { sheet.classList.add('sent'); } });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lead]');
    if (t) {
      e.preventDefault();
      if (doc.classList.contains('menu-open')) setMenu(false);
      openSheet(t.dataset.lead || '');
      return;
    }
    if (e.target.closest('[data-close]')) closeSheet();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (doc.classList.contains('sheet-open')) closeSheet();
    else if (doc.classList.contains('menu-open')) setMenu(false);
  });

  /* свайп вниз закрывает лист */
  var y0 = null;
  sheet.addEventListener('touchstart', function (e) { if (sheet.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', function (e) {
    if (y0 === null) return;
    var dy = e.touches[0].clientY - y0;
    if (dy > 0) { sheet.style.transition = 'none'; sheet.style.transform = 'translate(-50%,' + dy + 'px)'; }
  }, { passive: true });
  sheet.addEventListener('touchend', function (e) {
    if (y0 === null) return;
    var dy = e.changedTouches[0].clientY - y0; y0 = null;
    sheet.style.transition = ''; sheet.style.transform = '';
    if (dy > 110) closeSheet();
  });

  /* инлайн-формы на страницах (контакты) */
  $$('form[data-inline-lead]').forEach(function (f) { bindForm(f); });

  /* ---------- БАННЕР COOKIE (Закон РБ № 99-З / НЦЗПД РБ) ---------- */
  var cookieHTML =
    '<aside class="cookie-bar" id="cookie-bar" role="region" aria-label="Уведомление об использовании файлов cookie">' +
      '<p class="cookie-bar-text">' +
        '<strong>Мы используем файлы cookie и локальное хранилище браузера.</strong> ' +
        'Технические файлы необходимы для работы сайта (сохранение выбранной темы, расчётов конструктора и статуса согласия). ' +
        'Функциональные файлы помогают делать сайт удобнее. Подробнее — в <a class="link" href="privacy.html#cookies">Политике обработки файлов cookie</a>.' +
      '</p>' +
      '<div class="cookie-settings-panel" id="cookie-settings">' +
        '<div class="cookie-row"><span><strong>Технические (обязательные)</strong> — тема оформления, конструктор, сессия</span><span class="muted small">Всегда активны</span></div>' +
        '<label class="cookie-row" style="cursor:pointer"><span><strong>Функциональные и аналитические</strong> — запоминание предпочтений каталога</span><input type="checkbox" id="ck-func" checked style="accent-color:var(--teal);width:18px;height:18px"></label>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn" data-cookie-act="all">Принять все</button>' +
        '<button type="button" class="cookie-btn" data-cookie-act="necessary">Только необходимые</button>' +
        '<button type="button" class="cookie-btn" data-cookie-act="toggle-settings">Настроить</button>' +
        '<button type="button" class="cookie-btn" data-cookie-act="save" hidden>Сохранить выбор</button>' +
      '</div>' +
    '</aside>';
  document.body.insertAdjacentHTML('beforeend', cookieHTML);

  var cookieBar = $('#cookie-bar');
  var btnSaveCookie = $('[data-cookie-act="save"]', cookieBar);
  var btnToggleCookie = $('[data-cookie-act="toggle-settings"]', cookieBar);

  function saveCookieChoice(functional) {
    var payload = {
      necessary: true,
      functional: !!functional,
      updatedAt: new Date().toISOString()
    };
    IZYUM.store.set('cookie_consent', payload);
    cookieBar.classList.remove('on', 'show-settings');
    window.izyumToast(functional ? 'Настройки cookie сохранены (все категории)' : 'Сохранены только технические cookie');
  }

  var existingCookie = IZYUM.store.get('cookie_consent', null);
  if (!existingCookie) {
    setTimeout(function () { cookieBar.classList.add('on'); }, 600);
  }

  cookieBar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cookie-act]');
    if (!b) return;
    var act = b.dataset.cookieAct;
    if (act === 'all') saveCookieChoice(true);
    else if (act === 'necessary') saveCookieChoice(false);
    else if (act === 'toggle-settings') {
      var open = cookieBar.classList.toggle('show-settings');
      btnSaveCookie.hidden = !open;
      btnToggleCookie.textContent = open ? 'Скрыть настройки' : 'Настроить';
    } else if (act === 'save') {
      var fn = $('#ck-func', cookieBar);
      saveCookieChoice(fn && fn.checked);
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-open]')) {
      e.preventDefault();
      var curC = IZYUM.store.get('cookie_consent', null);
      var fn = $('#ck-func', cookieBar);
      if (fn && curC) fn.checked = !!curC.functional;
      cookieBar.classList.add('on', 'show-settings');
      btnSaveCookie.hidden = false;
      btnToggleCookie.textContent = 'Скрыть настройки';
    }
  });

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var deferred;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e; doc.classList.add('can-install');
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-install]') || !deferred) return;
    deferred.prompt();
    deferred.userChoice.finally(function () { deferred = null; doc.classList.remove('can-install'); });
  });
  window.addEventListener('appinstalled', function () { window.izyumToast('ИЗЮМ добавлен на главный экран'); });
})();
