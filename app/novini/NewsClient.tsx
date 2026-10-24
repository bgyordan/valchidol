'use client';

import { useMemo, useState } from 'react';
import type { NewsCard } from '../../lib/data';
import { fmtDate } from '../../lib/data';

const PER_PAGE = 12;

export default function NewsClient({ posts }: { posts: NewsCard[] }) {
  const cats = useMemo(() => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))), [posts]);
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const found = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((p) => (cat === 'all' || p.category === cat)
      && (!query || p.title.toLowerCase().includes(query) || (p.excerpt ?? '').toLowerCase().includes(query)));
  }, [posts, cat, q]);

  if (posts.length === 0) return <p className="empty">Все още няма публикувани новини.</p>;

  const pages = Math.max(1, Math.ceil(found.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const shown = found.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const featured = cur === 1 && cat === 'all' && !q ? shown[0] : undefined;
  const grid = featured ? shown.slice(1) : shown;

  return (
    <>
      <div className="db-tools">
        <label className="db-search">
          <span className="sr-only">Търсене в новините</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="search" placeholder="Търсене в новините" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </label>
        {cats.length > 1 && (
          <div className="chips" role="group" aria-label="Категория">
            <button type="button" className={cat === 'all' ? 'on' : ''} aria-pressed={cat === 'all'} onClick={() => { setCat('all'); setPage(1); }}>Всички</button>
            {cats.map((c) => (
              <button key={c} type="button" className={cat === c ? 'on' : ''} aria-pressed={cat === c} onClick={() => { setCat(c); setPage(1); }}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {found.length === 0 ? (
        <p className="empty">Няма новини по това търсене.</p>
      ) : (
        <>
          {featured && (
            <a className="nl-feat" href={`/novini/${featured.slug}`}>
              <div className="nl-img">{featured.cover_url ? <img src={featured.cover_url} alt="" /> : <span className="nl-noimg" />}</div>
              <div className="nl-txt">
                <p className="nl-meta"><span className="tag">{featured.category}</span><time>{fmtDate(featured.published_at)}</time></p>
                <h2>{featured.title}</h2>
                {featured.excerpt && <p className="nl-ex">{featured.excerpt}</p>}
              </div>
            </a>
          )}
          <div className="nl-grid">
            {grid.map((p) => (
              <a key={p.id} className="nl-item" href={`/novini/${p.slug}`}>
                <div className="nl-img">{p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" /> : <span className="nl-noimg" />}</div>
                <p className="nl-meta"><span className="tag">{p.category}</span><time>{fmtDate(p.published_at)}</time></p>
                <h3>{p.title}</h3>
                {p.excerpt && <p className="nl-ex">{p.excerpt}</p>}
              </a>
            ))}
          </div>
          {pages > 1 && (
            <nav className="pager" aria-label="Страници">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" aria-current={n === cur ? 'page' : undefined} onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{n}</button>
              ))}
            </nav>
          )}
        </>
      )}
    </>
  );
}
