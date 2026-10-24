import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';
import { getSiteInfo } from '../../../lib/siteinfo';
import { alternates } from '../../../lib/lang';
import '../../obuchenie-i-podkrepa/podkrepa.css';

export const metadata = {
  title: 'Services — CSOP Varna',
  description:
    'What CSOP Varna offers: education to an individual plan, speech and language therapy, psychological support, occupational therapy, physiotherapy, full-day care and work with families.',
  alternates: alternates('/en/services'),
};

const SERVICES = [
  { t: 'Education to an individual plan', who: 'Teachers and teaching assistants', d: 'Every child learns according to their own plan, drawn up by the team to match their abilities and needs. We work at a pace the child can follow.' },
  { t: 'Speech and language therapy', who: 'Speech and language therapists', d: 'Support for speech, language and communication – including alternative ways of communicating when spoken language is difficult.' },
  { t: 'Psychological support', who: 'Psychologists and a clinical psychologist', d: 'Working with emotions, behaviour and relationships with others. Our psychologists also advise parents.' },
  { t: 'Occupational therapy', who: 'Occupational therapist', d: 'Everyday skills – eating, dressing, using the hands – for more independence at home and in the classroom.' },
  { t: 'Rehabilitation and physiotherapy', who: 'Rehabilitation therapists and a physiotherapist', d: 'Movement therapy and exercises for strength, balance and mobility, tailored to each child.' },
  { t: 'Full-day care', who: 'Educators', d: 'After lessons the children stay with us for activities, play and rest. The building is open until 18:00.' },
  { t: 'Working with families', who: 'The whole team', d: 'Parents are part of the team. Our specialists meet you, share the child’s progress and give guidance for working at home.' },
];

export default async function EnServices() {
  const { contact: CONTACT } = await getSiteInfo();
  return (
    <>
      <PageHero
        lang="en"
        kicker="Services"
        page="obuchenie-i-podkrepa"
        tone="blue"
        title="Education and support"
        intro="Teachers, speech therapists, psychologists and therapists work together on each child’s individual plan – in the classroom, in the therapy rooms and in the sensory room."
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
            <h2>How work with a child begins</h2>
            <p className="muted" style={{ marginTop: 12, maxWidth: '36em' }}>
              A child is referred to the centre by the Regional Centre for Support of the Process of Inclusive Education
              in Varna. After enrolment, our team prepares the child’s individual plan and decides which specialists will
              work with them and how often.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a className="btn btn-dark" href="/en/admission">How to enrol a child</a>
              <a className="btn btn-ghost" href="/en/contacts">Contact us</a>
            </div>
          </div>
          <aside className="aside-box">
            <h3>Would you like to talk to a specialist?</h3>
            <p className="muted">Call the administration office and we will arrange a meeting.</p>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 'calc(18px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
          </aside>
        </div>
      </section>

      <PagePhotos page="obuchenie-i-podkrepa" title="Education and support" heading="From our classrooms and therapy rooms" />
    </>
  );
}
