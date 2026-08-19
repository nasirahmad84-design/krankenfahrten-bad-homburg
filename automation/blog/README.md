# Kostenfreie Warteschlange für geplante Ratgeberbeiträge

## Ziel

Die Redaktion recherchiert mehrere Beiträge im Voraus mit Codex im bestehenden Plan. Freigegebene Beiträge werden versioniert in einer Warteschlange abgelegt. GitHub Actions veröffentlicht montags und donnerstags ausschließlich den für diesen Tag freigegebenen Beitrag. Zum Veröffentlichungszeitpunkt findet kein bezahlter KI- oder Rechercheaufruf statt.

## Prozess

```text
Vorausschauende Recherche und Entwurf
  -> Claim- und Quellenprüfung
  -> Betreiberprüfung und ausdrückliche Freigabe
  -> Status approved_for_publish mit Freigabe- und Aktualitätsdatum
  -> Auswahl genau eines Beitrags für den Kalendertag
  -> gezielte Blogtests
  -> technischer Next.js-Export
  -> Prüfung nur von Artikel, Hub und Sitemap
  -> Blog-Delta auf Testdomain
  -> unmittelbarer Smoke-Test
  -> Blog-Delta auf Live-Domain
  -> später: Facebook-Post nach erfolgreicher Live-URL
```

Recherche und Review bleiben getrennt. Codex bereitet `draft_ready` vor, darf aber die Betreiberfreigabe nicht selbst setzen. Ein fehlender oder widersprüchlicher Beleg führt zu `blocked`; es wird kein Ersatz- oder Füllartikel veröffentlicht.

## Bewusst nicht Bestandteil eines Bloglaufs

- keine 49 globalen Projektprüfungen
- kein vollständiges Deployment der Website
- keine erneute Prüfung von Formular, PHP, Rechtsseiten oder sämtlichen Bestandsrouten
- keine vier vorgeschalteten Testläufe
- kein separates Freigabeprotokoll zusätzlich zur Artikelhistorie
- keine Änderung bestehender Seiten außerhalb des Ratgeberbereichs

## Technische Grenze des bestehenden Systems

Next.js kann eine einzelne dynamische Artikelseite nicht separat kompilieren. Deshalb erzeugt der Runner intern weiterhin einen statischen Export. Dieser Build ist nur eine technische Zwischenstufe: Hochgeladen werden ausschließlich:

- `out/ratgeber/**`
- `out/sitemap.xml`
- `out/_next/static/**` als von den neu erzeugten Ratgeberseiten benötigte Laufzeitassets

Andere HTML-Seiten, PHP-Dateien, Formulare, Bilder und die Root-`.htaccess` werden vom Blog-Deployment nicht übertragen.

## Gezielte Qualitätsgates

Ein Beitrag darf nur veröffentlicht werden, wenn:

1. `blog:validate` Struktur, Quellen, Claims und Freigabestatus bestätigt;
2. jede externe Artikelquelle in mindestens einem Claim verwendet wird;
3. sensible medizinische, rechtliche, Verordnungs-, Kosten- und Leistungsclaims verifiziert sind;
4. `test:blog` ausschließlich artikelbezogene Blogprüfungen erfolgreich ausführt;
5. `verify:blog-export` Artikel, H1, Canonical, BlogPosting-Daten, Quellen, Hub und Sitemap bestätigt;
6. der Testartikel erreichbar ist und die Testdomain weiterhin `X-Robots-Tag: noindex, nofollow, noarchive` liefert.

Nach diesem Smoke-Test darf derselbe Blog-Delta ohne Warteperiode live veröffentlicht werden. Facebook darf erst nach einer erreichbaren Live-URL angestoßen werden.

## Befehle

- `npm run blog:validate -- automation/blog/articles/RUN-ID`
- `BLOG_PUBLICATION_DATE=YYYY-MM-DD npm run blog:select-scheduled`
- `npm run blog:prepare-release -- automation/blog/articles/RUN-ID`
- `npm run deploy:blog:test -- artikel-slug`
- `BLOG_DEPLOY_LIVE_CONFIRM=JA npm run deploy:blog:live -- artikel-slug`

`blog:prepare-release` führt nur Blogvalidator, artikelbezogene Blogtests, den technisch nötigen Export und die gezielte Exportprüfung aus. Der bestehende vollständige Website-Deploymentprozess bleibt für normale Website-Releases unverändert.

## Inhalte und Nachvollziehbarkeit

- Entwürfe und Evidenz liegen unter `automation/blog/articles/`.
- Freigegebene Beiträge liegen unter `automation/blog/published/`.
- `scripts/generate-blog-content.mjs` erzeugt daraus `src/content/generated-blog-posts.ts`.
- Git dokumentiert nur die tatsächlich veröffentlichten Inhaltsänderungen; ein zusätzliches Laufregister ist nicht erforderlich.
- Zugangsdaten bleiben außerhalb des Repositorys in Secret- oder lokaler Deployment-Konfiguration.

## Geplanter Queue-Runner

`.github/workflows/blog-manual.yml` ist der rechnerunabhängige Publisher:

1. Montag und Donnerstag um 07:00 UTC wählt er anhand des Berliner Kalendertags genau einen Lauf mit `approved_for_publish` aus.
2. Entwürfe, abgelaufene Freigaben, doppelte Termine und bereits publizierte Slugs werden übersprungen oder blockiert.
3. Der freigegebene Lauf durchläuft nur Blogvalidator, Blogtests, statischen Export und Blogexportprüfung.
4. Das Blog-Delta wird zuerst auf die Testdomain übertragen. Live bleibt zusätzlich durch `BLOG_QUEUE_LIVE_ENABLED` gesperrt.
5. Facebook bleibt deaktiviert, bis ein geprüfter Meta-Zugang ausdrücklich freigegeben wurde.

Der Workflow benötigt keinen `OPENAI_API_KEY`. Das frühere API-Experiment bleibt nur als nachvollziehbare Historie im Repository und ist nicht Teil des geplanten Publikationslaufs. Bis zur Betreiberfreigabe des ersten Batches bleibt der GitHub-Workflow deaktiviert.

## Vier-Wochen-Vorlauf

Der aktuelle Redaktionsplan liegt in `automation/blog/editorial-calendar.csv`. Alle acht Beiträge sind als `draft_ready` vorbereitet. `automation/blog/content-approval-register.csv` dokumentiert, dass die ausdrückliche Betreiberfreigabe noch aussteht. Erst nach dieser Freigabe werden Status und `approvedAt` gesetzt; vor jeder Veröffentlichung schützt `revalidateAfter` zusätzlich vor veralteten Angaben.
