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

## Offen für DEV-04

- vollständige Folge- und Leistungsdetailseiten sowie finale Zuordnung der Leistungslinks
- Kontaktformular und technische Übermittlung
- mögliche spätere Ablösung der aus Figma-Logozeichen und HTML-Text aufgebauten Wortmarke durch eine finale kombinierte Logodatei
- rechtliche Seiten und Cookie-Einstellungsfunktion

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
