import { mkdirSync, writeFileSync } from "node:fs";
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
    const article = { ...result.article };
    const releaseDate = process.env.BLOG_RELEASE_DATE;
    if (releaseDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate) || releaseDate < article.publishedAt
        || releaseDate > result.status.revalidateAfter) throw new Error("Ungültiges oder nicht mehr geprüftes Nachhol-Datum.");
      article.publishedAt = releaseDate;
      article.updatedAt = releaseDate;
    }
    writeFileSync(target, JSON.stringify(article, null, 2) + "\n");
    console.log(`Ratgeberbeitrag übernommen: ${target}`);
  }
} catch (error) {
  console.error(`Übernahme abgebrochen:\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
