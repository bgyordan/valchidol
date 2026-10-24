import { requireAdmin } from '../../../lib/auth';
import ActionForm from '../ActionForm';
import { changeOwnPassword } from '../auth-actions';

export default async function AdminProfile() {
  const me = await requireAdmin();
  return (
    <>
      <h1>Моят профил</h1>
      <p>{me.name && <b>{me.name} · </b>}{me.email} · {me.role === 'admin' ? 'главен админ' : 'редактор'}</p>
      <ActionForm action={changeOwnPassword} className="adm-form adm-box" reset>
        <h2>Смяна на паролата</h2>
        <label>Сегашна парола<input name="current" type="password" required autoComplete="current-password" /></label>
        <label>Нова парола <small>(поне 10 знака)</small><input name="password" type="password" required minLength={10} autoComplete="new-password" /></label>
        <p><button type="submit" className="adm-btn primary">Смени</button></p>
      </ActionForm>
    </>
  );
}
