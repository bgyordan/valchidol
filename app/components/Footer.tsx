import { NAV, USEFUL_LINKS } from './nav';
import { getSiteInfo } from '../../lib/siteinfo';
import LastUpdated from './LastUpdated';
import './footer.css';
import type { Lang } from '../../lib/lang';

export default async function Footer({ lang = 'bg' }: { lang?: Lang }) {
  const { contact: CONTACT, hours: HOURS } = await getSiteInfo();
  // „Новини“ няма отделна колона — стои под „За училището“, за да останат пет колони и всички връзки да се виждат
  const news = NAV.find((g) => g.href === '/novini');
  const groups = NAV.filter((g) => g !== news);
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="sf-top">
          <div className="sf-brand">
            <img src="/logo.svg" alt="" width={56} height={56} />
            <p className="sf-name">СУ „Васил Левски“</p>
            <p>Средно училище „Васил Левски“ – гр. Вълчи дол. Училище с традиции – училище с бъдеще.</p>
            <a className="sf-fb" href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">Facebook страница</a>
          </div>

          {groups.map((g, i) => (
            <div key={g.href} className="sf-col">
              <nav className={`tone-${g.tone}`} aria-label={g.label}>
                <p className="sf-h">{g.label}</p>
                <ul>
                  {g.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                </ul>
              </nav>
              {i === 0 && news && (
                <nav className={`sf-sub tone-${news.tone}`} aria-label={news.label}>
                  <p className="sf-h">{news.label}</p>
                  <ul>
                    {news.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                  </ul>
                </nav>
              )}
            </div>
          ))}

          <div className="sf-col sf-contact">
            <p className="sf-h">Контакти</p>
            <address>
              {CONTACT.address}<br />{CONTACT.city}
            </address>
            <p><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            <p className="sf-hours">Деловодство: {HOURS.admin}</p>
          </div>
        </div>

        <nav className="sf-useful" aria-label="Полезни връзки">
          {USEFUL_LINKS.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
        </nav>

        <div className="sf-bot">
          <span>© {new Date().getFullYear()} СУ „Васил Левски“ – Вълчи дол</span>
          <LastUpdated />
          <span className="sf-legal">
            <a href="/dostapnost">Достъпност</a>
            <a href="/lichni-danni">Лични данни</a>
            <a href="/politika-za-biskvitki">Бисквитки</a>
            <a href="/obshti-usloviya">Общи условия</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
