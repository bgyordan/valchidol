import { getNews, getUpcomingEvents, getHeroPhotos, getLatestPhotos, getPagePhotos, fmtDate, monthShort } from '../lib/data';
import { getSiteInfo } from '../lib/siteinfo';
import { getNav } from '../lib/menu';
import { getHome } from '../lib/home';
import PhotoBand from './components/PhotoBand';
import AudienceSwitch from './components/AudienceSwitch';
import './home.css';

export const metadata = { alternates: { canonical: '/', languages: { bg: '/', en: '/en' } } };

const SITE = 'https://souvalchidol.com';

// Начална страница — подредена като на повечето средни училища:
// снимка с името и главните действия → бързи връзки → новини и събития → числа →
// „за ученици / родители / учители“ → за училището → галерия → документи → контакт.
// Снимките в началото са от настройката hero_photos; ако няма — от най-новите новини.

const ICON: Record<string, string> = {
  book: 'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h11',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  seat: 'M4 20v-6h16v6M6 14V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6M9 10h6',
  form: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  phone: 'M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  pin: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  alert: 'M12 3 2 21h20zM12 10v5M12 18h.01',
  student: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  family: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 20a6 6 0 0 1 12 0M13 20a4.5 4.5 0 0 1 9 0',
  teacher: 'M3 4h18v11H3zM8 21l4-6 4 6M7 8h6M7 11h4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4M8 14h3M8 17h6',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9.5c-.5-1-1.4-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.2 0-2.1-.5-2.6-1.5M12 6.5v1.5M12 16v1.5',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z',
};

function Ic({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );
}

// връзките за всяка група посетители — от главното меню
type Nav = Awaited<ReturnType<typeof getNav>>;
const pick = (nav: Nav, hrefs: string[]) => {
  const all = nav.flatMap((g) => g.links);
  return hrefs.map((h) => all.find((l) => l.href === h)).filter((l): l is NonNullable<typeof l> => !!l);
};
const audience = (nav: Nav) => [
  { t: 'Ученици', icon: ICON.student, href: '/za-uchenika',
    links: pick(nav, ['/za-uchenika', '/stipendii', '/zanimaniya-po-interesi', '/sfo', '/parlament']) },
  { t: 'Родители', icon: ICON.family, href: '/za-roditeli',
    links: pick(nav, ['/priem', '/zayavleniya', '/za-roditeli', '/roditelski-klub', '/patuvaniya']) },
  { t: 'Учители', icon: ICON.teacher, href: '/za-uchitelya',
    links: pick(nav, ['/za-uchitelya', '/kriterii-dtv', '/profesionalni-obshtnosti', '/organizirane-na-ekskurzii', '/dokumentatsiya']) },
];

const VALUES = ['Знания и умения по всички предмети', 'Взаимно уважение и толерантност', 'Квалифицирани учители', 'Национални и европейски проекти'];

const DOCS = [
  { t: 'Документация', href: '/dokumentatsiya', icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6' },
  { t: 'Бюджет', href: '/dokumentatsiya', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { t: 'Профил на купувача', href: 'https://app.eop.bg/buyer/21179', icon: 'M3 7h18v13H3zM8 7V4h8v3' },
  { t: 'Достъп до информация', href: '/dostap-do-informatsiya', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4' },
  { t: 'Лични данни', href: '/lichni-danni', icon: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z' },
  { t: 'Административни услуги', href: '/administrativni-uslugi', icon: 'M4 5h16v11H9l-5 4z' },
];

const isPhoto = (u: string) => u !== '/logo.svg';

export default async function Home() {
  const [hero, news, recent, events, photos, info, chosenAbout, home, nav] = await Promise.all([
    getHeroPhotos(), getNews(4), getNews(12), getUpcomingEvents(4), getLatestPhotos(8), getSiteInfo(), getPagePhotos('nachalna-pod'), getHome(), getNav(),
  ]);
  const chosenInfo = await getPagePhotos('informatsiya-za');
  const AUDIENCE = audience(nav);
  // без избрани снимки → корици на последните новини
  const covers = recent.map((n) => n.cover_url).filter((u): u is string => !!u);
  const slides = [0, 1, 2].map((i) => hero[i] || covers[i]).filter((u): u is string => !!u);
  const auto = [...photos.map((p) => p.photo_url), ...covers.slice(3)].filter((u) => !slides.includes(u) && !chosenAbout.includes(u));
  const about = [0, 1].map((i) => chosenAbout[i] || auto.shift() || slides[i] || '/logo.svg');
  // снимките в трите панела „Информация за“: избрани (page_photos['informatsiya-za']) или следващите от галерията
  const audPh = [0, 1, 2].map((i) => chosenInfo[i] || auto.shift() || covers[i + 3] || slides[i]);
  const [feat, ...rest] = news;

  // данни за училището за Google (адрес, телефон, лого)
  const c = info.contact;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HighSchool',
    name: 'Средно училище „Васил Левски“',
    alternateName: 'СУ „Васил Левски“ – Вълчи дол',
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/logo.png`,
    email: c.email,
    telephone: c.phoneHref.replace('tel:', ''),
    foundingDate: '1880',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address,
      postalCode: (c.city.match(/\d{4}/) || [''])[0],
      addressLocality: c.city.replace(/\d{4}\s*/, '').trim(),
      addressRegion: 'Варна',
      addressCountry: 'BG',
    },
    sameAs: [c.facebook].filter(Boolean),
  };

  return (
    <div className="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      {/* ===== Герой: снимки от училище (сменят се плавно), името и главните действия ===== */}
      <section className={`hh${slides.length ? '' : ' no-photo'}`} aria-labelledby="hh-title">
        <div className={`hh-slides n${slides.length}`} aria-hidden="true">
          {slides.map((src, i) => <img key={src + i} src={src} alt="" fetchPriority={i === 0 ? 'high' : 'low'} />)}
        </div>
        <div className="wrap hh-in">
          <p className="hh-kicker">{home.kicker}</p>
          {/* думите на името изплуват една след друга, последната се подчертава */}
          <h1 id="hh-title" aria-label={home.title}>
            {home.title.split(/\s+/).filter(Boolean).map((w, i, all) => (
              <span key={i} className={`hw${i === all.length - 1 ? ' hw-last' : ''}`} aria-hidden="true"><span style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span></span>
            ))}
          </h1>
          <p className="hh-motto" style={{ ['--n' as string]: home.title.split(/\s+/).length } as React.CSSProperties}>{home.motto}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href="/priem">Прием на ученици</a>
            <a className="btn hh-ghost" href="/za-uchilishteto">За училището</a>
          </div>
        </div>
      </section>

      {/* ===== Бързи връзки — най-търсеното, като плочки върху долния ръб на снимката ===== */}
      <nav className="wrap hq" aria-label="Бързи връзки">
        {home.quick.map((q, i) => (
          <a key={q.href + i} href={q.href} style={{ ['--i' as any]: i }} {...(q.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className="hq-ic"><Ic d={ICON[q.icon] || ICON.folder} /></span>
            <b>{q.t}</b>
          </a>
        ))}
      </nav>

      {/* ===== Новини + събития ===== */}
      <section className="hs" aria-labelledby="news-h">
        <div className="wrap">
          <div className="hs-head">
            <h2 id="news-h">Новини</h2>
            <a className="more" href="/novini">Всички новини</a>
          </div>
          <div className={`hn${events.length ? '' : ' no-ev'}`}>
            {!feat ? (
              <p className="empty">Скоро тук ще има новини от училище.</p>
            ) : (
              <div className="hn-news">
                <a className="hn-feat" href={`/novini/${feat.slug}`}>
                  <span className="hn-img">{feat.cover_url ? <img src={feat.cover_url} alt="" /> : <span className="hn-noimg" />}</span>
                  <span className="hn-body">
                    <span className="hn-meta"><span className="tag">{feat.category}</span><time>{fmtDate(feat.published_at)}</time></span>
                    <b className="hn-title">{feat.title}</b>
                    {feat.excerpt && <span className="hn-ex">{feat.excerpt}</span>}
                  </span>
                </a>
                {rest.length > 0 && (
                  <ul className="hn-list">
                    {rest.map((n) => (
                      <li key={n.id}>
                        <a href={`/novini/${n.slug}`}>
                          <span className="hn-thumb">{n.cover_url ? <img src={n.cover_url} alt="" loading="lazy" /> : <span className="hn-noimg" />}</span>
                          <span>
                            <time>{fmtDate(n.published_at)}</time>
                            <b>{n.title}</b>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {events.length > 0 && (
              <aside className="hn-events" aria-labelledby="ev-h">
                <h3 id="ev-h">Предстоящи събития</h3>
                <ul>
                  {events.map((e) => (
                    <li key={e.id}>
                      <span className="ev-day"><b>{new Date(e.event_date).getDate()}</b>{monthShort(e.event_date)}</span>
                      <span>
                        <b>{e.title}</b>
                        {(e.event_time || e.location) && (
                          <small>{[e.event_time && `${e.event_time} ч.`, e.location].filter(Boolean).join(', ')}</small>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <a className="more" href="/sabitiya">Всички събития</a>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ===== Училището в числа ===== */}
      <section className="hstats" aria-label="Училището в числа">
        <div className="wrap">
          <ul>
            {home.stats.map((s, i) => (
              <li key={s.n + i}><b>{s.n}</b><span>{s.t}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Информация за ученици, родители и учители ===== */}
      <section className="hs" aria-labelledby="aud-h">
        <div className="wrap">
          <AudienceSwitch items={AUDIENCE.map(({ t, href, icon, links }, i) => ({ t, href, icon, links, photo: audPh[i] }))} />
        </div>
      </section>

      {/* ===== За училището ===== */}
      <section className="hs tint" aria-labelledby="about-h">
        <div className="wrap hab">
          <div className="hab-photos" aria-hidden="true">
            <img className="hab-p1" src={about[0]} alt="" loading="lazy" />
            {isPhoto(about[1]) && <img className="hab-p2" src={about[1]} alt="" loading="lazy" />}
            <span className="hab-year"><b>140+</b>години история</span>
          </div>
          <div className="hab-text">
            <p className="kicker">За училището</p>
            <h2 id="about-h">{home.about_title}</h2>
            {home.about_text.split(/\n+/).map((t, i) => <p key={i}>{t}</p>)}
            <ul className="feature-list">
              {VALUES.map((v) => <li key={v}>{v}</li>)}
            </ul>
            <div className="btn-row">
              <a className="btn btn-dark" href="/istoriya">История</a>
              <a className="btn btn-ghost" href="/patron-i-simvoli">Патрон и символи</a>
              <a className="btn btn-ghost" href="/misiya-i-tseli">Мисия и цели</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Галерия ===== */}
      {photos.length > 0 && (
        <section className="hs" aria-labelledby="gal-h">
          <div className="wrap">
            <div className="hs-head">
              <h2 id="gal-h">Моменти от училище</h2>
              <a className="more" href="/galeriya">Към галерията</a>
            </div>
            <PhotoBand photos={photos.map((p) => p.photo_url)} title="Моменти от училище" />
          </div>
        </section>
      )}

      {/* ===== Документи и прозрачност ===== */}
      <section className="hs tint" aria-labelledby="prz-h">
        <div className="wrap">
          <div className="hs-head">
            <div>
              <h2 id="prz-h">Документи и прозрачност</h2>
            </div>
            <a className="more" href="/dokumenti">Всички документи</a>
          </div>
          <div className="hd">
            {DOCS.map((d) => (
              <a key={d.t} href={d.href} {...(d.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="hd-ic"><Ic d={d.icon} /></span>
                <b>{d.t}</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Контакт ===== */}
      <section className="hs hc" aria-labelledby="ask-h">
        <div className="wrap hc-grid">
          <div>
            <h2 id="ask-h">Имате въпрос към училището?</h2>
            <p>Ръководството приема родители всеки делничен ден от {info.hours.director.replace(/^пон – пет,\s*/, '')} ч. Можете и да се обадите или да ни пишете.</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={info.contact.phoneHref}>{info.contact.phone}</a>
              <a className="btn hh-ghost" href="/kontakti">Всички контакти</a>
            </div>
          </div>
          <ul className="hc-facts">
            <li><Ic d={ICON.pin} /><span><b>Адрес</b><a href={info.contact.maps} target="_blank" rel="noopener noreferrer">{info.contact.address}, {info.contact.city}</a></span></li>
            <li><Ic d={ICON.mail} /><span><b>Имейл</b><a href={`mailto:${info.contact.email}`}>{info.contact.email}</a></span></li>
            <li><Ic d={ICON.clock} /><span><b>Деловодство</b>{info.hours.admin} ч.</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
