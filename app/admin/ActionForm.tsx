'use client';

import { startTransition, useActionState } from 'react';
import type { FormState } from './auth-actions';

// Форма към сървърно действие, което връща грешка или съобщение (вход, пароли, хора).
export default function ActionForm({ action, children, className = 'adm-form', reset = false }: {
  action: (s: FormState, f: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  reset?: boolean;
}) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    // onSubmit вместо action: при грешка полетата остават попълнени (React иначе ги изчиства).
    <form
      className={className}
      key={reset && state?.ok ? state.ok : undefined}
      onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); startTransition(() => run(f)); }}
    >
      {children}
      {state?.error && <p className="adm-msg err" role="alert">{state.error}</p>}
      {state?.ok && <p className="adm-msg ok" role="status">{state.ok}</p>}
      {pending && <p className="adm-muted">Момент…</p>}
    </form>
  );
}
