'use client';

import { useState } from 'react';
import Lightbox from '../components/Lightbox';
import type { Album, Photo } from '../../lib/data';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function GalleryClient({ albums, photos }: { albums: Album[]; photos: Photo[] }) {
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const albumPhotos = openAlbum
    ? photos.filter((p) => p.album_id === openAlbum.id)
    : [];

  if (albums.length === 0) {
    return (
      <div className="gal-wrap">
        <div className="wrap">
          <div className="gal-empty">Все още няма качени албуми.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gal-wrap">
      <div className="wrap">
        {/* ===== АЛБУМИ ===== */}
        {!openAlbum && (
          <div className="gal-albums">
            {albums.map((a) => (
              <div key={a.id}>
                <button className="gal-album" onClick={() => setOpenAlbum(a)}>
                  <div className="gal-album-img">
                    {a.cover_url ? <img src={a.cover_url} alt={a.title} /> : <div className="gal-noimg"><span>ЦСОП</span></div>}
                    <div className="gal-album-overlay">
                      <span className="gal-album-count">{a.photo_count} снимки</span>
                    </div>
                  </div>
                  <div className="gal-album-info">
                    <h3>{a.title}</h3>
                    <span>{formatDate(a.event_date)}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ===== ОТВОРЕН АЛБУМ (MASONRY) ===== */}
        {openAlbum && (
          <div className="gal-open">
            <button className="gal-back" onClick={() => setOpenAlbum(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Всички албуми
            </button>
            <div className="gal-open-head">
              <h2>{openAlbum.title}</h2>
              <span>{formatDate(openAlbum.event_date)} · {albumPhotos.length} снимки</span>
            </div>

            <div className="gal-masonry">
              {albumPhotos.map((p, i) => (
                <button key={p.id} className="gal-tile" onClick={() => setLightbox(i)}>
                  <img src={p.photo_url} alt={p.caption ?? ''} loading="lazy" />
                  {p.caption && <span className="gal-tile-cap">{p.caption}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== ПРЕГЛЕД (общ с новините) ===== */}
      {lightbox !== null && albumPhotos[lightbox] && (
        <Lightbox
          photos={albumPhotos.map((p) => ({ src: p.photo_url, caption: p.caption }))}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
          title={openAlbum?.title}
        />
      )}
    </div>
  );
}
