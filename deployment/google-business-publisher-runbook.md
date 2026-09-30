# Google Business: ausführbarer, standardmäßig deaktivierter Publisher

Stand 30.09.2026. Der erste ausdrücklich freigegebene Herbstferien-Beitrag wurde gesendet und von Google als `LIVE` bestätigt (Post-ID `2837264369540629405`). Das Cloud-Projekt `krankenfahrten-gbp` ist für die Business Profile API freigegeben. Ziel ist ausschließlich `accounts/111505448904866961656/locations/14639701242816410626` („Krankenfahrten Bad Homburg“). Andere Standorte und die Gruppe „Gelem Hilft“ sind ausgeschlossen. Dieser Publisher aktiviert keinen automatischen Veröffentlichungszeitplan.

## Sichere Vorschau

```sh
node scripts/lib/google-business-publisher.mjs automation/blog/articles/RUN-ID
```

Ohne `--publish` **und** `GBP_PUBLISH_ENABLED=true` erfolgt ausschließlich eine lokale Vorschau. Sie zeigt den SHA-256-Hash des Google-Payloads. Kein OAuth-Aufruf, keine Google-Anfrage, kein POST.

## Einmalig benötigte Einrichtung

- Google-Cloud-Projekt: Business-Profile-API-Zugang freigegeben und Konto/Standort durch API identifiziert.
- Profilinhaber/-manager gewährt OAuth-Scope `https://www.googleapis.com/auth/business.manage` mit langlebig nutzbarem Refresh-Token. Kein Profilpasswort und kein Browsercookie.
- Secrets ausschließlich in geschützter Laufzeitkonfiguration: `GBP_CLIENT_ID`, `GBP_CLIENT_SECRET`, `GBP_REFRESH_TOKEN`.
- `GBP_LOCATION_NAME=accounts/ACCOUNT_ID/locations/LOCATION_ID`, keine Maps-CID.
- `GBP_STATE_DIRECTORY`: dauerhaftes, nur für den Publisher zugängliches Verzeichnis außerhalb des öffentlich ausgelieferten Webroots. Darf nicht je CI-Lauf neu erzeugt/verworfen werden. JSON enthält lediglich Artikel-/Post-IDs, Payloadhash und Status, keine Tokens.
- Zwei getrennte Betreiberfreigaben: Artikel im Laufstatus und Google-Kurztext in `automation/blog/google-business-approvals.json` mit Datum und SHA-256 des exakten Payloads. Zusätzlich denselben Hash als `GBP_APPROVED_PAYLOAD_SHA256` in der geschützten Laufzeit setzen. Änderungen benötigen eine neue ausdrückliche Freigabe.

Die Zugangsdaten nicht als Befehlszeilenargumente und nicht in Git speichern. Der Ablauf steht absichtlich **noch nicht** in GitHub Actions: vor Cloud-Automatik müssen ein dauerhafter, laufübergreifend konsistenter Ledger, eine gemeinsame Schreibsperre und separate Fehleralarmierung angeschlossen werden. Ein flüchtiger Runner-Ordner allein erfüllt das nicht. Die vorhandene Blog-Veröffentlichung bleibt unabhängig aktiv.

## Bewusst freigegebener Testbeitrag

```sh
node scripts/lib/google-business-publisher.mjs automation/blog/articles/RUN-ID --publish
```

Erforderlich sind beide Opt-ins, aktueller Freigabestatus, nicht abgelaufene Aktualitätsprüfung, identischer Eintrag in `automation/blog/published/`, HTTP 200 auf Produktion, indexierbare Seite mit korrektem Canonical und Article/BlogPosting-JSON-LD mit passendem Titel. Vorschau allein gibt niemals einen Artikel frei.

Der Publisher erneuert OAuth im Speicher. Anschließend werden **alle** vorhandenen Google-Beitragsseiten gelesen und per Artikel-Zielpfad abgeglichen. Gibt es einen passenden Beitrag, wird kein neuer erzeugt. Abweichender Text oder mehrere Treffer führen zum Abbruch. Vor dem einzigen POST wird `sending_unknown` dauerhaft geschrieben. Ein Timeout oder fehlender Status verbleibt so im Ledger; ein Folgelauf darf nur remote abgleichen, niemals blind noch einmal senden. Auch gelöschte Beiträge werden nicht automatisch neu erstellt.

`LIVE` ist sichtbar, `PROCESSING` noch nicht bestätigt. Erneutes Aufrufen gleicht den Status ab. `REJECTED` liefert Exit-Code 1 und braucht redaktionelle Prüfung. Ein Fehler darf den Websiteartikel nicht zurückrollen. Bei abgebrochenem Prozess kann eine `.lock` bestehen bleiben; erst nach Prüfung, dass kein Publisher läuft, entfernen. Ledger nicht löschen, um einen erneuten POST zu erzwingen.

## Noch offen vor unbeaufsichtigtem Betrieb

1. OAuth-Zugangsdaten bleiben in einer ignorierten lokalen Laufzeitdatei, niemals im Chat oder Repository. Ein zuvor im Chat geteilter Access-Token darf nicht weiterverwendet werden.
2. Der erste ausdrücklich freigegebene Post ist `LIVE`; alle weiteren Google-Texte stehen unabhängig von ihrer Artikelfreigabe auf „Freigabe ausstehend“.
3. Für unbeaufsichtigten Cloud-Betrieb fehlen ein dauerhafter, laufübergreifend konsistenter Ledger und eine gemeinsame Sperre sowie GBP-spezifische Fehleralarmierung. Geplante Blogläufe dürfen dabei nicht mitgestoppt werden.
4. Anschluss als unabhängiger Nachlauf für tatsächlich live verifizierte Artikel, inklusive PROCESSING-Abgleich und kontrollierter Erneuerung von OAuth bei Widerruf.
5. UTM-Messung in echter zustimmender GA4-Session prüfen, bevor Attribution behauptet wird.

## Primärquellen

API geprüft 14.09.2026:
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/create
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts

Tests simulieren OAuth und Google; sie senden keinen echten Beitrag.
