import PageHero from '../components/PageHero';
import BazaClient from './BazaClient';
import { getSpaces, SPACE_ICONS } from '../../lib/baza';
import './baza.css';

export const metadata = {
  alternates: { canonical: '/materialna-baza' },
  title: 'Материална база — СУ „Васил Левски“ – Вълчи дол',
  description: 'STEM център, класни стаи и кабинети, физкултурни салони, актова зала, работилници и библиотека на СУ „Васил Левски“ – гр. Вълчи дол. Снимки и 360° разходка.',
};
export const dynamic = 'force-dynamic';

export default async function BazaPage() {
  const spaces = await getSpaces();
  const icons = Object.fromEntries(SPACE_ICONS.map((i) => [i.key, i.d]));
  return (
    <>
      <PageHero path="/materialna-baza" title="Материална база" />
      <section className="section">
        <div className="wrap">
          <BazaClient spaces={spaces.map((s) => ({ id: s.id, name: s.name, text: s.text, photos: s.photos, pano: s.pano, icon: icons[s.icon] || icons.class }))} />
        </div>
      </section>
    </>
  );
}
