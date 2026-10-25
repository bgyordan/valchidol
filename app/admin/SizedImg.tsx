'use client';

import { useState } from 'react';

// Снимка в админа с размера ѝ: под `min` пиксела ширина се показва „малка“ — на сайта ще изглежда размазана.
export default function SizedImg({ src, min = 1200 }: { src: string; min?: number }) {
  const [w, setW] = useState(0);
  return (
    <>
      <img src={src} alt="" loading="lazy" onLoad={(e) => setW(e.currentTarget.naturalWidth)} />
      {w > 0 && <span className={`adm-size${w < min ? ' small' : ''}`}>{w < min ? `малка · ${w}px` : `${w}px`}</span>}
    </>
  );
}
