# Auftrag: unabhängiger Review und Veröffentlichung des Blog-Deltas

Du arbeitest als zweite, kritisch prüfende Redaktion. Du darfst nur einen vollständig belegten Bloglauf veröffentlichen. Bestehende Websitebereiche außerhalb des Ratgebers werden nicht deployt.

## Review

1. Lies die redaktionelle Richtlinie, den Laufordner und die bestätigten Leistungsdaten vollständig.
2. Öffne jede externe Quelle erneut und prüfe Herausgeber, Aussage, Aktualität, Fundstelle und Claim-Zuordnung.
3. Blockiere jede unbestätigte Leistung sowie jede Kosten-, Zeit-, Erstattungs- oder Verfügbarkeitszusage.
4. Prüfe Suchintention, Eigenständigkeit, Überschriften, Meta-Längen, Quellen, interne Links und Einzelfallhinweise.
5. Bei einem ungeklärten Kernclaim: Claim und Lauf auf `blocked` setzen; nichts übernehmen oder deployen.
6. Sind alle Gates bestanden, setze:
   - `sourceGate`, `claimGate`, `serviceGate`, `legalSensitivityGate`, `seoGate`: `passed`
   - `status`: `approved_for_publish`
   - `livePublishing` und `facebookPublishing`: weiterhin `false`; der kontrollierte Publisher übernimmt diese Schritte.

## Vorbereitung und Veröffentlichung

1. Führe `npm run blog:prepare-release -- automation/blog/articles/RUN-ID` aus. Dieser Befehl verwendet intern `npm run test:blog`; er startet nicht die globale Testsuite.
2. Prüfe den Diff. Er darf nur den geprüften Lauf, freigegebene Blogdaten, generierte Blogdaten und Sitemap betreffen.
3. Committe die Inhaltsänderung mit `feat: publish guide <slug>`.
4. Veröffentliche nur das Blog-Delta auf der Testdomain: `npm run deploy:blog:test -- <slug>`.
5. Wenn der integrierte Smoke-Test erfolgreich ist, veröffentliche dasselbe Delta ohne zusätzliche Warteperiode live: `BLOG_DEPLOY_LIVE_CONFIRM=JA npm run deploy:blog:live -- <slug>`.
6. Prüfe die Live-URL auf HTTP 200 und korrekten Canonical.
7. Facebook darf erst danach angestoßen werden, sofern ein geprüfter Plattformzugang vorhanden ist.

## Nicht ausführen

- kein `npm test`
- kein `npm run test:export`
- kein `npm run verify:deployment`
- kein `npm run deploy:test` oder `npm run deploy:live`
- keine Übertragung von PHP, Formular, Rechtsseiten, Bestandsseiten oder Root-`.htaccess`
- keine vier Testläufe oder zeitverzögerte Freigabestufe
- kein Facebook-Post vor erfolgreicher Live-URL

## Abschluss

Berichte knapp: Thema, Reviewentscheidung, blockierte oder korrigierte Claims, Ergebnis der gezielten Blogtests, Test-URL, Live-URL und gegebenenfalls Facebook-Status.
