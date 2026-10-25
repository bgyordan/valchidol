import { all } from './db';
import { getSiteInfo } from './siteinfo';

// Търсене за чатбота: намира най-подходящите страници, новини и документи по думите във въпроса.
// Базата е малка (десетки страници, стотици новини), затова всичко се оценява тук, без отделен индекс.
// Сравнението е без главни букви и по началото на думата („стипендии“ ≈ „стипенд…“), за да работи и на български.

export type Source = { t: string; href: string; text: string; kind: 'page' | 'news' | 'doc' };

const STOP = new Set(('и в във на за от до по с със да не ли ще се са е съм си сме сте как кога къде какво какви каква кой коя кое кои колко защо има няма ми ни ви те той тя то тези този тази това това може можете трябва '
  + 'the a an and or of to in on for is are was be how when where what which who why do does can i you we my your our there it this that with at by from').split(' '));

export function terms(q: string): string[] {
  const words = q.toLowerCase().replace(/ё/g, 'е').split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3 && !STOP.has(w));
  // началото на думата: окончанията на български се менят („стипендия/стипендии“)
  const stems = words.map((w) => (w.length > 6 ? w.slice(0, w.length - 2) : w.length > 4 ? w.slice(0, w.length - 1) : w));
  return [...new Set(stems)].slice(0, 8);
}

// w = тежест на всяка дума: редките думи („стипенд…“) тежат повече от честите („училищ…“)
function score(title: string, body: string, ts: string[], w: number[]): number {
  const t = title.toLowerCase(), b = body.toLowerCase();
  let s = 0;
  ts.forEach((x, k) => {
    if (t.includes(x)) s += 6 * w[k];
    let i = 0, n = 0;
    while (n < 6 && (i = b.indexOf(x, i)) !== -1) { n++; i += x.length; }
    s += n * w[k];
  });
  return s;
}

// откъс от текста около най-гъстото място с думите от въпроса
function excerpt(body: string, ts: string[], max = 1400): string {
  const clean = body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)').replace(/[#*]+ ?/g, '').replace(/\n{2,}/g, '\n');
  if (clean.length <= max) return clean;
  const low = clean.toLowerCase();
  let best = 0, bestN = -1;
  for (let at = 0; at < clean.length; at += 300) {
    const part = low.slice(at, at + max);
    const n = ts.reduce((k, w) => k + (part.includes(w) ? 1 : 0), 0);
    if (n > bestN) { bestN = n; best = at; }
  }
  return (best > 0 ? '…' : '') + clean.slice(best, best + max) + '…';
}

// чести въпроси → страницата, където е отговорът (думите във въпроса често не са в текста ѝ)
const HINTS: [RegExp, string][] = [
  [/телефон|имейл|e-?mail|контакт|адрес|работно време|деловодств|phone|contact|address|office/i, 'kontakti'],
  [/прием|кандидат|записван|admission|apply|enrol/i, 'priem'],
  [/основан|история|кога е открит|founded|history/i, 'istoriya'],
  [/стипенди|scholarship/i, 'stipendii'],
  [/заявлени|бланк|образ[еци]/i, 'zayavleniya'],
  [/свободни места|free places/i, 'svobodni-mesta'],
];

export async function findSources(q: string, lang: 'bg' | 'en'): Promise<Source[]> {
  const ts = terms(q);
  if (!ts.length && !HINTS.some(([re]) => re.test(q))) return [];
  const [pages, news, docs] = await Promise.all([
    all<{ slug: string; title: string; body: string; title_en: string | null; body_en: string | null }>('SELECT slug, title, body, title_en, body_en FROM site_pages'),
    all<{ slug: string; title: string; excerpt: string | null; body: string | null; published_at: string | null }>(
      `SELECT id AS slug, title, excerpt, substr(content, 1, 2500) AS body, published_at FROM site_news WHERE status = 'published' ORDER BY published_at DESC LIMIT 150`),
    all<{ title: string; file_url: string | null; page_slug: string; academic_year: string | null; category: string | null }>(
      `SELECT name AS title, file_url, section AS page_slug, academic_year, category FROM site_documents WHERE archived = 0 AND on_site = 1 AND file_url <> ''`),
  ]);

  // колко от текстовете съдържат всяка дума → тежест log(N / df)
  const texts = [...pages.map((p) => `${p.title} ${p.body}`), ...news.map((n) => `${n.title} ${n.excerpt || ''} ${n.body || ''}`)].map((x) => x.toLowerCase());
  const N = texts.length || 1;
  const w = ts.map((x) => Math.log((N + 1) / (texts.filter((tx) => tx.includes(x)).length + 1)) + 0.05);
  const cleanT = (x: string) => x.replace(/^[#*\s]+/, '').trim();
  const out: (Source & { s: number })[] = [];
  for (const p of pages) {
    const hinted = HINTS.some(([re, slug]) => slug === p.slug && re.test(q));
    const s = score(p.title, p.body, ts, w) + (p.title_en ? score(p.title_en, p.body_en || '', ts, w) : 0) + (hinted ? 1000 : 0);
    if (s > 0) {
      const useEn = lang === 'en' && p.title_en && p.body_en;
      out.push({ kind: 'page', s, t: useEn ? p.title_en! : p.title, href: (useEn ? '/en/' : '/') + p.slug, text: excerpt(useEn ? p.body_en! : p.body, ts) });
    }
  }
  news.forEach((n, i) => {
    const s = score(n.title, `${n.excerpt || ''} ${n.body || ''}`, ts, w);
    // по-новите новини леко напред
    if (s > 0) out.push({ kind: 'news', s: s + Math.max(0, 1 - i / 60), t: n.title, href: `/novini/${n.slug}`, text: `${(n.published_at || '').slice(0, 10)} ${excerpt(`${n.excerpt || ''}\n${n.body || ''}`, ts, 900)}` });
  });
  for (const d of docs) {
    const s = score(cleanT(d.title), d.category || '', ts, w);
    if (ts.length && s > 0 && s >= 6 * Math.max(...w) * 0.8) out.push({ kind: 'doc', s: s * 0.7, t: cleanT(d.title), href: d.file_url!, text: `Документ${d.academic_year ? ` за ${d.academic_year}` : ''}${d.category ? `, група „${d.category}“` : ''}, на страница /${d.page_slug}` });
  }
  // „Контакти“ не е в базата (страницата е в кода) — данните ѝ са в basics(); тук само връзката
  if (HINTS[0][0].test(q)) out.push({ kind: 'page', s: 999, t: lang === 'en' ? 'Contacts' : 'Контакти', href: lang === 'en' ? '/en/contacts' : '/kontakti', text: lang === 'en' ? 'Phones, e-mail, address and office hours (see basics above).' : 'Телефони, имейл, адрес и работно време (виж основното по-горе).' });
  out.sort((a, b) => b.s - a.s);
  const pick = [...out.filter((x) => x.kind === 'page').slice(0, 3), ...out.filter((x) => x.kind === 'news').slice(0, 3), ...out.filter((x) => x.kind === 'doc').slice(0, 4)];
  return pick.sort((a, b) => b.s - a.s).map(({ s, ...x }) => x);
}

// основното за училището — винаги е в контекста (телефони, часове, адрес)
export async function basics(): Promise<string> {
  const { contact, hours, phones } = await getSiteInfo();
  return [
    'СУ „Васил Левски“, гр. Вълчи дол (основано 1880 г.), ученици от 1. до 12. клас.',
    `Адрес: ${contact.address}, ${contact.city}. Имейл: ${contact.email}. Телефон: ${contact.phone}.`,
    `Деловодство: ${hours.admin}. Приемно време на ръководството: ${hours.director}.`,
    ...phones.map((p) => `${p.name}${p.role ? ` (${p.role})` : ''}: ${p.phone}`),
    'Електронен дневник: Школо (app.shkolo.bg). Контакти: /kontakti. Новини: /novini. Документи: /dokumenti. Прием: /priem.',
  ].join('\n');
}
