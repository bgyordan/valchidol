import PageHero from '../../components/PageHero';
import TeamBrowser from './TeamBrowser';
import { TEAM } from './teamData';
import { getTeam } from '../../../lib/data';
import './ekip.css';

export const metadata = {
  title: 'Екип — ЦСОП Варна',
  description:
    'Висококвалифицирани специалисти, посветени на мисията да подкрепят развитието и потенциала на всяко дете в ЦСОП – Варна.',
};

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  // от ЕИС (служители); ако базата не отговори — вграденият списък
  const team = (await getTeam()) ?? TEAM;
  const total = team.reduce((n, g) => n + g.members.length, 0);

  return (
    <>
      <PageHero
        path="/za-nas/ekip"
        page="ekip"
        title="Хората зад грижата"
        intro={`Висококвалифицирани специалисти, посветени на мисията да подкрепят развитието и потенциала на всяко дете. Заедно сме ${total} души в един екип.`}
      />
      <section className="section tone-blue">
        <div className="wrap">
          <TeamBrowser team={team} />
        </div>
      </section>
    </>
  );
}
