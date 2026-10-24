import type { MetadataRoute } from 'next';

// /robots.txt — разрешава индексиране на целия сайт и посочва картата на сайта.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: 'https://csop-varna.bg/sitemap.xml',
    host: 'https://csop-varna.bg',
  };
}
