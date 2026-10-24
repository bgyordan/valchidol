// Форма „маргаритка“ за clip-path — нарочно НЕправилна: всяко листенце е с различна дължина, ширина
// и лек наклон, ъглите между листенцата са неравни, а целият кръг леко „плува“.
// Детерминирано по seed (едно и също цвете при всяко зареждане). Връща CSS polygon() в проценти.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function daisyPolygon(petals: number, seed: number, depth = 0.27, steps = 360): string {
  const r = rng(seed);
  const amp = Array.from({ length: petals }, () => 0.78 + r() * 0.22);   // дължина на листенцето
  const wid = Array.from({ length: petals }, () => 0.8 + r() * 0.45);    // ширина
  const tilt = Array.from({ length: petals }, () => (r() - 0.5) * 0.35); // наклон
  const cuts = Array.from({ length: petals }, (_, i) => ((i + (r() - 0.5) * 0.35) / petals) * Math.PI * 2); // неравни ъгли
  const wob = r() * Math.PI * 2;
  const pts: string[] = [];
  for (let s = 0; s < steps; s++) {
    const t = (s / steps) * Math.PI * 2;
    let k = petals - 1, a0 = cuts[petals - 1] - Math.PI * 2, a1 = cuts[0];
    for (let i = 0; i < petals; i++) if (t >= cuts[i]) { k = i; a0 = cuts[i]; a1 = i + 1 < petals ? cuts[i + 1] : cuts[0] + Math.PI * 2; }
    let u = (t - a0) / (a1 - a0);
    u = Math.min(1, Math.max(0, u + tilt[k] * Math.sin(Math.PI * u)));
    const shape = Math.pow(Math.sin(Math.PI * u), 1 / wid[k]); // 0 между листенцата, 1 на върха
    const rad = (1 - depth + depth * amp[k] * shape) * (1 + 0.03 * Math.sin(2 * t + wob));
    pts.push(`${(50 + 48 * rad * Math.cos(t)).toFixed(2)}% ${(50 + 48 * rad * Math.sin(t)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(', ')})`;
}
