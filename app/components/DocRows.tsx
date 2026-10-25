import type { DocRow } from '../../lib/data';

function ext(url: string) {
  const m = url.split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toUpperCase() : 'PDF';
}

// Редове с документи: икона, име, тип файл. Щракване → преглед в прозорец (DocPreview); с Ctrl — нов раздел.
// без markdown знаци, останали от стария сайт („##### Име“, „**Име**“)
const clean = (n: string) => n.replace(/^[#\s]+/, '').replace(/\*\*/g, '').trim();

export default function DocRows({ docs }: { docs: Pick<DocRow, 'id' | 'name' | 'file_url'>[] }) {
  return (
    <ul className="doc-rows">
      {docs.map((d) => (
        <li key={d.id}>
          {!d.file_url ? (
            // документ, чийто файл още не е качен (от стария сайт)
            <span className="dr-nofile">
              <span className="dr-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h9l5 5v15H6zM14 2v6h6" /></svg>
              </span>
              <span className="dr-name">{clean(d.name)}</span>
              <span className="dr-type">няма файл</span>
            </span>
          ) : (
          <a href={d.file_url} target="_blank" rel="noopener noreferrer">
            <span className="dr-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" /></svg>
            </span>
            <span className="dr-name">{clean(d.name)}</span>
            <span className="dr-type">{ext(d.file_url)}</span>
          </a>
          )}
        </li>
      ))}
    </ul>
  );
}
