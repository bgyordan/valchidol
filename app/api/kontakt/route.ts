import { NextResponse } from 'next/server';
import { sendMail, mailConfigured } from '../../../lib/mail';

// Контактната форма на сайта → писмо от MAIL_FROM до CONTACT_TO (по подразбиране имейлът на училището).
// Защита от спам: скрито поле (ботовете го попълват), минимално време за попълване, ограничение по IP.
export const dynamic = 'force-dynamic';

const TOPICS: Record<string, string> = {
  general: 'Общ въпрос',
  admission: 'Прием',
  docs: 'Документи и удостоверения',
  site: 'Сайт / технически проблем',
  other: 'Друго',
};

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) hits.clear();
  return recent.length > 5; // до 5 писма за 10 минути от един адрес
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'bad' }, { status: 400 }); }

  // бот: попълнено скрито поле или формата е изпратена за под 3 секунди → тихо „успех“, без писмо
  const started = Number(b.t) || 0;
  if (str(b.website, 200) || !started || Date.now() - started < 3000) return NextResponse.json({ ok: true });

  // зад Cloudflare тунела истинският адрес е в cf-connecting-ip
  const ip = req.headers.get('cf-connecting-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });

  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const phone = str(b.phone, 40);
  const message = str(b.message, 5000);
  const topic = TOPICS[str(b.topic, 20)] || TOPICS.general;
  const lang = b.lang === 'en' ? 'en' : 'bg';
  if (!name || !EMAIL.test(email) || message.length < 5 || b.consent !== true) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (!mailConfigured()) {
    console.error('[kontakt] липсват GMAIL_* в .env.local — писмото не е изпратено');
    return NextResponse.json({ ok: false, error: 'config' }, { status: 503 });
  }

  const when = new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
  const text = [
    `Съобщение от контактната форма на souvalchidol.com${lang === 'en' ? ' (английската версия)' : ''}`,
    '',
    `Тема: ${topic}`,
    `Име: ${name}`,
    `Имейл: ${email}`,
    ...(phone ? [`Телефон: ${phone}`] : []),
    `Изпратено: ${when}`,
    '',
    '────────────────────',
    message,
    '────────────────────',
    '',
    'Отговорете направо на това писмо — отговорът отива до подателя.',
  ].join('\n');

  try {
    await sendMail({
      to: process.env.CONTACT_TO || 'info-400112@edu.mon.bg',
      replyTo: email,
      subject: `[Сайт] ${topic} — ${name}`,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'send' }, { status: 502 });
  }
}
