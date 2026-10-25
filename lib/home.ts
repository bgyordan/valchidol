import { getSetting } from './data';

// Текстовете, бързите връзки и числата на началната страница — site_settings.home.
// Празно поле или липсващ ключ → стойностите по подразбиране от кода.
export type QuickLink = { t: string; href: string; icon: string };
export type Stat = { n: string; t: string };
export type HomeContent = {
  kicker: string; title: string; motto: string;
  about_title: string; about_text: string;
  quick: QuickLink[]; stats: Stat[];
  en: { motto: string; about_title: string; about_text: string }; // началната страница на английски (/en)
};

// имената на иконките за бързите връзки (рисунките са в app/page.tsx)
export const QUICK_ICONS: { key: string; label: string }[] = [
  { key: 'book', label: 'Книга / дневник' },
  { key: 'cap', label: 'Шапка / прием' },
  { key: 'seat', label: 'Чин / места' },
  { key: 'form', label: 'Бланка' },
  { key: 'folder', label: 'Папка' },
  { key: 'phone', label: 'Телефон' },
  { key: 'mail', label: 'Писмо' },
  { key: 'clock', label: 'Часовник' },
  { key: 'pin', label: 'Карта' },
  { key: 'alert', label: 'Внимание' },
  { key: 'student', label: 'Ученик' },
  { key: 'family', label: 'Родители' },
  { key: 'teacher', label: 'Учител' },
  { key: 'chart', label: 'Графика / бюджет' },
  { key: 'calendar', label: 'Календар / графици' },
  { key: 'coin', label: 'Монета / стипендии' },
  { key: 'shield', label: 'Щит / безопасност' },
];

export const HOME_DEFAULTS: HomeContent = {
  kicker: 'Средно училище · гр. Вълчи дол · от 1880 г.',
  title: 'СУ „Васил Левски“',
  motto: 'Училище с традиции – училище с бъдеще.',
  about_title: 'Над 140 години училище, в което всеки ученик може да намери своя път',
  about_text:
    'Сградата от 1987 г. има 22 класни стаи, ученически стол, актова зала, два физкултурни салона и работилници. Учениците учат в профилирани и професионални паралелки, участват в проекти, клубове и списват училищни вестници.',
  quick: [
    // без това, което вече има горе (прием, контакти, административни услуги, профил на купувача) и в лентата с връзки (е-дневник)
    { t: 'Документи', href: '/dokumentatsiya', icon: 'folder' },
    { t: 'Прозрачност и бюджет', href: '/dokumentatsiya#Бюджет', icon: 'chart' },
    { t: 'Графици', href: '/dokumentatsiya#Графици', icon: 'calendar' },
    { t: 'Заявления и бланки', href: '/zayavleniya', icon: 'form' },
    { t: 'Стипендии', href: '/stipendii', icon: 'coin' },
    { t: 'Свободни места', href: '/svobodni-mesta', icon: 'seat' },
  ],
  stats: [
    { n: '1880', t: 'година на основаване' },
    { n: '1–12', t: 'клас – от началото до дипломата' },
    { n: '22', t: 'класни стаи и кабинети' },
    { n: '2', t: 'физкултурни салона' },
  ],
  en: {
    motto: 'A school with traditions – a school with a future.',
    about_title: 'More than 140 years of a school where every student can find their own path',
    about_text:
      'Vasil Levski Secondary School in Valchi Dol, Varna Province, Bulgaria, was founded in 1880. Today it teaches students from 1st to 12th grade.\n\nThe school building from 1987 has 22 classrooms, a canteen, an assembly hall, two gyms and workshops. Students study in specialised and vocational classes, take part in national and European projects, clubs and school newspapers.',
  },
};

const str = (v: unknown, d: string) => (typeof v === 'string' && v.trim() ? v.trim() : d);

export async function getHome(): Promise<HomeContent> {
  const raw = (await getSetting<Record<string, any>>('home')) || {};
  const D = HOME_DEFAULTS;
  const quick = Array.isArray(raw.quick)
    ? raw.quick.filter((q: any) => q && q.t && q.href).map((q: any) => ({ t: String(q.t), href: String(q.href), icon: String(q.icon || 'folder') }))
    : [];
  const stats = Array.isArray(raw.stats)
    ? raw.stats.filter((s: any) => s && s.n).map((s: any) => ({ n: String(s.n), t: String(s.t || '') }))
    : [];
  return {
    kicker: str(raw.kicker, D.kicker),
    title: str(raw.title, D.title),
    motto: str(raw.motto, D.motto),
    about_title: str(raw.about_title, D.about_title),
    about_text: str(raw.about_text, D.about_text),
    quick: quick.length ? quick : D.quick,
    stats: stats.length ? stats : D.stats,
    en: {
      motto: str(raw.en?.motto, D.en.motto),
      about_title: str(raw.en?.about_title, D.en.about_title),
      about_text: str(raw.en?.about_text, D.en.about_text),
    },
  };
}
