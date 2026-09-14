import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createFileLedger, createGoogleBusinessClient, publishGoogleBusinessPost, verifyPublishedArticle } from "../scripts/lib/google-business-publisher.mjs";

const article = { slug: "test-artikel", title: "Test Artikel", publishedAt: "2026-09-14" };
const url = "https://krankenfahrten-bad-homburg.de/ratgeber/test-artikel/";
const payload = { summary: "Freigegebener Google-Kurztext", topicType: "STANDARD", languageCode: "de", callToAction: { actionType: "LEARN_MORE", url: `${url}?utm_source=google` } };
const payloadHash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
const parent = "accounts/123/locations/456";
const post = { ...payload, name: `${parent}/localPosts/789`, state: "LIVE" };
const html = `<link rel="canonical" href="${url}"><script type="application/ld+json">${JSON.stringify({ "@type": "Article", headline: article.title })}</script>`;
const page = async () => new Response(html, { headers: { "content-type": "text/html" } });

function options(directory: string) {
  return {
    preview: { articleSlug: article.slug, operatorApproval: "approved", payload },
    article, status: { status: "approved_for_publish", approvedAt: "2026-09-14", revalidateAfter: "2026-09-14" },
    publishedArticle: article, parent, enabled: true, approvedPayloadHash: payloadHash,
    ledger: createFileLedger(directory, `${parent}:${article.slug}`),
    client: { list: async (): Promise<(typeof post)[]> => [], create: async () => post }, fetcher: page, today: "2026-09-14",
  };
}

test("Vorschau bleibt ohne Freigabe offline; Live verweigert jede unvollständige Freigabe", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-test-"));
  try {
    const base = options(directory);
    const offline = { ...base, enabled: false, fetcher: async () => { throw new Error("kein Netz erlaubt"); } };
    assert.equal((await publishGoogleBusinessPost(offline)).status, "preview_only");
    for (const change of [
      { approvedPayloadHash: "changed" }, { parent: "https://evil.invalid" }, { publishedArticle: null },
      { status: { ...base.status, approvedAt: undefined } }, { today: "2026-09-15" }, { today: "2026-09-13" },
    ]) await assert.rejects(publishGoogleBusinessPost({ ...base, ...change }));
  } finally { rmSync(directory, { recursive: true }); }
});

test("Produktion muss 200, indexierbar, richtiger Canonical und tatsächlicher Artikel sein", async () => {
  await verifyPublishedArticle(page, article);
  for (const response of [
    new Response(html, { status: 404 }),
    new Response(html, { headers: { "content-type": "text/html", "x-robots-tag": "noindex" } }),
    new Response(html + '<meta content="noindex" name="robots">', { headers: { "content-type": "text/html" } }),
    new Response(html.replace(url, "https://test.krankenfahrten-bad-homburg.de/"), { headers: { "content-type": "text/html" } }),
    new Response('<link rel="canonical" href="' + url + '">', { headers: { "content-type": "text/html" } }),
  ]) await assert.rejects(verifyPublishedArticle(async () => response, article));
});

test("ein Beitrag wird einmal erstellt; Folgelauf gleicht remote ab und meldet PROCESSING korrekt", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-test-"));
  try {
    const base = options(directory);
    let creates = 0;
    let posts: (typeof post)[] = [];
    base.client = { list: async () => posts, create: async () => { creates++; posts = [{ ...post, state: "PROCESSING" }]; return posts[0]; } };
    assert.equal((await publishGoogleBusinessPost(base)).status, "PROCESSING");
    posts[0].state = "LIVE";
    // A later read-only reconciliation is allowed even after the content gate expires.
    base.today = "2026-09-15";
    assert.equal((await publishGoogleBusinessPost(base)).status, "LIVE");
    assert.equal(creates, 1);
  } finally { rmSync(directory, { recursive: true }); }
});

test("Timeout wird persistent gesperrt, Remote-Reconciliation kann ohne zweiten POST auflösen", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-test-"));
  try {
    const base = options(directory);
    let creates = 0;
    base.client.create = async () => { creates++; throw new Error("simulated transport failure"); };
    await assert.rejects(publishGoogleBusinessPost(base));
    assert.equal(base.ledger.read().status, "sending_unknown");
    await assert.rejects(publishGoogleBusinessPost(base), /nicht blind/);
    base.client.list = async () => [post];
    assert.equal((await publishGoogleBusinessPost(base)).status, "LIVE");
    assert.equal(creates, 1);
  } finally { rmSync(directory, { recursive: true }); }
});

test("Duplikate, fremder Text und REJECTED werden nicht als Erfolg behandelt", async () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-test-"));
  try {
    for (const posts of [[post, post], [{ ...post, summary: "abweichend" }], [{ ...post, state: "REJECTED" }]]) {
      const base = options(directory);
      base.client.list = async () => posts;
      base.client.create = async () => { throw new Error("kein POST erlaubt"); };
      await assert.rejects(publishGoogleBusinessPost(base));
    }
  } finally { rmSync(directory, { recursive: true }); }
});

test("Dateisperre verhindert konkurrierende Veröffentlichungen", () => {
  const directory = mkdtempSync(join(tmpdir(), "gbp-test-"));
  try {
    const first = createFileLedger(directory, "key");
    const second = createFileLedger(directory, "key");
    first.lock();
    assert.throws(() => second.lock(), /gesperrt/);
    first.unlock();
    second.lock();
    second.unlock();
  } finally { rmSync(directory, { recursive: true }); }
});

test("OAuth und API-Fehler geben keine Secrets aus; Liste wird vollständig paginiert", async () => {
  const env = { GBP_CLIENT_ID: "id", GBP_CLIENT_SECRET: "secret-value", GBP_REFRESH_TOKEN: "refresh-value" };
  await assert.rejects(createGoogleBusinessClient(env, async () => new Response("secret-value", { status: 401 })), error => !String(error).includes("secret-value"));
  let requests = 0;
  const client = await createGoogleBusinessClient(env, async (address, options) => {
    requests++;
    if (String(address).includes("oauth2")) return Response.json({ access_token: "private-token" });
    assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer private-token");
    return Response.json(String(address).includes("pageToken") ? { localPosts: [post] } : { localPosts: [], nextPageToken: "second" });
  });
  assert.deepEqual(await client.list(parent), [post]);
  assert.equal(requests, 3);
});
