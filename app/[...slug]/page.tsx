import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHero from '../components/PageHero';
import PhotoBand from '../components/PhotoBand';
import LinkList from '../components/LinkList';
import { NAV, SCHOOL } from '../components/nav';
import { getChildPages, getDocuments, getPage, type DocRow } from '../../lib/data';
import DocRows from '../components/DocRows';
import { RichText } from '../../lib/rich';

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

  const children = slug === 'proekti' ? await getChildPages('proekti') : [];
  // документи, качени от админ панела за тази страница — по учебна година и подзаглавие
  const docs = page ? await getDocuments(slug, true) : [];
  const docGroups: { key: string; list: DocRow[] }[] = [];
  for (const d of docs) {
    const key = [d.academic_year, d.category].filter(Boolean).join(' · ');
    let g = docGroups.find((x) => x.key === key);
    if (!g) docGroups.push((g = { key, list: [] }));
    g.list.push(d);
  }
  const parent = slug.includes('/') ? await getPage(slug.split('/')[0]) : null;
  // разделът от менюто, в който е страницата — връзките му стоят в страничната колона
  const navPath = slug.startsWith('proekti/') ? '/proekti' : path;
  const section = group ? undefined : NAV.find((g) => g.links.some((l) => l.href === navPath));

  return (
    <>
      <PageHero
        path={slug.startsWith('proekti/') ? '/proekti' : path}
        title={page?.title ?? group!.label}
        intro={group?.intro}
        photo={page?.photos[0]}
      />

      {page?.body && (
        <section className="section">
          <div className={`wrap${section ? ' page-layout' : ''}`}>
            <div>
              {parent && <p className="page-back"><a href={'/' + parent.slug}>← {parent.title}</a></p>}
              <div className="prose-block page-body">
                <RichText text={stripTitle(page.body, page.title)} />
              </div>
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

      {docGroups.length > 0 && (
        <section className={`section${page?.body ? ' tint' : ''}`}>
          <div className="wrap">
            <h2 style={{ marginBottom: 20 }}>Документи</h2>
            {docGroups.map((g) => (
              <div key={g.key} style={{ marginBottom: 24 }}>
                {g.key && <h3 style={{ marginBottom: 10 }}>{g.key}</h3>}
                <DocRows docs={g.list} />
              </div>
            ))}
          </div>
        </section>
      )}

      {children.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <h2 style={{ marginBottom: 20 }}>Проекти и програми</h2>
            <LinkList items={children.map((c) => ({ t: c.title, href: '/' + c.slug, icon: 'bulb' }))} />
          </div>
        </section>
      )}

      {group && (
        <section className={`section${page?.body ? ' tint' : ''}`}>
          <div className="wrap">
            {page?.body && <h2 style={{ marginBottom: 20 }}>В този раздел</h2>}
            <LinkList
              items={group.links.filter((l) => l.href !== path).map((l) => ({ t: l.label, d: l.desc, href: l.href, icon: l.href.startsWith('http') ? 'external' : 'doc', external: l.href.startsWith('http') }))}
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

// Старите страници често започват със същото заглавие като страницата — не го повтаряме.
function stripTitle(body: string, title: string) {
  const m = body.match(/^\s*#{2,3} (.+)\n?/);
  return m && m[1].trim().toLowerCase() === title.trim().toLowerCase() ? body.slice(m[0].length) : body;
}
