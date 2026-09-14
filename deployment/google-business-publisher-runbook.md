# Google Business: ausführbarer, standardmäßig deaktivierter Publisher

Stand 14.09.2026. Kein Beitrag gesendet, keine Google-Zugangsdaten angelegt. Dieser Baustein ergänzt die vorhandene Konzeption; er aktiviert keinen Zeitplan und verändert keine Blog-Veröffentlichung.

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
- Betreiberfreigabe des Artikels und des zusammen gelesenen Google-Kurztexts. Den aus der freigegebenen Vorschau stammenden Hash als `GBP_APPROVED_PAYLOAD_SHA256` setzen. Änderungen benötigen einen neuen ausdrücklich geprüften Hash.

Die Zugangsdaten nicht als Befehlszeilenargumente und nicht in Git speichern. Der Ablauf steht absichtlich **noch nicht** in GitHub Actions: vor Cloud-Automatik müssen ein dauerhafter, laufübergreifend konsistenter Ledger, eine gemeinsame Schreibsperre und separate Fehleralarmierung angeschlossen werden. Ein flüchtiger Runner-Ordner allein erfüllt das nicht. Die vorhandene Blog-Veröffentlichung bleibt unabhängig aktiv.

## Bewusst freigegebener Testbeitrag

```sh
node scripts/lib/google-business-publisher.mjs automation/blog/articles/RUN-ID --publish
```

Erforderlich sind beide Opt-ins, aktueller Freigabestatus, nicht abgelaufene Aktualitätsprüfung, identischer Eintrag in `automation/blog/published/`, HTTP 200 auf Produktion, indexierbare Seite mit korrektem Canonical und Article/BlogPosting-JSON-LD mit passendem Titel. Vorschau allein gibt niemals einen Artikel frei.

Der Publisher erneuert OAuth im Speicher. Anschließend werden **alle** vorhandenen Google-Beitragsseiten gelesen und per Artikel-Zielpfad abgeglichen. Gibt es einen passenden Beitrag, wird kein neuer erzeugt. Abweichender Text oder mehrere Treffer führen zum Abbruch. Vor dem einzigen POST wird `sending_unknown` dauerhaft geschrieben. Ein Timeout oder fehlender Status verbleibt so im Ledger; ein Folgelauf darf nur remote abgleichen, niemals blind noch einmal senden. Auch gelöschte Beiträge werden nicht automatisch neu erstellt.

`LIVE` ist sichtbar, `PROCESSING` noch nicht bestätigt. Erneutes Aufrufen gleicht den Status ab. `REJECTED` liefert Exit-Code 1 und braucht redaktionelle Prüfung. Ein Fehler darf den Websiteartikel nicht zurückrollen. Bei abgebrochenem Prozess kann eine `.lock` bestehen bleiben; erst nach Prüfung, dass kein Publisher läuft, entfernen. Ledger nicht löschen, um einen erneuten POST zu erzwingen.

## Noch offen vor unbeaufsichtigtem Betrieb

1. Google-API-Zulassung, OAuth-Einwilligung und Account-/Location-ID.
2. Ein echter ausdrücklich freigegebener Testpost und Sichtprüfung.
3. Persistenz/Lock über Runner hinweg sowie GBP-spezifische Fehleralarmierung an die bereits freigegebene Alarmadresse. Geplante Blogläufe dürfen dabei nicht mitgestoppt werden.
4. Anschluss als unabhängiger Nachlauf für tatsächlich live verifizierte Artikel, inklusive PROCESSING-Abgleich und kontrollierter Erneuerung von OAuth bei Widerruf.
5. UTM-Messung in echter zustimmender GA4-Session prüfen, bevor Attribution behauptet wird.

## Primärquellen

API geprüft 14.09.2026:
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/create
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts

Tests simulieren OAuth und Google; sie senden keinen echten Beitrag.
