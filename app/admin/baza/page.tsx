import { denied } from '../guard';
import Confirm from '../Confirm';
import PhotoPicker from '../PhotoPicker';
import SizedImg from '../SizedImg';
import { getSpacesRaw, SPACE_ICONS } from '../../../lib/baza';
import { addSpace, deleteSpace, moveSpace, moveSpacePhoto, saveSpace } from './actions';

export default async function AdminBaza() {
  const no = await denied('baza');
  if (no) return no;
  const spaces = await getSpacesRaw();
  return (
    <>
      <h1>Материална база</h1>
      <p className="adm-muted">Помещенията на страница <a href="/materialna-baza" target="_blank">Материална база</a>. Първото е голямата плочка. Първата снимка е корицата.
        360° снимка се прави с 360° камера или с приложение за сферични панорами на телефона — файл с размери 2:1, напр. 6000×3000.</p>
      {spaces.map((s, k) => (
        <section key={s.id} className="adm-box" style={{ marginBottom: 18 }}>
          <div className="adm-photo-btns" style={{ marginBottom: 8 }}>
            <span>{k + 1}.</span>
            {k > 0 && <form action={moveSpace}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="dir" value="up" /><button className="adm-link">↑ по-напред</button></form>}
            {k < spaces.length - 1 && <form action={moveSpace}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="dir" value="down" /><button className="adm-link">↓ по-назад</button></form>}
            <form action={deleteSpace}><input type="hidden" name="id" value={s.id} /><Confirm text={`Да изтрия ли „${s.name}“?`} className="adm-link danger">изтрий</Confirm></form>
          </div>
          <form action={saveSpace} className="adm-form">
            <input type="hidden" name="id" value={s.id} />
            <div className="adm-row">
              <label>Име<input name="name" defaultValue={s.name} required /></label>
              <label>Иконка (когато няма снимка)
                <select name="icon" defaultValue={s.icon}>{SPACE_ICONS.map((i) => <option key={i.key} value={i.key}>{i.label}</option>)}</select>
              </label>
            </div>
            <label>Текст<textarea name="text" rows={3} defaultValue={s.text} /></label>
            {s.photos.length > 0 ? (
              <div className="adm-photos">
                {s.photos.map((u, i) => (
                  <figure key={u}>
                    <SizedImg src={u} min={1200} />
                    <div className="adm-photo-btns">
                      <label className="adm-check"><input type="checkbox" name="rm" value={u} /> махни</label>
                      {i > 0 && <button className="adm-link" formAction={moveSpacePhoto} name="url" value={u}>направи първа</button>}
                    </div>
                  </figure>
                ))}
              </div>
            ) : s.q ? <p className="adm-muted">Няма избрани снимки — показват се снимките от новината с „{s.q}“ в заглавието.</p> : null}
            <label>Качи снимки<input type="file" name="photos" accept="image/*" multiple /></label>
            <PhotoPicker exclude={s.photos} />
            <div className="adm-row">
              <label>360° снимка {s.pano && <a href={s.pano} target="_blank">(сегашната)</a>}<input type="file" name="pano" accept="image/jpeg,image/png,image/webp" /></label>
              {s.pano && <label className="adm-check"><input type="checkbox" name="pano_rm" /> махни 360° снимката</label>}
              <label className="adm-check"><input type="checkbox" name="hidden" defaultChecked={s.hidden} /> скрий от сайта</label>
            </div>
            <p><button type="submit" className="adm-btn primary">Запази</button></p>
          </form>
        </section>
      ))}
      <form action={addSpace} className="adm-form adm-box">
        <h2>Ново помещение</h2>
        <div className="adm-row">
          <label>Име<input name="name" required placeholder="напр. Кабинет по химия" /></label>
          <p><button type="submit" className="adm-btn primary">Добави</button></p>
        </div>
      </form>
    </>
  );
}
