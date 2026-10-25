import { getAdmin } from '../../lib/auth';
import { can, type Area } from '../../lib/perms';

// В началото на всяка страница от админа: редактор без право за раздела вижда само съобщение.
export async function denied(area: Area) {
  if (can(await getAdmin(), area)) return null;
  return (
    <>
      <h1>Нямате достъп</h1>
      <p className="adm-muted">Този раздел не е отворен за вас. Ако ви трябва, помолете главния админ да ви даде право в „Хора“.</p>
    </>
  );
}
