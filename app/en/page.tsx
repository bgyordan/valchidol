import PageHero from '../components/PageHero';
import PagePhotos from '../components/PagePhotos';
import LinkList from '../components/LinkList';
import { getSiteInfo } from '../../lib/siteinfo';
import { alternates } from '../../lib/lang';

export const metadata = {
  title: 'CSOP Varna — Centre for Special Educational Support',
  description:
    'The Centre for Special Educational Support in Varna, Bulgaria: education, specialised support and rehabilitation for children and young people with special educational needs.',
  alternates: alternates('/en'),
  openGraph: { locale: 'en_GB', title: 'CSOP Varna — Centre for Special Educational Support', siteName: 'CSOP Varna' },
};

const VALUES = [
  { t: 'Acceptance', d: 'Every child is welcome just as they are – with their own rhythm, character and way of discovering the world.' },
  { t: 'An individual plan', d: 'Each pupil follows a personal plan, drawn up by a team of specialists according to their needs.' },
  { t: 'Together', d: 'Parents, teachers and therapists are one team. A child’s progress is a shared effort and a shared joy.' },
  { t: 'Direction', d: 'We do not rush. We believe that the direction we move in matters more than the speed.' },
];

const PATH = [
  { when: '1949', t: 'Bratya Miladinovi Auxiliary School', d: 'Institutional care for children with special educational needs begins in Varna.' },
  { when: '2017', t: 'Centre for Special Educational Support', d: 'Under the Preschool and School Education Act the school becomes a centre offering diagnostic, therapeutic and vocational support.' },
  { when: 'Today', t: 'Over 150 children and young people', d: 'Every day more than 150 children and young people learn and receive therapy with us, guided by a team of specialists.' },
];

export default async function EnHome() {
  const { hours: HOURS } = await getSiteInfo();
  return (
    <>
      <PageHero
        lang="en"
        page="za-nas"
        tone="blue"
        title="A place where every child finds their own rhythm"
        intro="The Centre for Special Educational Support in Varna provides education, specialised support and rehabilitation for children and young people with special educational needs – in a safe, stimulating and accepting environment."
      />

      <section className="section tone-blue">
        <div className="wrap split">
          <div className="prose-block">
            <h2>Supporting development, respecting the person</h2>
            <p>
              We exist so that children and their families can live their personal and social lives to the full.
              Diagnostic, therapeutic and educational support come together under one roof.
            </p>
            <p>
              Every child works to an individual plan, and every small success – the first spoken word, the first
              step taken alone, the first clay cup – is a triumph we celebrate together.
            </p>
            <p>
              The centre is part of the Bulgarian public education system. Children are referred to us by the
              Regional Centre for Support of the Process of Inclusive Education in Varna.
            </p>
          </div>
          <aside className="aside-box">
            <h3>At a glance</h3>
            <table className="facts">
              <tbody>
                <tr><th>Children and young people</th><td>over 150</td></tr>
                <tr><th>Specialists</th><td>over 40</td></tr>
                <tr><th>Serving Varna’s children</th><td>since 1949</td></tr>
                <tr><th>Address</th><td>7 Petko Staynov Str., Varna</td></tr>
                <tr><th>Opening hours</th><td>Mon – Fri, {HOURS.center}</td></tr>
              </tbody>
            </table>
          </aside>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap">
          <div className="sec-head"><h2>What we believe in</h2></div>
          <div className="vals">
            {VALUES.map((v) => (
              <div key={v.t} className="val"><h3>{v.t}</h3><p>{v.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tone-blue">
        <div className="wrap">
          <div className="sec-head"><h2>Our journey</h2></div>
          <ol className="timeline">
            {PATH.map((p) => (
              <li key={p.when}><span className="tl-when">{p.when}</span><h3>{p.t}</h3><p>{p.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <PagePhotos page="za-nas" title="CSOP Varna" heading="Life at the centre" />

      <section className="section tone-blue">
        <div className="wrap">
          <div className="sec-head"><h2>Find out more</h2></div>
          <LinkList
            cols={3}
            items={[
              { t: 'Services', d: 'Education, therapies and rehabilitation', href: '/en/services', icon: 'heart' },
              { t: 'Admission', d: 'How a child is enrolled', href: '/en/admission', icon: 'clipboard' },
              { t: 'Contacts', d: 'Phones, opening hours and map', href: '/en/contacts', icon: 'pin' },
              { t: 'Support us', d: 'Donations and partnerships', href: '/en/support-us', icon: 'bulb' },
              { t: 'News', d: 'Life at the centre (in Bulgarian)', href: '/novini', icon: 'news' },
              { t: 'Full website', d: 'All pages and documents (in Bulgarian)', href: '/', icon: 'external' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
