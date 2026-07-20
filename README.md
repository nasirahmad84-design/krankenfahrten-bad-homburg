# Krankenfahrten Bad Homburg

Technische Basis und globales Layout für die Website „Krankenfahrten Bad Homburg“. Das Projekt nutzt Next.js mit App Router, TypeScript, Tailwind CSS und ESLint.

## Setup

Voraussetzung ist eine aktuelle Node.js-LTS-Version.

```bash
npm install
npm run dev
```

Die lokale Entwicklungsumgebung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Scripts

- `npm run dev` – startet den Entwicklungsserver
- `npm run build` – erstellt den Production-Build
- `npm run start` – startet den Production-Server
- `npm run lint` – prüft den Quellcode mit ESLint
- `npm test` – prüft Validierung, Spam-Erkennung, Provider- und E-Mail-Logik mit dem eingebauten Node-Testläufer

## Projektstruktur

```text
src/
├── app/                 # App Router, Layouts und Seiten
├── components/
│   ├── forms/           # Formulare und Formularbausteine
│   ├── layout/          # Globale Layout-Komponenten
│   ├── sections/        # Seitenabschnitte
│   └── ui/              # Wiederverwendbare UI-Komponenten
├── content/             # Statische Inhalte und Inhaltsmodelle
└── lib/                 # Hilfsfunktionen und technische Abstraktionen
```

## Design-Grundlagen

- Farben: Navy `#021F58`, Grün `#5FA538`, Weiß `#FEFEFE`
- Schrift: Inter via `next/font`
- Globale Grundlagen für Container, Abstände, Radien und Typografie in `src/app/globals.css`

## SiteConfig

`src/lib/site-config.ts` ist die zentrale Quelle für Markenname, Betreiber, Adresse, Telefon, E-Mail sowie Haupt- und Rechtsnavigation. Komponenten greifen auf diese Konfiguration zu, statt Kontaktdaten mehrfach zu hinterlegen.

## Globales Layout

- `SiteContainer` stellt eine responsive Inhaltsbreite mit konsistenten Seitenabständen bereit.
- `SiteHeader` enthält die Figma-nahe Marke, Desktopnavigation, Telefonnummer, CTA und die mobile Navigation.
- `HeaderScrollState` schaltet den sticky Desktop-Header ab `24px` Scrollposition von `92px` auf `76px` Höhe.
- `MobileNavigation` verwaltet ausschließlich die interaktive mobile Menüfunktion.
- `SiteFooter` bündelt Unternehmens-, Kontakt-, Navigations- und Rechtslinks.
- `MobileContactBar` bietet auf kleinen Viewports feste Aktionen zum Anrufen und Anfragen.

Das Root-Layout enthält genau ein `main#main-content`. Seiten liefern nur den Inhalt innerhalb dieses Bereichs.

## UI-Komponenten

- `Button`: Varianten `primary`, `secondary`, `outline`, `link`; als Button oder Next.js-Link
- `NoticeBox`: Varianten `information`, `billing`, `warning`, `error`
- `SectionHeading`: Eyebrow, Beschreibung, Ausrichtung und typisierte Überschriftenebenen
- `ServiceCard`: vollständig verlinkte, wiederverwendbare Leistungskarte

## Navigation und Accessibility

- Aktive Navigationspunkte werden mit `aria-current="page"` gekennzeichnet.
- Das mobile Menü unterstützt Escape, Fokusführung und Schließen beim Routenwechsel.
- Bei geöffnetem Menü wird die Mobile Contact Bar über ein eng begrenztes Body-Datenattribut unsichtbar und nicht interaktiv; nach dem Schließen erscheint sie wieder.
- Ein Skip-Link führt direkt zum Hauptinhalt.
- Sichtbare `focus-visible`-Zustände, semantische Landmarks und mindestens 44 px große Touch-Ziele sind vorgesehen.
- Warnungen und Fehler verwenden zusätzlich zur Farbe eindeutige Beschriftungen und Symbole.
- `prefers-reduced-motion` reduziert Übergänge und deaktiviert weiches Scrollen.

## Responsive Regeln

- Der Inhaltscontainer nutzt eine maximale Breite von `1280px` innerhalb des 1440-px-Referenzlayouts.
- Mobile Seitenabstände beginnen bei `20px` und steigen ab `768px` auf `32px`.
- Unter `1024px` wird die mobile Navigation verwendet; ab `1024px` erscheint die Desktopnavigation.
- Der mobile Header ist `72px` hoch. Der Desktop-Header ist standardmäßig `92px` und gescrollt `76px` hoch.
- Die mobile Kontaktleiste ist unter `768px` sichtbar. Globales Bottom-Padding und `safe-area-inset-bottom` verhindern überdeckte Inhalte.
- Footer-Spalten wechseln responsiv von einer auf zwei und schließlich vier Spalten.

## Startseite (DEV-03)

Die Startseite folgt den Figma-Frames für 1440 px und 390 px. Hero, Vorteile, Leistungen, persönliche Unterstützung mit Leistungsgrenzen, Ablauf, Abrechnung, FAQ und Abschluss-CTA liegen als eigenständige Sections unter `src/components/sections`. Statische Inhalte sind in `src/content` zentralisiert.

- Das Layout stapelt Inhalte mobil, nutzt ab Tablet zweispaltige Karten und auf Desktop bis zu drei Spalten.
- Semantische Sections, eine H1, verknüpfte Überschriften, Skip-Link, Fokuszustände und das tastaturbedienbare FAQ-Accordion unterstützen die Zugänglichkeit.
- Die Startseite besitzt eigene SEO-Metadaten. Canonical und Open-Graph-Bild bleiben bis zur finalen Produktionskonfiguration offen.
- Vorhandene Marken-SVGs bleiben lokal. Die geometrische Hero-Grafik wird ohne externen Figma-Hotlink umgesetzt.
- Die sechs Hauptziele besitzen minimale technische Platzhalter. Leistungskarten verweisen bis DEV-04 gesammelt auf `/leistungen`, um keine Wegwerf-Detailseiten anzulegen.

## Hauptseiten (DEV-04)

Die Routen `/leistungen`, `/kosten-abrechnung`, `/ablauf`, `/ueber-uns`, `/faq` und `/kontakt` sind vollständig als statische Hauptseiten umgesetzt. `PageHero`, `ContentSection`, `PageCta`, `InfoList` und `ProcessStep` bilden ein gemeinsames, responsives Seitensystem.

- Inhalte sind in `services.ts`, `process.ts`, `faq.ts`, `about.ts`, `billing.ts` und `contact.ts` zentral abgelegt.
- Sieben geplante Leistungsdetailrouten liefern bis DEV-05 bewusst nur technische Platzhalter; alle Leistungslinks funktionieren bereits.
- `/datenschutz` ist ausschließlich als technisches Ziel für den Formularhinweis vorhanden. Impressum und Cookie-Einstellungen sind bis zur rechtlichen Umsetzung nicht als Links ausgebildet.
- Das Anfrageformular validiert Pflichtfelder und optionale E-Mail-Adresse lokal, setzt `aria-invalid`/`aria-describedby`, fokussiert den ersten Fehler und zeigt anschließend nur einen Entwicklungszustand. Es sendet oder speichert keine Daten.
- Alle Hauptseiten verwenden individuelle Metadaten, genau eine H1 und semantische Sections. Formulare stapeln mobil und wechseln ab Tablet in ein zweispaltiges Raster.
- Die Figma-Datei enthält aktuell keine separaten Hauptseiten-Frames. Die Seiten übertragen deshalb das freigegebene Startseiten- und Komponentensystem konsistent; dies ist die zentrale verbleibende Figma-Abweichung.

## Offen für DEV-06

- echte Formularübermittlung, E-Mail-Versand und serverseitige Verarbeitung
- vollständige rechtliche Seiten und Cookie-Einstellungsfunktion
- mögliche spätere Ablösung der aus Figma-Logozeichen und HTML-Text aufgebauten Wortmarke durch eine finale kombinierte Logodatei

## Bekannte Abweichungen zu Figma

- Das originale Figma-Logozeichen und Telefon-Icon liegen lokal unter `public/brand`; der Wortmarkentext bleibt für gute Skalierbarkeit und Austauschbarkeit HTML.
- Der grüne CTA verwendet Navy-Schrift statt der weißen Figma-Schrift, um den Kontrast für normalen Text zu erhöhen.
- Die Headerbreite bleibt fluid und wird nicht auf eine feste Figma-Canvasbreite gesetzt.
- Leistungsgrenzen und Notfallhinweis sind aufgrund der fachlichen Vorgaben zusätzlich sichtbar hervorgehoben.

## Visueller Feinschliff (DEV-03.1)

- Typografie und Bedienelemente wurden komponentenbezogen vergrößert: kräftigere Desktop-H1, größere Einleitungen, Karten-, FAQ-, Navigations-, Kontakt- und Footertexte sowie mindestens 15 px große Standardbuttons.
- Der Hero nutzt eine lokale geometrische Komposition aus Navy-, Grün-, Kreuz-, Kreis- und Kartenformen. Sie orientiert sich an der Figma-Bildsprache, benötigt kein externes Bild und vermeidet Stockmaterial.
- Sechs eigenständige SVG-Icons unter `public/icons` unterscheiden Arzt-, Krankenhaus-, Dialyse-, Chemo-/Strahlentherapie-, Reha-/Therapie- und Entlassungsfahrten.
- Vorteile und Leistungskarten erhielten größere Innenabstände, konsistente Mindesthöhen, klarere Schatten sowie stärkere Hover- und Fokuswirkung.
- Der Ablauf besitzt auf Desktop eine verbindende Linie und mobil eine klar geführte vertikale Nummerierung. FAQ, Abrechnungsbox, Abschluss-CTA und Footer wurden in Lesbarkeit und Rhythmus gestärkt.
- Verbleibende Figma-Abweichung: Der Hero bleibt bewusst eine responsive Vektorkomposition statt eines fotografischen Motivs, da im freigegebenen Frame kein finales Foto vorliegt.

## Hauptseiten-Feinschliff (DEV-04.1)

- Die mobile Kontaktseite nutzt kompakte Kontaktzeilen mit Symbol, Label und gut umbrechendem Wert. Erreichbarkeitshinweise werden mobil als gemeinsame Liste statt als drei große Karten dargestellt.
- Formularabstände, Feldhöhen, Hilfetext, Checkbox-Klickfläche und Formular-CTA wurden für 390 px optimiert. Validierungsregeln, ARIA-Verknüpfungen und Fokussteuerung bleiben unverändert erhalten.
- Der Footer ist mobil enger gruppiert; sein Bottom-Abstand berücksichtigt weiterhin die feste Kontaktleiste und Safe-Area. Im Druck wird die mobile Kontaktleiste ausgeblendet.
- Die Serienfahrten-Karte belegt auf Desktop bewusst zwei Spalten. Leistungen- und Kostenprozess nutzen verbundene, horizontale Schritte und bleiben mobil vertikal geführt.
- Inhaltsseiten-Heros verwenden die freie rechte Fläche für eine zurückhaltende geometrische Form und sind auf Desktop etwas kompakter.
- Der in segmentierten Full-Page-Screenshots sichtbare navyfarbene „Balken“ ist die vom Browser-Compositor pro Aufnahmekachel erneut gerenderte feste Mobile Contact Bar; auch Sticky Header und Seitenanfang werden dabei wiederholt. Im echten DOM existiert genau eine Leiste, ohne Transform, Filter oder Backdrop-Filter. Die funktionierende Fixed-Logik wurde deshalb nicht für ein Werkzeug-Artefakt verändert.

## Leistungsdetailseiten (DEV-05)

Die dynamische Route `src/app/leistungen/[slug]/page.tsx` erzeugt sieben vollständig statisch vorgerenderte Leistungsseiten. `ServiceDetailPage` bildet das gemeinsame Seitensystem aus Breadcrumb, Hero, Überblick, Unterstützung, Ablauf, Leistungsgrenzen, optionalem Abrechnungshinweis, FAQ, verwandten Leistungen und Abschluss-CTA. Die Route selbst bleibt dadurch schlank und vollständig als Server Component ausführbar; nur das vorhandene FAQ-Accordion benötigt Client-State.

Das typisierte Datenmodell in `src/content/services.ts` hält alle fachlichen Varianten zentral. Gemeinsame Leistungsgrenzen und Unterstützungstexte werden nur einmal gepflegt; individuelle Eignung, Anlässe, Prozessschritte, Hinweise, FAQ, Beziehungen, Metadaten und CTA-Texte liegen beim jeweiligen Service. Es gibt keine CMS-Simulation und keine Formularübermittlung.

Detailrouten:

- `/leistungen/sitzende-krankenfahrten`
- `/leistungen/arzt-klinikfahrten`
- `/leistungen/dialysefahrten`
- `/leistungen/chemo-strahlentherapiefahrten`
- `/leistungen/reha-therapiefahrten`
- `/leistungen/entlassungsfahrten`
- `/leistungen/serienfahrten`

`Breadcrumbs` verwendet eine beschriftete Navigation, verlinkt Startseite und Leistungsübersicht und markiert die aktuelle Seite mit `aria-current="page"`. Jede Detailseite zeigt zwei bis drei datenbasiert ausgewählte verwandte Leistungen; die aktuelle Leistung wird nicht erneut angeboten. Die leistungsspezifischen FAQ bleiben im Service-Modell zentral und verwenden das bestehende zugängliche Accordion.

Startseiten- und Übersichtskarten verweisen direkt auf die passenden Detailrouten. Abrechnungshinweise führen zentral zu `/kosten-abrechnung`, sämtliche Abschlussaktionen zu `/kontakt` beziehungsweise zum zentral konfigurierten Telefon-Link. Alle Seiten besitzen individuelle Titel und Beschreibungen. Canonicals und absolute strukturierte Daten bleiben bis zur finalen Produktionsdomain bewusst offen; medizinische Schemas, Preise, Bewertungen oder unbelegte Unternehmensangaben werden nicht ausgegeben.

Mobil stapeln Überblicks-, Prozess- und Beziehungskarten einspaltig. Ab `768px` werden geeignete Bereiche mehrspaltig; Textbreiten, Breadcrumb-Umbruch, Touchziele und das globale Bottom-Padding berücksichtigen Header und Mobile Contact Bar. Die Figma-Datei enthält keine eigenen Frames für die sieben Detailseiten, daher übertragen sie das vorhandene Komponenten-, Farb- und Abstandssystem konsistent statt neue unbelegte Layouts einzuführen.

Für DEV-06 offen bleiben insbesondere die echte serverseitige Anfrageverarbeitung, finale Rechtstexte, die Produktionsdomain für Canonicals und absolute strukturierte Daten sowie eine fachliche Freigabe sämtlicher Leistungsformulierungen.

## Sichere Anfrageübermittlung (DEV-06A)

Das Kontaktformular sendet über die Server Action `src/app/kontakt/actions.ts`. Clientseitige Pflichtfeld- und E-Mail-Prüfungen geben unmittelbares Feedback; `src/lib/validation/ride-request.ts` validiert unabhängig davon sämtliche übermittelten Werte erneut, normalisiert Whitespace, begrenzt Feldlängen und plausibilisiert Datum, Uhrzeit, Anlass und Fahrtart. Die Kontaktseite wird dynamisch gerendert, damit jeder Formularaufruf einen eigenen serverseitig geprüften Startzeitpunkt erhält.

Die Formularzustände umfassen Initialzustand, laufende Übermittlung, Validierungsfehler, Server-/Konfigurationsfehler und Erfolg. Der Submit-Button wird während der Übermittlung deaktiviert. Fehler fokussieren das erste betroffene Feld, Statusmeldungen werden über `aria-live` bekannt gegeben und nach erfolgreichem Versand wird das Formular zurückgesetzt sowie die Erfolgsüberschrift fokussiert. Ohne JavaScript kann die Server Action weiterhin über das native Formularziel verarbeitet werden; mit JavaScript ergänzt React den kontrollierten Pending-State.

Der datenschutzfreundliche Basisschutz besteht aus einem Honeypot, einer Mindestdauer von 2,5 Sekunden, einem maximal zwei Stunden alten Formularzeitstempel und einem pro Node-Prozess geführten In-Memory-Limit. Dieses Rate Limit ist nur ein Basisschutz: Serverless-Instanzen teilen und erhalten den Speicher nicht zuverlässig. `RateLimitStore` ist deshalb als austauschbare Schnittstelle vorbereitet; ein verteilter Dienst bleibt für Produktion offen. Es werden keine IP-Adressen oder Formularinhalte im Limit gespeichert.

`src/lib/email/send-ride-request.ts` trennt Formulardaten, Templates und Provider. Ohne gültige Konfiguration verweigert der Development-Provider den Versand, schreibt keine personenbezogenen Daten in die Konsole und erzeugt keinen falschen Erfolgszustand. Für Produktion ist `EMAIL_PROVIDER=resend` ohne zusätzliche SDK-Dependency über die serverseitige HTTPS-API vorbereitet. Die interne E-Mail besitzt Text- und einfache HTML-Versionen, escaped Nutzertexte und weist deutlich darauf hin, dass keine Buchung bestätigt ist. Eine reduzierte Eingangsbestätigung wird nur bei angegebener E-Mail-Adresse und nach erfolgreichem internen Versand versucht.

Benötigte Variablen sind in `.env.example` dokumentiert:

- `EMAIL_PROVIDER=resend`
- `EMAIL_API_KEY`
- `CONTACT_EMAIL_TO`
- `CONTACT_EMAIL_FROM`
- `SITE_URL` als vorbereitete zentrale Produktions-URL

Für einen lokalen Konfigurationstest bleibt `EMAIL_PROVIDER` ungesetzt; das Formular zeigt dann ausdrücklich an, dass nichts versendet wurde. `mock-success` und `mock-error` stehen ausschließlich bei `NODE_ENV !== "production"` für Browserprüfungen zur Verfügung und versenden keine Daten. Mit `MOCK_EMAIL_DELAY_MS` kann lokal ein langsamer Versand bis maximal zwei Sekunden simuliert werden. Ein echter Versandtest benötigt einen gültigen Provider-Schlüssel sowie beim Provider freigegebene Absender- und Empfängeradressen. Secrets gehören ausschließlich in eine nicht versionierte `.env.local` beziehungsweise in die Produktionsumgebung.

Die Datenerhebung bleibt auf Name, Kontaktmöglichkeit und notwendige Fahrtdaten beschränkt. Es gibt keine Diagnose-, Versicherungs-, Dokument- oder Uploadfelder und keine Datenbank. Der optionale Hinweis ist auf 1.000 Zeichen begrenzt und fordert ausdrücklich dazu auf, keine Diagnosen oder Notfalldaten einzugeben. Empfänger und Absender stammen ausschließlich aus der Serverkonfiguration; Formulardaten erscheinen weder in URLs noch in Logs.

Bekannte Einschränkungen: Das lokale Rate Limit ist nicht verteilt, eine optionale Bestätigungs-E-Mail kann nach erfolgreichem internen Versand separat scheitern, und der Resend-Versand benötigt noch produktive Domain-/Absenderfreigabe. Für DEV-06B offen bleiben ein externer verteilter Rate-Limit-Dienst, Monitoring ohne personenbezogene Inhalte, finale Zustellkonfiguration, rechtliche Freigaben und gegebenenfalls serverseitig signierte Formularzeitstempel.
