import HeroSlides from '../components/HeroSlides';
import type { Metadata } from 'next';
import { getEnPages, getHeroPhotos, getLatestPhotos, getNews, getPagePhotos } from '../../lib/data';
import { getSiteInfo } from '../../lib/siteinfo';
import { getHome } from '../../lib/home';
import { enDays } from '../../lib/lang';
import PhotoBand from '../components/PhotoBand';
import '../home.css';

// Началната страница на английски: снимка с името, плочки към преведените страници, числа,
// „За училището“, снимки и контакт. Текстовете се пишат в админа (Начална страница → Текстове → На английски).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vasil Levski Secondary School – Valchi Dol, Bulgaria',
  description: 'Vasil Levski Secondary School in Valchi Dol, Bulgaria. A school with traditions – a school with a future. Founded in 1880.',
  alternates: { canonical: '/en', languages: { bg: '/', en: '/en' } },
  openGraph: { locale: 'en_GB' },
};

const P = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICON: Record<string, string> = {
  istoriya: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  'patron-i-simvoli': 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z',
  'misiya-i-tseli': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  viziya: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  priem: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  proekti: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  contacts: 'M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  doc: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
  pin: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
};

const STATS = [
  { n: '1880', t: 'year founded' },
  { n: '1–12', t: 'grades, from first year to diploma' },
  { n: '22', t: 'classrooms and labs' },
  { n: '2', t: 'gyms' },
];

export default async function HomeEn() {
  const [pages, hero, recent, photos, info, chosenAbout, home] = await Promise.all([
    getEnPages(), getHeroPhotos(), getNews(12), getLatestPhotos(8), getSiteInfo(), getPagePhotos('nachalna-pod'), getHome(),
  ]);
  const covers = recent.map((n) => n.cover_url).filter((u): u is string => !!u);
  const slides = [0, 1, 2].map((i) => hero[i] || covers[i]).filter((u): u is string => !!u);
  const auto = [...photos.map((p) => p.photo_url), ...covers.slice(3)].filter((u) => !slides.includes(u));
  const about = [0, 1].map((i) => chosenAbout[i] || auto.shift() || slides[i]).filter((u): u is string => !!u);
  const title = 'Vasil Levski School';
  // плочките: до 5 преведени страници (основните отпред) и „Contacts“
  const FIRST = ['istoriya', 'priem', 'misiya-i-tseli', 'proekti', 'patron-i-simvoli', 'viziya'];
  const tiles = [...pages].sort((a, b) => (FIRST.indexOf(a.slug) + 1 || 99) - (FIRST.indexOf(b.slug) + 1 || 99)).slice(0, 5)
    .map((p) => ({ t: p.title, href: '/en/' + p.slug, icon: ICON[p.slug] || ICON.doc }))
    .concat({ t: 'Contacts', href: '/en/contacts', icon: ICON.contacts });
  const has = (s: string) => pages.some((p) => p.slug === s);

  return (
    <div className="home">
      <section className={`hh${slides.length ? '' : ' no-photo'}`} aria-labelledby="hh-title">
        <HeroSlides slides={slides} />
        {/* годината на основаване — голяма, само с контур, в ъгъла */}
        <span className="hh-year" aria-hidden="true">1880</span>
        <div className="wrap hh-in">
          <p className="hh-kicker">Secondary school · Valchi Dol, Bulgaria · since 1880</p>
          <h1 id="hh-title" aria-label={title}>
            {title.split(' ').map((w, i, all) => (
              <span key={i} className={`hw${i === all.length - 1 ? ' hw-last' : ''}`} aria-hidden="true"><span style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span></span>
            ))}
          </h1>
          <p className="hh-motto" style={{ ['--n' as string]: 3 } as React.CSSProperties}>
            {home.en.motto.split(/\s+[–—-]\s+/).map((part, i, all) => <span key={i}>{part}{i < all.length - 1 ? ' –' : ''}</span>)}
          </p>
          <div className="btn-row">
            {has('priem') && <a className="hh-btn gold" href="/en/priem"><span>Admission</span><svg className="hh-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>}
            <a className="hh-btn" href={has('istoriya') ? '/en/istoriya' : '/en/contacts'}><span>{has('istoriya') ? 'About the school' : 'Contacts'}</span><svg className="hh-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          </div>
        </div>
      </section>

      <nav className="wrap hq" aria-label="Quick links">
        {tiles.map((q, i) => (
          <a key={q.href} href={q.href} style={{ ['--i' as any]: i }}>
            <span className="hq-ic">{P(q.icon)}</span>
            <b>{q.t}</b>
          </a>
        ))}
      </nav>

      <section className="hstats" aria-label="The school in numbers">
        <div className="wrap">
          <ul>{STATS.map((s) => <li key={s.n}><b>{s.n}</b><span>{s.t}</span></li>)}</ul>
        </div>
      </section>

      <section className="hs tint" aria-labelledby="about-h">
        <div className="wrap hab">
          {about.length > 0 && (
            <div className="hab-photos" aria-hidden="true">
              <img className="hab-p1" src={about[0]} alt="" loading="lazy" />
              {about[1] && <img className="hab-p2" src={about[1]} alt="" loading="lazy" />}
              <span className="hab-year"><b>140+</b>years of history</span>
            </div>
          )}
          <div className="hab-text">
            <p className="kicker">About the school</p>
            <h2 id="about-h">{home.en.about_title}</h2>
            {home.en.about_text.split(/\n+/).map((t, i) => <p key={i}>{t}</p>)}
            <div className="btn-row">
              {has('istoriya') && <a className="btn btn-dark" href="/en/istoriya">History</a>}
              {has('patron-i-simvoli') && <a className="btn btn-ghost" href="/en/patron-i-simvoli">Patron and symbols</a>}
              {has('misiya-i-tseli') && <a className="btn btn-ghost" href="/en/misiya-i-tseli">Mission and goals</a>}
            </div>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="hs" aria-labelledby="gal-h">
          <div className="wrap">
            <div className="hs-head"><h2 id="gal-h">Moments from school</h2></div>
            <PhotoBand photos={photos.map((p) => p.photo_url)} title="Moments from school" />
          </div>
        </section>
      )}

      <section className="hs hc" aria-labelledby="ask-h">
        <div className="wrap hc-grid">
          <div>
            <h2 id="ask-h">Get in touch</h2>
            <p>Our office is open {enDays(info.hours.admin)}. You are welcome to call us or write to us in English or Bulgarian.</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={info.contact.phoneHref}>{info.contact.phone}</a>
              <a className="btn hh-ghost" href="/en/contacts">All contacts</a>
            </div>
          </div>
          <ul className="hc-facts">
            <li>{P(ICON.pin)}<span><b>Address</b><a href={info.contact.maps} target="_blank" rel="noopener noreferrer">{info.contact.address}, {info.contact.city}, Bulgaria</a></span></li>
            <li>{P(ICON.mail)}<span><b>Email</b><a href={`mailto:${info.contact.email}`}>{info.contact.email}</a></span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
