import PageHero from '../components/PageHero';
import PagePhotos from '../components/PagePhotos';
import CopyText from './CopyText';
import { getSiteInfo } from '../../lib/siteinfo';

import { alternates } from '../../lib/lang';

export const metadata = {
  alternates: alternates('/daritelstvo'),
  title: 'Дарителство — ЦСОП Варна',
  description: 'Дарения и партньорства за ЦСОП – Варна: банкова сметка, полезни материали и съвместни инициативи.',
};


export default async function DonatePage() {
  const { bank: BANK } = await getSiteInfo();
  return (
    <>
      <PageHero
        tone="orange"
        page="daritelstvo"
        title="Подкрепа за центъра"
        intro="Даренията и партньорствата обогатяват учебната и терапевтичната среда на децата — оборудване, материали, сензорната зала и общите ни събития."
      />
      <section className="section tone-orange">
        <div className="wrap grid-2">
          <div>
            <h2>Дарение по банков път</h2>
            <p className="muted" style={{ marginTop: 10 }}>{/настоятелство/i.test(BANK.to) ? 'Целевото дарение се превежда на Училищното настоятелство към центъра.' : 'Дарението се превежда по сметката на центъра, в евро.'}</p>
            <div className="kv" style={{ marginTop: 18 }}>
              <div className="kv-row"><span>Получател</span><b>{BANK.to}</b></div>
              <div className="kv-row"><span>IBAN</span><b><CopyText text={BANK.iban} /></b></div>
              <div className="kv-row"><span>BIC</span><b>{BANK.bic}</b></div>
              {!/настоятелство/i.test(BANK.to) && <div className="kv-row"><span>Банка</span><b>Централна кооперативна банка</b></div>}
              <div className="kv-row"><span>Основание</span><b>{BANK.reason}</b></div>
            </div>
          </div>
          <div>
            <h2>Дарение на материали</h2>
            <p className="muted" style={{ marginTop: 10 }}>В ежедневната работа с децата най-често използваме:</p>
            <ul className="feature-list" style={{ marginTop: 18 }}>
              <li>материали за арт терапия — глина, бои, четки, картони;</li>
              <li>сензорни и тактилни пособия за фината моторика;</li>
              <li>консумативи за учебния кулинарен кабинет;</li>
              <li>книжки с едри илюстрации и учебни табла.</li>
            </ul>
            <p className="muted" style={{ marginTop: 14 }}>Преди да донесете материали, се свържете с нас — ще ви кажем кое е актуално в момента.</p>
          </div>
        </div>
      </section>
      <section className="section tone-orange">
        <div className="wrap">
          <div className="donate-band">
            <div>
              <h2>Идея за съвместен проект или инициатива?</h2>
              <p>Отворени сме за партньорства с организации, фирми и родители. Пишете ни и ще я обсъдим.</p>
            </div>
            <a className="btn btn-primary" href="/kontakti">Свържете се с нас</a>
          </div>
        </div>
      </section>
      <PagePhotos page="daritelstvo" title="Дарителство" heading="Реализирано с подкрепата на дарители" />
    </>
  );
}
