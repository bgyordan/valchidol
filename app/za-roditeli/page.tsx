import PageHero from '../components/PageHero';
import PagePhotos from '../components/PagePhotos';
import LinkList from '../components/LinkList';
import DocRows from '../components/DocRows';
import ScheduleExplorer from './ScheduleExplorer';
import { getDocuments } from '../../lib/data';
import { getSiteInfo } from '../../lib/siteinfo';

export const metadata = {
  title: 'За родители — ЦСОП Варна',
  description: 'Информация за родители: записване, дневен режим, консултации със специалисти, услуги и училищно настоятелство.',
};
export const dynamic = 'force-dynamic';

export default async function ParentsPage() {
  const { contact: CONTACT } = await getSiteInfo();
  const forms = await getDocuments('roditeli', true);
  return (
    <>
      <PageHero
        path="/za-roditeli"
        page="za-roditeli"
        title="Заедно в грижата за вашето дете"
        intro="Най-добрите резултати идват, когато семейството и екипът работят заедно – с доверие, редовна връзка и взаимна подкрепа."
      />

      <section className="section tone-orange">
        <div className="wrap">
          <LinkList
            cols={3}
            items={[
              { t: 'Как се записва дете', d: 'Стъпки, документи и бланки', href: '/priem/proczedura', icon: 'clipboard' },
              { t: 'Елате на посещение', d: 'Запознайте се с центъра', href: '/priem/poseshtenie', icon: 'calendar' },
              { t: 'Дневен режим', d: 'Часове и организация на деня', href: '/za-roditeli/dneven-rezhim', icon: 'clock' },
              { t: 'Административни услуги', d: 'Бележки, удостоверения, заявления', href: '/za-roditeli/uslugi', icon: 'doc' },
              { t: 'Ресурси за родители', d: 'Материали и подкрепа за вкъщи', href: '/za-roditeli/resursi', icon: 'heart' },
              { t: 'Училищно настоятелство', d: 'Родителите като партньори', href: '/za-roditeli/nastoyatelstvo', icon: 'users' },
            ]}
          />
        </div>
      </section>

      <section className="section soft tone-orange">
        <div className="wrap">
          <div className="sec-head"><h2>Дневен режим</h2></div>
          <ScheduleExplorer />
        </div>
      </section>

      <section className="section tone-orange">
        <div className="wrap split">
          <div>
            <h2 style={{ marginBottom: 16 }}>Бланки за родители</h2>
            {forms.length === 0 ? <p className="empty">Бланките предстои да бъдат публикувани.</p> : <DocRows docs={forms} />}
          </div>
          <aside className="aside-box">
            <h3>Нужна ви е консултация?</h3>
            <p className="muted">Логопедите, психолозите и специалните педагози са на разположение за лични срещи. Обадете се в деловодството, за да уговорите час.</p>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 'calc(18px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <a className="btn btn-primary" style={{ marginTop: 16 }} href="/kontakti">Всички контакти</a>
          </aside>
        </div>
      </section>

      <PagePhotos page="za-roditeli" title="За родители" heading="От живота в центъра" />
    </>
  );
}
