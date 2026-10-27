import Link from 'next/link';
import { all, first } from '../../lib/db';

async function count(sql: string) {
  return (await first<{ n: number }>(sql))?.n ?? 0;
}

export default async function AdminHome() {
  const [news, drafts, docs, albums, photos, events, pages] = await Promise.all([
    count(`SELECT COUNT(*) AS n FROM site_news WHERE status = 'published'`),
    count(`SELECT COUNT(*) AS n FROM site_news WHERE status = 'draft'`),
    count('SELECT COUNT(*) AS n FROM site_documents'),
    count('SELECT COUNT(*) AS n FROM gallery_albums'),
    count('SELECT COUNT(*) AS n FROM gallery_photos'),
    count(`SELECT COUNT(*) AS n FROM site_events WHERE event_date >= date('now')`),
    count('SELECT COUNT(*) AS n FROM site_pages'),
  ]);
  // нова учебна година: кои страници още чакат документи
  const missing = await all<{ section: string; title: string | null; n: number; y: string | null }>(
    `SELECT d.section, p.title, COUNT(*) AS n, MAX(d.academic_year) AS y FROM site_documents d LEFT JOIN site_pages p ON p.slug = d.section
     WHERE d.pending = 1 GROUP BY d.section ORDER BY n DESC`,
  ).catch(() => []);
  return (
    <>
      <h1>Админ панел</h1>
      <div className="adm-cards">
        <Link href="/admin/novini" className="adm-card"><b>{news}</b> публикувани новини{drafts ? `, ${drafts} чернови` : ''}</Link>
        <Link href="/admin/stranitsi" className="adm-card"><b>{pages}</b> страници</Link>
        <Link href="/admin/dokumenti" className="adm-card"><b>{docs}</b> документа</Link>
        <Link href="/admin/galeriya" className="adm-card"><b>{albums}</b> албума, {photos} снимки</Link>
        <Link href="/admin/sabitiya" className="adm-card"><b>{events}</b> предстоящи събития</Link>
      </div>
      {missing.length > 0 && (
        <div className="adm-box adm-missing">
          <h2>Липсват документи за {missing[0].y}: {missing.reduce((a, m) => a + m.n, 0)}</h2>
          <ul>
            {missing.map((m) => <li key={m.section}><Link href={`/admin/dokumenti?page=${encodeURIComponent(m.section)}`}>{m.title ?? m.section}</Link> — {m.n}</li>)}
          </ul>
        </div>
      )}
      <p><Link href="/admin/novini/nova" className="adm-btn primary">+ Нова новина</Link></p>
    </>
  );
}
