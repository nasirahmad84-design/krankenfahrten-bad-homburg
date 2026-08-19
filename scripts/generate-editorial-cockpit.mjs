import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { validateRun } from "./lib/blog-pipeline.mjs";

const root = process.cwd();
const articlesDirectory = resolve(root, "automation/blog/articles");
const outputDirectory = resolve(root, "out-editorial");

const statusLabels = {
  draft_ready: "Freigabe ausstehend",
  approved_for_publish: "Zur Veröffentlichung freigegeben",
  blocked: "Blockiert",
  rejected: "Abgelehnt",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return escapeHtml(value);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(`${value}T12:00:00+02:00`));
}

function renderResearchBrief(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) output.push("</ul>");
    listOpen = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      output.push(`<h3>${escapeHtml(line.slice(3))}</h3>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (!listOpen) output.push("<ul>");
      listOpen = true;
      const content = escapeHtml(line.slice(2)).replace(
        /(https:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      );
      output.push(`<li>${content}</li>`);
      continue;
    }
    closeList();
    output.push(`<p>${escapeHtml(line)}</p>`);
  }
  closeList();
  return output.join("\n");
}

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
        facebookDraft: readFileSync(join(directory, "facebook-draft.md"), "utf8").trim(),
      };
    })
    .sort((left, right) => left.status.scheduledDate.localeCompare(right.status.scheduledDate));
}

function pageShell({ title, description, body }) {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)} | Redaktionscockpit</title>
  <link rel="stylesheet" href="/redaktion/assets/editorial.css">
</head>
<body>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="/redaktion/" aria-label="Zur Redaktionsübersicht">
        <img src="/redaktion/assets/logo.svg" alt="Krankenfahrten Bad Homburg" width="210" height="60">
      </a>
      <div class="header-label">
        <strong>Redaktionscockpit</strong>
        <span>Interne Vorschau · Testdomain</span>
      </div>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="shell"><p>Interne Arbeitsansicht. Entwürfe sind nicht zur Veröffentlichung freigegeben, solange ihr Status dies nicht ausdrücklich ausweist.</p></div>
  </footer>
</body>
</html>`;
}

function statusBadge(status) {
  const label = statusLabels[status] ?? status;
  const modifier = status === "approved_for_publish" ? "approved" : status === "blocked" || status === "rejected" ? "blocked" : "pending";
  return `<span class="status-badge status-${modifier}">${escapeHtml(label)}</span>`;
}

function renderIndex(runs) {
  const pending = runs.filter(({ status }) => status.status === "draft_ready").length;
  const cards = runs.map(({ article, status }) => `
    <article class="article-card">
      <div class="card-meta">
        ${statusBadge(status.status)}
        <time datetime="${escapeHtml(status.scheduledDate)}">${formatDate(status.scheduledDate)}</time>
      </div>
      <p class="eyebrow">${escapeHtml(article.format)} · ${article.readingTimeMinutes} Minuten</p>
      <h2><a href="/redaktion/artikel/${escapeHtml(article.slug)}/">${escapeHtml(article.title)}</a></h2>
      <p>${escapeHtml(article.description)}</p>
      <dl class="compact-facts">
        <div><dt>Quellen</dt><dd>${article.sources.length}</dd></div>
        <div><dt>Geprüfte Claims</dt><dd>${status.claimGate === "passed" ? "bestanden" : "offen"}</dd></div>
      </dl>
      <a class="button" href="/redaktion/artikel/${escapeHtml(article.slug)}/">Artikel vollständig prüfen</a>
    </article>`).join("\n");

  return pageShell({
    title: "Artikelübersicht",
    description: "Interne Übersicht der vorbereiteten Ratgeberartikel.",
    body: `
      <section class="hero compact-hero">
        <div class="shell narrow">
          <p class="eyebrow">Interne Redaktion</p>
          <h1>Vorbereitete Ratgeberartikel</h1>
          <p class="lead">Hier kannst du alle Artikel vollständig lesen, Quellen und Kernaussagen prüfen und anschließend eine Freigabe erteilen.</p>
          <div class="summary-strip" aria-label="Redaktionsstatus">
            <div><strong>${runs.length}</strong><span>Artikel im Batch</span></div>
            <div><strong>${pending}</strong><span>Freigaben ausstehend</span></div>
            <div><strong>2×</strong><span>pro Woche geplant</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="shell">
          <div class="section-heading">
            <div><p class="eyebrow">Redaktionsplan</p><h2>Montag und Donnerstag</h2></div>
            <p>Die Sortierung folgt dem geplanten Veröffentlichungsdatum. Ein Entwurf bleibt technisch gesperrt, bis die Betreiberfreigabe im Repository dokumentiert ist.</p>
          </div>
          <div class="article-grid">${cards}</div>
        </div>
      </section>
      <section class="section section-muted">
        <div class="shell narrow">
          <div class="decision-box">
            <p class="eyebrow">Freigabe</p>
            <h2>So gibst du Artikel frei</h2>
            <p>Lies die Artikel einzeln. Nenne anschließend im Codex-Chat entweder die gewünschten Titel oder schreibe eindeutig: <strong>„Alle acht Artikel freigegeben.“</strong></p>
            <p>Die Freigabe wird erst danach versioniert. Diese Ansicht verändert selbst keine Inhalte und veröffentlicht nichts.</p>
          </div>
        </div>
      </section>`,
  });
}

function renderArticle(run) {
  const { article, status, claims, researchBrief, facebookDraft } = run;
  const sourceLookup = new Map(article.sources.map((source) => [source.id, source]));
  const sections = article.sections.map((section) => `
    <section class="article-section" id="${escapeHtml(section.id)}">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
      ${section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
      <div class="source-chips" aria-label="Quellen dieses Abschnitts">
        ${(section.sourceIds ?? []).map((sourceId) => {
          const source = sourceLookup.get(sourceId);
          return source ? `<a href="#source-${escapeHtml(source.id)}">${escapeHtml(source.publisher)}</a>` : "";
        }).join("")}
      </div>
    </section>`).join("\n");

  const faqs = article.faqs.map((faq) => `
    <details>
      <summary>${escapeHtml(faq.question)}</summary>
      <p>${escapeHtml(faq.answer)}</p>
    </details>`).join("\n");

  const sources = article.sources.map((source) => `
    <li id="source-${escapeHtml(source.id)}">
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a>
      <span>${escapeHtml(source.publisher)} · geprüft am ${formatDate(source.checkedAt)}</span>
    </li>`).join("\n");

  const claimRows = claims.map((claim) => `
    <tr>
      <td><strong>${escapeHtml(claim.claim_text)}</strong><span>${escapeHtml(claim.claim_type)}</span></td>
      <td>${escapeHtml(claim.status === "verified" ? "Verifiziert" : claim.status)}</td>
      <td>${escapeHtml(claim.source_locator)}</td>
      <td>${formatDate(claim.checked_at)}</td>
      <td>${escapeHtml(claim.review_note)}</td>
    </tr>`).join("\n");

  return pageShell({
    title: article.title,
    description: article.description,
    body: `
      <div class="shell breadcrumb"><a href="/redaktion/">← Alle Artikel</a></div>
      <article>
        <header class="article-hero">
          <div class="shell reading-column">
            <div class="card-meta">${statusBadge(status.status)}<span>Geplant: <time datetime="${escapeHtml(status.scheduledDate)}">${formatDate(status.scheduledDate)}</time></span></div>
            <p class="eyebrow">${escapeHtml(article.format)} · ${article.readingTimeMinutes} Minuten</p>
            <h1>${escapeHtml(article.title)}</h1>
            <p class="lead">${escapeHtml(article.intro)}</p>
            <dl class="review-meta">
              <div><dt>Redaktionell geprüft</dt><dd>${formatDate(article.reviewedAt)}</dd></div>
              <div><dt>Erneut prüfen bis</dt><dd>${formatDate(status.revalidateAfter)}</dd></div>
              <div><dt>SEO-Prüfung</dt><dd>${status.seoGate === "passed" ? "Bestanden" : "Offen"}</dd></div>
            </dl>
          </div>
        </header>
        <div class="shell reading-column article-body">
          <aside class="key-points" aria-labelledby="key-points-title">
            <h2 id="key-points-title">Das Wichtigste in Kürze</h2>
            <ul>${article.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </aside>
          ${sections}
          <section class="article-section">
            <h2>Häufige Fragen</h2>
            <div class="faq-list">${faqs}</div>
          </section>
          <section class="article-section sources-section">
            <h2>Verwendete Primärquellen</h2>
            <ol>${sources}</ol>
          </section>
        </div>
      </article>
      <section class="section section-muted">
        <div class="shell review-grid">
          <section class="review-panel">
            <p class="eyebrow">Recherche</p>
            <h2>Recherchebrief</h2>
            <div class="formatted-brief">${renderResearchBrief(researchBrief)}</div>
          </section>
          <section class="review-panel">
            <p class="eyebrow">Social Media</p>
            <h2>Facebook-Entwurf</h2>
            <div class="social-draft">${escapeHtml(facebookDraft).replaceAll("\n", "<br>")}</div>
            <p class="microcopy">Der Platzhalter wird nach erfolgreicher Veröffentlichung durch die Live-URL ersetzt.</p>
          </section>
        </div>
      </section>
      <section class="section">
        <div class="shell">
          <div class="section-heading"><div><p class="eyebrow">Faktenprüfung</p><h2>Geprüfte Aussagen</h2></div><p>Diese Tabelle verbindet sensible oder geschäftlich relevante Aussagen mit Quelle, Fundstelle und Prüfnotiz.</p></div>
          <div class="table-wrap" tabindex="0" aria-label="Tabelle der geprüften Aussagen">
            <table>
              <thead><tr><th>Aussage</th><th>Status</th><th>Fundstelle</th><th>Geprüft</th><th>Redaktionsnotiz</th></tr></thead>
              <tbody>${claimRows}</tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="section section-decision">
        <div class="shell reading-column">
          <div class="decision-box">
            <p class="eyebrow">Entscheidung</p>
            <h2>Freigabe für „${escapeHtml(article.title)}“</h2>
            <p>Wenn Inhalt, Quellen und Leistungsgrenzen für dich passen, nenne diesen Titel im Codex-Chat als freigegeben. Ohne diese ausdrückliche Entscheidung bleibt der Artikel gesperrt.</p>
            <a class="button button-secondary" href="/redaktion/">Zurück zur Übersicht</a>
          </div>
        </div>
      </section>`,
  });
}

const runs = loadRuns();
if (runs.length === 0) throw new Error("Keine prüfbaren Redaktionsläufe gefunden.");

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(join(outputDirectory, "assets"), { recursive: true });
writeFileSync(join(outputDirectory, "index.html"), renderIndex(runs), "utf8");
copyFileSync(resolve(root, "public/brand/logo.svg"), join(outputDirectory, "assets/logo.svg"));
copyFileSync(resolve(root, "editorial/editorial.css"), join(outputDirectory, "assets/editorial.css"));

for (const run of runs) {
  const articleDirectory = join(outputDirectory, "artikel", run.article.slug);
  mkdirSync(articleDirectory, { recursive: true });
  writeFileSync(join(articleDirectory, "index.html"), renderArticle(run), "utf8");
}

console.log(`Redaktionscockpit erzeugt: ${runs.length} Artikel unter out-editorial/.`);
