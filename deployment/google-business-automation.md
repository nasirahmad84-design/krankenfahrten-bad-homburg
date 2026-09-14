# Google-Business-Beiträge statt Facebook

Entscheidung des Betreibers vom 14.09.2026: Google Business ist der Verteilungskanal. Keine Facebook-Veröffentlichung. Bestehende Facebook-Entwürfe sind historisches Archiv, neue Artikel erhalten `google-business-draft.md`.

## Vorbereiteter Stand

Acht eigenständige Kurztexte für die Artikel vom 21.09. bis 15.10.2026. Das Redaktionscockpit zeigt sie zusammen mit dem Artikel. `node scripts/prepare-google-business-post.mjs automation/blog/articles/RUN-ID` erzeugt ein validiertes Vorschauobjekt für Googles API: Deutsch, Beitragstyp STANDARD, eigenständiger Kurztext, LEARN_MORE-Button zur Produktions-URL.

Das Vorschauwerkzeug sendet nichts. Der Freigabestatus wird mitgeführt. Artikel ohne Betreiberfreigabe werden durch den bestehenden Blogpublisher nicht veröffentlicht.

## Vorgesehener automatischer Ablauf

1. Artikel freigegeben und fällig → vorhandener Publisher veröffentlicht das Blog-Delta.
2. Produktion liefert den tatsächlichen Artikel mit HTTP 200, korrektem Canonical und ohne noindex. Erst dann darf der Google-Beitrag folgen.
3. Google-Kurztext aus demselben redaktionell geprüften Lauf verwenden. Kein zusätzlicher API-Schreibauftrag an ein Sprachmodell erforderlich.
4. Mit OAuth an `POST https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/localPosts` senden. Kein Login per Passwort und keine unbeaufsichtigten Browserklicks.
5. Artikel-Slug, Standort-ID, Hash des freigegebenen Texts, Google-Post-ID und Veröffentlichungsstatus persistent speichern. Dieselbe Artikel-/Standort-Kombination nicht erneut anlegen. Bei einem Timeout nach dem Senden zuerst die vorhandenen Posts anhand der eindeutigen Artikel-URL abgleichen; ein automatischer zweiter POST kann Duplikate erzeugen.
6. Googles Status auswerten: LIVE, PROCESSING oder REJECTED. Eine erhaltene ID allein bedeutet nicht, dass der Beitrag sichtbar ist. PROCESSING später erneut abfragen, REJECTED an die freigegebene Alarmadresse melden.
7. Google-Fehler dürfen einen bereits veröffentlichten Websiteartikel nicht zurückrollen. Separater Wiederholungsauftrag nur für den Google-Beitrag, mit Abgleich vorhandener Posts.

## Messung

Linkparameter: `utm_source=google&utm_medium=organic&utm_campaign=gbp_ratgeber&utm_content=ARTIKEL-SLUG`. So bleibt die Kanalzuordnung organisch und die Kampagne kennzeichnet Unternehmensprofil-Beiträge. Canonicals bleiben ohne Parameter. Der aktuelle GA4-Code entfernt Querystrings beim eigenen page_view; vor Aktivierung muss mit einer echten Test-Session geprüft werden, ob die Kampagnenwerte erfasst werden. Ohne diesen Test keine korrekte Attribution behaupten.

## Google-Voraussetzungen und offene Freigaben

- Verifiziertes und seit mindestens 60 Tagen aktives Unternehmensprofil gemäß aktueller API-Zugangsdokumentation; am 14.09.2026 durch den Betreiber bestätigt.
- Eigenständiges Google-Cloud-Projekt `krankenfahrten-gbp` (Projektnummer `1080836537604`) ist aktiv. Es ist kein Rechnungskonto verknüpft (`billingEnabled: false`).
- Antrag auf grundlegenden Business-Profile-API-Zugang am 14.09.2026 eingereicht. Google nennt etwa 7–10 Arbeitstage Bearbeitungszeit. Bis zur Genehmigung bleibt die API-Zulassung offen; Quota 0 ist keine Freischaltung.
- Einmalige OAuth-Zustimmung eines Profilinhabers/-managers, `business.manage`, refreshfähige serverseitige Zugangsdaten. OAuth-Veröffentlichungsstatus und Tokenlaufzeit müssen für unbeaufsichtigten Betrieb passend eingerichtet sein.
- Exakte Account- und Location-ID aus der API. Die sichtbare Maps-CID oder der Rezensionenlink darf nicht als API-Location-ID angenommen werden.
- Ein echter Testbeitrag und Sichtprüfung nach API-Freischaltung. Noch kein Google-Beitrag automatisch angelegt.

Zunächst reine Textbeiträge mit Button. Keine fremden Klinikbilder, erfundenen Kundenfotos, Telefonnummern im Text oder nicht freigegebenen Werbeclaims. Ein thematisch passendes eigenes Bild kann später ergänzt werden.

## Fachliche Einordnung

Organisatorische Hinweise, keine medizinische Beratung, keine Erstattungs- oder Verfügbarkeitsgarantie. Ein externer Aktionstag ist kein eigenes Unternehmens-EVENT. Deshalb STANDARD statt einer erfundenen Veranstaltung.

## Primärquellen, geprüft 14.09.2026

- https://developers.google.com/my-business/content/prereqs
- https://developers.google.com/my-business/content/posts-data
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/create
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts
- https://support.google.com/business/answer/7213077
