"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { rideReasons } from "@/content/contact";
import { createRideRequestPayload, postRideRequest } from "@/lib/ride-request-client";
import { validateRideRequest, type RideRequestFieldErrors } from "@/lib/validation/ride-request";

type FormStatus = Readonly<{ kind: "initial" | "submitting" | "validation_error" | "server_error" | "success"; message: string }>;
const initialStatus: FormStatus = { kind: "initial", message: "" };
const successMessage = "Vielen Dank. Ihre Anfrage wurde übermittelt. Sie ist erst nach unserer ausdrücklichen Bestätigung verbindlich.";
const errorMessage = "Die Anfrage konnte momentan nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns unter 0175 4142222 an.";

export function RideRequestForm() {
  const [errors, setErrors] = useState<RideRequestFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formStartedAtRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submissionLockRef = useRef(false);

  useEffect(() => {
    if (formStartedAtRef.current) formStartedAtRef.current.value = String(Date.now());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLockRef.current) return;
    const formData = new FormData(event.currentTarget);
    const validation = validateRideRequest(formData);
    if (!validation.success) {
      setErrors(validation.fieldErrors);
      setStatus({ kind: "validation_error", message: "Bitte prüfen Sie die markierten Felder." });
      focusFirstError(validation.fieldErrors);
      return;
    }

    submissionLockRef.current = true;
    setIsSubmitting(true);
    setErrors({});
    setStatus({ kind: "submitting", message: "Anfrage wird übermittelt …" });
    const result = await postRideRequest(createRideRequestPayload(validation.data, formData));

    if (result.success) {
      formRef.current?.reset();
      if (formStartedAtRef.current) formStartedAtRef.current.value = String(Date.now());
      setStatus({ kind: "success", message: successMessage });
      requestAnimationFrame(() => successHeadingRef.current?.focus());
    } else if (result.type === "validation") {
      setErrors(result.errors);
      setStatus({ kind: "validation_error", message: "Bitte prüfen Sie die markierten Felder." });
      focusFirstError(result.errors);
    } else {
      setStatus({ kind: "server_error", message: errorMessage });
    }

    submissionLockRef.current = false;
    setIsSubmitting(false);
  }

  return (
    <form ref={formRef} action="/api/fahrtanfrage.php" method="post" noValidate onSubmit={handleSubmit} className="relative rounded-[20px] border border-[#dce2e9] bg-white p-4 shadow-[0_12px_32px_rgba(2,31,88,0.07)] sm:rounded-[22px] sm:p-8" aria-label="Fahrt unverbindlich anfragen">
      <input ref={formStartedAtRef} type="hidden" name="formStartedAt" defaultValue="0" />
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
        <SelectField id="journey" label="Gewünschte Fahrt (optional)" error={errors.journey} options={["Nur Hinfahrt", "Hin- und Rückfahrt"]} />
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
          <span>Ich willige ausdrücklich ein, dass meine Angaben – einschließlich des gewählten Fahrtanlasses und möglicher gesundheitsbezogener Angaben – zur Bearbeitung der Fahrtanfrage verarbeitet werden und ich hierzu telefonisch oder per E-Mail kontaktiert werde. Die Einwilligung kann ich jederzeit mit Wirkung für die Zukunft widerrufen. <span aria-hidden="true">*</span></span>
        </label>
        {errors.consent && <FieldError id="request-consent-error" message={errors.consent} />}
        <p className="mt-2 pl-2 text-[14px] leading-relaxed text-[#5b697a]">Informationen zur Verarbeitung Ihrer Angaben finden Sie in der <Link className="font-semibold text-navy underline decoration-green decoration-2 underline-offset-4" href="/datenschutz/">Datenschutzerklärung</Link>.</p>
      </div>

      <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting} className="mt-7 inline-flex min-h-[58px] w-full items-center justify-center rounded-xl bg-green px-8 text-[17px] font-semibold text-navy shadow-sm transition-[background-color,box-shadow] hover:bg-green-light hover:shadow-md disabled:cursor-not-allowed disabled:bg-navy/20 sm:w-auto sm:min-w-72">{isSubmitting ? "Anfrage wird übermittelt …" : "Anfrage übermitteln"}</button>
      <div aria-live="polite" aria-atomic="true">
        {status.kind !== "initial" && status.kind !== "submitting" && (
          <section className={`mt-6 rounded-xl border p-4 text-base leading-relaxed ${status.kind === "success" ? "border-green/40 bg-[#f0f7eb] text-navy" : "border-red-700/30 bg-red-50 text-red-950"}`} role={status.kind === "success" ? "status" : "alert"}>
            <h3 ref={successHeadingRef} tabIndex={status.kind === "success" ? -1 : undefined} className="font-bold">{status.kind === "success" ? "Anfrage übermittelt" : "Übermittlung nicht abgeschlossen"}</h3>
            <p className="mt-1">{status.message}</p>
          </section>
        )}
        {status.kind === "submitting" && <p className="sr-only">{status.message}</p>}
      </div>
    </form>
  );
}

function focusFirstError(errors: RideRequestFieldErrors) {
  const firstError = Object.keys(errors)[0];
  if (firstError) requestAnimationFrame(() => document.getElementById(`request-${firstError}`)?.focus());
}

type FieldProps = { id: string; label: string; error?: string; required?: boolean; type?: string; autoComplete?: string; maxLength?: number };

function Field({ id, label, error, required, type = "text", autoComplete, maxLength }: FieldProps) {
  const inputId = `request-${id}`;
  const errorId = `${inputId}-error`;
  return <div><label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label><input id={inputId} name={id} type={type} autoComplete={autoComplete} maxLength={maxLength} className="form-control" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />{error && <FieldError id={errorId} message={error} />}</div>;
}

type SelectFieldProps = { id: string; label: string; options: readonly string[]; error?: string; required?: boolean };

function SelectField({ id, label, options, error, required }: SelectFieldProps) {
  const inputId = `request-${id}`;
  const errorId = `${inputId}-error`;
  return <div><label htmlFor={inputId} className="form-label">{label}{required && <span aria-hidden="true"> *</span>}</label><select id={inputId} name={id} className="form-control" defaultValue="" required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}><option value="">Bitte auswählen</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{error && <FieldError id={errorId} message={error} />}</div>;
}

function FieldError({ id, message }: { id: string; message: string }) {
  return <p id={id} className="mt-2 text-sm font-semibold text-red-700">{message}</p>;
}
