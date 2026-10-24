// Полетата за дата и час в админа са в българско време; в базата пазим UTC (ISO).
function offsetMin(d: Date): number {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Sofia', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .formatToParts(d).reduce<Record<string, string>>((a, x) => ((a[x.type] = x.value), a), {});
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return Math.round((asUtc - Math.floor(d.getTime() / 60000) * 60000) / 60000);
}

// „2026-10-24T09:30“ (София) → ISO в UTC
export function sofiaToIso(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const guess = new Date(local + ':00Z');
  return new Date(guess.getTime() - offsetMin(guess) * 60000).toISOString();
}

// ISO → „2026-10-24T09:30“ (София), за стойност на <input type="datetime-local">
export function isoToSofia(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return new Date(d.getTime() + offsetMin(d) * 60000).toISOString().slice(0, 16);
}
