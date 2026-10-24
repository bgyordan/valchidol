import Link from 'next/link';
import { all } from '../../../lib/db';
import { fmtDate } from '../../../lib/data';

type Row = { id: string; title: string; status: string; published_at: string | null; category: string };

export default async function AdminNews() {
  const rows = await all<Row>('SELECT id, title, status, published_at, category FROM site_news ORDER BY COALESCE(published_at, created_at) DESC');
  const now = new Date().toISOString();
  return (
    <>
      <h1>Новини</h1>
      <p><Link href="/admin/novini/nova" className="adm-btn primary">+ Нова новина</Link></p>
      {rows.length === 0 ? <p className="adm-muted">Още няма новини.</p> : (
        <table className="adm-table">
          <thead><tr><th>Заглавие</th><th>Рубрика</th><th>Дата</th><th>Състояние</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/admin/novini/${r.id}`}>{r.title}</Link></td>
                <td>{r.category}</td>
                <td>{fmtDate(r.published_at)}</td>
                <td>{r.status !== 'published' ? <span className="adm-tag">чернова</span>
                  : r.published_at && r.published_at > now ? <span className="adm-tag">насрочена</span>
                  : <a href={`/novini/${r.id}`} target="_blank">на сайта ↗</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
