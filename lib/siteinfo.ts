import { CONTACT as DEFAULT_CONTACT } from '../app/components/nav';
import { getSetting } from './data';

// Данните на сайта, които се сменят от ЕИС → Сайт → Настройки (site_settings.site_info).
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
  hours: { center: '8:00 – 18:00', admin: '8:00 – 16:30', director: 'вторник, 9:00 – 10:00' },
  phones: [
    { name: 'Светлана Иванова', role: 'Директор', phone: '+359 878 521 823', href: 'tel:+359878521823' },
    { name: 'Силвия Кьошкерян', role: 'Зам.-директор УД', phone: '+359 882 699 867', href: 'tel:+359882699867' },
    { name: 'Йордан Йорданов', role: 'Зам.-директор АСД', phone: '+359 893 405 737', href: 'tel:+359893405737' },
    { name: 'Деловодство', role: 'Администрация', phone: '+359 888 490 771', href: 'tel:+359888490771' },
  ],
  // сметката на центъра в ЦКБ (от стария сайт); сменя се от ЕИС → Сайт → Настройки → Банка
  bank: { to: 'Център за специална образователна подкрепа – Варна', iban: 'BG19 CECB 9790 3196 3387 00', bic: 'CECBBGSF', reason: 'Дарение за дейността на ЦСОП – Варна' },
  signali: { person: 'Силвия Кьошкерян, ЗДУД', email: 'signali@csop-varna.bg', phone: '' },
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
