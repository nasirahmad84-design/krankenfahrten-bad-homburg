# Redaktionelle und fachliche Gates

## Erlaubte Themenfelder

- verständliche Organisation einer sitzenden Krankenfahrt
- Arzt-, Klinik-, Dialyse-, Chemo-, Strahlen-, Reha-, Therapie-, Entlassungs- und Serienfahrten
- ärztliche Verordnung, Genehmigung, Kostenübernahme und Zuzahlung mit aktuellen Primärquellen
- Unterstützung von Patienten und Angehörigen vor, während und nach der Fahrt im bestätigten Leistungsumfang
- regionale, verifizierbare Informationen für Bad Homburg und das bestätigte Einsatzgebiet
- Änderungen amtlicher Regeln, Formulare oder regionaler Einrichtungen, sofern sie für Fahrgäste praktisch relevant sind

## Nicht automatisch veröffentlichbare Themen

- individuelle medizinische, rechtliche oder versicherungsrechtliche Beratung
- Diagnose-, Therapie- oder Notfallempfehlungen
- Arzneimittel, Behandlungserfolg oder medizinische Prognosen
- unbestätigte Fahrpreise, Erstattungszusagen oder Verfügbarkeitsgarantien
- Rollstuhl-, Tragestuhl-, Liegend- oder qualifizierte Krankentransporte als eigene Leistung
- Unfall-, Patienten- oder Anfragegeschichten ohne dokumentierte Einwilligung
- erfundene Fallbeispiele, Bewertungen, Kooperationen, Reichweiten oder Rankings
- wertende Wettbewerbervergleiche

## Quellenhierarchie

1. Gesetze, amtliche Richtlinien und zuständige Behörden
2. G-BA, KBV, BMG, Kommunen, Kliniken und andere originär zuständige Einrichtungen
3. offizielle Krankenkassenseiten für kassenspezifische Verfahren
4. etablierte Fachquellen zur Einordnung, jedoch nicht als Ersatz für eine verfügbare Primärquelle
5. Presse und andere Sekundärquellen nur für Themenfindung oder klar gekennzeichnete Einordnung

Für abrechnungs-, verordnungs- oder gesundheitsbezogene Kernaussagen ist mindestens eine aktuelle Primärquelle zwingend. Für einen Beitrag mit dem Signalwort „aktuell“, einer Regeländerung oder einem konkreten Ereignis sind mindestens zwei voneinander unabhängige Quellen erforderlich, davon mindestens eine Primärquelle.

## Claim-Gate

Jede nachprüfbare Aussage erhält vor Veröffentlichung im Artikelregister:

- Claim-ID
- exakten oder eng paraphrasierten Claim
- Quelle und Fundstelle
- Status `verified`, `inference` oder `blocked`
- Prüfdatum
- Prüfernotiz

`blocked` verhindert die Veröffentlichung. `inference` muss im Artikel als Einordnung erkennbar sein und darf keine medizinische, rechtliche, Kosten- oder Leistungszusage enthalten.

## Aktualitätsregeln

- Quellen werden im Veröffentlichungslauf erneut geöffnet.
- Veröffentlichungs- und Änderungsdatum werden erfasst, sofern verfügbar.
- Richtlinien und Gesetze werden gegen die aktuell in Kraft befindliche Fassung geprüft.
- Eine dauerhaft gültige Grundlagenquelle darf älter sein, wenn der Review bestätigt, dass sie weiterhin aktuell ist.
- Themen ohne ausreichenden aktuellen Beleg werden verworfen oder als zeitloser Grundlagenartikel neu aufgesetzt.

## Textqualität

- klare Antwort auf eine konkrete Such- oder Nutzerfrage
- sachliche, ruhige und verständliche Sprache
- eigenständige Struktur und Formulierung; keine Quellennacherzählung
- keine langen Zitate; Quellen werden paraphrasiert und direkt verlinkt
- Servicegrenzen und Einzelfallabhängigkeit deutlich machen
- eine sinnvolle interne Verlinkung, keine Keyword-Listen
- keine austauschbaren Ortsnamen-Seiten oder künstlich aufgeblähten Texte
- Facebook-Text ist eine eigenständige Kurzfassung und kein abgeschnittener Artikelanfang

## Technische Pflichtgates

- eindeutiger Slug, Titel, Description und genau eine H1
- Canonical auf die Produktions-URL
- Quellenlinks vorhanden und erreichbar
- keine Draft-/Blocked-Seite im öffentlichen Export
- Tests, Lint, Build, Export- und Deployment-Verifikation erfolgreich
- keine Secrets, externen Laufzeitskripte oder neuen Tracker
- Testdomain liefert weiterhin `X-Robots-Tag: noindex, nofollow, noarchive`

## Abbruchregel

Wenn kein hinreichend relevantes und belegbares Thema gefunden wird, veröffentlicht die Automatisierung keinen Ersatzartikel. Der Lauf endet mit einem Prüfbericht und dem Status `no_publishable_topic`.
