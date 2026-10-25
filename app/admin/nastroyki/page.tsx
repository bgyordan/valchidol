import { denied } from '../guard';
import { getSiteInfo } from '../../../lib/siteinfo';
import { saveSiteInfo } from './actions';

export default async function AdminSettings() {
  const no = await denied('nastroyki');
  if (no) return no;
  const i = await getSiteInfo();
  return (
    <>
      <h1>Настройки на сайта</h1>
      <form action={saveSiteInfo} className="adm-form">
        <fieldset>
          <legend>Съобщение най-горе на сайта</legend>
          <label className="adm-check"><input type="checkbox" name="notice_on" value="1" defaultChecked={i.notice.on} /> Показвай съобщението</label>
          <label>Текст<input name="notice_text" defaultValue={i.notice.text} placeholder="напр. На 2 ноември няма учебни занятия." /></label>
          <div className="adm-row">
            <label>Връзка (по желание)<input name="notice_link" defaultValue={i.notice.link} placeholder="/novini/... или https://" /></label>
            <label>Показвай до (включително)<input name="notice_until" type="date" defaultValue={i.notice.until} /></label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Контакти</legend>
          <div className="adm-row">
            <label>Адрес<input name="address" defaultValue={i.contact.address} /></label>
            <label>Град<input name="city" defaultValue={i.contact.city} /></label>
          </div>
          <div className="adm-row">
            <label>Имейл<input name="email" type="email" defaultValue={i.contact.email} /></label>
            <label>Телефон<input name="phone" defaultValue={i.contact.phone} /></label>
          </div>
          <label>Facebook страница<input name="facebook" type="url" defaultValue={i.contact.facebook} /></label>
        </fieldset>

        <fieldset>
          <legend>Работно време</legend>
          <div className="adm-row">
            <label>Деловодство<input name="h_admin" defaultValue={i.hours.admin} /></label>
            <label>Ръководството приема<input name="h_director" defaultValue={i.hours.director} /></label>
          </div>
        </fieldset>

        <p><button type="submit" className="adm-btn primary">Запази</button></p>
      </form>
    </>
  );
}
