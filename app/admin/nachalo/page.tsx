import { denied } from '../guard';
import { getHeroPhotos, getPagePhotos } from '../../../lib/data';
import Confirm from '../Confirm';
import PhotoPicker from '../PhotoPicker';
import SizedImg from '../SizedImg';
import { getHome, QUICK_ICONS } from '../../../lib/home';
import { addHomePhotos, moveHomePhoto, removeHomePhoto, saveHomeTexts } from './actions';

const GROUPS = [
  { target: 'hero', title: 'Снимки най-горе (голямата снимка)', note: 'Показват се първите 3 и се сменят плавно. Най-добре хоризонтални снимки, поне 1600 px широки.' },
  { target: 'nachalna-pod', title: 'Снимки в „За училището“', note: 'Показват се първите 2.' },
  { target: 'informatsiya-za', title: 'Снимки в „Информация за“', note: 'По една за Ученици, Родители и Учители, в този ред. Най-добре вертикални или квадратни.' },
] as const;

export default async function AdminFrontPage() {
  const no = await denied('nachalo');
  if (no) return no;
  const lists = { hero: await getHeroPhotos(), 'nachalna-pod': await getPagePhotos('nachalna-pod'), 'informatsiya-za': await getPagePhotos('informatsiya-za') };
  const h = await getHome();
  const quick = [...h.quick, ...Array(Math.max(0, 9 - h.quick.length)).fill({ t: '', href: '', icon: 'folder' })].slice(0, 12);
  const stats = [...h.stats, ...Array(Math.max(0, 6 - h.stats.length)).fill({ n: '', t: '' })].slice(0, 8);
  return (
    <>
      <h1>Начална страница</h1>
      <p className="adm-muted">Ако няма избрани снимки, сайтът взима кориците на последните новини.</p>
      {GROUPS.map((g) => {
        const list = lists[g.target];
        return (
          <section key={g.target}>
            <h2>{g.title}</h2>
            <p className="adm-muted">{g.note}</p>
            {list.length > 0 && (
              <div className="adm-photos">
                {list.map((u, i) => (
                  <figure key={u}>
                    <SizedImg src={u} min={g.target === 'hero' ? 1600 : 1000} />
                    <div className="adm-photo-btns">
                      <span>{i + 1}.</span>
                      {i > 0 && <form action={moveHomePhoto}><input type="hidden" name="target" value={g.target} /><input type="hidden" name="url" value={u} /><input type="hidden" name="dir" value="up" /><button className="adm-link">← по-напред</button></form>}
                      {i < list.length - 1 && <form action={moveHomePhoto}><input type="hidden" name="target" value={g.target} /><input type="hidden" name="url" value={u} /><input type="hidden" name="dir" value="down" /><button className="adm-link">по-назад →</button></form>}
                      <form action={removeHomePhoto}><input type="hidden" name="target" value={g.target} /><input type="hidden" name="url" value={u} /><Confirm text="Да махна ли тази снимка?" className="adm-link danger">махни</Confirm></form>
                    </div>
                  </figure>
                ))}
              </div>
            )}
            <form action={addHomePhotos} className="adm-form adm-box">
              <input type="hidden" name="target" value={g.target} />
              <label>Качи снимки<input type="file" name="photos" accept="image/*" multiple /></label>
              <PhotoPicker exclude={list} min={g.target === 'hero' ? 1600 : 1000} />
              <label>…или адрес на снимка<input name="link" type="url" placeholder="https://" /></label>
              <p><button type="submit" className="adm-btn primary">Добави</button></p>
            </form>
          </section>
        );
      })}

      <section>
        <h2>Текстове</h2>
        <form action={saveHomeTexts} className="adm-form">
          <fieldset>
            <legend>Най-горе</legend>
            <label>Ред над името<input name="kicker" defaultValue={h.kicker} /></label>
            <label>Име<input name="title" defaultValue={h.title} /></label>
            <label>Мото<input name="motto" defaultValue={h.motto} /></label>
          </fieldset>

          <fieldset>
            <legend>Бързи връзки (плочките под снимката)</legend>
            <p className="adm-muted">Редът тук е редът на сайта. Празен ред не се показва. Връзка към друг сайт започва с https://</p>
            {quick.map((q, i) => (
              <div key={i} className="adm-row">
                <label>{i + 1}. Надпис<input name={`q_t${i}`} defaultValue={q.t} /></label>
                <label>Връзка<input name={`q_h${i}`} defaultValue={q.href} placeholder="/priem или https://" /></label>
                <label>Иконка
                  <select name={`q_i${i}`} defaultValue={q.icon}>
                    {QUICK_ICONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>Училището в числа</legend>
            {stats.map((s, i) => (
              <div key={i} className="adm-row">
                <label>{i + 1}. Число<input name={`s_n${i}`} defaultValue={s.n} /></label>
                <label>Текст<input name={`s_t${i}`} defaultValue={s.t} /></label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend>„За училището“</legend>
            <label>Заглавие<input name="about_title" defaultValue={h.about_title} /></label>
            <label>Текст (нов абзац с празен ред)<textarea name="about_text" rows={5} defaultValue={h.about_text} /></label>
          </fieldset>

          <fieldset lang="en">
            <legend>На английски (souvalchidol.com/en)</legend>
            <label>Мото<input name="en_motto" defaultValue={h.en.motto} /></label>
            <label>Заглавие на „За училището“<input name="en_about_title" defaultValue={h.en.about_title} /></label>
            <label>Текст (нов абзац с празен ред)<textarea name="en_about_text" rows={5} defaultValue={h.en.about_text} /></label>
          </fieldset>

          <p><button type="submit" className="adm-btn primary">Запази текстовете</button></p>
        </form>
      </section>
    </>
  );
}
