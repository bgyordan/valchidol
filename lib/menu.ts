import { NAV, type NavGroup, type NavLink } from '../app/components/nav';
import { getSetting } from './data';
import { all } from './db';

// Главното меню с промените от админа (site_settings.menu):
// { groups: [{ href, label?, hidden?, links: [{ href, label?, hidden? }] }] }
// Редът в списъка е редът в менюто. Раздели и връзки, добавени по-късно в кода, отиват накрая.
type Saved = { href: string; label?: string; hidden?: boolean };
type SavedGroup = Saved & { links?: Saved[] };

function arrange<T extends { href: string; label: string }>(items: T[], saved: Saved[] | undefined, showHidden: boolean): (T & { hidden?: boolean })[] {
  if (!Array.isArray(saved)) return items;
  const byHref = new Map(saved.map((s, i) => [s.href, { ...s, i }]));
  return items
    .map((it, k) => {
      const s = byHref.get(it.href);
      return { ...it, label: s?.label?.trim() || it.label, hidden: !!s?.hidden, _o: s ? s.i : 1000 + k };
    })
    .sort((a, b) => a._o - b._o)
    .filter((it) => showHidden || !it.hidden)
    .map(({ _o, ...it }) => it as T & { hidden?: boolean });
}

export type MenuGroup = Omit<NavGroup, 'links'> & { hidden?: boolean; links: (NavLink & { hidden?: boolean })[] };

export async function getNav(showHidden = false): Promise<MenuGroup[]> {
  const raw = await getSetting<{ groups?: SavedGroup[] }>('menu').catch(() => null);
  const saved = raw && Array.isArray(raw.groups) ? raw.groups : undefined;
  const groups = arrange(NAV, saved, showHidden);
  const cats = await newsCats();
  return groups.map((g) => {
    let links: NavLink[] = g.links;
    // рубриките на новините (от админа) стоят в менюто „Новини“ като отделни връзки
    if (g.href === '/novini') {
      const have = new Set(links.map((l) => l.label.toLowerCase()));
      links = [...links, ...cats.filter((c) => !have.has(c.toLowerCase())).map((c) => ({ label: c, href: `/novini?r=${encodeURIComponent(c)}` }))];
    }
    return { ...g, links: arrange(links, saved?.find((s) => s.href === g.href)?.links, showHidden) };
  });
}

// рубриките с поне една публикувана новина, без общата „Новини“
async function newsCats(): Promise<string[]> {
  const rows = await all<{ category: string }>(
    `SELECT category FROM site_news WHERE status = 'published' AND category IS NOT NULL AND category <> '' AND category <> 'Новини'
     GROUP BY category ORDER BY COUNT(*) DESC LIMIT 8`,
  ).catch(() => []);
  return rows.map((r) => r.category);
}

// Менюто на английската версия: само страниците, които имат английски текст, по групите им.
const EN_GROUPS: { key: string; label: string; tone: NavGroup['tone'] }[] = [
  { key: 'uchilishte', label: 'About us', tone: 'blue' },
  { key: 'proekti', label: 'About us', tone: 'blue' },
  { key: 'roditeli', label: 'Parents', tone: 'orange' },
  { key: 'uchenitsi', label: 'Students', tone: 'lime' },
  { key: 'uchiteli', label: 'Teachers', tone: 'blue' },
  { key: 'dokumenti', label: 'Documents', tone: 'blue' },
  { key: 'novini', label: 'News', tone: 'orange' },
];

export async function getNavEn(): Promise<MenuGroup[]> {
  const { getEnPages } = await import('./data');
  const pages = await getEnPages();
  const out: MenuGroup[] = [];
  for (const p of pages) {
    const g = EN_GROUPS.find((x) => x.key === (p.grp ?? '')) ?? { key: '', label: 'More', tone: 'blue' as const };
    let grp = out.find((x) => x.label === g.label);
    if (!grp) out.push((grp = { label: g.label, href: '/en/' + p.slug, tone: g.tone, intro: '', links: [] }));
    grp.links.push({ label: p.title, href: '/en/' + p.slug });
  }
  out.sort((a, b) => EN_GROUPS.findIndex((x) => x.label === a.label) - EN_GROUPS.findIndex((x) => x.label === b.label));
  // раздел с една страница става обикновена връзка (без подменю)
  for (const g of out) if (g.links.length === 1) { g.label = g.links[0].label; g.links = []; }
  return out;
}
