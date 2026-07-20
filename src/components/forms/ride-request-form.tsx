"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";

import { submitRideRequest, type RideRequestActionState } from "@/app/kontakt/actions";
import { rideReasons } from "@/content/contact";
import type { RideRequestFieldErrors } from "@/lib/validation/ride-request";

const initialState: RideRequestActionState = { status: "initial", message: "", fieldErrors: {} };
const requiredFields = ["name", "phone", "date", "time", "pickup", "destination", "reason", "journey"] as const;

export function RideRequestForm({ formStartedAt }: { formStartedAt: number }) {
  const [state, formAction] = useActionState(submitRideRequest, initialState);
  const [clientErrors, setClientErrors] = useState<RideRequestFieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const statusHeadingRef = useRef<HTMLHeadingElement>(null);
  const preservedValuesRef = useRef<Record<string, string | boolean>>({});
  const errors = { ...state.fieldErrors, ...clientErrors };

  useEffect(() => {
    const firstError = Object.keys(state.fieldErrors)[0];
    if (firstError) document.getElementById(`request-${firstError}`)?.focus();
  }, [state.fieldErrors]);

  useEffect(() => {
    if (state.status === "success") {
      preservedValuesRef.current = {};
      formRef.current?.reset();
      statusHeadingRef.current?.focus();
      return;
    }
    if (state.status === "initial") return;
    const form = formRef.current;
    if (!form) return;
    for (const [name, value] of Object.entries(preservedValuesRef.current)) {
      const control = form.elements.namedItem(name);
      if (control instanceof HTMLInputElement && control.type === "checkbox") control.checked = Boolean(value);
      else if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) control.value = String(value);
    }
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const nextErrors: RideRequestFieldErrors = {};
    for (const name of requiredFields) {
      if (!String(data.get(name) ?? "").trim()) nextErrors[name] = "Bitte füllen Sie dieses Pflichtfeld aus.";
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    if (!data.get("consent")) nextErrors.consent = "Bitte stimmen Sie der Kontaktaufnahme zu.";
    preservedValuesRef.current = Object.fromEntries(
      ["name", "phone", "email", "date", "time", "pickup", "destination", "reason", "journey", "notes"].map((name) => [name, String(data.get(name) ?? "")]),
    );
    preservedValuesRef.current.consent = Boolean(data.get("consent"));
    setClientErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (!firstError) return;
    event.preventDefault();
    requestAnimationFrame(() => document.getElementById(`request-${firstError}`)?.focus());
  }

  return (
    <form ref={formRef} action={formAction} noValidate onSubmit={handleSubmit} className="rounded-[20px] border border-[#dce2e9] bg-white p-4 shadow-[0_12px_32px_rgba(2,31,88,0.07)] sm:rounded-[22px] sm:p-8" aria-label="Fahrt unverbindlich anfragen">
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <div className="pointer-events-none absolute left-[-10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="request-website">Website</label>
        <input id="request-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <Field id="name" label="Vorname und Nachname" required error={errors.name} autoComplete="name" maxLength={120} />
        <Field id="phone" label="Telefonnummer" required error={errors.phone} type="tel" autoComplete="tel" maxLength={40} />
        <Field id="email" label="E-Mail (optional)" error={errors.email} type="email" autoComplete="email" maxLength={254} />
        <Field id="date" label="Gewünschtes Fahrtdatum" required error={errors.date} type="date" />
        <Field id="time" label="Gewünschte Uhrzeit" required error={errors.time} type="time" />
        <SelectField id="reason" label="Fahrtart beziehungsweise Anlass" required error={errors.reason} options={rideReasons} />
        <Field id="pickup" label="Abholadresse" required error={errors.pickup} autoComplete="street-address" maxLength={200} />
        <Field id="destination" label="Zieladresse" required error={errors.destination} maxLength={200} />
        <SelectField id="journey" label="Gewünschte Fahrt" required error={errors.journey} options={["Nur Hinfahrt", "Hin- und Rückfahrt"]} />
        <div className="md:col-span-2">
          <label htmlFor="request-notes" className="form-label">Zusätzliche Hinweise (optional)</label>
          <textarea id="request-notes" name="notes" rows={4} maxLength={1000} className="form-control min-h-28 resize-y" aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "request-notes-help request-notes-error" : "request-notes-help"} />
          <p id="request-notes-help" className="mt-2 text-[14px] leading-[1.55] text-[#5b697a]">Bitte geben Sie keine medizinischen Diagnosen oder Notfalldaten ein.</p>
          {errors.notes && <FieldError id="request-notes-error" message={errors.notes} />}
        </div>
      </div>

      <div className="mt-6">
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl p-2 text-base leading-[1.6] text-[#5b697a] transition-colors hover:bg-[#f6f9fc]" htmlFor="request-consent">
          <input id="request-consent" name="consent" type="checkbox" className="mt-0.5 size-6 shrink-0 accent-green" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "request-consent-error" : undefined} />
          <span>Ich bin damit einverstanden, zur Bearbeitung meiner Anfrage telefonisch oder per E-Mail kontaktiert zu werden. <span aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <FieldError id="request-consent-error" message={errors.consent} />}
      </div>

      <SubmitButton />
      <div aria-live="polite" aria-atomic="true">
        {state.status !== "initial" && (
          <section className={`mt-6 rounded-xl border p-4 text-base leading-relaxed ${state.status === "success" ? "border-green/40 bg-[#f0f7eb] text-navy" : "border-red-700/30 bg-red-50 text-red-950"}`} role={state.status === "success" ? "status" : "alert"}>
            <h3 ref={statusHeadingRef} tabIndex={state.status === "success" ? -1 : undefined} className="font-bold">{state.status === "success" ? "Anfrage übermittelt" : "Übermittlung nicht abgeschlossen"}</h3>
            <p className="mt-1">{state.message}</p>
          </section>
        )}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-disabled={pending} className="mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-xl bg-green px-8 text-[17px] font-semibold text-navy shadow-sm transition-[background-color,box-shadow] hover:bg-green-light hover:shadow-md disabled:cursor-not-allowed disabled:bg-navy/20 sm:w-auto sm:min-w-72">{pending ? "Anfrage wird übermittelt …" : "Anfrage übermitteln"}</button>;
}

type FieldProps = { id: string; label: string; error?: string; required?: boolean; type?: string; autoComplete?: string; maxLength?: number };

function Field({ id, label, error, required, type = "text", autoComplete, maxLength }: FieldProps) {
  const inputId = `request-${id}`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label>
      <input id={inputId} name={id} type={type} autoComplete={autoComplete} maxLength={maxLength} className="form-control" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <FieldError id={errorId} message={error} />}
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
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} className="mt-2 text-sm font-semibold text-red-700">{message}</p>;
}
