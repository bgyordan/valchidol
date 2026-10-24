import { all } from '../../../lib/db';
import { addDocument, deleteDocument } from '../actions';
import Confirm from '../Confirm';

// Документът се показва в края на избраната страница, групиран по „Подзаглавие“ и учебна година.
type Row = { id: string; name: string; file_url: string; academic_year: string | null; section: string; category: string | null; on_site: number };

function schoolYear() {
  const d = new Date();
  const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}/${y + 1}`;
}

export default async function AdminDocs() {
  const SECTIONS = (await all<{ slug: string; title: string }>('SELECT slug, title FROM site_pages ORDER BY sort')).map((p) => ({ key: p.slug, title: p.title }));
  const catTitle = (k: string | null) => k ?? '';
  const rows = await all<Row>('SELECT id, name, file_url, academic_year, section, category, on_site FROM site_documents ORDER BY section, academic_year DESC, sort_order, name');
  return (
    <>
      <h1>Документи</h1>
      <form action={addDocument} className="adm-form adm-box">
        <h2>Качи документ</h2>
        <label>Файл (PDF, Word, Excel…)<input type="file" name="file" /></label>
        <label>…или връзка към документ<input name="link" type="url" placeholder="https://" /></label>
        <label>Име на документа<input name="name" placeholder="по подразбиране: името на файла" /></label>
        <div className="adm-row">
          <label>На коя страница
            <select name="section" defaultValue="dokumentatsiya">{SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}</select>
          </label>
          <label>Подзаглавие (по желание)
            <input name="category" list="doc-cats" placeholder="напр. Бюджет, Графици, Заповеди" />
          </label>
        </div>
        <div className="adm-row">
          <label>Учебна година<input name="academic_year" defaultValue={schoolYear()} /></label>
          <label>Подредба (по-малко = по-горе)<input name="sort_order" type="number" defaultValue={0} /></label>
        </div>
        <datalist id="doc-cats"><option value="Училищна документация" /><option value="Бюджет" /><option value="Графици" /><option value="Заповеди" /><option value="Учебни планове" /><option value="Протоколи" /></datalist>
        <label className="adm-check"><input type="checkbox" name="on_site" value="1" defaultChecked /> Показвай на сайта</label>
        <p><button type="submit" className="adm-btn primary">Качи</button></p>
      </form>

      {SECTIONS.map((s) => {
        const list = rows.filter((r) => r.section === s.key);
        if (!list.length) return null;
        return (
          <section key={s.key}>
            <h2>{s.title}</h2>
            <table className="adm-table">
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td><a href={r.file_url} target="_blank">{r.name}</a>{!r.on_site && <span className="adm-tag">скрит</span>}</td>
                    <td>{catTitle(r.category)}</td>
                    <td>{r.academic_year}</td>
                    <td><form action={deleteDocument}><input type="hidden" name="id" value={r.id} /><Confirm text={`Да изтрия ли „${r.name}“?`} className="adm-link danger">изтрий</Confirm></form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </>
  );
}
