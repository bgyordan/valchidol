import { USEFUL_LINKS } from './nav';
import { getNav } from '../../lib/menu';
import { getSiteInfo } from '../../lib/siteinfo';
import LastUpdated from './LastUpdated';
import './footer.css';
import type { Lang } from '../../lib/lang';

export default async function Footer({ lang = 'bg' }: { lang?: Lang }) {
  const [{ contact: CONTACT, hours: HOURS }, NAV] = await Promise.all([getSiteInfo(), getNav()]);
  // Футърът е кратък: без „Новини“ (тя е в менюто и на началната) и по най-много 5 връзки от раздел,
  // в реда от админ → Меню; останалите са зад „Всичко в раздела“.
  const groups = NAV.filter((g) => g.href !== '/novini');
  const MAX = 5;
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="sf-top">
          <div className="sf-brand">
            <img src="/logo.png" alt="" width={56} height={56} />
            <p className="sf-name">СУ „Васил Левски“</p>
            <p>Средно училище „Васил Левски“ – гр. Вълчи дол. Училище с традиции – училище с бъдеще.</p>
            <a className="sf-fb" href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">Facebook страница</a>
          </div>

          {groups.map((g) => (
            <nav key={g.href} className="sf-col" aria-label={g.label}>
              <p className="sf-h"><a href={g.href}>{g.label}</a></p>
              <ul>
                {g.links.slice(0, MAX).map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
                {g.links.length > MAX && <li><a className="sf-more" href={g.href}>Всичко в раздела</a></li>}
              </ul>
            </nav>
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
