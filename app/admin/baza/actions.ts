'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { deleteFile, isFile, uploadFile } from '../../../lib/files';
import { getSpacesRaw, SPACE_ICONS, type Space } from '../../../lib/baza';

// Материална база → site_settings.baza = { spaces: [...] }. Първият запис копира стойностите от кода.
const tx = (f: FormData, k: string, max = 300) => String(f.get(k) ?? '').trim().slice(0, max);

async function write(spaces: Space[]) {
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  await d.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind('baza', JSON.stringify({ spaces })).run();
  revalidatePath('/', 'layout');
}

export async function saveSpace(f: FormData) {
  await requireAdmin('baza');
  const spaces = await getSpacesRaw();
  const s = spaces.find((x) => x.id === tx(f, 'id', 60));
  if (!s) return;
  const removed: string[] = [];
  s.name = tx(f, 'name', 120) || s.name;
  s.text = tx(f, 'text', 2000);
  const icon = tx(f, 'icon', 20);
  if (SPACE_ICONS.some((i) => i.key === icon)) s.icon = icon;
  s.hidden = f.get('hidden') === 'on';
  // снимки: махнатите, качените и избраните от сайта
  const rm = new Set(f.getAll('rm').map(String));
  removed.push(...s.photos.filter((p) => rm.has(p)));
  s.photos = s.photos.filter((p) => !rm.has(p));
  for (const file of f.getAll('photos')) if (isFile(file)) s.photos.push(await uploadFile(file, 'baza'));
  for (const u of f.getAll('pick').map(String)) if (u.startsWith('/files/') && !s.photos.includes(u)) s.photos.push(u);
  // 360° снимка
  const pano = f.get('pano');
  if (isFile(pano)) { if (s.pano) removed.push(s.pano); s.pano = await uploadFile(pano, 'baza'); }
  else if (f.get('pano_rm') === 'on' && s.pano) { removed.push(s.pano); s.pano = null; }
  await write(spaces);
  for (const u of removed) await deleteFile(u, 'baza'); // избрана от галерията/новините снимка не се трие
}

export async function moveSpacePhoto(f: FormData) {
  await requireAdmin('baza');
  const spaces = await getSpacesRaw();
  const s = spaces.find((x) => x.id === tx(f, 'id', 60));
  const url = tx(f, 'url', 500);
  if (!s) return;
  const i = s.photos.indexOf(url);
  if (i <= 0) return;
  s.photos.splice(i, 1);
  s.photos.unshift(url); // става първа (корица)
  await write(spaces);
}

export async function addSpace(f: FormData) {
  await requireAdmin('baza');
  const spaces = await getSpacesRaw();
  const name = tx(f, 'name', 120);
  if (!name) return;
  spaces.push({ id: crypto.randomUUID().slice(0, 8), name, icon: 'class', text: '', photos: [], pano: null });
  await write(spaces);
}

export async function moveSpace(f: FormData) {
  await requireAdmin('baza');
  const spaces = await getSpacesRaw();
  const i = spaces.findIndex((x) => x.id === tx(f, 'id', 60));
  const j = i + (f.get('dir') === 'up' ? -1 : 1);
  if (i < 0 || j < 0 || j >= spaces.length) return;
  [spaces[i], spaces[j]] = [spaces[j], spaces[i]];
  await write(spaces);
}

export async function deleteSpace(f: FormData) {
  await requireAdmin('baza');
  const spaces = await getSpacesRaw();
  const s = spaces.find((x) => x.id === tx(f, 'id', 60));
  if (!s) return;
  await write(spaces.filter((x) => x !== s));
  for (const u of [...s.photos, s.pano]) await deleteFile(u, 'baza');
}
