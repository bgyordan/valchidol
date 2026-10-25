import { getSetting } from './data';
import { all, json } from './db';

// Материалната база: помещенията на училището (STEM център, кабинети, салони…) — site_settings.baza.
// Всяко има текст, снимки и по желание 360° снимка (панорама 2:1). Ако нищо не е записано, остават стойностите от кода.
export type Space = {
  id: string;
  name: string;
  icon: string;
  text: string;
  photos: string[];
  pano: string | null;
  hidden?: boolean;
  q?: string; // ако няма снимки — снимките от новината, чието заглавие съдържа това
};

export const SPACE_ICONS: { key: string; label: string; d: string }[] = [
  { key: 'stem', label: 'STEM / наука', d: 'M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10' },
  { key: 'class', label: 'Класна стая', d: 'M3 5h18v11H3zM8 20h8M12 16v4M7 9h6M7 12h4' },
  { key: 'it', label: 'Компютри', d: 'M4 5h16v10H4zM2 19h20M9 15l-1 4M15 15l1 4' },
  { key: 'gym', label: 'Спорт', d: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12' },
  { key: 'hall', label: 'Зала / сцена', d: 'M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6' },
  { key: 'tools', label: 'Работилница', d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z' },
  { key: 'food', label: 'Стол', d: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9' },
  { key: 'heart', label: 'Подкрепа', d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' },
  { key: 'book', label: 'Библиотека', d: 'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h11' },
  { key: 'yard', label: 'Двор', d: 'M12 3l5 7h-3l4 6H6l4-6H7zM12 16v5' },
];

export const BAZA_DEFAULTS: Space[] = [
  { id: 'stem', name: 'STEM център „Природни науки“', icon: 'stem', q: 'STEM', photos: [], pano: null,
    text: 'Открит на 29 май 2026 г. Модерно оборудвани пространства за природни науки, математика, информационни технологии, изследователска дейност и 3D проектиране.' },
  { id: 'kabineti', name: 'Класни стаи и кабинети', icon: 'class', photos: [], pano: null,
    text: '22 класни стаи и кабинети, които всяка година се обогатяват с нови мебели и учебни помагала.' },
  { id: 'saloni', name: 'Физкултурни салони', icon: 'gym', photos: [], pano: null,
    text: 'Два физкултурни салона и електрифицирана спортна площадка в двора.' },
  { id: 'aktova-zala', name: 'Актова зала', icon: 'hall', photos: [], pano: null,
    text: 'Място за тържества, концерти и училищни празници.' },
  { id: 'rabotilnitsi', name: 'Работилници', icon: 'tools', photos: [], pano: null,
    text: 'Работилници по металообработване и дървообработване.' },
  { id: 'podkrepa', name: 'Кабинети за подкрепа', icon: 'heart', photos: [], pano: null,
    text: 'Кабинет за психологическа подкрепа, ресурсен и логопедичен кабинет.' },
  { id: 'biblioteka', name: 'Библиотека', icon: 'book', photos: [], pano: null,
    text: 'Училищната библиотека с книги за четене и учене.' },
  { id: 'stol', name: 'Ученически стол', icon: 'food', photos: [], pano: null,
    text: 'Топла храна за учениците всеки учебен ден.' },
];

const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x) : []);

export function cleanSpaces(raw: unknown): Space[] | null {
  const list = raw && typeof raw === 'object' && Array.isArray((raw as { spaces?: unknown }).spaces) ? (raw as { spaces: unknown[] }).spaces : null;
  if (!list) return null;
  return list
    .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object' && typeof (s as { name?: unknown }).name === 'string')
    .map((s) => ({
      id: String(s.id || crypto.randomUUID().slice(0, 8)),
      name: String(s.name),
      icon: typeof s.icon === 'string' ? s.icon : 'class',
      text: typeof s.text === 'string' ? s.text : '',
      photos: strs(s.photos),
      pano: typeof s.pano === 'string' && s.pano ? s.pano : null,
      hidden: !!s.hidden,
      q: typeof s.q === 'string' ? s.q : undefined,
    }));
}

// за админа: записаните или тези от кода
export async function getSpacesRaw(): Promise<Space[]> {
  return cleanSpaces(await getSetting<unknown>('baza').catch(() => null)) ?? BAZA_DEFAULTS.map((s) => ({ ...s, photos: [] }));
}

// за сайта: без скритите; помещение без снимки взима снимките от новината за него (напр. откриването на STEM центъра)
export async function getSpaces(): Promise<Space[]> {
  const list = (await getSpacesRaw()).filter((s) => !s.hidden);
  return Promise.all(list.map(async (s) => {
    if (s.photos.length || !s.q) return s;
    const n = (await all<{ cover_url: string | null; gallery_images: string | null }>(
      `SELECT cover_url, gallery_images FROM site_news WHERE status = 'published' AND title LIKE ? ORDER BY published_at DESC LIMIT 1`, `%${s.q}%`,
    ).catch(() => []))[0];
    if (!n) return s;
    const photos = [...new Set([n.cover_url, ...json<unknown[]>(n.gallery_images, []).map(String)].filter((u): u is string => !!u))].slice(0, 12);
    return { ...s, photos };
  }));
}
