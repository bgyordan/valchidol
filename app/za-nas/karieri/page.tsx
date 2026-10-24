import PageHero from '../../components/PageHero';
import { db } from '../../../lib/supabase';
import { getSiteInfo } from '../../../lib/siteinfo';
import JobSubscribe from './JobSubscribe';
import './karieri.css';

export const metadata = {
  title: 'Кариери — ЦСОП Варна',
  description: 'Свободни позиции в ЦСОП – Варна. Присъединете се към екип от специални педагози, логопеди, психолози и терапевти.',
};
export const dynamic = 'force-dynamic';

type Job = { id: string; title: string; employment: string | null; description: string | null; requirements: string | null; location: string | null };

async function getJobs(): Promise<Job[]> {
  const s = db();
  if (!s) return [];
  try {
    const { data } = await s.from('site_jobs').select('id, title, employment, description, requirements, location')
      .eq('status', 'active').order('sort_order', { ascending: true });
    return data ?? [];
  } catch { return []; }
}

export default async function CareersPage() {
  const { contact: CONTACT } = await getSiteInfo();
  const jobs = await getJobs();
  return (
    <>
      <PageHero
        path="/za-nas/karieri"
        page="karieri"
        title="Станете част от екипа"
        intro="При нас работят специални педагози, логопеди, психолози и терапевти. Ако споделяте нашата мисия, ще се радваме да се запознаем."
      />

      <section className="section tone-blue">
        <div className="wrap split">
          <div>
            <h2 style={{ marginBottom: 20 }}>Свободни позиции</h2>
            {jobs.length === 0 ? (
              <p className="empty">В момента няма обявени свободни позиции. Можете да ни изпратите документите си по всяко време.</p>
            ) : (
              <div className="job-list">
                {jobs.map((j) => (
                  <article key={j.id} className="job">
                    <h3>{j.title}</h3>
                    {(j.employment || j.location) && (
                      <p className="job-meta">{[j.employment, j.location].filter(Boolean).join(', ')}</p>
                    )}
                    {j.description && <p className="job-desc">{j.description}</p>}
                    {j.requirements && (
                      <>
                        <h4>Изисквания</h4>
                        <ul className="feature-list">
                          {j.requirements.split('\n').filter((r) => r.trim()).map((r, i) => <li key={i}>{r.trim()}</li>)}
                        </ul>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
          <aside className="aside-box">
            <h3>Как да кандидатствате</h3>
            <p className="muted">Изпратете CV, мотивационно писмо и копия от дипломите си на имейл или ги донесете в деловодството.</p>
            <p className="apply-mail">{CONTACT.email}</p>
            <p className="muted">{CONTACT.address}, Варна</p>
            <JobSubscribe />
          </aside>
        </div>
      </section>
    </>
  );
}
