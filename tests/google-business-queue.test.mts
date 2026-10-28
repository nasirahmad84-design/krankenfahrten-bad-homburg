import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createGitLedger } from "../scripts/lib/google-business-git-ledger.mjs";
import { verifyGoogleBusinessImage, publishGoogleBusinessPost } from "../scripts/lib/google-business-publisher.mjs";
import { googleQueue, GBP_LOCATION } from "../scripts/run-google-business-queue.mjs";

test("alle acht freigegebenen Payloads enthalten das exakte eigene JPEG und bleiben vor Fälligkeit gesperrt", () => {
  assert.equal(googleQueue(process.cwd(), "2026-10-28").length, 0);
  const queue = googleQueue(process.cwd(), "2026-11-23");
  assert.equal(queue.length, 8);
  const images = JSON.parse(readFileSync("automation/blog/google-business-images.json", "utf8"));
  for (const item of queue) {
    const bytes = readFileSync("public" + new URL(item.preview.payload.media[0].sourceUrl).pathname);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.approval.imageSha256);
    assert.equal(images[item.article.slug].width, 1200);
    assert.equal(images[item.article.slug].height, 900);
    assert.ok(bytes.length >= 10240 && bytes.length <= 5 * 1024 * 1024);
    assert.equal(bytes.readUInt16BE(0), 0xffd8);
    assert.equal(item.preview.payload.callToAction.actionType, "LEARN_MORE");
  }
  assert.equal(GBP_LOCATION, "accounts/111505448904866961656/locations/14639701242816410626");
});

test("Bildprüfung sperrt fremde URLs, 404, falschen MIME-Typ und geänderte Bytes", async () => {
  const bytes = Buffer.alloc(11000, 42);
  const hash = createHash("sha256").update(bytes).digest("hex");
  const payload = { media: [{ mediaFormat: "PHOTO", sourceUrl: "https://krankenfahrten-bad-homburg.de/images/google-business/test.jpg" }] };
  await verifyGoogleBusinessImage(async () => new Response(bytes, { headers: { "content-type": "image/jpeg" } }), payload, hash);
  await assert.rejects(verifyGoogleBusinessImage(async () => new Response(bytes), { media: [{ ...payload.media[0], sourceUrl: "https://example.org/test.jpg" }] }, hash));
  for (const response of [new Response(null, { status: 404 }), new Response(bytes, { headers: { "content-type": "text/html" } }), new Response(bytes, { headers: { "content-type": "image/jpeg" } })]) {
    await assert.rejects(verifyGoogleBusinessImage(async () => response, payload, "a".repeat(64)));
  }
});

test("gescheiterte dauerhafte Sicherung verhindert jeden Google-POST", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-durable-"));
  try {
    const article = { slug: "test", title: "Test", publishedAt: "2026-10-28" };
    const url = "https://krankenfahrten-bad-homburg.de/ratgeber/test/";
    const payload = { summary: "Freigegeben", topicType: "STANDARD", callToAction: { actionType: "LEARN_MORE", url } };
    const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    let creates = 0;
    await assert.rejects(publishGoogleBusinessPost({
      preview: { operatorApproval: "approved", articleSlug: article.slug, payload },
      article, publishedArticle: article, status: { status: "approved_for_publish", approvedAt: "2026-10-28", revalidateAfter: "2026-10-28" },
      enabled: true, parent: GBP_LOCATION, today: "2026-10-28", approvedPayloadHash: hash,
      googleApproval: { status: "approved", approvedAt: "2026-10-28", payloadHash: hash },
      ledger: createGitLedger(directory, "test", () => { throw new Error("Push fehlgeschlagen"); }),
      client: { list: async () => [], create: async () => { creates++; return {}; } },
      fetcher: async () => new Response(`<link rel="canonical" href="${url}"><script type="application/ld+json">${JSON.stringify({ "@type": "Article", headline: "Test" })}</script>`, { headers: { "content-type": "text/html" } }),
    }), /Push fehlgeschlagen/);
    assert.equal(creates, 0);
    assert.equal(createGitLedger(directory, "test").read().status, "sending_unknown");
  } finally { rmSync(directory, { recursive: true }); }
});

test("Google-Workflow ist unabhängig vom Blog, mit Nachlauf, Retry, persistentem Zustand und Alarm", () => {
  const workflow = readFileSync(".github/workflows/google-business.yml", "utf8");
  assert.match(workflow, /workflow_run:/);
  assert.match(workflow, /10 9,13 \* \* \*/);
  assert.match(workflow, /group: google-business-publishing/);
  assert.match(workflow, /git fetch origin gbp-state/);
  assert.doesNotMatch(workflow.split("steps:")[0], /runner\.temp/);
  assert.doesNotMatch(workflow, /npm ci|npm run build|OPENAI_API_KEY/);
  assert.match(readFileSync(".github/workflows/blog-failure-alert.yml", "utf8"), /Google-Business-Pipeline/);
  assert.match(readFileSync(".github/workflows/blog-health.yml", "utf8"), /check-google-business-health/);
});
