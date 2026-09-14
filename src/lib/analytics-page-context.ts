import { productionOrigin } from "./site-url.ts";

/** Only the fixed public campaign is accepted; arbitrary query values never pass through. */
export function analyticsPageContext(href: string, referrer = "") {
  const url = new URL(href);
  if (url.origin !== productionOrigin || /^\/(redaktion|api)(\/|$)/i.test(url.pathname)) {
    return null;
  }

  const campaign = { utm_source: "google", utm_medium: "organic", utm_campaign: "gbp_ratgeber" };
  const isGoogleBusiness = url.pathname.startsWith("/ratgeber/") &&
    Object.entries(campaign).every(([key, value]) => {
      const values = url.searchParams.getAll(key);
      return values.length === 1 && values[0] === value;
    });
  // Do not forward utm_content, utm_term, arbitrary parameters or URL fragments.
  url.search = isGoogleBusiness ? new URLSearchParams(campaign).toString() : "";
  url.hash = "";

  let safeReferrer = "";
  try {
    const referral = new URL(referrer);
    if (referral.protocol === "https:" || referral.protocol === "http:") {
      safeReferrer = referral.origin;
    }
  } catch {
    // Direct visits have no referrer.
  }

  return { page_location: url.href, page_path: url.pathname, page_referrer: safeReferrer };
}
