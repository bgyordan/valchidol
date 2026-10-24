'use client';

import { useEffect, useRef, useState } from 'react';
import '@fontsource-variable/caveat';
import './notepaper.css';
import './contactform.css';

const T = {
  bg: {
    h: 'Пишете ни', sub: 'Ще ви отговорим на посочения имейл, обикновено до два работни дни.',
    name: 'Име и фамилия', email: 'Имейл', phone: 'Телефон', opt: 'по желание', topic: 'Тема', msg: 'Съобщение',
    topics: { general: 'Общ въпрос', admission: 'Прием', donation: 'Дарение', site: 'Сайт / технически проблем', other: 'Друго' },
    consent: 'Съгласен/съгласна съм данните ми да се използват само за отговор на това запитване.',
    privacy: 'Лични данни', send: 'Изпрати', sending: 'Изпращане…',
    ok: 'Благодарим! Съобщението е изпратено — ще ви отговорим скоро.', again: 'Ново съобщение',
    noteH: 'Благодарим ви!', noteP: 'Съобщението ви е при нас. Ще ви отговорим на посочения имейл, обикновено до два работни дни.', okBtn: 'ОК',
    err: 'Съобщението не беше изпратено. Опитайте отново или пишете на', rate: 'Изпратихте няколко съобщения за кратко време. Опитайте след малко.',
    invalid: 'Проверете името, имейла и съобщението.',
  },
  en: {
    h: 'Write to us', sub: 'We will reply to the e-mail you give, usually within two working days.',
    name: 'Full name', email: 'E-mail', phone: 'Phone', opt: 'optional', topic: 'Topic', msg: 'Message',
    topics: { general: 'General question', admission: 'Admission', donation: 'Donation', site: 'Website / technical problem', other: 'Other' },
    consent: 'I agree that my data will be used only to reply to this enquiry.',
    privacy: 'Privacy', send: 'Send', sending: 'Sending…',
    ok: 'Thank you! Your message has been sent — we will reply soon.', again: 'New message',
    noteH: 'Thank you!', noteP: 'We have your message. We will reply to the e-mail you gave, usually within two working days.', okBtn: 'OK',
    err: 'The message could not be sent. Please try again or write to', rate: 'You sent several messages in a short time. Please try again later.',
    invalid: 'Please check your name, e-mail and message.',
  },
};

// Контактна форма → /api/kontakt → писмо от eis@ до tech@ (Reply-To = подателя)
export default function ContactForm({ lang = 'bg', email, topic = 'general' }: { lang?: 'bg' | 'en'; email: string; topic?: string }) {
  const t = T[lang];
  const [t0, setT0] = useState(0);
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState<'open' | 'closing' | null>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setT0(Date.now()); }, []);

  // Бележката „лист от тетрадка“: изскача с уголемяване, сама изчезва след ~8 с (спира, докато мишката е върху нея),
  // затваря се и с ОК или Esc. Не е модален прозорец — страницата отзад остава достъпна.
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (note !== 'open') return;
    okRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeNote(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [note]);
  useEffect(() => {
    if (note !== 'open' || hold) return;
    const id = setTimeout(closeNote, 8000);
    return () => clearTimeout(id);
  }, [note, hold]);
  function closeNote() {
    setNote((n) => (n === 'open' ? 'closing' : n));
    setTimeout(() => { setNote(null); setHold(false); setState('idle'); setT0(Date.now()); }, 380);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setState('sending'); setMsg('');
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'), phone: f.get('phone'), topic: f.get('topic'),
          message: f.get('message'), consent: f.get('consent') === 'on', website: f.get('website'), t: t0, lang,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (j.ok) { form.reset(); setState('ok'); setNote('open'); return; }
      setState('error');
      setMsg(j.error === 'rate' ? t.rate : j.error === 'invalid' ? t.invalid : '');
    } catch {
      setState('error'); setMsg('');
    }
  }

  return (
    <>
    <form className="cf" onSubmit={submit} noValidate={false}>
      <div className="cf-head">
        <h2>{t.h}</h2>
        <p className="muted">{t.sub}</p>
      </div>
      <div className="cf-grid">
        <label className="cf-f">
          <span>{t.name}</span>
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className="cf-f">
          <span>{t.email}</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
        <label className="cf-f">
          <span>{t.phone} <i>({t.opt})</i></span>
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
        </label>
        <label className="cf-f">
          <span>{t.topic}</span>
          <select name="topic" defaultValue={topic}>
            {Object.entries(t.topics).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="cf-f cf-wide">
          <span>{t.msg}</span>
          <textarea name="message" required minLength={5} maxLength={5000} rows={6} />
        </label>
        {/* капан за ботове — скрито за хората */}
        <label className="cf-hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="cf-consent">
        <input type="checkbox" name="consent" required />
        <span>{t.consent} <a href="/za-nas/zashtita-na-lichnite-danni" target="_blank" rel="noopener">{t.privacy}</a></span>
      </label>
      {state === 'error' && (
        <p className="cf-err" role="alert">{msg || <>{t.err} <a href={`mailto:${email}`}>{email}</a>.</>}</p>
      )}
      <button type="submit" className="btn btn-dark cf-send" disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.send}
      </button>
    </form>
    {note && (
      <div className={`cf-note${note === 'closing' ? ' is-out' : ''}${hold ? ' is-hold' : ''}`} role="status" aria-live="polite"
        onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        <div className="np-paper">
          <span className="np-holes" aria-hidden="true"><i /><i /><i /></span>
          <p className="np-h">{t.noteH}</p>
          <p className="np-p">{t.noteP}</p>
          <div className="np-acts"><button ref={okRef} type="button" className="np-btn" onClick={closeNote}>{t.okBtn}</button></div>
          <span className="np-timer" aria-hidden="true" />
        </div>
      </div>
    )}
    </>
  );
}
