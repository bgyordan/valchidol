import ContactForm from '../components/ContactForm';
import PageHero from '../components/PageHero';
import MapEmbed from './MapEmbed';
import { getSiteInfo } from '../../lib/siteinfo';

export const metadata = {
  title: 'Контакти — СУ „Васил Левски“ – Вълчи дол',
  description: 'Телефони, работно време, имейл и адрес на СУ „Васил Левски“ – гр. Вълчи дол, ул. „Георги Димитров“ № 1.',
};



// картата от страница „Контакти“ на стария сайт
const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.564536294747!2d27.5512316!3d43.404123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a5bc546f663f71%3A0x400a483486a42a0!2z0JLRitC70YfQuCDQtNC-0LsgOTI4MA!5e0!3m2!1sbg!2sbg!4v1715850000000!5m2!1sbg!2sbg';

export default async function ContactsPage() {
  const { contact: CONTACT, hours: HOURS, phones } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/kontakti"
        title="Контакти"
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
                <tr><th>Деловодство</th><td>{HOURS.admin}</td></tr>
                <tr><th>Приемно време на ръководството</th><td>{HOURS.director}</td></tr>
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
