import Link from 'next/link';
import { all } from '../../../lib/db';
import { fmtDate } from '../../../lib/data';
import { createAlbum } from '../actions';

type Row = { id: string; title: string; cover_url: string | null; event_date: string | null; n: number };

export default async function AdminGallery() {
  const albums = await all<Row>(`SELECT a.id, a.title, a.cover_url, a.event_date, (SELECT COUNT(*) FROM gallery_photos p WHERE p.album_id = a.id) AS n
    FROM gallery_albums a ORDER BY a.sort_order, a.event_date DESC`);
  return (
    <>
      <h1>Галерия</h1>
      <form action={createAlbum} className="adm-form adm-box adm-row">
        <label>Нов албум<input name="title" required placeholder="напр. Първи учебен ден 2026" /></label>
        <label>Дата<input type="date" name="event_date" /></label>
        <button type="submit" className="adm-btn primary">Създай</button>
      </form>
      <div className="adm-albums">
        {albums.map((a) => (
          <Link key={a.id} href={`/admin/galeriya/${a.id}`} className="adm-album">
            {a.cover_url ? <img src={a.cover_url} alt="" /> : <div className="adm-noimg">няма снимки</div>}
            <b>{a.title}</b>
            <span>{fmtDate(a.event_date)} · {a.n} снимки</span>
          </Link>
        ))}
      </div>
    </>
  );
}
