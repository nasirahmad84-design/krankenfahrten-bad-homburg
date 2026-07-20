import type { RideRequest } from "../validation/ride-request";

export type EmailMessage = Readonly<{
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}>;

export type EmailSendResult = Readonly<{ ok: true }> | Readonly<{ ok: false; reason: "not_configured" | "provider_error" }>;

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export type RideRequestEmailConfig = Readonly<{
  to: string;
  from: string;
  publicEmail: string;
  phone: string;
}>;

export type RideRequestDeliveryResult =
  | Readonly<{ ok: true; confirmationSent: boolean }>
  | Readonly<{ ok: false; reason: "not_configured" | "provider_error" }>;

const emailPattern = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;

export function createEmailProvider(env: NodeJS.ProcessEnv = process.env): EmailProvider {
  const mockDelay = Math.min(Math.max(Number(env.MOCK_EMAIL_DELAY_MS) || 0, 0), 2_000);
  if (env.NODE_ENV !== "production" && env.EMAIL_PROVIDER === "mock-success") return new MockEmailProvider({ ok: true }, mockDelay);
  if (env.NODE_ENV !== "production" && env.EMAIL_PROVIDER === "mock-error") return new MockEmailProvider({ ok: false, reason: "provider_error" }, mockDelay);
  if (env.EMAIL_PROVIDER !== "resend" || !env.EMAIL_API_KEY) return new DevelopmentEmailProvider();
  return new ResendEmailProvider(env.EMAIL_API_KEY);
}

export function getRideRequestEmailConfig(env: NodeJS.ProcessEnv = process.env, publicEmail: string, phone: string): RideRequestEmailConfig | null {
  const to = sanitizeEmail(env.CONTACT_EMAIL_TO);
  const from = sanitizeEmail(env.CONTACT_EMAIL_FROM);
  if (!to || !from) return null;
  return { to, from, publicEmail, phone };
}

export async function sendRideRequestEmails(
  request: RideRequest,
  provider: EmailProvider,
  config: RideRequestEmailConfig | null,
  requestedAt = new Date(),
): Promise<RideRequestDeliveryResult> {
  if (!config) return { ok: false, reason: "not_configured" };
  const internal = buildInternalEmail(request, config, requestedAt);
  const internalResult = await provider.send(internal);
  if (!internalResult.ok) return internalResult;

  if (!request.email) return { ok: true, confirmationSent: false };
  const confirmation = buildConfirmationEmail(request.email, config);
  const confirmationResult = await provider.send(confirmation);
  return { ok: true, confirmationSent: confirmationResult.ok };
}

export function buildInternalEmail(request: RideRequest, config: RideRequestEmailConfig, requestedAt: Date): EmailMessage {
  const fields = [
    ["Name", request.name], ["Telefon", request.phone], ["E-Mail", request.email ?? "Nicht angegeben"],
    ["Fahrtdatum", request.date], ["Uhrzeit", request.time], ["Abholadresse", request.pickup],
    ["Zieladresse", request.destination], ["Fahrtart", request.reason], ["Fahrt", request.journey],
    ["Zusätzliche Hinweise", request.notes ?? "Keine"], ["Zeitpunkt der Anfrage", requestedAt.toISOString()],
  ] as const;
  const notice = "Diese Anfrage ist noch keine bestätigte Buchung.";
  const text = `${notice}\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}`;
  const htmlRows = fields.map(([label, value]) => `<tr><th style="padding:6px 12px 6px 0;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("");
  return {
    to: config.to,
    from: config.from,
    subject: "Neue Fahrtanfrage über krankenfahrten-bad-homburg.de",
    text,
    html: `<p><strong>${escapeHtml(notice)}</strong></p><table role="presentation" style="border-collapse:collapse">${htmlRows}</table>`,
    replyTo: request.email,
  };
}

export function buildConfirmationEmail(recipient: string, config: RideRequestEmailConfig): EmailMessage {
  const message = "Wir haben Ihre Anfrage erhalten. Eine Fahrt gilt erst nach unserer ausdrücklichen Bestätigung als vereinbart.";
  const followUp = `Wir melden uns telefonisch oder per E-Mail. In akuten Notfällen wählen Sie 112. Kontakt: ${config.phone}, ${config.publicEmail}`;
  return {
    to: recipient,
    from: config.from,
    subject: "Eingang Ihrer Fahrtanfrage",
    text: `${message}\n\n${followUp}`,
    html: `<p>${escapeHtml(message)}</p><p>${escapeHtml(followUp)}</p>`,
  };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

class DevelopmentEmailProvider implements EmailProvider {
  async send(): Promise<EmailSendResult> {
    return { ok: false, reason: "not_configured" };
  }
}

class MockEmailProvider implements EmailProvider {
  constructor(privateResult: EmailSendResult, delayMs = 0) { this.result = privateResult; this.delayMs = delayMs; }
  private readonly result: EmailSendResult;
  private readonly delayMs: number;
  async send(): Promise<EmailSendResult> {
    if (this.delayMs) await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    return this.result;
  }
}

class ResendEmailProvider implements EmailProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: message.from, to: [message.to], subject: cleanHeader(message.subject), text: message.text, html: message.html, reply_to: message.replyTo }),
        signal: AbortSignal.timeout(10_000),
      });
      return response.ok ? { ok: true } : { ok: false, reason: "provider_error" };
    } catch {
      return { ok: false, reason: "provider_error" };
    }
  }
}

function sanitizeEmail(value: string | undefined) {
  const normalized = value?.trim() ?? "";
  return emailPattern.test(normalized) ? normalized : null;
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}
