export const rideRequestFields = ["name", "phone", "email", "date", "time", "pickup", "destination", "reason", "journey", "notes", "consent"] as const;

export type RideRequestField = (typeof rideRequestFields)[number];
export type RideRequestFieldErrors = Partial<Record<RideRequestField, string>>;

export type RideRequest = Readonly<{
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  reason: string;
  journey?: "Nur Hinfahrt" | "Hin- und Rückfahrt";
  notes?: string;
}>;

export type RideRequestValidationResult =
  | Readonly<{ success: true; data: RideRequest }>
  | Readonly<{ success: false; fieldErrors: RideRequestFieldErrors }>;

const allowedReasons = new Set([
  "Arzt- oder Kliniktermin",
  "Dialyse",
  "Chemo- oder Strahlentherapie",
  "Reha oder Therapie",
  "Entlassungsfahrt",
  "Serienfahrt",
  "Sonstiger Fahrtanlass",
]);
const allowedJourneys = new Set(["Nur Hinfahrt", "Hin- und Rückfahrt"] as const);
const emailPattern = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
const phonePattern = /^[+()0-9\s./-]{5,40}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const limits = { name: 120, phone: 40, email: 254, pickup: 200, destination: 200, reason: 80, journey: 40, notes: 1000 } as const;

export function validateRideRequest(formData: FormData, now = new Date()): RideRequestValidationResult {
  const values = {
    name: normalizeSingleLine(formData.get("name")),
    phone: normalizeSingleLine(formData.get("phone")),
    email: normalizeSingleLine(formData.get("email")),
    date: normalizeSingleLine(formData.get("date")),
    time: normalizeSingleLine(formData.get("time")),
    pickup: normalizeSingleLine(formData.get("pickup")),
    destination: normalizeSingleLine(formData.get("destination")),
    reason: normalizeSingleLine(formData.get("reason")),
    journey: normalizeSingleLine(formData.get("journey")),
    notes: normalizeMultiline(formData.get("notes")),
  };
  const fieldErrors: RideRequestFieldErrors = {};

  requireWithinLimit(values.name, "name", limits.name, fieldErrors);
  requireWithinLimit(values.phone, "phone", limits.phone, fieldErrors);
  requireWithinLimit(values.pickup, "pickup", limits.pickup, fieldErrors);
  requireWithinLimit(values.destination, "destination", limits.destination, fieldErrors);
  requireWithinLimit(values.reason, "reason", limits.reason, fieldErrors);

  if (values.email.length > limits.email) fieldErrors.email = `Bitte verwenden Sie höchstens ${limits.email} Zeichen.`;
  else if (values.email && !emailPattern.test(values.email)) fieldErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";

  if (values.phone && !phonePattern.test(values.phone)) fieldErrors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
  if (!allowedReasons.has(values.reason)) fieldErrors.reason = "Bitte wählen Sie einen gültigen Anlass aus.";
  if (values.journey && !allowedJourneys.has(values.journey as "Nur Hinfahrt" | "Hin- und Rückfahrt")) fieldErrors.journey = "Bitte wählen Sie eine gültige Fahrt aus.";
  if (!isPlausibleDate(values.date, now)) fieldErrors.date = "Bitte wählen Sie ein gültiges zukünftiges Fahrtdatum.";
  if (!timePattern.test(values.time)) fieldErrors.time = "Bitte wählen Sie eine gültige Uhrzeit.";
  if (values.notes.length > limits.notes) fieldErrors.notes = `Bitte verwenden Sie höchstens ${limits.notes} Zeichen.`;
  if (formData.get("consent") !== "on") fieldErrors.consent = "Bitte erteilen Sie die ausdrückliche Einwilligung zur Bearbeitung Ihrer Anfrage.";

  if (Object.keys(fieldErrors).length > 0) return { success: false, fieldErrors };

  return {
    success: true,
    data: {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      date: values.date,
      time: values.time,
      pickup: values.pickup,
      destination: values.destination,
      reason: values.reason,
      journey: values.journey ? values.journey as "Nur Hinfahrt" | "Hin- und Rückfahrt" : undefined,
      notes: values.notes || undefined,
    },
  };
}

function normalizeSingleLine(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim() : "";
}

function normalizeMultiline(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function requireWithinLimit(value: string, field: RideRequestField, max: number, errors: RideRequestFieldErrors) {
  if (!value) errors[field] = "Bitte füllen Sie dieses Pflichtfeld aus.";
  else if (value.length > max) errors[field] = `Bitte verwenden Sie höchstens ${max} Zeichen.`;
}

function isPlausibleDate(value: string, now: Date) {
  if (!datePattern.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const latest = new Date(today);
  latest.setUTCFullYear(latest.getUTCFullYear() + 2);
  return parsed.getTime() >= today && parsed.getTime() <= latest.getTime();
}
