import { existsSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { readJson, validateRun } from "./blog-pipeline.mjs";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function berlinDate(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function validateQueueMetadata(runDirectory, status, article, publicationDate) {
  const errors = [];
  if (!DATE_PATTERN.test(status?.approvedAt ?? "")) errors.push("run-status.json: approvedAt fehlt oder ist ungültig.");
  if (!DATE_PATTERN.test(status?.revalidateAfter ?? "")) errors.push("run-status.json: revalidateAfter fehlt oder ist ungültig.");
  if (status?.scheduledDate !== publicationDate) errors.push("run-status.json: scheduledDate entspricht nicht dem Auswahldatum.");
  if (article?.publishedAt !== publicationDate) errors.push("article.json: publishedAt entspricht nicht dem Auswahldatum.");
  if (DATE_PATTERN.test(status?.revalidateAfter ?? "") && status.revalidateAfter < publicationDate) {
    errors.push("run-status.json: Aktualitätsfreigabe ist vor dem Veröffentlichungsdatum abgelaufen.");
  }
  return { runDirectory, status, article, errors };
}

export function selectScheduledRun(root, publicationDate = berlinDate()) {
  if (!DATE_PATTERN.test(publicationDate)) throw new Error("Veröffentlichungsdatum muss YYYY-MM-DD entsprechen.");

  const articlesDirectory = resolve(root, "automation/blog/articles");
  const publishedDirectory = resolve(root, "automation/blog/published");
  const candidates = readdirSync(articlesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(articlesDirectory, entry.name))
    .filter((runDirectory) => existsSync(join(runDirectory, "run-status.json")))
    .map((runDirectory) => ({ runDirectory, status: readJson(join(runDirectory, "run-status.json")) }))
    .filter(({ status }) => status.status === "approved_for_publish" && status.scheduledDate === publicationDate)
    .filter(({ status }) => !existsSync(join(publishedDirectory, `${status.articleSlug}.json`)))
    .map(({ runDirectory, status }) => {
      const validation = validateRun(runDirectory, { requirePublishable: true });
      const metadata = validateQueueMetadata(runDirectory, status, validation.article, publicationDate);
      return { ...metadata, errors: [...validation.errors, ...metadata.errors] };
    });

  if (candidates.length === 0) return { status: "no_scheduled_article", publicationDate };
  if (candidates.length > 1) {
    throw new Error(`Mehrere freigegebene Artikel für ${publicationDate}: ${candidates.map(({ runDirectory }) => basename(runDirectory)).join(", ")}`);
  }

  const [candidate] = candidates;
  if (candidate.errors.length > 0) throw new Error(candidate.errors.join("\n"));
  return {
    status: "ready",
    publicationDate,
    runDirectory: candidate.runDirectory,
    runId: basename(candidate.runDirectory),
    slug: candidate.article.slug,
  };
}
