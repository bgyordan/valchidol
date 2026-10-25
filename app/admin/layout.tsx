import Link from 'next/link';
import { getAdmin } from '../../lib/auth';
import { can } from '../../lib/perms';
import { first } from '../../lib/db';
import ActionForm from './ActionForm';
import { login, logout, setupFirstAdmin } from './auth-actions';
import './admin.css';

export const metadata = { title: 'Админ — СУ Вълчи дол', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getAdmin();
  if (!me) {
    const none = ((await first<{ n: number }>('SELECT COUNT(*) AS n FROM admin_users'))?.n ?? 0) === 0;
    return (
      <div className="adm adm-login">
        {none ? (
          <>
            <h1>Първоначална настройка</h1>
            <p className="adm-muted">Още няма никой в админ панела. Създайте главния админ с кода за настройка.</p>
            <ActionForm action={setupFirstAdmin}>
              <label>Код за настройка<input name="code" type="password" required autoComplete="off" /></label>
              <label>Име<input name="name" autoComplete="name" /></label>
              <label>Имейл<input name="email" type="email" required autoComplete="username" /></label>
              <label>Парола <small>(поне 10 знака)</small><input name="password" type="password" required minLength={10} autoComplete="new-password" /></label>
              <p><button type="submit" className="adm-btn primary">Създай и влез</button></p>
            </ActionForm>
          </>
        ) : (
          <>
            <h1>Вход за служители</h1>
            <ActionForm action={login}>
              <label>Имейл<input name="email" type="email" required autoComplete="username" /></label>
              <label>Парола<input name="password" type="password" required autoComplete="current-password" /></label>
              <p><button type="submit" className="adm-btn primary">Влез</button></p>
            </ActionForm>
            <p className="adm-muted">Забравена парола? Обърнете се към главния админ на сайта.</p>
          </>
        )}
      </div>
    );
  }
  return (
    <div className="adm">
      <nav className="adm-nav" aria-label="Админ меню">
        <Link href="/admin">Начало</Link>
        {can(me, 'nachalo') && <Link href="/admin/nachalo">Начална страница</Link>}
        {can(me, 'novini') && <Link href="/admin/novini">Новини</Link>}
        {can(me, 'stranitsi') && <Link href="/admin/stranitsi">Страници</Link>}
        {can(me, 'dokumenti') && <Link href="/admin/dokumenti">Документи</Link>}
        {can(me, 'galeriya') && <Link href="/admin/galeriya">Галерия</Link>}
        {can(me, 'baza') && <Link href="/admin/baza">Материална база</Link>}
        {can(me, 'sabitiya') && <Link href="/admin/sabitiya">Събития</Link>}
        {can(me, 'nachalo') && <Link href="/admin/menyu">Меню</Link>}
        {can(me, 'nastroyki') && <Link href="/admin/nastroyki">Настройки</Link>}
        {me.role === 'admin' && <Link href="/admin/hora">Хора</Link>}
        <span className="adm-me">
          <Link href="/admin/profil">{me.name || me.email}</Link>
          <form action={logout}><button type="submit" className="adm-link">изход</button></form>
        </span>
      </nav>
      {children}
    </div>
  );
}
