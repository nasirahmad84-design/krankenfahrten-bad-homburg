"use client";

import { FormEvent, useState } from "react";

import { rideReasons } from "@/content/contact";

type Errors = Record<string, string>;

const requiredFields = ["name", "phone", "date", "time", "pickup", "destination", "reason", "journey"] as const;

export function RideRequestForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [isPrepared, setIsPrepared] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPrepared(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Errors = {};

    for (const name of requiredFields) {
      if (!String(data.get(name) ?? "").trim()) nextErrors[name] = "Bitte füllen Sie dieses Pflichtfeld aus.";
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    if (!data.get("consent")) nextErrors.consent = "Bitte stimmen Sie der Kontaktaufnahme zu.";

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      requestAnimationFrame(() => document.getElementById(`request-${firstError}`)?.focus());
      return;
    }
    setIsPrepared(true);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-[20px] border border-[#dce2e9] bg-white p-4 shadow-[0_12px_32px_rgba(2,31,88,0.07)] sm:rounded-[22px] sm:p-8" aria-label="Fahrt unverbindlich anfragen">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <Field id="name" label="Vorname und Nachname" required error={errors.name} autoComplete="name" />
        <Field id="phone" label="Telefonnummer" required error={errors.phone} type="tel" autoComplete="tel" />
        <Field id="email" label="E-Mail (optional)" error={errors.email} type="email" autoComplete="email" />
        <Field id="date" label="Gewünschtes Fahrtdatum" required error={errors.date} type="date" />
        <Field id="time" label="Gewünschte Uhrzeit" required error={errors.time} type="time" />
        <SelectField id="reason" label="Fahrtart beziehungsweise Anlass" required error={errors.reason} options={rideReasons} />
        <Field id="pickup" label="Abholadresse" required error={errors.pickup} autoComplete="street-address" />
        <Field id="destination" label="Zieladresse" required error={errors.destination} />
        <SelectField id="journey" label="Gewünschte Fahrt" required error={errors.journey} options={["Nur Hinfahrt", "Hin- und Rückfahrt"]} />
        <div className="md:col-span-2">
          <label htmlFor="request-notes" className="form-label">Zusätzliche Hinweise (optional)</label>
          <textarea id="request-notes" name="notes" rows={4} className="form-control min-h-28 resize-y" aria-describedby="request-notes-help" />
          <p id="request-notes-help" className="mt-2 text-[14px] leading-[1.55] text-[#5b697a]">Bitte keine medizinischen Diagnosen oder Notfalldaten übermitteln.</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl p-2 text-base leading-[1.6] text-[#5b697a] transition-colors hover:bg-[#f6f9fc]" htmlFor="request-consent">
          <input id="request-consent" name="consent" type="checkbox" className="mt-0.5 size-6 shrink-0 accent-green" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "request-consent-error" : undefined} />
          <span>Ich bin damit einverstanden, zur Bearbeitung meiner Anfrage telefonisch oder per E-Mail kontaktiert zu werden. <span aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <p id="request-consent-error" className="mt-2 text-sm font-semibold text-red-700">{errors.consent}</p>}
      </div>

      <button type="submit" className="mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-xl bg-green px-8 text-[17px] font-semibold text-navy shadow-sm transition-[background-color,box-shadow] hover:bg-green-light hover:shadow-md disabled:cursor-not-allowed disabled:bg-navy/20 sm:w-auto sm:min-w-72">Anfrage technisch prüfen</button>
      {isPrepared && <div role="status" tabIndex={-1} className="mt-6 rounded-xl border border-green/40 bg-[#f0f7eb] p-4 text-base leading-relaxed text-navy">Das Formular ist technisch vorbereitet. Die Übermittlung wird in einem späteren Entwicklungsschritt aktiviert.</div>}
    </form>
  );
}

type FieldProps = { id: string; label: string; error?: string; required?: boolean; type?: string; autoComplete?: string };

function Field({ id, label, error, required, type = "text", autoComplete }: FieldProps) {
  const inputId = `request-${id}`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input id={inputId} name={id} type={type} autoComplete={autoComplete} className="form-control" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <p id={errorId} className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}

type SelectFieldProps = { id: string; label: string; options: readonly string[]; error?: string; required?: boolean };

function SelectField({ id, label, options, error, required }: SelectFieldProps) {
  const inputId = `request-${id}`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
      <select id={inputId} name={id} className="form-control" defaultValue="" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
        <option value="">Bitte auswählen</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <p id={errorId} className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}
