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
  if (latest.status !== "completed" || latest.conclusion !== "success") {
    throw new Error("Letzter tatsächlicher Publisher-Lauf ist nicht erfolgreich abgeschlossen.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const response = JSON.parse(execFileSync("gh", ["api",
    "repos/nasirahmad84-design/krankenfahrten-bad-homburg/actions/workflows/blog-manual.yml/runs?per_page=30"],
  {encoding: "utf8"}));
  checkPublisherHeartbeat(response.workflow_runs);
  selectDueRun(process.cwd(), berlinDate());
  console.log("Publisher-Start, letzter Lauf und fällige Freigaben geprüft.");
}
