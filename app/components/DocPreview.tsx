'use client';

import { useEffect, useRef, useState } from 'react';

// Преглед на документ в прозорец върху страницата, вместо файлът да се тегли.
// Хваща щракванията по документи навсякъде в сайта (списъците с документи и връзките към файлове в текста).
// PDF и снимки — направо; Word, Excel, PowerPoint — през прегледа на Office; Google Drive — през прегледа на Drive.

const OFFICE = /\.(docx?|xlsx?|pptx?|rtf|odt|ods|odp)$/i;
const PDF = /\.pdf$/i;
const IMG = /\.(jpe?g|png|gif|webp)$/i;

type Doc = { src: string; open: string; name: string; download?: string; kind: 'pdf' | 'img' | 'frame' };

function pathOf(u: URL) { return decodeURIComponent(u.pathname); }

function viewFor(href: string, name: string): Doc | null {
  let u: URL;
  try { u = new URL(href, location.href); } catch { return null; }
  const p = pathOf(u);
  // Google Drive / Docs
  const g = u.hostname.match(/^(docs|drive)\.google\.com$/);
  if (g) {
    const doc = p.match(/^\/(document|spreadsheets|presentation)\/d\/([\w-]+)/);
    if (doc) return { kind: 'frame', src: `https://docs.google.com/${doc[1]}/d/${doc[2]}/preview`, open: href, name };
    const id = p.match(/\/file\/d\/([\w-]+)/)?.[1] ?? u.searchParams.get('id');
    if (id && !/folders/.test(p)) return { kind: 'frame', src: `https://drive.google.com/file/d/${id}/preview`, open: href, name };
    return null;
  }
  const own = u.origin === location.origin;
  if (!own && !/^https?:$/.test(u.protocol)) return null;
  const file = p.split('/').pop() || '';
  const ext = file.match(/\.[a-z0-9]+$/i)?.[0] ?? '';
  const download = own ? (name.replace(/[\\/:*?"<>|]+/g, ' ').trim().slice(0, 120) || 'dokument') + ext : undefined;
  if (PDF.test(p)) {
    // телефоните често нямат вграден преглед на PDF — там се отваря направо в браузъра
    if (!(navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled) return null;
    return { kind: 'pdf', src: u.href, open: u.href, name, download };
  }
  if (IMG.test(p)) return { kind: 'img', src: u.href, open: u.href, name, download };
  if (OFFICE.test(p)) {
    // прегледът на Office иска публичен адрес — на localhost не става
    if (/^(localhost|127\.)/.test(u.hostname)) return null;
    return { kind: 'frame', src: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(u.href)}`, open: u.href, name, download };
  }
  return null;
}

export default function DocPreview() {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loaded, setLoaded] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.hasAttribute('download') || a.dataset.noPreview != null) return;
      // само документи в съдържанието, не менюто и бутоните
      if (!a.closest('.doc-rows, .page-body, .prose-block, .article-body, [data-preview-scope]')) return;
      const name = (a.querySelector('.dr-name')?.textContent || a.textContent || '').trim();
      const v = viewFor(a.getAttribute('href') || '', name);
      if (!v) return;
      e.preventDefault();
      back.current = a;
      setLoaded(false);
      setDoc(v);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (doc && !d.open) { d.showModal(); document.documentElement.classList.add('dp-lock'); }
    if (!doc && d.open) d.close();
  }, [doc]);

  const close = () => {
    setDoc(null);
    document.documentElement.classList.remove('dp-lock');
    back.current?.focus();
  };

  return (
    <dialog ref={dlg} className="dp" aria-label={doc ? `Преглед: ${doc.name}` : 'Преглед на документ'} onClose={close}
      onClick={(e) => { if (e.target === dlg.current) close(); }}>
      {doc && (
        <div className="dp-box">
          <div className="dp-bar">
            <p className="dp-name" title={doc.name}>{doc.name}</p>
            <div className="dp-acts">
              {doc.download && <a className="dp-btn" href={doc.open} download={doc.download}>Изтегли</a>}
              <a className="dp-btn" href={doc.open} target="_blank" rel="noopener noreferrer" data-no-preview="">Нов раздел</a>
              <button type="button" className="dp-x" onClick={close} aria-label="Затвори">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </div>
          <div className={`dp-view${loaded ? ' ok' : ''}`}>
            {!loaded && <span className="dp-wait" aria-hidden="true" />}
            {doc.kind === 'img'
              ? <img src={doc.src} alt={doc.name} onLoad={() => setLoaded(true)} />
              : <iframe key={doc.src} src={doc.src} title={doc.name} onLoad={() => setLoaded(true)} allow="fullscreen" />}
          </div>
        </div>
      )}
    </dialog>
  );
}
