import PageHero from '../components/PageHero';
import NewsClient from './NewsClient';
import { getNews } from '../../lib/data';
import './novini.css';

export const metadata = {
  title: 'Новини — СУ „Васил Левски“ – Вълчи дол',
  description: 'Събития, празници, съобщения и истории от живота на учениците и учителите в СУ „Васил Левски“ – гр. Вълчи дол.',
};
export const dynamic = 'force-dynamic';

export default async function NewsArchivePage() {
  const posts = await getNews();
  return (
    <>
      <PageHero path="/novini" title="Новини" />
      <section className="section tone-lime">
        <div className="wrap"><NewsClient posts={posts} /></div>
      </section>
    </>
  );
}
