"use server";

import { sendRideRequestEmails, createEmailProvider, getRideRequestEmailConfig } from "@/lib/email/send-ride-request";
import { rideRequestRateLimit } from "@/lib/security/rate-limit";
import { isSpamSubmission, validateRideRequest, type RideRequestFieldErrors } from "@/lib/validation/ride-request";
import { siteConfig } from "@/lib/site-config";

export type RideRequestActionState = Readonly<{
  status: "initial" | "validation_error" | "server_error" | "configuration_error" | "success";
  message: string;
  fieldErrors: RideRequestFieldErrors;
}>;

export async function submitRideRequest(_previousState: RideRequestActionState, formData: FormData): Promise<RideRequestActionState> {
  if (isSpamSubmission(formData)) return serverErrorState();

  const rateLimit = rideRequestRateLimit.check("ride-request-form");
  if (!rateLimit.allowed) return serverErrorState("Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es später erneut oder rufen Sie uns an.");

  const validation = validateRideRequest(formData);
  if (!validation.success) {
    return { status: "validation_error", message: "Bitte prüfen Sie die markierten Felder.", fieldErrors: validation.fieldErrors };
  }

  const provider = createEmailProvider();
  const config = getRideRequestEmailConfig(process.env, siteConfig.email.address, siteConfig.phone.display);
  const result = await sendRideRequestEmails(validation.data, provider, config);

  if (!result.ok) {
    if (result.reason === "not_configured" && process.env.NODE_ENV !== "production") {
      return { status: "configuration_error", message: "Der E-Mail-Versand ist lokal noch nicht konfiguriert. Es wurden keine Daten versendet.", fieldErrors: {} };
    }
    return serverErrorState();
  }

  return {
    status: "success",
    message: "Vielen Dank. Ihre Anfrage wurde übermittelt. Sie ist erst nach unserer ausdrücklichen Bestätigung verbindlich.",
    fieldErrors: {},
  };
}

function serverErrorState(message = `Die Anfrage konnte momentan nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns unter ${siteConfig.phone.display} an.`): RideRequestActionState {
  return { status: "server_error", message, fieldErrors: {} };
}
