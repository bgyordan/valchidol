'use client';

import { usePathname } from 'next/navigation';
import { counterpart, isEnPath } from '../../lib/lang';

// БГ / EN — води към същата страница на другия език (или към началото, ако няма превод)
export default function LangSwitch({ className = 'tb-item tb-lang', full = false }: { className?: string; full?: boolean }) {
  const path = usePathname() || '/';
  const en = isEnPath(path);
  return (
    <a href={counterpart(path)} className={className} hrefLang={en ? 'bg' : 'en'} lang={en ? 'bg' : 'en'}
      aria-label={en ? 'Българска версия' : 'English version'}>
      {full ? (en ? 'Български' : 'English') : en ? 'БГ' : 'EN'}
    </a>
  );
}
