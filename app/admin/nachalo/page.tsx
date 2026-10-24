import { getHeroPhotos, getPagePhotos } from '../../../lib/data';
import Confirm from '../Confirm';
import { addHomePhotos, moveHomePhoto, removeHomePhoto } from './actions';

const GROUPS = [
  { target: 'hero', title: 'Снимки най-горе (голямата снимка)', note: 'Показват се първите 3 и се сменят плавно. Най-добре хоризонтални снимки, поне 1600 px широки.' },
  { target: 'nachalna-pod', title: 'Снимки в „За училището“', note: 'Показват се първите 2.' },
] as const;

export default async function AdminFrontPage() {
  const lists = { hero: await getHeroPhotos(), 'nachalna-pod': await getPagePhotos('nachalna-pod') };
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
                    <img src={u} alt="" />
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
              <label>…или адрес на снимка<input name="link" type="url" placeholder="https://" /></label>
              <p><button type="submit" className="adm-btn primary">Добави</button></p>
            </form>
          </section>
        );
      })}
    </>
  );
}
