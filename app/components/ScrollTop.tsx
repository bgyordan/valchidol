'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const en = isEnPath(usePathname() || '/');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`scroll-top ${visible ? 'show' : ''}`}
      onClick={toTop}
      aria-label={en ? 'Back to top' : 'Нагоре'}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
