import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';
import { getSiteInfo } from '../../../lib/siteinfo';

export const metadata = {
  title: 'Елате на посещение — ЦСОП Варна',
  description: 'Заповядайте на безплатна опознавателна обиколка на ЦСОП – Варна заедно с детето си. Разгледайте кабинетите и се запознайте с екипа.',
};

export default async function VisitPage() {
  const { contact: CONTACT } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/priem/poseshtenie"
        page="poseshtenie"
        title="Елате да се запознаем"
        intro="Изборът на среда за детето е важен. Каним ви да ни посетите заедно в уговорен час, спокойно и без бързане."
      />
      <section className="section tone-orange">
        <div className="wrap split">
          <div className="prose-block">
            <h2>Какво ще видите</h2>
            <p>По време на обиколката ще разгледате мястото, където детето ще учи и ще работи със специалистите:</p>
            <ul>
              <li>учебните кабинети;</li>
              <li>терапевтичните зали и сензорната зала;</li>
              <li>кабинета по готварство;</li>
              <li>училищния двор.</li>
            </ul>
            <p>Посещението е безплатно и не ви задължава с нищо. Повече за средата има на страница <a href="/za-nas/materialna-baza">Материална база</a>.</p>
          </div>
          <aside className="aside-box">
            <h3>Уговорете час</h3>
            <p className="muted">Обадете се в деловодството и ще изберем ден и час, в който детето да опознае средата без шум.</p>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 'calc(19px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <p className="muted" style={{ overflowWrap: 'anywhere' }}>{CONTACT.email}</p>
            <a className="btn btn-dark" style={{ marginTop: 16 }} href="/kontakti">Адрес и карта</a>
          </aside>
        </div>
      </section>
      <PagePhotos page="poseshtenie" title="Посещение" heading="Как изглежда при нас" />
    </>
  );
}
