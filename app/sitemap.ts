import type { MetadataRoute } from 'next';
import { getNews } from '../lib/data';
import { PAIRS } from '../lib/lang';

// Карта на сайта за търсачките: /sitemap.xml
// Генерира се при всяка заявка, за да влизат веднага новите новини от EIS → „Сайт“.
export const dynamic = 'force-dynamic';

const SITE = 'https://csop-varna.bg';

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

const PAGES: { path: string; freq: Freq; priority: number }[] = [
  { path: '/', freq: 'weekly', priority: 1 },
  { path: '/novini', freq: 'weekly', priority: 0.9 },
  { path: '/sabitiya', freq: 'weekly', priority: 0.8 },
  { path: '/za-nas', freq: 'monthly', priority: 0.8 },
  { path: '/za-nas/istoriya', freq: 'yearly', priority: 0.5 },
  { path: '/za-nas/ekip', freq: 'monthly', priority: 0.7 },
  { path: '/za-nas/materialna-baza', freq: 'monthly', priority: 0.6 },
  { path: '/za-nas/proekti', freq: 'monthly', priority: 0.6 },
  { path: '/za-nas/karieri', freq: 'monthly', priority: 0.6 },
  { path: '/za-nas/dokumenti-v-tsop', freq: 'monthly', priority: 0.6 },
  { path: '/za-nas/byudzhet-i-finansi', freq: 'monthly', priority: 0.5 },
  { path: '/za-nas/profil-na-kupuvacha', freq: 'monthly', priority: 0.5 },
  { path: '/za-nas/dostap-do-obshtestvena-informatsiya', freq: 'yearly', priority: 0.4 },
  { path: '/za-nas/zashtita-na-lichnite-danni', freq: 'yearly', priority: 0.3 },
  { path: '/za-roditeli', freq: 'monthly', priority: 0.8 },
  { path: '/za-roditeli/uslugi', freq: 'monthly', priority: 0.7 },
  { path: '/za-roditeli/dneven-rezhim', freq: 'yearly', priority: 0.6 },
  { path: '/za-roditeli/resursi', freq: 'monthly', priority: 0.6 },
  { path: '/za-roditeli/nastoyatelstvo', freq: 'yearly', priority: 0.4 },
  { path: '/obuchenie-i-podkrepa', freq: 'monthly', priority: 0.8 },
  { path: '/priem', freq: 'monthly', priority: 0.8 },
  { path: '/priem/proczedura', freq: 'yearly', priority: 0.7 },
  { path: '/priem/poseshtenie', freq: 'yearly', priority: 0.6 },
  { path: '/galeriya', freq: 'monthly', priority: 0.5 },
  { path: '/kontakti', freq: 'yearly', priority: 0.8 },
  { path: '/daritelstvo', freq: 'yearly', priority: 0.5 },
  { path: '/prozrachnost', freq: 'monthly', priority: 0.4 },
  { path: '/podavane-na-signali', freq: 'yearly', priority: 0.4 },
  { path: '/dostapnost', freq: 'yearly', priority: 0.3 },
  { path: '/obshti-usloviya', freq: 'yearly', priority: 0.2 },
  { path: '/politika-za-biskvitki', freq: 'yearly', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();
  const latest = news[0]?.published_at ? new Date(news[0].published_at) : undefined;

  const full = (p: string) => `${SITE}${p === '/' ? '' : p}`;
  // двойките БГ/EN се отбелязват като езикови версии една на друга (hreflang)
  const langs = (path: string) => {
    const pair = PAIRS.find((x) => x.bg === path || x.en === path);
    return pair ? { alternates: { languages: { bg: full(pair.bg), en: full(pair.en) } } } : {};
  };
  const pages: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: full(p.path),
    ...langs(p.path),
    changeFrequency: p.freq,
    priority: p.priority,
    // Началото и списъкът с новини се променят, когато излезе нова новина
    ...(latest && (p.path === '/' || p.path === '/novini') ? { lastModified: latest } : {}),
  }));

  const articles: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE}/novini/${n.slug}`,
    lastModified: n.published_at ? new Date(n.published_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const en: MetadataRoute.Sitemap = PAIRS.map((x) => ({
    url: full(x.en),
    changeFrequency: 'yearly',
    priority: x.en === '/en' ? 0.6 : 0.5,
    ...langs(x.en),
  }));

  return [...pages, ...en, ...articles];
}
