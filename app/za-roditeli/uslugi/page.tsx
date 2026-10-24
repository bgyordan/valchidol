import PageHero from '../../components/PageHero';

export const metadata = {
  title: 'Административни услуги — ЦСОП Варна',
  description: 'Административни услуги за родители в ЦСОП – Варна: психолого-педагогическа характеристика и служебна бележка – заявления и срокове.',
};

const FORM_BASE = '/dokumenti/uslugi';
const SERVICES = [
  { t: 'Психолого-педагогическа характеристика', days: 5, form: `${FORM_BASE}/zayavlenie-za-psihologo-pedagogicheska-harakteristika.docx` },
  { t: 'Служебна бележка', days: 3, form: `${FORM_BASE}/zayavlenie-za-sluzhebna-belezhka.docx` },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        path="/za-roditeli/uslugi"
        title="Административни услуги"
        intro="След заявление от родителя центърът издава следните документи в посочените срокове."
      />
      <section className="section tone-orange">
        <div className="wrap">
          <ul className="services">
            {SERVICES.map((s) => (
              <li key={s.t}>
                <div>
                  <h2>{s.t}</h2>
                  <p className="muted">Срок за издаване: <strong>{s.days} работни дни</strong></p>
                </div>
                <a className="btn btn-ghost" href={s.form} download>Изтегли заявлението</a>
              </li>
            ))}
          </ul>
          <p className="prose-note">
            Бланките може да изтеглите оттук или да получите на място от груповия ръководител на ученика.
          </p>
        </div>
      </section>
    </>
  );
}
