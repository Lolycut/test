/* ИЗЮМ — данные компании (ООО «АЛБРО»), каталога (Диваны, Кровати, Кресла, Стулья), прайс-листа и раздела «Наши работы». */

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
  leadEndpoint: 'api/lead.php',
  gaMeasurementId: ''
};

IZYUM.CATEGORIES = [
  { id: 'all',       name: 'Все категории', kindLabel: 'ВСЕ' },
  { id: 'sofas',     name: 'Диваны',        kindLabel: 'ДИВАН' },
  { id: 'beds',      name: 'Кровати',       kindLabel: 'КРОВАТЬ' },
  { id: 'armchairs', name: 'Кресла',        kindLabel: 'КРЕСЛО' },
  { id: 'chairs',    name: 'Стулья',        kindLabel: 'СТУЛ' }
];

/* Модели с интерьерными рендерами для витрины и карточек каталога.
   pos — точка кадрирования (object-position) для вертикальных интерьерных рендеров;
   у варианта можно задать свои contain / pos. */
IZYUM.MODELS = [
  /* ---------- ДИВАНЫ (база 2400 мм) ---------- */
  {
    id: 'noah', cat: 'sofas', kind: 'ДИВАН', name: 'Noah', price: 3400,
    baseDim: '2400 мм', img: 'assets/img/work-noah.webp',
    note: 'Уютный модульный и прямой диван с мягкими подушками спинки и глубокой посадкой.',
    tags: ['2400 мм в базе', 'Прямой / Угловой', 'Индивидуальный размер']
  },
  {
    id: 'lema', cat: 'sofas', kind: 'ДИВАН', name: 'Lema', price: 3560,
    baseDim: '2400 мм', img: 'assets/img/work-lema.webp',
    altImg: 'assets/img/work-lema-corner.webp',
    variants: [
      { label: 'Прямой', img: 'assets/img/work-lema.webp' },
      { label: 'Угловой с шезлонгом', img: 'assets/img/work-lema-corner.webp' }
    ],
    note: 'Элегантный диван на высоких тонких опорах — доступен в прямой и угловой конфигурации.',
    tags: ['2400 мм в базе', 'Под робот-пылесос', 'Прямой и угловой']
  },
  {
    id: 'ff', cat: 'sofas', kind: 'ДИВАН', name: 'FF', price: 3820,
    baseDim: '2400 мм', img: 'assets/img/ff.webp',
    note: 'Модульный диван без видимых ножек, глубокие мягкие блоки для современной гостиной.',
    tags: ['2400 мм в базе', 'Модульный', 'Угловые схемы']
  },
  {
    id: 'fly', cat: 'sofas', kind: 'ДИВАН', name: 'Fly', price: 3820,
    baseDim: '2400 мм', img: 'assets/img/fly.webp',
    note: 'Модульная система с низкой посадкой и широкими подлокотниками, можно дополнить пуфом.',
    tags: ['2400 мм в базе', 'Модульная система', 'Низкий профиль']
  },
  {
    id: 'cloud', cat: 'sofas', kind: 'ДИВАН', name: 'Cloud (Диван)', price: 3920,
    baseDim: '2400 мм', img: 'assets/img/cloud.webp',
    note: 'Объёмные подушки и мягкие скруглённые формы — обволакивающий комфорт как на облаке.',
    tags: ['2400 мм в базе', 'Мягкая посадка', 'Механизм раскладки']
  },
  {
    id: 'krisby', cat: 'sofas', kind: 'ДИВАН', name: 'Krisby', price: 3960,
    baseDim: '2400 мм', img: 'assets/img/krisby.webp',
    note: 'Лёгкий силуэт на высоких ножках. Исполняется в велюре, букле, рогожке или экокоже.',
    tags: ['2400 мм в базе', 'Высокие ножки', 'Раскладка']
  },
  {
    id: 'reflex', cat: 'sofas', kind: 'ДИВАН', name: 'Reflex', price: 4240,
    baseDim: '2400 мм', img: 'assets/img/reflex.webp',
    note: 'Прямые подлокотники, тонкие металлические ножки и глубокая выверенная посадка.',
    tags: ['2400 мм в базе', 'Механизм раскладки', 'Любой размер']
  },
  {
    id: 'tatlin-sofa', cat: 'sofas', kind: 'ДИВАН', name: 'Tatlin (Диван)', price: 4480,
    baseDim: '2400 мм', img: 'assets/img/work-tatlin-modular.webp',
    altImg: 'assets/img/work-tatlin-green.webp',
    variants: [
      { label: 'Модульный П-образный', img: 'assets/img/work-tatlin-modular.webp' },
      { label: 'Прямой с тик-так', img: 'assets/img/work-tatlin-green.webp' }
    ],
    note: 'Фактурная драпировка и выразительный кант. Доступен с механизмом раскладки «тик-так» или в модульной сборке.',
    tags: ['2400 мм в базе', 'Механизм тик-так', 'Модульные секции']
  },
  {
    id: 'reverse', cat: 'sofas', kind: 'ДИВАН', name: 'Reverse', price: 5870,
    baseDim: '2400 мм', img: 'assets/img/reverse.webp',
    note: 'Двусторонние подушки со свободными чехлами и декоративным кантом на тонкой опоре.',
    tags: ['2400 мм в базе', 'Контрастный кант', 'Тонкая опора']
  },

  /* ---------- КРОВАТИ (спальное место 1600 × 2000 мм) ---------- */
  {
    id: 'alaska', cat: 'beds', kind: 'КРОВАТЬ', name: 'Alaska', price: 2410,
    baseDim: '1600 × 2000 мм', img: 'assets/img/bed-alaska.webp', pos: '50% 78%',
    note: 'Кровать с мягким изголовьем и объёмной мягкой царгой со скруглёнными углами.',
    tags: ['1600 × 2000 мм в базе', 'Мягкая царга', 'Индивидуальный размер']
  },
  {
    id: 'flow', cat: 'beds', kind: 'КРОВАТЬ', name: 'Flow', price: 2550,
    baseDim: '1600 × 2000 мм', img: 'assets/img/bed-flow.webp', pos: '50% 70%',
    note: 'Кровать со скруглённым мягким изголовьем-подушкой и спокойным лаконичным силуэтом.',
    tags: ['1600 × 2000 мм в базе', 'Скруглённое изголовье', 'Выбор ткани']
  },
  {
    id: 'grace', cat: 'beds', kind: 'КРОВАТЬ', name: 'Grace', price: 2550,
    baseDim: '1600 × 2000 мм', img: 'assets/img/bed-grace.webp', pos: '50% 72%',
    note: 'Лёгкая кровать с невысоким мягким изголовьем на тонких металлических опорах.',
    tags: ['1600 × 2000 мм в базе', 'Металлические опоры', 'Невысокое изголовье']
  },
  {
    id: 'tatlin', cat: 'beds', kind: 'КРОВАТЬ', name: 'Tatlin (Кровать)', price: 2700,
    baseDim: '1600 × 2000 мм', img: 'assets/img/tatlin.webp',
    note: 'Мягкая двуспальная кровать с открытым швом-кантом и высоким изголовьем из двух подушек.',
    tags: ['1600 × 2000 мм в базе', 'Подъёмный механизм', 'Бельевой короб']
  },
  {
    id: 'wave', cat: 'beds', kind: 'КРОВАТЬ', name: 'Wave', price: 3180,
    baseDim: '1600 × 2000 мм', img: 'assets/img/bed-wave-caramel.webp', pos: '50% 74%',
    variants: [
      { label: 'Карамель', img: 'assets/img/bed-wave-caramel.webp' },
      { label: 'Голубой', img: 'assets/img/bed-wave-blue.webp' },
      { label: 'Молочный', img: 'assets/img/bed-wave-milk.webp' }
    ],
    note: 'Кровать с волнообразным контуром мягкого изголовья — уместна и в классике, и в современном интерьере.',
    tags: ['1600 × 2000 мм в базе', 'Волнистое изголовье', '3 варианта на фото']
  },
  {
    id: 'cloud-bed', cat: 'beds', kind: 'КРОВАТЬ', name: 'Cloud (Кровать)', price: 3290,
    baseDim: '1600 × 2000 мм', img: 'assets/img/bed-cloud.webp', pos: '50% 62%',
    variants: [
      { label: 'Вид спереди', img: 'assets/img/bed-cloud.webp' },
      { label: 'В ракурсе', img: 'assets/img/bed-cloud-angle.webp', pos: '50% 55%' },
      { label: 'Фактура', img: 'assets/img/bed-cloud-detail.webp', pos: '50% 50%' }
    ],
    note: 'Кровать с широкими мягкими бортами-подушками по периметру и уютным высоким изголовьем со съёмными чехлами.',
    tags: ['1600 × 2000 мм в базе', 'Мягкие борта', 'Съёмные чехлы']
  },

  /* ---------- КРЕСЛА ---------- */
  {
    id: 'minotti', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Minotti', price: 1450,
    baseDim: '860 × 840 мм', img: 'assets/img/minotti.webp',
    note: 'Элегантное кресло с веерной драпировкой спинки в коже, замше или велюре на тонких металлических ножках.',
    tags: ['Веерная драпировка', 'Кожа / Замша / Велюр', 'Металлические ножки']
  },
  {
    id: 'shon', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Shon', price: 1570,
    baseDim: '920 × 880 мм', img: 'assets/img/shon.webp',
    note: 'Камерное округлое кресло в фактурном букле с мягкой поясничной подушкой и плавной геометрией.',
    tags: ['Фактурное букле', 'Поясничная подушка', 'Скрытая опора']
  },
  {
    id: 'cloud-chair', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Cloud (Кресло)', price: 2210,
    baseDim: '1080 × 1020 мм', img: 'assets/img/cloud-armchair-powder.webp', pos: '50% 76%',
    altImg: 'assets/img/cloud-armchair-mustard.webp',
    variants: [
      { label: 'Пудровый', img: 'assets/img/cloud-armchair-powder.webp', pos: '50% 76%' },
      { label: 'Горчичный', img: 'assets/img/cloud-armchair-mustard.webp', pos: '50% 90%' }
    ],
    note: 'Лаунж-кресло с объёмными подушками из коллекции Cloud. Доступно в букле, велюре и рогожке.',
    tags: ['Коллекция Cloud', '2 варианта на фото', 'Глубокий лаунж']
  },
  {
    id: 'lacoon', cat: 'armchairs', kind: 'КРЕСЛО', name: 'Lacoon', price: 3200,
    baseDim: 'Ø 1300 мм', img: 'assets/img/lacoon-beige.webp', pos: '50% 60%',
    variants: [
      { label: 'Бежевый', img: 'assets/img/lacoon-beige.webp', pos: '50% 60%' },
      { label: 'Белый', img: 'assets/img/lacoon-white.webp', pos: '50% 70%' },
      { label: 'Лиловый', img: 'assets/img/lacoon-lilac.webp', pos: '50% 85%' }
    ],
    note: 'Глубокое круглое кресло-лавсит на поворотном латунном цоколе с комплектом подушек.',
    tags: ['Лавсит Ø 1300 мм', 'Поворотный цоколь', 'Комплект подушек']
  },

  /* ---------- СТУЛЬЯ ---------- */
  {
    id: 'chair-romeo', cat: 'chairs', kind: 'СТУЛ', name: 'Romeo', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-romeo.webp',
    note: 'Обеденное полукресло с обволакивающей спинкой, изящным вырезом и мягкими подлокотниками.',
    tags: ['Мягкие подлокотники', 'Эргономичная спинка', 'Выбор цвета опор']
  },
  {
    id: 'chair-tallin', cat: 'chairs', kind: 'СТУЛ', name: 'Tallin', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-tallin.webp',
    note: 'Стильный стул с полукруглой спинкой и декоративным вырезом на опорах из натурального массива.',
    tags: ['Ножки из массива', 'Поясничный вырез', 'Велюр / Шенилл']
  },
  {
    id: 'chair-taupo', cat: 'chairs', kind: 'СТУЛ', name: 'Taupo', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-taupo.webp',
    note: 'Полукресло с глубокой мягкой чашей и выраженной боковой поддержкой для столовой или переговорной.',
    tags: ['Боковая поддержка', 'Мягкая чаша', 'Металл / Массив']
  },
  {
    id: 'chair-temby', cat: 'chairs', kind: 'СТУЛ', name: 'Temby', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-temby.webp',
    note: 'Классический современный стул с высокой анатомической спинкой и тёплыми деревянными ножками.',
    tags: ['Высокая спинка', 'Деревянные опоры', 'Лёгкая чистка']
  },
  {
    id: 'chair-tempe', cat: 'chairs', kind: 'СТУЛ', name: 'Tempe', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-tempe.webp',
    note: 'Компактный обеденный стул с округлой спинкой-ракушкой, который легко задвигается под любой стол.',
    tags: ['Компактный силуэт', 'Спинка-ракушка', 'Любая обивка']
  },
  {
    id: 'chair-vichy', cat: 'chairs', kind: 'СТУЛ', name: 'Vichy', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-vichy.webp',
    note: 'Уютное полукресло-бочонок в фактурном букле или велюре на деревянных конусных опорах.',
    tags: ['Фактурное букле', 'Форма полукресла', 'Натуральное дерево']
  },
  {
    id: 'chair-kona', cat: 'chairs', kind: 'СТУЛ', name: 'Kona', price: null, priceText: 'под заказ',
    baseDim: 'индивидуальный подбор ткани и опор', img: 'assets/img/chair-kona.webp',
    note: 'Элегантное полукресло с плавным переходом спинки в подлокотники и мягкой подушкой сиденья.',
    tags: ['С подлокотниками', 'Премиум-велюр', 'Опоры из массива']
  }
];

/* Полный прайс-лист всех моделей по категориям */
IZYUM.PRICELIST = [
  /* Диваны (2400 мм) */
  { cat: 'sofas', kind: 'Диван', name: 'Noah',           dim: '2400 мм', price: 3400 },
  { cat: 'sofas', kind: 'Диван', name: 'Lema',           dim: '2400 мм', price: 3560 },
  { cat: 'sofas', kind: 'Диван', name: 'Fly',            dim: '2400 мм', price: 3820 },
  { cat: 'sofas', kind: 'Диван', name: 'FF',             dim: '2400 мм', price: 3820 },
  { cat: 'sofas', kind: 'Диван', name: 'Cloud (Диван)',  dim: '2400 мм', price: 3920 },
  { cat: 'sofas', kind: 'Диван', name: 'Krisby',         dim: '2400 мм', price: 3960 },
  { cat: 'sofas', kind: 'Диван', name: 'Coxo',           dim: '2400 мм', price: 4080 },
  { cat: 'sofas', kind: 'Диван', name: 'Oxford',         dim: '2400 мм', price: 4110 },
  { cat: 'sofas', kind: 'Диван', name: 'Lukas',          dim: '2400 мм', price: 4120 },
  { cat: 'sofas', kind: 'Диван', name: 'Reflex',         dim: '2400 мм', price: 4240 },
  { cat: 'sofas', kind: 'Диван', name: 'Tatlin (Диван)', dim: '2400 мм', price: 4480 },
  { cat: 'sofas', kind: 'Диван', name: 'Reverse',        dim: '2400 мм', price: 5870 },
  { cat: 'sofas', kind: 'Диван', name: 'Club',           dim: '2400 мм', price: 6360 },

  /* Кровати (1600 × 2000 мм) */
  { cat: 'beds', kind: 'Кровать', name: 'Praddy',           dim: '1600 × 2000 мм', price: 2410 },
  { cat: 'beds', kind: 'Кровать', name: 'Alaska',           dim: '1600 × 2000 мм', price: 2410 },
  { cat: 'beds', kind: 'Кровать', name: 'Flow',             dim: '1600 × 2000 мм', price: 2550 },
  { cat: 'beds', kind: 'Кровать', name: 'Grace',            dim: '1600 × 2000 мм', price: 2550 },
  { cat: 'beds', kind: 'Кровать', name: 'Tatlin (Кровать)', dim: '1600 × 2000 мм', price: 2700 },
  { cat: 'beds', kind: 'Кровать', name: 'Cocoon',           dim: '1600 × 2000 мм', price: 2700 },
  { cat: 'beds', kind: 'Кровать', name: 'Wave',             dim: '1600 × 2000 мм', price: 3180 },
  { cat: 'beds', kind: 'Кровать', name: 'Saia',             dim: '1600 × 2000 мм', price: 3290 },
  { cat: 'beds', kind: 'Кровать', name: 'Cloud (Кровать)',  dim: '1600 × 2000 мм', price: 3290 },

  /* Кресла */
  { cat: 'armchairs', kind: 'Кресло', name: 'Minotti',        dim: 'индивидуально', price: 1450 },
  { cat: 'armchairs', kind: 'Кресло', name: 'Shon',           dim: 'индивидуально', price: 1570 },
  { cat: 'armchairs', kind: 'Кресло', name: 'Cloud (Кресло)', dim: 'индивидуально', price: 2210 },
  { cat: 'armchairs', kind: 'Кресло', name: 'Lacoon',         dim: 'Ø 1300 мм',     price: 3200 },

  /* Стулья */
  { cat: 'chairs', kind: 'Стул', name: 'Romeo',  dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Tallin', dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Taupo',  dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Temby',  dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Tempe',  dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Vichy',  dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' },
  { cat: 'chairs', kind: 'Стул', name: 'Kona',   dim: 'выбор ткани и опор', price: null, priceText: 'под заказ' }
];

IZYUM.CALC = {
  programs: [
    {
      id: 'svaye',
      name: 'Кредит «На сваё» · 4%',
      shortName: 'Кредит «На сваё» (4% в грейс-период 12 мес.)',
      rate: 0.04,
      rateGrace: 0.04,
      rateAfterOnline: 0.12,   /* СР НБ РБ (9,25%) + 2,75 п.п. при оформлении онлайн в ДБО */
      rateAfterBranch: 0.1225, /* СР НБ РБ (9,25%) + 3,0 п.п. при оформлении в отделении банка */
      graceMonths: 12,
      minLoanSum: 200,
      maxLoanSum: 50000,       /* до 50 000 BYN под неустойку для граждан РБ до 60 лет */
      defTerm: 36,
      defFirst: 0,
      terms: [
        { months: 12, label: '12 мес (грейс 4%)' },
        { months: 24, label: '24 мес (2 года)' },
        { months: 36, label: '36 мес (3 года)' },
        { months: 48, label: '48 мес (4 года)' },
        { months: 60, label: '60 мес (5 лет)' }
      ]
    },
    {
      id: 'installment',
      name: 'Рассрочка (3–4 мес)',
      shortName: 'Рассрочка (3–4 мес.)',
      rate: 0,
      defTerm: 4,
      defFirst: 20,
      terms: [
        { months: 3, over: 0, label: '3 мес' },
        { months: 4, over: 0, label: '4 мес' }
      ]
    }
  ],
  terms: [
    { months: 3, over: 0 },
    { months: 4, over: 0 }
  ],
  delivery: [
    { id: 'minsk',  name: 'Минск',               price: 40 },
    { id: 'region', name: 'До 30 км от МКАД',     price: 70 },
    { id: 'by',     name: 'По Беларуси',          price: 150 }
  ],
  liftFlat: 20,
  stairsPerFloor: 8
};

/* Расчёт кредита «На сваё» (ОАО «АСБ Беларусбанк», срок до 5 лет / 60 мес.):
   - Грейс-период (первые 12 месяцев): фиксированная ставка 4% годовых + отсрочка по основному долгу на 12 мес.
   - По истечении грейс-периода (с 13-го месяца): переменная ставка СР НБ РБ (9,25%) + 2,75 п.п. = 12,0% годовых (при подаче заявки через каналы ДБО онлайн) либо СР НБ РБ + 3,0 п.п. = 12,25% годовых (в отделении банка).
   - Досрочное погашение (полное или частичное) — без ограничений и комиссий (при погашении за 12 мес. действует только ставка 4% годовых).
   Расчёт носит справочно-информационный характер и не является публичной офертой (ст. 407 ГК РБ). */
IZYUM.calcSvaye = function (loanSum, months, channel) {
  var L = Math.max(0, +loanSum || 0);
  var m = Math.max(1, +months || 36);
  var rateGrace = 0.04;
  var rateAfter = channel === 'branch' ? 0.1225 : 0.12;
  var graceM = Math.min(m, 12);
  var remM = Math.max(0, m - 12);

  /* 1. Равномерное погашение основного долга (L / m в месяц с 1-го месяца):
        первые 12 мес. под 4% годовых на остаток, с 13-го мес. под 12% (онлайн) / 12,25% (отделение) */
  var overGraceEven = L > 0 ? (L * (rateGrace / 12) * (graceM * m - (graceM * (graceM - 1)) / 2) / m) : 0;
  var remPrincipal = (L > 0 && remM > 0) ? (L * remM / m) : 0;
  var overAfterEven = remPrincipal > 0 ? (remPrincipal * (rateAfter / 12) * (remM + 1) / 2) : 0;
  var over = Math.round(overGraceEven + overAfterEven);
  var monthlyAvg = L > 0 ? Math.ceil((L + over) / m) : 0;
  var graceMonthly = L > 0 ? Math.ceil(((L * graceM / m) + overGraceEven) / graceM) : 0;
  var afterMonthly = (remM > 0 && L > 0) ? Math.ceil((remPrincipal + overAfterEven) / remM) : 0;
  var firstMonth = L > 0 ? Math.ceil((L / m) + L * (rateGrace / 12)) : 0;
  var lastRate = remM > 0 ? rateAfter : rateGrace;
  var lastMonth = L > 0 ? Math.ceil((L / m) + (L / m) * (lastRate / 12)) : 0;

  /* 2. График с полной 12-месячной отсрочкой основного долга по договору банка:
        в 1–12 мес. уплачиваются только проценты 4% годовых, основной долг гасится равными долями с 13-го по m-й месяц */
  var graceInterestOnly = L > 0 ? Math.ceil(L * (rateGrace / 12)) : 0;
  var overGraceDefer = L * rateGrace * (graceM / 12);
  var overAfterDefer = remM > 0 ? (L * (rateAfter / 12) * (remM + 1) / 2) : 0;
  var overDefer = Math.round(overGraceDefer + overAfterDefer);
  var afterMonthlyDefer = (remM > 0 && L > 0) ? Math.ceil((L + overAfterDefer) / remM) : 0;

  return {
    loan: L,
    months: m,
    rate: rateGrace,
    rateGrace: rateGrace,
    rateAfter: rateAfter,
    over: over,
    overGrace: Math.round(overGraceEven),
    overAfter: Math.round(overAfterEven),
    monthly: monthlyAvg,
    graceMonthly: graceMonthly,
    afterMonthly: afterMonthly,
    graceInterestOnly: graceInterestOnly,
    afterMonthlyDefer: afterMonthlyDefer,
    overDefer: overDefer,
    firstMonth: firstMonth,
    lastMonth: lastMonth,
    total: L + over
  };
};
/* Обратная совместимость для вызовов IZYUM.calcRodnye */
IZYUM.calcRodnye = IZYUM.calcSvaye;

IZYUM.fmt = function (n) {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
};

IZYUM.store = {
  get: function (k, d) { try { var v = localStorage.getItem('izyum_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('izyum_' + k, JSON.stringify(v)); } catch (e) {} }
};
