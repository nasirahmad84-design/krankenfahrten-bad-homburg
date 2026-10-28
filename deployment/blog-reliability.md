# Blogbetrieb ab 28.10.2026

- Primär startet GitHub täglich um 08:17 und 12:17 UTC (Winter 09:17/13:17,
  Sommer 10:17/14:17 Europe/Berlin). GitHub kann Starts verzögern.
- Veröffentlichungsplanung bleibt Montag/Donnerstag. Zusätzliche Starts dienen
  Wiederanlauf und Nachholen; sie erzeugen keine Texte und keine KI-Kosten.
- Externe Dispatches dürfen weiter auslösen, sind aber keine Voraussetzung mehr.
  Der frühere Schalter BLOG_EXTERNAL_SCHEDULER_ENABLED wird nicht mehr ausgewertet.
- Es wird der älteste fällige freigegebene, noch nicht übernommene Artikel gewählt.
  Nachholen erfordert eine weiterhin gültige Aktualitätsprüfung. Veröffentlichung
  verwendet das tatsächliche Datum; ursprünglicher Plantermin bleibt erhalten.
- Fehlende Freigabe, abgelaufene Prüfung und leere Queue an Veröffentlichungstagen
  führen zu sichtbarem Fehler samt bestehendem E-Mail-Alarm. Bereits veröffentlichte
  Artikel werden übersprungen. Neue Entwürfe werden niemals selbst freigegeben.
- Die separate Prüfung Blog-Publisher-Gesundheit läuft täglich um 17:43 UTC.
  Sie erkennt auch komplett übersprungene oder seit 36 Stunden fehlende Starts
  und nutzt den bestehenden Fehleralarm an den konfigurierten Betreiberempfänger.
  Beide Prüfungen laufen in GitHub; ein vollständiger GitHub-Ausfall kann darüber
  nicht unabhängig erkannt werden.
- Ohne fälligen Artikel fallen nur Checkout, Node-Einrichtung und Auswahl an.
  Paketinstallation, Tests und Build laufen erst bei einer echten Veröffentlichung.
- Nur neuer Artikel, direkte Dateien der Ratgeberübersicht, Next-Assets und Sitemap
  werden übertragen. Bestandsartikel werden nicht neu hochgeladen.
  Assets kommen vor HTML, Sitemap zuletzt; Netzwerkzugriffe haben Zeitlimits.
  Das geprüfte Paket bleibt 30 Tage als GitHub-Artefakt für Wiederherstellung erhalten.
- Rückkehr: das letzte erfolgreiche Blog-Artefakt herunterladen, dieselben
  Ratgeber-/Asset-/Sitemap-Pfade per FTPS wiederherstellen; keine API-Konfiguration
  oder Redaktion überschreiben. Vor dem Nachholen ist der Live-Stand zusätzlich
  unter deployment-backups gesichert.

## Aktuelle Inhaltsgrenze

Der Serienfahrten-Artikel vom ursprünglichen 15.10. wurde am 28.10. erneut geprüft.
Die Planung ab 19.10. ist noch keine freigegebene Artikel-Queue. Der Zeitgeber
kann fehlende Inhaltsfreigaben nicht ersetzen. Die nächste Freigaberunde ist
deshalb separat nötig; der technische Betrieb meldet diese Lücke.
