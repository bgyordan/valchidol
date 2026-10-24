import PageHero from '../../components/PageHero';
import PagePhotos from '../../components/PagePhotos';
import CopyText from '../../daritelstvo/CopyText';
import { getSiteInfo } from '../../../lib/siteinfo';
import { alternates } from '../../../lib/lang';

export const metadata = {
  title: 'Support us — CSOP Varna',
  description: 'Donations and partnerships for CSOP Varna: bank details, useful materials and joint initiatives.',
  alternates: alternates('/en/support-us'),
};

export default async function EnSupport() {
  const { bank: BANK } = await getSiteInfo();
  return (
    <>
      <PageHero
        lang="en"
        kicker="Support us"
        tone="orange"
        page="daritelstvo"
        title="Supporting the centre"
        intro="Donations and partnerships enrich the children’s learning and therapy environment – equipment, materials, the sensory room and our shared events."
      />
      <section className="section tone-orange">
        <div className="wrap grid-2">
          <div>
            <h2>Bank transfer</h2>
            <p className="muted" style={{ marginTop: 10 }}>{/настоятелство/i.test(BANK.to) ? 'Donations are made to the School Board of Trustees of the centre.' : 'Donations are made to the centre’s own bank account, in euro.'}</p>
            <div className="kv" style={{ marginTop: 18 }}>
              <div className="kv-row"><span>Recipient</span><b>{BANK.to}</b></div>
              <div className="kv-row"><span>IBAN</span><b><CopyText text={BANK.iban} lang="en" /></b></div>
              <div className="kv-row"><span>BIC</span><b>{BANK.bic}</b></div>
              {!/настоятелство/i.test(BANK.to) && <div className="kv-row"><span>Bank</span><b>Central Cooperative Bank (CCB)</b></div>}
              <div className="kv-row"><span>Reference</span><b>{BANK.reason}</b></div>
            </div>
            <p className="muted" style={{ marginTop: 14 }}>The reference may also be written in English, e.g. “Donation to CSOP Varna”.</p>
          </div>
          <div>
            <h2>Donating materials</h2>
            <p className="muted" style={{ marginTop: 10 }}>In our everyday work with the children we most often use:</p>
            <ul className="feature-list" style={{ marginTop: 18 }}>
              <li>art therapy materials – clay, paints, brushes, card;</li>
              <li>sensory and tactile aids for fine motor skills;</li>
              <li>supplies for the teaching kitchen;</li>
              <li>books with large illustrations and learning boards.</li>
            </ul>
            <p className="muted" style={{ marginTop: 14 }}>Before bringing materials, please get in touch – we will tell you what is currently useful.</p>
          </div>
        </div>
      </section>
      <section className="section tone-orange">
        <div className="wrap">
          <div className="donate-band">
            <div>
              <h2>An idea for a joint project or initiative?</h2>
              <p>We welcome partnerships with organisations, companies and parents. Write to us and we will discuss it.</p>
            </div>
            <a className="btn btn-primary" href="/en/contacts">Contact us</a>
          </div>
        </div>
      </section>
      <PagePhotos page="daritelstvo" title="Support us" heading="Made possible by our donors" />
    </>
  );
}
