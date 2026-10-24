import PageHero from '../../components/PageHero';
import BudgetBrowser from './BudgetBrowser';
import { getDocuments } from '../../../lib/data';

export const metadata = {
  title: 'Бюджет и финанси — ЦСОП Варна',
  description: 'Утвърден бюджет и отчети за изпълнението му – финансовата прозрачност на ЦСОП – Варна.',
};
export const dynamic = 'force-dynamic';

export default async function BudgetPage() {
  const docs = await getDocuments('budget');
  return (
    <>
      <PageHero
        path="/za-nas/byudzhet-i-finansi"
        title="Бюджет и финанси"
        intro="Утвърденият бюджет на центъра и отчетите за изпълнението му, подредени по години."
      />
      <section className="section tone-blue">
        <div className="wrap split">
          <BudgetBrowser docs={docs} />
          <aside className="aside-box">
            <h3>Какво ще намерите</h3>
            <ul className="feature-list">
              <li><span><strong>Утвърден бюджет</strong> за годината с основните приходи и разходи</span></li>
              <li><span><strong>Отчети за изпълнение</strong> – периодични и годишни</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
