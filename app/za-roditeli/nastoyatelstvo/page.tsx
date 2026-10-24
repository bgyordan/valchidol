import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';
import DocRows from '../../components/DocRows';

export const metadata = {
  title: 'Училищно настоятелство — ЦСОП Варна',
  description: 'Училищно настоятелство към ЦСОП – Варна: партньорство, благотворителни инициативи и родителска подкрепа за децата.',
};

export default function ParentsCouncilPage() {
  return (
    <>
      <PageHero
        path="/za-roditeli/nastoyatelstvo"
        page="nastoyatelstvo"
        title="Училищно настоятелство"
        intro="Заедно създаваме по-добра и по-топла среда за децата – с участието на родители, общественици и приятели на центъра."
      />
      <section className="section tone-orange">
        <div className="wrap split">
          <div className="prose-block">
            <h2>Партньори в развитието</h2>
            <p>
              Училищното настоятелство към ЦСОП – Варна е независима доброволна организация, която подпомага материалното,
              културното и социалното развитие на центъра.
            </p>
            <p>
              Чрез благотворителни базари, събития и дарителски кампании осигуряваме допълнителни специализирани материали,
              сензорни играчки и празнични подаръци за децата.
            </p>
            <h3>Как подкрепяме децата</h3>
            <ul>
              <li>Традиционни коледни и великденски благотворителни изложби</li>
              <li>Съдействие за екскурзии, адаптирани летни лагери и културни събития</li>
              <li>Кандидатстване по проекти и дарителски програми в полза на децата</li>
              <li>Взаимна подкрепа и обмен на опит между родителите</li>
            </ul>
          </div>
          <aside className="aside-box">
            <h3>Искате ли да се включите?</h3>
            <p className="muted">Всеки родител или приятел на децата е добре дошъл с идеи, умения или доброволчески труд.</p>
            <a className="btn btn-primary" style={{ marginTop: 16 }} href="/kontakti">Свържете се с нас</a>
          </aside>
        </div>
      </section>
      <section className="section tone-orange">
        <div className="wrap">
          <h2 style={{ marginBottom: 16 }}>Учредителни документи</h2>
          <DocRows
            docs={[
              { id: 'ustav', name: 'Устав на настоятелството', file_url: '/dokumenti/nastoyatelstvo/ustav.pdf' },
              { id: 'protokol', name: 'Учредителен протокол', file_url: '/dokumenti/nastoyatelstvo/uchreditelen-protokol.pdf' },
            ]}
          />
        </div>
      </section>
      <PagePhotos page="nastoyatelstvo" title="Настоятелство" heading="От нашите инициативи" />
    </>
  );
}
