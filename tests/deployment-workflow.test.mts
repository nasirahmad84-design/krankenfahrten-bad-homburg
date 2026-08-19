import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const deployScript = readFileSync(
  join(process.cwd(), "scripts/deploy-ftp.sh"),
  "utf8",
);
const manualLiveWorkflow = readFileSync(
  join(process.cwd(), ".github/workflows/deploy-live-manual.yml"),
  "utf8",
);

test("bricht das FTP-Deployment ohne serverseitige Formular-Konfiguration ab", () => {
  assert.match(deployScript, /--list-only/);
  assert.match(deployScript, /grep -Fxq 'config\.php'/);
  assert.match(deployScript, /fehlt api\/config\.php/);
  assert.match(deployScript, /out\/api\/config\.php darf niemals hochgeladen werden/);
});

test("prüft Konfigurationsschutz und Domainbindung ohne E-Mail-Versand", () => {
  assert.match(deployScript, /"api\/config\.php" "api\/config\.example\.php"/);
  assert.match(deployScript, /liefert HTTP \$protected_status statt 403/);
  assert.match(deployScript, /Origin: \$\{site_url\}/);
  assert.match(deployScript, /formStartedAt: 0/);
  assert.match(deployScript, /liefert HTTP \$form_preflight_status statt 400/);
  assert.match(deployScript, /Automatischer Konfigurationscheck ohne E-Mail-Versand/);
});

test("stellt den vollständigen Live-Release nur manuell und mit Produktionsgate bereit", () => {
  assert.match(manualLiveWorkflow, /workflow_dispatch:/);
  assert.doesNotMatch(manualLiveWorkflow, /schedule:/);
  assert.match(manualLiveWorkflow, /FTP_PASSWORD: \$\{\{ secrets\.FTP_PASSWORD \}\}/);
  assert.match(manualLiveWorkflow, /DEPLOY_LIVE_CONFIRM: JA/);
  assert.match(manualLiveWorkflow, /npm run deploy:live/);
  assert.match(manualLiveWorkflow, /trap 'rm -f \.env\.deploy\.local' EXIT/);
});
