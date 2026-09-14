import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const current = pkg.dependencies.next;
const major = current.split('.')[0];
const versions = JSON.parse(execFileSync('npm', ['view', `next@${major}`, 'version', '--json'], {encoding: 'utf8'}));
const target = (Array.isArray(versions) ? versions : [versions])
  .filter(version => /^\d+\.\d+\.\d+$/.test(version))
  .sort((a, b) => a.localeCompare(b, undefined, {numeric: true})).at(-1);
if (!target) throw new Error('Keine stabile Version gefunden.');
execFileSync('npm', ['install', '--save-exact', `next@${target}`, `eslint-config-next@${target}`], {stdio: 'inherit'});
// Compatible transitive security fixes only; never use --force.
execFileSync('npm', ['audit', 'fix'], {stdio: 'inherit'});
const inventoryPath = 'automation/blog/source-inventory.csv';
const hash = createHash('sha256').update(readFileSync('package.json')).digest('hex');
const date = new Date().toISOString().slice(0, 10);
const inventory = readFileSync(inventoryPath, 'utf8');
const rows = inventory.split('\n').map(line => {
  if (!line.startsWith('LOCAL-001,')) return line;
  const fields = line.split(',');
  if (fields[4] === hash) return line;
  fields[4] = hash;
  fields[7] = date;
  return fields.join(',');
});
writeFileSync(inventoryPath, rows.join('\n'));
console.log(`Next.js: ${current} → ${target}. Jetzt Stabilitätsprüfungen ausführen.`);
