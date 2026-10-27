'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Снимките в героя на началната страница.
// • Смяна „на ленти“: новата снимка влиза на 7 вертикални ленти, една след друга, редуващи се отгоре и отдолу —
//   като страници на стар албум. Активната снимка бавно се приближава (Кен Бърнс).
// • „Фенер“: тъмният слой над снимката изсветлява там, където е мишката — снимката „прозира“ около нея;
//   на телефон светлото петно бавно се разхожда само (CSS, виж home.css).
// • Вдясно: номерата на снимките с тънка линия, която се пълни до следващата смяна; с клик се избира снимка.
const STRIPS = 7;
const EVERY = 7000; // ms на снимка

export default function HeroSlides({ slides }: { slides: string[] }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [moved, setMoved] = useState(false); // първата снимка се показва без ленти
  const [paused, setPaused] = useState(false);
  const media = useRef<HTMLDivElement>(null);
  const n = slides.length;

  const go = useCallback((k: number) => {
    setCur((c) => {
      if (k === c) return c;
      setPrev(c);
      setMoved(true);
      return k;
    });
  }, []);

  // автоматична смяна; спира, когато мишката е върху номерата или разделът е скрит
  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setTimeout(() => go((cur + 1) % n), EVERY);
    return () => clearTimeout(t);
  }, [cur, n, paused, go]);

  // „фенерът“ следва мишката (плавно, с requestAnimationFrame)
  useEffect(() => {
    const hero = media.current?.closest<HTMLElement>('.hh');
    if (!hero || window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    let tx = 0.76, ty = 0.42, x = tx, y = ty, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;
      hero.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
      hero.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      hero.classList.add('lit');
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { tx = 0.76; ty = 0.42; hero.classList.remove('lit'); if (!raf) raf = requestAnimationFrame(tick); };
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);

  if (!n) return null;
  return (
    <>
      <div className={`hs-media${moved ? ' moved' : ''}`} ref={media} aria-hidden="true">
        {slides.map((src, i) => (
          <div key={src + i} className={`hs-slide${i === cur ? ' is-cur' : ''}${i === prev ? ' is-prev' : ''}`}>
            {/* цялата снимка (в покой); лентите над нея се виждат само докато снимката влиза */}
            <img className="hs-full" src={src} alt="" fetchPriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            {i === cur && moved && Array.from({ length: STRIPS }, (_, k) => (
              <span key={`${cur}-${k}`} className="hs-strip" style={{ ['--k' as string]: k, left: `${(k * 100) / STRIPS}%`, width: `${100 / STRIPS + 0.05}%` } as React.CSSProperties}>
                <img src={src} alt="" style={{ left: `${-k * 100}%`, width: `${STRIPS * 100}%` }} decoding="async" />
              </span>
            ))}
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="hs-nav" role="group" aria-label="Снимки" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          {slides.map((_, i) => (
            <button key={i} type="button" className={i === cur ? 'on' : ''} aria-label={`Снимка ${i + 1}`} aria-current={i === cur} onClick={() => go(i)}>
              <span className="hs-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="hs-bar"><i key={i === cur ? `on${cur}${paused}` : 'off'} style={{ animationDuration: `${EVERY}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
