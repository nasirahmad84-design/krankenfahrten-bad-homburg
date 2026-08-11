# BLOG-00 – Architektur des automatisierten Ratgebers

## Ziel

Der Ratgeber soll montags und donnerstags jeweils einen fachlich belastbaren Beitrag vorbereiten. Die Automatisierung arbeitet in zwei getrennten Läufen:

1. **Recherche und Entwurf:** aktuelle Themen prüfen, Primärquellen sichern, Claims erfassen und einen Entwurf erzeugen.
2. **Review und Veröffentlichung:** Quellen erneut öffnen, Aussagen gegen die Claims prüfen, nötige Korrekturen vornehmen, Qualitätsgates ausführen und zunächst ausschließlich auf die Testdomain veröffentlichen.

Die ersten vier erfolgreichen Publikationsläufe bleiben auf der Testdomain. Eine automatische Live- und Facebook-Veröffentlichung wird erst in BLOG-04 aktiviert, nachdem alle Freigaben und praktischen Tests vorliegen.

## Gewählte Ausführungsarchitektur

Die Orchestrierung erfolgt über zwei native, lokale Codex-Scheduled-Tasks im bestehenden Git-Projekt. Das ist für dieses Projekt geeigneter als ein ALL-INKL-Cronjob:

- ALL-INKL stellt für die Website keinen Node.js-Buildprozess bereit.
- das statische Next.js-Projekt muss vor jeder Veröffentlichung vollständig gebaut und geprüft werden;
- die vorhandene FTPS-Strecke kann die Testdomain kontrolliert aktualisieren;
- Recherche, Dateiänderungen, Tests und ein nachvollziehbarer Git-Commit bleiben in einem lokalen Projektlauf zusammen.

Laut offizieller OpenAI-Dokumentation können geplante Desktop-Aufgaben mit lokalen Projekten arbeiten. Dafür müssen Rechner und Desktop-App zum Ausführungszeitpunkt laufen und das Projekt erreichbar sein. Quelle: https://learn.chatgpt.com/docs/automations

Vorgeschlagene Zeiten in `Europe/Berlin`:

- Montag 06:30: Recherche und Entwurf
- Montag 08:30: Review und Test-Veröffentlichung
- Donnerstag 06:30: Recherche und Entwurf
- Donnerstag 08:30: Review und Test-Veröffentlichung

Die genauen Automationen werden erst in BLOG-03 nach einem manuellen End-to-End-Test angelegt.

## Pipeline

```text
Themenrecherche
  -> Quelleninventar des Laufs
  -> Claim-Register
  -> Artikelentwurf + Facebook-Entwurf
  -> unabhängiger Review-Lauf
  -> Quellen-/Claim-/Leistungs-/SEO-/Build-Gates
  -> Commit
  -> Testdomain
  -> Abnahmeprotokoll
  -> später: Live-Domain
  -> später: Facebook
```

## Verantwortungsgrenzen

- Der Recherchelauf darf ausschließlich Entwürfe und zugehörige Evidenzdateien erzeugen. Er darf nicht deployen.
- Der Reviewlauf darf einen Artikel nur dann veröffentlichen, wenn alle Pflichtgates bestanden sind.
- Ein fehlender oder widersprüchlicher Beleg führt zu `blocked`, nicht zu einer plausibel klingenden Ergänzung.
- Rechtlich, medizinisch oder abrechnungsbezogen sensible Aussagen brauchen aktuelle Primärquellen.
- Eine Veröffentlichung auf der Testdomain ist keine fachliche oder rechtliche Freigabe für die Live-Domain.
- Facebook wird niemals vor der erfolgreichen Live-Veröffentlichung angestoßen.

## Technische Leitplanken

- Static Export und ALL-INKL-Kompatibilität bleiben erhalten.
- Blogdaten werden versioniert und ohne Datenbank gespeichert.
- Jeder Beitrag besitzt eine eigene Quellenliste und ein Claim-Register.
- Sitemap, Canonical, Metadaten und interne Links werden automatisch aus den freigegebenen Beiträgen erzeugt.
- Entwürfe und blockierte Beiträge gelangen weder in die Sitemap noch in den öffentlichen Export.
- Keine Nutzerdaten, Diagnosen oder Anfrageinhalte werden für Themen oder Artikel verwendet.
- Keine externen Widgets, Tracker oder eingebetteten Social-Feeds werden ergänzt.
- Zugangsdaten bleiben in ignorierten lokalen Konfigurationen beziehungsweise der späteren Connector-Konfiguration.

## Arbeitspakete

| Paket | Ergebnis |
| --- | --- |
| BLOG-00 | Architektur, Evidenz-, Freigabe- und Sicherheitsregeln |
| BLOG-01 | Ratgeber-Hub, Artikelseiten, Datenmodell, Sitemap und Tests – umgesetzt |
| BLOG-02 | lokale Recherche-, Entwurfs-, Review- und Social-Artefakte – umgesetzt |
| BLOG-03 | zwei geplante Aufgaben, Montag/Donnerstag, nur Testdomain |
| BLOG-04 | kontrollierte Live- und Facebook-Veröffentlichung |

## Referenzdateien

- `source-inventory.csv`: zugelassene Startquellen und lokale Wissensbasis
- `claim-register-template.csv`: Pflichtschema je Artikel
- `decision-register.csv`: getroffene Architektur- und Governance-Entscheidungen
- `content-approval-register.csv`: Lauf- und Freigabenachweis
- `route-matrix.csv`: geplante öffentliche und interne Routen
- `environment-gate-matrix.csv`: erlaubte Aktionen nach Umgebung
- `editorial-policy.md`: Quellen-, Themen- und Qualitätsregeln
- `clarification-list.md`: verbleibende Betreiber- und Plattformpunkte

## Öffentliche Inhaltsquelle

Freigegebene Beiträge liegen als validierte JSON-Dateien unter `automation/blog/published/`. `scripts/generate-blog-content.mjs` erzeugt daraus deterministisch `src/content/generated-blog-posts.ts`; diese generierte Datei wird nicht manuell bearbeitet. `src/content/blog-posts.ts` enthält nur Typen, Laufzeitprüfungen und die öffentliche Auswahl. Draft- oder Blocked-Objekte gelangen nicht in die öffentliche Inhaltsquelle. Nicht freigegebene Arbeitsstände und artikelbezogene Claim-Register bleiben unter `automation/blog/articles/` und werden nicht nach `out/` exportiert.

Neue Beiträge werden erst mit `npm run blog:promote -- automation/blog/articles/RUN-ID` übernommen, wenn `scripts/validate-blog-run.mjs` das Claim-Register, alle Quellenreferenzen, die Textstruktur und die Reviewgates bestätigt. `npm test` und `npm run build` erzeugen zunächst die Blogdaten und danach die statischen SEO-Dateien neu, damit Inhalt, Sitemap und Export synchron bleiben.

## BLOG-02 – operative Befehle

- `npm run blog:validate -- automation/blog/articles/RUN-ID`: prüft einen internen Lauf, ohne öffentliche Daten zu verändern.
- `npm run blog:promote -- automation/blog/articles/RUN-ID -- --dry-run`: prüft die Freigabe zur Test-Veröffentlichung, ohne zu kopieren.
- `npm run blog:promote -- automation/blog/articles/RUN-ID`: übernimmt ausschließlich einen vollständig freigegebenen Artikel nach `automation/blog/published/`.
- `npm run blog:generate`: erzeugt die öffentliche TypeScript-Inhaltsquelle deterministisch neu.

Die zwei vollständigen Arbeitsaufträge stehen unter `automation/blog/prompts/`. Der erste Lauf darf nur recherchieren und Entwürfe erzeugen. Der zweite Lauf muss jede Quelle erneut öffnen, darf blockieren und kann nach allen Gates ausschließlich auf die Testdomain deployen. Live- und Facebook-Veröffentlichung bleiben weiterhin bis BLOG-04 deaktiviert.
