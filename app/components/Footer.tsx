import { USEFUL_LINKS } from './nav';
import { getNav, getNavEn } from '../../lib/menu';
import { getSiteInfo } from '../../lib/siteinfo';
import LastUpdated from './LastUpdated';
import './footer.css';
import { enDays, type Lang } from '../../lib/lang';

export default async function Footer({ lang = 'bg' }: { lang?: Lang }) {
  const en = lang === 'en';
  const [{ contact: CONTACT, hours: HOURS }, NAV] = await Promise.all([getSiteInfo(), en ? getNavEn() : getNav()]);
  // Футърът е кратък: без „Новини“ (тя е в менюто и на началната) и по най-много 5 връзки от раздел,
  // в реда от админ → Меню; останалите са зад „Всичко в раздела“.
  // на английски: всички преведени страници в една колона
  const groups = en
    ? [{ label: 'Pages', href: '/en', links: NAV.flatMap((g) => (g.links.length ? g.links : [{ label: g.label, href: g.href }])) }]
    : NAV.filter((g) => g.href !== '/novini');
  const MAX = 5;
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="sf-top">
          <div className="sf-brand">
            <img src="/logo.png" alt="" width={56} height={56} />
            <p className="sf-name">{en ? 'Vasil Levski School' : 'СУ „Васил Левски“'}</p>
            <p>{en ? 'Vasil Levski Secondary School – Valchi Dol, Bulgaria. A school with traditions – a school with a future.' : 'Средно училище „Васил Левски“ – гр. Вълчи дол. Училище с традиции – училище с бъдеще.'}</p>
            <a className="sf-fb" href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">{en ? 'Facebook page' : 'Facebook страница'}</a>
          </div>

          {groups.map((g) => (
            <nav key={g.href} className="sf-col" aria-label={g.label}>
              <p className="sf-h">{en ? g.label : <a href={g.href}>{g.label}</a>}</p>
              <ul>
                {g.links.slice(0, en ? 20 : MAX).map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                {!en && g.links.length > MAX && <li><a className="sf-more" href={g.href}>Всичко в раздела</a></li>}
              </ul>
            </nav>
          ))}

          <div className="sf-col sf-contact">
            <p className="sf-h">{en ? 'Contacts' : 'Контакти'}</p>
            <address>
              {en ? <>{CONTACT.address}<br />{CONTACT.city}, Bulgaria</> : <>{CONTACT.address}<br />{CONTACT.city}</>}
            </address>
            <p><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            <p className="sf-hours">{en ? `Office: ${enDays(HOURS.admin)}` : `Деловодство: ${HOURS.admin}`}</p>
          </div>
        </div>

        {!en && <nav className="sf-useful" aria-label="Полезни връзки">
          {USEFUL_LINKS.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
        </nav>}

        <div className="sf-bot">
          <span>© {new Date().getFullYear()} {en ? 'Vasil Levski School – Valchi Dol' : 'СУ „Васил Левски“ – Вълчи дол'}</span>
          {/* сайтът работи в мрежата на Cloudflare (Workers) — защита от атаки и HTTPS */}
          <a className="sf-cf" href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer"
            title={en ? 'This site runs on the Cloudflare network – protection from attacks and a secure connection' : 'Сайтът работи в мрежата на Cloudflare – защита от атаки и сигурна връзка'}>
            <svg viewBox="0 0 32 20" aria-hidden="true">
              <path d="M8 18h17.5a5 5 0 0 0 .6-9.96A8 8 0 0 0 10.6 6.2 6 6 0 0 0 8 18z" />
            </svg>
            {en ? 'Protected by Cloudflare' : 'Защитено от Cloudflare'}
          </a>
          {!en && <LastUpdated />}
          <span className="sf-legal">
            {en ? <a href="/">Българска версия</a> : <>
            <a href="/dostapnost">Достъпност</a>
            <a href="/lichni-danni">Лични данни</a>
            <a href="/politika-za-biskvitki">Бисквитки</a>
            <a href="/signali">Сигнали</a>
            <a href="/obshti-usloviya">Общи условия</a></>}
          </span>
        </div>
      </div>
    </footer>
  );
}
