import assert from 'node:assert/strict';
import test from 'node:test';
import {assessServiceFit} from '../src/lib/service-fit.ts';

test('Notfall und Leistungsgrenzen beenden den Check frühzeitig', () => {
  assert.equal(assessServiceFit(['yes']), 'emergency');
  assert.equal(assessServiceFit(['no', 'no']), 'outside');
  assert.equal(assessServiceFit(['no', 'yes', 'yes']), 'outside');
});
test('Unsicherheit und fehlende Einstiegsmöglichkeit verlangen Klärung', () => {
  assert.equal(assessServiceFit(['unsure']), 'clarify');
  assert.equal(assessServiceFit(['no', 'unsure']), 'clarify');
  assert.equal(assessServiceFit(['no', 'yes', 'no', 'no']), 'clarify');
});
test('Nur vollständig passender Bedarf erlaubt die unverbindliche Anfrage', () => {
  assert.equal(assessServiceFit([]), null);
  assert.equal(assessServiceFit(['no', 'yes', 'no']), null);
  assert.equal(assessServiceFit(['no', 'yes', 'no', 'yes']), 'possible');
});
