import { all } from '../../../lib/db';
import { addDocument, deleteDocument } from '../actions';
import Confirm from '../Confirm';

// Разделите, които страниците на сайта показват (getDocuments(section)).
const SECTIONS: { key: string; title: string }[] = [
  { key: 'internal', title: 'Документи на училището (За нас → Документи)' },
  { key: 'admission', title: 'Прием' },
  { key: 'roditeli', title: 'За родители — бланки' },
  { key: 'budget', title: 'Бюджет и финанси' },
  { key: 'zdoi', title: 'Достъп до обществена информация' },
  { key: 'privacy', title: 'Защита на личните данни' },
  { key: 'signali', title: 'Подаване на сигнали' },
];
const CATS: { key: string; title: string }[] = [
  { key: 'strategy', title: 'Стратегия и планове' }, { key: 'rules', title: 'Правилници' }, { key: 'programs', title: 'Програми' },
  { key: 'ethics', title: 'Етика и приобщаване' }, { key: 'safety', title: 'Безопасност' }, { key: 'data', title: 'Защита на данните' },
  { key: 'approved', title: 'Бюджет: утвърден' }, { key: 'report', title: 'Бюджет: отчет' },
  { key: 'obrazec', title: 'ЗДОИ: образец' }, { key: 'pravila', title: 'ЗДОИ: правила' }, { key: 'normativ', title: 'ЗДОИ: нормативен акт' }, { key: 'otchet', title: 'ЗДОИ: отчет' },
];
const catTitle = (k: string | null) => CATS.find((c) => c.key === k)?.title ?? k ?? '';

type Row = { id: string; name: string; file_url: string; academic_year: string | null; section: string; category: string | null; on_site: number };

function schoolYear() {
  const d = new Date();
  const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}/${y + 1}`;
}

export default async function AdminDocs() {
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
          <label>Раздел
            <select name="section" defaultValue="internal">{SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}</select>
          </label>
          <label>Категория
            <select name="category" defaultValue=""><option value="">—</option>{CATS.map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}</select>
          </label>
        </div>
        <div className="adm-row">
          <label>Учебна година<input name="academic_year" defaultValue={schoolYear()} /></label>
          <label>Подредба (по-малко = по-горе)<input name="sort_order" type="number" defaultValue={0} /></label>
        </div>
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
