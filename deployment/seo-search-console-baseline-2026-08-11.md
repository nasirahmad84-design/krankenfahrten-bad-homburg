# Search-Console-Baseline vom 11. August 2026

Diese Datei dokumentiert den ersten belastbaren Ausgangspunkt für die organische Suche. Sie ist eine Mess- und Priorisierungsgrundlage, keine abschließende Bewertung: Die Stichprobe ist mit 40 Impressionen noch klein.

## Quellen und Zeitraum

- Exportdatum: 11. August 2026
- Search-Console-Filter: Websuche, „Letzte 3 Monate“
- tatsächlich im Diagramm enthaltene Tage: 27. Juli bis 9. August 2026
- Quelldateien: `Diagramm.csv`, `Suchanfragen.csv`, `Seiten.csv`, `Geräte.csv`, `Länder.csv`, `Filter.csv` und `Darstellung in der Suche.csv`
- Quelle: vom Betreiber exportierte Google-Search-Console-Daten

Die Kennzahlen werden erst nach einem neuen Export fortgeschrieben. Tageswerte oder Positionen werden nicht aus externen Rank-Trackern ergänzt.

## Ausgangswerte

| Kennzahl | Ausgangswert |
| --- | ---: |
| Klicks | 2 |
| Impressionen | 40 |
| CTR | 5,0 % |
| impressionsgewichtete durchschnittliche Position | 34,08 |
| Impressionen Desktop | 31 |
| Impressionen Mobil | 9 |
| Impressionen Deutschland | 38 |

Die Positionsangabe wurde aus den täglichen Werten impressionsgewichtet berechnet. Sie dient nur als grobe Baseline, weil sich Suchanfragen, URLs und Suchpositionen innerhalb der Stichprobe stark unterscheiden.

## Frühe Suchsignale

### Suchanfragen

| Suchanfrage | Klicks | Impressionen | CTR | Position | Einordnung |
| --- | ---: | ---: | ---: | ---: | --- |
| krankenfahrten bad homburg | 1 | 4 | 25 % | 21 | wichtigste lokale Hauptanfrage |
| therapiefahrten | 0 | 6 | 0 % | 35,17 | frühes Leistungsinteresse |
| krankenfahrten | 0 | 1 | 0 % | 11 | zu wenig Daten für eine Entscheidung |
| reha heimfahrten am wochenende | 0 | 1 | 0 % | 39 | konkrete Frage mit hoher inhaltlicher Relevanz |
| rehfahrt | 0 | 1 | 0 % | 59 | Schreibvariante, noch ohne belastbare Nachfrage |

### Seiten

| URL | Klicks | Impressionen | CTR | Position | Einordnung |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 1 | 21 | 4,76 % | 34,90 | stärkste Sichtbarkeitsseite |
| `/ueber-uns/` | 1 | 2 | 50 % | 5,50 | zu kleine Stichprobe für Optimierung |
| `/leistungen/reha-therapiefahrten/` | 0 | 7 | 0 % | 31,43 | sinnvoller früher Content-Fokus |
| `/orte/friedrichsdorf/` | 0 | 4 | 0 % | 30 | erstes lokales Signal außerhalb Bad Homburgs |
| `/faq/` | 0 | 3 | 0 % | 2 | gute Position, aber noch keine belastbare CTR-Basis |
| `/leistungen/sitzende-krankenfahrten/` | 0 | 2 | 0 % | 18,50 | beobachten, vorerst nicht überoptimieren |

Die zusätzliche URL ohne abschließenden Slash für die Reha-Seite wird bereits korrekt per 301 auf die kanonische Slash-URL umgeleitet. Es besteht daraus aktuell kein separates Content- oder Canonical-Ticket.

## Umgesetzte Reaktion: SEO-09A

- lokale Hauptleistung und Bad Homburg in der H1 der Startseite präzisiert
- Friedrichsdorf, Oberursel und Frankfurt-Riedberg direkt von der Startseite verlinkt
- Reha- und Therapieseite um die konkrete Frage zu Heim- und Rückfahrten am Wochenende ergänzt
- Friedrichsdorf-Seite in Metadaten und FAQ geschärft
- keine neue Verfügbarkeits-, Kosten- oder Leistungsgarantie eingeführt

Referenzcommit: `658b436` (`feat: optimize early search visibility`)

## Messfenster

| Prüfung | Stichtag | Zweck |
| --- | --- | --- |
| 14-Tage-Review | 25. August 2026 | Indexierung und erste Bewegungen der geänderten Seiten prüfen |
| 28-Tage-Review | 8. September 2026 | Richtung bei Impressionen, Suchanfragen, Positionen und CTR bewerten |

Für jeden Review wird derselbe Search-Console-Export benötigt: Diagramm, Suchanfragen, Seiten, Geräte und Länder. Die Zeiträume müssen im Bericht ausdrücklich genannt werden.

## Entscheidungsregeln

1. **Technische Fehler sofort behandeln.** Nicht indexierbare Zielseiten, falsche Canonicals, 4xx-/5xx-Antworten oder Sitemap-Abweichungen warten nicht auf ein Mindestvolumen.
2. **Keine CTR-Optimierung anhand einzelner Impressionen.** Ein Title-/Description-Test wird erst ab mindestens 50 Impressionen pro URL oder Suchanfrage bewertet.
3. **Content-Chancen vorsichtig priorisieren.** Bei mindestens 20 Impressionen, Position 11 bis 40 und klar passender Suchintention wird zuerst bestehender Inhalt verbessert, bevor eine neue Seite entsteht.
4. **Cannibalization nur mit Daten annehmen.** Erst wenn dieselbe Suchanfrage wiederholt und nennenswert auf mindestens zwei URLs verteilt erscheint, wird eine Zusammenlegung oder interne Neuordnung geprüft.
5. **Ortsseiten brauchen echten lokalen Nutzen.** Neue Ortsseiten entstehen nicht allein wegen einer einzelnen Impression.
6. **Keine Rankinggarantien.** Verbesserungen werden gegen die Baseline gemessen, aber nicht als direkte Folge einer Einzeländerung behauptet.

## Zielrichtung bis zum 28-Tage-Review

- mehr Impressionen für die Startseite zur lokalen Hauptanfrage
- erste zusätzliche Impressionen und möglichst Positionsverbesserung für Reha-/Therapiefahrten
- stabilere Sichtbarkeit der Friedrichsdorf-Seite
- keine zweite indexierbare Reha-URL ohne Slash
- keine neuen Crawl-, Indexierungs- oder Canonical-Probleme

Absolute Zielwerte wären bei dieser frühen Datenlage künstlich. Nach dem 28-Tage-Review kann aus der dann größeren Stichprobe ein belastbareres KPI-Ziel für die folgenden acht bis zwölf Wochen abgeleitet werden.
