# SEORCH-Triage vom 14.09.2026

Geprüft wurde der vom Betreiber bereitgestellte SEORCH-Export gegen den aktuellen statischen Export und die Produktionsdomain. Die Überschrift des Fremdberichts nennt irrtümlich `https://seorch.de/`; die Detailwerte und URLs beziehen sich jedoch auf `https://krankenfahrten-bad-homburg.de/`. Aussagen des Fremdtools werden deshalb nur übernommen, wenn sie im eigenen Export oder live reproduzierbar sind.

## Sofort verifiziert

- Der Seitentitel lautet `Krankenfahrten Bad Homburg | Persönlich und zuverlässig`; die Behauptung, das Suchthema komme im Title nicht vor, ist falsch.
- Die Startseite hat genau eine H1: `Sitzende Krankenfahrten in Bad Homburg`.
- Alle 14 aufgelisteten Bilder besitzen ein `alt`-Attribut. Informative Fotos haben beschreibenden Alternativtext; Logos und bereits beschriftete Symbole sind mit `alt=""` bewusst dekorativ. Ein Bild-`title` ist weder für Barrierefreiheit noch für SEO erforderlich.
- Link-`title`-Attribute werden nicht ergänzt. Verständlicher sichtbarer Linktext beziehungsweise ein vorhandener zugänglicher Name ist maßgeblich.
- Genau ein `LocalBusiness`-JSON-LD ist vorhanden; Blogartikel verwenden zusätzlich `BlogPosting`. Fehlendes HTML-Microdata ist daher kein Fehler.
- `www` leitet mit 301 auf non-`www`; HTTP leitet mit 301 auf HTTPS. Das ist gewünschte Konsolidierung und kein Duplicate Content.
- Eine separate mobile URL ist nicht vorgesehen. Die Website ist responsiv und verwendet dieselben Canonicals. Die widersprüchlichen Meldungen „mehr als eine mobile Version“ und „keine Mobile Version“ ergeben keine Maßnahme.
- `hreflang` ist für den ausschließlich deutschsprachigen, nicht international duplizierten Auftritt nicht erforderlich.
- `twitter:site` bleibt ohne bestätigtes X-Profil aus. Meta-Keywords werden nicht ergänzt.

## Umgesetzt

- Das Startseiten-Hero wurde von 1800×1100 und 169 KiB auf 1200×734 und rund 89 KiB reduziert. Bei maximal ungefähr 500 CSS-Pixeln Darstellungsbreite bleibt damit ausreichend Reserve für hochauflösende Displays. Seitenverhältnis, Ausschnitt, Preload und Alt-Text bleiben erhalten.
- Die maximale Dateigröße wird nun automatisiert mit 150 KiB begrenzt.

## Belastbare nächste Prüfungen

1. Nach Deployment mobile und Desktop-Labormessung auf derselben Produktionsversion wiederholen. LCP, CLS und INP getrennt protokollieren; fehlende Felddaten bei einer jungen Domain sind kein Fehler.
2. Das Hero muss als LCP-Ressource früh erkannt werden. Der aktuelle Build setzt `preload`; nach Deployment im erzeugten HTML und Netzwerk-Wasserfall bestätigen.
3. Nicht verwendetes JavaScript nur mit Coverage beziehungsweise Bundleanalyse untersuchen. Die reine Anzahl der Next.js-Chunks ist kein Qualitätskriterium. Keine Framework-Chunks manuell zusammenführen.
4. Lesbarkeit einzelner langer Absätze bei künftigen Content-Reviews verbessern. Einen pauschalen Flesch-Zielwert oder künstliche Keyworddichte nicht erzwingen; fachliche Genauigkeit und verständliche Handlungsanweisungen haben Vorrang.
5. Search-Console-Daten für `krankenfahrten bad homburg` weiter beobachten. Der SEORCH-Top-30-Schnappschuss ist ein Fremdsignal, kein stabiler Rank-Nachweis. Interne Links, Ortsseiten, echte Rezensionen und fachlich geprüfte Ratgeber sind die nachhaltigen Hebel.
6. Eine sichtbare Autoren- oder Prüferangabe erst ergänzen, wenn reale Rolle, Name, Qualifikation und Freigabe vorliegen. Keine E-E-A-T-Person erfinden.

## Bewusst nicht umgesetzt

- Keyword-Stuffing in H3, Alt-Texten, Dateinamen oder Bodytext.
- Zusätzliche externe Links auf der Startseite nur zur Erfüllung einer Toolquote. Primärquellen stehen kontextbezogen in den Ratgeberartikeln.
- Bild- oder Link-`title`-Attribute ohne echten Nutzwert.
- Reduzierung sinnvoller Überschriften auf eine pauschale Anzahl. Entscheidend ist die korrekte Hierarchie.
- `llms.txt`, `.well-known/ai.txt`, proprietäre Content-Signals, API-Katalog, MCP-Server-Card, Agent-Skills-, WebMCP-, UCP- oder ACP-Endpunkte. Für die lokale Dienstleistungswebsite besteht derzeit kein nachgewiesener Nutzer- oder Rankingnutzen.
- Umschreiben aufgrund einer nicht beweiskräftigen „KI-Text-Wahrscheinlichkeit“. Texte werden stattdessen auf Richtigkeit, Natürlichkeit, lokale Relevanz und Servicegrenzen geprüft.
- Änderungen an Inline-Styles oder Next.js-Hydrationsdaten allein aufgrund einer Zählregel des Fremdtools.

## Priorisierte Folgepakete

- **SEO-PERF-01:** verkleinertes Hero deployen; Produktions-LCP und Netzwerk-Wasserfall erneut messen.
- **SEO-CONTENT-01:** Search-Console-Auswertung nach Suchintention und Zielseite; Snippets nur anhand realer Impressionen/CTR verbessern.
- **SEO-TRUST-01:** reale Autoren-/Prüferdarstellung und Betreiberfoto nur nach Betreiberfreigabe.
- **SEO-CWV-01:** JavaScript- und CSS-Profiling erst dann, wenn wiederholbare Labordaten oder Felddaten einen Engpass bestätigen.
