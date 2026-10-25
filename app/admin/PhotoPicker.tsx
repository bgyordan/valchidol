import { all } from '../../lib/db';
import SizedImg from './SizedImg';

// „Избери от галерията и новините“: снимки, които вече са в сайта, с отметки (name="pick").
// Стои вътре във формата за снимки; отметнатите се добавят заедно с качените от компютъра.
// min: под тази ширина снимката се отбелязва като „малка“ (за голямата снимка най-горе трябва поне ~1600px)
export default async function PhotoPicker({ exclude = [], min = 1200 }: { exclude?: string[]; min?: number }) {
  const [gal, news] = await Promise.all([
    all<{ photo_url: string; album: string | null }>(
      `SELECT p.photo_url, a.title AS album FROM gallery_photos p LEFT JOIN gallery_albums a ON a.id = p.album_id
       ORDER BY p.created_at DESC LIMIT 120`,
    ).catch(() => []),
    all<{ cover_url: string | null; gallery_images: string | null; title: string }>(
      `SELECT cover_url, gallery_images, title FROM site_news WHERE status = 'published' ORDER BY published_at DESC LIMIT 40`,
    ).catch(() => []),
  ]);
  const skip = new Set(exclude);
  const fromNews: { url: string; t: string }[] = [];
  for (const n of news) {
    let imgs: string[] = [];
    try { imgs = JSON.parse(n.gallery_images || '[]'); } catch { /* */ }
    for (const u of [n.cover_url, ...imgs]) if (u && u.startsWith('/files/') && !skip.has(u) && !fromNews.some((x) => x.url === u)) fromNews.push({ url: u, t: n.title });
  }
  const fromGal = gal.filter((g) => g.photo_url.startsWith('/files/') && !skip.has(g.photo_url));
  if (!fromGal.length && !fromNews.length) return null;
  const grid = (items: { url: string; t: string }[]) => (
    <div className="adm-pick">
      {items.map((x) => (
        <label key={x.url} title={x.t}>
          <input type="checkbox" name="pick" value={x.url} />
          <SizedImg src={x.url} min={min} />
        </label>
      ))}
    </div>
  );
  return (
    <details className="adm-pick-box">
      <summary className="adm-link">…или избери от снимките в сайта</summary>
      {fromGal.length > 0 && <><p className="adm-pick-h">Галерия</p>{grid(fromGal.map((g) => ({ url: g.photo_url, t: g.album || '' })))}</>}
      {fromNews.length > 0 && <><p className="adm-pick-h">Новини</p>{grid(fromNews.slice(0, 120))}</>}
    </details>
  );
}
