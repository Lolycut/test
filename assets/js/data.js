/* ИЗЮМ — данные компании (ООО «АЛБРО»), каталога (Диваны, Кресла, Кровати) и прайс-коэффициенты. */

window.IZYUM = window.IZYUM || {};

IZYUM.SITE = {
  domain: 'https://izum-home.by',
  company: 'ООО «АЛБРО»',
  companyFull: 'Общество с ограниченной ответственностью «АЛБРО»',
  unp: '193731127',
  regDate: '21.12.2023',
  regAuth: 'Минский горисполком',
  legalAddress: '220113, Республика Беларусь, г. Минск, ул. Мележа, 1, пом. 434',
  address: 'Минск, пр-т Независимости, 154д',
  place: 'ТЦ «Корона Дом», павильон 120',
  instagram: 'https://www.instagram.com/izyum_home/',
  phone: '+375 (29) 670-97-84',
  phoneHref: 'tel:+375296709784',
  email: 'info@izum-home.by',
  hours: 'Ежедневно, 10:00–21:00 (ТЦ «Корона Дом»)',
  /* Серверный обработчик для отправки писем на доменную почту hoster.by и получения в K-9 Mail */
  leadEndpoint: 'api/lead.php'
};

IZYUM.CATEGORIES = [
  { id: 'all',       name: 'Все модели', kindLabel: 'ВСЕ' },
  { id: 'sofas',     name: 'Диваны',     kindLabel: 'ДИВАН' },
  { id: 'armchairs', name: 'Кресла',     kindLabel: 'КРЕСЛО' },
  { id: 'beds',      name: 'Кровати',    kindLabel: 'КРОВАТЬ' }
];

/* Каталог моделей:
   cat: 'sofas' | 'armchairs' | 'beds'
   shape: форма в SVG-конструкторе ('slim', 'puffy', 'block', 'chair', 'round', 'bed') */
IZYUM.MODELS = [
  /* ---------- ДИВАНЫ ---------- */
  {
    id: 'reflex', cat: 'sofas', kind: 'ДИВАН', name: 'Reflex', price: 4240,
    baseDim: '2400 × 980 мм', minLen: 1600, maxLen: 3200, defLen: 2400,
    shape: 'slim', legs: 'metal', img: 'assets/img/reflex.webp',
    note: 'Прямые подлокотники, тонкие металлические ножки и глубокая выверенная посадка.',
    tags: ['Раскладка', 'Любой размер', 'Высокие ножки'], sleeper: true
  },
  {
    id: 'krisby', cat: 'sofas', kind: 'ДИВАН', name: 'Krisby', price: 3960,
    baseDim: '2400 × 950 мм', minLen: 1600, maxLen: 3200, defLen: 2400,
    shape: 'slim', legs: 'metal', img: 'assets/img/krisby.webp',
    note: 'Лёгкий силуэт на высоких ножках — удобно для робота-пылесоса. На фото в экокоже.',
    tags: ['Под робот-пылесос', 'Раскладка', 'Экокожа / Ткань'], sleeper: true, tall: true
  },
  {
    id: 'ff', cat: 'sofas', kind: 'ДИВАН', name: 'FF', price: 3820,
    baseDim: '2400 × 1050 мм', minLen: 1800, maxLen: 3400, defLen: 2400,
    shape: 'block', legs: 'hidden', img: 'assets/img/ff.webp',
    note: 'Модульный угловой диван без видимых ножек, глубокие мягкие блоки для лаунж-зоны.',
    tags: ['Модульный', 'Угловые схемы', 'Глубокая посадка'], chaise: true
  },
  {
    id: 'cloud', cat: 'sofas', kind: 'ДИВАН', name: 'Cloud', price: 3920,
    baseDim: '2400 × 1050 мм', minLen: 1600, maxLen: 3200, defLen: 2400,
    shape: 'puffy', legs: 'hidden', img: 'assets/img/cloud.webp',
    note: 'Объёмные подушки с пух-пером и скруглённые формы — обволакивающий комфорт как на облаке.',
    tags: ['Хит продаж', 'Мягкая посадка', 'Раскладка'], sleeper: true
  },
  {
    id: 'reverse', cat: 'sofas', kind: 'ДИВАН', name: 'Reverse', price: 5870,
    baseDim: '2400 × 1000 мм', minLen: 1800, maxLen: 3200, defLen: 2400,
    shape: 'puffy', legs: 'metal', img: 'assets/img/reverse.webp',
    note: 'Двусторонние подушки со свободными чехлами и декоративным кантом на тонкой опоре.',
    tags: ['Премиум-крой', 'Контрастный кант', 'Тонкая опора']
  },
  {
    id: 'fly', cat: 'sofas', kind: 'ДИВАН', name: 'Fly', price: 3820,
    baseDim: '2400 × 1050 мм', minLen: 1600, maxLen: 3200, defLen: 2400,
    shape: 'block', legs: 'hidden', img: 'assets/img/fly.webp',
    note: 'Модули с низкой посадкой и широкими подлокотниками, можно дополнить пуфом-оттоманкой.',
    tags: ['Модульная система', 'Пуф-оттоманка', 'Низкий профиль'], chaise: true
  },

  /* ---------- КРЕСЛА (новые модели по запросу) ---------- */
  {
    id: 'shon', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Shon', price: 1570,
    baseDim: '920 × 880 мм', minLen: 800, maxLen: 1150, defLen: 900,
    shape: 'chair', legs: 'hidden', img: 'assets/img/shon.webp',
    note: 'Камерное округлое кресло в фактурном букле с мягкой поясничной подушкой и плавной геометрией.',
    tags: ['Новинка', 'Фактурное букле', 'Поясничная подушка']
  },
  {
    id: 'lacoon', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Lacoon', price: 3200,
    baseDim: '1300 × 1300 мм', minLen: 1100, maxLen: 1500, defLen: 1300,
    shape: 'round', legs: 'brass', img: 'assets/img/lacoon.webp', contain: true,
    note: 'Глубокое круглое кресло-лавсит на поворотном латунном цоколе с комплектом подушек.',
    tags: ['Лавсит Ø 1300 мм', 'Поворотный цоколь', 'Комплект подушек']
  },
  {
    id: 'minotti', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Minotti', price: 1450,
    baseDim: '860 × 840 мм', minLen: 780, maxLen: 1050, defLen: 860,
    shape: 'chair', legs: 'metal', img: 'assets/img/minotti.webp',
    note: 'Элегантное кресло с веерной драпировкой спинки в коже, замше или велюре на тонких металлических ножках.',
    tags: ['Итальянский силуэт', 'Веерная драпировка', 'Кожа / Велюр'], tall: true
  },
  {
    id: 'cloud-chair', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Cloud', price: 2210,
    baseDim: '1080 × 1020 мм', minLen: 900, maxLen: 1250, defLen: 1080,
    shape: 'chair', legs: 'hidden', img: 'assets/img/cloud-armchair.webp',
    altImg: 'assets/img/cloud-armchair-velour.webp',
    variants: [
      { label: 'Белое букле', img: 'assets/img/cloud-armchair.webp' },
      { label: 'Песочный велюр', img: 'assets/img/cloud-armchair-velour.webp' }
    ],
    contain: true,
    note: 'Лаунж-кресло с объёмными подушками из коллекции Cloud. Доступно в букле, велюре и рогожке.',
    tags: ['Коллекция Cloud', '2 варианта на фото', 'Глубокий лаунж']
  },

  /* ---------- КРОВАТИ (новые модели по рендерам) ---------- */
  {
    id: 'tatlin', cat: 'beds', kind: 'КРОВАТЬ', name: 'Tatlin', price: 2890,
    baseDim: 'Спальное место 1600 × 2000 мм', minLen: 1400, maxLen: 2000, defLen: 1600,
    shape: 'bed', legs: 'hidden', img: 'assets/img/tatlin.webp',
    note: 'Мягкая двуспальная кровать с открытым швом-кантом и высоким изголовьем из двух подушек.',
    tags: ['Спальное место 140–200 см', 'Подъёмный механизм', 'Бельевой короб'], sleeper: true
  },
  {
    id: 'bonaldo', cat: 'beds', kind: 'КРОВАТЬ', name: 'Bonaldo Soft', price: 3150,
    baseDim: 'Спальное место 1600 × 2000 мм', minLen: 1400, maxLen: 2000, defLen: 1600,
    shape: 'bed', legs: 'hidden', img: 'assets/img/bonaldo.webp', contain: true,
    note: 'Кровать с широкими мягкими бортами-подушками по периметру и уютным высоким изголовьем со съёмными чехлами.',
    tags: ['Мягкие борта', 'Съёмные чехлы', 'Подъёмный механизм'], sleeper: true
  }
];

IZYUM.PRICING = {
  baseLength: 2400,
  minLength: 800,
  maxLength: 3200,
  stepLength: 100,
  perStep: 0.035,

  depths: [
    { mm: 950,  k: 0,    label: '950' },
    { mm: 1050, k: 0.05, label: '1050' },
    { mm: 1150, k: 0.09, label: '1150' }
  ],

  fabrics: [
    { id: 'velour', name: 'Велюр',   k: 0,    colors: [
      ['Молоко', '#E8E0D2'], ['Карамель', '#A57A52'], ['Олива', '#6B6B45'], ['Петроль', '#1F5260'], ['Графит', '#4A4A4A'] ] },
    { id: 'matting', name: 'Рогожка', k: 0.04, colors: [
      ['Лён', '#D8CDBB'], ['Песок', '#C2AE8E'], ['Мох', '#5E6648'], ['Серый', '#8D8A85'] ] },
    { id: 'boucle', name: 'Букле',    k: 0.10, colors: [
      ['Облако', '#EEE9E0'], ['Овсянка', '#D9CCB4'], ['Шалфей', '#A6A98F'] ] },
    { id: 'eco',    name: 'Экокожа',  k: 0.14, colors: [
      ['Тауп', '#7E6E5E'], ['Шоколад', '#4B3628'], ['Уголь', '#2F2C2A'] ] },
    { id: 'leather', name: 'Кожа',    k: 0.38, colors: [
      ['Коньяк', '#8A5A36'], ['Тауп', '#6E5D4B'], ['Графит', '#3C3A38'] ] }
  ],

  fills: [
    { id: 'ppu',    name: 'ППУ High Resilience (HR)', hint: 'держит форму, анатомическая поддержка', k: 0 },
    { id: 'spring', name: 'ППУ + независимый пружинный блок', hint: 'упругая посадка и ежедневный сон', k: 0.07 },
    { id: 'down',   name: 'ППУ + натуральный пух-перо', hint: 'максимально мягкая обволакивающая посадка', k: 0.12 }
  ],

  legs: [
    { id: 'metal',  name: 'Металл',  add: 0 },
    { id: 'oak',    name: 'Дуб',     add: 120 },
    { id: 'brass',  name: 'Латунь',  add: 190 },
    { id: 'hidden', name: 'Скрытые', add: 0 }
  ],

  extras: {
    sleeper: { name: 'Механизм раскладки / подъёма', add: 520 },
    box:     { name: 'Ящик для белья',               add: 260 },
    pillow:  { name: 'Декоративная подушка',         add: 70, max: 4 }
  }
};

IZYUM.CALC = {
  terms: [
    { months: 3,  over: 0 },
    { months: 6,  over: 0 },
    { months: 12, over: 0.08 },
    { months: 24, over: 0.16 }
  ],
  delivery: [
    { id: 'minsk',  name: 'Минск',               price: 40 },
    { id: 'region', name: 'До 30 км от МКАД',     price: 70 },
    { id: 'by',     name: 'По Беларуси',          price: 150 }
  ],
  liftFlat: 20,
  stairsPerFloor: 8
};

IZYUM.priceOf = function (cfg) {
  var P = IZYUM.PRICING;
  var m = IZYUM.MODELS.find(function (x) { return x.id === cfg.model; }) || IZYUM.MODELS[0];
  var fabric = P.fabrics.find(function (f) { return f.id === cfg.fabric; }) || P.fabrics[0];
  var fill = P.fills.find(function (f) { return f.id === cfg.fill; }) || P.fills[0];
  var depth = P.depths.find(function (d) { return d.mm === +cfg.depth; }) || P.depths[0];
  var legs = P.legs.find(function (l) { return l.id === cfg.legs; }) || P.legs[0];

  var refLen = m.defLen || P.baseLength;
  var lenK = Math.max(0.75, 1 + ((cfg.length - refLen) / P.stepLength) * P.perStep);
  var lines = [];
  var base = m.price;
  var sized = Math.round(base * lenK);
  var dimLabel = m.cat === 'beds' ? ('спальное место ' + cfg.length + ' мм') : (cfg.length + ' мм');
  lines.push([m.kind.charAt(0) + m.kind.slice(1).toLowerCase() + ' ' + m.name + ', ' + dimLabel, sized]);

  var add = function (label, v) { v = Math.round(v); if (v) lines.push([label, v]); return v; };
  var total = sized;
  if (m.cat !== 'beds') {
    total += add('Глубина ' + depth.mm + ' мм', sized * depth.k);
  }
  total += add('Ткань: ' + fabric.name, sized * fabric.k);
  total += add('Наполнение: ' + fill.name, sized * fill.k);
  total += add('Опора: ' + legs.name.toLowerCase(), legs.add);
  if (cfg.sleeper && m.sleeper) total += add(m.cat === 'beds' ? 'Подъёмный механизм' : P.extras.sleeper.name, P.extras.sleeper.add);
  if (cfg.box) total += add(P.extras.box.name, P.extras.box.add);
  if (cfg.pillows) total += add('Подушки × ' + cfg.pillows, cfg.pillows * P.extras.pillow.add);

  return { total: Math.round(total / 10) * 10, lines: lines, model: m, fabric: fabric };
};

IZYUM.fmt = function (n) {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
};

IZYUM.store = {
  get: function (k, d) { try { var v = localStorage.getItem('izyum_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('izyum_' + k, JSON.stringify(v)); } catch (e) {} }
};
