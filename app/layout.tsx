import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/caveat';
import './fonts.css';
import './globals.css';
import Header from './components/Header';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import SiteNotice from './components/SiteNotice';
import ScrollTop from './components/ScrollTop';
import AccessibilityWidget from './components/AccessibilityWidget';
import CookieBanner from './components/CookieBanner';
import DocPreview from './components/DocPreview';
import Doodles from './components/Doodles';
import { getLang } from '../lib/lang-server';
import { getNav, getNavEn } from '../lib/menu';

const SITE = 'https://souvalchidol.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'СУ „Васил Левски“ – гр. Вълчи дол',
    template: '%s',
  },
  description:
    'Средно училище „Васил Левски“ – гр. Вълчи дол. Училище с традиции – училище с бъдеще. Новини, прием, документи и информация за родители и ученици.',
  icons: { icon: '/logo.png', apple: '/logo.png', shortcut: '/logo.png' },
  openGraph: {
    title: 'СУ „Васил Левски“ – гр. Вълчи дол',
    description: 'Училище с традиции – училище с бъдеще.',
    url: SITE,
    siteName: 'СУ „Васил Левски“ – Вълчи дол',
    locale: 'bg_BG',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1722' },
  ],
};

// Темата се избира преди първото рисуване (без проблясване).
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('su-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;h.setAttribute('data-theme',d?'dark':'light');h.classList.toggle('dark',d);}catch(e){}try{var a=JSON.parse(localStorage.getItem('su-a11y')||'null');if(a){var F=[1,1.12,1.25,1.4];if(a.font)document.documentElement.style.setProperty('--fs',String(F[a.font]||1));if(a.contrast)document.documentElement.classList.add('a11y-contrast');if(a.links)document.documentElement.classList.add('a11y-links');}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const nav = lang === 'en' ? await getNavEn() : await getNav();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {lang === 'bg' && <SiteNotice />}
        <TopBar lang={lang} />
        <Header nav={nav} lang={lang} />
        <main id="main"><Doodles />{children}</main>
        <Footer lang={lang} />
        <ScrollTop />
        <AccessibilityWidget />
        <CookieBanner />
        <DocPreview />
      </body>
    </html>
  );
}
