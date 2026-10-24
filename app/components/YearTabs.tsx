'use client';

import { useEffect, useState, type ReactNode } from 'react';

// Учебните години на една страница: бутони с годините, под тях — съдържанието само на избраната.
// Първа е най-новата. Изборът се пази в адреса (#2024-2025), за да може да се изпрати връзка.
export default function YearTabs({ tabs }: { tabs: { label: string; node: ReactNode }[] }) {
  const id = (l: string) => l.replace('/', '-');
  const [cur, setCur] = useState(0);
  // при отваряне с #година в адреса
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    const k = tabs.findIndex((t) => id(t.label) === h);
    if (k > 0) setCur(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pick = (k: number) => {
    setCur(k);
    try { history.replaceState(null, '', k ? '#' + id(tabs[k].label) : location.pathname); } catch { /* */ }
  };
  return (
    <div className="yt">
      <div className="yt-bar" role="tablist" aria-label="Учебна година">
        {tabs.map((t, k) => (
          <button key={t.label} type="button" role="tab" id={`yt-${id(t.label)}`} aria-selected={k === cur} aria-controls={`ytp-${id(t.label)}`} className={k === cur ? 'on' : ''} onClick={() => pick(k)}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, k) => (
        <div key={t.label} role="tabpanel" id={`ytp-${id(t.label)}`} aria-labelledby={`yt-${id(t.label)}`} hidden={k !== cur} className="yt-panel">
          {t.node}
        </div>
      ))}
    </div>
  );
}
