import { all } from '../../../lib/db';
import { requireMainAdmin } from '../../../lib/auth';
import ActionForm from '../ActionForm';
import Confirm from '../Confirm';
import { addUser, deleteUser, resetPassword, setRole } from '../auth-actions';

type Row = { email: string; name: string | null; role: string; last_login: string | null };
const fmt = (s: string | null) => (s ? new Date(s).toLocaleString('bg-BG', { timeZone: 'Europe/Sofia', dateStyle: 'short', timeStyle: 'short' }) : 'още не е влизал');

export default async function AdminPeople() {
  const me = await requireMainAdmin().catch(() => null);
  if (!me) return <p>Само главният админ управлява хората.</p>;
  const rows = await all<Row>('SELECT email, name, role, last_login FROM admin_users ORDER BY role, name, email');
  return (
    <>
      <h1>Хора с достъп</h1>
      <p className="adm-muted"><b>Редактор</b> пише новини, страници, документи, снимки и събития. <b>Главен админ</b> може освен това да добавя и маха хора.</p>

      <ActionForm action={addUser} className="adm-form adm-box" reset>
        <h2>Добави човек</h2>
        <div className="adm-row">
          <label>Име<input name="name" placeholder="напр. Мария Иванова" /></label>
          <label>Имейл<input name="email" type="email" required /></label>
        </div>
        <div className="adm-row">
          <label>Първоначална парола <small>(поне 10 знака, кажете я лично)</small><input name="password" required minLength={10} autoComplete="off" /></label>
          <label>Роля
            <select name="role" defaultValue="editor"><option value="editor">Редактор</option><option value="admin">Главен админ</option></select>
          </label>
        </div>
        <p><button type="submit" className="adm-btn primary">Добави</button></p>
      </ActionForm>

      <table className="adm-table">
        <thead><tr><th>Човек</th><th>Последен вход</th><th>Роля</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.email}>
              <td>{r.name && <b>{r.name}<br /></b>}{r.email}</td>
              <td>{fmt(r.last_login)}</td>
              <td>
                {r.email === me.email ? (r.role === 'admin' ? 'Главен админ' : 'Редактор') : (
                  <form action={setRole}>
                    <input type="hidden" name="email" value={r.email} />
                    <input type="hidden" name="role" value={r.role === 'admin' ? 'editor' : 'admin'} />
                    {r.role === 'admin' ? 'Главен админ' : 'Редактор'}{' '}
                    <button type="submit" className="adm-link">{r.role === 'admin' ? 'направи редактор' : 'направи главен'}</button>
                  </form>
                )}
              </td>
              <td>
                {r.email !== me.email && (
                  <>
                    <details>
                      <summary className="adm-link">нова парола</summary>
                      <ActionForm action={resetPassword} reset>
                        <input type="hidden" name="email" value={r.email} />
                        <input name="password" required minLength={10} autoComplete="off" placeholder="поне 10 знака" />
                        <button type="submit" className="adm-btn">Запиши</button>
                      </ActionForm>
                    </details>
                    <form action={deleteUser}>
                      <input type="hidden" name="email" value={r.email} />
                      <Confirm text={`Да махна ли достъпа на ${r.email}?`} className="adm-link danger">махни достъпа</Confirm>
                    </form>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
