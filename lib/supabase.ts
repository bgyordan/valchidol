import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Публичен клиент само за четене (новини, документи, галерия, снимки).
// Без env (напр. при локален билд) връща null вместо да чупи страницата.
let client: SupabaseClient | null | undefined;

export function db(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

// За стария код, който очаква `supabase`
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const c = db();
    if (!c) throw new Error('Supabase не е настроен');
    return (c as any)[prop];
  },
});
