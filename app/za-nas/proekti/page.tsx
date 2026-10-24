import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';

export const metadata = {
  title: 'Проекти и национални програми — ЦСОП Варна',
  description:
    'Проекти на ЦСОП – Варна: STEM център по НПВУ (BG-RRP-1.015) и национални програми на МОН за безопасност на движението и достъпна образователна среда.',
};

type Project = {
  tag: string; agency: string; title: string; status: string; statusTone: string; featured: boolean; desc: string;
  sections?: { title: string; text: string }[]; highlights?: string[];
};

const projects: Project[] = [
  {
    tag: 'BG-RRP-1.015 · НПВУ',
    agency: 'Национален план за възстановяване и устойчивост · NextGenerationEU',
    title: 'Изграждане на училищна STEM среда в ЦСОП – гр. Варна',
    status: 'Реализира се / В изпълнение',
    statusTone: 'active',
    featured: true,
    desc: 'Мащабен проект по процедура BG-RRP-1.015 „Изграждане на училищна STEM среда“ за създаване на интегриран, достъпен и иновативен STEM център, специално съобразен с индивидуалните образователни, сензорни и терапевтични потребности на учениците в ЦСОП – Варна.',
    sections: [
      {
        title: 'Изследователска лаборатория по природни науки',
        text: 'Пространство за практически опити, тактилно и визуално изследване на природата, адаптирани микроскопи и интерактивни модели.',
      },
      {
        title: 'Класна стая за креативни и дигитални създатели',
        text: 'Високотехнологични работни станции, сензорни дисплеи, специализиран софтуер за когнитивно развитие и елементи за виртуална реалност (VR).',
      },
      {
        title: 'Учебна практическа работилница / Makerspace',
        text: 'Зона за 3D принтиране, конструиране, приложно майсторене и усвояване на практически умения за самостоятелен живот и бъдеща трудова реализация.',
      },
      {
        title: 'Адаптирана среда за деца от аутистичния спектър',
        text: 'Сензорно балансирано осветление, ергономични мебели и зона за релаксация и социално взаимодействие.',
      },
    ],
  },
  {
    tag: 'НП БДП · МОН',
    agency: 'Министерство на образованието и науката (МОН)',
    title: 'Национална програма „Безопасност на движението по пътищата“',
    status: 'Спечелен проект',
    statusTone: 'active',
    featured: false,
    desc: 'Спечелен проект за създаване на интерактивна и безопасна среда за ранно обучение и изграждане на практическо поведение на пътя при ученици със специални образователни потребности.',
    highlights: [
      'Оборудване на специализирана учебна площадка по БДП с хоризонтална маркировка',
      'Интерактивна светофарна уредба, реални умалени пътни знаци и обучителни помагала',
      'Симулационни и ситуационни игри за уверено ориентиране и безопасно придвижване в градска среда',
    ],
  },
  {
    tag: 'НП Среда · МОН',
    agency: 'Министерство на образованието и науката (МОН)',
    title: 'НП „Осигуряване на съвременна, сигурна и достъпна образователна среда“',
    status: 'Реализиран / Действащ',
    statusTone: 'active',
    featured: false,
    desc: 'Мерки за непрекъснато подобряване на физическата и терапевтична среда, достъпността и рехабилитационния капацитет на центъра.',
    highlights: [
      'Модернизация на кабинетите по кинезитерапия и релационна психомоторика',
      'Обогатяване на ергономичното и рехабилитационно оборудване за двигателно развитие',
      'Осигуряване на сигурна, комфортна и стимулираща материална база за децата',
    ],
  },
];

export default function ProjectsPage() {
  const [main, ...rest] = projects;
  return (
    <>
      <PageHero
        path="/za-nas/proekti"
        page="proekti"
        title="Проекти и национални програми"
        intro="Участваме в Националния план за възстановяване и устойчивост и в национални програми на МОН за модерна и достъпна среда."
      />

      <section className="section tone-blue">
        <div className="wrap">
          <article className="project feat">
            <p className="pj-meta"><span className="tag">{main.tag}</span><span>{main.status}</span></p>
            <h2>{main.title}</h2>
            <p className="pj-agency">{main.agency}</p>
            <p className="pj-desc">{main.desc}</p>
            {main.sections && (
              <div className="grid-2 pj-parts">
                {main.sections.map((x) => (
                  <div key={x.title}><h3>{x.title}</h3><p>{x.text}</p></div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>

      <PagePhotos page="proekti" title="Проекти" heading="Снимки от проектите" />

      <section className="section tint tone-blue">
        <div className="wrap grid-2">
          {rest.map((p) => (
            <article key={p.title} className="project">
              <p className="pj-meta"><span className="tag">{p.tag}</span><span>{p.status}</span></p>
              <h2>{p.title}</h2>
              <p className="pj-agency">{p.agency}</p>
              <p className="pj-desc">{p.desc}</p>
              {p.highlights && (
                <ul className="feature-list">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
