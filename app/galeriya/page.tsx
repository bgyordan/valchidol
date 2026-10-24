import PageHero from '../components/PageHero';
import GalleryClient from './GalleryClient';
import { getGallery } from '../../lib/data';
import './gallery.css';

export const metadata = {
  title: 'Галерия — ЦСОП Варна',
  description: 'Снимки от събития, ателиета, празници и ежедневието на децата и екипа в ЦСОП – Варна.',
};
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const { albums, photos } = await getGallery();
  return (
    <>
      <PageHero path="/galeriya" title="Галерия" intro="Снимки от събития, ателиета, празници и обикновените дни при нас." />
      <section className="section tone-lime">
        <GalleryClient albums={albums} photos={photos} />
      </section>
    </>
  );
}
