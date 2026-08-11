import { allServices } from "../content/services.ts";
import { regionalLocations } from "../content/locations.ts";
import { publishedBlogPosts } from "../content/blog-posts.ts";

export const productionOrigin = "https://krankenfahrten-bad-homburg.de";

const topLevelRoutes = [
  "/",
  "/leistungen/",
  "/kosten-abrechnung/",
  "/ablauf/",
  "/ueber-uns/",
  "/faq/",
  "/kontakt/",
  "/orte/",
  "/ratgeber/",
  "/impressum/",
  "/datenschutz/",
  "/cookie-einstellungen/",
] as const;

export const publicRoutePaths = [
  ...topLevelRoutes,
  ...allServices.map(({ slug }) => `/leistungen/${slug}/` as const),
  ...regionalLocations.map(({ slug }) => `/orte/${slug}/` as const),
  ...publishedBlogPosts.map(({ slug }) => `/ratgeber/${slug}/` as const),
] as const;

export function normalizePublicPath(path: string): string {
  if (path === "/") return path;
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(normalizePublicPath(path), productionOrigin).toString();
}
