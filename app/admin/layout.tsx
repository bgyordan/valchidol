import Link from 'next/link';
import { getAdmin } from '../../lib/auth';
import './admin.css';

export const metadata = { title: 'Админ — СУ Вълчи дол', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getAdmin();
  if (!me) {
    return (
      <div className="adm adm-denied">
        <h1>Нямате достъп</h1>
        <p>Админ панелът е само за служители на училището. Влезте с училищния си Google акаунт.</p>
      </div>
    );
  }
  return (
    <div className="adm">
      <nav className="adm-nav" aria-label="Админ меню">
        <Link href="/admin">Начало</Link>
        <Link href="/admin/novini">Новини</Link>
        <Link href="/admin/stranitsi">Страници</Link>
        <Link href="/admin/dokumenti">Документи</Link>
        <Link href="/admin/galeriya">Галерия</Link>
        <Link href="/admin/sabitiya">Събития</Link>
        <span className="adm-me">{me.email}</span>
      </nav>
      {children}
    </div>
  );
}
