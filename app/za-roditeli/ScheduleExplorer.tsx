// Дневен режим: обща информация + разписание на учебните часове.
const PERIODS = [
  { label: '1. час', time: '8:30 – 9:05' },
  { label: '2. час', time: '9:15 – 9:50' },
  { label: 'Голямо междучасие', time: '9:50 – 10:20', brk: true },
  { label: '3. час', time: '10:20 – 10:55' },
  { label: '4. час', time: '11:05 – 11:40' },
  { label: '5. час', time: '11:50 – 12:25' },
  { label: '6. час', time: '12:35 – 13:05' },
];

const INFO = [
  { t: 'Форма на обучение', d: 'Дневна, едносменна.' },
  { t: 'Режим по групи', d: 'От I до VII клас – целодневен. От VIII до XI клас – полудневен.' },
  { t: 'Продължителност', d: 'Учебният час е 35 минути. Малкото междучасие е 10 минути, голямото – 30 минути.' },
  { t: 'Работно време', d: 'Центърът е отворен в работните дни от 8:00 до 18:00 ч. Занятията започват в 8:30 ч., администрацията работи до 16:30 ч.' },
];

export default function ScheduleExplorer() {
  return (
    <div className="split">
      <dl className="info-list">
        {INFO.map((i) => (
          <div key={i.t}><dt>{i.t}</dt><dd>{i.d}</dd></div>
        ))}
      </dl>
      <div className="aside-box">
        <h3>Учебни часове</h3>
        <table className="facts">
          <tbody>
            {PERIODS.map((p) => (
              <tr key={p.label} className={p.brk ? 'brk' : undefined}><th>{p.label}</th><td>{p.time}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
