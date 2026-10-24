import { unstable_noStore as noStore } from 'next/cache';
import { db } from './supabase';

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
  const s = db();
  if (!s) return [];
  try {
    let q = s
      .from('site_news')
      .select('id, title, excerpt, cover_url, category, published_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString()) // насрочените излизат чак в уречения час
      .order('published_at', { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data ?? []).map((n: any) => ({ ...n, slug: n.id }));
  } catch {
    return [];
  }
}

export type Article = NewsCard & {
  content: string | null;
  gallery_images: string[];
  author_name: string | null;
};

export async function getArticle(id: string): Promise<Article | null> {
  noStore();
  const s = db();
  if (!s) return null;
  try {
    const { data, error } = await s
      .from('site_news')
      .select('id, title, excerpt, content, cover_url, gallery_images, category, published_at, status, staff_profiles(first_name, last_name)')
      .eq('id', id)
      .single();
    if (error || !data || data.status !== 'published') return null;
    if (data.published_at && new Date(data.published_at) > new Date()) return null; // още е насрочена
    const a = (data as any).staff_profiles;
    return {
      id: data.id,
      slug: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      cover_url: data.cover_url,
      gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
      category: data.category,
      published_at: data.published_at,
      author_name: a ? `${a.first_name} ${a.last_name}` : null,
    };
  } catch {
    return null;
  }
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
  const s = db();
  if (!s) return [];
  try {
    const { data } = await s.from('site_events').select('*').order('event_date', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
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
  const s = db();
  if (!s) return { albums: [], photos: [] };
  try {
    const [{ data: a }, { data: p }] = await Promise.all([
      s.from('gallery_albums').select('id, title, cover_url, event_date')
        .order('sort_order', { ascending: true }).order('event_date', { ascending: false }),
      s.from('gallery_photos').select('id, album_id, photo_url, caption').order('sort_order', { ascending: true }),
    ]);
    const photos: Photo[] = p ?? [];
    const albums: Album[] = (a ?? []).map((x: any) => ({ ...x, photo_count: photos.filter((ph) => ph.album_id === x.id).length }));
    return { albums, photos };
  } catch {
    return { albums: [], photos: [] };
  }
}

export async function getLatestPhotos(limit = 8): Promise<{ id: string; photo_url: string; caption: string | null }[]> {
  noStore();
  const s = db();
  if (!s) return [];
  try {
    const { data } = await s.from('gallery_photos').select('id, photo_url, caption').order('created_at', { ascending: false }).limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

/* ---------------- Снимки по страниците (от ЕИС → „Снимки за сайта“) ----------------
   site_settings:
     key 'hero_photos' → ["url", ...]               (началната страница)
     key 'page_photos' → { "za-nas": ["url", ...], "priem": [...], ... }
*/
export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  noStore();
  const s = db();
  if (!s) return null;
  try {
    const { data } = await s.from('site_settings').select('value').eq('key', key).maybeSingle();
    return (data?.value as T) ?? null;
  } catch {
    return null;
  }
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

/* ---------------- Документи (от ЕИС → „Сайт“) ---------------- */
export type DocRow = {
  id: string;
  name: string;
  file_url: string;
  academic_year: string | null;
  section: string;
  sort_order: number;
  category?: string | null;
  on_site?: boolean;
};

export async function getDocuments(section: string, onlyOnSite = false): Promise<DocRow[]> {
  noStore();
  const s = db();
  if (!s) return [];
  try {
    let q = s
      .from('site_documents')
      .select('id, name, file_url, academic_year, section, sort_order, category, on_site')
      .eq('section', section);
    if (onlyOnSite) q = q.eq('on_site', true);
    const { data } = await q.order('academic_year', { ascending: false }).order('sort_order', { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

// Екипът: от изгледа public_team в базата (служителите в ЕИС). null → сайтът ползва вградения списък.
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
  const s = db();
  if (!s) return null;
  try {
    const { data, error } = await s.from('public_team').select('name, grp, title, sort');
    if (error || !data?.length) return null;
    return TEAM_GROUPS.map((g) => ({
      label: g.label,
      compact: g.compact,
      members: data
        .filter((r: any) => r.grp === g.key)
        .map((r: any) => ({ name: r.name as string, role: r.title as string, tone: teamTone(g.key, r.title || '') })),
    })).filter((g) => g.members.length > 0);
  } catch {
    return null;
  }
}
