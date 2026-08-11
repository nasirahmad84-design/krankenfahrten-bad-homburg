import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const siteUrlSource = readFileSync(join(root, "src/lib/site-url.ts"), "utf8");
const servicesSource = readFileSync(join(root, "src/content/services.ts"), "utf8");
const locationsSource = readFileSync(join(root, "src/content/locations.ts"), "utf8");
const blogPostsSource = readFileSync(join(root, "src/content/generated-blog-posts.ts"), "utf8");
const origin = siteUrlSource.match(/productionOrigin\s*=\s*"([^"]+)"/)?.[1];
const topLevelBlock = siteUrlSource.match(/const topLevelRoutes\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];

if (!origin || !topLevelBlock) throw new Error("Produktionsdomain oder öffentliche Routen konnten nicht gelesen werden.");

const topLevelRoutes = [...topLevelBlock.matchAll(/"(\/[^\"]*)"/g)].map((match) => match[1]);
const serviceRoutes = [...servicesSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => `/leistungen/${match[1]}/`);
const locationRoutes = [...locationsSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => `/orte/${match[1]}/`);
const blogRoutes = [...blogPostsSource.matchAll(/^\s{4}"slug":\s*"([^"]+)"/gm)].map((match) => `/ratgeber/${match[1]}/`);
const routes = [...new Set([...topLevelRoutes, ...serviceRoutes, ...locationRoutes, ...blogRoutes])];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${escapeXml(new URL(route, origin).toString())}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  "",
  `Sitemap: ${origin}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(join(root, "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(join(root, "public/robots.txt"), robots, "utf8");
console.log(`SEO-Dateien erzeugt: ${routes.length} Sitemap-URLs.`);

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
