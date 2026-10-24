import ContactForm from '../../components/ContactForm';
import PageHero from '../../components/PageHero';
import MapEmbed from '../../kontakti/MapEmbed';
import { getSiteInfo } from '../../../lib/siteinfo';
import { alternates } from '../../../lib/lang';
import { enDays, enContact } from '../../../lib/en';

export const metadata = {
  title: 'Contacts — CSOP Varna',
  description: 'Phones, opening hours, e-mail and address of the Centre for Special Educational Support in Varna, 7 Petko Staynov Str.',
  alternates: alternates('/en/contacts'),
};

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.18841078835!2d27.897481!3d43.225869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a4548a1b90abe7%3A0x74a7a17d27cf65ee!2z0YPQuy4g4oCe0J_QtdGC0LrQviDQodGC0LDQudC90L7QstKAnCA3LCA5MDA5INCh0LXQstC10YDQvdCwINC_0YDQvtC80LjRiNC70LXQvdCwINC30L7QvdCwLCDQktCw0YDQvdCw!5e0!3m2!1sen!2sbg!4v1674036920647!5m2!1sen!2sbg';

export default async function EnContacts() {
  const { contact: CONTACT, hours: HOURS, phones } = await getSiteInfo();
  return (
    <>
      <PageHero
        lang="en"
        kicker="Contacts"
        tone="blue"
        title="Contacts"
        intro="Call us, write to us or drop in. We will answer your questions and help."
      />
      <section className="section tone-blue">
        <div className="wrap split">
          <div>
            <h2 style={{ marginBottom: 12 }}>Phones</h2>
            <ul className="phones">
              {phones.map((p) => {
                const c = enContact(p.name, p.role);
                return (
                <li key={p.name + p.phone}>
                  <span><b>{c.name}</b><span className="muted">{c.role}</span></span>
                  <a href={p.href}>{p.phone}</a>
                </li>
                );
              })}
            </ul>
            <h2 style={{ margin: '36px 0 12px' }}>E-mail</h2>
            <p className="big-line"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            <p className="muted" style={{ marginTop: 16, maxWidth: '34em' }}>
              Our staff work in Bulgarian. If you write in English, we will do our best to reply.
            </p>
          </div>
          <aside className="aside-box">
            <h3>Opening hours</h3>
            <table className="facts hours">
              <tbody>
                <tr><th>Centre, Mon – Fri</th><td>{HOURS.center}</td></tr>
                <tr><th>Administration office</th><td>{HOURS.admin}</td></tr>
                <tr><th>Director’s office hours</th><td>{enDays(HOURS.director)}</td></tr>
              </tbody>
            </table>
            <h3 style={{ marginTop: 24 }}>Address</h3>
            <p>7 Petko Staynov Str.<br />9000 Varna, Bulgaria</p>
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
