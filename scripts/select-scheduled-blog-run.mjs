import { appendFileSync } from "node:fs";

import { selectScheduledRun } from "./lib/blog-queue.mjs";

const publicationDate = process.env.BLOG_PUBLICATION_DATE || undefined;

try {
  const result = selectScheduledRun(process.cwd(), publicationDate);
  console.log(result.status === "ready"
    ? `Freigegebener Warteschlangenartikel: ${result.runId}`
    : `Kein freigegebener Warteschlangenartikel für ${result.publicationDate}.`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, [
      `status=${result.status}`,
      `publication_date=${result.publicationDate}`,
      `run_directory=${result.runDirectory ?? ""}`,
      `run_id=${result.runId ?? ""}`,
      `slug=${result.slug ?? ""}`,
    ].join("\n") + "\n", "utf8");
  }
} catch (error) {
  console.error(`Warteschlangenauswahl abgebrochen:\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
