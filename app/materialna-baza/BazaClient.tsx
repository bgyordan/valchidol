'use client';

import { useEffect, useRef, useState } from 'react';
import Lightbox from '../components/Lightbox';
import Panorama from '../components/Panorama';

export type SpaceCard = { id: string; name: string; text: string; photos: string[]; pano: string | null; icon: string };

const Ic = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

// Плочки с помещенията (първото е голямо). Плочка → прозорец със снимките, текста и 360° разходка, ако има.
// Адресът се помни (#stem), за да може да се прати връзка направо към помещение.
export default function BazaClient({ spaces }: { spaces: SpaceCard[] }) {
  const [open, setOpen] = useState<SpaceCard | null>(null);
  const [mode, setMode] = useState<'photos' | 'pano'>('photos');
  const [i, setI] = useState(0);
  const [lb, setLb] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);

  const show = (s: SpaceCard) => {
    setOpen(s); setI(0); setMode(s.pano ? 'pano' : 'photos');
    history.replaceState(null, '', `#${s.id}`);
  };
  const hide = () => { dlg.current?.close(); };

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const s = id && spaces.find((x) => x.id === id);
    if (s) show(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  if (!spaces.length) return <p className="empty">Скоро тук ще има снимки на училището.</p>;

  return (
    <>
      <ul className="bz-grid">
        {spaces.map((s, k) => (
          <li key={s.id} className={k === 0 ? 'bz-big' : ''} style={{ ['--i' as string]: k } as React.CSSProperties}>
            <button type="button" className={`bz-card${s.photos[0] ? '' : ' bz-empty'}`} onClick={() => show(s)} aria-haspopup="dialog">
              {s.photos[0] ? <img src={s.photos[0]} alt="" loading={k < 3 ? 'eager' : 'lazy'} /> : <span className="bz-noimg"><Ic d={s.icon} /></span>}
              {s.pano && <span className="bz-360">360°</span>}
              <span className="bz-name">{s.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dlg} className="bz-dlg" aria-label={open?.name} onClose={() => { setOpen(null); history.replaceState(null, '', location.pathname + location.search); }}
        onClick={(e) => { if (e.target === e.currentTarget) hide(); }}>
        {open && (
          <div className="bz-in">
            <div className="bz-media">
              {mode === 'pano' && open.pano ? (
                <Panorama src={open.pano} />
              ) : open.photos.length ? (
                <>
                  <button type="button" className="bz-main" onClick={() => setLb(true)} aria-label="Снимката на цял екран">
                    <img key={open.photos[i]} src={open.photos[i]} alt={`${open.name} — снимка ${i + 1}`} />
                  </button>
                  {open.photos.length > 1 && (
                    <>
                      <button type="button" className="bz-nav prev" aria-label="Предишна снимка" onClick={() => setI((i - 1 + open.photos.length) % open.photos.length)}><Ic d="m15 18-6-6 6-6" /></button>
                      <button type="button" className="bz-nav next" aria-label="Следваща снимка" onClick={() => setI((i + 1) % open.photos.length)}><Ic d="m9 18 6-6-6-6" /></button>
                    </>
                  )}
                </>
              ) : (
                <span className="bz-noimg"><Ic d={open.icon} /></span>
              )}
              {open.pano && open.photos.length > 0 && (
                <div className="bz-modes" role="group" aria-label="Изглед">
                  <button type="button" aria-pressed={mode === 'pano'} onClick={() => setMode('pano')}>360°</button>
                  <button type="button" aria-pressed={mode === 'photos'} onClick={() => setMode('photos')}>Снимки</button>
                </div>
              )}
            </div>
            <div className="bz-side">
              <h2>{open.name}</h2>
              {open.text && <p>{open.text}</p>}
              {open.photos.length > 1 && (
                <div className="bz-thumbs">
                  {open.photos.map((p, k) => (
                    <button key={p} type="button" className={mode === 'photos' && k === i ? 'on' : ''} aria-label={`Снимка ${k + 1}`} onClick={() => { setMode('photos'); setI(k); }}>
                      <img src={p} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className="bz-close" onClick={hide} aria-label="Затвори"><Ic d="M6 6l12 12M18 6 6 18" /></button>
          </div>
        )}
      </dialog>

      {lb && open && <Lightbox photos={open.photos.map((src) => ({ src }))} index={i} onIndex={setI} onClose={() => setLb(false)} title={open.name} />}
    </>
  );
}
