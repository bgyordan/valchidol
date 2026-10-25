'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../../lib/auth';
import { db, first, json } from '../../../lib/db';

// Записва site_settings.site_info: съобщение най-горе, контакти, работно време. Другите полета остават.
const s = (f: FormData, k: string, max = 300) => String(f.get(k) ?? '').trim().slice(0, max);

export async function saveSiteInfo(f: FormData) {
  await requireAdmin('nastroyki');
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  const old = json<Record<string, unknown>>((await first<{ value: string }>(`SELECT value FROM site_settings WHERE key = 'site_info'`))?.value, {});

  const info = {
    ...old,
    notice: { on: f.get('notice_on') === '1', text: s(f, 'notice_text', 400), link: s(f, 'notice_link'), until: s(f, 'notice_until', 10) },
    contact: { address: s(f, 'address'), city: s(f, 'city'), email: s(f, 'email'), phone: s(f, 'phone', 40), facebook: s(f, 'facebook', 500) },
    hours: { ...(old.hours as object || {}), admin: s(f, 'h_admin'), director: s(f, 'h_director') },
  };
  await d.prepare(`INSERT INTO site_settings (key, value) VALUES ('site_info', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .bind(JSON.stringify(info)).run();
  revalidatePath('/', 'layout');
}
