import Link from 'next/link';
import { first } from '../../lib/db';

async function count(sql: string) {
  return (await first<{ n: number }>(sql))?.n ?? 0;
}

export default async function AdminHome() {
  const [news, drafts, docs, albums, photos, events] = await Promise.all([
    count(`SELECT COUNT(*) AS n FROM site_news WHERE status = 'published'`),
    count(`SELECT COUNT(*) AS n FROM site_news WHERE status = 'draft'`),
    count('SELECT COUNT(*) AS n FROM site_documents'),
    count('SELECT COUNT(*) AS n FROM gallery_albums'),
    count('SELECT COUNT(*) AS n FROM gallery_photos'),
    count(`SELECT COUNT(*) AS n FROM site_events WHERE event_date >= date('now')`),
  ]);
  return (
    <>
      <h1>Админ панел</h1>
      <div className="adm-cards">
        <Link href="/admin/novini" className="adm-card"><b>{news}</b> публикувани новини{drafts ? `, ${drafts} чернови` : ''}</Link>
        <Link href="/admin/dokumenti" className="adm-card"><b>{docs}</b> документа</Link>
        <Link href="/admin/galeriya" className="adm-card"><b>{albums}</b> албума, {photos} снимки</Link>
        <Link href="/admin/sabitiya" className="adm-card"><b>{events}</b> предстоящи събития</Link>
      </div>
      <p><Link href="/admin/novini/nova" className="adm-btn primary">+ Нова новина</Link></p>
    </>
  );
}
