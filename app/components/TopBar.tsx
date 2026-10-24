import { getSiteInfo } from '../../lib/siteinfo';
import LangSwitch from './LangSwitch';
import type { Lang } from '../../lib/lang';

// Тънкият горен ред над менюто: телефон, имейл, работно време и сигнали.
// Данните идват от ЕИС → Сайт → Настройки. Превърта се заедно със страницата; лепне само менюто под него.
export default async function TopBar({ lang = 'bg' }: { lang?: Lang }) {
  const { contact, hours } = await getSiteInfo();
  return (
    <div className="topbar">
      <div className="wrap tb-in">
        <div className="tb-group">
          <a href={contact.phoneHref} className="tb-item">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="tb-item tb-mail">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg>
            {contact.email}
          </a>
        </div>
        <div className="tb-group">
          <span className="tb-item tb-hours">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" /></svg>
            {lang === 'en' ? `Mon – Fri, ${hours.center}` : `Център ${hours.center} ч., деловодство ${hours.admin} ч.`}
          </span>
          {lang === 'bg' && <a href="/podavane-na-signali" className="tb-item">Подаване на сигнали</a>}
          <LangSwitch />
        </div>
      </div>
    </div>
  );
}
