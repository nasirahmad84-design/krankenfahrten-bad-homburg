import test from 'node:test';
import assert from 'node:assert/strict';
import {checkMaintenanceAudit} from '../scripts/check-maintenance-audit.mjs';

function fixture() {
  return {
    report: {auditReportVersion: 2, metadata: {vulnerabilities: {}}, vulnerabilities: {
      braces: {severity: 'high', nodes: ['node_modules/braces'], via: [{url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', severity: 'high'}]},
      micromatch: {severity: 'high', nodes: ['node_modules/micromatch'], via: ['braces']},
    }},
    lock: {packages: {'node_modules/braces': {dev: true, version: '3.0.3'}, 'node_modules/micromatch': {dev: true, version: '4.0.8'}}},
  };
}

test('Audit-Ausnahme gilt nur für die bekannte Entwicklungskette vor Ablauf', () => {
  const {report, lock} = fixture();
  assert.deepEqual(checkMaintenanceAudit(report, lock, '2026-10-20'), ['braces', 'micromatch']);
  assert.throws(() => checkMaintenanceAudit(report, lock, '2026-11-20'), /gesperrt/);
  lock.packages['node_modules/braces'].dev = false;
  assert.throws(() => checkMaintenanceAudit(report, lock, '2026-10-20'), /gesperrt/);
});

test('Neue Advisories, Critical-Funde und ungültige Berichte sperren', () => {
  const {report, lock} = fixture();
  report.vulnerabilities.braces.via.push({url: 'https://github.com/advisories/NEW', severity: 'high'});
  assert.throws(() => checkMaintenanceAudit(report, lock, '2026-10-20'), /gesperrt/);
  report.vulnerabilities.braces.via.pop();
  report.vulnerabilities.braces.severity = 'critical';
  assert.throws(() => checkMaintenanceAudit(report, lock, '2026-10-20'), /gesperrt/);
  assert.throws(() => checkMaintenanceAudit({}, lock), /Ungültiger/);
});
