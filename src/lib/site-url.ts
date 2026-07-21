import { allServices } from "../content/services.ts";

export const productionOrigin = "https://krankenfahrten-bad-homburg.de";

const topLevelRoutes = [
  "/",
  "/leistungen/",
  "/kosten-abrechnung/",
  "/ablauf/",
  "/ueber-uns/",
  "/faq/",
  "/kontakt/",
  "/impressum/",
  "/datenschutz/",
  "/cookie-einstellungen/",
] as const;

export const publicRoutePaths = [
  ...topLevelRoutes,
  ...allServices.map(({ slug }) => `/leistungen/${slug}/` as const),
] as const;

export function normalizePublicPath(path: string): string {
  if (path === "/") return path;
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePublicPath(path), productionOrigin).toString();
}
