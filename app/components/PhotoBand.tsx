'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';
import './photoband.css';

// Лента със снимки + общия преглед. Използва се от PagePhotos и началната страница.
export default function PhotoBand({ photos, title }: { photos: string[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;
  return (
    <>
      <div className={`pband n${Math.min(photos.length, 5)}`}>
        {photos.slice(0, 5).map((src, i) => (
          <button key={src + i} type="button" className="pband-item" onClick={() => setOpen(i)} aria-label={`Отвори снимка ${i + 1}`}>
            <img src={src} alt="" loading="lazy" />
            {i === 4 && photos.length > 5 && <span className="pband-more">+{photos.length - 5}</span>}
          </button>
        ))}
      </div>
      {open !== null && (
        <Lightbox photos={photos.map((src) => ({ src }))} index={open} onIndex={setOpen} onClose={() => setOpen(null)} title={title} />
      )}
    </>
  );
}
