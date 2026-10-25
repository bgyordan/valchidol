'use client';

import { useState } from 'react';

// „Информация за“ на началната страница: вляво трите думи (Ученици, Родители, Учители) като големи бутони,
// вдясно — връзките на избраната, които влитат една след друга. Едноцветно, в тъмносиньото на училището.
type Item = { t: string; href: string; icon: string; links: { href: string; label: string }[] };

export default function AudienceSwitch({ items }: { items: Item[] }) {
  const [cur, setCur] = useState(0);
  const a = items[cur];
  return (
    <div className="aw">
      <div className="aw-side">
        <p className="aw-kicker" id="aud-h">Информация за</p>
        <div className="aw-tabs" role="tablist" aria-labelledby="aud-h">
          {items.map((it, k) => (
            <button key={it.t} type="button" role="tab" id={`aw-t${k}`} aria-selected={k === cur} aria-controls="aw-panel"
              className={k === cur ? 'on' : ''} onClick={() => setCur(k)} onMouseEnter={() => setCur(k)} onFocus={() => setCur(k)}>
              <span className="aw-num">0{k + 1}</span>
              <span className="aw-word">{it.t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="aw-panel" id="aw-panel" role="tabpanel" aria-labelledby={`aw-t${cur}`}>
        <svg key={'ic' + cur} className="aw-ghost" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={a.icon} /></svg>
        <ul key={cur}>
          {a.links.map((l, i) => (
            <li key={l.href} style={{ ['--i' as string]: i } as React.CSSProperties}>
              <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span>{l.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </li>
          ))}
        </ul>
        <a key={'all' + cur} className="aw-all" href={a.href} style={{ ['--i' as string]: a.links.length } as React.CSSProperties}>Всичко за {a.t.toLowerCase()}</a>
      </div>
    </div>
  );
}
