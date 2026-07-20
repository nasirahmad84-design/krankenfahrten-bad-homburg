import type { RideRequest, RideRequestFieldErrors } from "./validation/ride-request";

export type RideRequestPayload = RideRequest & Readonly<{
  consent: true;
  website: string;
  formStartedAt: number;
}>;

export type RideRequestResponse =
  | Readonly<{ success: true; message: string }>
  | Readonly<{ success: false; type: "validation"; errors: RideRequestFieldErrors }>
  | Readonly<{ success: false; type: "server" | "timeout"; message?: string }>;

export function createRideRequestPayload(data: RideRequest, formData: FormData): RideRequestPayload {
  return {
    ...data,
    consent: true,
    website: String(formData.get("website") ?? ""),
    formStartedAt: Number(formData.get("formStartedAt")),
  };
}

export async function postRideRequest(
  payload: RideRequestPayload,
  fetchImplementation: typeof fetch = fetch,
  timeoutMs = 12_000,
): Promise<RideRequestResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImplementation("/api/fahrtanfrage.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      signal: controller.signal,
    });
    const body = await readJsonResponse(response);
    if (response.ok && body.success === true) return { success: true, message: typeof body.message === "string" ? body.message : "Anfrage wurde übermittelt." };
    if (response.status === 400 && body.type === "validation" && isErrorRecord(body.errors)) return { success: false, type: "validation", errors: body.errors };
    return { success: false, type: "server", message: typeof body.message === "string" ? body.message : undefined };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return { success: false, type: "timeout" };
    return { success: false, type: "server" };
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonResponse(response: Response): Promise<Record<string, unknown>> {
  try {
    const value: unknown = await response.json();
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function isErrorRecord(value: unknown): value is RideRequestFieldErrors {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.values(value).every((message) => typeof message === "string"));
}
