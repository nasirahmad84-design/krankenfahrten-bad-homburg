import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { assertValid, validateArticle } from "./lib/blog-pipeline.mjs";

const root = process.cwd();
const publishedDirectory = join(root, "automation/blog/published");
const outputPath = join(root, "src/content/generated-blog-posts.ts");

const files = existsSync(publishedDirectory)
  ? readdirSync(publishedDirectory).filter((file) => file.endsWith(".json")).sort()
  : [];
const posts = files.map((file) => JSON.parse(readFileSync(join(publishedDirectory, file), "utf8")));

const errors = posts.flatMap((post, index) => validateArticle(post, files[index]));
const slugs = new Set();
for (const post of posts) {
  if (slugs.has(post.slug)) errors.push(`Doppelter veröffentlichter Slug: ${post.slug}`);
  slugs.add(post.slug);
}
assertValid(errors);

posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug));
mkdirSync(dirname(outputPath), { recursive: true });
const source = `// Automatisch aus automation/blog/published/*.json erzeugt. Nicht manuell bearbeiten.\nexport const generatedPublishedBlogPosts = ${JSON.stringify(posts, null, 2)} as const;\n`;
writeFileSync(outputPath, source, "utf8");
console.log(`Ratgeberdaten erzeugt: ${posts.length} veröffentlichte Beiträge.`);
