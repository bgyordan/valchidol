import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from '../../lib/supabase';

// Датата = най-скорошното реално съдържание (публикувана новина или качен документ).
// Обновява се сама при добавяне на съдържание; не се задава на ръка.
async function latestUpdate(): Promise<Date | null> {
  const dates: Date[] = [];

  try {
    const { data } = await supabase
      .from('site_news')
      .select('published_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(1);
    const v = data?.[0]?.published_at;
    if (v) dates.push(new Date(v));
  } catch {
    /* игнорирай — падаме към наличните дати */
  }

  try {
    const { data, error } = await supabase
      .from('site_documents')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);
    const v = !error ? data?.[0]?.created_at : null;
    if (v) dates.push(new Date(v));
  } catch {
    /* колоната може да липсва — просто я пропускаме */
  }

  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default async function LastUpdated() {
  // Изключваме статичното кеширане, за да се смята при всяка заявка —
  // датата се обновява веднага при нова новина/документ, без ребилд.
  noStore();

  const d = await latestUpdate();
  if (!d || isNaN(d.getTime())) return null;

  const s = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  return <span className="foot-updated">Дата на последна актуализация: {s} г.</span>;
}
