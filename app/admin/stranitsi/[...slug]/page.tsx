import { denied } from '../../guard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { all, first, json } from '../../../../lib/db';
import { deletePage, savePage } from '../../actions';
import Confirm from '../../Confirm';
import PhotoPicker from '../../PhotoPicker';
import { PAGE_GROUPS } from '../groups';

type Row = { slug: string; title: string; grp: string | null; body: string; photos: string; title_en: string | null; body_en: string | null };

export default async function EditPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const no = await denied('stranitsi');
  if (no) return no;
  const slug = (await params).slug.map(decodeURIComponent).join('/');
  const isNew = slug === 'nova';
  const p = isNew ? null : await first<Row>('SELECT slug, title, grp, body, photos, title_en, body_en FROM site_pages WHERE slug = ?', slug);
  if (!isNew && !p) notFound();
  const photos = json<string[]>(p?.photos, []);
  // документите на страницата (управляват се в „Документи“) — тук само колко са и бутон към тях
  const docs = isNew ? [] : await all<{ academic_year: string | null; archived: number }>('SELECT academic_year, archived FROM site_documents WHERE section = ?', slug);
  const docNow = docs.filter((d) => !d.archived);
  const docYears = [...new Set(docNow.map((d) => d.academic_year).filter((y): y is string => !!y))].sort().reverse();

  return (
    <>
      <p><Link href="/admin/stranitsi">← Всички страници</Link></p>
      <h1>{isNew ? 'Нова страница' : p!.title}</h1>
      {!isNew && <p><a href={`/${p!.slug}`} target="_blank">Виж на сайта ↗</a>{p!.title_en && <> · <a href={`/en/${p!.slug}`} target="_blank">English ↗</a></>}</p>}
      {!isNew && (
        <div className="adm-box adm-pagedocs">
          <p>
            <b>Документи на страницата:</b>{' '}
            {docs.length ? <>{docNow.length} на сайта{docYears.length ? ` (${docYears.join(', ')})` : ''}, {docs.length - docNow.length} в архива</> : 'няма'}
          </p>
          <p className="adm-muted">Файловете (заповеди, заявления, правила…) не са в текста отдолу — качват се, сменят и архивират в „Документи“.
            Нова учебна година: архивирай старите документи и качи новите там.</p>
          <p><Link className="adm-btn" href={`/admin/dokumenti?page=${encodeURIComponent(p!.slug)}`}>Документи на „{p!.title}“ →</Link></p>
        </div>
      )}
      <form action={savePage} className="adm-form">
        <input type="hidden" name="new" value={isNew ? '1' : '0'} />
        <div className="adm-row">
          <label>Заглавие<input name="title" required defaultValue={p?.title} /></label>
          {isNew ? (
            <label>Адрес на страницата<input name="slug" required placeholder="напр. klubove или proekti/nov-proekt" />
              <small>Само латиница; ще бъде souvalchidol.com/адрес</small>
            </label>
          ) : (
            <input type="hidden" name="slug" value={p!.slug} />
          )}
          <label>Група
            <select name="grp" defaultValue={p?.grp ?? ''}>
              <option value="">—</option>
              {PAGE_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.title}</option>)}
            </select>
          </label>
        </div>
        <label>Текст
          <textarea name="body" rows={28} defaultValue={p?.body ?? ''} />
          <small>Текстът стои над документите на сайта. Може да е и празен, ако страницата е само с документи. Всеки ред е абзац. „## “ = заглавие, „### “ = по-малко заглавие, „- “ = точка от списък, **удебелен**, [текст на връзката](https://адрес). Документ: качете го от „Документи“ и поставете връзката му тук.</small>
        </label>
        <details className="adm-en" open={!!p?.title_en}>
          <summary>На английски {p?.title_en ? <span className="adm-badge">EN</span> : <span className="adm-muted">(няма)</span>}</summary>
          <p className="adm-muted">Ако има заглавие на английски, страницата се показва и в английската версия: souvalchidol.com/en/{p?.slug ?? 'адрес'}. Празно заглавие = само на български.</p>
          <label>Заглавие на английски<input name="title_en" defaultValue={p?.title_en ?? ''} lang="en" /></label>
          <label>Текст на английски<textarea name="body_en" rows={14} defaultValue={p?.body_en ?? ''} lang="en" /></label>
        </details>
        <fieldset>
          <legend>Снимки (първата е горе в заглавието)</legend>
          {photos.length > 0 && (
            <div className="adm-thumbs">
              {photos.map((u) => (<figure key={u}><img src={u} alt="" loading="lazy" /><label className="adm-check"><input type="checkbox" name="remove_photo" value={u} /> махни</label></figure>))}
            </div>
          )}
          <input type="file" name="photos" accept="image/*" multiple />
          <PhotoPicker exclude={photos} />
        </fieldset>
        <p><button type="submit" className="adm-btn primary">Запази</button></p>
      </form>
      {!isNew && (
        <form action={deletePage}>
          <input type="hidden" name="slug" value={p!.slug} />
          <Confirm text="Да изтрия ли страницата?">Изтрий страницата</Confirm>
        </form>
      )}
    </>
  );
}
