// Главно меню. Цветът на всяка група идва от логото:
// blue = центърът и прозрачност, orange = родители и прием, lime = ежедневие и новини.
export type Tone = 'blue' | 'orange' | 'lime';
export type NavLink = { label: string; desc?: string; href: string };
export type NavGroup = { label: string; href: string; tone: Tone; intro: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: 'За нас',
    href: '/za-nas',
    tone: 'blue',
    intro: 'Обучение, специализирана подкрепа и рехабилитация за деца и младежи.',
    links: [
      { label: 'За нас', desc: 'Мисия и ценности', href: '/za-nas' },
      { label: 'История', desc: 'Пътят на центъра', href: '/za-nas/istoriya' },
      { label: 'Екип', desc: 'Специалистите при нас', href: '/za-nas/ekip' },
      { label: 'Материална база', desc: 'Кабинети, зали и двор', href: '/za-nas/materialna-baza' },
      { label: 'Проекти', desc: 'Програми и инициативи', href: '/za-nas/proekti' },
      { label: 'Кариери', desc: 'Свободни позиции', href: '/za-nas/karieri' },
    ],
  },
  {
    label: 'Родители и прием',
    href: '/za-roditeli',
    tone: 'orange',
    intro: 'Как се записва дете, какъв е денят при нас и с какво можем да помогнем.',
    links: [
      { label: 'За родители', desc: 'Всичко на едно място', href: '/za-roditeli' },
      { label: 'Обучение и подкрепа', desc: 'Терапии и специалисти', href: '/obuchenie-i-podkrepa' },
      { label: 'Как се записва дете', desc: 'Процедура и документи', href: '/priem/proczedura' },
      { label: 'Елате на посещение', desc: 'Запознайте се с центъра', href: '/priem/poseshtenie' },
      { label: 'Дневен режим', desc: 'Ритъмът на деня', href: '/za-roditeli/dneven-rezhim' },
      { label: 'Административни услуги', desc: 'Заявления и удостоверения', href: '/za-roditeli/uslugi' },
      { label: 'Ресурси за родители', desc: 'Материали за вкъщи', href: '/za-roditeli/resursi' },
      { label: 'Училищно настоятелство', desc: 'Заедно за децата', href: '/za-roditeli/nastoyatelstvo' },
    ],
  },
  {
    label: 'Новини',
    href: '/novini',
    tone: 'lime',
    intro: 'Какво се случва при нас всеки ден.',
    links: [
      { label: 'Новини', desc: 'Актуално от центъра', href: '/novini' },
      { label: 'Събития', desc: 'Предстоящи и минали', href: '/sabitiya' },
      { label: 'Галерия', desc: 'Снимки от живота при нас', href: '/galeriya' },
    ],
  },
  {
    label: 'Прозрачност',
    href: '/prozrachnost',
    tone: 'blue',
    intro: 'Документите на центъра са публични и на едно място.',
    links: [
      { label: 'Всички документи', desc: 'Всичко на едно място', href: '/prozrachnost' },
      { label: 'Бюджет и финанси', desc: 'Бюджет и отчети', href: '/za-nas/byudzhet-i-finansi' },
      { label: 'Документи в ЦСОП', desc: 'Правилници и политики', href: '/za-nas/dokumenti-v-tsop' },
      { label: 'Профил на купувача', desc: 'Обществени поръчки', href: '/za-nas/profil-na-kupuvacha' },
      { label: 'Достъп до информация', desc: 'По ЗДОИ', href: '/za-nas/dostap-do-obshtestvena-informatsiya' },
      { label: 'Защита на личните данни', desc: 'GDPR и ДЛЗД', href: '/za-nas/zashtita-na-lichnite-danni' },
      { label: 'Подаване на сигнали', desc: 'По ЗЗЛПСПОИН', href: '/podavane-na-signali' },
    ],
  },
];

export const CONTACT = {
  address: 'ул. „Петко Стайнов“ 7',
  city: '9000 Варна',
  email: 'info-400052@edu.mon.bg',
  phone: '+359 888 490 771',
  phoneHref: 'tel:+359888490771',
  maps: 'https://www.google.com/maps/search/?api=1&query=%D0%A6%D0%A1%D0%9E%D0%9F+%D0%92%D0%B0%D1%80%D0%BD%D0%B0+%D0%9F%D0%B5%D1%82%D0%BA%D0%BE+%D0%A1%D1%82%D0%B0%D0%B9%D0%BD%D0%BE%D0%B2+7',
  facebook: 'https://www.facebook.com/dimitar.miladinov.374/?locale=bg_BG',
  hours: [
    { label: 'Център', value: 'пон – пет, 8:00 – 18:00' },
    { label: 'Деловодство', value: '8:00 – 16:30' },
    { label: 'Директор', value: 'вторник, 9:00 – 10:00' },
  ],
};
