'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NAV as DEFAULT_NAV, type NavGroup } from './nav';
import ThemeToggle from './ThemeToggle';

const BOOK = 'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h11';
import './header.css';

// менюто идва от layout (с промените от админа); без него — менюто от кода
export default function Header({ nav }: { nav?: NavGroup[] }) {
  const NAV = nav || DEFAULT_NAV;
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState<string | null>(null); // отворено падащо меню (desktop)
  const [mobile, setMobile] = useState(false);
  const [mobGroup, setMobGroup] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false); // страницата е превъртяна → лентата става по-ниска и със сянка
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // затваря менютата при смяна на страница
  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  // кратко забавяне при първо отваряне — менюто не „мига“, ако мишката само минава през лентата
  const enter = (k: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (open) setOpen(k);
    else timer.current = setTimeout(() => setOpen(k), 110);
  };
  const leave = () => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(null), 160); };

  // само един раздел е „текущ“ — първият, в който е страницата (някои страници са в два раздела)
  const activeGroup = NAV.find((g) => pathname === g.href || g.links.some((l) => pathname === l.href || pathname.startsWith(l.href + '/')))?.href;
  const isActive = (href: string) => href === activeGroup;

  return (
    <header className={`site-head${open ? ' is-open' : ''}${stuck ? ' is-stuck' : ''}${mobile ? ' is-mob' : ''}`}>
      <a className="skip" href="#main">Към съдържанието</a>
      <div className="wrap sh-bar">
        <a href="/" className="sh-brand" aria-label="СУ „Васил Левски“ – начална страница">
          <img src="/logo.svg" alt="" width={56} height={56} />
          <span>
            <b>СУ „Васил Левски“</b>
            <small>гр. Вълчи дол · от 1880 г.</small>
          </span>
        </a>

        <nav className="sh-nav" aria-label="Основно меню">
          <div className="sh-item"><a href="/" className={`sh-link solo${pathname === '/' ? ' current' : ''}`}>Начало</a></div>
          {NAV.map((g) => (
            <div
              key={g.href}
              className={`sh-item${open === g.href ? ' open' : ''}`}
              onMouseEnter={() => enter(g.href)}
              onMouseLeave={leave}
            >
              {/* самото име води към страницата на раздела; стрелката (или посочване с мишката) отваря подменюто */}
              <a href={g.href} className={`sh-link${isActive(g.href) ? ' current' : ''}`}>{g.label}</a>
              <button
                type="button"
                className="sh-caret"
                aria-expanded={open === g.href}
                aria-label={`Подменю „${g.label}“`}
                onClick={() => setOpen(open === g.href ? null : g.href)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className={`sh-panel tone-${g.tone}`} hidden={open !== g.href}>
                <ul>
                  {g.links.filter((l) => l.href !== g.href).map((l) => (
                    <li key={l.href}>
                      <a href={l.href} aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="sh-item"><a href="/kontakti" className={`sh-link solo${pathname === '/kontakti' ? ' current' : ''}`}>Контакти</a></div>
        </nav>

        {/* листче-иконка за обявата (NoticeNote.tsx я слага тук, когато има активна обява) */}
        <span id="sh-notice-slot" />
        <ThemeToggle />
        <a href="https://app.shkolo.bg/" className="sh-donate" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={BOOK} /></svg>Е-дневник</a>
        <button type="button" className="sh-menu" aria-expanded={mobile} aria-controls="mob-nav" onClick={() => setMobile(!mobile)}>
          {mobile ? 'Затвори' : 'Меню'}
        </button>
      </div>

      {/* Мобилно меню */}
      <div id="mob-nav" className="sh-mob" hidden={!mobile}>
        <div className="wrap">
          <a className="sh-mob-solo" href="/">Начало</a>
          {NAV.map((g) => (
            <div key={g.href} className="sh-mob-g">
              <div className="sh-mob-row">
                <a href={g.href}>{g.label}</a>
                <button type="button" aria-expanded={mobGroup === g.href} aria-label={`Подменю „${g.label}“`} onClick={() => setMobGroup(mobGroup === g.href ? null : g.href)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
              </div>
              <ul hidden={mobGroup !== g.href}>
                {g.links.filter((l) => l.href !== g.href).map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <a className="sh-mob-solo" href="/kontakti">Контакти</a>
          <a className="sh-donate sh-mob-donate" href="https://app.shkolo.bg/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={BOOK} /></svg>Електронен дневник</a>
        </div>
      </div>
    </header>
  );
}
