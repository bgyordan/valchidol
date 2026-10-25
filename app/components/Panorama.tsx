'use client';

import { useEffect, useRef, useState } from 'react';

// 360° разходка: панорамна снимка (2:1, от телефон или 360° камера), която се върти с мишка, пръст или стрелки.
// Използва Pannellum (в public/vendor), зареден само когато се отвори панорама.
const JS = '/vendor/pannellum/pannellum.js'; // Pannellum 2.5.6 (MIT), в public/vendor
const CSS = '/vendor/pannellum/pannellum.css';

type Viewer = { destroy: () => void };
declare global { interface Window { pannellum?: { viewer: (el: HTMLElement, o: Record<string, unknown>) => Viewer } } }

let loading: Promise<void> | null = null;
function load(): Promise<void> {
  if (window.pannellum) return Promise.resolve();
  loading ??= new Promise((ok, fail) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = CSS;
    document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = JS; s.async = true;
    s.onload = () => ok(); s.onerror = () => { loading = null; fail(new Error('pannellum')); };
    document.head.appendChild(s);
  });
  return loading;
}

export default function Panorama({ src }: { src: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let v: Viewer | null = null;
    let gone = false;
    load().then(() => {
      if (gone || !el.current || !window.pannellum) return;
      v = window.pannellum.viewer(el.current, {
        type: 'equirectangular', panorama: src, autoLoad: true, autoRotate: -2, autoRotateInactivityDelay: 4000,
        showZoomCtrl: true, showFullscreenCtrl: true, compass: false, hfov: 105, strings: { loadingLabel: 'Зареждане…' },
      });
    }).catch(() => setErr(true));
    return () => { gone = true; try { v?.destroy(); } catch { /* */ } };
  }, [src]);
  if (err) return <p className="pano-err">360° изгледът не можа да се зареди.</p>;
  return <div ref={el} className="pano" role="img" aria-label="360° изглед — плъзнете, за да се огледате" />;
}
