import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateRun, assertValid } from "./lib/blog-pipeline.mjs";

export function prepareGoogleBusinessPost(runDirectory) {
  const { article, status, errors } = validateRun(runDirectory);
  assertValid(errors);
  const draft = readFileSync(resolve(runDirectory, "google-business-draft.md"), "utf8");
  const summary = draft.replace(/\n+Mehr erfahren: \{\{ARTICLE_URL\}\}\s*$/, "").trim();
  if (summary.length < 80 || summary.length > 1500 || summary.includes("{{")) {
    throw new Error("Google-Business-Kurztext ist unvollständig oder zu lang.");
  }
  const url = new URL(`/ratgeber/${article.slug}/`, "https://krankenfahrten-bad-homburg.de");
  url.search = new URLSearchParams({ utm_source: "google", utm_medium: "organic", utm_campaign: "gbp_ratgeber", utm_content: article.slug }).toString();
  return {
    articleSlug: article.slug,
    publicationDate: article.publishedAt,
    operatorApproval: status.status === "approved_for_publish" ? "approved" : "pending",
    status: "preview_only",
    payload: { languageCode: "de", summary, topicType: "STANDARD", callToAction: { actionType: "LEARN_MORE", url: url.href } },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error("Artikellauf als Verzeichnis angeben.");
  console.log(JSON.stringify(prepareGoogleBusinessPost(resolve(process.argv[2])), null, 2));
}
