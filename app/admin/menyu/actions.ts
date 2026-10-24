'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { NAV } from '../../components/nav';

// Главното меню → site_settings.menu. Полета във формата (k е номерът на раздела, j на връзката):
//   g{k}_pos, g{k}_label, g{k}_hide, g{k}_l{j}_pos, g{k}_l{j}_label, g{k}_l{j}_hide
// Номерът определя реда; за всеки раздел/връзка от кода — href от NAV по същия номер.
const tx = (f: FormData, k: string, max = 80) => String(f.get(k) ?? '').trim().slice(0, max);
const num = (f: FormData, k: string, d: number) => { const n = parseFloat(String(f.get(k) ?? '')); return Number.isFinite(n) ? n : d; };

export async function saveMenu(f: FormData) {
  await requireAdmin();
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  const groups = NAV.map((g, k) => {
    const links = g.links.map((l, j) => ({
      href: l.href,
      label: tx(f, `g${k}_l${j}_label`) || undefined,
      hidden: f.get(`g${k}_l${j}_hide`) === '1' || undefined,
      pos: num(f, `g${k}_l${j}_pos`, j + 1),
    }));
    return {
      href: g.href,
      label: tx(f, `g${k}_label`) || undefined,
      hidden: f.get(`g${k}_hide`) === '1' || undefined,
      pos: num(f, `g${k}_pos`, k + 1),
      links: links.sort((a, b) => a.pos - b.pos).map(({ pos, ...l }) => l),
    };
  }).sort((a, b) => a.pos - b.pos).map(({ pos, ...g }) => g);
  await d.prepare(`INSERT INTO site_settings (key, value) VALUES ('menu', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .bind(JSON.stringify({ groups })).run();
  revalidatePath('/', 'layout');
}

export async function resetMenu() {
  await requireAdmin();
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  await d.prepare(`DELETE FROM site_settings WHERE key = 'menu'`).run();
  revalidatePath('/', 'layout');
}
