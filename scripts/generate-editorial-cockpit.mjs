import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { validateRun } from "./lib/blog-pipeline.mjs";

const root = process.cwd();
const articlesDirectory = resolve(root, "automation/blog/articles");
const outputDirectory = resolve(root, "out-editorial");
const googleApprovals = JSON.parse(readFileSync(resolve(root, "automation/blog/google-business-approvals.json"), "utf8"));
const googlePlanned = JSON.parse(readFileSync(resolve(root, "automation/blog/google-business-planned.json"), "utf8"));

function loadRuns() {
  return readdirSync(articlesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(articlesDirectory, entry.name))
    .filter((directory) => {
      try {
        readFileSync(join(directory, "run-status.json"));
        return true;
      } catch {
        return false;
      }
    })
    .map((directory) => {
      const validation = validateRun(directory);
      if (validation.errors.length > 0) {
        throw new Error(`${basename(directory)}:\n${validation.errors.map((error) => `- ${error}`).join("\n")}`);
      }
      return {
        runId: basename(directory),
        article: validation.article,
        status: validation.status,
        claims: validation.claims,
        researchBrief: readFileSync(join(directory, "research-brief.md"), "utf8"),
        socialPlatform: existsSync(join(directory, "google-business-draft.md")) ? "Google Business" : "Archiv – nicht zur Veröffentlichung",
        socialDraft: readFileSync(join(directory, existsSync(join(directory, "google-business-draft.md")) ? "google-business-draft.md" : "facebook-draft.md"), "utf8").trim(),
        googleApproval: googleApprovals[validation.article.slug] ?? null,
      };
    })
    .sort((left, right) => left.status.scheduledDate.localeCompare(right.status.scheduledDate));
}

const runs = loadRuns();
if (runs.length === 0) throw new Error("Keine prüfbaren Redaktionsläufe gefunden.");

const encodedContent = Buffer.from(JSON.stringify({ generatedAt: new Date().toISOString(), runs, googlePlanned }), "utf8").toString("base64");
const contentPhp = `<?php
declare(strict_types=1);

return json_decode(base64_decode('${encodedContent}', true), true, 64, JSON_THROW_ON_ERROR);
`;

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(join(outputDirectory, "assets"), { recursive: true });
mkdirSync(join(outputDirectory, "lib"), { recursive: true });

writeFileSync(join(outputDirectory, "content.php"), contentPhp, "utf8");
copyFileSync(resolve(root, "editorial/index.php"), join(outputDirectory, "index.php"));
copyFileSync(resolve(root, "editorial/lib/auth.php"), join(outputDirectory, "lib/auth.php"));
copyFileSync(resolve(root, "editorial/.htaccess"), join(outputDirectory, ".htaccess"));
copyFileSync(resolve(root, "public/brand/logo.svg"), join(outputDirectory, "assets/logo.svg"));
copyFileSync(resolve(root, "editorial/editorial.css"), join(outputDirectory, "assets/editorial.css"));
for (const file of ["outreach.php", "outreach-run.php", "outreach-unsubscribe.php", "lib/outreach.php", "lib/outreach-research.php"]) {
  copyFileSync(resolve(root, "editorial", file), join(outputDirectory, file));
}
copyFileSync(resolve(root, "editorial/outreach.css"), join(outputDirectory, "assets/outreach.css"));

console.log(`Redaktionscockpit erzeugt: ${runs.length} Artikel als geschützte PHP-Anwendung unter out-editorial/.`);
