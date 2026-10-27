import { unstable_noStore as noStore } from 'next/cache';
import { all, first, json } from './db';

/* ---------------- Новини ---------------- */
export type NewsCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string;
  published_at: string | null;
};

export async function getNews(limit?: number): Promise<NewsCard[]> {
  noStore();
  // насрочените излизат чак в уречения час
  const rows = await all<Omit<NewsCard, 'slug'>>(
    `SELECT id, title, excerpt, cover_url, category, published_at FROM site_news
     WHERE status = 'published' AND published_at <= ?
     ORDER BY published_at DESC LIMIT ?`,
    new Date().toISOString(), limit ?? -1,
  );
  return rows.map((n) => ({ ...n, slug: n.id }));
}

export type Article = NewsCard & {
  content: string | null;
  gallery_images: string[];
  author_name: string | null;
};

export async function getArticle(id: string): Promise<Article | null> {
  noStore();
  const d = await first<any>(
    `SELECT id, title, excerpt, content, cover_url, gallery_images, category, published_at, author_name
     FROM site_news WHERE id = ? AND status = 'published' AND published_at <= ?`,
    id, new Date().toISOString(),
  );
  if (!d) return null;
  const g = json<unknown>(d.gallery_images, []);
  return { ...d, slug: d.id, gallery_images: Array.isArray(g) ? g.filter((x): x is string => typeof x === 'string') : [] };
}

/* ---------------- Събития ---------------- */
export type EventItem = {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
};

export async function getEvents(): Promise<EventItem[]> {
  noStore();
  return all<EventItem>('SELECT id, title, event_date, event_time, location, description FROM site_events ORDER BY event_date ASC');
}

export async function getUpcomingEvents(limit = 4): Promise<EventItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  return (await getEvents()).filter((e) => e.event_date >= today).slice(0, limit);
}

/* ---------------- Галерия ---------------- */
export type Album = { id: string; title: string; cover_url: string | null; event_date: string | null; photo_count: number };
export type Photo = { id: string; album_id: string; photo_url: string; caption: string | null };

export async function getGallery(): Promise<{ albums: Album[]; photos: Photo[] }> {
  noStore();
  const [a, photos] = await Promise.all([
    all<Omit<Album, 'photo_count'>>('SELECT id, title, cover_url, event_date FROM gallery_albums ORDER BY sort_order ASC, event_date DESC'),
    all<Photo>('SELECT id, album_id, photo_url, caption FROM gallery_photos ORDER BY sort_order ASC'),
  ]);
  const albums: Album[] = a.map((x) => ({ ...x, photo_count: photos.filter((ph) => ph.album_id === x.id).length }));
  return { albums, photos };
}

export async function getLatestPhotos(limit = 8): Promise<{ id: string; photo_url: string; caption: string | null }[]> {
  noStore();
  return all('SELECT id, photo_url, caption FROM gallery_photos ORDER BY created_at DESC LIMIT ?', limit);
}

/* ---------------- Снимки по страниците ----------------
   site_settings:
     key 'hero_photos' → ["url", ...]               (началната страница)
     key 'page_photos' → { "za-nas": ["url", ...], "priem": [...], ... }
*/
export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  noStore();
  const r = await first<{ value: string }>('SELECT value FROM site_settings WHERE key = ?', key);
  return r ? json<T | null>(r.value, null) : null;
}

export async function getHeroPhotos(): Promise<string[]> {
  const v = await getSetting<unknown>('hero_photos');
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

export async function getPagePhotos(page: string): Promise<string[]> {
  const v = await getSetting<Record<string, unknown>>('page_photos');
  const list = v && typeof v === 'object' ? (v as any)[page] : null;
  return Array.isArray(list) ? list.filter((x: unknown): x is string => typeof x === 'string') : [];
}

/* ---------------- помощни ---------------- */
const MONTHS = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthShort(iso: string): string {
  return MONTHS[new Date(iso).getMonth()].slice(0, 3);
}

/* ---------------- Документи ---------------- */
export type DocRow = {
  id: string;
  name: string;
  file_url: string;
  academic_year: string | null;
  section: string;
  sort_order: number;
  category?: string | null;
  on_site?: boolean;
  archived?: boolean;
};

export async function getDocuments(section: string, onlyOnSite = false): Promise<DocRow[]> {
  noStore();
  // Празните места за новата учебна година (pending) не се показват; докато чакат файл, на тяхно място
  // стои миналогодишният документ — под новата година, в същата група и на същия ред.
  const rows = await all<DocRow & { on_site: number | boolean; archived: number | boolean }>(
    `SELECT d.id, d.name, d.file_url, COALESCE(p.academic_year, d.academic_year) AS academic_year, d.section,
            COALESCE(p.sort_order, d.sort_order) AS sort_order, COALESCE(p.category, d.category) AS category, d.on_site, d.archived
     FROM site_documents d LEFT JOIN site_documents p ON p.prev_id = d.id AND p.pending = 1
     WHERE d.section = ? AND d.pending = 0${onlyOnSite ? ' AND d.on_site = 1' : ''}
     ORDER BY 4 DESC, 6 ASC`,
    section,
  );
  return rows.map((r) => ({ ...r, on_site: !!r.on_site, archived: !!r.archived }));
}

// Екипът: от таблицата team_members. null → сайтът ползва вградения списък.
const TEAM_GROUPS: { key: string; label: string; compact?: boolean }[] = [
  { key: 'admin', label: 'Администрация' },
  { key: 'therapy', label: 'Терапевти и специалисти' },
  { key: 'teachers', label: 'Педагогически екип', compact: true },
  { key: 'educators', label: 'Възпитатели ЦОУД' },
  { key: 'assistants', label: 'Помощник на учителя' },
  { key: 'other', label: 'Помощен персонал' },
];
function teamTone(grp: string, title: string): string {
  const t = title.toLowerCase();
  if (t.startsWith('директор')) return 'dir';
  if (t.includes('психолог')) return 'psy';
  if (t.includes('логопед')) return 'logo';
  if (t.includes('ерготерапевт')) return 'ergo';
  if (t.includes('рехабилитатор') || t.includes('кинезитерапевт')) return 'rehab';
  if (grp === 'teachers') return 'teacher';
  if (grp === 'assistants') return 'logo';
  return 'admin';
}
export async function getTeam(): Promise<{ label: string; compact?: boolean; members: { name: string; role: string; tone: string }[] }[] | null> {
  noStore();
  const data = await all<{ name: string; grp: string; title: string | null }>('SELECT name, grp, title FROM team_members ORDER BY sort ASC');
  if (!data.length) return null;
  return TEAM_GROUPS.map((g) => ({
    label: g.label,
    compact: g.compact,
    members: data
      .filter((r) => r.grp === g.key)
      .map((r) => ({ name: r.name, role: r.title || '', tone: teamTone(g.key, r.title || '') })),
  })).filter((g) => g.members.length > 0);
}

/* ---------------- Текстови страници ---------------- */
export type SitePage = { slug: string; title: string; grp: string | null; body: string; photos: string[]; updated_at: string; has_en?: number };

export async function getPage(slug: string): Promise<SitePage | null> {
  noStore();
  const r = await first<Omit<SitePage, 'photos'> & { photos: string }>("SELECT slug, title, grp, body, photos, updated_at, (title_en IS NOT NULL AND title_en <> '') AS has_en FROM site_pages WHERE slug = ?", slug);
  if (!r) return null;
  const ph = json<unknown>(r.photos, []);
  return { ...r, photos: Array.isArray(ph) ? ph.filter((x): x is string => typeof x === 'string') : [] };
}

// Подстраниците (напр. проектите под „Проекти“) — с първата им снимка за картата.
export async function getChildPages(prefix: string): Promise<{ slug: string; title: string; photo: string | null }[]> {
  noStore();
  const rows = await all<{ slug: string; title: string; photos: string }>('SELECT slug, title, photos FROM site_pages WHERE slug LIKE ? ORDER BY sort', prefix + '/%');
  return rows.map((r) => {
    const ph = json<unknown>(r.photos, []);
    const first = Array.isArray(ph) ? ph.find((x): x is string => typeof x === 'string') : undefined;
    return { slug: r.slug, title: r.title, photo: first ?? null };
  });
}

/* ---------------- английска версия ---------------- */
// Страница на английски: само ако има заглавие на английски (title_en).
export async function getPageEn(slug: string): Promise<SitePage | null> {
  noStore();
  const r = await first<{ slug: string; title: string; grp: string | null; body: string; photos: string; updated_at: string }>(
    `SELECT slug, title_en AS title, grp, COALESCE(body_en, '') AS body, photos, updated_at FROM site_pages WHERE slug = ? AND title_en IS NOT NULL AND title_en <> ''`, slug,
  ).catch(() => null);
  if (!r) return null;
  const ph = json<unknown>(r.photos, []);
  return { ...r, photos: Array.isArray(ph) ? ph.filter((x): x is string => typeof x === 'string') : [] };
}

// Всички страници с английска версия — за менюто и превключвателя БГ/EN.
export async function getEnPages(): Promise<{ slug: string; title: string; grp: string | null; photo: string | null }[]> {
  noStore();
  const rows = await all<{ slug: string; title: string; grp: string | null; photos: string }>(
    `SELECT slug, title_en AS title, grp, photos FROM site_pages WHERE title_en IS NOT NULL AND title_en <> '' ORDER BY sort`,
  ).catch(() => []);
  return rows.map((r) => {
    const ph = json<unknown>(r.photos, []);
    return { slug: r.slug, title: r.title, grp: r.grp, photo: Array.isArray(ph) && typeof ph[0] === 'string' ? ph[0] : null };
  });
}
