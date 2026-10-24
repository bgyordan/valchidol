// Двуезичие: българският сайт е пълен, английската част (/en) е кратка — обща информация.
// Двойките страници (за превключвателя БГ/EN, hreflang и картата на сайта).
export type Lang = 'bg' | 'en';

export const PAIRS: { bg: string; en: string }[] = [
  { bg: '/', en: '/en' },
  { bg: '/obuchenie-i-podkrepa', en: '/en/services' },
  { bg: '/priem/proczedura', en: '/en/admission' },
  { bg: '/kontakti', en: '/en/contacts' },
  { bg: '/daritelstvo', en: '/en/support-us' },
];

// БГ страници без собствен превод, които все пак водят към най-близката английска
const BG_TO_EN: Record<string, string> = {
  '/za-nas': '/en',
  '/priem': '/en/admission',
  '/priem/poseshtenie': '/en/admission',
  '/za-roditeli/uslugi': '/en/services',
};

export const isEnPath = (p: string) => p === '/en' || p.startsWith('/en/');

/** Адресът на същата страница на другия език (или началото му, ако няма превод). */
export function counterpart(path: string): string {
  const p = path.replace(/\/+$/, '') || '/';
  if (isEnPath(p)) return PAIRS.find((x) => x.en === p)?.bg ?? '/';
  return PAIRS.find((x) => x.bg === p)?.en ?? BG_TO_EN[p] ?? '/en';
}

/** hreflang връзки за metadata.alternates на двойка страници */
export function alternates(path: string) {
  const pair = PAIRS.find((x) => x.bg === path || x.en === path);
  if (!pair) return undefined;
  return { canonical: path, languages: { bg: pair.bg, en: pair.en, 'x-default': pair.bg } };
}
