// Главно меню на сайта. Всяка група има свой цвят (tone) за заглавията на страниците ѝ.
// Външните връзки (дневник, профил на купувача) започват с https://.
export type Tone = 'blue' | 'orange' | 'lime';
export type NavLink = { label: string; desc?: string; href: string };
export type NavGroup = { label: string; href: string; tone: Tone; intro: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: 'За училището',
    href: '/za-uchilishteto',
    tone: 'blue',
    intro: 'Училище с традиции – училище с бъдеще. Над 140 години образование във Вълчи дол.',
    links: [
      { label: 'История', desc: 'От 1880 г. до днес', href: '/istoriya' },
      { label: 'Патрон и символи', desc: 'Васил Левски и песента на училището', href: '/patron-i-simvoli' },
      { label: 'Мисия и цели', desc: 'Какво искаме за учениците', href: '/misiya-i-tseli' },
      { label: 'Визия', desc: 'Накъде вървим', href: '/viziya' },
      { label: 'Материална база', desc: 'STEM център, кабинети, салони', href: '/materialna-baza' },
      { label: 'Проекти', desc: 'Национални и европейски програми', href: '/proekti' },
      { label: 'Обществен съвет', desc: 'Протоколи от заседания', href: '/obshtestven-savet' },
      { label: 'Училищно настоятелство', desc: 'Сдружение към училището', href: '/uchilishtno-nastoyatelstvo' },
      { label: 'Библиотека', desc: 'Книги и четене', href: '/biblioteka' },
      { label: 'Училищни вестници', desc: '„Училищен глас“, „Шарена палитра“, „Слово“', href: '/vestnik' },
      { label: 'Училищно радио', desc: 'Гласът на учениците', href: '/radio' },
    ],
  },
  {
    label: 'Родители',
    href: '/za-roditeli',
    tone: 'orange',
    intro: 'Прием, заявления, правила и полезна информация за родителите.',
    links: [
      { label: 'За родители', desc: 'Правила и полезна информация', href: '/za-roditeli' },
      { label: 'Прием', desc: 'Първи, пети и осми клас', href: '/priem' },
      { label: 'Свободни места', desc: 'Към момента', href: '/svobodni-mesta' },
      { label: 'Заявления и бланки', desc: 'Образци за попълване', href: '/zayavleniya' },
      { label: 'Родителски клуб', desc: 'Заедно с родителите', href: '/roditelski-klub' },
      { label: 'Пътувания и екскурзии', desc: 'Документи за родителите', href: '/patuvaniya' },
      { label: 'Безопасност на движението', desc: 'БДП', href: '/bdp' },
      { label: 'Електронен дневник', desc: 'Школо', href: 'https://app.shkolo.bg/' },
    ],
  },
  {
    label: 'Ученици',
    href: '/za-uchenika',
    tone: 'lime',
    intro: 'Изпити, стипендии, занимания и всичко, което е полезно за учениците.',
    links: [
      { label: 'За ученика', desc: 'ДЗИ, безопасен интернет, полезни връзки', href: '/za-uchenika' },
      { label: 'Самостоятелна форма', desc: 'Графици и конспекти (СФО)', href: '/sfo' },
      { label: 'Занимания по интереси', desc: 'Заявления и програма', href: '/zanimaniya-po-interesi' },
      { label: 'Стипендии', desc: 'Правила и класиране', href: '/stipendii' },
      { label: 'Постижения', desc: 'Конкурси и състезания', href: '/postizheniya' },
      { label: 'Анализ от НВО и ДЗИ', desc: 'Резултати от изпитите', href: '/analiz-nvo-dzi' },
      { label: 'Ученически парламент', desc: 'Учениците решават', href: '/parlament' },
      { label: 'Ученически омбудсман', desc: 'Защита на правата', href: '/ombudsman' },
      { label: 'Дигитална раница', desc: 'Учебни материали от МОН', href: 'https://edu.mon.bg/' },
    ],
  },
  {
    label: 'Новини',
    href: '/novini',
    tone: 'lime',
    intro: 'Какво се случва в училище.',
    links: [
      { label: 'Новини', desc: 'Актуално от училището', href: '/novini' },
      { label: 'Акценти', desc: 'Важни обяви', href: '/aktsenti' },
      { label: 'Събития', desc: 'Предстоящи', href: '/sabitiya' },
      { label: 'Галерия', desc: 'Снимки', href: '/galeriya' },
      { label: 'Поздравителни адреси', desc: 'За откриването на учебната година', href: '/pozdravitelni-adresi' },
    ],
  },
  {
    label: 'Документи',
    href: '/dokumenti',
    tone: 'blue',
    intro: 'Правилници, планове, бюджет и документи на училището.',
    links: [
      { label: 'Документация', desc: 'Правилници, планове, бюджет, графици', href: '/dokumentatsiya' },
      { label: 'Административни услуги', desc: 'Удостоверения и заявления', href: '/administrativni-uslugi' },
      { label: 'Достъп до информация', desc: 'По ЗДОИ', href: '/dostap-do-informatsiya' },
      { label: 'Лични данни', desc: 'Защита на личните данни', href: '/lichni-danni' },
      { label: 'Сигнали за нарушения', desc: 'По ЗЗЛПСПОИН', href: '/signali' },
      { label: 'Профил на купувача', desc: 'Обществени поръчки', href: 'https://app.eop.bg/buyer/21179' },
      { label: 'За учителя', desc: 'Документи за учителите', href: '/za-uchitelya' },
      { label: 'Критерии за ДТВ', desc: 'Допълнително трудово възнаграждение', href: '/kriterii-dtv' },
      { label: 'Професионални общности', desc: 'Учителски общности', href: '/profesionalni-obshtnosti' },
      { label: 'Организиране на екскурзии', desc: 'Документи за учителите', href: '/organizirane-na-ekskurzii' },
    ],
  },
];

export const SCHOOL = {
  name: 'СУ „Васил Левски“',
  full: 'Средно училище „Васил Левски“',
  town: 'гр. Вълчи дол',
  short: 'СУ „Васил Левски“ – Вълчи дол',
  motto: 'Училище с традиции – училище с бъдеще',
  site: 'https://souvalchidol.com',
};

export const CONTACT = {
  address: 'ул. „Георги Димитров“ № 1',
  city: '9280 Вълчи дол',
  email: 'info-400112@edu.mon.bg',
  phone: '0894 417 170',
  phoneHref: 'tel:+359894417170',
  maps: 'https://www.google.com/maps/search/?api=1&query=%D0%A1%D0%A3+%D0%92%D0%B0%D1%81%D0%B8%D0%BB+%D0%9B%D0%B5%D0%B2%D1%81%D0%BA%D0%B8+%D0%92%D1%8A%D0%BB%D1%87%D0%B8+%D0%B4%D0%BE%D0%BB',
  facebook: 'https://www.facebook.com/Средно-училище-Васил-Левски-грВълчи-дол-1120136008039014',
  hours: [
    { label: 'Деловодство', value: 'пон – пет, 8:00 – 17:00' },
    { label: 'Ръководство', value: 'пон – пет, 13:00 – 14:30' },
  ],
};

// Лентата с връзки за образованието на началната страница (под бързите връзки)
export const EDU_LINKS = [
  { label: 'Електронен дневник', href: 'https://app.shkolo.bg/' },
  { label: 'НЕИСПУО', href: 'https://neispuo.mon.bg/' },
  { label: 'МОН', href: 'https://www.mon.bg/' },
  { label: 'РУО – Варна', href: 'https://ruo-varna.bg/' },
];

// Полезни връзки (долната част на стария сайт)
export const USEFUL_LINKS = [
  { label: 'Гореща линия за деца 116 111', href: 'http://116111.bg/' },
  { label: 'Държавна агенция за закрила на детето', href: 'https://sacp.government.bg/' },
  { label: 'Център за безопасен интернет', href: 'https://www.safenet.bg/' },
  { label: 'Министерство на образованието и науката', href: 'https://www.mon.bg/' },
  { label: 'РУО – Варна', href: 'https://ruo-varna.bg/' },
  { label: 'Община Вълчи дол', href: 'https://www.valchidol.bg/' },
];
