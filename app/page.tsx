import { alternates } from '../lib/lang';
import { getNews, getUpcomingEvents, getHeroPhotos, getLatestPhotos, getPagePhotos, fmtDate, monthShort } from '../lib/data';
import { daisyPolygon } from '../lib/flower';

// две различни, неправилни маргаритки за снимките до „Над 150 деца…“ + цветната „сянка“ зад всяка (друго цвете)
const DAISY_A = daisyPolygon(9, 7), DAISY_A_BACK = daisyPolygon(9, 1007);
const DAISY_B = daisyPolygon(11, 21), DAISY_B_BACK = daisyPolygon(11, 1021);
import { getSiteInfo } from '../lib/siteinfo';
import PhotoBand from './components/PhotoBand';
import HeroPointer from './components/HeroPointer';
import HeroKnockout from './components/HeroKnockout';
import SectionJoin from './components/SectionJoin';
import Handprints, { HandDefs } from './components/Handprints';
import '@fontsource-variable/caveat';
import './home.css';

// снимки по подразбиране, докато в ЕИС не са избрани други
const FALLBACK = ['/nachalna/kabineti-3.jpg', '/nachalna/terapiya-1.jpg', '/nachalna/kabineti-1.jpg'];
const FALLBACK_ABOUT = ['/nachalna/kabineti-2.jpg', '/nachalna/kabineti-4.jpg'];

const STEPS = [
  {
    title: 'Подавате заявление',
    text: 'Детето е записано в училище или детска градина. Подавате заявление за насочване заедно с документите за здравословното състояние и протокол от ТЕЛК, НЕЛК или ЛКК.',
  },
  {
    title: 'Ние подготвяме преписката',
    text: 'Екипът за подкрепа за личностно развитие изготвя становище и протокол. Изпращаме документите към РЦПППО – Варна в срок до един месец.',
  },
  {
    title: 'Детето започва при нас',
    text: 'След становището на РЦПППО попълвате заявлението за записване и детето започва обучение и терапия по своя план.',
  },
];

const VALUES = [
  { t: 'Приемане', d: 'Всяко дете е добре дошло такова, каквото е – със своя ритъм, характер и начин да опознава света.' },
  { t: 'Индивидуалност', d: 'Работим по личен план за всеки ученик, изготвен от екип специалисти според неговите нужди.' },
  { t: 'Заедно', d: 'Родители, учители и терапевти сме един екип. Развитието на детето е обща грижа и обща радост.' },
  { t: 'Посока', d: 'Не бързаме. Важното е да вървим в правилната посока.' },
];

const DOCS = [
  { t: 'Бюджет и финанси', d: 'Бюджет и отчети', href: '/za-nas/byudzhet-i-finansi', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { t: 'Документи в ЦСОП', d: 'Правилници, планове и политики', href: '/za-nas/dokumenti-v-tsop', icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6' },
  { t: 'Профил на купувача', d: 'Обществени поръчки в ЦАИС ЕОП', href: '/za-nas/profil-na-kupuvacha', icon: 'M3 7h18v13H3zM8 7V4h8v3' },
  { t: 'Достъп до информация', d: 'Заявления и отчети по ЗДОИ', href: '/za-nas/dostap-do-obshtestvena-informatsiya', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4' },
  { t: 'Защита на личните данни', d: 'Политика по GDPR', href: '/za-nas/zashtita-na-lichnite-danni', icon: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z' },
  { t: 'Подаване на сигнали', d: 'Поверителен канал по ЗЗЛПСПОИН', href: '/podavane-na-signali', icon: 'M4 5h16v11H9l-5 4z' },
];

// hreflang: английската версия на началото е /en
export const metadata = { alternates: alternates('/') };

export default async function Home() {
  const [hero, news, events, photos, info, chosenAbout] = await Promise.all([getHeroPhotos(), getNews(4), getUpcomingEvents(3), getLatestPhotos(8), getSiteInfo(), getPagePhotos('nachalna-pod')]);
  // празно място ('') от ЕИС → стандартната снимка точно там
  const h = [0, 1, 2].map((i) => hero[i] || FALLBACK[i]);
  // за блока под херото: последните снимки от галерията, различни от трите в детелината
  // снимки 4 и 5 се избират в ЕИС → Сайт → Начална; празно място → най-новите от галерията (без трите от началото)
  const auto = [...photos.map((p) => p.photo_url).filter((u) => !h.includes(u) && !chosenAbout.includes(u)), ...FALLBACK_ABOUT];
  const about = [0, 1].map((i) => chosenAbout[i] || auto.shift()!);
  const [feat, ...rest] = news;

  return (
    <div className="home">
      <HandDefs />
      {/* верига от ефирни кръгове: големият синкав диск в херото → по-малък зелен → още по-малък оранжев,
          диагонално надолу и наляво, без да се допират; продължава и под първия екран */}
      <div className="home-dots" aria-hidden="true"><span className="hd-g" /><span className="hd-o" /></div>
      {/* ===== Герой: светъл. Вляво мотото, вдясно детелината от трите снимки от ЕИС върху бледонебесен диск.
           Отдолу — трите неща, за които идва родителят: услуги, записване, контакт. ===== */}
      <section className="hx">
        <HeroPointer />
        <HeroKnockout />
        <div className="wrap hx-grid">
          <div className="hx-in">
            <h1 className="hx-title">
              <span className="hx-script"><span>Вярваме, че</span></span>
              <span className="hx-line"><span>посоката, в която се движим, е по‑важна от скоростта.</span></span>
            </h1>
            <p className="hx-lead">
              Център за специална образователна подкрепа във Варна. Обучение, терапия и рехабилитация
              за деца и младежи със специални образователни потребности.
            </p>
          </div>

          <div className="hx-clover" aria-hidden="true">
            {/* „Пътят“: пунктирна пътека, която се изкачва през трите снимки — всяка стъпка по-голяма от предишната */}
            <svg className="pt-path" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path className="pt-d" d="M-6 92 C4 64 14 34 26 24 S 44 10 52 8 S 60 2 68 -8" />
              <path className="pt-m" d="M-4 98 C0 74 6 54 12 46 S 28 26 36 22 S 52 6 60 -6" />
            </svg>
            {[0, 1, 2].map((i) => (
              // снимка 1 от ЕИС е най-голямата (последната стъпка), 3 — най-малката
              <div key={i} className={`pt-ph pt-${i + 1}`}><img src={h[2 - i]} alt="" /></div>
            ))}
            <i className="pt-mark pt-m1" />
            <i className="pt-mark pt-m2" />
            <div className="cl-core"><span /></div>
          </div>
        </div>

        <nav className="wrap hx-paths" aria-label="За родители">
          <a href="/obuchenie-i-podkrepa" className="hp-blue">
            <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" /></svg></i>
            <span><b>Какво предлагаме</b><span>Обучение, терапии и рехабилитация по личен план за всяко дете</span></span>
          </a>
          <a href="/priem/proczedura" className="hp-orange">
            <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" /></svg></i>
            <span><b>Как се записва дете</b><span>Насочване чрез РЦПППО – Варна. Ние подготвяме документите</span></span>
          </a>
          <a href="/kontakti" className="hp-lime">
            <i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg></i>
            <span><b>Свържете се с нас</b><span>{info.contact.phone}, деловодство {info.hours.admin} ч.</span></span>
          </a>
        </nav>
      </section>

      {/* ===== Какво правим: голямо изречение + снимки 2 и 3 ===== */}
      <section className="hs hx-about" aria-labelledby="about-h">
        <Handprints slots={[{ top: '6%', left: '-2%' }, { bottom: '4%', left: '30%' }, { top: '2%', right: '1%' }]} />
        <div className="wrap ab-grid">
          <div className="ab-text">
            <h2 id="about-h" className="ab-say">
              Над 150 деца и младежи учат при нас. Всяко дете има свой план, а родителите са част от екипа.
            </h2>
            <p>
              Учители, логопеди, психолози и терапевти работят заедно по индивидуалния план на всяко дете –
              в класната стая, в терапевтичните кабинети и в сензорната зала.
            </p>
            <a className="more" href="/za-nas">Повече за центъра</a>
          </div>
          <div className="ab-photos" aria-hidden="true">
            <div className="ab-fl ab-p1" style={{ ['--fl' as any]: DAISY_A, ['--fl2' as any]: DAISY_A_BACK }}><span /><img src={about[0]} alt="" loading="lazy" /></div>
            <div className="ab-fl ab-p2" style={{ ['--fl' as any]: DAISY_B, ['--fl2' as any]: DAISY_B_BACK }}><span /><img src={about[1]} alt="" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <SectionJoin from="var(--paper)" flip />

      {/* ===== Записване: истинска последователност I–III, на плътно оранжево ===== */}
      <section className="hs hx-steps" aria-labelledby="priem-h">
        <Handprints count={2} slots={[{ top: '10%', right: '4%' }, { top: '6%', right: '22%' }, { bottom: '8%', right: '6%' }, { bottom: '4%', right: '30%' }]} />
        <div className="wrap">
          <div className="hs-head">
            <h2 id="priem-h">Записване на дете в три стъпки</h2>
            <p>Насочването става чрез РЦПППО – Варна. Ние подготвяме документите и ви водим през целия път.</p>
          </div>
          <ol className="hx-steplist">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="hx-n" aria-hidden="true">{['I', 'II', 'III'][i]}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <a className="btn btn-ink" href="/priem/proczedura">Пълната процедура и бланките</a>
        </div>
      </section>

      <SectionJoin from="var(--sky)" />

      {/* ===== Новини + събития ===== */}
      <section className="hs tone-lime" aria-labelledby="news-h">
        <div className="wrap">
          <div className="hs-head row">
            <h2 id="news-h">Какво се случва при нас</h2>
            <a className="more" href="/novini">Всички новини</a>
          </div>
          {!feat ? (
            <p className="empty">Скоро тук ще има новини от живота в центъра.</p>
          ) : (
            <div className="hn-grid">
              {/* водеща новина — снимка и текст един до друг (като в новинарските сайтове), с мек кръг зад снимката */}
              <a className="hn-feat" href={`/novini/${feat.slug}`}>
                <div className="hn-img">
                  {feat.cover_url ? <img src={feat.cover_url} alt="" /> : <span className="hn-noimg" />}
                </div>
                <div className="hn-ftext">
                  <p className="hn-meta"><span className="tag">{feat.category}</span> <time>{fmtDate(feat.published_at)}</time></p>
                  <h3>{feat.title}</h3>
                  {feat.excerpt && <p className="hn-ex">{feat.excerpt}</p>}
                  <span className="hn-read">Прочетете</span>
                </div>
              </a>

              <div className="hn-events">
                <h3>Предстоящи събития</h3>
                {events.length === 0 ? (
                  <p className="muted">Няма обявени събития в момента.</p>
                ) : (
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
                )}
                <a className="more" href="/sabitiya">Всички събития</a>
              </div>

              {rest.length > 0 && (
                <ul className="hn-cards">
                  {rest.map((n, i) => (
                    <li key={n.id} className={`hn-c${i % 3}`}>
                      <a href={`/novini/${n.slug}`}>
                        <span className="hn-cimg">
                          {n.cover_url ? <img src={n.cover_url} alt="" loading="lazy" /> : <span className="hn-noimg" />}
                        </span>
                        <time>{fmtDate(n.published_at)}</time>
                        <b>{n.title}</b>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== Галерия ===== */}
      {photos.length > 0 && (
        <section className="hs hx-gal tone-lime" aria-labelledby="gal-h">
          <div className="wrap">
            <div className="hs-head row">
              <h2 id="gal-h">Моменти от ежедневието</h2>
              <a className="more" href="/galeriya">Към галерията</a>
            </div>
            <PhotoBand photos={photos.map((p) => p.photo_url)} title="Моменти от ежедневието" />
          </div>
        </section>
      )}

      <SectionJoin from="var(--paper)" flip />

      {/* ===== Ценности — на тъмно морско синьо ===== */}
      <section className="hs hx-vals" aria-labelledby="val-h">
        <Handprints dark count={2} slots={[{ bottom: '-6%', right: '3%' }, { bottom: '-10%', left: '-2%' }, { bottom: '-8%', left: '38%' }]} />
        <div className="wrap">
          <div className="hs-head row">
            <h2 id="val-h">Това, в което вярваме</h2>
            <a className="more" href="/za-nas">Повече за центъра</a>
          </div>
          <div className="hx-vlist">
            {VALUES.map((v) => (
              <div key={v.t} className="hx-v">
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionJoin from="var(--j-sea)" />

      {/* ===== Покана за разговор ===== */}
      <section className="hs hx-ask" aria-labelledby="ask-h">
        <div className="wrap hd-grid">
          <h2 id="ask-h">Не е нужно да знаете всичко предварително.</h2>
          <div>
            <p>Обадете се или ни пишете – ще ви кажем какви са следващите стъпки за вашето дете.</p>
            <div className="btn-row">
              <a className="btn btn-dark" href={info.contact.phoneHref}>{info.contact.phone}</a>
              <a className="btn btn-ghost" href="/kontakti">Всички контакти</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Прозрачност ===== */}
      <section className="hs tone-blue" aria-labelledby="prz-h">
        <div className="wrap">
          <div className="hs-head row">
            <div>
              <h2 id="prz-h">Прозрачност</h2>
              <p>Документите на центъра са публични и на едно място.</p>
            </div>
            <a className="more" href="/prozrachnost">Всички документи</a>
          </div>
          <div className="link-list" style={{ ['--cols' as any]: 3 }}>
            {DOCS.map((d) => (
              <a key={d.href} href={d.href}>
                <span className="ll-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d.icon} /></svg>
                </span>
                <span><span className="ll-t">{d.t}</span><span className="ll-d">{d.d}</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Дарителство ===== */}
      <section className="hs hx-donate tone-orange" aria-labelledby="don-h">
        <Handprints slots={[{ top: '6%', right: '3%' }, { bottom: '2%', right: '18%' }, { top: '14%', left: '46%' }]} />
        <div className="wrap">
          <div className="hd-grid">
            <h2 id="don-h">Заедно правим средата още по‑добра</h2>
            <div>
              <p>Даренията и партньорствата обогатяват учебната и терапевтичната среда на децата.</p>
              <a className="btn btn-primary" href="/daritelstvo">Дарения и партньорства</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
