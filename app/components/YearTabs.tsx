'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

// Учебните години на една страница: бутони с годините, под тях — съдържанието само на избраната.
// Първа е най-новата. Изборът се пази в адреса (#2024-2025), за да може да се изпрати връзка.
// sub: по-малки бутони вътре в друг таб (годините в група). noHash: не пипа адреса.
export default function YearTabs({ tabs, sub = false, noHash = false, aria = 'Учебна година' }: { tabs: { label: string; node: ReactNode }[]; sub?: boolean; noHash?: boolean; aria?: string }) {
  const id = (l: string) => l.replace(/[\s/]+/g, '-');
  const uid = useId(); // уникални id-та, когато има няколко реда бутони на страницата
  const [cur, setCur] = useState(0);
  // при отваряне с #година в адреса
  useEffect(() => {
    if (noHash) return;
    const h = decodeURIComponent(window.location.hash.slice(1));
    const k = tabs.findIndex((t) => id(t.label) === h);
    if (k > 0) setCur(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pick = (k: number) => {
    setCur(k);
    if (noHash) return;
    try { history.replaceState(null, '', k ? '#' + id(tabs[k].label) : location.pathname); } catch { /* */ }
  };
  return (
    <div className={`yt${sub ? ' yt-sub' : ''}`}>
      <div className="yt-bar" role="tablist" aria-label={aria}>
        {tabs.map((t, k) => (
          <button key={t.label} type="button" role="tab" id={`yt${uid}${k}`} aria-selected={k === cur} aria-controls={`ytp${uid}${k}`} className={k === cur ? 'on' : ''} onClick={() => pick(k)}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, k) => (
        <div key={t.label} role="tabpanel" id={`ytp${uid}${k}`} aria-labelledby={`yt${uid}${k}`} hidden={k !== cur} className="yt-panel">
          {t.node}
        </div>
      ))}
    </div>
  );
}
