'use client';

import { useMemo, useState } from 'react';
import type { DocRow } from '../../../lib/data';
import DocRows from '../../components/DocRows';

// Документи по години: избор на година, вътре „Утвърден бюджет“ и „Отчети“.
export default function BudgetBrowser({ docs }: { docs: DocRow[] }) {
  const byYear = useMemo(() => {
    const g: Record<string, DocRow[]> = {};
    docs.forEach((d) => { (g[d.academic_year || 'Без година'] ||= []).push(d); });
    return g;
  }, [docs]);
  const years = Object.keys(byYear).sort().reverse();
  const cur = String(new Date().getFullYear());
  const [year, setYear] = useState(years.includes(cur) ? cur : years[0]);

  if (docs.length === 0) return <p className="empty">Все още няма публикувани бюджетни документи.</p>;
  const list = byYear[year] ?? [];
  const approved = list.filter((d) => d.category === 'approved');
  const reports = list.filter((d) => d.category !== 'approved');

  return (
    <div>
      {years.length > 1 && (
        <div className="chips" role="group" aria-label="Година" style={{ marginBottom: 24 }}>
          {years.map((y) => (
            <button key={y} type="button" className={y === year ? 'on' : ''} aria-pressed={y === year} onClick={() => setYear(y)}>{y}</button>
          ))}
        </div>
      )}
      {approved.length > 0 && (<><h2 className="doc-group-h">Утвърден бюджет {year}</h2><DocRows docs={approved} /></>)}
      {reports.length > 0 && (<><h2 className="doc-group-h">Отчети {year}</h2><DocRows docs={reports} /></>)}
    </div>
  );
}
