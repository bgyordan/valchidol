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
  const en = page?.has_en ? { en: `/en/${slug}`, bg: `/${slug}` } : undefined;
  return { title: `${title} — ${SCHOOL.short}`, alternates: { canonical: `/${slug}`, ...(en ? { languages: en } : {}) }, description: group?.intro ?? page?.body.replace(/[#*\[\]]|\([^)]*\)/g, '').slice(0, 160) };
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

// Текстът и документите на страницата. Отпред е само текущото (най-новата година и неархивираните документи),
// а миналите години са в „Архив“ най-долу — с бутони за годините.
function PageBody({ body, docs }: { body: string; docs: DocRow[] }) {
  const years = body ? splitByYears(body) : null;
  const text = (t: string) => (t ? <div className="prose-block page-body"><RichText text={t} /></div> : null);
  const cur = docs.filter((d) => !d.archived);
  const arch = docs.filter((d) => d.archived);
  const desc = (l: (string | null | undefined)[]) => [...new Set(l.filter((y): y is string => !!y))].sort((x, y) => y.localeCompare(x));

  // текстът по години: най-новата година отпред, останалите — в архива
  const curYear = desc([...(years?.sections ?? []).map((y) => y.label), ...cur.map((d) => d.academic_year)])[0];
  const textNow = years ? [years.intro, years.sections.find((y) => y.label === curYear)?.text ?? (cur.length ? '' : years.sections[0].text)].filter(Boolean).join('\n\n') : body;
  const shownText = years && !years.sections.some((y) => y.label === curYear) && !cur.length ? years.sections[0].label : curYear;
  const oldText = new Map((years?.sections ?? []).filter((y) => y.label !== shownText).map((y) => [y.label, y.text]));
  const archYears = desc([...oldText.keys(), ...arch.map((d) => d.academic_year)]);
  const archNoYear = arch.filter((d) => !d.academic_year);

  return (
    <>
      {text(textNow)}
      <CurrentDocs docs={cur} />
      {(archYears.length > 0 || archNoYear.length > 0) && (
        <details className="doc-archive">
          <summary>
            <span className="da-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" /></svg>
            </span>
            <span className="da-t">Архив</span>
            <span className="da-n">{archYears.length ? `${archYears[archYears.length - 1].slice(0, 4)} – ${archYears[0]}` : `${archNoYear.length} документа`}</span>
          </summary>
          <div className="da-body">
            {archYears.length > 0 && (
              <YearTabs sub noHash aria="Година в архива" tabs={archYears.map((y) => ({
                label: y,
                node: <>{text(oldText.get(y) ?? '')}<DocGroups docs={arch.filter((d) => d.academic_year === y)} /></>,
              }))} />
            )}
            <DocGroups docs={archNoYear} />
          </div>
        </details>
      )}
    </>
  );
}

// Текущите документи: при няколко групи (Училищна документация, Бюджет, Графици…) — бутони с групите.
function CurrentDocs({ docs }: { docs: DocRow[] }) {
  if (!docs.length) return null;
  const cats = groupOrder(docs);
  const ys = [...new Set(docs.map((d) => d.academic_year).filter((y): y is string => !!y))].sort((x, y) => y.localeCompare(x));
  const head = ys.length === 1 ? <p className="doc-now"><span>Учебна година</span> {ys[0]}</p> : null;
  const list = (l: DocRow[]) => {
    const yy = [...new Set(l.map((d) => d.academic_year).filter((y): y is string => !!y))].sort((x, y) => y.localeCompare(x));
    return yy.length >= 2
      ? <><YearTabs sub noHash tabs={yy.map((y) => ({ label: y, node: <DocRows docs={sorted(l.filter((d) => d.academic_year === y))} /> }))} />
          {l.some((d) => !d.academic_year) && <DocRows docs={sorted(l.filter((d) => !d.academic_year))} />}</>
      : <DocRows docs={sorted(l)} />;
  };
  if (cats.length >= 2 && docs.length >= 15) {
    return (
      <>
        {head}
        <YearTabs aria="Група документи" tabs={cats.map((c) => ({ label: c || 'Други', node: list(docs.filter((d) => (d.category || '') === c)) }))} />
      </>
    );
  }
  if (ys.length >= 2) {
    return <YearTabs tabs={ys.map((y) => ({ label: y, node: <DocGroups docs={docs.filter((d) => d.academic_year === y)} /> }))} />;
  }
  return <>{head}<DocGroups docs={docs} /></>;
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
