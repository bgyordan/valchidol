export type Lang = 'bg' | 'en';

// Сайтът на училището е само на български; двойките остават празни.
export const PAIRS: { bg: string; en: string }[] = [];
const BG_TO_EN: Record<string, string> = {};

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
