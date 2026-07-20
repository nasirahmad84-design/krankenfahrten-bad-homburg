import assert from "node:assert/strict";
import test from "node:test";

import { createRideRequestPayload, postRideRequest, type RideRequestPayload } from "../src/lib/ride-request-client.ts";
import { validateRideRequest, type RideRequest } from "../src/lib/validation/ride-request.ts";

const now = new Date("2026-07-20T10:00:00.000Z");
const request: RideRequest = { name: "Erika Muster", phone: "06172 123456", email: "erika@example.com", date: "2026-07-21", time: "09:30", pickup: "Basler Str. 3, Bad Homburg", destination: "Musterstraße 1, Frankfurt", reason: "Arzt- oder Kliniktermin", journey: "Hin- und Rückfahrt", notes: "Bitte am Empfang melden." };
const payload: RideRequestPayload = { ...request, consent: true, website: "", formStartedAt: now.getTime() - 5_000 };

test("validiert und normalisiert eine gültige Anfrage", () => {
  const form = validFormData(); form.set("name", "  Erika   Muster  ");
  const result = validateRideRequest(form, now);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.name, "Erika Muster");
});

test("meldet Pflichtfelder und Einwilligung", () => {
  const result = validateRideRequest(new FormData(), now);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.fieldErrors.name && result.fieldErrors.consent);
});

test("prüft optionale E-Mail und optionale Fahrtart", () => {
  const invalid = validFormData(); invalid.set("email", "ungueltig");
  const invalidResult = validateRideRequest(invalid, now);
  assert.equal(invalidResult.success, false);
  const withoutJourney = validFormData(); withoutJourney.delete("journey");
  assert.equal(validateRideRequest(withoutJourney, now).success, true);
});

test("begrenzt lange Hinweise", () => {
  const form = validFormData(); form.set("notes", "x".repeat(1001));
  const result = validateRideRequest(form, now);
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.fieldErrors.notes ?? "", /1000/);
});

test("erstellt nur die erlaubte JSON-Nutzlast", () => {
  const form = validFormData(); form.set("unbekannt", "ignorieren");
  const result = validateRideRequest(form, now);
  assert.equal(result.success, true);
  if (result.success) assert.deepEqual(createRideRequestPayload(result.data, form), payload);
});

test("verarbeitet eine erfolgreiche PHP-Antwort", async () => {
  const fetchMock = async () => new Response(JSON.stringify({ success: true, message: "Anfrage wurde übermittelt." }), { status: 200, headers: { "Content-Type": "application/json" } });
  assert.deepEqual(await postRideRequest(payload, fetchMock), { success: true, message: "Anfrage wurde übermittelt." });
});

test("übernimmt serverseitige Feldfehler", async () => {
  const fetchMock = async () => new Response(JSON.stringify({ success: false, type: "validation", errors: { email: "Ungültig" } }), { status: 400 });
  assert.deepEqual(await postRideRequest(payload, fetchMock), { success: false, type: "validation", errors: { email: "Ungültig" } });
});

test("behandelt Serverfehler und ungültiges JSON neutral", async () => {
  const fetchMock = async () => new Response("Fehler", { status: 500 });
  assert.deepEqual(await postRideRequest(payload, fetchMock), { success: false, type: "server", message: undefined });
});

test("bricht langsame Anfragen nach dem Timeout ab", async () => {
  const fetchMock: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  });
  assert.deepEqual(await postRideRequest(payload, fetchMock, 5), { success: false, type: "timeout" });
});

function validFormData() {
  const form = new FormData();
  for (const [key, value] of Object.entries(request)) if (value) form.set(key, value);
  form.set("consent", "on"); form.set("formStartedAt", String(payload.formStartedAt)); form.set("website", "");
  return form;
}
