// Помощни неща за английската част: латиница за имена и превод на дни/длъжности,
// които идват на български от ЕИС → Сайт → Настройки.

// Официална транслитерация (Закон за транслитерацията)
const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a',
  ь: 'y', ю: 'yu', я: 'ya',
};
export function latin(s: string): string {
  return s.replace(/[а-яА-Я]/g, (ch) => {
    const low = ch.toLowerCase();
    const t = TR[low] ?? ch;
    return ch === low ? t : t.charAt(0).toUpperCase() + t.slice(1);
  });
}

const DAYS: [RegExp, string][] = [
  [/понеделник/gi, 'Monday'], [/вторник/gi, 'Tuesday'], [/сряда/gi, 'Wednesday'], [/четвъртък/gi, 'Thursday'],
  [/петък/gi, 'Friday'], [/събота/gi, 'Saturday'], [/неделя/gi, 'Sunday'],
  [/\bпон\b/gi, 'Mon'], [/\bвт\b/gi, 'Tue'], [/\bср\b/gi, 'Wed'], [/\bчет\b/gi, 'Thu'], [/\bпет\b/gi, 'Fri'],
];
export function enDays(s: string): string {
  return DAYS.reduce((acc, [re, en]) => acc.replace(re, en), s).replace(/\s*ч\.$/, '');
}

const ROLES: [RegExp, string][] = [
  [/^директор$/i, 'Director'],
  [/зам\.?-?\s*директор.*(УД|учебн)/i, 'Deputy Director, Education'],
  [/зам\.?-?\s*директор.*(АСД|админ)/i, 'Deputy Director, Administration'],
  [/деловодство|администрация/i, 'Administration office'],
  [/счетоводител/i, 'Accountant'],
];
export function enRole(s: string): string {
  const hit = ROLES.find(([re]) => re.test(s));
  return hit ? hit[1] : latin(s);
}

// Име, което не е на човек (напр. „Деловодство“), се превежда, а не се транслитерира
const OFFICES: [RegExp, string][] = [[/^деловодство$/i, 'Administration office'], [/^администрация$/i, 'Administration office'], [/^счетоводство$/i, 'Accounting']];
export function enContact(name: string, role: string): { name: string; role: string } {
  const office = OFFICES.find(([re]) => re.test(name.trim()));
  if (office) return { name: office[1], role: 'General enquiries' };
  return { name: latin(name), role: enRole(role) };
}
