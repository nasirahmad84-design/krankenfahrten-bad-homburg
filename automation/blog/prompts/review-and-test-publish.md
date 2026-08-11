# Auftrag: Unabhängiger Review und Test-Veröffentlichung

Du arbeitest als zweite, kritisch prüfende Redaktion. Du darfst nur einen vollständig belegten Lauf auf die noindex-geschützte Testdomain übernehmen. Live-Domain und Facebook bleiben gesperrt.

## Verbindlicher Ablauf

1. Prüfe den Git-Arbeitsbaum. Bei fremden, unklaren oder nicht zum Lauf gehörenden Änderungen: nichts verändern und den Review abbrechen.
2. Lies vollständig:
   - `automation/blog/editorial-policy.md`
   - `automation/blog/environment-gate-matrix.csv`
   - `automation/blog/prompts/research-and-draft.md`
   - die fünf Artefakte des zu prüfenden Laufordners
   - die bestätigten lokalen Leistungs-, FAQ-, Orts- und Unternehmensdaten
3. Öffne jede externe Quelle erneut. Prüfe Herausgeber, Aussage, Aktualität, Fundstelle und Übereinstimmung mit dem Claim-Register. Suche bei einer Regeländerung nach einer zweiten unabhängigen Bestätigung.
4. Vergleiche jeden Leistungsclaim mit den freigegebenen lokalen Inhalten. Entferne oder blockiere jede nicht bestätigte Leistung, Kosten-, Zeit- oder Verfügbarkeitszusage.
5. Prüfe Suchintention, Eigenständigkeit, klare Überschriften, Meta-Längen, Quellenzuordnung, interne Links, sensible Einordnung und Social-Entwurf.
6. Bei einem ungeklärten oder widersprüchlichen Kernclaim:
   - setze den Claim auf `blocked`,
   - setze `run-status.json` auf `blocked`,
   - dokumentiere die Ursache,
   - ändere keine öffentlichen Blogdaten, committe und deploye nicht.
7. Nur wenn alle Gates bestanden sind:
   - aktualisiere Prüf- und Veröffentlichungsdaten,
   - setze `sourceGate`, `claimGate`, `serviceGate`, `legalSensitivityGate` und `seoGate` auf `passed`,
   - setze den Status auf `approved_for_test`,
   - belasse `livePublishing` und `facebookPublishing` auf `false`.
8. Führe die Freigabeprüfung aus:
   - `npm run blog:validate -- automation/blog/articles/RUN-ID`
   - `npm run blog:promote -- automation/blog/articles/RUN-ID -- --dry-run`
9. Bestehen beide Prüfungen, übernimm den Beitrag deterministisch:
   - `npm run blog:promote -- automation/blog/articles/RUN-ID`
   - `npm run blog:generate`
10. Ergänze genau eine Laufzeile im `automation/blog/content-approval-register.csv`. Der Test-Deploymentstatus bleibt zunächst `pending`.
11. Führe vollständig aus:
   - `npm test`
   - `npm run lint`
   - `npm run build`
   - `npm run test:export`
   - `npm run verify:deployment`
   - `git diff --check`
12. Prüfe Diff, Sitemap, Canonical, genau eine H1, BlogPosting-Daten, Quellenlinks, keine Secrets und keine Änderungen außerhalb des freigegebenen Laufs.
13. Committe erst nach allen bestandenen Gates mit `feat: publish guide <slug>`.
14. Veröffentliche ausschließlich mit `npm run deploy:test`. Prüfe danach Test-URL, `X-Robots-Tag`, 200/404-Status, Assets, Console und mobile Darstellung.
15. Aktualisiere nach dem praktischen Test `test_deploy_status` im Freigaberegister. Ein fehlgeschlagenes Deployment darf nicht als erfolgreich gemeldet werden.

## Harte Grenzen

- kein `deploy:live`
- keine Indexierung der Testdomain
- kein Facebook-Post und kein Meta-API-Aufruf
- keine Secrets in Dateien, Ausgaben oder Commits
- keine Veröffentlichung bei `blocked`, `inference` in sensiblen Claims oder fehlender Primärquelle
- kein Ersetzen eines abgelehnten Themas durch ungeprüften Fülltext

## Abschluss

Berichte: Run-ID, Reviewentscheidung, korrigierte Claims, Gate-Ergebnisse, Tests, Commit, Test-Deployment, Test-URL und offene Punkte. Behaupte keine Live- oder Facebook-Veröffentlichung.
