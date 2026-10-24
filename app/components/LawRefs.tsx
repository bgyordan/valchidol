import './lawrefs.css';

type Item = { label: string; href: string };

export default function LawRefs({
  items,
  title = 'Нормативна уредба',
  note,
}: {
  items: Item[];
  title?: string;
  note?: string;
}) {
  return (
    <div className="lawrefs">
      <h2>{title}</h2>
      <ul>
        {items.map((it, i) => (
          <li key={`${i}-${it.href}`}>
            <a href={it.href} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 3h7v7M21 3l-9 9M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />
              </svg>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
      {note ? <p className="lawrefs-note prose-note">{note}</p> : null}
    </div>
  );
}
