'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';
import './chatbot.css';

// Помощникът на сайта: кръгъл бутон долу вляво, отваря прозорче за въпроси.
// Отговорите идват от /api/chat (търсене в сайта + Workers AI) и винаги са с връзки към източниците.
type Link = { t: string; href: string };
type Msg = { role: 'user' | 'assistant'; content: string; sources?: Link[]; note?: string };

const T = {
  bg: {
    open: 'Попитай', title: 'Помощник', close: 'Затвори', clear: 'Нов разговор',
    hello: 'Здравейте! Мога да помогна с информация от сайта: прием, документи, срокове, контакти. Какво търсите?',
    ask: 'Напишете въпрос…', send: 'Изпрати', thinking: 'Търся в сайта…',
    chips: ['Как се кандидатства в 8. клас?', 'Какво е работното време?', 'Как се получава стипендия?', 'Къде са заявленията?'],
    src: 'Източници', err: 'Нещо се обърка. Опитайте отново след малко.', rate: 'Много въпроси за кратко време. Опитайте след минута.',
    limit: 'Помощникът почива за днес. Ето страниците, които може да помогнат:', off: 'Не мога да отговоря в момента. Ето страниците, които може да помогнат:',
    none: 'Не намерих нищо по този въпрос. Обадете се в деловодството или вижте страница Контакти.',
    disc: 'Отговорите се генерират автоматично от съдържанието на сайта и може да са неточни. Не въвеждайте лични данни.',
  },
  en: {
    open: 'Ask', title: 'Assistant', close: 'Close', clear: 'New chat',
    hello: 'Hello! I can help with information from the school website: admission, contacts, history and projects. What are you looking for?',
    ask: 'Type a question…', send: 'Send', thinking: 'Searching the site…',
    chips: ['How do I contact the school?', 'When was the school founded?', 'What can students study?'],
    src: 'Sources', err: 'Something went wrong. Please try again later.', rate: 'Too many questions in a short time. Please wait a minute.',
    limit: 'The assistant is resting for today. These pages may help:', off: 'I cannot answer right now. These pages may help:',
    none: 'I found nothing on this. Please contact the school office.',
    disc: 'Answers are generated automatically from the website and may be inaccurate. Do not enter personal data.',
  },
};

const KEY = 'su-chat';
const safeHref = (h: string) => (h.startsWith('/') || h.startsWith('https://') ? h : null);

// кратко форматиране: абзаци, списъци с „- “ и връзки [текст](адрес); без HTML от отговора
function Rich({ text }: { text: string }) {
  const inline = (s: string, k: string) => {
    const out: React.ReactNode[] = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0, m: RegExpExecArray | null, i = 0;
    const plain = (x: string) => x.replace(/\*\*|__/g, '');
    while ((m = re.exec(s))) {
      out.push(plain(s.slice(last, m.index)));
      const href = safeHref(m[2]);
      out.push(href ? <a key={k + i++} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{plain(m[1])}</a> : plain(m[1]));
      last = m.index + m[0].length;
    }
    out.push(plain(s.slice(last)));
    return out;
  };
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, bi) => {
        const lines = b.split('\n').filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
          return <ul key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ''), `${bi}-${li}-`)}</li>)}</ul>;
        }
        return <p key={bi}>{lines.map((l, li) => <span key={li}>{li > 0 && <br />}{inline(l.replace(/^#+\s*/, ''), `${bi}-${li}-`)}</span>)}</p>;
      })}
    </>
  );
}

export default function ChatBot() {
  const path = usePathname() || '/';
  const lang = isEnPath(path) ? 'en' : 'bg';
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try { const s = JSON.parse(sessionStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) setMsgs(s.slice(-20)); } catch { /* */ }
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-20))); } catch { /* */ }
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (path.startsWith('/admin')) return null;

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const history = msgs.map(({ role, content }) => ({ role, content }));
    setMsgs((m) => [...m, { role: 'user', content: question }]);
    setQ('');
    setBusy(true);
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q: question, history, lang }) });
      if (r.status === 429) { setMsgs((m) => [...m, { role: 'assistant', content: t.rate }]); return; }
      const d = (await r.json()) as { answer?: string; fallback?: string; sources?: Link[] };
      const answer = d.answer;
      if (answer) setMsgs((m) => [...m, { role: 'assistant', content: answer, sources: d.sources }]);
      else if (d.sources?.length) setMsgs((m) => [...m, { role: 'assistant', content: d.fallback === 'limit' ? t.limit : t.off, sources: d.sources }]);
      else setMsgs((m) => [...m, { role: 'assistant', content: t.none }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: t.err }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={`cb-fab${open ? ' on' : ''}`} aria-expanded={open} aria-controls="cb-panel" onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /><path className="cb-dots" d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" /></svg>
        <span>{open ? t.close : t.open}</span>
      </button>

      {open && (
        <section id="cb-panel" className="cb" role="dialog" aria-label={t.title} lang={lang}>
          <header className="cb-head">
            <span className="cb-av" aria-hidden="true"><img src="/logo.png" alt="" /></span>
            <p className="cb-t">{t.title}</p>
            {msgs.length > 0 && <button type="button" className="cb-clear" onClick={() => setMsgs([])}>{t.clear}</button>}
            <button type="button" className="cb-x" aria-label={t.close} onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <div className="cb-list" ref={list} aria-live="polite">
            <div className="cb-msg bot"><p>{t.hello}</p></div>
            {msgs.length === 0 && (
              <div className="cb-chips">
                {t.chips.map((c, i) => <button key={c} type="button" style={{ ['--i' as string]: i } as React.CSSProperties} onClick={() => ask(c)}>{c}</button>)}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`cb-msg ${m.role === 'user' ? 'me' : 'bot'}`}>
                {m.role === 'user' ? <p>{m.content}</p> : <Rich text={m.content} />}
                {m.sources && m.sources.length > 0 && (
                  <div className="cb-src">
                    <span>{t.src}</span>
                    {m.sources.map((s) => {
                      const h = safeHref(s.href);
                      return h ? <a key={h} href={h} {...(h.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{s.t}</a> : null;
                    })}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="cb-msg bot cb-wait" aria-label={t.thinking}><i /><i /><i /></div>}
          </div>

          <form className="cb-form" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
            <textarea
              ref={input} rows={1} value={q} maxLength={500} placeholder={t.ask} aria-label={t.ask}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(q); } }}
            />
            <button type="submit" disabled={busy || !q.trim()} aria-label={t.send}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <p className="cb-disc">{t.disc}</p>
        </section>
      )}
    </>
  );
}
