// Списък с връзки като редове с икона (без карти). Използва се навсякъде за „разгледайте още“.
const ICONS: Record<string, string> = {
  doc: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  cart: 'M3 7h18v13H3zM8 7V4h8v3',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z',
  chat: 'M4 5h16v11H9l-5 4z',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  building: 'M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  briefcase: 'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18',
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  heart: 'M12 20s-7-4.4-9.3-8.5C1 8.4 2.6 5 6 5c2 0 3.3 1.2 4 2.3h4C14.7 6.2 16 5 18 5c3.4 0 5 3.4 3.3 6.5C19 15.6 12 20 12 20z',
  clipboard: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  camera: 'M4 7h4l2-3h4l2 3h4v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  news: 'M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3',
  download: 'M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  pin: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-5M12 8h.01',
};

export function Ic({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name] ?? ICONS.doc} />
    </svg>
  );
}

export type LinkItem = { t: string; d?: string; href?: string; icon?: string; external?: boolean; download?: boolean };

export default function LinkList({ items, cols = 2 }: { items: LinkItem[]; cols?: number }) {
  return (
    <div className="link-list" style={{ ['--cols' as string]: cols } as React.CSSProperties}>
      {items.map((it) => {
        const inner = (
          <>
            <span className="ll-ic"><Ic name={it.icon ?? 'doc'} /></span>
            <span>
              <span className="ll-t">{it.t}</span>
              {it.d && <span className="ll-d">{it.d}</span>}
            </span>
          </>
        );
        if (!it.href) return <div key={it.t} className="ll-item">{inner}</div>;
        return (
          <a key={it.href + it.t} href={it.href}
            {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(it.download ? { download: true } : {})}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}
