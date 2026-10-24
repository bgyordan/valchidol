export const metadata = { title: 'Страницата не е намерена — ЦСОП Варна' };

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap narrow" style={{ textAlign: 'center' }}>
        <p className="kicker" style={{ color: 'var(--orange-ink)' }}>Грешка 404</p>
        <h1>Няма такава страница</h1>
        <p className="muted" style={{ margin: '16px auto 28px', maxWidth: '32em' }}>
          Адресът може да е сгрешен или страницата да е преместена. Опитайте от началната страница или от менюто.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <a href="/" className="btn btn-primary">Към началната страница</a>
          <a href="/kontakti" className="btn btn-ghost">Контакти</a>
        </div>
      </div>
    </section>
  );
}
