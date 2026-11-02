# Blog- und Google-Pipeline: Fehlerbehebung 02.11.2026

## Ursache

Der erste fällige Release (29.10., Run 40900012065) brach im TypeScript-Build ab:
`tests/google-business-queue.test.mts` griff ohne Typverengung auf optionales
`payload.media` zu. Danach war die eintägige Aktualitätsfreigabe abgelaufen.
Der älteste Artikel blockierte weitere Artikel; Blog, Gesundheit und Google
meldeten dieselbe Fehlerkette separat. Keine FTP-/OAuth-Ursache.

## Kleine, gezielte Reparatur

- Vor Zugriff wird das freigegebene Bild ausdrücklich geprüft; Typprüfung bleibt an.
- Blog-Tests enthalten jetzt auch die Google-Publisher-Tests.
- Eigener Regression-Workflow prüft bei Codeänderungen Tests, TypeScript und
  PHP-Alarmfunktionen, ohne Veröffentlichung oder kostenpflichtige KI-Aufrufe.
- Veraltete/fehlerhafte Termine werden gesperrt und gemeldet; unabhängig gültige
  spätere Termine können weiterlaufen. Keine stillschweigende Quellenfreigabe.
- Google verarbeitet unabhängige Artikel auch nach einem Einzelfehler weiter.
  Fehlende Live-Artikel gehören zur Blog-Alarmierung, nicht zu einem zweiten
  Google-Fehler. OAuth-, Bild-, Zustands- und tatsächliche Versandfehler bleiben Fehler.
- Alarm-Endpoint bündelt Publisher/Gesundheit pro Commit für 24 Stunden unter
  exklusiver Dateisperre. Nur erfolgreicher SMTP-Versand setzt den Zeitstempel.
  Eigenständige Google-Fehler bleiben separat; nach 24 Stunden erneute Erinnerung.
  Die Bündelung ist kein Ursachenklassifizierer und kann innerhalb dieses Fensters
  weitere Blogfehler desselben Commits zusammenfassen; alle Läufe bleiben in Actions sichtbar.
- Alarmzustand enthält nur Versandzeit/Run-ID im serverseitigen Temp-Verzeichnis,
  keine Zugangsdaten, Artikel-, Kontakt- oder Formulardaten. Bei Temp-Bereinigung
  ist eine erneute Meldung möglich. Schreibfehler melden HTTP 500.

## Nachholprüfung

Die freigegebenen Inhalte vom 29.10. und 02.11. wurden am 02.11. erneut mit
den Betreiberseiten Ablauf/FAQ und der offiziellen Klinik-Kontaktseite verglichen.
Klinik Usingen: Weilburger Str. 48, 61250 Usingen. Keine Änderungen der Aussagen.
Redaktionelle Organisationshinweise sind keine medizinischen Empfehlungen oder
Verfügbarkeitszusagen. Bewusstes Nachholfenster für diese Grundlagenartikel bis
09.11.; keine automatische Verlängerung. Freigabe und Nachholauftrag des Betreibers
bleiben getrennt vom fachlichen Recheck dokumentiert. Keine zukünftigen Artikel vorziehen.

Quellen:
- https://krankenfahrten-bad-homburg.de/ablauf/
- https://krankenfahrten-bad-homburg.de/faq/
- https://www.hochtaunus-kliniken.de/kontakt

## Veröffentlichung und Wiederherstellung

Der Cloud-Workflow sichert vor dem ersten Upload auf beiden Domains die bisherigen
öffentlich ausgelieferten Hub-, Sitemap- und betroffenen Artikel-/RSC-Dateien.
Das Actions-Artefakt `blog-backup-RUN-ID` muss vor Upload erfolgreich gespeichert sein.
Manifest dokumentiert auch vorher fehlende (404) Dateien. HTML/RSC/Sitemap können
aus dem Artefakt an dieselben relativen FTP-Pfade zurückgespielt werden; neue
Artikelpfade gemäß Manifest entfernen. Gehashte Next-Assets werden nur ergänzt,
nicht gelöscht; alte Assets bleiben für Rückkehr zum alten Stand erreichbar.
SMTP-/API-Konfigurationen und andere Seiten werden vom Blog-Delta nicht berührt.
Das geprüfte neue Paket bleibt zusätzlich als `blog-release-RUN-ID` erhalten.

Test zuerst, dann dasselbe Blogpaket live, danach Live-Register-Commit.
Vorzeitiger Abbruch setzt keinen Erfolgs-Commit. Wiederholung desselben Slugs
überschreibt nur dessen statische Dateien; bereits dokumentierte Artikel werden
nicht erneut ausgewählt. Veröffentlichungstage werden nicht rückdatiert.
Google nutzt weiter das separate persistente Write-ahead-Ledger auf `gbp-state`:
unbestätigter POST wird nie blind wiederholt.

## Restrisiken

Externe Hosting-/Google-/GitHub-Ausfälle sind nicht ausschließbar. Cronzeiten können
sich bei GitHub verzögern. Quellenänderungen erfordern weiter inhaltliche Prüfung;
Veröffentlichungsfreigaben werden niemals automatisch neu erteilt.
Erfolg erst nach realen Cloud-Läufen und Live-/Google-Abgleich bestätigen.
