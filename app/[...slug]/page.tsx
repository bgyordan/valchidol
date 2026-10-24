import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHero from '../components/PageHero';
import PhotoBand from '../components/PhotoBand';
import LinkList from '../components/LinkList';
import { NAV, SCHOOL } from '../components/nav';
import { getChildPages, getDocuments, getPage, type DocRow } from '../../lib/data';
import DocRows from '../components/DocRows';
import { RichText } from '../../lib/rich';
import { splitByYears } from '../../lib/years';
import YearTabs from '../components/YearTabs';

// Текстовите страници от базата (site_pages) и началните страници на групите от менюто.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string[] }> };

const slugOf = async (params: Props['params']) => (await params).slug.map(decodeURIComponent).join('/');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await slugOf(params);
  const group = NAV.find((g) => g.href === '/' + slug);
  const page = await getPage(slug);
  const title = page?.title ?? group?.label;
  if (!title) return {};
  return { title: `${title} — ${SCHOOL.short}`, description: group?.intro ?? page?.body.replace(/[#*\[\]]|\([^)]*\)/g, '').slice(0, 160) };
}

export default async function SitePageView({ params }: Props) {
  const slug = await slugOf(params);
  const path = '/' + slug;
  const group = NAV.find((g) => g.href === path);
  const page = await getPage(slug);
  if (!page && !group) notFound();

  const children = page && !slug.includes('/') ? await getChildPages(slug) : [];
  // документи за тази страница (от админ панела) — показват се по учебни години и групи заедно с текста
  const docs = page ? await getDocuments(slug, true) : [];
  const parent = slug.includes('/') ? await getPage(slug.split('/')[0]) : null;
  // разделът от менюто, в който е страницата — връзките му стоят в страничната колона
  const navPath = slug.startsWith('proekti/') ? '/proekti' : path;
  const section = group ? undefined : NAV.find((g) => g.links.some((l) => l.href === navPath));

  return (
    <>
      <PageHero
        path={slug.startsWith('proekti/') ? '/proekti' : path}
        title={page?.title ?? group!.label}
        photo={page?.photos[0]}
      />

      {(page?.body || docs.length > 0) && (
        <section className="section">
          <div className={`wrap${section ? ' page-layout' : ''}`}>
            <div>
              {parent && <p className="page-back"><a href={'/' + parent.slug}>← {parent.title}</a></p>}
              <PageBody body={page ? dropChildLinks(stripTitle(page.body || '', page.title), children.map((c) => c.slug)) : ''} docs={docs} />
            </div>
            {section && (
              <nav className={`page-side tone-${section.tone}`} aria-label={`Раздел „${section.label}“`}>
                <p className="page-side-h"><a href={section.href}>{section.label}</a></p>
                <ul>
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} aria-current={l.href === navPath ? 'page' : undefined} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>
      )}

      {children.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <h2 style={{ marginBottom: 20 }}>Проекти и програми</h2>
            <div className="proj-cards">
              {children.map((c, i) => (
                <a key={c.slug} href={'/' + c.slug} className="proj-card" style={{ ['--i' as string]: i } as React.CSSProperties}>
                  <span className="pc-img">{c.photo ? <img src={c.photo} alt="" loading="lazy" /> : <span className="pc-noimg" aria-hidden="true" />}</span>
                  <span className="pc-t">{c.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {group && (
        <section className={`section${page?.body ? ' tint' : ''}`}>
          <div className="wrap">
            {page?.body && <h2 style={{ marginBottom: 20 }}>В този раздел</h2>}
            <LinkList
              items={group.links.filter((l) => l.href !== path).map((l) => ({ t: l.label, href: l.href, icon: l.href.startsWith('http') ? 'external' : 'doc', external: l.href.startsWith('http') }))}
            />
          </div>
        </section>
      )}

      {page && page.photos.length > 1 && (
        <section className="section">
          <div className="wrap">
            <h2 style={{ marginBottom: 24 }}>Снимки</h2>
            <PhotoBand photos={page.photos} title={page.title} />
          </div>
        </section>
      )}
    </>
  );
}

// Текстът и документите на страницата. Ако има няколко учебни години (в текста или в документите),
// се показва само най-новата, а другите се избират с бутоните над нея.
function PageBody({ body, docs }: { body: string; docs: DocRow[] }) {
  const years = body ? splitByYears(body) : null;
  const textOf = new Map((years?.sections ?? []).map((y) => [y.label, y.text]));
  const all = [...new Set([...textOf.keys(), ...docs.map((d) => d.academic_year).filter((y): y is string => !!y)])]
    .sort((x, y) => y.localeCompare(x));
  const noYear = docs.filter((d) => !d.academic_year);
  const text = (t: string) => (t ? <div className="prose-block page-body"><RichText text={t} /></div> : null);

  // Няколко групи (Училищна документация, Бюджет, Графици…) → първо бутони с групите, в тях — годините.
  // При много групи (напр. класовете в СФО) остава първо годината.
  const cats = groupOrder(docs);
  if (cats.length >= 2 && cats.length <= 12 && docs.length >= 40) {
    return (
      <>
        {text(body)}
        <YearTabs aria="Група документи" tabs={cats.map((c) => {
          const list = docs.filter((d) => (d.category || '') === c);
          const ys = [...new Set(list.map((d) => d.academic_year).filter((y): y is string => !!y))].sort((x, y) => y.localeCompare(x));
          const rest = list.filter((d) => !d.academic_year);
          return {
            label: c || 'Други',
            node: (
              <>
                {ys.length >= 2
                  ? <YearTabs sub noHash tabs={ys.map((y) => ({ label: y, node: <DocRows docs={sorted(list.filter((d) => d.academic_year === y))} /> }))} />
                  : ys.length === 1 && <><h3 className="doc-year">{ys[0]}</h3><DocRows docs={sorted(list.filter((d) => d.academic_year === ys[0]))} /></>}
                {rest.length > 0 && <DocRows docs={sorted(rest)} />}
              </>
            ),
          };
        })} />
      </>
    );
  }

  if (all.length < 2) {
    return (
      <>
        {text(body)}
        <DocGroups docs={docs} />
      </>
    );
  }
  return (
    <>
      {text(years ? years.intro : body)}
      <YearTabs tabs={all.map((y) => ({
        label: y,
        node: <>{text(textOf.get(y) ?? '')}<DocGroups docs={docs.filter((d) => d.academic_year === y)} /></>,
      }))} />
      <DocGroups docs={noYear} />
    </>
  );
}

const sorted = (l: DocRow[]) => [...l].sort((a, b) => a.sort_order - b.sort_order);
// групите по реда от админ панела (най-малкият номер в групата)
function groupOrder(docs: DocRow[]) {
  const m = new Map<string, number>();
  for (const d of docs) { const c = d.category || ''; m.set(c, Math.min(m.get(c) ?? Infinity, d.sort_order)); }
  return [...m.entries()].sort((a, b) => a[1] - b[1]).map(([c]) => c);
}

// Документите, групирани по „група“ (подзаглавие), в реда от админ панела.
function DocGroups({ docs }: { docs: DocRow[] }) {
  if (!docs.length) return null;
  const groups: { cat: string; list: DocRow[] }[] = [];
  for (const d of [...docs].sort((a, b) => a.sort_order - b.sort_order)) {
    const cat = d.category || '';
    let g = groups.find((x) => x.cat === cat);
    if (!g) groups.push((g = { cat, list: [] }));
    g.list.push(d);
  }
  return (
    <div className="doc-groups">
      {groups.map((g) => (
        <div key={g.cat} className="doc-group">
          {g.cat && <h3>{g.cat}</h3>}
          <DocRows docs={g.list} />
        </div>
      ))}
    </div>
  );
}

// Връзките към подстраниците стоят като карти отдолу — не ги повтаряме в текста.
function dropChildLinks(body: string, slugs: string[]) {
  if (!slugs.length) return body;
  const set = new Set(slugs.map((x) => '/' + x));
  return body
    .split('\n')
    .filter((l) => { const m = l.trim().match(/^(?:[-*]\s+)?\[[^\]]+\]\(([^)\s]+)\)$/); return !(m && set.has(m[1])); })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

// Старите страници често започват със същото заглавие като страницата — не го повтаряме.
function stripTitle(body: string, title: string) {
  const m = body.match(/^\s*#{2,3} (.+)\n?/);
  return m && m[1].trim().toLowerCase() === title.trim().toLowerCase() ? body.slice(m[0].length) : body;
}
