import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { assertValid, parseCsv } from "./lib/blog-pipeline.mjs";

const inventoryPath = resolve("automation/blog/source-inventory.csv");
const [headers = [], ...rows] = parseCsv(readFileSync(inventoryPath, "utf8"));
const errors = [];

for (const cells of rows) {
  const source = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  if (source.type !== "local" || source.status !== "verified") continue;
  const path = resolve(source.location_or_url);
  if (!existsSync(path)) {
    errors.push(`${source.source_id}: lokale Quelle fehlt (${source.location_or_url}).`);
    continue;
  }
  const actualHash = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (actualHash !== source.sha256) errors.push(`${source.source_id}: Prüfsumme ist veraltet (${source.location_or_url}).`);
}

assertValid(errors);
console.log("Lokale Blogquellen geprüft: alle verifizierten Prüfsummen stimmen.");
