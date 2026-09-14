# Next.js-Wartung, Sprachspur und Fahrdienst-Check

## Automatische Wartung

`.github/workflows/next-maintenance.yml` läuft dienstags um 05:23 UTC und lässt
sich unter GitHub Actions → Next.js Wartung auch manuell starten. Der Lauf
installiert die neueste stabile Version innerhalb der vorhandenen Next.js-
Hauptversion und die exakt passende ESLint-Konfiguration. Kompatible transitive
Security-Fixes werden ebenfalls übernommen; kein `--force`, keine Canary-Version.

Vor dem Commit laufen Anwendungstests, Lint, TypeScript, statischer Build,
Export-/Deployment-Prüfung, PHP-Tests und npm audit (high/critical als Sperre).
Nur erfolgreiche Läufe schreiben die geprüften Abhängigkeiten auf `main`.
Schlägt ein Test oder ein konkurrierender Push fehl, bleibt der Remote-Stand
unverändert; der GitHub-Lauf zeigt den Fehler. GitHub-Benachrichtigungen hängen
von den persönlichen Notification-Einstellungen ab. Der Automatismus benötigt
keinen geöffneten Rechner. Hauptversionswechsel bleiben eine separate Migration.

Der Live-Server wird weiterhin über den vorhandenen Live-Release aktualisiert.
Ein erfolgreicher Wartungs-Commit bedeutet noch keinen FTP-Upload. GitHub kann
Zeitpläne verzögert ausführen und bei inaktiven öffentlichen Repositories pausieren.

## Kostenfreie lokale Sprachspur

Auf diesem Mac: Python 3.12, Piper 1.8.0, deutsche Stimme Thorsten high.
Die Stimme wird einmalig heruntergeladen; die Synthese läuft danach lokal.
Es gibt keine kostenpflichtigen API-Aufrufe. Quellen zur Stimme:

- https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/high/MODEL_CARD
- https://github.com/thorstenMueller/Thorsten-Voice

Der Sprachdatensatz ist CC0. Piper ist ein getrennt lokal verwendetes Werkzeug
und wird nicht als Website-Code ausgeliefert. Die Remotion-Lizenzprüfung aus dem
Pilot bleibt für eine spätere kommerzielle Serienproduktion relevant.

```bash
uv venv --python 3.12 .venv-video
uv pip install --python .venv-video/bin/python piper-tts==1.8.0
npm run video:pilot
.venv-video/bin/python scripts/render-video-audio.py
```

Ausgabe: `artifacts/remotion/krankenfahrt-mit-sprachspur.mp4` und
`narration-30s.wav`. Fünf Textabschnitte aus `remotion/narration.json` werden
szenengenau platziert. Eine notwendige Beschleunigung über 1,3 bricht ab, damit
statt hektischer Sprache der Text gekürzt wird. Lautheitsziel: −16 LUFS,
True Peak −1,5 dB. Das Skript nutzt den vorhandenen Remotion-FFmpeg für macOS ARM.
Ein kurzer temporärer Datenpfad umgeht das native espeak-Pfadlimit; Systemordner
werden dafür nicht verändert. Das Modell und die erzeugten Audios bleiben lokal.

## Fahrdienst-Check

Neue Route: `/fahrdienst-check/`, verlinkt auf der Startseite und in der Sitemap.
Vier kurze Fragen prüfen die bestätigten betrieblichen Leistungsgrenzen:
Notfall, Sitzen auf einem Fahrzeugsitz, besondere Transport-/Betreuungsanforderung,
Ein- und Aussteigen. Dies ist keine medizinische Triage oder Kostenzusage.

Antworten bleiben ausschließlich im React-Arbeitsspeicher. Keine API, kein
Browser-Storage, keine Antwortwerte in Analytics oder Kontaktformularen. Ergebnisse
sind Notrufhinweis, Leistungsgrenze, persönliche Klärung oder unverbindliche Anfrage.
Zurück/Neustart, Tastaturbedienung, Überschriftenfokus und ein No-JavaScript-Hinweis
sind vorhanden. Patienten, Angehörige und Einrichtungen können denselben kurzen
Check nutzen. Notrufgrundlage: Bundesgesundheitsministerium,
https://www.bundesgesundheitsministerium.de/service/gesetze-und-verordnungen/guv-21-lp/notfallreform/faq-notfallreform

Die Funktion arbeitet ohne Three.js; für diese reine Entscheidungsfolge wird kein
3D-Renderer benötigt. Die Website bleibt statisch exportierbar.
