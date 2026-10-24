import PageHero from '../components/PageHero';
import { getEvents, fmtDate, monthShort } from '../../lib/data';

export const metadata = { title: 'Събития — СУ „Васил Левски“ – Вълчи дол', description: 'Предстоящи и минали събития в СУ „Васил Левски“ – гр. Вълчи дол.' };
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const all = await getEvents();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = all.filter((e) => e.event_date >= today);
  const past = all.filter((e) => e.event_date < today).reverse();

  return (
    <>
      <PageHero path="/sabitiya" title="Събития" intro="Предстоящите събития в училището и архив на отминалите." />
      <section className="section tone-lime">
        <div className="wrap">
          <h2 style={{ marginBottom: 16 }}>Предстоящи</h2>
          {upcoming.length === 0 ? <p className="empty">Няма обявени предстоящи събития.</p> : (
            <ul className="ev-list">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <span className="ev-day"><b>{new Date(e.event_date).getDate()}</b>{monthShort(e.event_date)}</span>
                  <div>
                    <h3>{e.title}</h3>
                    <p className="muted">{[fmtDate(e.event_date), e.event_time && `${e.event_time} ч.`, e.location].filter(Boolean).join(', ')}</p>
                    {e.description && <p className="ev-desc">{e.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {past.length > 0 && (
            <>
              <h2 style={{ margin: '48px 0 16px' }}>Отминали</h2>
              <ul className="ev-list past">
                {past.map((e) => (
                  <li key={e.id}>
                    <span className="ev-day"><b>{new Date(e.event_date).getDate()}</b>{monthShort(e.event_date)}</span>
                    <div>
                      <h3>{e.title}</h3>
                      <p className="muted">{[fmtDate(e.event_date), e.location].filter(Boolean).join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
