// Разделите на админ панела, за които се дават права (отметки в Админ → Хора).
export const AREAS = [
  { key: 'novini', label: 'Новини' },
  { key: 'sabitiya', label: 'Събития' },
  { key: 'galeriya', label: 'Галерия' },
  { key: 'dokumenti', label: 'Документи' },
  { key: 'stranitsi', label: 'Страници' },
  { key: 'baza', label: 'Материална база' },
  { key: 'nachalo', label: 'Начална страница и меню' },
  { key: 'nastroyki', label: 'Настройки (контакти, съобщение)' },
] as const;

export type Area = (typeof AREAS)[number]['key'];

// perms: null = всичко; иначе списък със запетаи
export function can(a: { role: string; perms?: string | null } | null, area: Area): boolean {
  if (!a) return false;
  if (a.role === 'admin' || a.perms == null) return true;
  return a.perms.split(',').includes(area);
}

export function permsLabel(perms: string | null): string {
  if (perms == null) return 'всичко';
  const l = AREAS.filter((x) => perms.split(',').includes(x.key)).map((x) => x.label);
  return l.length ? l.join(', ') : 'нищо';
}
