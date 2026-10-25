'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isEnPath } from '../../lib/lang';

const KEY = 'su-cookie-consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const en = isEnPath(usePathname() || '/');

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* ignore */ }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, new Date().toISOString()); } catch { /* ignore */ }
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        .cookie-bar {
          position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 1100;
          max-width: 720px; margin: 0 auto;
          background: var(--paper); border: 1px solid var(--line); border-radius: 18px;
          box-shadow: 0 20px 50px -16px rgba(16,34,64,.3);
          padding: 18px 20px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
          font-family: var(--sans, system-ui);
        }
        .cookie-bar .ck-ic {
          width: 40px; height: 40px; border-radius: 12px; flex: 0 0 auto;
          background: var(--blue-soft); color: var(--blue-ink); display: grid; place-items: center;
        }
        .cookie-bar .ck-txt { flex: 1; min-width: 220px; }
        .cookie-bar .ck-txt p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-2); }
        .cookie-bar .ck-txt a { color: var(--blue-ink); font-weight: 400; text-decoration: none; }
        .cookie-bar .ck-txt a:hover { text-decoration: underline; }
        .cookie-bar .ck-btn {
          border: none; cursor: pointer; background: var(--ink); color: var(--paper);
          padding: 11px 22px; border-radius: 12px; font-family: inherit; font-size: 14px; font-weight: 400;
          transition: background .2s; flex: 0 0 auto;
        }
        .cookie-bar .ck-btn:hover { background: var(--ink); }
        @media (max-width: 520px) {
          .cookie-bar { flex-direction: column; align-items: stretch; text-align: left; }
          .cookie-bar .ck-btn { width: 100%; }
        }
      `}</style>
      <div className="cookie-bar" role="dialog" aria-label={en ? 'Cookie notice' : 'Съобщение за бисквитки'}>
        <span className="ck-ic" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
            <circle cx="8.5" cy="10.5" r="1" fill="currentColor" /><circle cx="12.5" cy="15" r="1" fill="currentColor" /><circle cx="15.5" cy="10" r="1" fill="currentColor" />
          </svg>
        </span>
        <div className="ck-txt">
          {en ? (
            <p>
              This site only stores technically necessary data (e.g. your theme and accessibility settings).
              We use no advertising or analytics cookies. The embedded map on the Contacts page may load cookies from Google.{' '}
              <a href="/politika-za-biskvitki" hrefLang="bg">Cookie policy (in Bulgarian)</a>
            </p>
          ) : (
            <p>
              Този сайт използва само технически необходими данни (напр. избраната тема и настройки за достъпност).
              Не използваме рекламни или аналитични бисквитки. Вградената карта в „Контакти“ може да зареди бисквитки от Google.{' '}
              <a href="/politika-za-biskvitki">Политика за бисквитки</a>
            </p>
          )}
        </div>
        <button className="ck-btn" onClick={accept}>{en ? 'Got it' : 'Разбрах'}</button>
      </div>
    </>
  );
}
