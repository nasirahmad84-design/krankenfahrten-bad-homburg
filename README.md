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
- `npm run build` – erzeugt den statischen Production-Export unter `out/`
- `npm run lint` – prüft den Quellcode mit ESLint
- `npm test` – prüft Clientvalidierung, JSON-Transport, Fehlerantworten, Timeout und die technischen Legal-/Privacy-Invarianten mit dem eingebauten Node-Testläufer
- `npm run test:export` – prüft nach dem Build die drei Rechtsseiten, H1-Struktur und externe Laufzeit-URLs im statischen Export
- `npm run verify:deployment` – auditiert das vollständige Upload-Paket, Canonicals, Sitemap, Links, Fragmente, Assets und ausgeschlossene Dateien

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
- Die Startseite besitzt eigene SEO-Metadaten und einen Canonical für die festgelegte Produktionsdomain. Ein finales Open-Graph-Bild bleibt bewusst offen.
- Vorhandene Marken-SVGs bleiben lokal. Die geometrische Hero-Grafik wird ohne externen Figma-Hotlink umgesetzt.
- Die sechs Hauptziele besitzen minimale technische Platzhalter. Leistungskarten verweisen bis DEV-04 gesammelt auf `/leistungen`, um keine Wegwerf-Detailseiten anzulegen.

## Hauptseiten (DEV-04)

Die Routen `/leistungen`, `/kosten-abrechnung`, `/ablauf`, `/ueber-uns`, `/faq` und `/kontakt` sind vollständig als statische Hauptseiten umgesetzt. `PageHero`, `ContentSection`, `PageCta`, `InfoList` und `ProcessStep` bilden ein gemeinsames, responsives Seitensystem.

- Inhalte sind in `services.ts`, `process.ts`, `faq.ts`, `about.ts`, `billing.ts` und `contact.ts` zentral abgelegt.
- Sieben geplante Leistungsdetailrouten liefern bis DEV-05 bewusst nur technische Platzhalter; alle Leistungslinks funktionieren bereits.
- `/impressum/`, `/datenschutz/` und `/cookie-einstellungen/` bilden die rechtliche Seitenstruktur und sind im Footer verlinkt.
- Das Anfrageformular validiert Pflichtfelder und optionale E-Mail-Adresse lokal, setzt `aria-invalid`/`aria-describedby`, fokussiert den ersten Fehler und übermittelt gültige Anfragen an den PHP-Endpunkt.
- Alle Hauptseiten verwenden individuelle Metadaten, genau eine H1 und semantische Sections. Formulare stapeln mobil und wechseln ab Tablet in ein zweispaltiges Raster.
- Die Figma-Datei enthält aktuell keine separaten Hauptseiten-Frames. Die Seiten übertragen deshalb das freigegebene Startseiten- und Komponentensystem konsistent; dies ist die zentrale verbleibende Figma-Abweichung.

## Offen vor Go-live

- fachliche beziehungsweise rechtliche Freigabe der Inhalte und der Rechtsgrundlagenzuordnung
- produktiver Cookie-, Storage- und Netzwerk-Scan nach dem ALL-INKL-Deployment
- Verifikation der Hosting-Logfristen, E-Mail-Löschfristen und des betrieblichen Löschkonzepts
- Prüfung noch unbekannter anbieter- und branchenspezifischer Pflichtangaben
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

Startseiten- und Übersichtskarten verweisen direkt auf die passenden Detailrouten. Abrechnungshinweise führen zentral zu `/kosten-abrechnung`, sämtliche Abschlussaktionen zu `/kontakt` beziehungsweise zum zentral konfigurierten Telefon-Link. Alle Seiten besitzen individuelle Titel, Beschreibungen, Canonicals und Open-Graph-Grunddaten. Medizinische Schemas, Preise, Bewertungen oder unbelegte Unternehmensangaben werden nicht ausgegeben.

Mobil stapeln Überblicks-, Prozess- und Beziehungskarten einspaltig. Ab `768px` werden geeignete Bereiche mehrspaltig; Textbreiten, Breadcrumb-Umbruch, Touchziele und das globale Bottom-Padding berücksichtigen Header und Mobile Contact Bar. Die Figma-Datei enthält keine eigenen Frames für die sieben Detailseiten, daher übertragen sie das vorhandene Komponenten-, Farb- und Abstandssystem konsistent statt neue unbelegte Layouts einzuführen.

Vor Go-live offen bleiben insbesondere die Prüfung des echten PHP-Mailversands, die fachlich beziehungsweise rechtliche Freigabe und die Freigabe sämtlicher Leistungsformulierungen.

## Statischer Export und PHP-Anfrageübermittlung (DEV-06A.1)

`next.config.ts` verwendet `output: "export"`, Verzeichnis-URLs mit abschließendem Slash und unoptimierte lokale Next-Bilder. `npm run build` erzeugt das vollständig per FTP auslieferbare Paket unter `out/`. Alle Seiten einschließlich `/kontakt/` sind statisch. **Die Anwendung benötigt auf dem Zielserver keinen Node.js-Prozess.**

Das Kontaktformular validiert Pflichtfelder, optionale E-Mail, Datum, Uhrzeit, erlaubte Anlässe und Maximallängen im Browser. Anschließend sendet es ausschließlich per `POST` und JSON an `/api/fahrtanfrage.php`. Pending-, Validierungs-, Serverfehler- und Erfolgszustand, Doppelklickschutz, Timeout, Werterhalt, Formularreset, Fehlerfokus, Erfolgsfokus und `aria-live` bleiben erhalten. Die Clientprüfung dient nur dem Komfort; PHP prüft sämtliche Werte erneut.

`public/api/fahrtanfrage.php` wird beim Export nach `out/api/` kopiert. Die Module unter `public/api/lib/` übernehmen Validierung, Herkunftsprüfung, Formularzeitprüfung, dateibasiertes Rate Limit und UTF-8-Textmail. PHPMailer wird per Composer verwaltet und liegt vollständig unter `public/api/vendor/`, sodass es beim Export nach `out/api/vendor/` kopiert wird. Der Versand nutzt ausschließlich authentifiziertes und verschlüsseltes SMTP: primär Port 587 mit STARTTLS, alternativ Port 465 mit SMTPS. Es gibt keinen stillen Rückfall auf die native PHP-Funktion `mail()`.

Der Empfänger und der technische Absender kommen ausschließlich aus `config.php`; eine Nutzeradresse wird höchstens als validiertes `Reply-To` verwendet. SMTP-Debugging ist deaktiviert, Transportfehler ergeben nur die neutrale bestehende Serverfehlermeldung, und es wird keine automatische Bestätigung an Nutzer versendet.

Der Spam-Basisschutz kombiniert Honeypot, einen plausibilisierten Browserzeitstempel und ein kurzlebiges, dateibasiertes Limit mit HMAC-gehashter IP-Kennung. Vollständige IP-Adressen und Formulardaten werden nicht gespeichert. Der Browserzeitstempel ist ohne Session oder serverseitige Signatur manipulierbar und daher nur ein zusätzliches Signal, keine Sicherheitsgarantie. `Origin` wird, sofern vorhanden, gegen die konfigurierte Domain geprüft; fehlende Header werden aus Kompatibilitätsgründen nicht pauschal blockiert.

Für den statischen Build sind derzeit keine Environment Variables erforderlich. Die produktive PHP-Konfiguration entsteht manuell als `public/api/config.php` beziehungsweise direkt auf dem Server nach Vorlage von `config.example.php`; sie ist durch `.gitignore` ausgeschlossen. Nur dort wird das echte SMTP-Passwort eingetragen. Der Webserver muss PHP 8.1 oder neuer mit OpenSSL ausführen und den Zugriff auf Konfigurations- und Vendor-Dateien per `.htaccess` blockieren. Details stehen in `deployment/ALL-INKL.md` und `deployment/checklist.md`.

Lokale Prüfung:

```bash
npm install
composer install --no-dev --classmap-authoritative
npm test
npm run lint
npm run build
npm run test:export
npm run verify:deployment
find out -maxdepth 3 -type f | sort
```

Wenn PHP installiert ist, zusätzlich alle PHP-Dateien mit `php -l` prüfen und `php tests/php/ride-request-test.php` ausführen. Der PHP-Test lädt den Composer-Autoloader und verwendet ausschließlich einen injizierten Testtransport; er verschickt keine E-Mail. Die echte SMTP-Verbindung und Zustellung bleiben verpflichtende ALL-INKL-Abnahmepunkte.

Ohne lokales PHP kann `node tests/static-export-server.mjs` ausschließlich die exportierten HTML-/Assetdateien und die Frontend-Zustände gegen definierte JSON-Mockantworten prüfen. Dieser Helfer führt kein PHP aus und ersetzt weder `php -l` noch die Hosting-Abnahme.

Die zuvor in Commit `9a6fe3d` eingeführte Server-Action-/Resend-Architektur wurde vollständig verworfen: keine Server Actions, Route Handler, Node-Mail-Provider, Node-Secrets oder dynamische Kontaktseite bleiben bestehen.

## Rechtliche Seiten und technische Datenschutzgrundlagen (DEV-06B)

Die vollständig statischen Routen `/impressum/`, `/datenschutz/` und `/cookie-einstellungen/` verwenden gemeinsame Legal-Komponenten mit klarer Überschriftenhierarchie, begrenzter Textbreite, Fragmentnavigation und angepasster Druckdarstellung. Die Inhalte liegen strukturiert unter `src/content/legal/`; interne offene Prüfpunkte werden nicht in öffentliche Seiten importiert.

`src/content/legal/privacy-inventory.ts` bildet den technisch geprüften Datenfluss ab: statische Seitenauslieferung bei ALL-INKL, mögliche Hosting-Logdaten, Kontakt- und Fahrtanfragedaten, authentifizierten PHP-SMTP-Versand sowie das kurzlebige dateibasierte Rate Limiting mit HMAC-gehashter IP-Kennung. Es bestehen keine Datenbank, keine automatische Nutzerbestätigung und keine dauerhafte Speicherung vollständiger IP-Adressen durch die Anwendung. Die E-Mail kann entsprechend der betrieblichen und hosterseitigen Konfiguration im Postfach gespeichert bleiben.

Die Website setzt nach aktuellem Quellcode- und Exportstand keine Cookies und greift weder auf `localStorage` noch auf `sessionStorage` zu. Das PHP-Formular verwendet keine Session. Analyse, Marketing, Tracking, externe Medien und eine gespeicherte Consent-Entscheidung sind nicht vorhanden. Deshalb wird kein Consent-Banner und keine funktionslose Einstellungsoberfläche eingebaut. Die Cookie-Seite informiert transparent über diesen Status. Nach dem Produktivdeployment muss diese Entscheidung mit einem erneuten Browser- und Netzwerk-Scan bestätigt werden.

Inter wird während des Next-Builds lokal eingebettet. Bilder, SVGs, Skripte und Styles werden von derselben Domain ausgeliefert; es bestehen keine externen Font-CDNs, Karten, Videos, Social-Media-Widgets oder Trackingrequests. Telefon- und E-Mail-Links lösen erst durch eine bewusste Nutzeraktion eine externe Anwendung aus.

Das Kontaktformular verlinkt unmittelbar an der Einwilligung und im Hinweisbereich auf die Datenschutzerklärung. Es verlangt keine Diagnosen oder Notfalldaten und weist auf die fehlende Verbindlichkeit bis zur ausdrücklichen Bestätigung hin. Der PHP-Abgleich umfasst die fest konfigurierte Empfänger- und Absenderadresse, optionales validiertes `Reply-To`, keine Nutzerbestätigung, keine Datenbank, keine Formulardaten-Logs, Origin-Prüfung, technische Formularzeit und das konfigurierbare Rate-Limit.

Print-Styles blenden Headernavigation, Mobile Contact Bar, Footer und Sprungnavigation aus, verwenden helle Hintergründe und verhindern soweit möglich das Trennen einzelner Rechtsabschnitte. Die normale responsive Darstellung bleibt unverändert.

Die noch erforderlichen Freigaben stehen in `deployment/legal-review-checklist.md` und zusätzlich zentral in `src/content/legal/open-items.ts`. Dazu gehören unter anderem Rechtsform, Register-, Steuer-, Aufsichts- und Genehmigungsangaben, die Rechtsgrundlagenzuordnung, Hosting-Logfristen, Auftragsverarbeitungsdetails, E-Mail-Löschfristen und die zuständige Datenschutzaufsicht.

**Die rechtlichen Inhalte müssen vor Veröffentlichung fachlich beziehungsweise rechtlich geprüft und freigegeben werden.**

## Produktions- und Deployment-Vorbereitung (DEV-06C)

Die primäre Produktionsdomain ist zentral in `src/lib/site-url.ts` als `https://krankenfahrten-bad-homburg.de` hinterlegt. Die Variante mit `www` wird nicht als eigenständige Website behandelt, sondern soll dauerhaft auf die primäre Domain weiterleiten. Alle 17 indexierbaren Seiten verwenden daraus abgeleitete absolute Canonicals mit abschließendem Slash und seitenbezogene Open-Graph-Titel, -Beschreibungen und -URLs. `metadataBase`, Anwendungstitel, Standardsprache und lokale Icons werden im Root-Layout gesetzt.

Vor jedem Build erzeugt `scripts/generate-static-seo.mjs` aus der zentralen Routen- und Servicedefinition die statischen Dateien `public/sitemap.xml` und `public/robots.txt`. Die Sitemap enthält nur die 17 öffentlichen Seiten, keine API- oder Entwicklungsziele. `robots.txt` erlaubt die öffentlichen Seiten, sperrt `/api/` für Crawler und verweist auf die Produktions-Sitemap. Es bestehen keine Next.js-Route-Handler.

`src/app/not-found.tsx` liefert die statisch exportierte, deutschsprachige 404-Seite mit Startseiten-, Leistungs-, Kontakt- und Telefonaktion. Aus dem vorhandenen Logozeichen wurden PNG-Icons für Browser und Apple Touch erzeugt; das Standard-Next-Favicon und nicht verwendete Next-Startassets wurden entfernt. Ein Web-App-Manifest wird nicht erzeugt, weil keine PWA-Installierbarkeit vorgesehen ist.

Die `.htaccess` bereitet hostgebundene HTTP-zu-HTTPS- und `www`-zu-non-`www`-Weiterleitungen, Zugriffsschutz, Fehlerseite, Sicherheitsheader und differenzierte Cache-Regeln vor. Statische Assets sind langfristig cachebar; HTML und SEO-Dateien werden revalidiert, PHP-Antworten nicht gespeichert. CSP und HSTS bleiben bis zur erfolgreichen Prüfung auf dem ALL-INKL-Abnahmehost deaktiviert. HTTPS- und Domainweiterleitungen sollen bevorzugt im KAS konfiguriert und anschließend gegen die `.htaccess` auf Widersprüche geprüft werden.

Die PHP-Beispielkonfiguration verwendet die primäre Origin, den ALL-INKL-SMTP-Host und STARTTLS auf Port 587 sowie konfigurierbare Mindest- und Maximalzeiten für das Formular. `api/config.php` wird weiterhin ausschließlich auf dem Server erstellt. Ein sicherer Rate-Limit-Salt kann mit `openssl rand -hex 32` erzeugt werden. Der Endpunkt sendet zusätzlich `Cache-Control: no-store`.

`scripts/verify-deployment.mjs` prüft nach dem Build die 17 Seiten, 404, Sitemap, robots.txt, `.htaccess`, PHP-Dateien, PHPMailer-Autoloader und -Klassen, Icons, Canonicals, H1 und Skip-Links, interne Ziele, Assets und Fragmente. Außerdem schließt es `config.php`, unnötige Composer-Entwicklungsabhängigkeiten, `.env`, Source Maps, TypeScript-, Test- und Node-Serverdateien, lokale URLs, Beispieldomains, Server Actions, Resend-Hinweise und bekannte Secret-Muster aus.

Die ALL-INKL-Schritte stehen in `deployment/ALL-INKL.md`; ergänzend existieren die PHP-Abnahmematrix, Rollback-Anleitung sowie Deployment-, Go-live- und Legal-Review-Checklisten. Das vollständige Upload-Paket liegt nach `npm run build` unter `out/`. **Auf dem Zielserver ist kein Node.js-Prozess erforderlich.** Es findet kein automatisches Deployment statt.

Der öffentliche Standardordnername `icons` wird wegen eines möglichen reservierten Apache-Alias auf dem ALL-INKL-Hosting nicht verwendet. Leistungsicons liegen im Quellcode unter `public/service-icons/` und im Upload-Paket unter `out/service-icons/`; Markenassets bleiben unverändert unter `public/brand/`.

Verbleibende Einschränkungen: Die lokale Testsuite stellt bewusst keine echte Verbindung zum ALL-INKL-SMTP-Server her. SMTP-Anmeldung und -Zustellung, Apache-Header, Weiterleitungen, CSP, HSTS, Dateirechte, Cookie-/Storage-/Netzwerk-Scan und rechtliche Freigabe sind zwingende Abnahmepunkte auf dem Zielhosting. SPF, DKIM und DMARC müssen anschließend geprüft werden. Ein finales Social-Sharing-Bild ist nicht vorhanden und wird deshalb nicht referenziert.
