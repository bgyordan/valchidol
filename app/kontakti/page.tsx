import ContactForm from '../components/ContactForm';
import PageHero from '../components/PageHero';
import MapEmbed from './MapEmbed';
import { getSiteInfo } from '../../lib/siteinfo';

import { alternates } from '../../lib/lang';

export const metadata = {
  alternates: alternates('/kontakti'),
  title: 'Контакти — ЦСОП Варна',
  description: 'Телефони, работно време, имейл и адрес на Център за специална образователна подкрепа – Варна, ул. „Петко Стайнов“ 7.',
};



const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.18841078835!2d27.897481!3d43.225869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a4548a1b90abe7%3A0x74a7a17d27cf65ee!2z0YPQuy4g4oCe0J_QtdGC0LrQviDQodGC0LDQudC90L7QstKAnCA3LCA5MDA5INCh0LXQstC10YDQvdCwINC_0YDQvtC80LjRiNC70LXQvdCwINC30L7QvdCwLCDQktCw0YDQvdCw!5e0!3m2!1sbg!2sbg!4v1674036920647!5m2!1sbg!2sbg';

export default async function ContactsPage() {
  const { contact: CONTACT, hours: HOURS, phones } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/kontakti"
        title="Контакти"
        intro="Обадете се, пишете ни или заповядайте на място. Ще отговорим на въпросите ви и ще помогнем."
      />
      <section className="section tone-blue">
        <div className="wrap split">
          <div>
            <h2 style={{ marginBottom: 12 }}>Телефони</h2>
            <ul className="phones">
              {phones.map((p) => (
                <li key={p.name + p.phone}>
                  <span><b>{p.name}</b><span className="muted">{p.role}</span></span>
                  <a href={p.href}>{p.phone}</a>
                </li>
              ))}
            </ul>
            <h2 style={{ margin: '36px 0 12px' }}>Имейл</h2>
            <p className="big-line"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          </div>
          <aside className="aside-box">
            <h3>Работно време</h3>
            <table className="facts hours">
              <tbody>
                <tr><th>Център, пон – пет</th><td>{HOURS.center}</td></tr>
                <tr><th>Администрация и деловодство</th><td>{HOURS.admin}</td></tr>
                <tr><th>Приемно време на директора</th><td>{HOURS.director}</td></tr>
              </tbody>
            </table>
            <h3 style={{ marginTop: 24 }}>Адрес</h3>
            <p>{CONTACT.address}<br />{CONTACT.city}</p>
          </aside>
        </div>
      </section>
      <section className="section tone-blue" id="pishete-ni">
        <div className="wrap cf-wrap">
          <ContactForm lang="bg" email={CONTACT.email} />
        </div>
      </section>
      <section className="section tone-blue">
        <div className="wrap">
          <MapEmbed src={MAP_SRC} link={CONTACT.maps} />
        </div>
      </section>
    </>
  );
}
