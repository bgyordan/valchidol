import { denied } from '../guard';
import { all } from '../../../lib/db';
import { addDocument, archiveDocs, deleteDocument, dropSlot, renameDocGroup, reuseLastYear, setDocArchived, startDocYear, updateDocument } from '../actions';
import Confirm from '../Confirm';

// Документите на една страница — по групи и учебни години, точно както се виждат на сайта.
// Отпред са само текущите; минали години → „Архивирай“ (на сайта отиват в „Архив“), и обратно с „Върни“.
// Новият документ отива най-горе в избраната група; номерът „Ред“ го мести (по-малко = по-горе).
type Row = { id: string; name: string; file_url: string; academic_year: string | null; section: string; category: string | null; sort_order: number; on_site: number; archived: number; pending: number; prev_id: string | null; prev_url: string | null; has_slot: number };

function schoolYear() {
  const d = new Date();
  const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}/${y + 1}`;
}

export default async function AdminDocs({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string; arch?: string }> }) {
  const no = await denied('dokumenti');
  if (no) return no;
  const pages = await all<{ slug: string; title: string }>('SELECT slug, title FROM site_pages ORDER BY sort');
  const counts = await all<{ section: string; n: number }>('SELECT section, COUNT(*) AS n FROM site_documents GROUP BY section');
  const n = (slug: string) => counts.find((c) => c.section === slug)?.n ?? 0;
  const sp = await searchParams;
  const cur = sp.page && pages.some((p) => p.slug === sp.page) ? sp.page : 'dokumentatsiya';
  const everyRaw = await all<Row>(
    `SELECT d.id, d.name, d.file_url, d.academic_year, d.section, d.category, d.sort_order, d.on_site, d.archived, d.pending, d.prev_id,
            o.file_url AS prev_url, EXISTS (SELECT 1 FROM site_documents p WHERE p.prev_id = d.id AND p.pending = 1) AS has_slot
     FROM site_documents d LEFT JOIN site_documents o ON o.id = d.prev_id
     WHERE d.section = ? ORDER BY d.academic_year DESC, d.sort_order, d.name`, cur);
  // празните места за новата учебна година — отделно, като чеклист; миналогодишните им двойници не се повтарят в списъка
  const slots = everyRaw.filter((r) => r.pending);
  const every = everyRaw.filter((r) => !r.pending && !r.has_slot);
  const slotYear = slots[0]?.academic_year ?? '';
  const slotDone = slotYear ? everyRaw.filter((r) => !r.pending && r.prev_id && r.academic_year === slotYear).length : 0;
  const pendingAll = await all<{ section: string; n: number }>('SELECT section, COUNT(*) AS n FROM site_documents WHERE pending = 1 GROUP BY section');
  const nPend = (slug: string) => pendingAll.find((c) => c.section === slug)?.n ?? 0;
  const arch = sp.arch === '1';
  const rows = every.filter((r) => !!r.archived === arch);
  const nArch = every.filter((r) => r.archived).length;
  const cats = [...new Set(every.map((r) => r.category).filter((c): c is string => !!c))];
  const years = [...new Set(every.filter((r) => !r.archived).map((r) => r.academic_year).filter((y): y is string => !!y))];
  const sy = schoolYear();
  const nOld = arch ? 0 : rows.filter((r) => r.academic_year && r.academic_year < sy && !/^\d{4}$/.test(r.academic_year)).length;
  // групите по реда на сайта; при повече от една — бутони отгоре и се показва само избраната
  const order = new Map<string, number>();
  for (const r of rows) { const c = r.category ?? ''; order.set(c, Math.min(order.get(c) ?? Infinity, r.sort_order)); }
  const groupsAll = [...order.entries()].sort((a, b) => a[1] - b[1]).map(([c]) => c);
  const curCat = groupsAll.includes(sp.cat ?? '\u0000') ? sp.cat! : groupsAll[0] ?? '';
  const shown = groupsAll.length > 1 ? rows.filter((r) => (r.category ?? '') === curCat) : rows;
  const byYear = [...new Set(shown.map((r) => r.academic_year ?? ''))].sort((a, b) => (!a ? 1 : !b ? -1 : b.localeCompare(a)));
  const base = `/admin/dokumenti?page=${encodeURIComponent(cur)}`;
  const href = (c: string) => `${base}&cat=${encodeURIComponent(c)}${arch ? '&arch=1' : ''}`;
  const title = pages.find((p) => p.slug === cur)?.title ?? cur;

  return (
    <>
      <h1>Документи</h1>
      <form method="get" className="adm-form adm-row">
        <label>Страница
          <select name="page" defaultValue={cur}>
            {pages.map((p) => <option key={p.slug} value={p.slug}>{p.title}{n(p.slug) ? ` (${n(p.slug)})` : ''}{nPend(p.slug) ? ` — липсват ${nPend(p.slug)}` : ''}</option>)}
          </select>
        </label>
        <p><button className="adm-btn">Покажи</button></p>
      </form>

      <p><a href={`/admin/stranitsi/${cur}`}>Текст на „{title}“ →</a> · <a href={`/${cur}`} target="_blank">Виж на сайта ↗</a></p>
      <nav className="adm-tabs adm-arch" aria-label="Текущи или архив">
        <a href={base} className={arch ? '' : 'on'}>Текущи <span>{every.length - nArch}</span></a>
        <a href={`${base}&arch=1`} className={arch ? 'on' : ''}>Архив <span>{nArch}</span></a>
      </nav>

      {!arch && nOld > 0 && (
        <div className="adm-box adm-newyear">
          <h2>Нова учебна година</h2>
          <p>Отпред има {nOld} документа от минали учебни години (преди {sy}).</p>
          <p className="adm-muted">„Започни“ прави празно място за {sy} за всеки от тях — със същото име, група и ред. Миналогодишният стои на сайта,
            докато на мястото му не се качи нов файл (или не натиснете „същият като миналата година“), и тогава отива в архива.</p>
          <div className="adm-row">
            <form action={startDocYear}>
              <input type="hidden" name="section" value={cur} />
              <input type="hidden" name="year" value={sy} />
              <button className="adm-btn primary">Започни {sy} за „{title}“</button>
            </form>
            <form action={startDocYear}>
              <input type="hidden" name="section" value="" />
              <input type="hidden" name="year" value={sy} />
              <Confirm text={`Да започна ли ${sy} за всички страници с документи?`} className="adm-btn">…за всички страници</Confirm>
            </form>
            <form action={archiveDocs}>
              <input type="hidden" name="section" value={cur} />
              <input type="hidden" name="before" value={sy} />
              <button className="adm-link">или само ги архивирай</button>
            </form>
          </div>
        </div>
      )}

      {!arch && slots.length > 0 && (
        <section className="adm-box adm-slots">
          <h2>{slotYear}: качени {slotDone} от {slotDone + slots.length}</h2>
          <p className="adm-muted">Тези документи чакат файл за новата година. Докато го няма, на сайта стои миналогодишният.</p>
          <ul>
            {slots.map((r) => (
              <li key={r.id}>
                <div className="adm-slot-h">
                  <b>{r.name}</b>{r.category && <span className="adm-tag">{r.category}</span>}
                  {r.prev_url && <a className="adm-muted" href={r.prev_url} target="_blank"> миналогодишният ↗</a>}
                </div>
                <div className="adm-slot-acts">
                  <form action={updateDocument} className="adm-slot-up">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="name" value={r.name} />
                    <input type="hidden" name="category" value={r.category ?? ''} />
                    <input type="hidden" name="academic_year" value={r.academic_year ?? ''} />
                    <input type="hidden" name="sort_order" value={r.sort_order} />
                    <input type="hidden" name="on_site" value="1" />
                    <input type="file" name="file" aria-label={`Файл за „${r.name}“`} />
                    <input name="link" type="url" placeholder="…или връзка" aria-label="Връзка" />
                    <button className="adm-btn primary">Качи</button>
                  </form>
                  {r.prev_url && <form action={reuseLastYear}><input type="hidden" name="id" value={r.id} /><button className="adm-btn">Същият като миналата година</button></form>}
                  <form action={dropSlot}><input type="hidden" name="id" value={r.id} /><Confirm text={`„${r.name}“ не трябва тази година? Миналогодишният отива в архива.`} className="adm-link">не трябва</Confirm></form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!arch && <form action={addDocument} className="adm-form adm-box">
        <h2>Качи документ в „{title}“</h2>
        <input type="hidden" name="section" value={cur} />
        <label>Файл (PDF, Word, Excel…)<input type="file" name="file" /></label>
        <label>…или връзка към документ<input name="link" type="url" placeholder="https://" /></label>
        <label>Име на документа<input name="name" placeholder="по подразбиране: името на файла" /></label>
        <div className="adm-row">
          <label>Група
            <input name="category" list="doc-cats" defaultValue={groupsAll.length > 1 ? curCat : ''} placeholder={cats[0] ? `напр. ${cats[0]}` : 'напр. Бюджет'} />
          </label>
          <label>Учебна година<input name="academic_year" list="doc-years" defaultValue={years[0] && years[0] > sy ? years[0] : sy} /></label>
        </div>
        <datalist id="doc-cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
        <datalist id="doc-years">{[...new Set([schoolYear(), ...years])].map((y) => <option key={y} value={y} />)}</datalist>
        <label className="adm-check"><input type="checkbox" name="on_site" value="1" defaultChecked /> Показвай на сайта</label>
        <p className="adm-muted">Отива най-горе в групата. Празна година = документът стои под годините.</p>
        <p><button type="submit" className="adm-btn primary">Качи</button></p>
      </form>}

      {cats.length > 0 && (
        <details className="adm-box">
          <summary>Преименувай група</summary>
          <form action={renameDocGroup} className="adm-form adm-row">
            <input type="hidden" name="section" value={cur} />
            <label>Група<select name="from">{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>Ново име<input name="to" /></label>
            <p><button className="adm-btn">Преименувай</button></p>
          </form>
        </details>
      )}

      {!rows.length && <p className="adm-muted">{arch ? 'Архивът на тази страница е празен.' : every.length ? 'Няма текущи документи — всички са в архива.' : 'Тази страница още няма документи.'}</p>}
      {groupsAll.length > 1 && (
        <nav className="adm-tabs" aria-label="Групи">
          {groupsAll.map((g) => (
            <a key={g} href={href(g)} className={g === curCat ? 'on' : ''}>{g || 'Без група'} <span>{rows.filter((r) => (r.category ?? '') === g).length}</span></a>
          ))}
        </nav>
      )}
      {byYear.map((y, i) => {
        const list = shown.filter((r) => (r.academic_year ?? '') === y);
        return (
          <details key={y} className="adm-year" open={i === 0}>
            <summary>{y || 'Без година'} <span className="adm-muted">({list.length})</span></summary>
            {!arch && y && (
              <form action={archiveDocs} className="adm-year-act">
                <input type="hidden" name="section" value={cur} />
                <input type="hidden" name="year" value={y} />
                <Confirm text={`Да архивирам ли всички документи от ${y} на тази страница (във всички групи)?`} className="adm-link">архивирай цялата {y}</Confirm>
              </form>
            )}
            <table className="adm-table adm-docs">
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.file_url ? <a href={r.file_url} target="_blank">{r.name}</a> : r.name}
                      {!r.file_url && <span className="adm-tag">няма файл</span>}{!r.on_site && <span className="adm-tag">скрит</span>}
                      {groupsAll.length <= 1 && r.category && <span className="adm-tag">{r.category}</span>}
                      <details>
                        <summary className="adm-link">промени</summary>
                        <form action={updateDocument} className="adm-form adm-doc-edit">
                          <input type="hidden" name="id" value={r.id} />
                          <label>Име<input name="name" defaultValue={r.name} /></label>
                          <div className="adm-row">
                            <label>{r.file_url ? 'Смени файла' : 'Качи файла'}<input type="file" name="file" /></label>
                            <label>…или връзка<input name="link" type="url" placeholder="https://" /></label>
                          </div>
                          <div className="adm-row">
                            <label>Група<input name="category" list="doc-cats" defaultValue={r.category ?? ''} /></label>
                            <label>Година<input name="academic_year" list="doc-years" defaultValue={r.academic_year ?? ''} /></label>
                            <label>Ред<input name="sort_order" type="number" defaultValue={r.sort_order} /></label>
                          </div>
                          <label className="adm-check"><input type="checkbox" name="on_site" value="1" defaultChecked={!!r.on_site} /> Показвай на сайта</label>
                          <p><button className="adm-btn primary">Запази</button></p>
                        </form>
                      </details>
                    </td>
                    <td className="adm-doc-acts">
                      <form action={setDocArchived}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="archived" value={arch ? '0' : '1'} />
                        <button className="adm-link">{arch ? 'върни' : 'архивирай'}</button>
                      </form>
                    </td>
                    <td><form action={deleteDocument}><input type="hidden" name="id" value={r.id} /><Confirm text={`Да изтрия ли „${r.name}“?`} className="adm-link danger">изтрий</Confirm></form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        );
      })}
    </>
  );
}
