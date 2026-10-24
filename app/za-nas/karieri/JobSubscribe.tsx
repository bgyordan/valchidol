'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

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
    const { error } = await supabase.from('job_subscribers').insert({ email: value });
    if (error) {
      // дублиран имейл = вече е абониран (не е грешка за потребителя)
      if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
        setState('done'); setMsg('Този имейл вече е абониран. Благодарим!');
      } else {
        setState('err'); setMsg('Възникна грешка. Опитайте отново по-късно.');
      }
      return;
    }
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
