import PageHero from '../components/PageHero';
import PagePhotos from '../components/PagePhotos';
import { getSiteInfo } from '../../lib/siteinfo';
import './podkrepa.css';

import { alternates } from '../../lib/lang';

export const metadata = {
  alternates: alternates('/obuchenie-i-podkrepa'),
  title: 'Обучение и подкрепа — ЦСОП Варна',
  description:
    'Какво предлага ЦСОП – Варна: обучение по индивидуален план, логопедична и психологическа подкрепа, ерготерапия, рехабилитация и кинезитерапия, целодневна организация и работа със семейството.',
};
export const dynamic = 'force-dynamic';

// Специалностите отговарят на екипа (Екип → Терапевти и специалисти).
// Ако услуга се добави или промени, текстът се сменя тук.
const SERVICES = [
  {
    t: 'Обучение по индивидуален план',
    who: 'Учители и помощник-учители',
    d: 'Всяко дете учи по собствен план, изготвен от екипа според неговите възможности и потребности. Работим с темпо, което детето може да следва.',
  },
  {
    t: 'Логопедична терапия',
    who: 'Логопеди',
    d: 'Подкрепа за речта, езика и общуването – включително с алтернативни начини за комуникация, когато говоримата реч е трудна.',
  },
  {
    t: 'Психологическа подкрепа',
    who: 'Психолози и клиничен психолог',
    d: 'Работа с емоциите, поведението и общуването с другите. Психолозите консултират и родителите.',
  },
  {
    t: 'Ерготерапия',
    who: 'Ерготерапевт',
    d: 'Умения за ежедневието – хранене, обличане, работа с ръцете – за повече самостоятелност у дома и в класната стая.',
  },
  {
    t: 'Рехабилитация и кинезитерапия',
    who: 'Рехабилитатори и кинезитерапевт',
    d: 'Двигателна терапия и упражнения за сила, равновесие и движение според нуждите на всяко дете.',
  },
  {
    t: 'Целодневна организация',
    who: 'Възпитатели',
    d: 'След учебните часове децата остават при нас за занимания, игра и почивка. Сградата е отворена до 18:00 ч.',
  },
  {
    t: 'Работа със семейството',
    who: 'Целият екип',
    d: 'Родителите са част от екипа. Специалистите се срещат с вас, споделят напредъка и дават насоки за работа у дома.',
  },
];

export default async function SupportPage() {
  const { contact: CONTACT } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/obuchenie-i-podkrepa"
        page="obuchenie-i-podkrepa"
        title="Обучение и подкрепа"
        intro="Учители, логопеди, психолози и терапевти работят заедно по индивидуалния план на всяко дете – в класната стая, в терапевтичните кабинети и в сензорната зала."
      />

      <section className="section">
        <div className="wrap">
          <ul className="sv-list">
            {SERVICES.map((s) => (
              <li key={s.t}>
                <h2>{s.t}</h2>
                <div>
                  <p>{s.d}</p>
                  <p className="sv-who">{s.who}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap split">
          <div>
            <h2>Как започва работата с детето</h2>
            <p className="muted" style={{ marginTop: 12, maxWidth: '36em' }}>
              Детето се насочва към центъра от РЦПППО – Варна. След записване екипът изготвя неговия индивидуален план и
              решава кои специалисти ще работят с него и колко често.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a className="btn btn-dark" href="/priem/proczedura">Как се записва дете</a>
              <a className="btn btn-ghost" href="/za-nas/ekip">Запознайте се с екипа</a>
            </div>
          </div>
          <aside className="aside-box">
            <h3>Искате да поговорите със специалист?</h3>
            <p className="muted">Обадете се в деловодството и ще уговорим среща.</p>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 'calc(18px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
          </aside>
        </div>
      </section>

      <PagePhotos page="obuchenie-i-podkrepa" title="Обучение и подкрепа" heading="От кабинетите и класните стаи" />
    </>
  );
}
