import PageHero from '../../components/PageHero';
import PhotoBand from '../../components/PhotoBand';
import { getPagePhotos } from '../../../lib/data';

export const metadata = {
  title: 'Материална база — ЦСОП Варна',
  description:
    'Специализирана среда на ЦСОП – Варна: учебни кабинети, терапевтични зали, кулинарен кабинет и озеленен училищен двор.',
};

// Снимките на всяко пространство се избират от ЕИС (ключ = page).
const AREAS = [
  {
    page: 'baza-kabineti',
    title: 'Учебни кабинети',
    desc: 'Девет светли и спокойни учебни кабинета, приспособени към индивидуалните нужди на децата – с внимание към сензорния комфорт, достъпността и усещането за сигурност.',
    features: ['Ергономично обзавеждане', 'Интерактивни екрани', 'Адаптирани работни места', 'Спокойна цветова среда'],
    fallback: ['/nachalna/kabineti-1.jpg', '/nachalna/kabineti-2.jpg', '/nachalna/kabineti-3.jpg', '/nachalna/kabineti-4.jpg', '/nachalna/kabineti.jpg'],
  },
  {
    page: 'baza-terapiya',
    title: 'Терапевтични зали',
    desc: 'Сензорна Снузълен зала, логопедични кабинети и зали за психомоторика – пространства за успокояване, стимулация и развитие на всяко сетиво.',
    features: ['Сензорна Снузълен зала', 'Логопедични кабинети', 'Зала за психомоторика', 'Рехабилитационно оборудване'],
    fallback: ['/nachalna/terapiya-1.jpg'],
  },
  {
    page: 'baza-kuhnya',
    title: 'Кулинарен кабинет',
    desc: 'Оборудвана кухня за практически занимания по готварство и сладкарство, където децата стават по-самостоятелни и уверени в защитена среда.',
    features: ['Оборудвана учебна кухня', 'Безопасни уреди', 'Практика по готварство', 'Битови умения'],
    fallback: [],
  },
  {
    page: 'baza-dvor',
    title: 'Училищен двор',
    desc: 'Озеленен и обезопасен двор за игри на открито, спорт и градинарство – място за движение, отдих и радост под открито небе.',
    features: ['Обезопасена площадка', 'Зелена градина', 'Кътове за игра', 'Място за спорт'],
    fallback: [],
  },
];

export default async function MaterialnaBazaPage() {
  const photos = await Promise.all(AREAS.map((a) => getPagePhotos(a.page)));
  return (
    <>
      <PageHero
        path="/za-nas/materialna-baza"
        page="materialna-baza"
        title="Среда, създадена с грижа"
        intro="На ул. „Петко Стайнов“ 7 всяко пространство е обмислено за развитието, комфорта и безопасността на децата."
      />
      {AREAS.map((a, i) => {
        const ph = photos[i].length ? photos[i] : a.fallback;
        return (
          <section key={a.page} className={`section${i % 2 ? ' tint' : ''} tone-blue`}>
            <div className="wrap">
              <div className="split" style={{ marginBottom: ph.length ? 28 : 0 }}>
                <div className="prose-block">
                  <h2>{a.title}</h2>
                  <p>{a.desc}</p>
                </div>
                <ul className="feature-list">
                  {a.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <PhotoBand photos={ph} title={a.title} />
            </div>
          </section>
        );
      })}
    </>
  );
}
