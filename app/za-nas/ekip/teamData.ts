export type Member = { name: string; role: string; tone: string };
export type Group = { label: string; compact?: boolean; members: Member[] };

export const TEAM: Group[] = [
  {
    label: 'Администрация',
    members: [
      { name: 'Светлана Иванова', role: 'Директор', tone: 'dir' },
      { name: 'Силвия Кьошкерян', role: 'Зам.-директор УД', tone: 'admin' },
      { name: 'Йордан Йорданов', role: 'Зам.-директор АСД', tone: 'admin' },
      { name: 'Радка Георгиева', role: 'Счетоводител', tone: 'admin' },
      { name: 'Ванина Величкова', role: 'Технически секретар', tone: 'admin' },
      { name: 'Марина Христова', role: 'ЗАС', tone: 'admin' },
    ],
  },
  {
    label: 'Терапевти и специалисти',
    members: [
      { name: 'Рая Стефанова', role: 'Клиничен психолог', tone: 'psy' },
      { name: 'Тихомир Иванов', role: 'Психолог', tone: 'psy' },
      { name: 'Елена Тодорова', role: 'Психолог', tone: 'psy' },
      { name: 'Илияна Попова', role: 'Психолог', tone: 'psy' },
      { name: 'Жулиета Стефанова', role: 'Логопед', tone: 'logo' },
      { name: 'Звезделина Атанасова', role: 'Логопед', tone: 'logo' },
      { name: 'Жасмина Димитрова', role: 'Логопед', tone: 'logo' },
      { name: 'Светлана Ангелова', role: 'Логопед', tone: 'logo' },
      { name: 'Михаела Георгиева', role: 'Ерготерапевт', tone: 'ergo' },
      { name: 'Анастасия Драгнева', role: 'Рехабилитатор', tone: 'rehab' },
      { name: 'Любомир Тепавичаров', role: 'Рехабилитатор', tone: 'rehab' },
      { name: 'Мариян Янакиев', role: 'Кинезитерапевт', tone: 'rehab' },
    ],
  },
  {
    label: 'Педагогически екип',
    compact: true,
    members: [
      { name: 'Албена Маринова', role: 'Учител', tone: 'teacher' },
      { name: 'Александра Чолакова', role: 'Учител', tone: 'teacher' },
      { name: 'Анна Вушкова', role: 'Учител', tone: 'teacher' },
      { name: 'Антоанета Станоева', role: 'Учител', tone: 'teacher' },
      { name: 'Велина Желязкова', role: 'Учител', tone: 'teacher' },
      { name: 'Георги Минков', role: 'Учител', tone: 'teacher' },
      { name: 'Гюляй Хашим', role: 'Учител', tone: 'teacher' },
      { name: 'Даниела Георгиева', role: 'Учител', tone: 'teacher' },
      { name: 'Даниела Иванова', role: 'Учител', tone: 'teacher' },
      { name: 'Деница Бонева', role: 'Учител', tone: 'teacher' },
      { name: 'Десислава Босие', role: 'Учител', tone: 'teacher' },
      { name: 'Десислава Тенева', role: 'Учител', tone: 'teacher' },
      { name: 'Диляна Василева', role: 'Учител', tone: 'teacher' },
      { name: 'Дияна Христова', role: 'Учител', tone: 'teacher' },
      { name: 'Зорница Вълкова', role: 'Учител', tone: 'teacher' },
      { name: 'Зюхтие Халил', role: 'Учител', tone: 'teacher' },
      { name: 'Илка Иванова', role: 'Учител', tone: 'teacher' },
      { name: 'Кирила Христова', role: 'Учител', tone: 'teacher' },
      { name: 'Мария Ангелова', role: 'Учител', tone: 'teacher' },
      { name: 'Мария Шишкова', role: 'Учител', tone: 'teacher' },
      { name: 'Мая Станева', role: 'Учител', tone: 'teacher' },
      { name: 'Мирослав Николов', role: 'Учител', tone: 'teacher' },
      { name: 'Невена Христова', role: 'Учител', tone: 'teacher' },
      { name: 'Недялка Матеева', role: 'Учител', tone: 'teacher' },
      { name: 'Николай Христов', role: 'Учител', tone: 'teacher' },
      { name: 'Нина Русева', role: 'Учител', tone: 'teacher' },
      { name: 'Паулина Тодорова', role: 'Учител', tone: 'teacher' },
      { name: 'Пенка Иванова', role: 'Учител', tone: 'teacher' },
      { name: 'Петя Василева', role: 'Учител', tone: 'teacher' },
      { name: 'Росен Драганчев', role: 'Учител', tone: 'teacher' },
      { name: 'Росица Терзиева', role: 'Учител', tone: 'teacher' },
      { name: 'Румяна Асенова', role: 'Учител', tone: 'teacher' },
      { name: 'Светлана Живкова', role: 'Учител', tone: 'teacher' },
      { name: 'Христина Христова', role: 'Учител', tone: 'teacher' },
    ],
  },
  {
    label: 'Възпитатели ЦОУД',
    members: [
      { name: 'Гинка Станчева', role: 'Възпитател', tone: 'admin' },
      { name: 'Евгений Константинов', role: 'Възпитател', tone: 'admin' },
      { name: 'Жана Генова', role: 'Възпитател', tone: 'admin' },
      { name: 'Лидия Милкова', role: 'Възпитател', tone: 'admin' },
      { name: 'Радина Чаталбашева', role: 'Възпитател', tone: 'admin' },
      { name: 'Петя Пиперкова', role: 'Възпитател', tone: 'admin' },
    ],
  },
  {
    label: 'Помощник на учителя',
    members: [
      { name: 'Диана Симонова', role: 'Помощник-учител', tone: 'logo' },
      { name: 'Петя Славова', role: 'Помощник-учител', tone: 'logo' },
      { name: 'Светла Михова', role: 'Помощник-учител', tone: 'logo' },
      { name: 'Силвана Минкова', role: 'Помощник-учител', tone: 'logo' },
      { name: 'Цветелина Минкова', role: 'Помощник-учител', tone: 'logo' },
      { name: 'Янислава Йорданова', role: 'Помощник-учител', tone: 'logo' },
    ],
  },
];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}
