import PageHero from '../components/PageHero';
import LinkList from '../components/LinkList';

export const metadata = {
  title: 'Прозрачност — ЦСОП Варна',
  description:
    'Бюджет, обществени поръчки, правилници и планове, достъп до информация и защита на личните данни – публично и на едно място.',
};

export default function ProzrachnostPage() {
  return (
    <>
      <PageHero
        path="/prozrachnost"
        title="Прозрачност"
        intro="Като публична институция работим открито. Тук са бюджетът и отчетите, обществените поръчки, вътрешните документи и начинът, по който пазим личните данни."
      />
      <section className="section tone-blue">
        <div className="wrap">
          <LinkList
            items={[
              { t: 'Бюджет и финанси', d: 'Бюджети, тримесечни и годишни отчети', href: '/za-nas/byudzhet-i-finansi', icon: 'chart' },
              { t: 'Документи в ЦСОП', d: 'Правилници, стратегии, планове и политики', href: '/za-nas/dokumenti-v-tsop', icon: 'doc' },
              { t: 'Профил на купувача', d: 'Обществени поръчки в ЦАИС ЕОП', href: '/za-nas/profil-na-kupuvacha', icon: 'cart' },
              { t: 'Достъп до обществена информация', d: 'Заявления, ред за достъп и отчети по ЗДОИ', href: '/za-nas/dostap-do-obshtestvena-informatsiya', icon: 'search' },
              { t: 'Защита на личните данни', d: 'Политика за поверителност, ДЛЗД и правата ви', href: '/za-nas/zashtita-na-lichnite-danni', icon: 'shield' },
              { t: 'Подаване на сигнали', d: 'Поверителен канал по ЗЗЛПСПОИН', href: '/podavane-na-signali', icon: 'chat' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
