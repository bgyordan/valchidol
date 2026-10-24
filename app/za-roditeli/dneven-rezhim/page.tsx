import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';
import ScheduleExplorer from '../ScheduleExplorer';

export const metadata = {
  title: 'Дневен режим — ЦСОП Варна',
  description: 'Дневен режим на учениците: форма на обучение, работно време и разписание на учебните часове в ЦСОП – Варна.',
};

export default function DailySchedulePage() {
  return (
    <>
      <PageHero
        path="/za-roditeli/dneven-rezhim"
        page="dneven-rezhim"
        title="Как минава денят при нас"
        intro="Ясният и предвидим ритъм на деня дава спокойствие и увереност на децата."
      />
      <section className="section tone-orange">
        <div className="wrap"><ScheduleExplorer /></div>
      </section>
      <PagePhotos page="dneven-rezhim" title="Дневен режим" heading="Моменти от деня" />
    </>
  );
}
