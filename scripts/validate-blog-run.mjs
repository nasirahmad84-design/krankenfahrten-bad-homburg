import { resolve } from "node:path";

import { assertValid, validateRun } from "./lib/blog-pipeline.mjs";

const runDirectory = process.argv[2];
if (!runDirectory) {
  console.error("Verwendung: npm run blog:validate -- automation/blog/articles/RUN-ID");
  process.exit(2);
}

try {
  const result = validateRun(resolve(runDirectory));
  assertValid(result.errors);
  console.log(`Bloglauf geprüft: ${result.status.runId} (${result.status.status}).`);
} catch (error) {
  console.error(`Bloglauf ungültig:\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
