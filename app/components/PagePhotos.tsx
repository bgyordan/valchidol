import { getPagePhotos } from '../../lib/data';
import PhotoBand from './PhotoBand';

/**
 * Снимки за дадена страница — качват се от ЕИС („Снимки за сайта“ → избор на страница).
 * Първата е в заглавието (PageHero), тук се показват всички. Ако няма снимки — нищо.
 */
export default async function PagePhotos({ page, title, heading = 'Снимки' }: { page: string; title?: string; heading?: string }) {
  const photos = await getPagePhotos(page);
  if (photos.length === 0) return null;
  return (
    <section className="section">
      <div className="wrap">
        <h2 style={{ marginBottom: 24 }}>{heading}</h2>
        <PhotoBand photos={photos} title={title} />
      </div>
    </section>
  );
}
