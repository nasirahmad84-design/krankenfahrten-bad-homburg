import {execFileSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {berlinDate, selectDueRun} from "./lib/blog-queue.mjs";

export function checkPublisherHeartbeat(runs, now = new Date()) {
  const latest = runs.filter(run => run.conclusion !== "skipped")
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
  const age = latest ? now.getTime() - Date.parse(latest.created_at) : NaN;
  if (!Number.isFinite(age) || age < 0 || age > 36 * 60 * 60 * 1000) {
    throw new Error("Seit über 36 Stunden kein tatsächlicher Publisher-Start. Zeitsteuerung prüfen.");
  }
  if (latest.status !== "completed" && age < 45 * 60 * 1000) return "running";
  if (latest.status !== "completed" || latest.conclusion !== "success") {
    throw new Error("Letzter tatsächlicher Publisher-Lauf ist nicht erfolgreich abgeschlossen.");
  }
  return "healthy";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const response = JSON.parse(execFileSync("gh", ["api",
    "repos/nasirahmad84-design/krankenfahrten-bad-homburg/actions/workflows/blog-manual.yml/runs?per_page=30"],
  {encoding: "utf8"}));
  const state = checkPublisherHeartbeat(response.workflow_runs);
  if (state === "running") {
    console.log("Ein Publisher-Lauf arbeitet noch innerhalb des erlaubten Zeitfensters; keine Fehlalarmierung.");
  } else {
    const queue = selectDueRun(process.cwd(), berlinDate());
    if (queue.status === "ready") throw new Error("Ein freigegebener Artikel ist weiterhin fällig, obwohl die Tagesläufe abgeschlossen sein sollten.");
    console.log("Publisher-Start, letzter Lauf und fällige Freigaben geprüft.");
  }
}
