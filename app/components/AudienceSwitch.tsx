'use client';

import { useState } from 'react';

// „Информация за“ на началната: три високи панела със снимки от училище (в тъмносиньо).
// Избраният (с мишка, пръст или Tab) се разтваря и в него влитат връзките; другите остават тесни, с името си отстрани.
type Item = { t: string; href: string; icon: string; photo?: string; links: { href: string; label: string }[] };

export default function AudienceSwitch({ items }: { items: Item[] }) {
  const [cur, setCur] = useState(0);
  return (
    <div className="ap">
      <h2 className="ap-h" id="aud-h">Информация за</h2>
      <div className="ap-row">
        {items.map((it, k) => {
          const on = k === cur;
          return (
            <section key={it.t} className={`ap-panel${on ? ' on' : ''}`} aria-labelledby={`ap-t${k}`}
              onMouseEnter={() => setCur(k)} onFocus={() => setCur(k)} onClick={() => setCur(k)}>
              {it.photo && <img className="ap-img" src={it.photo} alt="" loading="lazy" />}
              <span className="ap-shade" aria-hidden="true" />
              <span className="ap-num" aria-hidden="true">0{k + 1}</span>
              <h3 className="ap-t" id={`ap-t${k}`}>
                {/* в затворен панел заглавието е бутон, който го отваря; в отворения — връзка към страницата */}
                {on ? <a href={it.href}>{it.t}</a> : <button type="button" aria-expanded={false} onClick={() => setCur(k)}>{it.t}</button>}
              </h3>
              <div className="ap-body" hidden={!on}>
                <ul>
                  {it.links.map((l, i) => (
                    <li key={l.href} style={{ ['--i' as string]: i } as React.CSSProperties}>
                      <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
