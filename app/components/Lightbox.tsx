'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './lightbox.css';

export type LbPhoto = { src: string; caption?: string | null };

/**
 * Модерен преглед на снимки — общ за новините и галерията.
 * Стрелки ← →, Esc, плъзгане с пръст, лента с миниатюри, брояч, изтегляне.
 */
export default function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
  title,
}: {
  photos: LbPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  title?: string;
}) {
  const n = photos.length;
  const [loaded, setLoaded] = useState(false);
  const touchX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  // клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // без скрол на страницата отдолу
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // плавно появяване при смяна + предварително зареждане на съседните
  useEffect(() => {
    setLoaded(false);
    [1, -1].forEach((d) => {
      const p = photos[(index + d + n) % n];
      if (p) { const im = new Image(); im.src = p.src; }
    });
    const active = thumbsRef.current?.querySelector<HTMLElement>('[data-active="1"]');
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index, n, photos]);

  const cur = photos[index];
  if (!cur) return null;

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={title || 'Снимки'} onClick={onClose}>
      <div className="lb-bg" style={{ backgroundImage: `url("${cur.src}")` }} aria-hidden="true" />

      <div className="lb-top" onClick={(e) => e.stopPropagation()}>
        <div className="lb-count">
          <strong>{index + 1}</strong><span> / {n}</span>
          {title && <em className="lb-title">{title}</em>}
        </div>
        <div className="lb-actions">
          <a className="lb-btn" href={cur.src} download target="_blank" rel="noopener noreferrer" aria-label="Изтегли" title="Изтегли">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
          </a>
          <button className="lb-btn" onClick={onClose} aria-label="Затвори" title="Затвори (Esc)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div
        className="lb-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {n > 1 && (
          <button className="lb-nav prev" onClick={() => go(-1)} aria-label="Предишна">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
        )}

        <figure className="lb-figure">
          {!loaded && <span className="lb-spin" aria-hidden="true" />}
          <img
            key={cur.src}
            src={cur.src}
            alt={cur.caption || `${title || 'Снимка'} ${index + 1}`}
            className={loaded ? 'is-in' : ''}
            onLoad={() => setLoaded(true)}
            draggable={false}
          />
          {cur.caption && <figcaption>{cur.caption}</figcaption>}
        </figure>

        {n > 1 && (
          <button className="lb-nav next" onClick={() => go(1)} aria-label="Следваща">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        )}
      </div>

      {n > 1 && (
        <div className="lb-thumbs" ref={thumbsRef} onClick={(e) => e.stopPropagation()}>
          {photos.map((p, i) => (
            <button
              key={p.src + i}
              data-active={i === index ? '1' : '0'}
              className={`lb-thumb${i === index ? ' on' : ''}`}
              onClick={() => onIndex(i)}
              aria-label={`Снимка ${i + 1}`}
            >
              <img src={p.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
