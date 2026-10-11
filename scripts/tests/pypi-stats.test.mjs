import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import { fetchPackage, targetDate } from '../sync-pypi-stats.mjs';

const source = await readFile(new URL('../../apps/web/src/lib/pypiStats.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } });
const { yesterday, segmentRange, dailyMap } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const pkg = {
  name: 'sample', history: [{ date: '2026-10-08', downloads: 7 }],
  clickpy: { through: '2026-10-10', partial: '2026-10-10', total: { dates: ['2026-10-09', '2026-10-10', '2026-10-11'], series: { all: [10, 12, 3], nomirror: [8, 9, 2] } } },
};

test('yesterday is dynamic and uses UTC across month, year and leap-day boundaries', () => {
  for (const [now, expected] of [
    ['2026-10-11T00:00:00Z', '2026-10-10'],
    ['2026-10-11T23:59:59Z', '2026-10-10'],
    ['2026-10-12T00:00:00Z', '2026-10-11'],
    ['2027-01-01T00:00:00Z', '2026-12-31'],
    ['2024-03-01T00:00:00Z', '2024-02-29'],
    ['2026-10-10T22:00:00-03:00', '2026-10-10'],
  ]) {
    assert.equal(yesterday(new Date(now)), expected);
    assert.equal(targetDate(new Date(now)), expected);
  }
});

test('yesterday stays visible when provisional; today is excluded', () => {
  assert.deepEqual(segmentRange([pkg], { kind: 'raw' }, '2026-10-10'), { first: '2026-10-09', latest: '2026-10-10', partial: '2026-10-10' });
  assert.equal(dailyMap(pkg, { kind: 'raw', hide: true }).get('2026-10-10'), 9);
});

test('lagging pypistats keeps its own range without fabricated days', () => {
  assert.deepEqual(segmentRange([pkg], { kind: 'all' }, '2026-10-10'), { first: '2026-10-08', latest: '2026-10-08', partial: null });
  assert.equal(dailyMap(pkg, { kind: 'all' }).has('2026-10-10'), false);
});

test('a pypistats failure does not prevent ClickPy from refreshing yesterday', async (t) => {
  const cutoff = targetDate();
  const queries = [];
  t.mock.method(globalThis, 'fetch', async (url, options = {}) => {
    if (String(url).startsWith('https://pypi.org/')) return { ok: true, json: async () => ({ info: { version: '1.0' } }) };
    if (String(url).startsWith('https://pypistats.org/')) return { ok: false, status: 503 };
    queries.push(options.body);
    return { ok: true, json: async () => ({ data: options.body.includes('sum(count) AS n')
      ? [{ date: cutoff, n: 100 }]
      : [{ date: cutoff, k: 'test', all_: 12, nomirror: 9 }] }) };
  });
  const refreshed = await fetchPackage({ name: 'sample' }, pkg, async () => {});
  assert.deepEqual(refreshed.history, pkg.history);
  assert.equal(refreshed.stale, true);
  assert.equal(refreshed.clickpyStale, false);
  assert.equal(refreshed.clickpy.through, cutoff);
  assert.equal(refreshed.clickpy.total.series.nomirror[0], 9);
  assert.ok(queries.every((sql) => sql.includes(`toDate('${cutoff}')`) && !sql.includes('today()')));
});

test('unavailable ClickPy retains its previous snapshot and marks it stale', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (String(url).startsWith('https://sql-clickhouse.')) return { ok: false, status: 403 };
    return { ok: true, json: async () => String(url).startsWith('https://pypi.org/') ? { info: { version: '1.0' } } : { data: [] } };
  });
  const refreshed = await fetchPackage({ name: 'sample' }, pkg, async () => {});
  assert.deepEqual(refreshed.clickpy, pkg.clickpy);
  assert.equal(refreshed.clickpyStale, true);
});

test('a successful response with older dates cannot replace newer published data', async (t) => {
  const older = yesterday(new Date(`${targetDate()}T00:00:00Z`));
  const previous = { ...pkg, clickpy: { ...pkg.clickpy, through: targetDate() } };
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (String(url).startsWith('https://sql-clickhouse.')) return { ok: true, json: async () => ({ data: [{ date: older, k: 'test', all_: 5, nomirror: 4 }] }) };
    return { ok: true, json: async () => String(url).startsWith('https://pypi.org/') ? { info: { version: '1.0' } } : { data: [] } };
  });
  const refreshed = await fetchPackage({ name: 'sample' }, previous, async () => {});
  assert.deepEqual(refreshed.clickpy, previous.clickpy);
  assert.equal(refreshed.clickpyStale, true);
});
