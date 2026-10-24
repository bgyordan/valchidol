'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';
import './chat.css';

type Msg = { role: 'user' | 'assistant'; text: string };
const KEY = 'csop-chat';

const T = {
  bg: {
    fab: 'Попитайте ни', title: 'Помощник на ЦСОП', sub: 'Автоматични отговори по информацията от сайта',
    hello: 'Здравейте! Аз съм виртуалният помощник на ЦСОП Варна. Мога да ви кажа как се записва дете, какви терапии има, работното време и как да се свържете с нас.',
    chips: ['Как се записва дете?', 'Какви терапии предлагате?', 'Какво е работното време?', 'Как мога да направя дарение?'],
    ph: 'Напишете въпрос…', send: 'Изпрати', close: 'Затвори', clear: 'Нов разговор', typing: 'Пише…',
    err: 'Не успях да отговоря в момента. Опитайте пак или се обадете на', busy: 'В момента има много въпроси. Опитайте след минута или се обадете на',
    rate: 'Зададохте много въпроси за кратко време. Опитайте след малко.',
    note: 'Отговорите се генерират автоматично и може да съдържат неточности. За важни въпроси:',
  },
  en: {
    fab: 'Ask us', title: 'CSOP assistant', sub: 'Automatic answers based on the website',
    hello: 'Hello! I am the virtual assistant of CSOP Varna. I can tell you how a child is enrolled, what therapies we offer, our opening hours and how to contact us.',
    chips: ['How is a child enrolled?', 'What therapies do you offer?', 'What are your opening hours?', 'How can I donate?'],
    ph: 'Type a question…', send: 'Send', close: 'Close', clear: 'New conversation', typing: 'Typing…',
    err: 'I could not answer right now. Please try again or call', busy: 'There are many questions right now. Please try again in a minute or call',
    rate: 'You asked many questions in a short time. Please try again later.',
    note: 'Answers are generated automatically and may contain mistakes. For important questions:',
  },
};

// адреси от сайта (/priem/proczedura) и пълни https връзки → щракаеми
function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+|(?<![\w/])\/[a-z0-9][a-z0-9\-/]*[a-z0-9])/gi);
  return parts.map((p, i) => {
    if (/^https?:\/\//i.test(p)) return <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p.replace(/^https?:\/\//, '')}</a>;
    if (/^\/[a-z0-9]/i.test(p)) return <a key={i} href={p}>{p}</a>;
    return <span key={i}>{p}</span>;
  });
}

export default function ChatWidget({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const lang = isEnPath(usePathname() || '/') ? 'en' : 'bg';
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  // разговорът се пази само в този раздел на браузъра (до затваряне)
  useEffect(() => {
    try { const s = JSON.parse(sessionStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) setMsgs(s[s.length - 1]?.role === 'user' ? s.slice(0, -1) : s); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-20))); } catch { /* ignore */ }
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, error]);
  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // въпрос без отговор не остава в разговора (иначе следващият отговор е за него) — връща се в полето
  function fail(e: string) {
    setMsgs((m) => {
      const last = m[m.length - 1];
      if (last?.role === 'user') { setText(last.text); return m.slice(0, -1); }
      return m;
    });
    setError(e);
  }

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const next = [...msgs, { role: 'user' as const, text: question }];
    setMsgs(next); setText(''); setBusy(true); setError('');
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next, lang }) });
      const j: any = await res.json().catch(() => ({}));
      if (j.ok && j.reply) setMsgs([...next, { role: 'assistant', text: j.reply }]);
      else fail(j.error === 'rate' ? t.rate : j.error === 'busy' ? 'busy' : 'err');
    } catch {
      fail('err');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button type="button" className="cw-fab" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z" /><path d="M8.5 8.5h7M8.5 11.5h4.5" /></svg>
          <span>{t.fab}</span>
        </button>
      )}
      {open && (
        <div className="cw" role="dialog" aria-label={t.title} lang={lang}>
          <div className="cw-head">
            <img src="/logo.jpg" alt="" width={36} height={36} />
            <div><b>{t.title}</b><small>{t.sub}</small></div>
            {msgs.length > 0 && (
              <button type="button" className="cw-ic" onClick={() => { setMsgs([]); setError(''); }} aria-label={t.clear} title={t.clear}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6M5.5 15a7.5 7.5 0 0 0 13 2M18.5 9a7.5 7.5 0 0 0-13-2" /></svg>
              </button>
            )}
            <button type="button" className="cw-ic" onClick={() => setOpen(false)} aria-label={t.close} title={t.close}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>

          <div className="cw-list" ref={list} aria-live="polite">
            <div className="cw-m cw-a">{t.hello}</div>
            {msgs.length === 0 && (
              <div className="cw-chips">
                {t.chips.map((c) => <button key={c} type="button" onClick={() => ask(c)}>{c}</button>)}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`cw-m ${m.role === 'user' ? 'cw-u' : 'cw-a'}`}>{m.role === 'assistant' ? linkify(m.text) : m.text}</div>
            ))}
            {busy && <div className="cw-m cw-a cw-typing" aria-label={t.typing}><i /><i /><i /></div>}
            {error && (
              <div className="cw-m cw-a cw-err">
                {error === 'err' ? t.err : error === 'busy' ? t.busy : error}{' '}
                {(error === 'err' || error === 'busy') && <a href={phoneHref}>{phone}</a>}
              </div>
            )}
          </div>

          <form className="cw-form" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
            <textarea
              ref={input} value={text} rows={1} maxLength={600} placeholder={t.ph} aria-label={t.ph}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(text); } }}
            />
            <button type="submit" disabled={busy || !text.trim()} aria-label={t.send} title={t.send}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <p className="cw-note">{t.note} <a href={phoneHref}>{phone}</a></p>
        </div>
      )}
    </>
  );
}
