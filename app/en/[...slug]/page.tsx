import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageHero from '../../components/PageHero';
import PhotoBand from '../../components/PhotoBand';
import { getEnPages, getPageEn } from '../../../lib/data';
import { RichText } from '../../../lib/rich';

// Страница на английски: /en/<адрес> — заглавието и текстът са от „На английски“ в админа.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string[] }> };
const slugOf = async (params: Props['params']) => (await params).slug.map(decodeURIComponent).join('/');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = await slugOf(params);
  const page = await getPageEn(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Vasil Levski School, Valchi Dol`,
    description: page.body.replace(/[#*\[\]]|\([^)]*\)/g, '').replace(/\s+/g, ' ').slice(0, 160),
    alternates: { canonical: `/en/${slug}`, languages: { bg: `/${slug}`, en: `/en/${slug}` } },
  };
}

export default async function PageEn({ params }: Props) {
  const slug = await slugOf(params);
  const [page, all] = await Promise.all([getPageEn(slug), getEnPages()]);
  if (!page) notFound();
  // другите преведени страници от същата група — в страничната колона
  const side = all.filter((p) => (p.grp ?? '') === (page.grp ?? '') || (page.grp === 'uchilishte' && p.grp === 'proekti') || (page.grp === 'proekti' && p.grp === 'uchilishte'));
  const children = all.filter((p) => p.slug.startsWith(slug + '/'));

  return (
    <>
      <PageHero title={page.title} kicker={page.title} lang="en" tone="blue" photo={page.photos[0]} />
      <section className="section">
        <div className={`wrap${side.length > 1 ? ' page-layout' : ''}`}>
          <div>
            {page.body
              ? <div className="prose-block page-body" lang="en"><RichText text={page.body} /></div>
              : <p className="muted">This page is available in Bulgarian. <a href={`/${slug}`}>Open the Bulgarian version</a>.</p>}
            <p className="page-bg-note muted">More details and all documents are on the <a href={`/${slug}`} lang="bg" hrefLang="bg">Bulgarian version of this page</a>.</p>
          </div>
          {side.length > 1 && (
            <nav className="page-side tone-blue" aria-label="In this section">
              <p className="page-side-h"><a href="/en">Vasil Levski School</a></p>
              <ul>
                {side.map((l) => (
                  <li key={l.slug}><a href={'/en/' + l.slug} aria-current={l.slug === slug ? 'page' : undefined}>{l.title}</a></li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      {children.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <div className="proj-cards">
              {children.map((c, i) => (
                <a key={c.slug} href={'/en/' + c.slug} className="proj-card" style={{ ['--i' as string]: i } as React.CSSProperties}>
                  <span className="pc-img">{c.photo ? <img src={c.photo} alt="" loading="lazy" /> : <span className="pc-noimg" aria-hidden="true" />}</span>
                  <span className="pc-t">{c.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.photos.length > 1 && (
        <section className="section">
          <div className="wrap">
            <h2 style={{ marginBottom: 24 }}>Photos</h2>
            <PhotoBand photos={page.photos} title={page.title} />
          </div>
        </section>
      )}
    </>
  );
}
