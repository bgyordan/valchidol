'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '../../lib/auth';
import { db } from '../../lib/db';
import { deleteFile, isFile, slugify, uploadFile } from '../../lib/files';
import { sofiaToIso } from '../../lib/sofia';

const str = (f: FormData, k: string, max = 500) => String(f.get(k) ?? '').trim().slice(0, max);
const opt = (f: FormData, k: string, max = 500) => str(f, k, max) || null;
const num = (f: FormData, k: string) => Number(f.get(k)) || 0;

async function D() {
  const d = await db();
  if (!d) throw new Error('Няма връзка с базата');
  return d;
}

/* ---------------- Новини ---------------- */
export async function saveNews(f: FormData) {
  const me = await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 120);
  const title = str(f, 'title', 300);
  if (!title) throw new Error('Липсва заглавие');

  const old = id ? await d.prepare('SELECT cover_url, gallery_images FROM site_news WHERE id = ?').bind(id).first<{ cover_url: string | null; gallery_images: string }>() : null;
  let cover = old?.cover_url ?? null;
  if (f.get('remove_cover') === '1') { await deleteFile(cover); cover = null; }
  const coverFile = f.get('cover');
  if (isFile(coverFile)) { await deleteFile(cover); cover = await uploadFile(coverFile, 'novini'); }

  let gallery: string[] = old ? JSON.parse(old.gallery_images || '[]') : [];
  const drop = new Set(f.getAll('remove_gallery').map(String));
  for (const u of drop) await deleteFile(u);
  gallery = gallery.filter((u) => !drop.has(u));
  for (const g of f.getAll('gallery')) if (isFile(g)) gallery.push(await uploadFile(g, 'novini'));

  const status = f.get('status') === 'published' ? 'published' : 'draft';
  const publishedAt = sofiaToIso(str(f, 'published_at', 20)) ?? (status === 'published' ? new Date().toISOString() : null);
  const vals = [title, opt(f, 'excerpt', 600), opt(f, 'content', 50000), cover, JSON.stringify(gallery), str(f, 'category', 60) || 'Новини', status, publishedAt, opt(f, 'author_name', 120) ?? me.email];

  if (old) {
    await d.prepare(`UPDATE site_news SET title=?, excerpt=?, content=?, cover_url=?, gallery_images=?, category=?, status=?, published_at=?, author_name=? WHERE id=?`).bind(...vals, id).run();
  } else {
    // адресът на новината: латиница от заглавието + кратък код
    const newId = `${slugify(title).replace(/\./g, '-').slice(0, 60)}-${crypto.randomUUID().slice(0, 4)}`;
    await d.prepare(`INSERT INTO site_news (title, excerpt, content, cover_url, gallery_images, category, status, published_at, author_name, id) VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(...vals, newId).run();
  }
  revalidatePath('/', 'layout');
  redirect('/admin/novini');
}

export async function deleteNews(f: FormData) {
  await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 120);
  const row = await d.prepare('SELECT cover_url, gallery_images FROM site_news WHERE id = ?').bind(id).first<{ cover_url: string | null; gallery_images: string }>();
  if (row) {
    await deleteFile(row.cover_url);
    for (const u of JSON.parse(row.gallery_images || '[]')) await deleteFile(u);
    await d.prepare('DELETE FROM site_news WHERE id = ?').bind(id).run();
  }
  revalidatePath('/', 'layout');
  redirect('/admin/novini');
}

/* ---------------- Документи ---------------- */
// Нов документ без номер за подредба → най-горе в своята група (най-новото първо).
// Нова група → след всички групи на страницата за тази година.
async function nextOrder(d: Awaited<ReturnType<typeof D>>, section: string, year: string | null, cat: string | null) {
  const inCat = await d.prepare(`SELECT MIN(sort_order) AS m FROM site_documents WHERE section = ? AND IFNULL(academic_year,'') = ? AND IFNULL(category,'') = ?`)
    .bind(section, year ?? '', cat ?? '').first<{ m: number | null }>();
  if (inCat?.m != null) return inCat.m - 1;
  const all = await d.prepare(`SELECT MAX(sort_order) AS m FROM site_documents WHERE section = ? AND IFNULL(academic_year,'') = ?`)
    .bind(section, year ?? '').first<{ m: number | null }>();
  return (all?.m ?? 0) + 10;
}

export async function addDocument(f: FormData) {
  await requireAdmin();
  const d = await D();
  const file = f.get('file');
  const link = str(f, 'link', 1000);
  if (!isFile(file) && !link) throw new Error('Изберете файл или поставете връзка');
  const url = isFile(file) ? await uploadFile(file, 'dokumenti') : link;
  const name = str(f, 'name', 300) || (isFile(file) ? file.name.replace(/\.[^.]+$/, '') : link);
  const section = str(f, 'section', 60) || 'dokumentatsiya';
  const year = opt(f, 'academic_year', 20), cat = opt(f, 'category', 60);
  const order = str(f, 'sort_order', 10) ? num(f, 'sort_order') : await nextOrder(d, section, year, cat);
  await d.prepare(`INSERT INTO site_documents (id, name, file_url, academic_year, section, category, sort_order, on_site) VALUES (?,?,?,?,?,?,?,?)`)
    .bind(crypto.randomUUID(), name, url, year, section, cat, order, f.get('on_site') === '1' ? 1 : 0).run();
  revalidatePath('/', 'layout');
  redirect(`/admin/dokumenti?page=${encodeURIComponent(section)}${cat ? `&cat=${encodeURIComponent(cat)}` : ''}`);
}

export async function updateDocument(f: FormData) {
  await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 60);
  const name = str(f, 'name', 300);
  if (!name) throw new Error('Липсва име');
  // нов файл (или връзка) на мястото на стария
  const file = f.get('file');
  const link = str(f, 'link', 1000);
  let url: string | null = null;
  if (isFile(file) || link) {
    const old = await d.prepare('SELECT file_url FROM site_documents WHERE id = ?').bind(id).first<{ file_url: string }>();
    url = isFile(file) ? await uploadFile(file, 'dokumenti') : link;
    await deleteFile(old?.file_url);
  }
  await d.prepare('UPDATE site_documents SET name=?, academic_year=?, category=?, sort_order=?, on_site=?, file_url=COALESCE(?, file_url) WHERE id=?')
    .bind(name, opt(f, 'academic_year', 20), opt(f, 'category', 60), num(f, 'sort_order'), f.get('on_site') === '1' ? 1 : 0, url, id).run();
  revalidatePath('/', 'layout');
}

// Преименува група за цялата страница (напр. „Училищна документация“ → „Правилници и планове“).
export async function renameDocGroup(f: FormData) {
  await requireAdmin();
  const d = await D();
  await d.prepare('UPDATE site_documents SET category=? WHERE section=? AND category=?')
    .bind(opt(f, 'to', 60), str(f, 'section', 60), str(f, 'from', 60)).run();
  revalidatePath('/', 'layout');
}

export async function deleteDocument(f: FormData) {
  await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 60);
  const row = await d.prepare('SELECT file_url FROM site_documents WHERE id = ?').bind(id).first<{ file_url: string }>();
  if (row) { await deleteFile(row.file_url); await d.prepare('DELETE FROM site_documents WHERE id = ?').bind(id).run(); }
  revalidatePath('/', 'layout');
}

/* ---------------- Галерия ---------------- */
export async function createAlbum(f: FormData) {
  await requireAdmin();
  const d = await D();
  const title = str(f, 'title', 200);
  if (!title) throw new Error('Липсва заглавие');
  const id = crypto.randomUUID();
  await d.prepare('INSERT INTO gallery_albums (id, title, event_date) VALUES (?,?,?)').bind(id, title, opt(f, 'event_date', 10)).run();
  redirect(`/admin/galeriya/${id}`);
}

export async function updateAlbum(f: FormData) {
  await requireAdmin();
  const d = await D();
  await d.prepare('UPDATE gallery_albums SET title=?, event_date=?, sort_order=? WHERE id=?')
    .bind(str(f, 'title', 200), opt(f, 'event_date', 10), num(f, 'sort_order'), str(f, 'id', 60)).run();
  revalidatePath('/', 'layout');
}

export async function addPhotos(f: FormData) {
  await requireAdmin();
  const d = await D();
  const album = str(f, 'album_id', 60);
  const max = await d.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM gallery_photos WHERE album_id = ?').bind(album).first<{ m: number }>();
  let n = max?.m ?? 0;
  let firstUrl: string | null = null;
  for (const p of f.getAll('photos')) {
    if (!isFile(p)) continue;
    const url = await uploadFile(p, 'galeriya');
    firstUrl ??= url;
    await d.prepare('INSERT INTO gallery_photos (id, album_id, photo_url, sort_order) VALUES (?,?,?,?)').bind(crypto.randomUUID(), album, url, ++n).run();
  }
  // първата качена снимка става корица, ако албумът още няма
  if (firstUrl) await d.prepare('UPDATE gallery_albums SET cover_url = ? WHERE id = ? AND cover_url IS NULL').bind(firstUrl, album).run();
  revalidatePath('/', 'layout');
}

export async function photoAction(f: FormData) {
  await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 60);
  const p = await d.prepare('SELECT album_id, photo_url FROM gallery_photos WHERE id = ?').bind(id).first<{ album_id: string; photo_url: string }>();
  if (!p) return;
  const what = str(f, 'do', 20);
  if (what === 'cover') {
    await d.prepare('UPDATE gallery_albums SET cover_url = ? WHERE id = ?').bind(p.photo_url, p.album_id).run();
  } else if (what === 'caption') {
    await d.prepare('UPDATE gallery_photos SET caption = ? WHERE id = ?').bind(opt(f, 'caption', 300), id).run();
  } else if (what === 'delete') {
    await deleteFile(p.photo_url);
    await d.prepare('DELETE FROM gallery_photos WHERE id = ?').bind(id).run();
    await d.prepare('UPDATE gallery_albums SET cover_url = NULL WHERE id = ? AND cover_url = ?').bind(p.album_id, p.photo_url).run();
  }
  revalidatePath('/', 'layout');
}

export async function deleteAlbum(f: FormData) {
  await requireAdmin();
  const d = await D();
  const id = str(f, 'id', 60);
  const { results } = await d.prepare('SELECT photo_url FROM gallery_photos WHERE album_id = ?').bind(id).all<{ photo_url: string }>();
  for (const r of results ?? []) await deleteFile(r.photo_url);
  await d.batch([
    d.prepare('DELETE FROM gallery_photos WHERE album_id = ?').bind(id),
    d.prepare('DELETE FROM gallery_albums WHERE id = ?').bind(id),
  ]);
  revalidatePath('/', 'layout');
  redirect('/admin/galeriya');
}

/* ---------------- Събития ---------------- */
export async function addEvent(f: FormData) {
  await requireAdmin();
  const d = await D();
  const title = str(f, 'title', 200);
  const date = str(f, 'event_date', 10);
  if (!title || !date) throw new Error('Липсва заглавие или дата');
  await d.prepare('INSERT INTO site_events (id, title, event_date, event_time, location, description) VALUES (?,?,?,?,?,?)')
    .bind(crypto.randomUUID(), title, date, opt(f, 'event_time', 20), opt(f, 'location', 200), opt(f, 'description', 2000)).run();
  revalidatePath('/', 'layout');
}

export async function deleteEvent(f: FormData) {
  await requireAdmin();
  const d = await D();
  await d.prepare('DELETE FROM site_events WHERE id = ?').bind(str(f, 'id', 60)).run();
  revalidatePath('/', 'layout');
}

/* ---------------- Текстови страници ---------------- */
export async function savePage(f: FormData) {
  await requireAdmin();
  const d = await D();
  const isNew = f.get('new') === '1';
  const slug = isNew
    ? str(f, 'slug', 120).toLowerCase().split('/').map((p) => slugify(p).replace(/\./g, '-')).filter(Boolean).join('/')
    : str(f, 'slug', 120);
  const title = str(f, 'title', 200);
  if (!slug || !title) throw new Error('Липсва адрес или заглавие');

  const old = await d.prepare('SELECT photos FROM site_pages WHERE slug = ?').bind(slug).first<{ photos: string }>();
  if (isNew && old) throw new Error('Вече има страница с този адрес');
  let photos: string[] = old ? JSON.parse(old.photos || '[]') : [];
  const drop = new Set(f.getAll('remove_photo').map(String));
  for (const u of drop) await deleteFile(u);
  photos = photos.filter((u) => !drop.has(u));
  for (const p of f.getAll('photos')) if (isFile(p)) photos.push(await uploadFile(p, 'stranitsi'));

  const body = String(f.get('body') ?? '').replace(/\r/g, '').slice(0, 400000);
  if (old) {
    await d.prepare(`UPDATE site_pages SET title=?, grp=?, body=?, photos=?, updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE slug=?`)
      .bind(title, opt(f, 'grp', 30), body, JSON.stringify(photos), slug).run();
  } else {
    await d.prepare('INSERT INTO site_pages (slug, title, grp, body, photos, sort) VALUES (?,?,?,?,?, (SELECT COALESCE(MAX(sort),0)+1 FROM site_pages))')
      .bind(slug, title, opt(f, 'grp', 30), body, JSON.stringify(photos)).run();
  }
  revalidatePath('/', 'layout');
  redirect('/admin/stranitsi');
}

export async function deletePage(f: FormData) {
  await requireAdmin();
  const d = await D();
  const slug = str(f, 'slug', 120);
  const row = await d.prepare('SELECT photos FROM site_pages WHERE slug = ?').bind(slug).first<{ photos: string }>();
  if (row) {
    for (const u of JSON.parse(row.photos || '[]')) await deleteFile(u);
    await d.prepare('DELETE FROM site_pages WHERE slug = ?').bind(slug).run();
  }
  revalidatePath('/', 'layout');
  redirect('/admin/stranitsi');
}
