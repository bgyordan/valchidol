import { denied } from '../guard';
import Link from 'next/link';
import { all } from '../../../lib/db';
import { fmtDate } from '../../../lib/data';
import { PAGE_GROUPS } from './groups';

type Row = { slug: string; title: string; grp: string | null; updated_at: string; n: number };

export default async function AdminPages() {
  const no = await denied('stranitsi');
  if (no) return no;
  const rows = await all<Row>('SELECT slug, title, grp, updated_at, length(body) AS n FROM site_pages ORDER BY sort');
  const groups = [...PAGE_GROUPS, { key: '', title: 'Без група' }];
  return (
    <>
      <h1>Страници</h1>
      <p className="adm-muted">Текстовите страници на сайта: история, документация, прием, СФО и т.н. Новините и галерията са отделно.</p>
      <p><Link href="/admin/stranitsi/nova" className="adm-btn primary">+ Нова страница</Link></p>
      {groups.map((g) => {
        const list = rows.filter((r) => (r.grp ?? '') === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key}>
            <h2>{g.title}</h2>
            <table className="adm-table">
              <tbody>
                {list.map((r) => (
                  <tr key={r.slug}>
                    <td><Link href={`/admin/stranitsi/${r.slug}`}>{r.title}</Link></td>
                    <td><a href={`/${r.slug}`} target="_blank">/{r.slug} ↗</a></td>
                    <td>{fmtDate(r.updated_at)}</td>
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
