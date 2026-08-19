# Schlanker Prozess für automatisierte Ratgeberbeiträge

## Ziel

Montags und donnerstags wird ein fachlich belastbarer Ratgeberbeitrag recherchiert, unabhängig geprüft und veröffentlicht. Die Automatisierung bearbeitet ausschließlich Blogdaten und die für den neuen Beitrag erforderlichen Exportdateien. Sie führt keinen vollständigen Website-Release durch.

## Prozess

```text
Recherche und Entwurf
  -> Claim- und Quellenprüfung
  -> Status approved_for_publish
  -> gezielte Blogtests
  -> technischer Next.js-Export
  -> Prüfung nur von Artikel, Hub und Sitemap
  -> Blog-Delta auf Testdomain
  -> unmittelbarer Smoke-Test
  -> Blog-Delta auf Live-Domain
  -> später: Facebook-Post nach erfolgreicher Live-URL
```

Recherche und Review bleiben getrennt. Ein fehlender oder widersprüchlicher Beleg führt zu `blocked`; es wird kein Ersatz- oder Füllartikel veröffentlicht.

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

## Manueller Cloud-MVP

`.github/workflows/blog-manual.yml` stellt den ersten rechnerunabhängigen End-to-End-Lauf bereit. Er wird zunächst ausschließlich manuell in GitHub Actions gestartet:

1. `scripts/run-blog-cloud.mjs` beauftragt eine recherchierende Redaktion über die OpenAI Responses API mit aktiviertem Web-Suchwerkzeug.
2. Ein zweiter, vollständig neuer API-Aufruf prüft Quellen, Claims, Leistungsgrenzen, sensible Aussagen und SEO unabhängig und kann den Lauf blockieren.
3. Nur `approved_for_publish` startet `blog:prepare-release`, den Testdomain-Smoke-Test und anschließend das Live-Deployment desselben Blog-Deltas.
4. `blocked` und `no_publishable_topic` veröffentlichen nichts. Es gibt keinen automatisch erzeugten Ersatzartikel.

Der Workflow besitzt noch keinen Zeitplan und keine Facebook-Veröffentlichung. Beides wird erst nach einem erfolgreichen manuellen Cloud-Lauf ergänzt. Das Modell ist für den MVP fest auf `gpt-5-mini` gesetzt; der API-Schlüssel und das FTP-Passwort liegen ausschließlich als GitHub-Secrets vor. Deployment-Werte ohne Geheimnis liegen als GitHub-Variablen vor. Die Responses werden mit `store: false` angefordert.

Der Cloud-Lauf verwendet weder die globale Testsuite noch ein vollständiges Website-Deployment. Der statische Build bleibt nur die technisch unvermeidbare Erzeugungsstufe für die neuen Ratgeberdateien.
