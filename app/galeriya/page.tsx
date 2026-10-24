import PageHero from '../components/PageHero';
import GalleryClient from './GalleryClient';
import { getGallery } from '../../lib/data';
import './gallery.css';

export const metadata = {
  title: 'Галерия — СУ „Васил Левски“ – Вълчи дол',
  description: 'Снимки от събития, празници и ежедневието в СУ „Васил Левски“ – гр. Вълчи дол.',
};
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const { albums, photos } = await getGallery();
  return (
    <>
      <PageHero path="/galeriya" title="Галерия" />
      <section className="section tone-lime">
        <GalleryClient albums={albums} photos={photos} />
      </section>
    </>
  );
}
