import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

// Абонамент за нови обяви за работа → таблица job_subscribers в D1.
export const dynamic = 'force-dynamic';

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

export async function POST(req: Request) {
  let email = '';
  try { email = String(((await req.json()) as any).email || '').trim().toLowerCase().slice(0, 200); } catch { /* празно */ }
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: 'email' }, { status: 400 });

  const d = await db();
  if (!d) return NextResponse.json({ ok: false, error: 'db' }, { status: 503 });
  const r = await d.prepare('INSERT OR IGNORE INTO job_subscribers (email) VALUES (?)').bind(email).run();
  return NextResponse.json({ ok: true, dup: r.meta.changes === 0 });
}
