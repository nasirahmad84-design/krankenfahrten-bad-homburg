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

## Automatisierungsumgebung

Für einen rechnerunabhängigen Betrieb wird der Prozess später in einem Cloud-Runner ausgeführt. Der Runner benötigt Zugriff auf Repository, OpenAI API und FTPS-Secrets. Die fachlichen und technischen Bloggates bleiben identisch, unabhängig vom verwendeten Runner.
