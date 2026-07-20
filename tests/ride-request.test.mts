import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInternalEmail,
  createEmailProvider,
  sendRideRequestEmails,
  type EmailMessage,
  type EmailProvider,
  type EmailSendResult,
  type RideRequestEmailConfig,
} from "../src/lib/email/send-ride-request.ts";
import { isSpamSubmission, validateRideRequest, type RideRequest } from "../src/lib/validation/ride-request.ts";

const now = new Date("2026-07-20T10:00:00.000Z");
const request: RideRequest = {
  name: "Erika Muster",
  phone: "06172 123456",
  email: "erika@example.com",
  date: "2026-07-21",
  time: "09:30",
  pickup: "Basler Str. 3, Bad Homburg",
  destination: "Musterstraße 1, Frankfurt",
  reason: "Arzt- oder Kliniktermin",
  journey: "Hin- und Rückfahrt",
  notes: "Bitte am Empfang melden.",
};
const config: RideRequestEmailConfig = {
  to: "intern@example.com",
  from: "versand@example.com",
  publicEmail: "anfrage@example.com",
  phone: "0175 4142222",
};

test("validiert eine gültige Anfrage und normalisiert Whitespace", () => {
  const form = validFormData();
  form.set("name", "  Erika   Muster  ");
  const result = validateRideRequest(form, now);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.name, "Erika Muster");
});

test("meldet fehlende Pflichtfelder", () => {
  const result = validateRideRequest(new FormData(), now);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.fieldErrors.name && result.fieldErrors.consent);
});

test("weist eine ungültige optionale E-Mail zurück", () => {
  const form = validFormData();
  form.set("email", "ungueltig");
  const result = validateRideRequest(form, now);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.fieldErrors.email);
});

test("begrenzt lange Eingaben", () => {
  const form = validFormData();
  form.set("notes", "x".repeat(1001));
  const result = validateRideRequest(form, now);
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.fieldErrors.notes ?? "", /1000/);
});

test("erkennt Honeypot und zu schnelle Übermittlung", () => {
  const honeypot = validFormData();
  honeypot.set("website", "spam.example");
  assert.equal(isSpamSubmission(honeypot, now.getTime()), true);
  const tooFast = validFormData();
  tooFast.set("formStartedAt", String(now.getTime() - 100));
  assert.equal(isSpamSubmission(tooFast, now.getTime()), true);
});

test("Development-Provider täuscht ohne Konfiguration keinen Versand vor", async () => {
  const provider = createEmailProvider({ NODE_ENV: "test" });
  const result = await provider.send({ to: "a@example.com", from: "b@example.com", subject: "Test", text: "Test", html: "<p>Test</p>" });
  assert.deepEqual(result, { ok: false, reason: "not_configured" });
  assert.deepEqual(await sendRideRequestEmails(request, provider, null, now), { ok: false, reason: "not_configured" });
});

test("Mock-Provider sind nur außerhalb der Produktion verfügbar", async () => {
  const developmentMock = createEmailProvider({ NODE_ENV: "development", EMAIL_PROVIDER: "mock-success" });
  assert.deepEqual(await developmentMock.send({ to: "a@example.com", from: "b@example.com", subject: "Test", text: "Test", html: "<p>Test</p>" }), { ok: true });
  const productionMock = createEmailProvider({ NODE_ENV: "production", EMAIL_PROVIDER: "mock-success" });
  assert.deepEqual(await productionMock.send({ to: "a@example.com", from: "b@example.com", subject: "Test", text: "Test", html: "<p>Test</p>" }), { ok: false, reason: "not_configured" });
});

test("gibt Provider-Fehler neutral zurück", async () => {
  const provider = new RecordingProvider({ ok: false, reason: "provider_error" });
  assert.deepEqual(await sendRideRequestEmails(request, provider, config, now), { ok: false, reason: "provider_error" });
});

test("versendet intern und bestätigt nur bei vorhandener Nutzer-E-Mail", async () => {
  const withEmail = new RecordingProvider({ ok: true });
  assert.deepEqual(await sendRideRequestEmails(request, withEmail, config, now), { ok: true, confirmationSent: true });
  assert.equal(withEmail.messages.length, 2);

  const withoutEmail = new RecordingProvider({ ok: true });
  const requestWithoutEmail = { ...request, email: undefined };
  assert.deepEqual(await sendRideRequestEmails(requestWithoutEmail, withoutEmail, config, now), { ok: true, confirmationSent: false });
  assert.equal(withoutEmail.messages.length, 1);
});

test("escaped Nutzertext in der internen HTML-E-Mail", () => {
  const message = buildInternalEmail({ ...request, notes: "<script>alert('x')</script>" }, config, now);
  assert.doesNotMatch(message.html, /<script>/);
  assert.match(message.html, /&lt;script&gt;/);
  assert.match(message.text, /keine bestätigte Buchung/);
});

class RecordingProvider implements EmailProvider {
  readonly messages: EmailMessage[] = [];
  private readonly result: EmailSendResult;
  constructor(result: EmailSendResult) { this.result = result; }
  async send(message: EmailMessage) {
    this.messages.push(message);
    return this.result;
  }
}

function validFormData() {
  const form = new FormData();
  for (const [key, value] of Object.entries(request)) if (value) form.set(key, value);
  form.set("consent", "on");
  form.set("formStartedAt", String(now.getTime() - 5_000));
  form.set("website", "");
  return form;
}
