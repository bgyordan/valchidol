'use client';

import { useState } from 'react';

export default function JobSubscribe() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState('err'); setMsg('Моля, въведете валиден имейл адрес.');
      return;
    }
    setState('busy'); setMsg('');
    let r: { ok?: boolean; dup?: boolean } = {};
    try {
      const res = await fetch('/api/abonament', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: value }) });
      r = (await res.json()) as typeof r;
    } catch { /* r остава празен → грешка */ }
    if (r.dup) { setState('done'); setMsg('Този имейл вече е абониран. Благодарим!'); return; }
    if (!r.ok) { setState('err'); setMsg('Възникна грешка. Опитайте отново по-късно.'); return; }
    setState('done'); setMsg('Готово! Ще ви известим при нова обява.');
    setEmail('');
  }

  return (
    <section className="job-subscribe">
      <div className="js-text">
        <h3>Известие за нови обяви</h3>
        <p>Оставете имейла си и ще ви уведомим, когато обявим нова свободна позиция.</p>
      </div>

      {state === 'done' ? (
        <div className="js-done">{msg}</div>
      ) : (
        <form className="js-form" onSubmit={submit}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (state === 'err') setState('idle'); }}
            placeholder="вашият@имейл.бг"
            aria-label="Имейл за абонамент"
            disabled={state === 'busy'}
          />
          <button type="submit" className="btn btn-primary" disabled={state === 'busy'}>
            {state === 'busy' ? 'Момент…' : 'Абонирай ме'}
          </button>
        </form>
      )}
      {state === 'err' && <div className="js-err">{msg}</div>}
    </section>
  );
}
