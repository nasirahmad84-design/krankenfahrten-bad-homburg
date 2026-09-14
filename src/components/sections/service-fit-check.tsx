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
  possible: {title: 'Eine Anfrage für eine sitzende Fahrt kommt infrage', text: 'Ihre Angaben passen grundsätzlich zu unserem Leistungsumfang. Abholort, Ziel, Termin und Unterstützung stimmen wir persönlich ab. Verfügbarkeit und Kostenübernahme sind damit noch nicht bestätigt.', label: 'Fahrt unverbindlich anfragen', href: '/kontakt/'},
};

export function ServiceFitCheck() {
  const [answers, setAnswers] = useState<FitAnswer[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  const result = assessServiceFit(answers);
  const outcome = result ? results[result] : null;
  useEffect(() => {
    if (interacted.current) heading.current?.focus();
  }, [answers]);
  function answer(value: FitAnswer) {
    interacted.current = true;
    setAnswers(previous => [...previous, value]);
  }
  return <div className="rounded-3xl border border-navy/15 bg-white p-6 shadow-sm sm:p-10">
    <p className="mb-6 text-sm font-semibold text-green-dark">{outcome ? 'Ihre Orientierung' : `Frage ${answers.length + 1} von höchstens 4`}</p>
    <h2 ref={heading} tabIndex={-1} className="text-2xl font-bold text-navy focus:outline-none sm:text-3xl">{outcome?.title ?? questions[answers.length]}</h2>
    {outcome ? <>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed">{outcome.text}</p>
      <Button href={outcome.href} className="mt-7">{outcome.label}</Button>
    </> : <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      {([['yes', 'Ja'], ['no', 'Nein'], ['unsure', 'Ich bin unsicher']] as const).map(([value, label]) => <Button key={value} variant="outline" className="min-h-14 sm:flex-1" onClick={() => answer(value)}>{label}</Button>)}
    </div>}
    {answers.length > 0 && <div className="mt-7 flex flex-wrap gap-5 border-t border-navy/10 pt-5">
      <Button variant="link" onClick={() => setAnswers(previous => previous.slice(0, -1))}>Zurück</Button>
      <Button variant="link" onClick={() => setAnswers([])}>Neu beginnen</Button>
    </div>}
    <p className="mt-7 text-sm leading-relaxed text-navy/75">Ihre Antworten bleiben nur während dieses Checks im Browser. Sie werden nicht gespeichert, übertragen oder in eine Anfrage übernommen. Der Check ersetzt keine medizinische Beurteilung. Eine Fahrt wird erst nach unserer ausdrücklichen Bestätigung verbindlich.</p>
    <noscript><p>Für den interaktiven Check wird JavaScript benötigt. Wir bieten sitzende Fahrten ohne medizinische Betreuung sowie Einstiegshilfe nach Absprache. Bitte <a href="/kontakt/">kontaktieren Sie uns</a> zur persönlichen Abstimmung.</p></noscript>
  </div>;
}
