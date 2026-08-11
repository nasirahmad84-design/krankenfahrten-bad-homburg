import { copyFileSync, mkdirSync } from "node:fs";
import { basename, join, resolve, sep } from "node:path";

import { assertValid, validateRun } from "./lib/blog-pipeline.mjs";

const runDirectoryArgument = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
if (!runDirectoryArgument) {
  console.error("Verwendung: npm run blog:promote -- automation/blog/articles/RUN-ID [--dry-run]");
  process.exit(2);
}

try {
  const runDirectory = resolve(runDirectoryArgument);
  const articlesDirectory = resolve("automation/blog/articles");
  if (!`${runDirectory}${sep}`.startsWith(`${articlesDirectory}${sep}`)) {
    throw new Error("Der Lauf muss unter automation/blog/articles/ liegen.");
  }
  const result = validateRun(runDirectory, { requirePublishable: true });
  assertValid(result.errors);
  const publishedDirectory = resolve("automation/blog/published");
  const target = join(publishedDirectory, `${result.article.slug}.json`);
  if (dryRun) {
    console.log(`Freigabeprüfung bestanden: ${basename(runDirectory)} würde nach ${target} übernommen.`);
  } else {
    mkdirSync(publishedDirectory, { recursive: true });
    copyFileSync(join(runDirectory, "article.json"), target);
    console.log(`Ratgeberbeitrag übernommen: ${target}`);
  }
} catch (error) {
  console.error(`Übernahme abgebrochen:\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
