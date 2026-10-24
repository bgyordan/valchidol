'use client';

import { useEffect, useRef } from 'react';

// Лек паралакс: подава позицията на мишката към родителската секция като --px / --py (от -1 до 1).
// Кръговете на детелината се изместват според тях с различна „дълбочина“. Без мишка/при намалено движение — нищо.
export default function HeroPointer() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      host.style.setProperty('--px', x.toFixed(3));
      host.style.setProperty('--py', y.toFixed(3));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} hidden />;
}
