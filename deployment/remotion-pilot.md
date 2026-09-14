# Remotion-Pilot für redaktionelle Medien

## Zweck und Grenzen

Der Pilot erzeugt aus einem bereits veröffentlichten und redaktionell geprüften
Blogartikel zwei lokale Medien:

- ein 30-sekündiges Hochkantvideo mit 1080 × 1920 Pixeln;
- ein begleitendes Standbild mit 1200 × 900 Pixeln.

Die Ausgabe wird weder automatisch veröffentlicht noch in den Website-Export
aufgenommen. Sie enthält keine Formular-, Patienten- oder Kontaktdaten. Quellen,
Prüfdatum und der Hinweis auf fehlende Einzelfallberatung bleiben sichtbar.

## Bedienung

```bash
npm run video:pilot
```

Die Dateien entstehen unter `artifacts/remotion/`. Dieser Ordner ist absichtlich
von Git ausgeschlossen. Für eine Vorschau mit Remotion Studio:

```bash
npm run video:studio
```

## Eingabe und Prüfung

Aktuelle Pilotquelle:

```text
automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json
```

Vor dem Rendern werden Titel, drei Kernaussagen, mindestens zwei Quellen und das
redaktionelle Prüfdatum validiert. Fehlerhafte Eingaben brechen den Render ab.

## Freigabe und Lizenz

Das Ergebnis ist zunächst ein Evaluations-MVP. Vor einer regelmäßigen
kommerziellen Nutzung muss geprüft werden, ob die konkrete Organisation nach den
aktuellen Remotion-Lizenzbedingungen eine Company License benötigt. Eine spätere
Veröffentlichungsautomation braucht zusätzlich eine ausdrückliche redaktionelle
und plattformspezifische Freigabe.
