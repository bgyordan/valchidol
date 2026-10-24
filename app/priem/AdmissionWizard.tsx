import React from 'react';

const FORM_NASOCHVANE = '/dokumenti/priem/zayavlenie-za-nasochvane.docx';
const FORM_ZAPISVANE = '/dokumenti/priem/zayavlenie-za-zapisvane.docx';

const DL = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="btn btn-primary stage-dl" href={href} download>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
    </svg>
    {children}
  </a>
);

interface Stage { n: string; title: string; body: React.ReactNode }

const STAGES: Stage[] = [
  {
    n: 'I',
    title: 'Подаване на документи',
    body: (
      <>
        <p>Първоначалната стъпка започва с официалното заявяване на желание за подкрепа:</p>
        <ol>
          <li>Записване на детето в <strong>училище</strong> или <strong>детска градина</strong>;</li>
          <li>Подаване на <strong>заявление по образец</strong> (можете да го изтеглите по-долу).</li>
        </ol>
        <h4>Допълнителни документи към заявлението</h4>
        <ul>
          <li>Документи за здравно състояние;</li>
          <li>Документи от съд <span className="muted">(ако има такива)</span>;</li>
          <li>Документи, свързани с обучението;</li>
          <li>Протокол от ТЕЛК / НЕЛК / ЛКК.</li>
        </ul>
        <DL href={FORM_NASOCHVANE}>Изтегли заявление за насочване</DL>
      </>
    ),
  },
  {
    n: 'II',
    title: 'Обработка на документите',
    body: (
      <>
        <p>След като подадете необходимия набор от документи, започва етапът на тяхното разглеждане и обработка.</p>
        <p>
          В срок до <strong>1 месец</strong> документите се окомплектоват и изпращат към{' '}
          <strong>РЦПППО – Варна</strong>. Този пакет включва:
        </p>
        <ol>
          <li><strong>Мотивирано становище</strong> от Екипа за подкрепа за личностно развитие (ЕПЛР);</li>
          <li><strong>Протокол</strong> от проведено заседание на ЕПЛР;</li>
          <li>Официално <strong>заявление от директора</strong> с всички приложени до момента документи.</li>
        </ol>
      </>
    ),
  },
  {
    n: 'III',
    title: 'Окончателно записване',
    body: (
      <>
        <p>Това е финалният етап от процедурата.</p>
        <p>
          След като бъде издадено официално становище от <strong>РЦПППО – Варна</strong> за насочване на детето,
          можете да преминете към същинското му записване при нас.
        </p>
        <p>За целта е необходимо да попълните финалното заявление:</p>
        <DL href={FORM_ZAPISVANE}>Изтегли заявление за записване</DL>
      </>
    ),
  },
];

// Процедурата по записване – три етапа, изпълняват се поред.
export default function AdmissionWizard() {
  return (
    <ol className="stages">
      {STAGES.map((st) => (
        <li key={st.n}>
          <span className="stage-n" aria-hidden="true">{st.n}</span>
          <div className="stage-body">
            <h3><span className="sr-only">Етап {st.n}: </span>{st.title}</h3>
            <div className="prose-block">{st.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
