import type { ReactNode } from 'react';

// Същият прост формат като в редактора на ЕИС:
//   всеки ред = абзац · „## “ = подзаглавие · редове с „- “ = списък · **удебелен** · [текст](адрес)
function inline(str: string, key: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(str))) {
    if (m.index > last) parts.push(str.slice(last, m.index));
    if (m[1]) parts.push(<strong key={key + i++}>{m[1]}</strong>);
    else {
      const ext = m[3].startsWith('http');
      parts.push(<a key={key + i++} href={m[3]} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{m[2]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push(str.slice(last));
  return parts;
}

export function RichText({ text }: { text: string | null }) {
  const lines = (text ?? '').replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  const out: ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('## ')) { out.push(<h2 key={i}>{inline(l.slice(3), 'h' + i)}</h2>); continue; }
    if (/^[-•] /.test(l)) {
      const start = i;
      const items: string[] = [];
      while (i < lines.length && /^[-•] /.test(lines[i])) items.push(lines[i++].slice(2));
      i--;
      out.push(<ul key={start}>{items.map((it, k) => <li key={k}>{inline(it, `l${start}-${k}`)}</li>)}</ul>);
      continue;
    }
    out.push(<p key={i}>{inline(l, 'p' + i)}</p>);
  }
  return <>{out}</>;
}
