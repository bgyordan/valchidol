import { all } from '../../../lib/db';
import { fmtDate } from '../../../lib/data';
import { addEvent, deleteEvent } from '../actions';
import Confirm from '../Confirm';

type Row = { id: string; title: string; event_date: string; event_time: string | null; location: string | null };

export default async function AdminEvents() {
  const rows = await all<Row>(`SELECT id, title, event_date, event_time, location FROM site_events ORDER BY event_date DESC`);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <h1>Събития</h1>
      <form action={addEvent} className="adm-form adm-box">
        <h2>Ново събитие</h2>
        <label>Заглавие<input name="title" required /></label>
        <div className="adm-row">
          <label>Дата<input type="date" name="event_date" required /></label>
          <label>Час<input name="event_time" placeholder="напр. 10:00" /></label>
          <label>Място<input name="location" /></label>
        </div>
        <label>Описание<textarea name="description" rows={3} /></label>
        <p><button type="submit" className="adm-btn primary">Добави</button></p>
      </form>
      <table className="adm-table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={r.event_date < today ? 'adm-past' : ''}>
              <td>{fmtDate(r.event_date)}{r.event_time ? `, ${r.event_time}` : ''}</td>
              <td>{r.title}</td>
              <td>{r.location}</td>
              <td><form action={deleteEvent}><input type="hidden" name="id" value={r.id} /><Confirm text={`Да изтрия ли „${r.title}“?`} className="adm-link danger">изтрий</Confirm></form></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
