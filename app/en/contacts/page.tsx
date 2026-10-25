import type { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import PageHero from '../../components/PageHero';
import MapEmbed from '../../kontakti/MapEmbed';
import { getSiteInfo } from '../../../lib/siteinfo';
import { enDays } from '../../../lib/lang';

export const metadata: Metadata = {
  title: 'Contacts — Vasil Levski School, Valchi Dol',
  description: 'Phone numbers, office hours, e-mail and address of Vasil Levski Secondary School in Valchi Dol, Bulgaria.',
  alternates: { canonical: '/en/contacts', languages: { bg: '/kontakti', en: '/en/contacts' } },
};

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.564536294747!2d27.5512316!3d43.404123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a5bc546f663f71%3A0x400a483486a42a0!2z0JLRitC70YfQuCDQtNC-0LsgOTI4MA!5e0!3m2!1sen!2sbg!4v1715850000000!5m2!1sen!2sbg';

// длъжностите от админа са на български — най-честите се превеждат, другите остават както са
const ROLE: [RegExp, string][] = [
  [/^заместник-директор\s*уд$/i, 'Deputy principal, teaching'], [/^заместник-директор\s*асд$/i, 'Deputy principal, administration'],
  [/^заместник-директор/i, 'Deputy principal'], [/^директор$/i, 'Principal'], [/^деловодство|деловодител/i, 'Office'],
  [/счетовод/i, 'Accounting'], [/ръководител/i, 'Head of school'], [/учебна дейност/i, 'Teaching'], [/административна дейност/i, 'Administration'],
];
const en = (s: string) => ROLE.find(([re]) => re.test(s.trim()))?.[1] ?? s;

export default async function ContactsEn() {
  const { contact: CONTACT, hours: HOURS, phones } = await getSiteInfo();
  return (
    <>
      <PageHero title="Contacts" kicker="Contacts" lang="en" tone="blue" />
      <section className="section tone-blue">
        <div className="wrap split">
          <div>
            <h2 style={{ marginBottom: 12 }}>Phone</h2>
            <ul className="phones">
              {phones.map((p) => (
                <li key={p.name + p.phone}>
                  <span><b>{en(p.name)}</b>{p.role && <span className="muted">{en(p.role)}</span>}</span>
                  <a href={p.href.replace('tel:0', 'tel:+359')}>{p.phone.replace(/^0/, '+359 ')}</a>
                </li>
              ))}
            </ul>
            <h2 style={{ margin: '36px 0 12px' }}>E-mail</h2>
            <p className="big-line"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          </div>
          <aside className="aside-box">
            <h3>Opening hours</h3>
            <table className="facts hours">
              <tbody>
                <tr><th>Office</th><td>{enDays(HOURS.admin)}</td></tr>
                <tr><th>Meetings with the principal</th><td>{enDays(HOURS.director)}</td></tr>
              </tbody>
            </table>
            <h3 style={{ marginTop: 24 }}>Address</h3>
            <p>{CONTACT.address}<br />{CONTACT.city}, Bulgaria</p>
          </aside>
        </div>
      </section>
      <section className="section tone-blue" id="write">
        <div className="wrap cf-wrap">
          <ContactForm lang="en" email={CONTACT.email} />
        </div>
      </section>
      <section className="section tone-blue">
        <div className="wrap">
          <MapEmbed src={MAP_SRC} link={CONTACT.maps} lang="en" />
        </div>
      </section>
    </>
  );
}
