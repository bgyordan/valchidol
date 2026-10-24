// Детски длани — отпечатъци с боя в цветовете на логото, на произволни места в секцията (при всяко зареждане).
// Мястото се избира от „безопасни“ позиции (по краищата), за да не застъпват текста.
// HandDefs се слага веднъж на страницата; Handprints — във всяка секция, която искаме „оживена“.

// Цветовете от логото — като детска боя. Първата длан във всяка секция е оранжева, следващите зелена или синя.
const ORANGE = 'var(--brand-orange)';
const OTHERS = ['var(--brand-lime)', 'var(--brand-blue)'];

export type Slot = { top?: string; bottom?: string; left?: string; right?: string };

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export function HandDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* грапав ръб като от боя */}
        <filter id="hp-paint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
        <symbol id="hp-hand" viewBox="0 0 100 120">
          <ellipse cx="50" cy="80" rx="26" ry="27" />
          <rect x="28" y="24" width="13" height="50" rx="6.5" transform="rotate(-9 34.5 74)" />
          <rect x="42.5" y="15" width="13.5" height="58" rx="6.75" transform="rotate(-1 49 73)" />
          <rect x="56" y="21" width="13" height="52" rx="6.5" transform="rotate(8 62.5 73)" />
          <rect x="68" y="38" width="11.5" height="40" rx="5.75" transform="rotate(19 73.75 78)" />
          <rect x="27" y="56" width="14" height="38" rx="7" transform="rotate(-40 34 94)" />
        </symbol>
      </defs>
    </svg>
  );
}

export default function Handprints({ slots, count = 1, dark = false }: { slots: Slot[]; count?: number; dark?: boolean }) {
  const chosen = pick(slots, count);
  const colors = [ORANGE, ...pick(OTHERS, OTHERS.length)]; // различен цвят за всяка длан в секцията
  return (
    <div className={`hp-layer${dark ? ' dark' : ''}`} aria-hidden="true">
      {chosen.map((s, i) => {
        const rot = Math.round(Math.random() * 70 - 35);
        const flip = Math.random() < 0.5 ? -1 : 1; // лява или дясна ръка
        return (
          <svg key={i} className="hp" viewBox="0 0 100 120" style={{ ...s, ['--r' as any]: `${rot}deg`, ['--fx' as any]: flip, ['--d' as any]: `${i * 140}ms`, ['--hp-c' as any]: colors[i % colors.length] }}>
            <use href="#hp-hand" filter="url(#hp-paint)" fill="currentColor" />
          </svg>
        );
      })}
    </div>
  );
}
