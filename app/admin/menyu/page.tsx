import { NAV } from '../../components/nav';
import { getNav } from '../../../lib/menu';
import { resetMenu, saveMenu } from './actions';

// Редът, имената и скриването на разделите и страниците в главното меню.
// Полетата носят номера на раздела/връзката в кода (NAV), за да се знае коя е.
export default async function AdminMenu() {
  const nav = await getNav(true);
  const gi = (href: string) => NAV.findIndex((g) => g.href === href);
  return (
    <>
      <h1>Меню</h1>
      <p className="adm-muted">Сменете номера, за да преместите раздел или страница. Ново име — в полето до старото. Скрита страница не се вижда в менюто, но остава на адреса си.</p>
      <form action={saveMenu} className="adm-form">
        {nav.map((g, gpos) => {
          const k = gi(g.href);
          const orig = NAV[k];
          return (
            <fieldset key={g.href} className="adm-menu-group">
              <legend>{orig.label}</legend>
              <div className="adm-row adm-menu-row">
                <label>№<input name={`g${k}_pos`} type="number" step="any" defaultValue={gpos + 1} /></label>
                <label>Име в менюто<input name={`g${k}_label`} defaultValue={g.label !== orig.label ? g.label : ''} placeholder={orig.label} /></label>
                <label className="adm-check"><input type="checkbox" name={`g${k}_hide`} value="1" defaultChecked={g.hidden} /> Скрий целия раздел</label>
              </div>
              {g.links.map((l, lpos) => {
                const j = orig.links.findIndex((x) => x.href === l.href);
                const o = orig.links[j];
                return (
                  <div key={l.href} className="adm-row adm-menu-row sub">
                    <label>№<input name={`g${k}_l${j}_pos`} type="number" step="any" defaultValue={lpos + 1} /></label>
                    <label>{o.label}<input name={`g${k}_l${j}_label`} defaultValue={l.label !== o.label ? l.label : ''} placeholder={o.label} /></label>
                    <label className="adm-check"><input type="checkbox" name={`g${k}_l${j}_hide`} value="1" defaultChecked={l.hidden} /> Скрий</label>
                  </div>
                );
              })}
            </fieldset>
          );
        })}
        <p><button type="submit" className="adm-btn primary">Запази менюто</button></p>
      </form>
      <form action={resetMenu}><p><button className="adm-link">Върни менюто както беше в началото</button></p></form>
    </>
  );
}
