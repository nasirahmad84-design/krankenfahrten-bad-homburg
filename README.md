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
- `SiteHeader` enthält Marke, Desktopnavigation, Telefonnummer, CTA und die mobile Navigation.
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
- Ein Skip-Link führt direkt zum Hauptinhalt.
- Sichtbare `focus-visible`-Zustände, semantische Landmarks und mindestens 44 px große Touch-Ziele sind vorgesehen.
- Warnungen und Fehler verwenden zusätzlich zur Farbe eindeutige Beschriftungen und Symbole.
- `prefers-reduced-motion` reduziert Übergänge und deaktiviert weiches Scrollen.

## Responsive Regeln

- Der Inhaltscontainer nutzt eine maximale Breite von `1280px` innerhalb des 1440-px-Referenzlayouts.
- Mobile Seitenabstände beginnen bei `20px` und steigen ab `768px` auf `32px`.
- Unter `1280px` wird die kompakte Navigation verwendet, damit der Header nicht unkontrolliert umbricht.
- Die mobile Kontaktleiste ist unter `768px` sichtbar. Globales Bottom-Padding und `safe-area-inset-bottom` verhindern überdeckte Inhalte.
- Footer-Spalten wechseln responsiv von einer auf zwei und schließlich vier Spalten.

## Offen für DEV-03

- Umsetzung der eigentlichen Seiten und Inhalte auf Basis des freigegebenen Figma-Designs
- finales Logo beziehungsweise finale Wortmarke
- fachliche Ausgestaltung der Leistungs-, Ablauf-, FAQ- und Kontaktinhalte
- rechtliche Seiten und Cookie-Einstellungsfunktion
