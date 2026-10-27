'use client';

import { useEffect, useRef, useState } from 'react';

// „Информация за“ на началната: три високи панела със снимки от училище (светли, всеки в свой мек цвят).
// Избраният (с мишка, пръст или Tab) се разтваря и в него влитат връзките; другите остават тесни, с името си отстрани.
// Бутоните в героя водят към #za-roditeli / #za-uchenitsi → тук се отваря този панел и страницата се превърта до него.
type Item = { t: string; key: string; href: string; icon: string; photo?: string; links: { href: string; label: string }[] };

export default function AudienceSwitch({ items }: { items: Item[] }) {
  const [cur, setCur] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  // след скок от бутоните в героя мишката остава над някой панел — не му позволяваме да „открадне“ избора за миг
  const hold = useRef(0);
  const pick = (k: number) => { if (Date.now() > hold.current) setCur(k); };
  useEffect(() => {
    const go = (scroll: boolean) => {
      const k = items.findIndex((it) => '#' + it.key === window.location.hash);
      if (k < 0) return;
      setCur(k);
      hold.current = Date.now() + 1500;
      if (scroll) box.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    };
    go(true);
    const onHash = () => go(true);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [items]);
  return (
    <div className="ap" ref={box}>
      <h2 className="ap-h" id="aud-h">Информация за</h2>
      <div className="ap-row">
        {items.map((it, k) => {
          const on = k === cur;
          return (
            <section key={it.t} className={`ap-panel ap-${it.key}${on ? ' on' : ''}`} aria-labelledby={`ap-t${k}`}
              onMouseEnter={() => pick(k)} onFocus={() => setCur(k)} onClick={() => setCur(k)}>
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
