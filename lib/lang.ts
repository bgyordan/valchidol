export type Lang = 'bg' | 'en';

export const isEnPath = (p: string) => p === '/en' || p.startsWith('/en/');

/** „пон – пет, 8:00 – 17:00“ → „Mon – Fri, 8:00 – 17:00“ (за английската версия) */
export function enDays(s: string): string {
  const D: [RegExp, string][] = [[/понеделник|пон/gi, 'Mon'], [/вторник|вт/gi, 'Tue'], [/сряда|ср/gi, 'Wed'], [/четвъртък|чет|чт/gi, 'Thu'],
    [/петък|пет/gi, 'Fri'], [/събота|съб/gi, 'Sat'], [/неделя|нед/gi, 'Sun'], [/\s*ч\.?$/i, '']];
  return D.reduce((t, [re, v]) => t.replace(re, v), s);
}
