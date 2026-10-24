import PageHero from '../../components/PageHero';
import DocsBrowser from '../../components/DocsBrowser';
import { getDocuments } from '../../../lib/data';

export const metadata = {
  title: 'Документи — ЦСОП Варна',
  description: 'Стратегия, правилници, програми и вътрешни правила на ЦСОП – Варна.',
};
export const dynamic = 'force-dynamic';

export default async function DocsPage() {
  const docs = await getDocuments('internal', true);
  return (
    <>
      <PageHero
        path="/za-nas/dokumenti-v-tsop"
        title="Документи в ЦСОП"
        intro="Стратегията, правилниците, програмите и вътрешните правила, по които работи центърът. Документите се обновяват при всяка промяна."
      />
      <section className="section tone-blue">
        <div className="wrap">
          <DocsBrowser docs={docs} />
        </div>
      </section>
    </>
  );
}
