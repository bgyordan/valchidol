import type { DocRow } from '../../lib/data';

function ext(url: string) {
  const m = url.split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toUpperCase() : 'PDF';
}

// Редове с документи: икона, име, тип файл. Отварят се в нов раздел.
export default function DocRows({ docs }: { docs: Pick<DocRow, 'id' | 'name' | 'file_url'>[] }) {
  return (
    <ul className="doc-rows">
      {docs.map((d) => (
        <li key={d.id}>
          <a href={d.file_url} target="_blank" rel="noopener noreferrer">
            <span className="dr-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" /></svg>
            </span>
            <span className="dr-name">{d.name}</span>
            <span className="dr-type">{ext(d.file_url)}<span className="sr-only">, отваря се в нов раздел</span></span>
          </a>
        </li>
      ))}
    </ul>
  );
}
