import { NextResponse } from 'next/server';
import { getChunks, pick, coreFacts } from '../../../lib/chat/knowledge';

// Чатбот „Помощник на ЦСОП“ — Gemini API, ключът е само на сървъра (.env.local):
//   GEMINI_API_KEY=...            (задължително; без него бутонът на чата не се показва)
//   GEMINI_MODEL=gemini-flash-latest   (по желание)
//   SITE_INTERNAL_URL=http://127.0.0.1:3001   (по желание — откъде ботът чете страниците)
export const dynamic = 'force-dynamic';

const hits = new Map<string, number[]>();
let day = { d: '', n: 0 };
function limited(ip: string) {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  if (day.d !== today) day = { d: today, n: 0 };
  if (++day.n > 1500) return true; // общ таван за денонощие (пазим ключа и квотата)
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 3000) hits.clear();
  return recent.length > 20; // до 20 въпроса за 10 минути от един адрес
}

type Msg = { role: 'user' | 'assistant'; text: string };

const RULES = `Ти си „Помощник на ЦСОП Варна“ — виртуален помощник в сайта на Център за специална образователна подкрепа – Варна. Пишат ти родители, учители и посетители.
Правила:
1. Отговаряй САМО по информацията в „ОСНОВНИ ДАННИ“ и „ОТ САЙТА“ по-долу. Ако отговорът го няма там, кажи честно, че нямаш тази информация, и насочи към телефона или имейла на центъра. Никога не измисляй телефони, имена, дати, суми, срокове или процедури.
2. Кратко и ясно: обикновено 1–4 изречения. Обикновен текст — без markdown, без звездички, без заглавия. Ако има стъпки, номерирай ги с 1., 2., 3.
3. Когато е полезно, посочи страница от сайта с относителния ѝ адрес, например /priem/proczedura. Не измисляй адреси — само такива от данните.
4. Отговаряй на езика на въпроса (български или английски). На английски изписвай имената на латиница.
5. Не давай медицински, психологически или правни преценки за конкретно дете — насочи към специалистите на центъра.
6. Не искай лични данни. Ако някой сподели данни за дете (име, диагноза, ЕГН), не ги повтаряй и кажи, че такива въпроси се обсъждат лично със специалистите.
7. Ти не приемаш записвания, заявления, жалби или сигнали — обясни как става и дай страницата (/priem/proczedura, /kontakti, /podavane-na-signali).
8. Бъди топъл, спокоен и уважителен; обръщай се с „Вие“.
9. Ако въпросът няма връзка с центъра, учтиво кажи, че помагаш само с информация за ЦСОП Варна.`;

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: 'config' }, { status: 503 });

  let b: { messages?: Msg[]; lang?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'bad' }, { status: 400 }); }
  const raw = (Array.isArray(b.messages) ? b.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({ role: m.role, text: m.text.trim().slice(0, m.role === 'user' ? 600 : 1500) }));
  // остават само въпроси, които имат отговор, плюс последния въпрос — стар въпрос без отговор
  // (напр. при грешка) не бива да „изпревари“ новия
  const msgs: Msg[] = [];
  raw.forEach((m, i) => {
    const isLast = i === raw.length - 1;
    if (m.role === 'user' && !isLast && raw[i + 1]?.role !== 'assistant') return;
    if (m.role === 'assistant' && msgs[msgs.length - 1]?.role !== 'user') return;
    msgs.push(m);
  });
  msgs.splice(0, Math.max(0, msgs.length - 10));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const last = msgs[msgs.length - 1];
  if (!last || last.role !== 'user' || !last.text) return NextResponse.json({ ok: false, error: 'bad' }, { status: 400 });

  const ip = req.headers.get('cf-connecting-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });

  const origin = process.env.SITE_INTERNAL_URL || (process.env.PORT ? `http://127.0.0.1:${process.env.PORT}` : new URL(req.url).origin);
  // търсим по последния въпрос; ако е много кратък („а за събота?“), добавяме и предишния
  const users = msgs.filter((m) => m.role === 'user');
  const lastQ = users[users.length - 1]?.text || '';
  const userText = lastQ.split(/\s+/).length < 4 && users.length > 1 ? users[users.length - 2].text + ' ' + lastQ : lastQ;
  const [chunks, core] = await Promise.all([getChunks(origin), coreFacts()]);
  const found = pick(chunks, userText);
  const today = new Date().toLocaleDateString('bg-BG', { timeZone: 'Europe/Sofia', day: 'numeric', month: 'long', year: 'numeric' });
  const system = [
    RULES,
    `Днес е ${today}.${b.lang === 'en' ? ' Посетителят е в английската версия на сайта — по подразбиране отговаряй на английски.' : ''}`,
    'ОСНОВНИ ДАННИ:\n' + core,
    'ОТ САЙТА:\n' + (found.length ? found.map((c) => `[${c.title} | ${c.url}]\n${c.text}`).join('\n\n') : '(няма намерени откъси за този въпрос)'),
  ].join('\n\n');

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    });
    const j: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[chat] gemini', res.status, JSON.stringify(j?.error || {}).slice(0, 300));
      return NextResponse.json({ ok: false, error: res.status === 429 ? 'busy' : 'ai' }, { status: 502 });
    }
    const reply = (j?.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || '').join('').trim();
    if (!reply) return NextResponse.json({ ok: false, error: 'ai' }, { status: 502 });
    // без markdown — звездички и решетки махаме, ако моделът все пак ги сложи
    // без markdown: [текст](адрес) → адресът (на сайта — относителен), звездички и решетки — махаме
    const clean = reply
      .replace(/\[([^\]]*)\]\((https?:\/\/(?:www\.)?csop-varna\.bg)?([^)\s]*)\)/g, (_m: string, txt: string, own: string | undefined, url: string) => {
        const path = own ? url || '/' : url;
        return txt.startsWith('/') || txt === path ? path : `${txt} (${path})`;
      })
      .replace(/\*\*?|^#+\s*/gm, '');
    return NextResponse.json({ ok: true, reply: clean });
  } catch (e) {
    console.error('[chat]', String(e).slice(0, 200));
    return NextResponse.json({ ok: false, error: 'ai' }, { status: 502 });
  }
}
