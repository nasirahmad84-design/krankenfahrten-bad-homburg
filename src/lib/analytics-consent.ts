"use client";

import { siteConfig } from "@/lib/site-config";
import { analyticsPageContext } from "./analytics-page-context.ts";

export type AnalyticsConsent = "granted" | "denied" | "unset";

export const analyticsConsentCookieName = "kfbh_analytics_consent";
export const analyticsConsentMaxAgeSeconds = 60 * 60 * 24 * 180;
export const analyticsConsentEventName = "kfbh:analytics-consent";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __kfbhAnalyticsInitialized?: boolean;
  }
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === "undefined") return "unset";
  const stored = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${analyticsConsentCookieName}=`))
    ?.split("=")[1];

  return stored === "granted" || stored === "denied" ? stored : "unset";
}

export function subscribeAnalyticsConsent(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(analyticsConsentEventName, callback);
  return () => window.removeEventListener(analyticsConsentEventName, callback);
}

export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, "unset">) {
  if (typeof window === "undefined") return;

  document.cookie = `${analyticsConsentCookieName}=${consent}; Path=/; Max-Age=${analyticsConsentMaxAgeSeconds}; SameSite=Lax; Secure`;

  if (consent === "denied") {
    window.gtag?.("consent", "update", deniedConsentState);
    removeGoogleAnalyticsCookies();
  }

  window.dispatchEvent(
    new CustomEvent<Exclude<AnalyticsConsent, "unset">>(analyticsConsentEventName, {
      detail: consent,
    }),
  );
}

export function initializeGoogleAnalytics() {
  if (
    typeof window === "undefined" ||
    getAnalyticsConsent() !== "granted" ||
    window.__kfbhAnalyticsInitialized
  ) {
    return;
  }

  const context = analyticsPageContext(window.location.href, document.referrer);
  if (!context) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag() {
    // Google Tag expects the native arguments object in the dataLayer queue.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag("consent", "default", deniedConsentState);
  window.gtag("consent", "update", {
    ...deniedConsentState,
    analytics_storage: "granted",
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("js", new Date());
  window.gtag("config", siteConfig.analytics.measurementId, {
    ...context,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: analyticsConsentMaxAgeSeconds,
    cookie_flags: "SameSite=Lax;Secure",
  });

  const script = document.createElement("script");
  script.id = "google-analytics-tag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(siteConfig.analytics.measurementId)}`;
  document.head.append(script);
  window.__kfbhAnalyticsInitialized = true;
}

export function trackPageView(pathname: string) {
  if (!canTrack()) return;
  const context = analyticsPageContext(window.location.href, document.referrer);
  if (!context || context.page_path !== pathname) return;
  window.gtag?.("set", context);
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    ...context,
  });
}

export function trackAnalyticsEvent(
  eventName: "generate_lead" | "click_phone" | "click_whatsapp" | "click_google_review",
) {
  if (!canTrack()) return;
  const context = analyticsPageContext(window.location.href, document.referrer);
  if (!context) return;
  window.gtag?.("event", eventName, { transport_type: "beacon", ...context });
}

function canTrack() {
  return (
    typeof window !== "undefined" &&
    analyticsPageContext(window.location.href) !== null &&
    getAnalyticsConsent() === "granted" &&
    window.__kfbhAnalyticsInitialized === true
  );
}

function removeGoogleAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat")) {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
    }
  }
}

const deniedConsentState = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;
