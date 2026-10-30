/* Каталог ИЗЮМ с категориями (Все, Диваны, Кровати, Кресла, Стулья), витриной, карточками и прайс-листом. */
(function () {
  var ALL = IZYUM.MODELS;
  var CATS = IZYUM.CATEGORIES;
  var PL = IZYUM.PRICELIST || [];
  var viewer = document.querySelector('.viewer');
  var strip = document.querySelector('.model-strip');
  var catTabsBox = document.querySelector('[data-cat-tabs]');
  var gridBox = document.querySelector('[data-cat-grid]');
  var plBox = document.querySelector('[data-pricelist-grid]');
  var varBox = document.querySelector('[data-viewer-variants]');
  if (!viewer || !strip) return;

  var params = new URLSearchParams(location.search);
  var activeCat = params.get('cat') || 'all';
  if (!CATS.some(function (c) { return c.id === activeCat; })) activeCat = 'all';

  var filtered = [];
  var imgs = [];
  var idx = 0;

  var el = {
    kind: document.querySelector('[data-kind]'),
    name: document.querySelector('[data-name]'),
    size: document.querySelector('[data-size]'),
    priceWrap: document.querySelector('.poster .price'),
    note: document.querySelector('[data-note]'),
    facts: document.querySelector('[data-facts]'),
    ask: document.querySelector('[data-ask-model]')
  };

  function fmtPrice(m) {
    if (m.price && m.price > 0) return 'от ' + IZYUM.fmt(m.price) + ' BYN';
    return m.priceText || 'под заказ';
  }

  function getFiltered(catId) {
    if (catId === 'all') return ALL.slice();
    return ALL.filter(function (m) { return m.cat === catId; });
  }

  function renderCatTabs() {
    if (!catTabsBox) return;
    catTabsBox.innerHTML = CATS.map(function (c) {
      var sel = c.id === activeCat;
      return '<button type="button" class="cat-tab' + (sel ? ' active' : '') + '" role="tab" aria-selected="' + sel + '" data-cat="' + c.id + '">' +
        '<span>' + c.name + '</span></button>';
    }).join('');
  }

  if (catTabsBox) {
    catTabsBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b || b.dataset.cat === activeCat) return;
      setCategory(b.dataset.cat);
    });
  }

  function renderGrid() {
    if (!gridBox) return;
    gridBox.innerHTML = filtered.map(function (m, i) {
      var hasVar = m.variants && m.variants.length > 1;
      var varBtns = hasVar ? (
        '<div class="cat-card-var">' +
        m.variants.map(function (v, vi) {
          return '<button type="button" class="' + (vi === 0 ? 'on' : '') + '" data-card-var="' + m.id + '" data-img="' + v.img + '">' + v.label + '</button>';
        }).join('') +
        '</div>'
      ) : '';
      var tagsHtml = (m.tags || []).map(function (t) { return '<span class="cat-card-tag">' + t + '</span>'; }).join('');
      var pText = fmtPrice(m);
      var leadTitle = m.kind.charAt(0) + m.kind.slice(1).toLowerCase() + ' ' + m.name + ' (' + pText + ')';
      return '<article class="cat-card" data-model-card="' + m.id + '">' +
        '<div class="cat-card-media" data-focus-idx="' + i + '" title="Показать на большой витрине">' +
          '<img src="' + m.img + '" alt="' + m.kind + ' ' + m.name + '" loading="lazy" class="' + (m.contain ? 'contain-mode' : '') + '">' +
          '<span class="cat-card-badge">' + m.kind + '</span>' +
          varBtns +
        '</div>' +
        '<div class="cat-card-body">' +
          '<div class="cat-card-top">' +
            '<h3 class="cat-card-title">' + m.name + '</h3>' +
            '<span class="cat-card-price num">' + pText + '</span>' +
          '</div>' +
          '<span class="cat-card-dim">База: ' + (m.baseDim || 'индивидуально') + '</span>' +
          '<p class="cat-card-desc">' + m.note + '</p>' +
          '<div class="cat-card-tags">' + tagsHtml + '</div>' +
          '<div class="cat-card-actions">' +
            '<button class="btn sm block" type="button" data-lead="' + leadTitle + '">Рассчитать в моей ткани</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* 2-строчная карточка прайс-листа: название и цена сверху, размер и кнопка снизу без узких переносов */
  function renderPricelist() {
    if (!plBox) return;
    var items = activeCat === 'all' ? PL : PL.filter(function (x) { return x.cat === activeCat; });
    plBox.innerHTML = items.map(function (item) {
      var pStr = (item.price && item.price > 0) ? ('от ' + IZYUM.fmt(item.price) + ' BYN') : (item.priceText || 'под заказ');
      var leadTitle = item.kind + ' ' + item.name + ' (' + item.dim + ', ' + pStr + ')';
      return '<div class="pricelist-row">' +
        '<div class="pricelist-top">' +
          '<strong>' + item.name + '</strong>' +
          '<span class="pl-price num">' + pStr + '</span>' +
        '</div>' +
        '<div class="pricelist-btm">' +
          '<span class="pl-sub">' + item.kind + ' · ' + item.dim + '</span>' +
          '<button type="button" class="btn ghost sm" data-lead="' + leadTitle + '">Заказать</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  if (gridBox) {
    gridBox.addEventListener('click', function (e) {
      var vb = e.target.closest('[data-card-var]');
      if (vb) {
        e.stopPropagation();
        var card = vb.closest('.cat-card');
        var img = card.querySelector('.cat-card-media img');
        if (img && vb.dataset.img) img.src = vb.dataset.img;
        Array.prototype.forEach.call(vb.parentNode.children, function (btn) {
          btn.classList.toggle('on', btn === vb);
        });
        return;
      }
      var media = e.target.closest('[data-focus-idx]');
      if (media) {
        var targetIdx = +media.dataset.focusIdx;
        go(targetIdx);
        viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function rebuildViewer(startModelId) {
    filtered = getFiltered(activeCat);
    imgs.forEach(function (im) { if (im.parentNode === viewer) viewer.removeChild(im); });
    imgs = [];
    strip.innerHTML = '';

    idx = 0;
    if (startModelId) {
      var found = filtered.findIndex(function (m) { return m.id === startModelId; });
      if (found > -1) idx = found;
    }

    filtered.forEach(function (m, i) {
      var img = new Image();
      img.src = m.img;
      img.alt = m.kind + ' ' + m.name + ' — ИЗЮМ';
      img.decoding = 'async';
      if (m.contain) img.classList.add('contain-mode');
      if (i !== idx) {
        img.classList.add('out');
        img.loading = 'lazy';
        img.setAttribute('aria-hidden', 'true');
      }
      viewer.insertBefore(img, viewer.firstChild);
      imgs.push(img);

      var b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = m.name;
      b.setAttribute('aria-pressed', String(i === idx));
      b.addEventListener('click', function () { go(i); });
      strip.appendChild(b);
    });

    fill(filtered[idx], idx);
    renderCatTabs();
    renderGrid();
    renderPricelist();
  }

  function fill(m) {
    if (!m) return;
    if (el.kind) el.kind.textContent = m.kind;
    if (el.name) el.name.textContent = m.name;
    if (el.size) el.size.textContent = m.baseDim || '2400 мм';
    if (el.priceWrap) {
      if (m.price && m.price > 0) {
        el.priceWrap.innerHTML = '<small>от</small><span data-price class="num">' + IZYUM.fmt(m.price) + '</span> BYN';
      } else {
        el.priceWrap.innerHTML = '<span data-price>' + (m.priceText || 'под заказ') + '</span>';
      }
    }
    if (el.note) el.note.textContent = m.note;

    var f = m.tags ? m.tags.slice() : ['Индивидуальный размер', 'Выбор ткани с дизайнером'];
    if (el.facts) el.facts.innerHTML = f.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    if (el.ask) {
      var pText = fmtPrice(m);
      var leadTitle = m.kind.charAt(0) + m.kind.slice(1).toLowerCase() + ' ' + m.name + ' (' + pText + ')';
      el.ask.setAttribute('data-lead', leadTitle);
    }

    if (varBox) {
      if (m.variants && m.variants.length > 1) {
        varBox.hidden = false;
        varBox.innerHTML = m.variants.map(function (v, vi) {
          return '<button type="button" class="' + (vi === 0 ? 'on' : '') + '" data-v-img="' + v.img + '">' + v.label + '</button>';
        }).join('');
      } else {
        varBox.hidden = true;
        varBox.innerHTML = '';
      }
    }
  }

  if (varBox) {
    varBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v-img]');
      if (!b || !imgs[idx]) return;
      imgs[idx].src = b.dataset.vImg;
      Array.prototype.forEach.call(varBox.children, function (btn) {
        btn.classList.toggle('on', btn === b);
      });
    });
  }

  function go(i) {
    if (!filtered.length) return;
    i = (i + filtered.length) % filtered.length;
    if (i === idx) return;
    imgs[idx].classList.add('out');
    imgs[idx].setAttribute('aria-hidden', 'true');
    imgs[i].classList.remove('out');
    imgs[i].removeAttribute('aria-hidden');

    var chips = strip.children;
    if (chips[idx]) chips[idx].setAttribute('aria-pressed', 'false');
    if (chips[i]) {
      chips[i].setAttribute('aria-pressed', 'true');
      chips[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
    idx = i;
    viewer.classList.add('swapping');
    setTimeout(function () { fill(filtered[i], i); viewer.classList.remove('swapping'); }, 220);
    imgs[(i + 1) % filtered.length].loading = 'eager';
  }

  function setCategory(catId, startModelId) {
    activeCat = catId;
    rebuildViewer(startModelId);
    var u = new URLSearchParams(location.search);
    if (catId === 'all') u.delete('cat'); else u.set('cat', catId);
    var qs = u.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  var qModel = params.get('model') || (location.hash ? location.hash.slice(1) : '');
  if (qModel) {
    var targetM = ALL.find(function (m) { return m.id === qModel; });
    if (targetM && activeCat !== 'all' && targetM.cat !== activeCat) {
      activeCat = targetM.cat;
    }
  }
  rebuildViewer(qModel);

  document.querySelector('[data-prev]').addEventListener('click', function () { go(idx - 1); });
  document.querySelector('[data-next]').addEventListener('click', function () { go(idx + 1); });
  document.addEventListener('keydown', function (e) {
    if (document.documentElement.classList.contains('sheet-open')) return;
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft') go(idx - 1);
  });

  var x0 = null, t0 = 0;
  viewer.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; t0 = Date.now(); }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50 && Date.now() - t0 < 600) go(idx + (dx < 0 ? 1 : -1));
  });
})();
