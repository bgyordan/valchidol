import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/unbounded';
import './fonts.css';
import './globals.css';
import Header from './components/Header';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import SiteNotice from './components/SiteNotice';
import ScrollTop from './components/ScrollTop';
import AccessibilityWidget from './components/AccessibilityWidget';
import CookieBanner from './components/CookieBanner';
import ChatWidget from './components/ChatWidget';
import { getSiteInfo } from '../lib/siteinfo';
import { getLang } from '../lib/lang-server';

const SITE = 'https://csop-varna.bg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'ЦСОП Варна – Център за специална образователна подкрепа',
    template: '%s',
  },
  description:
    'Център за специална образователна подкрепа – Варна: обучение, специализирана подкрепа и рехабилитация за деца и младежи със специални образователни потребности.',
  icons: { icon: '/logo.jpg', apple: '/logo.jpg', shortcut: '/logo.jpg' },
  openGraph: {
    title: 'ЦСОП Варна – Център за специална образователна подкрепа',
    description: 'Обучение, специализирана подкрепа и рехабилитация за деца и младежи.',
    url: SITE,
    siteName: 'ЦСОП Варна',
    images: [{ url: '/logo.jpg', width: 512, height: 512, alt: 'Логото на ЦСОП Варна' }],
    locale: 'bg_BG',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#081B2B' },
  ],
};

// Темата се избира преди първото рисуване (без проблясване).
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('csop-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;h.setAttribute('data-theme',d?'dark':'light');h.classList.toggle('dark',d);}catch(e){}try{var a=JSON.parse(localStorage.getItem('csop-a11y')||'null');if(a){var F=[1,1.12,1.25,1.4];if(a.font)document.documentElement.style.setProperty('--fs',String(F[a.font]||1));if(a.contrast)document.documentElement.classList.add('a11y-contrast');if(a.links)document.documentElement.classList.add('a11y-links');}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  // чатботът се показва само когато на сървъра има ключ за Gemini
  const chat = process.env.GEMINI_API_KEY ? (await getSiteInfo()).contact : null;
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {lang === 'bg' && <SiteNotice />}
        <TopBar lang={lang} />
        <Header />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <ScrollTop />
        <AccessibilityWidget />
        <CookieBanner />
        {chat && <ChatWidget phone={chat.phone} phoneHref={chat.phoneHref} />}
      </body>
    </html>
  );
}
