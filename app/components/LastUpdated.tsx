import { unstable_noStore as noStore } from 'next/cache';
import { first } from '../../lib/db';

// Датата = най-скорошното реално съдържание (публикувана новина или качен документ).
// Обновява се сама при добавяне на съдържание; не се задава на ръка.
async function latestUpdate(): Promise<Date | null> {
  const [n, d] = await Promise.all([
    first<{ v: string }>(`SELECT MAX(published_at) AS v FROM site_news WHERE status = 'published' AND published_at <= ?`, new Date().toISOString()),
    first<{ v: string }>('SELECT MAX(created_at) AS v FROM site_documents'),
  ]);
  const dates = [n?.v, d?.v].filter((x): x is string => !!x).map((x) => new Date(x));
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((x) => x.getTime())));
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
