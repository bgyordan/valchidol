'use client';

import { usePathname } from 'next/navigation';

// Малки ръкописни акценти по краищата на страницата: „АБВ“, „a² + b² = c²“, „E = mc²“…
// На всяка страница 2–3 различни, избрани по адреса (едни и същи при всяко отваряне), само на широк екран.
const ITEMS = [
  'АБВ', 'a² + b² = c²', 'E = mc²', 'π ≈ 3,14', 'H₂O', '√16 = 4', '2 + 2 = 4', 'x² − 1 = 0', 'F = m·a', '∞',
  'Аз · Буки · Веди', 'sin²α + cos²α = 1', '♪ ♫', 'NaCl', '1880', 'Ж, Щ, Ъ', 'V = s / t', '∑', 'ABC', '3 × 7 = 21',
];
// места: отляво/отдясно и височина в процента от страницата
const SPOTS = [
  { side: 'left', top: 14 }, { side: 'right', top: 26 }, { side: 'left', top: 44 },
  { side: 'right', top: 58 }, { side: 'left', top: 72 }, { side: 'right', top: 86 },
] as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export default function Doodles() {
  const path = usePathname() || '/';
  if (path.startsWith('/admin')) return null;
  let h = hash(path);
  const next = (n: number) => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; return h % n; };
  const count = 2 + next(2); // 2 или 3
  const used = new Set<number>();
  // местата се разбъркват по адреса; взимат се първите 2–3
  const spots = SPOTS.map((s) => ({ s, k: next(1000) })).sort((a, b) => a.k - b.k).slice(0, count).map((x) => x.s);
  return (
    <div className="doodles" aria-hidden="true">
      {spots.map((s, i) => {
        let k = next(ITEMS.length);
        while (used.has(k)) k = (k + 1) % ITEMS.length;
        used.add(k);
        const rot = next(7) - 3;
        return (
          <span key={i} className={`doodle d-${s.side}`} style={{ top: `${s.top}%`, ['--r' as string]: `${rot}deg`, ['--d' as string]: `${i * 1.7}s` } as React.CSSProperties}>
            {ITEMS[k]}
          </span>
        );
      })}
    </div>
  );
}
