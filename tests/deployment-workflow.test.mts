import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const deployScript = readFileSync(
  join(process.cwd(), "scripts/deploy-ftp.sh"),
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
