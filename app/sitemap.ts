import type { MetadataRoute } from 'next';
import { getNews } from '../lib/data';
import { all } from '../lib/db';
import { NAV } from './components/nav';

// Карта на сайта за търсачките: /sitemap.xml — смята се при всяка заявка, за да влизат веднага новите новини и страници.
export const dynamic = 'force-dynamic';

const SITE = 'https://souvalchidol.com';
const full = (p: string) => `${SITE}${p === '/' ? '' : p}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, pages] = await Promise.all([getNews(), all<{ slug: string; updated_at: string }>('SELECT slug, updated_at FROM site_pages')]);
  const latest = news[0]?.published_at ? new Date(news[0].published_at) : undefined;

  const fixed = ['/', '/novini', '/sabitiya', '/galeriya', '/kontakti', ...NAV.map((g) => g.href), '/dostapnost', '/politika-za-biskvitki', '/obshti-usloviya'];
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const p of fixed) {
    if (seen.has(p)) continue;
    seen.add(p);
    out.push({ url: full(p), changeFrequency: p === '/' || p === '/novini' ? 'weekly' : 'monthly', priority: p === '/' ? 1 : 0.7, ...(latest && (p === '/' || p === '/novini') ? { lastModified: latest } : {}) });
  }
  for (const p of pages) {
    if (seen.has('/' + p.slug)) continue;
    out.push({ url: full('/' + p.slug), lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.6 });
  }
  for (const n of news) {
    out.push({ url: `${SITE}/novini/${n.slug}`, lastModified: n.published_at ? new Date(n.published_at) : undefined, changeFrequency: 'yearly', priority: 0.5 });
  }
  return out;
}
