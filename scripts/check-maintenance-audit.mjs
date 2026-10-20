import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const advisory = 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm';
const exceptionEnds = '2026-11-20';
const developmentChain = new Set(['braces', 'micromatch', 'fast-glob', '@next/eslint-plugin-next', 'eslint-config-next']);

export function checkMaintenanceAudit(report, lock, today = new Date().toISOString().slice(0, 10)) {
  if (report.auditReportVersion !== 2 || !report.vulnerabilities || report.error || !report.metadata?.vulnerabilities || !lock.packages) {
    throw new Error('Ungültiger Sicherheitsbericht oder fehlende Paketdaten.');
  }
  const accepted = [];
  const blocked = [];
  function isDevelopmentException(name, seen = new Set()) {
    const item = report.vulnerabilities[name];
    if (!item || !developmentChain.has(name) || seen.has(name) || today >= exceptionEnds || item.severity !== 'high') return false;
    if (!item.nodes?.length || !item.nodes.every(path => lock.packages[path]?.dev === true)) return false;
    if (!item.via?.length) return false;
    const visited = new Set([...seen, name]);
    return item.via.every(cause => typeof cause === 'string'
      ? isDevelopmentException(cause, visited)
      : name === 'braces' && cause.url === advisory && cause.severity === 'high'
        && item.nodes.every(path => /^3\.0\.[0-3]$/.test(lock.packages[path].version)));
  }
  for (const [name, item] of Object.entries(report.vulnerabilities)) {
    if (!['info', 'low', 'moderate', 'high', 'critical'].includes(item.severity)) throw new Error(`Unbekannter Schweregrad: ${name}`);
    if (!['high', 'critical'].includes(item.severity)) continue;
    (isDevelopmentException(name) ? accepted : blocked).push(name);
  }
  if (blocked.length) throw new Error(`Sicherheitsprüfung gesperrt: ${blocked.join(', ')}. Ausnahme läuft am ${exceptionEnds} ab.`);
  return accepted;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = spawnSync('npm', ['audit', '--json'], {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024});
  if (result.error) throw result.error;
  if (![0, 1].includes(result.status)) throw new Error('Sicherheitsprüfung konnte nicht ausgeführt werden.');
  const report = JSON.parse(result.stdout);
  if (process.env.AUDIT_REPORT_PATH) writeFileSync(process.env.AUDIT_REPORT_PATH, JSON.stringify(report, null, 2));
  const accepted = checkMaintenanceAudit(report, JSON.parse(readFileSync('package-lock.json', 'utf8')));
  if (accepted.length) console.warn(`::warning::Befristete Ausnahme bis ${exceptionEnds}: ${advisory}; ausschließlich Entwicklungswerkzeuge: ${accepted.join(', ')}.`);
  console.log('Sicherheitsprüfung abgeschlossen; keine weiteren high/critical-Funde.');
}
