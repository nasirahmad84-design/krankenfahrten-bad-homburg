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

`src/lib/site-config.ts` ist die zentrale Quelle für Markenname, Betreiber, Adresse, Telefon, E-Mail, den Google-Rezensionslink sowie Haupt- und Rechtsnavigation. Komponenten greifen auf diese Konfiguration zu, statt Kontaktdaten oder externe Ziel-URLs mehrfach zu hinterlegen.

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
- Das mobile Menü unterstützt Escape, eine zyklische Fokusbegrenzung, Fokus-Rückgabe und Schließen über X, Navigationslink oder Routenwechsel.
- Beim Öffnen wird die aktuelle Scrollposition gesichert und der Body kontrolliert mit `position: fixed` gesperrt. Beim Schließen werden alle vorherigen Inline-Styles wiederhergestellt und die exakte Scrollposition zurückgesetzt.
- Während das Menü geöffnet ist, wird der Header am Viewport fixiert. Ein `ResizeObserver` überträgt seine tatsächliche Höhe in `--mobile-header-height`; das Panel nutzt `100dvh` abzüglich dieser Höhe und scrollt bei niedrigen Displays ausschließlich intern.
- Hauptinhalt, Footer, Skip-Link und Mobile Contact Bar werden währenddessen über `inert` aus der Interaktion genommen. Die Contact Bar ist zusätzlich unsichtbar und nicht bedienbar.
- Ein Skip-Link führt direkt zum Hauptinhalt.
- Sichtbare `focus-visible`-Zustände, semantische Landmarks und mindestens 44 px große Touch-Ziele sind vorgesehen.
- Warnungen und Fehler verwenden zusätzlich zur Farbe eindeutige Beschriftungen und Symbole.
- `prefers-reduced-motion` reduziert Übergänge und deaktiviert weiches Scrollen.

## Responsive Regeln

- Der Inhaltscontainer nutzt eine maximale Breite von `1280px` innerhalb des 1440-px-Referenzlayouts.
- Mobile Seitenabstände beginnen bei `20px` und steigen ab `768px` auf `32px`.
- Unter `1280px` wird die mobile Navigation verwendet; ab `1280px` erscheint die Desktopnavigation.
- Der mobile Header ist `72px` hoch. Der Desktop-Header ist standardmäßig `92px` und gescrollt `76px` hoch.
- Die mobile Kontaktleiste ist unter `768px` sichtbar. Globales Bottom-Padding und `safe-area-inset-bottom` verhindern überdeckte Inhalte.
- Das geöffnete Menü berücksichtigt `safe-area-inset-bottom`; bei Querformat oder niedriger Browserhöhe bleibt der CTA im allein scrollenden Menübereich erreichbar.
- Footer-Spalten wechseln responsiv von einer auf zwei und schließlich vier Spalten.

## Startseite (DEV-03)

Die Startseite folgt den Figma-Frames für 1440 px und 390 px. Hero, Vorteile, Leistungen, persönliche Unterstützung mit Leistungsgrenzen, Ablauf, Abrechnung, FAQ und Abschluss-CTA liegen als eigenständige Sections unter `src/components/sections`. Statische Inhalte sind in `src/content` zentralisiert.

- Das Layout stapelt Inhalte mobil, nutzt ab Tablet zweispaltige Karten und auf Desktop bis zu drei Spalten.
- Semantische Sections, eine H1, verknüpfte Überschriften, Skip-Link, Fokuszustände und das tastaturbedienbare FAQ-Accordion unterstützen die Zugänglichkeit.
- Die Startseite besitzt eigene SEO-Metadaten und einen Canonical für die festgelegte Produktionsdomain. Ein lokales 1200×630-Open-Graph-Bild dient als globale Sharing-Vorschau.
- Der sekundäre CTA „Google-Rezension schreiben“ steht nach dem FAQ im Vertrauensbereich. Er öffnet den zentral hinterlegten Link in einem neuen Tab und fordert ausdrücklich eine ehrliche Rückmeldung ohne Gegenleistung. Es werden weder Sterne noch Bewertungszahlen oder `AggregateRating`-Daten ausgegeben.
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

## Bekannte Abweichungen zu Figma

- Das finale korrigierte Wortlogo liegt als lokales SVG unter `public/brand/logo.svg`. Das daraus abgeleitete Zeichen unter `public/brand/logo-mark.svg` dient Browser- und Apple-Icons.
- Der grüne CTA verwendet Navy-Schrift statt der weißen Figma-Schrift, um den Kontrast für normalen Text zu erhöhen.
- Die Headerbreite bleibt fluid und wird nicht auf eine feste Figma-Canvasbreite gesetzt.
- Leistungsgrenzen und Notfallhinweis sind aufgrund der fachlichen Vorgaben zusätzlich sichtbar hervorgehoben.

## Visueller Feinschliff (DEV-03.1)

- Typografie und Bedienelemente wurden komponentenbezogen vergrößert: kräftigere Desktop-H1, größere Einleitungen, Karten-, FAQ-, Navigations-, Kontakt- und Footertexte sowie mindestens 15 px große Standardbuttons.
- Der Hero nutzt inzwischen ein lokal ausgeliefertes WebP-Motiv mit Fahrer, Fahrgast und Fahrzeug. Text und Aktionen bleiben davon getrennt und lesbar; das Motiv enthält keine eingebetteten Texte und wird nicht von einem externen Bilddienst geladen.
- Sechs eigenständige SVG-Icons unter `public/icons` unterscheiden Arzt-, Krankenhaus-, Dialyse-, Chemo-/Strahlentherapie-, Reha-/Therapie- und Entlassungsfahrten.
- Vorteile und Leistungskarten erhielten größere Innenabstände, konsistente Mindesthöhen, klarere Schatten sowie stärkere Hover- und Fokuswirkung.
- Der Ablauf besitzt auf Desktop eine verbindende Linie und mobil eine klar geführte vertikale Nummerierung. FAQ, Abrechnungsbox, Abschluss-CTA und Footer wurden in Lesbarkeit und Rhythmus gestärkt.
- Die frühere Vektorkomposition wurde im Rahmen von SEO-04 durch das freigegebene fotografische Motiv ersetzt.

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

Jede erfolgreich versendete interne Anfrage enthält zusätzlich genau eine RFC-5545-Kalenderdatei. `public/api/lib/calendar.php` kombiniert Fahrtdatum und Uhrzeit in `Europe/Berlin`, konvertiert den einstündigen Termin nach UTC, erzeugt eine HMAC-basierte UID ohne personenbezogene Klartextdaten und faltet UTF-8-Zeilen bei höchstens 75 Oktetten. Dauer und Erinnerung sind serverseitig konfigurierbar; `0` deaktiviert die Erinnerung. Die ICS-Datei entsteht nur im Arbeitsspeicher und wird mit `addStringAttachment` an das interne Anfragepostfach gesendet. Es gibt keine Kalender-API, keine automatische externe Übertragung und keine dauerhafte Kalenderdatei auf dem Webserver.

Die ICS-Datei ist ein verpflichtender Teil des internen Arbeitsablaufs: Ungültige Kalenderdaten oder eine fehlende beziehungsweise unzulässige Kalenderkonfiguration brechen den gesamten Mailversand kontrolliert ab. Das Formular erhält weiterhin nur die neutrale Serverfehlermeldung. Da keine Rückfahrtzeit abgefragt wird, enthält der Anhang genau ein Ereignis für die Abholung; „Hin- und Rückfahrt“ wird lediglich in der Beschreibung vermerkt. Ein separates Rückfahrtdatum, eine Rückfahrtzeit und optional ein zweites `VEVENT` bleiben möglicher späterer Ausbau.

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

Wenn PHP installiert ist, zusätzlich alle PHP-Dateien mit `php -l` prüfen sowie `php tests/php/calendar-test.php` und `php tests/php/ride-request-test.php` ausführen. Die PHP-Tests laden den Composer-Autoloader und verwenden ausschließlich einen injizierten Testtransport; sie verschicken keine E-Mail und legen keine personenbezogene ICS-Datei ab. Die echte SMTP-Verbindung, Zustellung und Kalenderkompatibilität bleiben verpflichtende ALL-INKL-Abnahmepunkte.

Ohne lokales PHP kann `node tests/static-export-server.mjs` ausschließlich die exportierten HTML-/Assetdateien und die Frontend-Zustände gegen definierte JSON-Mockantworten prüfen. Dieser Helfer führt kein PHP aus und ersetzt weder `php -l` noch die Hosting-Abnahme.

Die zuvor in Commit `9a6fe3d` eingeführte Server-Action-/Resend-Architektur wurde vollständig verworfen: keine Server Actions, Route Handler, Node-Mail-Provider, Node-Secrets oder dynamische Kontaktseite bleiben bestehen.

## Rechtliche Seiten und technische Datenschutzgrundlagen (DEV-06B)

Die vollständig statischen Routen `/impressum/`, `/datenschutz/` und `/cookie-einstellungen/` verwenden gemeinsame Legal-Komponenten mit klarer Überschriftenhierarchie, begrenzter Textbreite, Fragmentnavigation und angepasster Druckdarstellung. Die Inhalte liegen strukturiert unter `src/content/legal/`; interne offene Prüfpunkte werden nicht in öffentliche Seiten importiert.

`src/content/legal/privacy-inventory.ts` bildet den technisch geprüften Datenfluss ab: statische Seitenauslieferung bei ALL-INKL, mögliche Hosting-Logdaten, Kontakt- und Fahrtanfragedaten, authentifizierten PHP-SMTP-Versand, den ausschließlich im Arbeitsspeicher erzeugten internen ICS-Anhang sowie das kurzlebige dateibasierte Rate Limiting mit HMAC-gehashter IP-Kennung. Es bestehen keine Datenbank, keine Kalender-API, keine automatische Nutzerbestätigung und keine dauerhafte Speicherung vollständiger IP-Adressen oder ICS-Dateien durch die Anwendung. Die E-Mail samt Anhang kann entsprechend der betrieblichen und hosterseitigen Konfiguration im Postfach gespeichert bleiben.

Google Analytics 4 ist mit der Mess-ID `G-WD56RCXD03` vorbereitet und wird im Basic Consent Mode erst nach ausdrücklicher Zustimmung geladen. Vor der Zustimmung gibt es keinen Request an Google. Die notwendige Auswahl wird für 180 Tage im First-Party-Cookie `kfbh_analytics_consent` gespeichert; `localStorage`, `sessionStorage` und PHP-Sessions bleiben ungenutzt. Bei Zustimmung sind nur `analytics_storage` und die bewusst definierten Ereignisse aktiv. `ad_storage`, `ad_user_data`, `ad_personalization`, Google Signals und Werbepersonalisierung bleiben abgelehnt.

Gemessen werden Seitenaufrufe, erfolgreiche Formularübermittlungen als `generate_lead` sowie Klicks auf Telefon, WhatsApp und Google-Rezensionen. Formularfelder und personenbezogene Fahrtangaben werden nicht als Analytics-Parameter übermittelt. Die Cookie-Seite bietet Zustimmung, Ablehnung und späteren Widerruf; beim Widerruf werden erreichbare GA-Cookies dieser Domain entfernt. Nach dem Produktivdeployment müssen das Verhalten vor und nach Zustimmung, alle Cookies und sämtliche Netzwerkrequests erneut geprüft werden.

Inter wird während des Next-Builds lokal eingebettet. Bilder, SVGs, Styles und die übrigen Anwendungsskripte werden von derselben Domain ausgeliefert; es bestehen keine externen Font-CDNs, Karten, Videos oder Social-Media-Widgets. Nur nach Analytics-Einwilligung wird das Google-Tag von `www.googletagmanager.com` geladen und werden Messdaten an Google-Analytics-Endpunkte übertragen. Telefon-, WhatsApp- und Social-Links öffnen externe Ziele erst durch eine bewusste Nutzeraktion.

Das Kontaktformular verlinkt unmittelbar an der Einwilligung und im Hinweisbereich auf die Datenschutzerklärung. Es verlangt keine Diagnosen oder Notfalldaten und weist auf die fehlende Verbindlichkeit bis zur ausdrücklichen Bestätigung hin. Der PHP-Abgleich umfasst die fest konfigurierte Empfänger- und Absenderadresse, optionales validiertes `Reply-To`, keine Nutzerbestätigung, keine Datenbank, keine Formulardaten-Logs, Origin-Prüfung, technische Formularzeit und das konfigurierbare Rate-Limit.

Print-Styles blenden Headernavigation, Mobile Contact Bar, Footer und Sprungnavigation aus, verwenden helle Hintergründe und verhindern soweit möglich das Trennen einzelner Rechtsabschnitte. Die normale responsive Darstellung bleibt unverändert.

Die noch erforderlichen Freigaben stehen in `deployment/legal-review-checklist.md` und zusätzlich zentral in `src/content/legal/open-items.ts`. Dazu gehören unter anderem Rechtsform, Register-, Steuer-, Aufsichts- und Genehmigungsangaben, die Rechtsgrundlagenzuordnung, Hosting-Logfristen, Auftragsverarbeitungsdetails, E-Mail-Löschfristen und die zuständige Datenschutzaufsicht.

**Die rechtlichen Inhalte müssen vor Veröffentlichung fachlich beziehungsweise rechtlich geprüft und freigegeben werden.**

## Produktions- und Deployment-Vorbereitung (DEV-06C)

Die primäre Produktionsdomain ist zentral in `src/lib/site-url.ts` als `https://krankenfahrten-bad-homburg.de` hinterlegt. Die Variante mit `www` wird nicht als eigenständige Website behandelt, sondern soll dauerhaft auf die primäre Domain weiterleiten. Alle 26 indexierbaren Seiten verwenden daraus abgeleitete absolute Canonicals mit abschließendem Slash und seitenbezogene Open-Graph-Titel, -Beschreibungen und -URLs. `metadataBase`, Anwendungstitel, Standardsprache und lokale Icons werden im Root-Layout gesetzt.

Vor jedem Build erzeugt `scripts/generate-static-seo.mjs` aus der zentralen Routen-, Service- und Ortsdefinition die statischen Dateien `public/sitemap.xml` und `public/robots.txt`. Die Sitemap enthält nur die 26 öffentlichen Seiten, keine API- oder Entwicklungsziele. `robots.txt` erlaubt die öffentlichen Seiten, sperrt `/api/` für Crawler und verweist auf die Produktions-Sitemap. Es bestehen keine Next.js-Route-Handler.

`src/app/not-found.tsx` liefert die statisch exportierte, deutschsprachige 404-Seite mit Startseiten-, Leistungs-, Kontakt- und Telefonaktion. Aus dem finalen Logozeichen wurden transparente PNG-Icons für Browser und Apple Touch erzeugt; das Standard-Next-Favicon und nicht verwendete Next-Startassets wurden entfernt. Ein Web-App-Manifest wird nicht erzeugt, weil keine PWA-Installierbarkeit vorgesehen ist.

Die `.htaccess` bereitet hostgebundene HTTP-zu-HTTPS- und `www`-zu-non-`www`-Weiterleitungen, Zugriffsschutz, Fehlerseite, Sicherheitsheader und differenzierte Cache-Regeln vor. Statische Assets sind langfristig cachebar; HTML und SEO-Dateien werden revalidiert, PHP-Antworten nicht gespeichert. CSP und HSTS bleiben bis zur erfolgreichen Prüfung auf dem ALL-INKL-Abnahmehost deaktiviert. HTTPS- und Domainweiterleitungen sollen bevorzugt im KAS konfiguriert und anschließend gegen die `.htaccess` auf Widersprüche geprüft werden.

Die PHP-Beispielkonfiguration verwendet die primäre Origin, den ALL-INKL-SMTP-Host und STARTTLS auf Port 587 sowie konfigurierbare Mindest- und Maximalzeiten für Formular, Kalenderdauer und Erinnerung. `api/config.php` wird weiterhin ausschließlich auf dem Server erstellt. Rate-Limit- und Kalender-UID-Salt müssen getrennt mit `openssl rand -hex 32` erzeugt werden. Der Endpunkt sendet zusätzlich `Cache-Control: no-store`.

`scripts/verify-deployment.mjs` prüft nach dem Build die 26 Seiten, 404, Sitemap, robots.txt, `.htaccess`, PHP- und Kalenderdateien, PHPMailer-Autoloader und -Klassen, ICS-Speicheranhang, Icons, Canonicals, H1 und Skip-Links, interne Ziele, Assets und Fragmente. Außerdem schließt es `config.php`, dauerhaft erzeugte `.ics`-Dateien, Kalender-Secrets und externe Kalenderintegrationen, unnötige Composer-Entwicklungsabhängigkeiten, `.env`, Source Maps, TypeScript-, Test- und Node-Serverdateien, lokale URLs, Beispieldomains, Server Actions, Resend-Hinweise und bekannte Secret-Muster aus.

Die ALL-INKL-Schritte stehen in `deployment/ALL-INKL.md`; ergänzend existieren die PHP-Abnahmematrix, Rollback-Anleitung sowie Deployment-, Go-live- und Legal-Review-Checklisten. Das vollständige Upload-Paket liegt nach `npm run build` unter `out/`. **Auf dem Zielserver ist kein Node.js-Prozess erforderlich.** Es findet kein automatisches Deployment statt.

Die FTP-Deploymentbefehle prüfen vor dem Build, ob die ausschließlich serverseitige `api/config.php` im Zielverzeichnis vorhanden ist. Nach dem Upload müssen `config.php` und `config.example.php` per HTTP jeweils 403 liefern. Zusätzlich prüft ein absichtlich zu früher, ansonsten gültiger Formular-POST die aktive Origin- und PHP-Konfiguration; erwartet wird HTTP 400, ohne Rate-Limit oder E-Mail-Versand auszulösen. Fehlt die Konfiguration, ist sie ungeschützt oder passt `allowed_origin` nicht zur Ziel-Domain, wird das Deployment nicht als erfolgreich gemeldet.

Der öffentliche Standardordnername `icons` wird wegen eines möglichen reservierten Apache-Alias auf dem ALL-INKL-Hosting nicht verwendet. Leistungsicons liegen im Quellcode unter `public/service-icons/` und im Upload-Paket unter `out/service-icons/`; das finale Wortlogo und sein abgeleitetes Zeichen liegen unter `public/brand/`.

Verbleibende Einschränkungen: Die lokale Testsuite stellt bewusst keine echte Verbindung zum ALL-INKL-SMTP-Server her. SMTP-Anmeldung und -Zustellung, Apache-Header, Weiterleitungen, CSP, HSTS, Dateirechte, Cookie-/Storage-/Netzwerk-Scan und rechtliche Freigabe sind zwingende Abnahmepunkte auf dem Zielhosting. SPF, DKIM und DMARC müssen anschließend geprüft werden.

## SEO-Grundlagen vor Go-live (SEO-01A, SEO-03, SEO-05, SEO-06A)

Der Produktions-Export enthält 26 individuelle indexierbare Seiten mit genau einer H1, einem Canonical zur primären Domain sowie individuellen Titles und Descriptions. Die Leistungsseitentitel wurden anhand ihrer Suchintention verkürzt. Open-Graph-Titel, Beschreibung, URL, Site Name und `de_DE` bleiben erhalten. Alle Seiten verwenden das lokale 1200×630-Open-Graph-Motiv und eine `summary_large_image`-Twitter-Card.

## Regionale Landingpages (SEO-08)

Die regionale Struktur folgt dem bestätigten Zwiebelprinzip ab Bad Homburg. `/orte/` bündelt die acht individuellen Ortsseiten für Burgholzhausen, Köppern, Friedrichsdorf, Oberursel, Frankfurt-Riedberg, Frankfurt-Bonames, Nieder-Eschbach und Kalbach. Bad Homburg bleibt als zentraler Standort auf der Startseite verankert und wird nicht durch eine zweite, konkurrierende Ortsseite dupliziert.

Jede Ortsseite enthält eigenständige Angaben zur Ortsstruktur, zur eindeutigen Abholung und zu typischen regionalen Fahrtanlässen. Die sachlichen Ortsangaben beruhen auf offiziellen Quellen der Städte Friedrichsdorf, Oberursel und Frankfurt, die in `src/content/locations.ts` dokumentiert sind. Die Seiten nennen bewusst keine festen Fahrzeiten, keine garantierte Verfügbarkeit, keine Partnerbeziehungen und keinen öffentlichen Maximalradius. Eine Fahrt wird immer anhand der konkreten Adressen, Uhrzeit und Kapazität geprüft und erst durch ausdrückliche Bestätigung verbindlich.

Weitere Orte sollen erst ergänzt werden, wenn ein eigener regionaler Informationswert und eine verlässlich prüfbare Nachfrage bestehen. Das verhindert austauschbare Ortsseiten ohne echten Mehrwert.

Die Startseite enthält genau ein serverseitig vorgerendertes `LocalBusiness`-JSON-LD aus `src/lib/local-business-structured-data.ts`. Es verwendet nur bestätigte Unternehmens-, Kontakt-, Adress-, Einsatzgebiets- und Leistungsangaben. Das verifizierte Facebook-Profil ist der einzige `sameAs`-Eintrag; Erreichbarkeit und Fahrbetrieb sind für Montag bis Sonntag von `00:00` bis `23:59` ausgezeichnet. Bewertungen, Koordinaten, Preisbereich und nicht angebotene Beförderungsarten fehlen bewusst.

`public/.htaccess` verwendet `ErrorDocument 404 /404.html`, enthält keinen SPA-Fallback und schützt den internen 404-Unteraufruf vor erneuter Rewrite-Verarbeitung. Der Live-Audit-Status 500 kann lokal nicht mit Apache/ALL-INKL reproduziert werden. Deshalb muss der tatsächliche Status nach Upload anhand von `deployment/seo-audit-checklist.md` geprüft werden; mögliche Ursachen außerhalb des Repositorys sind ein falsches Domain-Webroot, eine fehlende `404.html`, Dateirechte oder eine abweichende Server-Fehlerkonfiguration.

Die Testdomain wird nicht über produktive Metadata oder `robots.txt` auf `noindex` gesetzt, weil dasselbe Exportpaket später produktiv eingesetzt wird. Nach jedem Upload in das Test-Webroot muss der Block aus `deployment/staging.htaccess.example` manuell an die dort aktive `.htaccess` angefügt werden. Danach:

```bash
curl -I https://test.krankenfahrten-bad-homburg.de/
```

Erwartet wird `X-Robots-Tag: noindex, nofollow, noarchive`. Vor dem Go-live muss dieser Testdomain-Block aus der produktiv verwendeten `.htaccess` entfernt werden. Auf `https://krankenfahrten-bad-homburg.de/` darf der Header nicht erscheinen. `robots.txt` ist kein Ersatz für diesen Header. Ein optionaler Passwortschutz kann zusätzlich im ALL-INKL-KAS eingerichtet werden; Zugangsdaten werden nicht im Repository vorgegeben.

Die statische Verifikation prüft außerdem interne Links, Fragmente, Trailing Slashes, Bildziele, Alt-Attribute, Sitemap, robots.txt, 404-noindex, fehlende produktive noindex-Metadaten, externe Laufzeitressourcen und das strukturierte Datenobjekt. Lighthouse ist lokal nicht verfügbar und wurde nicht als zusätzliche Abhängigkeit installiert; es werden daher keine lokalen Lighthouse-Werte behauptet.

## Bildintegration und Social Sharing (SEO-04)

Die vier fotografischen Motive wurden mit der integrierten Bildgenerierung eigens für das Projekt erzeugt und lokal zu WebP ohne EXIF- oder GPS-Metadaten konvertiert. Sie sind illustrative Darstellungen mit fiktiven Personen, keine echten Kunden. Das Motiv auf `/ueber-uns/` ist kein Porträt von Mubasher Ahmad und wird neutral beschrieben; ein echtes Betreiberfoto bleibt ein späterer Austauschpunkt.

| Datei | Abmessungen | Größe | Einsatz und Alt-Text | Zuschnitt |
| --- | ---: | ---: | --- | --- |
| `images/home/hero-krankenfahrt.webp` | 1800×1100 | 169 KiB | Startseiten-Hero: „Fahrer öffnet einem älteren Fahrgast die hintere Fahrzeugtür.“ | mobil 58 %, Desktop 55 % |
| `images/home/persoenliche-unterstuetzung.webp` | 1400×900 | 118 KiB | Unterstützung: „Fahrer begleitet einen älteren Fahrgast zum Eingang einer Praxis.“ | 52 % horizontal |
| `images/services/leistungen-hero.webp` | 1400×900 | 99 KiB | Leistungen: „Fahrer und älterer Fahrgast stehen neben einem Fahrzeug vor einer Praxis.“ | 40 % horizontal |
| `images/about/betreiber-mit-fahrzeug.webp` | 1200×900 | 121 KiB | Über uns: „Fahrer steht neben einem dunklen Fahrzeug des Fahrdienstes.“ | 48 % horizontal |
| `images/social/og-default-1200x630.webp` | 1200×630 | 32 KiB | rein grafische Sharing-Vorschau mit finalem Wortlogo | ohne Zuschnitt |

`SectionImage` reserviert die intrinsischen Abmessungen, setzt responsive `sizes` und lädt Abschnittsbilder verzögert. Nur das Startseiten-Hero wird als wahrscheinliches LCP-Bild über das in Next.js 16 aktuelle `preload`-Prop vorab geladen; das im Ticket genannte `priority` ist in dieser Version veraltet. Es gibt keine externen Bildrequests, Base64-Bilder, Slider oder informative CSS-Hintergrundbilder.

Das grafische Open-Graph-Motiv verwendet Logo, Navy, Grün und Weiß und liegt unter `https://krankenfahrten-bad-homburg.de/images/social/og-default-1200x630.webp`. Der Footer verlinkt ausschließlich das verifizierte Facebook-Profil als normalen zugänglichen Link ohne Pixel, Widget, Feed, Tracking oder externes JavaScript. Instagram und LinkedIn werden mangels verifizierter Profile nicht verlinkt.

## Finale Markenassets

Das vom Betreiber bereitgestellte korrigierte SVG ist die verbindliche Quelle. Für das Webpaket werden daraus folgende lokale Formate verwendet:

- `public/brand/logo.svg`: beschnittenes, transparentes Wortlogo für den Header und `LocalBusiness.logo`
- `public/brand/logo-mark.svg`: quadratischer Vektorausschnitt des finalen Zeichens
- `src/app/icon.png`: transparentes 512×512-Browsericon
- `src/app/apple-icon.png`: transparentes 180×180-Apple-Touch-Icon
- `public/images/social/og-default-1200x630.webp`: Sharing-Motiv mit finalem Wortlogo

Entfernt wurde ausschließlich die vollflächige weiße Hintergrundfläche der gelieferten Datei, damit das Logo auf Weboberflächen transparent funktioniert. Formen, Wortmarke und Markenfarben wurden nicht verändert. Die gelieferte große PNG-Datei dient nur als visuelle Referenz; die Website lädt für das Logo die verlustfreie skalierbare SVG-Variante.

Nach Upload sind die Bildausschnitte auf 390, 768, 1024, 1280 und 1440 Pixel Breite, die WhatsApp-/Facebook-Vorschau, Netzwerkrequests und das serverseitige Caching erneut zu prüfen.

## Abnahme vom 28. Juli 2026

Der lokale Export wurde bei 320, 375, 390, 430, 768, 1024, 1280 und 1440 Pixel Breite geprüft. Startseite, Kontakt, Über uns, Leistungen und Orts-Hub zeigten keine horizontale Überbreite oder Konsolenfehler. Das Menü wurde zusätzlich bei 393×852 Pixeln sowie nach dem Wechsel auf 852×393 geprüft; im niedrigen Querformat wird ausschließlich das Panel scrollbar. Öffnen am Seitenanfang, Öffnen nach vorherigem Scrollen, Schließen über X, Escape und Navigationslink, Fokus-Rückgabe, Scrollpositions-Erhalt und die ausgeblendete Mobile Contact Bar wurden nachvollzogen.

Die Testdomain lieferte für `/`, `/leistungen/` und `/orte/` HTTP 200 sowie für eine unbekannte URL HTTP 404. Alle vier Antworten enthielten `X-Robots-Tag: noindex, nofollow, noarchive`. Die Produktionsdomain lieferte keinen `noindex`-Header. Der Header wird ausschließlich serverseitig auf der Testdomain gesetzt und ist nicht in den statischen Produktionsmetadaten eingebaut.

Die Testdomain entspricht dem lokalen Stand vor diesem Batch: 26 Sitemap-URLs, Ortsseiten, finales Logo, Hero-, Open-Graph-Bild, Facebook-Link und zentrale Laufzeit-Chunks stimmen; der CSS-Hash und ein Seitenskript unterscheiden sich, und der neue Google-Rezensions-CTA fehlt dort noch. Ein neuer lokaler Build erscheint nicht automatisch auf dem Webspace. Für diesen Batch ist ein erneuter manueller FTP-/SFTP-Upload von `out/` erforderlich.

Live geprüft wurden langfristiges Caching für CSS, JavaScript und WebP, Revalidierung für HTML, `no-store` für PHP sowie Brotli-Kompression für HTML, CSS und JavaScript. Das Open-Graph-Bild liefert HTTP 200 und misst 1200×630 Pixel. Facebook- und Google-Rezensionslink sind erreichbar. WebP wird erwartungsgemäß nicht zusätzlich komprimiert. Lighthouse bleibt ein manueller Go-live-Test; es werden keine Werte behauptet.

Nach Betreiberangabe ist DKIM für die Hauptdomain eingerichtet. Für die Test-Subdomain ist keine separate DKIM-Konfiguration erforderlich. DNS-Einträge wurden nicht verändert; SPF und DMARC bleiben manuelle Prüfpositionen.

Die vorhandene `.htaccess` enthält bereits eine hostgebundene 301-Regel von `www` auf non-`www`. Live liefert `https://www.krankenfahrten-bad-homburg.de/` dennoch HTTP 200. Im ALL-INKL-KAS muss deshalb für `www` manuell eine permanente Domainweiterleitung auf `https://krankenfahrten-bad-homburg.de/` eingerichtet und danach auf genau einen 301-Schritt ohne Schleife geprüft werden.

## Search-Console-Baseline (SEO-09)

Die erste Search-Console-Auswertung ist in `deployment/seo-search-console-baseline-2026-08-11.md` dokumentiert. Sie hält Datenquelle, Ausgangswerte, frühe Suchsignale, umgesetzte Reaktionen sowie verbindliche Reviews am 25. August und 8. September 2026 fest. Wegen der kleinen Ausgangsstichprobe werden weder einzelne Impressionen überbewertet noch künstliche Rankingziele behauptet.

## Automatisierter Ratgeber (BLOG-00)

Die Recherche-, Entwurfs-, Review- und Veröffentlichungsstrecke ist unter `automation/blog/` dokumentiert. Sie verwendet getrennte Läufe, artikelbezogene Quellen- und Claim-Register sowie harte Freigabegates. Freigegebene JSON-Beiträge werden deterministisch in die statische Website übertragen; Entwürfe werden niemals direkt gerendert. Ein Artikellauf führt nur die gezielten Blogtests und die Blogexportprüfung aus. Der technisch notwendige statische Build wird intern erzeugt, anschließend werden aber ausschließlich `out/ratgeber/`, `out/sitemap.xml` und benötigte Dateien aus `out/_next/static/` übertragen. Nach einem erfolgreichen Testdomain-Smoke-Test darf derselbe Blog-Delta ohne Vier-Läufe-Wartephase live veröffentlicht werden. Der vollständige Website-Deploymentprozess bleibt separaten Website-Releases vorbehalten.

BLOG-01 stellt den öffentlichen Bereich unter `/ratgeber/` und statisch generierte Detailseiten unter `/ratgeber/[slug]/` bereit. Nur Einträge aus `src/content/blog-posts.ts` werden gebaut, intern verlinkt und in die Sitemap aufgenommen. Der erste Pilotbeitrag unterscheidet Krankenfahrt und Krankentransport anhand geprüfter Quellen von G-BA, KBV und BMG.

Der manuelle Cloud-MVP liegt in `.github/workflows/blog-manual.yml`. Er verwendet zwei getrennte OpenAI-Responses-Aufrufe mit Websuche: zuerst Recherche und Entwurf, anschließend ein unabhängiger Quellen- und Claim-Review ohne gemeinsamen Gesprächsverlauf. Nur ein vollständig bestandener Review wird als Blog-Delta auf Test- und anschließend auf Live-Domain veröffentlicht. Ein fehlendes Thema oder ein blockierter Claim führt zu keiner Veröffentlichung. Der Workflow besitzt bewusst noch keinen Zeitplan und keine Facebook-Automation; diese werden erst nach einem erfolgreichen manuellen End-to-End-Lauf freigeschaltet. Lokal kann der Runner mit `npm run blog:cloud-run` gestartet werden, sofern `OPENAI_API_KEY` ausschließlich über die Umgebung bereitgestellt wird.
