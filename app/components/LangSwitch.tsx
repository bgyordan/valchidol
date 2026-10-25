'use client';

import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';

// БГ / EN в горния ред: води към същата страница на другия език, ако има превод, иначе към началото.
export default function LangSwitch({ enSlugs }: { enSlugs: string[] }) {
  const path = (usePathname() || '/').replace(/\/+$/, '') || '/';
  if (isEnPath(path)) {
    const rest = path.slice(3);
    const href = !rest ? '/' : rest === '/contacts' ? '/kontakti' : rest;
    return <a href={href} className="tb-item tb-lang" lang="bg" hrefLang="bg" aria-label="Към българската версия">БГ</a>;
  }
  const slug = decodeURIComponent(path.slice(1));
  const href = path === '/' ? '/en' : path === '/kontakti' ? '/en/contacts' : enSlugs.includes(slug) ? '/en/' + slug : '/en';
  return <a href={href} className="tb-item tb-lang" lang="en" hrefLang="en" aria-label="English version">EN</a>;
}
