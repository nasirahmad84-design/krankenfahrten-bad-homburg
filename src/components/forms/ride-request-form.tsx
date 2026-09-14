"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { rideReasons } from "@/content/contact";
import { trackAnalyticsEvent } from "@/lib/analytics-consent";
import { createRideRequestPayload, postRideRequest } from "@/lib/ride-request-client";
import { validateRideRequest, type RideRequestFieldErrors } from "@/lib/validation/ride-request";

type FormStatus = Readonly<{ kind: "initial" | "submitting" | "validation_error" | "server_error" | "success"; message: string }>;
const initialStatus: FormStatus = { kind: "initial", message: "" };
const successMessage = "Vielen Dank. Ihre Anfrage wurde übermittelt. Sie ist erst nach unserer ausdrücklichen Bestätigung verbindlich.";
const errorMessage = "Die Anfrage konnte momentan nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns unter 0175 4142222 an.";
const Prefix = createContext('request');
const subscribe = () => () => {};
const stepFields = [['pickup', 'destination', 'journey'], ['date', 'time', 'reason'], ['name', 'phone', 'email'], ['notes', 'consent']];
const stepTitles = ['Wohin geht die Fahrt?', 'Wann möchten Sie fahren?', 'Wie erreichen wir Sie?', 'Prüfen und absenden'];
const photonEndpoint = 'https://photon.komoot.io/api/';

type PhotonFeature = Readonly<{properties?: Readonly<Record<string, unknown>>}>;

export function RideRequestForm({onBusyChange}: {onBusyChange?: (busy: boolean) => void}) {
  const prefix = `request-${useId().replaceAll(':', '')}`;
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState<Record<string, FormDataEntryValue>>({});
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<RideRequestFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestionsEnabled, setAddressSuggestionsEnabled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formStartedAtRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submissionLockRef = useRef(false);

  useEffect(() => {
    if (formStartedAtRef.current) formStartedAtRef.current.value = String(Date.now());
  }, []);

  function goToStep(next: number) {
    setStep(next);
    setStatus(initialStatus);
    setErrors({});
    requestAnimationFrame(() => {
      stepHeading.current?.focus({preventScroll: true});
      stepHeading.current?.scrollIntoView({block: 'nearest', behavior: 'instant'});
    });
  }
  function focusError(found: RideRequestFieldErrors) {
    const first = Object.keys(found)[0];
    if (!first) return;
    setStep(Math.max(0, stepFields.findIndex(group => group.includes(first))));
    requestAnimationFrame(() => {
      const field = formRef.current?.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLockRef.current) return;
    const formData = new FormData(event.currentTarget);
    const validation = validateRideRequest(formData);
    if (step < 3) {
      const currentErrors = validation.success ? {} : Object.fromEntries(Object.entries(validation.fieldErrors).filter(([key]) => stepFields[step].includes(key)));
      if (Object.keys(currentErrors).length) {
        setErrors(currentErrors); focusError(currentErrors); return;
      }
      setSummary(Object.fromEntries(formData));
      goToStep(step + 1);
      return;
    }
    if (!validation.success) {
      setErrors(validation.fieldErrors);
      setStatus({ kind: "validation_error", message: "Bitte prüfen Sie die markierten Felder." });
      focusError(validation.fieldErrors);
      return;
    }

    submissionLockRef.current = true;
    setIsSubmitting(true);
    onBusyChange?.(true);
    setErrors({});
    setStatus({ kind: "submitting", message: "Anfrage wird übermittelt …" });
    const result = await postRideRequest(createRideRequestPayload(validation.data, formData));

    if (result.success) {
      trackAnalyticsEvent("generate_lead");
      formRef.current?.reset();
      setSummary({});
      if (formStartedAtRef.current) formStartedAtRef.current.value = String(Date.now());
      setStatus({ kind: "success", message: successMessage });
      requestAnimationFrame(() => successHeadingRef.current?.focus());
    } else if (result.type === "validation") {
      setErrors(result.errors);
      setStatus({ kind: "validation_error", message: "Bitte prüfen Sie die markierten Felder." });
      focusError(result.errors);
    } else {
      setStatus({ kind: "server_error", message: errorMessage });
    }

    submissionLockRef.current = false;
    setIsSubmitting(false);
    onBusyChange?.(false);
  }

  return (
    <Prefix.Provider value={prefix}><form ref={formRef} action="/api/fahrtanfrage.php" method="post" noValidate onSubmit={handleSubmit} onReset={() => setAddressSuggestionsEnabled(false)} className="relative mx-auto max-w-xl rounded-2xl border border-[#dce2e9] bg-white p-4 sm:p-5" aria-label="Fahrt unverbindlich anfragen">
      <input ref={formStartedAtRef} type="hidden" name="formStartedAt" />
      <div className="pointer-events-none absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${prefix}-website`}>Website</label>
        <input id={`${prefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div hidden={status.kind === 'success'}>
      {enhanced && <ol aria-label="Fortschritt" className="mb-4 grid grid-cols-4 gap-2">{['Strecke', 'Termin', 'Kontakt', 'Absenden'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={`border-t-4 pt-2 text-xs font-semibold ${index <= step ? 'border-green' : 'border-navy/10 text-navy/60'}`}>{index + 1}. {label}</li>)}</ol>}
      <h3 ref={stepHeading} tabIndex={-1} className="mb-4 text-xl font-bold text-navy focus:outline-none">{enhanced ? stepTitles[step] : 'Ihre Fahrtdaten'}</h3>
      <fieldset disabled={isSubmitting} hidden={enhanced && step !== 2} className="space-y-3">
        <legend className="sr-only">Kontakt</legend>
        <Field id="name" label="Vorname und Nachname" required error={errors.name} autoComplete="name" maxLength={120} />
        <Field id="phone" label="Telefonnummer" required error={errors.phone} type="tel" autoComplete="tel" maxLength={40} />
        <Field id="email" label="E-Mail (optional)" error={errors.email} type="email" autoComplete="email" maxLength={254} />
      </fieldset>
      <fieldset disabled={isSubmitting} hidden={enhanced && step !== 1} className="space-y-3">
        <legend className="sr-only">Termin</legend>
        <div className="grid grid-cols-2 gap-3">
        <Field id="date" label="Fahrtdatum" required error={errors.date} type="date" />
        <Field id="time" label="Abholzeit" required error={errors.time} type="time" />
        </div>
        <SelectField id="reason" label="Fahrtanlass" required error={errors.reason} options={rideReasons} />
      </fieldset>
      <fieldset disabled={isSubmitting} hidden={enhanced && step !== 0} className="space-y-3">
        <legend className="sr-only">Strecke</legend>
        {enhanced && <div className="rounded-xl bg-[#f6f9fc] p-3 text-sm leading-relaxed">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold" htmlFor={`${prefix}-address-suggestions`}>
            <input id={`${prefix}-address-suggestions`} type="checkbox" checked={addressSuggestionsEnabled} onChange={(event) => setAddressSuggestionsEnabled(event.currentTarget.checked)} className="size-6 shrink-0 accent-green" aria-describedby={`${prefix}-address-suggestions-help`} />
            Adressvorschläge nutzen
          </label>
          <p id={`${prefix}-address-suggestions-help`} className="mt-1 text-xs text-[#5b697a]">Optional: Beim Tippen wird Ihre Eingabe an Photon übertragen. Manuelle Eingabe bleibt jederzeit möglich. <Link href="/datenschutz/" target="_blank" rel="noopener" className="font-semibold underline">Datenschutzhinweise</Link></p>
          {addressSuggestionsEnabled && <p className="mt-2 text-xs"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="font-semibold underline">Daten © OpenStreetMap-Mitwirkende</a> · Suche über Photon</p>}
        </div>}
        <AddressField id="pickup" label="Abholadresse" required error={errors.pickup} autoComplete="street-address" maxLength={200} suggestionsEnabled={enhanced && addressSuggestionsEnabled} />
        <AddressField id="destination" label="Zieladresse" required error={errors.destination} maxLength={200} suggestionsEnabled={enhanced && addressSuggestionsEnabled} />
        <SelectField id="journey" label="Rückfahrt (optional)" error={errors.journey} options={["Nur Hinfahrt", "Hin- und Rückfahrt"]} />
      </fieldset>
      <fieldset disabled={isSubmitting} hidden={enhanced && step !== 3} className="space-y-3">
        <legend className="sr-only">Prüfen und absenden</legend>
        {enhanced && <div className="rounded-xl bg-[#f6f9fc] p-3 text-sm leading-relaxed">
          <p className="break-words font-semibold">{String(summary.pickup ?? '')} → {String(summary.destination ?? '')}</p>
          <p>{String(summary.date ?? '')} · {String(summary.time ?? '')} Uhr</p>
          <p>{String(summary.reason ?? '')} · {String(summary.journey ?? '')}</p>
          <p className="break-words">{String(summary.name ?? '')} · {String(summary.phone ?? '')}</p>
          {summary.email && <p className="break-words">{String(summary.email)}</p>}
          <button type="button" onClick={() => goToStep(0)} className="min-h-11 font-semibold underline">Angaben ändern</button>
        </div>}
        <details open={errors.notes ? true : undefined}>
          <summary className="min-h-11 cursor-pointer text-sm font-semibold">Hinweise ergänzen (optional)</summary>
          <label htmlFor={`${prefix}-notes`} className="form-label">Zusätzliche Hinweise</label>
          <textarea id={`${prefix}-notes`} name="notes" rows={2} maxLength={1000} className="form-control resize-y" aria-invalid={Boolean(errors.notes)} aria-describedby={`${prefix}-notes-help`} />
          <p id={`${prefix}-notes-help`} className="mt-1 text-xs">Bitte geben Sie keine medizinischen Diagnosen oder Notfalldaten ein.</p>
          {errors.notes && <FieldError id={`${prefix}-notes-error`} message={errors.notes} />}
        </details>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#5b697a]" htmlFor={`${prefix}-consent`}>
          <input id={`${prefix}-consent`} name="consent" type="checkbox" className="mt-0.5 size-6 shrink-0 accent-green" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? `${prefix}-consent-error` : undefined} />
          <span>Ich willige ausdrücklich ein, dass meine Angaben – einschließlich des gewählten Fahrtanlasses und möglicher gesundheitsbezogener Angaben – zur Bearbeitung der Fahrtanfrage verarbeitet werden und ich hierzu telefonisch oder per E-Mail kontaktiert werde. Die Einwilligung kann ich jederzeit mit Wirkung für die Zukunft widerrufen. <span aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <FieldError id={`${prefix}-consent-error`} message={errors.consent} />}
        <p className="mt-2 text-xs leading-relaxed text-[#5b697a]">Informationen in der <Link target="_blank" rel="noopener" className="font-semibold text-navy underline" href="/datenschutz/">Datenschutzerklärung (neuer Tab)</Link>. Erst unsere Bestätigung macht die Fahrt verbindlich.</p>
      </div>

      </fieldset>
      <div className="sticky bottom-0 mt-4 flex gap-3 border-t border-navy/10 bg-white py-3">
        {enhanced && step > 0 && <button type="button" disabled={isSubmitting} onClick={() => goToStep(step - 1)} className="min-h-12 rounded-xl border border-navy/20 px-4 font-semibold disabled:opacity-50">Zurück</button>}
        <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting} className="min-h-12 flex-1 rounded-xl bg-green px-4 font-bold text-navy disabled:opacity-50">{isSubmitting ? "Wird gesendet …" : enhanced && step < 3 ? 'Weiter →' : 'Unverbindlich absenden'}</button>
      </div>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {status.kind !== "initial" && status.kind !== "submitting" && (
          <section className={`mt-6 rounded-xl border p-4 text-base leading-relaxed ${status.kind === "success" ? "border-green/40 bg-[#f0f7eb] text-navy" : "border-red-700/30 bg-red-50 text-red-950"}`} role={status.kind === "success" ? "status" : "alert"}>
            <h3 ref={successHeadingRef} tabIndex={status.kind === "success" ? -1 : undefined} className="font-bold">{status.kind === "success" ? "Anfrage übermittelt" : "Übermittlung nicht abgeschlossen"}</h3>
            <p className="mt-1">{status.message}</p>
            {status.kind === 'success' && <button type="button" className="mt-3 min-h-11 font-semibold underline" onClick={() => goToStep(0)}>Weitere Fahrt anfragen</button>}
          </section>
        )}
        {status.kind === "submitting" && <p className="sr-only">{status.message}</p>}
      </div>
    </form></Prefix.Provider>
  );
}

type FieldProps = { id: string; label: string; error?: string; required?: boolean; type?: string; autoComplete?: string; maxLength?: number };

function Field({ id, label, error, required, type = "text", autoComplete, maxLength }: FieldProps) {
  const inputId = `${useContext(Prefix)}-${id}`;
  const errorId = `${inputId}-error`;
  return <div><label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label><input id={inputId} name={id} type={type} autoComplete={autoComplete} maxLength={maxLength} className="form-control" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />{error && <FieldError id={errorId} message={error} />}</div>;
}

function AddressField({id, label, error, required, autoComplete, maxLength, suggestionsEnabled}: FieldProps & {suggestionsEnabled: boolean}) {
  const inputId = `${useContext(Prefix)}-${id}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-suggestion-status`;
  const listId = `${inputId}-suggestions`;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const trimmed = query.trim();
    if (!suggestionsEnabled || trimmed.length < 4) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setMessage('Adressvorschläge werden gesucht …');
      try {
        const url = new URL(photonEndpoint);
        url.searchParams.set('q', trimmed);
        url.searchParams.set('lang', 'de');
        url.searchParams.set('countrycode', 'DE');
        url.searchParams.set('limit', '5');
        const response = await fetch(url, {signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer'});
        if (!response.ok) throw new Error('address search failed');
        const data = await response.json() as {features?: PhotonFeature[]};
        const next = [...new Set((data.features ?? []).map(formatPhotonAddress).filter((value): value is string => Boolean(value)))].slice(0, 5);
        setSuggestions(next);
        setMessage(next.length ? `${next.length} Adressvorschläge verfügbar.` : 'Keine passende Adresse gefunden. Sie können die Adresse vollständig selbst eingeben.');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setSuggestions([]);
        setMessage('Adressvorschläge sind momentan nicht verfügbar. Bitte geben Sie die Adresse vollständig ein.');
      }
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, suggestionsEnabled]);

  const describedBy = [error ? errorId : '', suggestionsEnabled ? helpId : ''].filter(Boolean).join(' ') || undefined;
  return <div>
    <label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input id={inputId} name={id} type="text" autoComplete={autoComplete} maxLength={maxLength} className="form-control" required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy} list={suggestionsEnabled ? listId : undefined} onInput={(event) => {
      const value = event.currentTarget.value;
      setQuery(value);
      setSuggestions([]);
      setMessage(value.trim().length < 4 ? '' : 'Adressvorschläge werden gleich gesucht …');
    }} />
    {suggestionsEnabled && <datalist id={listId}>{suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist>}
    {suggestionsEnabled && <p id={helpId} aria-live="polite" className="mt-1 text-xs text-[#5b697a]">{query.trim().length > 0 && query.trim().length < 4 ? 'Bitte mindestens vier Zeichen eingeben.' : message || 'Ab vier Zeichen erscheinen passende Adressen.'}</p>}
    {error && <FieldError id={errorId} message={error} />}
  </div>;
}

function formatPhotonAddress(feature: PhotonFeature): string | null {
  const properties = feature.properties ?? {};
  const text = (key: string) => typeof properties[key] === 'string' ? String(properties[key]).trim() : '';
  const name = text('name');
  const street = text('street');
  const houseNumber = text('housenumber');
  const postcode = text('postcode');
  const city = text('city') || text('district') || text('county');
  const streetLine = [street, houseNumber].filter(Boolean).join(' ');
  const placeLine = [postcode, city].filter(Boolean).join(' ');
  const parts = [name !== street && name !== streetLine ? name : '', streetLine, placeLine].filter(Boolean);
  return parts.length >= 2 ? [...new Set(parts)].join(', ') : null;
}

type SelectFieldProps = { id: string; label: string; options: readonly string[]; error?: string; required?: boolean };

function SelectField({ id, label, options, error, required }: SelectFieldProps) {
  const inputId = `${useContext(Prefix)}-${id}`;
  const errorId = `${inputId}-error`;
  return <div><label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label><select id={inputId} name={id} className="form-control" defaultValue="" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}><option value="">Bitte auswählen</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{error && <FieldError id={errorId} message={error} />}</div>;
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} className="mt-2 text-sm font-semibold text-red-700">{message}</p>;
}
