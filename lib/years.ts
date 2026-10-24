// Много страници от стария сайт трупат години една под друга („## 2025/2026 година“, „## 2024/2025 година“…).
// splitByYears разделя текста по тези заглавия, за да се показва една година, а другите — с бутоните над нея.
// Връща null, ако страницата няма поне две години.

const YEAR = /(?:19|20)\d\d(?:\s*[-/–—]\s*(?:(?:19|20)?\d\d))?/;

export type YearSection = { label: string; text: string };

function label(heading: string): string | null {
  const m = heading.match(YEAR);
  if (!m) return null;
  const [a, b] = m[0].split(/\s*[-/–—]\s*/);
  if (!b) return a;
  return `${a}/${b.length === 2 ? a.slice(0, 2) + b : b}`;
}

// заглавието е само „година“: без годината и думите около нея не остава нищо
function onlyYear(heading: string): boolean {
  return heading.replace(YEAR, '').replace(/учебна|година|г\.?|[\s:–—-]/gi, '').trim() === '';
}

export function splitByYears(body: string): { intro: string; sections: YearSection[] } | null {
  const lines = body.replace(/\r/g, '').split('\n');
  const head = (l: string) => l.trim().match(/^(#{2,3}) (.+)$/);
  // нивото на заглавията с години: ## или ###, което има поне две
  let level: string | null = null;
  for (const lv of ['##', '###']) {
    const n = lines.filter((l) => { const h = head(l); return h && h[1] === lv && !h[2].startsWith('[') && label(h[2]); }).length;
    if (n >= 2) { level = lv; break; }
  }
  if (!level) return null;

  const isYearHead = (i: number) => { const h = head(lines[i]); return !!h && h[1] === level && !h[2].startsWith('[') && !!label(h[2]); };
  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!isYearHead(i)) continue;
    // заглавие без година точно над годината („ПРИЕМ … ЗА“ + „УЧЕБНА 2026/2027“) върви с нея
    let s = i;
    for (let j = i - 1; j >= 0; j--) {
      if (!lines[j].trim()) continue;
      const h = head(lines[j]);
      if (h && h[1] === level && !label(h[2])) s = j;
      break;
    }
    starts.push(s);
  }
  if (starts.length < 2) return null;

  const intro = lines.slice(0, starts[0]).join('\n').trim();
  const map = new Map<string, string[]>();
  starts.forEach((s, k) => {
    const end = k + 1 < starts.length ? starts[k + 1] : lines.length;
    const chunk = lines.slice(s, end);
    const yi = chunk.findIndex((l) => { const h = head(l); return !!h && h[1] === level && !!label(h[2]); });
    const lab = label(head(chunk[yi])![2])!;
    if (onlyYear(head(chunk[yi])![2])) chunk.splice(yi, 1);
    const prev = map.get(lab) ?? [];
    map.set(lab, prev.concat(prev.length ? [''] : [], chunk));
  });
  const sections = [...map.entries()].map(([lab, l]) => ({ label: lab, text: l.join('\n').trim() }));
  if (sections.length < 2) return null;
  // най-новата година първа
  sections.sort((x, y) => y.label.localeCompare(x.label));
  return { intro, sections };
}
