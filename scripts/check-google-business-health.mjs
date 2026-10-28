import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkPublisherHeartbeat } from "./check-blog-health.mjs";
import { googleQueue } from "./run-google-business-queue.mjs";

const response = JSON.parse(execFileSync("gh", ["api", "repos/nasirahmad84-design/krankenfahrten-bad-homburg/actions/workflows/google-business.yml/runs?per_page=30"], { encoding: "utf8" }));
const health = checkPublisherHeartbeat(response.workflow_runs);
if (health === "running") {
  console.log("Google-Pipeline läuft noch innerhalb des Zeitfensters.");
} else {
  const directory = process.env.GBP_STATE_DIRECTORY;
  if (!directory) throw new Error("Dauerhafter Google-Versandstatus fehlt.");
  const states = readdirSync(directory).filter(name => name.endsWith(".json")).map(name => JSON.parse(readFileSync(resolve(directory, name), "utf8")));
  for (const item of googleQueue(process.cwd())) {
    if (!item.published) throw new Error("Google-Beitrag wartet weiterhin auf den fälligen Live-Artikel.");
    const state = states.find(value => value.articleSlug === item.article.slug);
    if (!state || state.payloadHash !== item.hash || !["LIVE", "PROCESSING"].includes(state.status)) throw new Error("Fälliger Google-Beitrag ohne bestätigten Versandstatus.");
    if (state.status === "PROCESSING" && Date.now() - Date.parse(state.firstSeenAt) > 86400000) throw new Error("Google-Beitrag seit über 24 Stunden in Prüfung.");
  }
  console.log("Google-Publisher-Start und fällige Beitragsstatus geprüft.");
}
