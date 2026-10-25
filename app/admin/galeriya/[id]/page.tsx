import { denied } from '../../guard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { all, first } from '../../../../lib/db';
import { addPhotos, deleteAlbum, photoAction, updateAlbum } from '../../actions';
import Confirm from '../../Confirm';

type Album = { id: string; title: string; cover_url: string | null; event_date: string | null; sort_order: number };
type Photo = { id: string; photo_url: string; caption: string | null };

export default async function EditAlbum({ params }: { params: Promise<{ id: string }> }) {
  const no = await denied('galeriya');
  if (no) return no;
  const { id } = await params;
  const a = await first<Album>('SELECT id, title, cover_url, event_date, sort_order FROM gallery_albums WHERE id = ?', id);
  if (!a) notFound();
  const photos = await all<Photo>('SELECT id, photo_url, caption FROM gallery_photos WHERE album_id = ? ORDER BY sort_order', id);

  return (
    <>
      <p><Link href="/admin/galeriya">← Всички албуми</Link></p>
      <h1>{a.title}</h1>
      <form action={updateAlbum} className="adm-form adm-row">
        <input type="hidden" name="id" value={a.id} />
        <label>Заглавие<input name="title" required defaultValue={a.title} /></label>
        <label>Дата<input type="date" name="event_date" defaultValue={a.event_date ?? ''} /></label>
        <label>Подредба<input type="number" name="sort_order" defaultValue={a.sort_order} /></label>
        <button type="submit" className="adm-btn">Запази</button>
      </form>

      <form action={addPhotos} className="adm-form adm-box">
        <input type="hidden" name="album_id" value={a.id} />
        <label>Добави снимки (може няколко наведнъж)<input type="file" name="photos" accept="image/*" multiple required /></label>
        <p><button type="submit" className="adm-btn primary">Качи</button></p>
      </form>

      <div className="adm-photos">
        {photos.map((p) => (
          <figure key={p.id} className={p.photo_url === a.cover_url ? 'is-cover' : ''}>
            <img src={p.photo_url} alt={p.caption ?? ''} />
            <form action={photoAction}>
              <input type="hidden" name="id" value={p.id} />
              <input name="caption" defaultValue={p.caption ?? ''} placeholder="надпис" />
              <div className="adm-photo-btns">
                <button name="do" value="caption" className="adm-link">запази надписа</button>
                {p.photo_url !== a.cover_url ? <button name="do" value="cover" className="adm-link">направи корица</button> : <span className="adm-tag">корица</span>}
                <button name="do" value="delete" className="adm-link danger">изтрий</button>
              </div>
            </form>
          </figure>
        ))}
      </div>

      <form action={deleteAlbum}>
        <input type="hidden" name="id" value={a.id} />
        <Confirm text="Да изтрия ли целия албум с всичките му снимки?">Изтрий албума</Confirm>
      </form>
    </>
  );
}
