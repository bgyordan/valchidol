import PageHero from '../../components/PageHero';
import { getSiteInfo } from '../../../lib/siteinfo';
import { alternates } from '../../../lib/lang';

export const metadata = {
  title: 'Admission — CSOP Varna',
  description: 'How a child is enrolled at CSOP Varna, step by step: application, documents, assessment by the regional centre and enrolment. Visits can be arranged by phone.',
  alternates: alternates('/en/admission'),
};

const STEPS = [
  {
    when: 'Step 1',
    t: 'Submitting documents',
    d: (
      <>
        The child is enrolled in a mainstream school or kindergarten, and the parent submits an application for referral
        (form below), together with medical documents, court documents (if any), documents related to the child’s
        education and a decision of a medical expert committee (TELK / NELK / LKK).
      </>
    ),
  },
  {
    when: 'Step 2',
    t: 'Processing',
    d: (
      <>
        Within <strong>one month</strong> the documents are completed and sent to the Regional Centre for Support of the
        Process of Inclusive Education – Varna, with a reasoned opinion and a meeting record of the Team for Support of
        Personal Development, and an application from the head of the school or kindergarten.
      </>
    ),
  },
  {
    when: 'Step 3',
    t: 'Enrolment',
    d: (
      <>
        Once the regional centre issues its official opinion referring the child to us, you complete the final
        application for enrolment and the child joins the centre.
      </>
    ),
  },
];

export default async function EnAdmission() {
  const { contact: CONTACT, hours: HOURS } = await getSiteInfo();
  return (
    <>
      <PageHero
        lang="en"
        kicker="Admission"
        page="priem"
        tone="orange"
        title="How a child is enrolled"
        intro="Admission is for children and young people with special educational needs referred by the regional centre for inclusive education in Varna. The procedure has three steps that follow one another."
      />

      <section className="section tone-orange">
        <div className="wrap">
          <ol className="timeline">
            {STEPS.map((s) => (
              <li key={s.when}><span className="tl-when">{s.when}</span><h3>{s.t}</h3><p>{s.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tint tone-orange">
        <div className="wrap split">
          <div className="prose-block">
            <h2>Forms</h2>
            <p>The official forms are in Bulgarian. Download them, fill them in and bring them to the administration office.</p>
            <div className="btn-row" style={{ marginTop: 18 }}>
              <a className="btn btn-dark" href="/dokumenti/priem/zayavlenie-za-nasochvane.docx" download hrefLang="bg">Application for referral (BG)</a>
              <a className="btn btn-ghost" href="/dokumenti/priem/zayavlenie-za-zapisvane.docx" download hrefLang="bg">Application for enrolment (BG)</a>
            </div>
            <h2 style={{ marginTop: 40 }}>Come and visit us first</h2>
            <p>
              Choosing the right environment for your child matters. You are welcome to visit together at an arranged time,
              calmly and without hurry: the classrooms, the therapy and sensory rooms, the cookery room and the school yard.
              The visit is free and places you under no obligation.
            </p>
          </div>
          <aside className="aside-box">
            <h3>Before you come</h3>
            <ul className="feature-list">
              <li>Documents are accepted at the administration office on working days, {HOURS.admin}.</li>
              <li><a href={CONTACT.maps} target="_blank" rel="noreferrer">7 Petko Staynov Str., Varna</a></li>
            </ul>
            <p className="muted" style={{ marginTop: 16 }}>Questions, or would you like to arrange a visit?</p>
            <p style={{ fontWeight: 600, fontSize: 'calc(18px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <a className="btn btn-dark" style={{ marginTop: 16 }} href="/en/contacts">Address and map</a>
          </aside>
        </div>
      </section>
    </>
  );
}
