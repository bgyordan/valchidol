'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '@fontsource-variable/caveat';
import './notepaper.css';

const SEEN = 'su-notice-seen';

// Обявата като листче от тетрадка.
// • изскача само веднъж (около 1 с след отваряне на сайта), с уголемяване от листчето-иконка в менюто;
// • затваря се с ОК, Esc или клик извън нея и „се прибира“ обратно в иконката;
// • браузърът помни, че е видяна; при нова обява в админ панела изскача пак;
// • иконката в менюто остава, докато обявата е активна — с клик се отваря отново.
export default function NoticeNote({ id, text, link }: { id: string; text: string; link: string }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [state, setState] = useState<'closed' | 'open' | 'closing'>('closed');
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const [fresh, setFresh] = useState(false); // още непрочетена → точка върху иконката
  const paperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLButtonElement>(null);

  // мястото в менюто (Header.tsx: #sh-notice-slot)
  useEffect(() => { setSlot(document.getElementById('sh-notice-slot')); }, []);

  const place = useCallback(() => {
    const r = pinRef.current?.getBoundingClientRect();
    if (!r || window.innerWidth <= 640) { setPos(null); return; }
    setPos({ top: r.bottom + 14, right: Math.max(16, window.innerWidth - r.right - 18) });
  }, []);

  const open = useCallback(() => { place(); setState('open'); }, [place]);
  const close = useCallback(() => {
    setState((s) => (s === 'open' ? 'closing' : s));
    setFresh(false);
    try { localStorage.setItem(SEEN, id); } catch { /* браузърът не пази — ще изскочи пак, не е страшно */ }
    setTimeout(() => setState((s) => (s === 'closing' ? 'closed' : s)), 360);
  }, [id]);

  // първо показване
  useEffect(() => {
    if (!slot) return;
    let seen = false;
    try { seen = localStorage.getItem(SEEN) === id; } catch { /* */ }
    if (seen) return;
    setFresh(true);
    const t = setTimeout(open, 1000);
    return () => clearTimeout(t);
  }, [slot, id, open]);

  // Esc, клик извън листчето, преоразмеряване
  useEffect(() => {
    if (state !== 'open') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDown = (e: PointerEvent) => {
      const n = e.target as Node;
      if (paperRef.current?.contains(n) || pinRef.current?.contains(n)) return;
      close();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true }); // горният ред се превърта → менюто се качва, листчето го следва
    return () => {
      window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', place); window.removeEventListener('scroll', place);
    };
  }, [state, close, place]);

  const isOpen = state !== 'closed';
  const pin = (
    <button ref={pinRef} type="button" className={`nn-pin${fresh ? ' is-fresh' : ''}${isOpen ? ' is-on' : ''}`}
      aria-label="Обява" title="Обява" aria-expanded={state === 'open'} aria-controls="site-notice"
      onClick={() => (state === 'open' ? close() : open())}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4.5h14v10.2L14.7 19.5H5z" />
        <path d="M19 14.7h-4.3v4.8" />
        <path d="M8.5 9h7M8.5 12.5h5" />
      </svg>
    </button>
  );

  return (
    <>
      {slot && createPortal(pin, slot)}
      {isOpen && (
        <div id="site-notice" className={`nn${state === 'closing' ? ' is-out' : ''}`} role="dialog" aria-label="Обява"
          style={pos ? { top: pos.top, right: pos.right } : undefined}>
          <div className="np-paper" ref={paperRef}>
            <span className="np-holes" aria-hidden="true"><i /><i /><i /></span>
            <p className="np-h">Обява</p>
            <p className="np-p">{text}</p>
            <div className="np-acts">
              {link && <a className="np-btn np-alt" href={link} onClick={close}>Виж повече</a>}
              <button type="button" className="np-btn" onClick={close}>ОК</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
