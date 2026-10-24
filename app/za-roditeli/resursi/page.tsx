import PageHero from '../../components/PageHero';
import LinkList from '../../components/LinkList';
import { getSiteInfo } from '../../../lib/siteinfo';

export const metadata = {
  title: 'Ресурси за родители — ЦСОП Варна',
  description: 'Печатни материали за работа у дома, литература и подкрепа за родители на деца със специални образователни потребности.',
};

export default async function ResourcesPage() {
  const { contact: CONTACT } = await getSiteInfo();
  return (
    <>
      <PageHero
        path="/za-roditeli/resursi"
        title="Ресурси за вкъщи"
        intro="Работата продължава и у дома. Тук са материали за принтиране, полезна литература и подкрепа за самите родители."
      />

      <section className="section tone-orange">
        <div className="wrap">
          <div className="sec-head"><div><h2>Материали за принтиране</h2><p>Изготвени от екипа на центъра, свободни за ползване у дома.</p></div></div>
          <LinkList cols={3} items={[
            { t: 'Комуникационни карти', d: 'Картинки за общуване: искам, да, не, вода, храна, тоалетна, боли, помощ', href: '/resursi/komunikatsionni-karti.pdf', icon: 'download', download: true },
            { t: 'Табло за дневен режим', d: 'Картинки за подреждане на деня – за предвидима и спокойна среда', href: '/resursi/tablo-dneven-rezhim.pdf', icon: 'download', download: true },
            { t: 'Табло за тоалетни навици', d: 'Визуална последователност стъпка по стъпка', href: '/resursi/tablo-toaletni-navitsi.pdf', icon: 'download', download: true },
          ]} />
        </div>
      </section>

      <section className="section tone-orange">
        <div className="wrap">
          <div className="sec-head"><h2>Литература и полезни връзки</h2></div>
          <LinkList cols={3} items={[
            { t: 'Брошури за родители', d: 'Карин дом: насоки за аутизъм, синдром на Даун, двигателно, слухово и зрително развитие', href: 'https://karindom.org/broshuri/', icon: 'external', external: true },
            { t: 'Визуална комуникация и PECS', d: 'Как работят таблата за комуникация и общуването чрез картинки', href: 'https://prepodavame.bg/dopalvashta-i-alternativna-komunikatsia-ili-kak-tehnologiite-promenyat-sadbi/', icon: 'external', external: true },
            { t: 'Препоръчителна литература', d: 'Книги и наръчници за родители на деца с аутизъм', href: 'https://autismbulgaria.com/knigi', icon: 'external', external: true },
          ]} />
        </div>
      </section>

      <section className="section soft tone-orange">
        <div className="wrap">
          <div className="sec-head"><h2>Подкрепа за родителите</h2></div>
          <LinkList cols={2} items={[
            { t: 'Работилница за родители', d: 'Срещи, в които терапевтите и родителите работят заедно за общ език с детето', icon: 'users' },
            { t: 'Консултации и групи за взаимопомощ', d: 'Фондация „Карин дом“', href: 'https://karindom.org/', icon: 'external', external: true },
            { t: 'Родителско прегаряне', d: 'Как да го разпознаем и как да си върнем силите', href: 'https://nmd.bg/kakvo-e-i-zashto-se-stiga-do-roditelski-barnaut/', icon: 'external', external: true },
            { t: 'Братята и сестрите в семейството', d: 'Как да подкрепим и другото дете в семейството', href: 'https://chudesa.bg/1017-otgovornosti-roli-i-pravila-bratya-sestri-na-deca-s-uvrejdaniya/', icon: 'external', external: true },
          ]} />
          <p className="prose-note" style={{ background: 'var(--paper)' }}>
            За индивидуална консултация пишете на {CONTACT.email} или се обадете на 052 619 456.
          </p>
        </div>
      </section>
    </>
  );
}
