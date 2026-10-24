'use client';

import { useState } from 'react';

// Картата на Google зарежда бисквитки — показваме я чак след клик.
export default function MapEmbed({ src, link, lang = 'bg' }: { src: string; link: string; lang?: 'bg' | 'en' }) {
  const en = lang === 'en';
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <div className="map-frame">
        <iframe src={src} title={en ? 'Map – Vasil Levski Secondary School, Valchi Dol' : 'Карта – СУ „Васил Левски“, гр. Вълчи дол'} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="map-frame map-off">
      <div>
        <h3>{en ? 'Where to find us' : 'Къде се намираме'}</h3>
        <p className="muted">{en ? 'The map is loaded from Google and may set cookies.' : 'Картата се зарежда от Google и може да постави бисквитки.'}</p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
          <button type="button" className="btn btn-dark" onClick={() => setOn(true)}>{en ? 'Show the map' : 'Покажи картата'}</button>
          <a className="btn btn-ghost" href={link} target="_blank" rel="noopener noreferrer">{en ? 'Open in Google Maps' : 'Отвори в Google Maps'}</a>
        </div>
      </div>
    </div>
  );
}
