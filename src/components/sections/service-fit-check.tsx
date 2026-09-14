'use client';

import {useEffect, useRef, useState} from 'react';
import {Button} from '@/components/ui/button';
import {assessServiceFit, type FitAnswer} from '@/lib/service-fit';

const questions = [
  'Geht es um einen akuten medizinischen Notfall?',
  'Kann der Fahrgast während der gesamten Fahrt auf einem Fahrzeugsitz sitzen?',
  'Wird ein Rollstuhl-, Tragestuhl- oder Liegendtransport oder medizinische Betreuung während der Fahrt benötigt?',
  'Kann der Fahrgast selbstständig oder mit einfacher Hilfe ein- und aussteigen?',
];
const results = {
  emergency: {title: 'Bei einem Notfall: 112 wählen', text: 'Unser Fahrdienst ist kein Rettungsdienst. Wenden Sie sich bei einem medizinischen Notfall direkt an den Notruf.', label: 'Notruf 112', href: 'tel:112'},
  outside: {title: 'Der benötigte Transport gehört nicht zu unserem Angebot', text: 'Wir bieten ausschließlich sitzende Fahrten ohne medizinische Betreuung an. Bitte klären Sie mit der behandelnden Praxis oder dem Klinikteam, welches Beförderungsmittel benötigt wird.', label: 'Leistungsgrenzen ansehen', href: '/leistungen/sitzende-krankenfahrten/'},
  clarify: {title: 'Bitte klären Sie den Unterstützungsbedarf zuerst', text: 'Wenn die medizinische Eignung oder Dringlichkeit unklar ist, wenden Sie sich an die behandelnde Praxis; bei einem möglichen Notfall an 112. Organisatorische Fragen zu Einstiegshilfe und Begleitung klären wir gern persönlich.', label: 'Kontakt aufnehmen', href: '/kontakt/'},
  possible: {title: 'Das passt grundsätzlich zu unserem Angebot', text: 'Sitzende Fahrt mit Einstiegshilfe nach Absprache. Termin, Verfügbarkeit und Kosten klären wir persönlich.', label: 'Unverbindlich anfragen →', href: '/kontakt/#request-form'},
};

export function ServiceFitCheck() {
  const [answers, setAnswers] = useState<FitAnswer[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  const result = assessServiceFit(answers);
  const outcome = result ? results[result] : null;
  useEffect(() => {
    if (interacted.current) heading.current?.focus({preventScroll: true});
  }, [answers]);
  function answer(value: FitAnswer) {
    interacted.current = true;
    setAnswers(previous => [...previous, value]);
  }
  return <div className="rounded-2xl border border-navy/15 bg-white p-5 shadow-sm sm:p-7">
    <div className="mb-4 flex gap-2" aria-hidden="true">{questions.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${outcome || index <= answers.length ? 'bg-green' : 'bg-navy/10'}`} />)}</div>
    <p className="mb-3 text-xs font-semibold text-green-dark">{outcome ? 'Ihr Ergebnis' : `Schritt ${answers.length + 1} von 4`}</p>
    <h2 ref={heading} tabIndex={-1} className="text-xl leading-snug font-bold text-navy focus:outline-none sm:text-2xl">{outcome?.title ?? questions[answers.length]}</h2>
    {outcome ? <>
      <p className="mt-3 text-base leading-relaxed">{outcome.text}</p>
      <Button href={outcome.href} className="mt-5 min-h-12 w-full">{outcome.label}</Button>
      {result === 'possible' && <p className="mt-2 text-xs text-navy/70">Noch keine Buchung. Erst unsere Bestätigung ist verbindlich.</p>}
    </> : <div className="mt-5 grid grid-cols-2 gap-3">
      {([['yes', 'Ja'], ['no', 'Nein'], ['unsure', 'Ich bin unsicher']] as const).map(([value, label]) => <Button key={value} variant="outline" className={`min-h-12 ${value === 'unsure' ? 'col-span-2 border-transparent text-sm' : 'border-navy/20 bg-[#f6f9fc]'}`} onClick={() => answer(value)}>{label}</Button>)}
    </div>}
    {answers.length > 0 && <div className="mt-3 flex justify-between gap-5 border-t border-navy/10 pt-2">
      <Button variant="link" onClick={() => setAnswers(previous => previous.slice(0, -1))}>Zurück</Button>
      <Button variant="link" onClick={() => setAnswers([])}>Neu beginnen</Button>
    </div>}
    <p className="mt-4 text-xs text-navy/70">Ohne Speicherung Ihrer Antworten · Keine medizinische Beurteilung</p>
    <noscript><p>Für den interaktiven Check wird JavaScript benötigt. Wir bieten sitzende Fahrten ohne medizinische Betreuung sowie Einstiegshilfe nach Absprache. Bitte <a href="/kontakt/">kontaktieren Sie uns</a> zur persönlichen Abstimmung.</p></noscript>
  </div>;
}
