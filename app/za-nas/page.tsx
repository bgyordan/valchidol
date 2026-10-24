import PageHero from '../components/PageHero';
import PagePhotos from '../components/PagePhotos';
import LinkList from '../components/LinkList';
import { getSiteInfo } from '../../lib/siteinfo';

export const metadata = {
  title: 'За нас — ЦСОП Варна',
  description:
    'Център за специална образователна подкрепа – Варна: мисия, история и ценностите, които водят ежедневната ни работа с деца и младежи.',
};

const VALUES = [
  { t: 'Приемане', d: 'Всяко дете е добре дошло такова, каквото е – със своя ритъм, характер и начин да опознава света.' },
  { t: 'Индивидуалност', d: 'Работим по личен план за всеки ученик, изготвен от екип специалисти според неговите нужди.' },
  { t: 'Заедно', d: 'Родители, учители и терапевти сме един екип. Развитието на детето е обща грижа и обща радост.' },
  { t: 'Посока', d: 'Не бързаме. Вярваме, че посоката, в която се движим, е по-важна от скоростта, с която го правим.' },
];

const PATH = [
  { when: '1949 г.', t: 'Помощно училище „Братя Миладинови“', d: 'Във Варна започва институционалната грижа за деца със специални образователни потребности.' },
  { when: '2017 г.', t: 'Център за специална образователна подкрепа', d: 'Училището се преобразува в ЦСОП по Закона за предучилищното и училищното образование, с диагностична, терапевтична и професионална подкрепа.' },
  { when: 'Днес', t: 'Над 150 деца и младежи', d: 'Всеки ден повече от 150 деца и младежи се обучават и получават терапия при нас, водени от екип специалисти.' },
];

export default async function AboutPage() {
  const { contact: CONTACT, hours: HOURS } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/za-nas"
        page="za-nas"
        title="Място, където всяко дете получава своя ритъм"
        intro="Център за специална образователна подкрепа – Варна предоставя обучение, специализирана подкрепа и рехабилитация в безопасна, стимулираща и приемаща среда."
      />

      <section className="section tone-blue">
        <div className="wrap split">
          <div className="prose-block">
            <h2>Подкрепяме развитието, уважаваме личността</h2>
            <p>
              Съществуваме, за да могат децата и техните семейства да изживеят пълноценно своя личен и социален живот.
              Съчетаваме диагностична, терапевтична и образователна подкрепа под един покрив.
            </p>
            <p>
              Всяко дете при нас работи по индивидуален план, а всеки малък успех – първата изречена дума, първата
              самостоятелна крачка, първата глинена чаша – е триумф, който празнуваме заедно.
            </p>
          </div>
          <aside className="aside-box">
            <h3>Накратко</h3>
            <table className="facts">
              <tbody>
                <tr><th>Деца и младежи</th><td>над 150</td></tr>
                <tr><th>Специалисти</th><td>над 40</td></tr>
                <tr><th>С децата на Варна</th><td>от 1949 г.</td></tr>
                <tr><th>Адрес</th><td>{CONTACT.address}, Варна</td></tr>
                <tr><th>Работно време</th><td>пон – пет, {HOURS.center}</td></tr>
              </tbody>
            </table>
          </aside>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap">
          <div className="sec-head"><h2>Това, в което вярваме</h2></div>
          <div className="vals">
            {VALUES.map((v) => (
              <div key={v.t} className="val"><h3>{v.t}</h3><p>{v.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tone-blue">
        <div className="wrap">
          <div className="sec-head">
            <h2>Нашият път</h2>
            <a className="more" href="/za-nas/istoriya">Цялата история</a>
          </div>
          <ol className="timeline">
            {PATH.map((p) => (
              <li key={p.when}><span className="tl-when">{p.when}</span><h3>{p.t}</h3><p>{p.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <PagePhotos page="za-nas" title="ЦСОП Варна" heading="От живота в центъра" />

      <section className="section tone-blue">
        <div className="wrap">
          <div className="sec-head"><h2>Още за центъра</h2></div>
          <LinkList
            cols={3}
            items={[
              { t: 'История', d: 'Пътят на центъра през годините', href: '/za-nas/istoriya', icon: 'history' },
              { t: 'Екип', d: 'Специалистите при нас', href: '/za-nas/ekip', icon: 'users' },
              { t: 'Материална база', d: 'Кабинети, зали и двор', href: '/za-nas/materialna-baza', icon: 'building' },
              { t: 'Проекти', d: 'Програми и инициативи', href: '/za-nas/proekti', icon: 'bulb' },
              { t: 'Кариери', d: 'Свободни позиции', href: '/za-nas/karieri', icon: 'briefcase' },
              { t: 'Прозрачност', d: 'Бюджет, документи, поръчки', href: '/prozrachnost', icon: 'doc' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
