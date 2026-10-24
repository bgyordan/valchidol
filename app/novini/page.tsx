import PageHero from '../components/PageHero';
import NewsClient from './NewsClient';
import { getNews } from '../../lib/data';
import './novini.css';

export const metadata = {
  title: 'Новини — ЦСОП Варна',
  description: 'Събития, празници, съобщения и истории от ежедневието на децата и екипа в ЦСОП – Варна.',
};
export const dynamic = 'force-dynamic';

export default async function NewsArchivePage() {
  const posts = await getNews();
  return (
    <>
      <PageHero path="/novini" title="Какво се случва при нас" intro="Събития, празници, съобщения и малки истории от ежедневието на децата и екипа." />
      <section className="section tone-lime">
        <div className="wrap"><NewsClient posts={posts} /></div>
      </section>
    </>
  );
}
