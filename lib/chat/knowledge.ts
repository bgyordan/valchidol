import { getSiteInfo } from '../siteinfo';
import { getNews, getUpcomingEvents, fmtDate } from '../data';

// Знанията на чатбота идват от самия сайт: страниците се прочитат (като текст) и се режат на парчета
// по заглавия. За всеки въпрос се избират най-подходящите парчета — така ботът отговаря по
// актуалното съдържание и не измисля. Прочитането се подновява на 30 минути.

const PAGES = [
  '/', '/za-nas', '/za-nas/istoriya', '/za-nas/ekip', '/za-nas/materialna-baza', '/za-nas/proekti', '/za-nas/karieri',
  '/za-roditeli', '/za-roditeli/uslugi', '/za-roditeli/dneven-rezhim', '/za-roditeli/resursi', '/za-roditeli/nastoyatelstvo',
  '/obuchenie-i-podkrepa', '/priem/proczedura', '/priem/poseshtenie', '/kontakti', '/daritelstvo',
  '/podavane-na-signali', '/prozrachnost', '/za-nas/dostap-do-obshtestvena-informatsiya', '/dostapnost',
  // английската част — за въпроси на английски
  '/en', '/en/services', '/en/admission', '/en/contacts', '/en/support-us',
];

type Chunk = { url: string; title: string; text: string; stems: Set<string> };
let cache: { at: number; chunks: Chunk[] } | null = null;
let building: Promise<Chunk[]> | null = null;

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', bdquo: '„', ldquo: '“', rdquo: '”' };
const decode = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m);

// думите → „корени“ (първите 5 букви) — грубо, но работи добре за български
export function stems(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of s.toLowerCase().match(/[a-zа-яё0-9]{3,}/gi) || []) out.add(w.slice(0, 5));
  return out;
}

function pageChunks(url: string, html: string): Chunk[] {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return [];
  let body = m[1]
    .replace(/<(script|style|svg|form|nav|noscript|button)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi, (_x, _t, inner) => `\n§§${inner.replace(/<[^>]+>/g, ' ')}\n`)
    .replace(/<(br|\/p|\/li|\/tr|\/div|\/h4)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  body = decode(body).replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
  const parts = body.split('§§').map((p) => p.trim()).filter(Boolean);
  const pageTitle = (parts[0] || '').split('\n')[0].trim();
  const out: Chunk[] = [];
  for (const p of parts) {
    const [head, ...rest] = p.split('\n');
    const text = rest.join('\n').trim();
    if (text.length < 40) continue;
    const title = head.trim() === pageTitle ? pageTitle : `${pageTitle} — ${head.trim()}`;
    for (let i = 0; i < text.length; i += 1400) {
      const piece = text.slice(i, i + 1400);
      out.push({ url, title, text: piece, stems: stems(title + ' ' + piece) });
    }
  }
  return out;
}

async function build(origin: string): Promise<Chunk[]> {
  const all: Chunk[] = [];
  await Promise.all(PAGES.map(async (path) => {
    try {
      const res = await fetch(origin + path, { headers: { 'x-chat-crawl': '1' }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (res.ok) all.push(...pageChunks(path, await res.text()));
    } catch { /* страница не отговори — пропускаме */ }
  }));
  return all;
}

export async function getChunks(origin: string): Promise<Chunk[]> {
  if (cache && Date.now() - cache.at < 30 * 60_000) return cache.chunks;
  if (!building) {
    building = build(origin).then((c) => {
      if (c.length) cache = { at: Date.now(), chunks: c };
      building = null;
      return c.length ? c : cache?.chunks ?? [];
    });
  }
  return building;
}

export function pick(chunks: Chunk[], question: string, k = 7): Chunk[] {
  const q = stems(question);
  if (!q.size) return [];
  return chunks
    .map((c) => {
      let s = 0;
      for (const w of q) if (c.stems.has(w)) s += 1;
      for (const w of stems(c.title)) if (q.has(w)) s += 1.5;
      return { c, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.c);
}

// Основните данни — винаги в подсказката (от ЕИС → Сайт → Настройки, новини, събития)
export async function coreFacts(): Promise<string> {
  const [info, news, events] = await Promise.all([getSiteInfo(), getNews(8), getUpcomingEvents(5)]);
  const c = info.contact, h = info.hours;
  const lines = [
    `Име: Център за специална образователна подкрепа (ЦСОП) – Варна. Адрес: ${c.address}, ${c.city}.`,
    `Телефон (деловодство): ${c.phone}. Имейл: ${c.email}. Facebook: ${c.facebook}`,
    `Работно време: центърът ${h.center} (пон–пет); администрация и деловодство ${h.admin}; приемно време на директора: ${h.director}.`,
    `Телефони: ${info.phones.map((p) => `${p.name} (${p.role}) ${p.phone}`).join('; ')}.`,
    `Дарения: получател ${info.bank.to}, IBAN ${info.bank.iban}, BIC ${info.bank.bic}, основание „${info.bank.reason}“. Повече: /daritelstvo`,
    `Сигнали (ЗЗЛПСПОИН): отговорно лице ${info.signali.person}, ${info.signali.email}. Повече: /podavane-na-signali`,
    `Английска версия на сайта: /en`,
  ];
  if (events.length) lines.push('Предстоящи събития: ' + events.map((e) => `${fmtDate(e.event_date)} – ${e.title}${e.event_time ? `, ${e.event_time} ч.` : ''}${e.location ? `, ${e.location}` : ''}`).join('; ') + '. Всички: /sabitiya');
  if (news.length) lines.push('Последни новини: ' + news.map((n) => `${fmtDate(n.published_at)} – „${n.title}“ (/novini/${n.slug})`).join('; ') + '. Всички: /novini');
  return lines.join('\n');
}
