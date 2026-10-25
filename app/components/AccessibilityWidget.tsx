'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';

type Settings = { font: number; contrast: boolean; links: boolean };
const DEFAULTS: Settings = { font: 0, contrast: false, links: false };
const FONT_STEPS = [1, 1.12, 1.25, 1.4]; // 100% → 140%
const KEY = 'su-a11y';

function apply(s: Settings) {
  const html = document.documentElement;
  // всички размери на шрифта в CSS са умножени по --fs (html font-size не стига — размерите са в px)
  html.style.setProperty('--fs', String(FONT_STEPS[s.font]));
  html.classList.toggle('a11y-contrast', s.contrast);
  html.classList.toggle('a11y-links', s.links);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  const en = isEnPath(usePathname() || '/');
  const T = en
    ? { panel: 'Accessibility settings', h: 'Accessibility', sub: 'Adjust the view to your needs.', size: 'Text size', lvl: 'Size level', contrast: 'High contrast', links: 'Underlined links', reset: 'Reset settings', more: 'Accessibility statement (in Bulgarian) →' }
    : { panel: 'Настройки за достъпност', h: 'Достъпност', sub: 'Настройте изгледа според нуждите си.', size: 'Размер на текста', lvl: 'Размер ниво', contrast: 'Висок контраст', links: 'Подчертани връзки', reset: 'Нулирай настройките', more: 'Декларация за достъпност →' };

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved) { setS(saved); apply(saved); }
    } catch { /* ignore */ }
  }, []);

  const update = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next); apply(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const reset = () => {
    setS(DEFAULTS); apply(DEFAULTS);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  };

  const active = mounted && (s.font > 0 || s.contrast || s.links);

  return (
    <>
      <style>{`
        html.a11y-contrast { filter: contrast(1.4); }
        html.a11y-links a { text-decoration: underline !important; text-underline-offset: 2px; }
        .a11y-fab {
          position: fixed; right: 20px; bottom: 20px; z-index: 1000;
          width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer;
          background: var(--ink); color: var(--paper); display: grid; place-items: center;
          box-shadow: 0 10px 26px -8px rgba(21,50,74,.45); transition: transform .2s, box-shadow .2s;
        }
        .a11y-fab:hover { transform: scale(1.06); }
        .a11y-fab:focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
        .a11y-fab.on { background: var(--ink); }
        .a11y-panel {
          position: fixed; right: 20px; bottom: 80px; z-index: 1000; width: min(268px, calc(100vw - 40px));
          background: var(--paper); border: 1px solid var(--line); border-radius: 18px;
          box-shadow: 0 24px 60px -18px rgba(16,34,64,.28); padding: 16px; font-family: var(--sans, system-ui);
        }
        .a11y-panel h3 { font-size: 15px; font-weight: 400; color: var(--ink); margin: 0 0 2px; }
        .a11y-panel .sub { font-size: 12px; color: var(--ink-2); margin: 0 0 14px; }
        .a11y-row { margin-bottom: 13px; }
        .a11y-lbl { font-size: 12.5px; font-weight: 400; color: var(--ink); margin-bottom: 6px; display: block; }
        .a11y-seg { display: flex; gap: 5px; }
        .a11y-seg button {
          flex: 1; border: 1px solid var(--line); background: var(--sky); border-radius: 10px; cursor: pointer;
          padding: 8px 0; font-family: inherit; color: var(--ink-2); transition: .15s;
        }
        .a11y-seg button:hover { background: var(--sky-2); }
        .a11y-seg button.on { background: var(--ink); color: var(--paper); border-color: var(--blue-ink); }
        .a11y-toggle {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          border: 1px solid var(--line); background: var(--sky); border-radius: 11px; cursor: pointer;
          padding: 10px 12px; font-family: inherit; font-size: 13px; color: var(--ink); transition: .15s;
        }
        .a11y-toggle:hover { background: var(--sky-2); }
        .a11y-sw { width: 36px; height: 20px; border-radius: 999px; background: var(--line-strong); position: relative; transition: .15s; flex: 0 0 auto; }
        .a11y-sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--paper); transition: .15s; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
        .a11y-sw.on { background: var(--blue-ink); }
        .a11y-sw.on::after { left: 18px; }
        .a11y-reset {
          width: 100%; margin-top: 4px; border: 1px solid var(--line); background: var(--paper); border-radius: 11px;
          cursor: pointer; padding: 9px 0; font-family: inherit; font-size: 12.5px; color: var(--ink-2); transition: .15s;
        }
        .a11y-reset:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .a11y-more { display: block; text-align: center; font-size: 11.5px; color: var(--blue-ink); margin-top: 10px; text-decoration: none; }
        .a11y-more:hover { text-decoration: underline; }
      `}</style>

      {open && mounted && (
        <div className="a11y-panel" role="dialog" aria-label={T.panel}>
          <h3>{T.h}</h3>
          <p className="sub">{T.sub}</p>

          <div className="a11y-row">
            <span className="a11y-lbl">{T.size}</span>
            <div className="a11y-seg">
              {['A', 'A+', 'A++', 'A+++'].map((lbl, i) => (
                <button key={i} className={s.font === i ? 'on' : ''} onClick={() => update({ font: i })}
                  aria-label={`${T.lvl} ${i + 1}`} style={{ fontSize: 12 + i * 1.5 }}>{lbl}</button>
              ))}
            </div>
          </div>

          <div className="a11y-row">
            <button className="a11y-toggle" onClick={() => update({ contrast: !s.contrast })} aria-pressed={s.contrast}>
              <span>{T.contrast}</span><span className={`a11y-sw ${s.contrast ? 'on' : ''}`} />
            </button>
          </div>

          <div className="a11y-row">
            <button className="a11y-toggle" onClick={() => update({ links: !s.links })} aria-pressed={s.links}>
              <span>{T.links}</span><span className={`a11y-sw ${s.links ? 'on' : ''}`} />
            </button>
          </div>

          <button className="a11y-reset" onClick={reset}>{T.reset}</button>
          <a className="a11y-more" href="/dostapnost">{T.more}</a>
        </div>
      )}

      <button className={`a11y-fab ${active ? 'on' : ''}`} onClick={() => setOpen((v) => !v)}
        aria-label={T.h} aria-expanded={open} title={T.h}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none" />
          <path d="M4 8h16M12 8v6M12 14l-3.5 6M12 14l3.5 6" />
        </svg>
      </button>
    </>
  );
}
