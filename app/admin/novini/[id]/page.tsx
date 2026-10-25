import { denied } from '../../guard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { all, first, json } from '../../../../lib/db';
import { isoToSofia } from '../../../../lib/sofia';
import { deleteNews, saveNews } from '../../actions';
import Confirm from '../../Confirm';

const NEWS_CATS = ['Новини', 'Събития', 'Моменти от работата', 'Постижения', 'Проекти', 'Обяви'];

type Row = { id: string; title: string; excerpt: string | null; content: string | null; cover_url: string | null; gallery_images: string; category: string; status: string; published_at: string | null; author_name: string | null };

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const no = await denied('novini');
  if (no) return no;
  const { id } = await params;
  const isNew = id === 'nova';
  const n = isNew ? null : await first<Row>('SELECT * FROM site_news WHERE id = ?', id);
  if (!isNew && !n) notFound();
  const gallery = json<string[]>(n?.gallery_images, []);
  // рубриките: основните + всички, които вече са ползвани
  const used = await all<{ category: string }>('SELECT DISTINCT category FROM site_news WHERE category IS NOT NULL AND category <> \'\'');
  const cats = [...new Set([...NEWS_CATS, ...used.map((u) => u.category)])];
  const curCat = n?.category ?? 'Новини';

  return (
    <>
      <p><Link href="/admin/novini">← Всички новини</Link></p>
      <h1>{isNew ? 'Нова новина' : 'Редакция на новина'}</h1>
      <form action={saveNews} className="adm-form">
        <input type="hidden" name="id" value={n?.id ?? ''} />
        <label>Заглавие<input name="title" required defaultValue={n?.title} /></label>
        <label>Кратко описание (за картата в списъка)<textarea name="excerpt" rows={2} defaultValue={n?.excerpt ?? ''} /></label>
        <label>Текст
          <textarea name="content" rows={14} defaultValue={n?.content ?? ''} />
          <small>Всеки ред е абзац. „## “ в началото на ред = подзаглавие, „- “ = точка от списък, **удебелен**, [текст](https://адрес).</small>
        </label>
        <div className="adm-row">
          <label>Автор<input name="author_name" defaultValue={n?.author_name ?? ''} placeholder="по подразбиране: вашият имейл" /></label>
        </div>
        <fieldset className="adm-cats">
          <legend>Рубрика <small>(на сайта новините се филтрират по нея)</small></legend>
          {cats.map((c) => (
            <label key={c} className="adm-chip"><input type="radio" name="category" value={c} defaultChecked={c === curCat} /><span>{c}</span></label>
          ))}
          <label className="adm-chip-new">или нова<input name="category_new" placeholder="напр. Спорт" maxLength={60} /></label>
        </fieldset>
        <div className="adm-row">
          <label>Състояние
            <select name="status" defaultValue={n?.status ?? 'published'}>
              <option value="published">Публикувана</option>
              <option value="draft">Чернова (не се вижда)</option>
            </select>
          </label>
          <label>Дата и час на публикуване<input type="datetime-local" name="published_at" defaultValue={isoToSofia(n?.published_at)} />
            <small>Празно = сега. Бъдеща дата = излиза автоматично тогава.</small>
          </label>
        </div>
        <fieldset>
          <legend>Основна снимка</legend>
          {n?.cover_url && (<div className="adm-thumbs"><figure><img src={n.cover_url} alt="" /><label className="adm-check"><input type="checkbox" name="remove_cover" value="1" /> махни</label></figure></div>)}
          <input type="file" name="cover" accept="image/*" />
        </fieldset>
        <fieldset>
          <legend>Още снимки към новината</legend>
          {gallery.length > 0 && (
            <div className="adm-thumbs">
              {gallery.map((u) => (<figure key={u}><img src={u} alt="" /><label className="adm-check"><input type="checkbox" name="remove_gallery" value={u} /> махни</label></figure>))}
            </div>
          )}
          <input type="file" name="gallery" accept="image/*" multiple />
        </fieldset>
        <p><button type="submit" className="adm-btn primary">Запази</button></p>
      </form>
      {!isNew && (
        <form action={deleteNews}>
          <input type="hidden" name="id" value={n!.id} />
          <Confirm text="Да изтрия ли новината и снимките ѝ?">Изтрий новината</Confirm>
        </form>
      )}
    </>
  );
}
