import { getSiteInfo } from '../../../lib/siteinfo';
import PageHero from '../../components/PageHero';
import LawRefs from '../../components/LawRefs';
import DocRows from '../../components/DocRows';
import { getDocuments } from '../../../lib/data';

export const metadata = {
  title: 'Достъп до обществена информация — ЦСОП Варна',
  description:
    'Ред за достъп до обществена информация в ЦСОП – Варна по ЗДОИ — заявления, форми на достъп, разходи, образци, вътрешни правила и годишни отчети.',
};

export const dynamic = 'force-dynamic';

type Doc = {
  id: string;
  name: string;
  file_url: string;
  academic_year: string | null;
  category: string | null;
};

// Звено за приемане на заявления по ЗДОИ
const UNIT_BASE = {
  name: 'Деловодство на ЦСОП – Варна',
  address: 'ул. „Петко Стайнов“ №7, гр. Варна',
  email: 'info-400052@edu.mon.bg',
  phones: '052 619 456 · 0878 521 823',
  hours: 'Работни дни, 8:00 – 16:30 ч.',
};

export default async function ZdoiPage() {
  const info = await getSiteInfo();
  const UNIT = { ...UNIT_BASE, email: info.contact.email, hours: `Работни дни, ${info.hours.admin} ч.` };
  const docs: Doc[] = (await getDocuments('zdoi', true)).map((d) => ({ ...d, category: d.category ?? null }));

  const byCat = (k: string) => docs.filter((d) => (d.category ?? '') === k);
  const obrazci = byCat('obrazec');
  const pravila = byCat('pravila');
  const normativi = byCat('normativ');
  const otcheti = byCat('otchet');

  // Групиране на отчетите по година (низходящо)
  const years = Array.from(new Set(otcheti.map((d) => d.academic_year || '—'))).sort((a, b) =>
    b.localeCompare(a, 'bg')
  );

  return (
    <>
      <PageHero
        path="/za-nas/dostap-do-obshtestvena-informatsiya"
        title="Достъп до обществена информация"
        intro="Всеки има право на достъп до обществена информация, създавана и съхранявана от ЦСОП – Варна, по реда на Закона за достъп до обществена информация (ЗДОИ)."
      />

      <section className="section tone-blue">
        <div className="wrap narrow legal">
          {/* Право на достъп */}
          <section className="prose-block">
            <h2>Право на достъп</h2>
            <p className="prose-lead">
              Всеки гражданин на Република България, чужденците и лицата без гражданство, както и всички
              юридически лица, имат право на достъп до обществена информация. При упражняване на това право
              не е необходимо да се доказва правен интерес, нито да се посочват причини и цели. Правото не
              обхваща лични данни и информация, представляваща защитена тайна по закон.
            </p>
          </section>

          {/* Как да подадете заявление */}
          <section className="prose-block">
            <h2>Как да подадете заявление</h2>
            <p>
              Заявление може да се подаде писмено — на място в деловодството на центъра, по пощата или по
              електронен път на адрес <a href={`mailto:${UNIT.email}`}>{UNIT.email}</a> — както и устно.
              Писмените и електронните заявления се смятат за равностойни; при електронно заявление не се
              изисква електронен подпис.
            </p>
            <p>
              Заявлението трябва да съдържа трите имена (съответно наименованието и седалището) на заявителя,
              описание на исканата информация, предпочитаната форма за предоставяне и адрес за кореспонденция.
              Срокът за произнасяне е до 14 дни от регистрирането. При неясно искане се изпраща уведомление за
              уточняване, а при голям обем информация срокът може да бъде удължен по реда на закона.
            </p>
          </section>

          {/* Форми на достъп */}
          <section className="prose-block">
            <h2>Форми на достъп</h2>
            <p>
              Достъпът може да бъде предоставен като преглед на информацията (оригинал или копие), устна
              справка, копие на хартиен носител, копие на технически носител или по електронен път. Заявителят
              посочва предпочитаната форма, а центърът я осигурява, доколкото е технически възможно.
            </p>
          </section>

          {/* Разходи */}
          <section className="prose-block">
            <h2>Разходи</h2>
            <p>
              Достъпът до обществена информация е безплатен. Заплащат се единствено разходите по
              предоставянето (напр. копия), съгласно Заповед № ЗМФ-1472 от 29.11.2011 г. на министъра на
              финансите за нормативите на разходите при предоставяне на обществена информация.
            </p>
          </section>

          {/* Звено за приемане */}
          <section className="prose-block">
            <h2>Звено за приемане на заявления</h2>
            <div className="kv">
              <div className="kv-row"><span>Звено</span><b>{UNIT.name}</b></div>
              <div className="kv-row"><span>Адрес</span><b>{UNIT.address}</b></div>
              <div className="kv-row"><span>Ел. поща</span><b><a href={`mailto:${UNIT.email}`}>{UNIT.email}</a></b></div>
              <div className="kv-row"><span>Телефон</span><b>{UNIT.phones}</b></div>
              <div className="kv-row"><span>Работно време</span><b>{UNIT.hours}</b></div>
            </div>
          </section>

          {/* Образци и бланки */}
          <section className="prose-block">
            <h2>Образци и бланки</h2>
            <p className="prose-note">
              Заявление за достъп, протоколи за приемане и предоставяне на информация, решения по ЗДОИ.
            </p>
            {obrazci.length > 0 ? (
              <DocRows docs={obrazci} />
            ) : (
              <p className="empty-note">Образците предстои да бъдат публикувани.</p>
            )}
          </section>

          {/* Вътрешни правила */}
          <section className="prose-block">
            <h2>Вътрешни правила по ЗДОИ</h2>
            {pravila.length > 0 ? (
              <DocRows docs={pravila} />
            ) : (
              <p className="empty-note">Вътрешните правила предстои да бъдат публикувани.</p>
            )}
          </section>

          {/* Нормативи за разходите (само ако има качени) */}
          {normativi.length > 0 && (
            <section className="prose-block">
              <h2>Нормативи за разходите</h2>
              <DocRows docs={normativi} />
            </section>
          )}

          {/* Годишни отчети по чл. 15, ал. 2 */}
          <section className="prose-block">
            <h2>Годишни отчети по чл. 15, ал. 2 от ЗДОИ</h2>
            <p className="prose-note">
              Отчет за постъпилите заявления за достъп до обществена информация — публикува се ежегодно,
              включително когато през годината не са постъпили заявления.
            </p>
            {otcheti.length === 0 ? (
              <p className="empty-note">Отчетите предстои да бъдат публикувани.</p>
            ) : (
              years.map((y) => (
                <div key={y} className="doc-year">
                  <h3 className="doc-group-h">{y}</h3>
                  <DocRows docs={otcheti.filter((d) => (d.academic_year || '—') === y)} />
                </div>
              ))
            )}
          </section>

          {/* Нормативна уредба */}
          <section className="prose-block">
            <LawRefs
              items={[
                { label: 'Закон за достъп до обществена информация (пълен текст)', href: 'https://pitay.government.bg/documents/zakon-za-dostup-do-obshestvena-informaciya' },
                { label: 'Платформа за достъп до обществена информация', href: 'https://pitay.government.bg' },
              ]}
              note="Разходите се определят със Заповед № ЗМФ-1472 от 29.11.2011 г. на министъра на финансите."
            />
          </section>
        </div>
      </section>
    </>
  );
}
