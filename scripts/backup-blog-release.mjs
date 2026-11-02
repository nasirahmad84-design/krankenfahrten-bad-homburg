import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

// Back up only the public blog delta. Never fetch PHP configuration or user data.
const slug = process.argv[2];
const directory = process.env.BLOG_BACKUP_DIRECTORY;
if (!directory || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || "")) {
  throw new Error("Backup-Verzeichnis und gültiger Artikel-Slug erforderlich.");
}
const paths = new Set(["ratgeber/index.html", "sitemap.xml"]);
for (const base of ["ratgeber", "ratgeber/" + slug]) {
  for (const entry of readdirSync(resolve("out", base), { withFileTypes: true })) {
    if (entry.isFile()) paths.add(base + "/" + entry.name);
  }
}
for (const [target, origin] of [["test", process.env.TEST_SITE_URL], ["live", process.env.LIVE_SITE_URL]]) {
  if (!origin || !/^https:\/\/(test\.)?krankenfahrten-bad-homburg\.de\/?$/.test(origin)) throw new Error("Unerwartetes Backup-Ziel.");
  const records = [];
  for (const path of paths) {
    const response = await fetch(new URL("/" + path, origin), { redirect: "error", signal: AbortSignal.timeout(30000) });
    const required = path === "ratgeber/index.html" || path === "sitemap.xml";
    if (response.status !== 200 && !(response.status === 404 && !required)) {
      throw new Error("Sicherung abgebrochen: " + target + "/" + path + " HTTP " + response.status);
    }
    records.push({ path, status: response.status });
    if (response.status === 200) {
      const filename = resolve(directory, target, path);
      mkdirSync(dirname(filename), { recursive: true });
      writeFileSync(filename, Buffer.from(await response.arrayBuffer()));
    }
  }
  writeFileSync(resolve(directory, target, "manifest.json"), JSON.stringify({ savedAt: new Date().toISOString(), origin, slug, records }, null, 2));
  console.log("Wiederherstellbarer Blog-Stand gesichert: " + target + " (" + records.length + " Pfade).");
}
