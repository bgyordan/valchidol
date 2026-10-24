import { NAV } from './nav';
import { getSiteInfo } from '../../lib/siteinfo';
import LastUpdated from './LastUpdated';
import './footer.css';
import type { Lang } from '../../lib/lang';

export default async function Footer({ lang = 'bg' }: { lang?: Lang }) {
  const { contact: CONTACT, hours: HOURS } = await getSiteInfo();
  if (lang === 'en') {
    return (
      <footer className="site-foot">
        <div className="wrap">
          <div className="sf-top">
            <div className="sf-brand">
              <img src="/logo.jpg" alt="" width={56} height={56} />
              <p className="sf-name">CSOP Varna</p>
              <p>Centre for Special Educational Support. Education, specialised support and rehabilitation for children and young people.</p>
              <a className="sf-fb" href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">Facebook page</a>
            </div>
            <nav className="sf-col tone-blue" aria-label="Pages">
              <p className="sf-h">The centre</p>
              <ul>
                <li><a href="/en">About us</a></li>
                <li><a href="/en/services">Services</a></li>
                <li><a href="/en/admission">Admission</a></li>
                <li><a href="/en/support-us">Support us</a></li>
              </ul>
            </nav>
            <nav className="sf-col tone-orange" aria-label="In Bulgarian">
              <p className="sf-h">In Bulgarian</p>
              <ul>
                <li><a href="/" hrefLang="bg">Full website</a></li>
                <li><a href="/novini" hrefLang="bg">News</a></li>
                <li><a href="/za-nas/ekip" hrefLang="bg">Our team</a></li>
                <li><a href="/prozrachnost" hrefLang="bg">Transparency</a></li>
              </ul>
            </nav>
            <div className="sf-col sf-contact">
              <p className="sf-h">Contacts</p>
              <address>
                7 Petko Staynov Str.<br />9000 Varna, Bulgaria
              </address>
              <p><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
              <p><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
              <p className="sf-hours">Mon – Fri, {HOURS.center}</p>
            </div>
          </div>
          <div className="sf-bot">
            <span>© {new Date().getFullYear()} CSOP – Varna</span>
            <span className="sf-legal">
              <a href="/dostapnost" hrefLang="bg">Accessibility</a>
              <a href="/za-nas/zashtita-na-lichnite-danni" hrefLang="bg">Privacy</a>
              <a href="/politika-za-biskvitki" hrefLang="bg">Cookies</a>
            </span>
          </div>
        </div>
      </footer>
    );
  }
  // „Новини“ няма отделна колона — стои под „За нас“, за да останат пет колони и всички връзки да се виждат
  const news = NAV.find((g) => g.href === '/novini');
  const groups = NAV.filter((g) => g !== news);
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="sf-top">
          <div className="sf-brand">
            <img src="/logo.jpg" alt="" width={56} height={56} />
            <p className="sf-name">ЦСОП Варна</p>
            <p>Център за специална образователна подкрепа. Обучение, специализирана подкрепа и рехабилитация за деца и младежи.</p>
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
            <p className="sf-hours">Пон – пет, {HOURS.center}</p>
          </div>
        </div>

        <div className="sf-bot">
          <span>© {new Date().getFullYear()} ЦСОП – Варна</span>
          <LastUpdated />
          <span className="sf-legal">
            <a href="/dostapnost">Достъпност</a>
            <a href="/za-nas/zashtita-na-lichnite-danni">Лични данни</a>
            <a href="/politika-za-biskvitki">Бисквитки</a>
            <a href="/obshti-usloviya">Общи условия</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
