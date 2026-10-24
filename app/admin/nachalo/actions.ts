'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../../lib/auth';
import { db, first, json } from '../../../lib/db';
import { deleteFile, isFile, uploadFile } from '../../../lib/files';

// Снимки за началната страница: „hero“ → site_settings.hero_photos,
// друго (напр. „nachalna-pod“) → site_settings.page_photos[<ключ>].
type Target = 'hero' | 'nachalna-pod';
const target = (f: FormData): Target => (f.get('target') === 'nachalna-pod' ? 'nachalna-pod' : 'hero');

async function read(t: Target): Promise<{ list: string[]; all: Record<string, unknown> }> {
  const key = t === 'hero' ? 'hero_photos' : 'page_photos';
  const raw = json<unknown>((await first<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', key))?.value, null);
  if (t === 'hero') return { list: Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [], all: {} };
  const all = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const l = all[t];
  return { list: Array.isArray(l) ? l.filter((x): x is string => typeof x === 'string') : [], all };
}

async function write(t: Target, list: string[], all: Record<string, unknown>) {
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  const key = t === 'hero' ? 'hero_photos' : 'page_photos';
  const value = t === 'hero' ? list : { ...all, [t]: list };
  await d.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(key, JSON.stringify(value)).run();
  revalidatePath('/', 'layout');
}

export async function addHomePhotos(f: FormData) {
  await requireAdmin();
  const t = target(f);
  const { list, all } = await read(t);
  for (const file of f.getAll('photos')) if (isFile(file)) list.push(await uploadFile(file, 'nachalo'));
  const link = String(f.get('link') ?? '').trim();
  if (/^https?:\/\//.test(link) || link.startsWith('/files/')) list.push(link);
  await write(t, list, all);
}

export async function removeHomePhoto(f: FormData) {
  await requireAdmin();
  const t = target(f);
  const url = String(f.get('url') ?? '');
  const { list, all } = await read(t);
  await write(t, list.filter((u) => u !== url), all);
  await deleteFile(url);
}

export async function moveHomePhoto(f: FormData) {
  await requireAdmin();
  const t = target(f);
  const url = String(f.get('url') ?? '');
  const dir = f.get('dir') === 'up' ? -1 : 1;
  const { list, all } = await read(t);
  const i = list.indexOf(url);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await write(t, list, all);
}

// Текстове, бързи връзки и числа → site_settings.home. Празните редове се махат.
const tx = (f: FormData, k: string, max = 300) => String(f.get(k) ?? '').trim().slice(0, max);

export async function saveHomeTexts(f: FormData) {
  await requireAdmin();
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  const quick = [], stats = [];
  for (let i = 0; i < 12; i++) {
    const t = tx(f, `q_t${i}`, 60), href = tx(f, `q_h${i}`, 500);
    if (t && href) quick.push({ t, href, icon: tx(f, `q_i${i}`, 20) || 'folder' });
  }
  for (let i = 0; i < 8; i++) {
    const n = tx(f, `s_n${i}`, 20);
    if (n) stats.push({ n, t: tx(f, `s_t${i}`, 80) });
  }
  const home = {
    kicker: tx(f, 'kicker', 120), title: tx(f, 'title', 120), motto: tx(f, 'motto', 200),
    about_title: tx(f, 'about_title', 200), about_text: tx(f, 'about_text', 3000),
    quick, stats,
  };
  await d.prepare(`INSERT INTO site_settings (key, value) VALUES ('home', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`)
    .bind(JSON.stringify(home)).run();
  revalidatePath('/', 'layout');
}
