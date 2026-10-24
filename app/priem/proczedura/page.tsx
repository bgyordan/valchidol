import PageHero from '../../components/PageHero';
import DocRows from '../../components/DocRows';
import AdmissionWizard from '../AdmissionWizard';
import { getDocuments } from '../../../lib/data';
import { getSiteInfo } from '../../../lib/siteinfo';

import { alternates } from '../../../lib/lang';

export const metadata = {
  alternates: alternates('/priem/proczedura'),
  title: 'Как се записва дете — ЦСОП Варна',
  description: 'Процедурата по прием в ЦСОП – Варна стъпка по стъпка: заявление, документи, становище на РЦПППО и записване.',
};
export const dynamic = 'force-dynamic';

export default async function ProcedurePage() {
  const { contact: CONTACT, hours: HOURS } = await getSiteInfo();
  const docs = await getDocuments('admission', true);
  return (
    <>
      <PageHero
        path="/priem/proczedura"
        page="priem"
        title="Как се записва дете"
        intro="Приемът е за деца и младежи със специални образователни потребности, насочени от РЦПППО – Варна. Процедурата има три етапа, които вървят поред."
      />
      <section className="section tone-orange">
        <div className="wrap split">
          <AdmissionWizard />
          <aside className="aside-box pr-before">
            <h3>Преди да дойдете</h3>
            <ul>
              {docs.length > 0 && <li><a href="#blanki">Изтеглете актуалните бланки</a> и ги попълнете предварително.</li>}
              <li>Документите се приемат в деловодството, в работни дни {HOURS.admin} ч.</li>
              <li><a href={CONTACT.maps} target="_blank" rel="noreferrer">{CONTACT.address}, Варна</a></li>
            </ul>
            <p className="pr-q">Въпроси по процедурата?</p>
            <p style={{ fontWeight: 600, fontSize: 'calc(18px * var(--fs, 1))' }}><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></p>
            <a className="btn btn-dark" style={{ marginTop: 16 }} href="/priem/poseshtenie">Елате на посещение</a>
          </aside>
        </div>
      </section>
      {docs.length > 0 && (
        <section className="section soft tone-orange" id="blanki">
          <div className="wrap">
            <h2>Още бланки и декларации</h2>
            <p className="muted" style={{ margin: '8px 0 16px' }}>Изтеглете, попълнете и донесете при записване.</p>
            <DocRows docs={docs} />
          </div>
        </section>
      )}
    </>
  );
}
