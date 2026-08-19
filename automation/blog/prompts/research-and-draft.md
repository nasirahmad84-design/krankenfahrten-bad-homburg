# Auftrag: Recherche und Artikelentwurf

Du arbeitest als recherchierende Fachredaktion für „Krankenfahrten Bad Homburg“. Dieser Lauf darf ausschließlich interne Entwurfs- und Evidenzdateien erzeugen. Er darf weder öffentliche Blogdaten ändern noch committen oder deployen.

## Verbindlicher Ablauf

1. Prüfe, ob der Git-Arbeitsbaum sauber ist. Bei fremden oder unklaren Änderungen: nichts verändern und den Lauf als blockiert melden.
2. Lies vollständig:
   - `automation/blog/editorial-policy.md`
   - `automation/blog/source-inventory.csv`
   - `src/content/services.ts`
   - `src/content/faq.ts`
   - `src/content/locations.ts`
   - `src/lib/site-config.ts`
   - alle Dateien unter `automation/blog/published/`
3. Recherchiere online nach einem aktuellen, für Patienten oder Angehörige praktisch relevanten Thema im bestätigten Leistungsbereich. Nutze für fachliche Kernaussagen Primärquellen. Öffne jede verwendete Quelle tatsächlich und notiere Prüfdatum und Fundstelle.
4. Vermeide Themen, die bereits ausreichend durch veröffentlichte Beiträge abgedeckt sind. Eine aktuelle Änderung darf einen bestehenden Grundlagenbeitrag ergänzen, wenn die Änderung eindeutig belegt und für die Zielgruppe relevant ist.
5. Gibt es kein ausreichend relevantes und belegbares Thema, erstelle nur einen Laufordner mit `run-status.json` (`status: no_publishable_topic`) und `research-brief.md`. Erfinde keinen Ersatzartikel.
6. Andernfalls erstelle `automation/blog/articles/RUN-ID/` mit genau:
   - `run-status.json`
   - `research-brief.md`
   - `claim-register.csv`
   - `article.json`
   - `facebook-draft.md`
7. Orientiere `article.json` strukturell an den Dateien unter `automation/blog/published/`. Der Status gehört ausschließlich in `run-status.json`, niemals in den Artikel.
8. Jeder überprüfbare Claim erhält eine Zeile nach `automation/blog/claim-register-template.csv`. Medizinische, rechtliche, verordnungs-, kosten- oder leistungsbezogene Aussagen dürfen nur `verified` oder `blocked` sein, niemals bloße `inference`.
9. Der Facebook-Entwurf ist eine eigenständige Kurzfassung, enthält `{{ARTICLE_URL}}` und wird nicht veröffentlicht.
10. Setze im Laufstatus:
    - `schemaVersion: 1`
    - `status: draft_ready`
    - alle fachlichen Gates auf `not_checked`
    - `livePublishing: false`
    - `facebookPublishing: false`
11. Führe `npm run blog:validate -- automation/blog/articles/RUN-ID` aus. Korrigiere nur formale Entwurfsfehler. Keine Veröffentlichung, kein Git-Commit, kein Deployment.

## Qualitätsanforderungen

- konkrete Nutzerfrage statt allgemeiner Branchennews
- eigenständige deutsche Formulierungen ohne lange Zitate
- mindestens zwei belastbare Quellen; bei aktuellen Änderungen zwei voneinander unabhängige Quellen, davon mindestens eine Primärquelle
- keine Diagnose, Rechtsberatung, Erstattungszusage, Verfügbarkeitsgarantie oder nicht bestätigte Leistung
- klare Abgrenzung zu Rollstuhl-, Tragestuhl-, Liegend- und qualifizierten Krankentransporten
- keine personenbezogenen Anfrage-, Patienten- oder Analysedaten

## Abschluss

Berichte ausschließlich: gewähltes Thema, Run-ID, angelegte Dateien, wichtigste Quellen, Validator-Ergebnis und mögliche Blocker.
