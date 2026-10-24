import { CONTACT as DEFAULT_CONTACT } from '../app/components/nav';
import { getSetting } from './data';

// Данните на сайта от site_settings.site_info (ключ в базата).
// Ако базата не отговори или поле липсва, остават стойностите по подразбиране от кода.
export type SiteInfo = {
  notice: { on: boolean; text: string; link: string; until: string };
  contact: typeof DEFAULT_CONTACT;
  hours: { center: string; admin: string; director: string };
  phones: { name: string; role: string; phone: string; href: string }[];
  bank: { to: string; iban: string; bic: string; reason: string };
  signali: { person: string; email: string; phone: string };
};

const DEFAULTS: SiteInfo = {
  notice: { on: false, text: '', link: '', until: '' },
  contact: DEFAULT_CONTACT,
  hours: { center: 'пон – пет, 8:00 – 17:00', admin: 'пон – пет, 8:00 – 17:00', director: 'пон – пет, 13:00 – 14:30' },
  // от страница „Контакти“ на стария сайт
  phones: [
    { name: 'Директор', role: 'Ръководител', phone: '0894 417 170', href: 'tel:+359894417170' },
    { name: 'Заместник-директор УД', role: 'Учебна дейност', phone: '0894 417 176', href: 'tel:+359894417176' },
    { name: 'Заместник-директор АСД', role: 'Административна дейност', phone: '0892 412 342', href: 'tel:+359892412342' },
  ],
  bank: { to: '', iban: '', bic: '', reason: '' },
  signali: { person: 'Заместник-директор АСД', email: 'info-400112@edu.mon.bg', phone: '0892 412 342' },
};

const telHref = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '');
const pick = (v: unknown, d: string) => (typeof v === 'string' && v.trim() ? v.trim() : d);

export async function getSiteInfo(): Promise<SiteInfo> {
  const raw = (await getSetting<Record<string, any>>('site_info')) || {};
  const c = raw.contact || {}, h = raw.hours || {}, b = raw.bank || {}, s = raw.signali || {}, n = raw.notice || {};
  const phone = pick(c.phone, DEFAULTS.contact.phone);
  const phones = Array.isArray(raw.phones)
    ? raw.phones.filter((p: any) => p && (p.name || p.phone)).map((p: any) => ({ name: String(p.name || ''), role: String(p.role || ''), phone: String(p.phone || ''), href: telHref(String(p.phone || '')) }))
    : DEFAULTS.phones;
  return {
    notice: { on: !!n.on, text: String(n.text || ''), link: String(n.link || ''), until: String(n.until || '') },
    contact: {
      ...DEFAULTS.contact,
      address: pick(c.address, DEFAULTS.contact.address),
      city: pick(c.city, DEFAULTS.contact.city),
      email: pick(c.email, DEFAULTS.contact.email),
      phone,
      phoneHref: telHref(phone),
      facebook: pick(c.facebook, DEFAULTS.contact.facebook),
    },
    hours: { center: pick(h.center, DEFAULTS.hours.center), admin: pick(h.admin, DEFAULTS.hours.admin), director: pick(h.director, DEFAULTS.hours.director) },
    phones: phones.length ? phones : DEFAULTS.phones,
    bank: { to: pick(b.to, DEFAULTS.bank.to), iban: pick(b.iban, DEFAULTS.bank.iban), bic: pick(b.bic, DEFAULTS.bank.bic), reason: pick(b.reason, DEFAULTS.bank.reason) },
    signali: { person: pick(s.person, DEFAULTS.signali.person), email: pick(s.email, DEFAULTS.signali.email), phone: typeof s.phone === 'string' ? s.phone.trim() : '' },
  };
}

// Обявата се показва, ако е включена, има текст и датата „до“ (включително) не е минала
export function noticeActive(n: SiteInfo['notice']): boolean {
  if (!n.on || !n.text.trim()) return false;
  if (!n.until) return true;
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Sofia' });
  return n.until >= today;
}
