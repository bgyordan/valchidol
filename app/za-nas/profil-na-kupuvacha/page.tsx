import PageHero from '../../components/PageHero';

export const metadata = {
  title: 'Профил на купувача — ЦСОП Варна',
  description:
    'Профилът на купувача на Център за специална образователна подкрепа – Варна се поддържа в ЦАИС ЕОП съгласно Закона за обществените поръчки.',
};

const BUYER_URL = 'https://app.eop.bg/buyer/27583';

export default function ProfilNaKupuvachaPage() {
  return (
    <>
      <PageHero
        path="/za-nas/profil-na-kupuvacha"
        title="Профил на купувача"
        intro="Обществените поръчки на центъра се провеждат и публикуват в Централизираната автоматизирана информационна система „Електронни обществени поръчки“ (ЦАИС ЕОП)."
      />
      <section className="section tone-blue">
        <div className="wrap split">
          <div className="prose-block">
            <p className="prose-lead">
              От 1 януари 2020 г., съгласно Закона за обществените поръчки, обществените поръчки, пазарните консултации
              и цялата свързана документация се публикуват електронно в ЦАИС ЕОП.
            </p>
            <h2>Какво ще намерите там</h2>
            <ul>
              <li>текущи и приключили процедури за обществени поръчки;</li>
              <li>възложени договори и документите по процедурите;</li>
              <li>решения и съобщения на възложителя;</li>
              <li>участници и избрани изпълнители, когато информацията е публична;</li>
              <li>информация за изпълнението на договорите.</li>
            </ul>
            <p>За въпроси по конкретна процедура използвайте модула за комуникация в самата система.</p>
          </div>
          <aside className="aside-box">
            <h3>Профилът на ЦСОП Варна</h3>
            <p className="muted" style={{ overflowWrap: 'anywhere' }}>{BUYER_URL}</p>
            <a className="btn btn-dark" style={{ marginTop: 16 }} href={BUYER_URL} target="_blank" rel="noopener noreferrer">
              Отвори в ЦАИС ЕОП
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
