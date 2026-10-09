/**
 * Refreshes apps/web/public/data/pypi-stats.json: download counts and basic facts for the PyPI packages listed in
 * apps/web/content/pypi-packages.json. It runs before every build (see the `prebuild` script) and in the daily scheduled deploy.
 *
 * Sources (all public, no keys): pypistats.org (daily downloads without mirrors, last ~180 days), pypi.org (version, summary, release date)
 * and the GitHub API (stars, forks, open issues; GITHUB_TOKEN raises the rate limit when it is set).
 *
 * It must never break a build: a package that cannot be fetched keeps its previous values (marked stale) and the script always exits 0.
 * One request at a time, with a pause, as the services ask.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const CONFIG_PATH = path.join(ROOT, 'apps/web/content/pypi-packages.json');
const OUTPUT_PATH = path.join(ROOT, 'apps/web/public/data/pypi-stats.json');

const ALLOWED = ['https://pypistats.org/api/packages/', 'https://pypi.org/pypi/', 'https://api.github.com/repos/'];
// ClickPy (ClickHouse's public playground over PyPI's download data): read-only SQL, no key. It runs about a day ahead of pypistats.org and adds
// country, package version, file type and installer. It counts every download, mirrors included; the installers below are the mirrors.
const CLICKPY = 'https://sql-clickhouse.clickhouse.com/?user=demo&default_format=JSON';
const MIRROR_INSTALLERS = ['bandersnatch', 'Artifactory', 'devpi', 'Nexus', 'z3c.pypimirror', 'pep381client'];
const PAUSE_MS = 1200;
const HISTORY_DAYS = 180;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, tries = 3, extraHeaders = {}) {
  if (!ALLOWED.some((prefix) => url.startsWith(prefix))) throw new Error('SOURCE_NOT_ALLOWED');
  const headers = { Accept: 'application/json', 'User-Agent': 'mgatc.com-pypi-stats (https://www.mgatc.com/recursos/pypi-stats/)', ...extraHeaders };
  if (url.startsWith('https://api.github.com/') && process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    const response = await fetch(url, { headers, redirect: 'error', signal: AbortSignal.timeout(20_000) });
    if (response.status === 429 && attempt < tries) {   // rate limited: wait longer each time
      await sleep(5_000 * attempt);
      continue;
    }
    if (response.status === 202 && attempt < tries) {   // GitHub is still computing a statistic: ask again shortly
      await sleep(4_000);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    if (response.status === 202) throw new Error('STILL_COMPUTING');
    return response.json();
  }
  throw new Error('UNREACHABLE');
}

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const text = (value, max = 300) => (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '');

/** pypistats rows [{category, date, downloads}] -> {dates, series: {category: [downloads aligned with dates]}} (compact: the dates are stored once). */
function pivot(rows, keep = 12) {
  const dates = Array.from(new Set(rows.map((row) => text(row.date, 10)))).sort().slice(-HISTORY_DAYS);
  const index = new Map(dates.map((date, position) => [date, position]));
  const totals = new Map();
  const series = {};
  for (const row of rows) {
    const position = index.get(text(row.date, 10));
    if (position === undefined) continue;
    const category = text(String(row.category ?? 'unknown'), 24) || 'unknown';
    (series[category] ||= new Array(dates.length).fill(0))[position] += num(row.downloads);
    totals.set(category, (totals.get(category) || 0) + num(row.downloads));
  }
  const top = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, keep).map(([category]) => category);
  return { dates, series: Object.fromEntries(top.map((category) => [category, series[category]])) };
}

async function optional(label, work) {
  try {
    return await work();
  } catch (error) {
    console.warn(`pypi-stats: ${label} skipped (${error.message})`);
    return null;
  }
}

/** Runs a read-only query on ClickPy and returns its rows. */
async function clickpy(sql) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(CLICKPY, { method: 'POST', body: sql, redirect: 'error', signal: AbortSignal.timeout(40_000) });
    if (response.ok) return (await response.json()).data || [];
    if (attempt < 3 && response.status >= 500) await sleep(3_000);
    else throw new Error(`CLICKPY_${response.status}`);
  }
  throw new Error('CLICKPY_UNREACHABLE');
}

/** Rows [{date, key, ...bases}] -> {dates, series: {key: values}} for one base, keeping only the `keys` given. */
function pivotRows(rows, keyField, base, keys, dates) {
  const index = new Map(dates.map((date, position) => [date, position]));
  const series = Object.fromEntries(keys.map((key) => [key, new Array(dates.length).fill(0)]));
  for (const row of rows) {
    const key = String(row[keyField] ?? '');
    const position = index.get(row.date);
    if (position !== undefined && series[key]) series[key][position] += num(row[base]);
  }
  return { dates, series };
}

function topKeys(rows, keyField, count) {
  const totals = new Map();
  for (const row of rows) totals.set(String(row[keyField] ?? ''), (totals.get(String(row[keyField] ?? '')) || 0) + num(row.all_));
  return [...totals.entries()].filter(([, total]) => total > 0).sort((a, b) => b[1] - a[1]).slice(0, count).map(([key]) => key);
}

async function fetchClickpy(name) {
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) throw new Error('BAD_PACKAGE_NAME');
  const table = 'pypi.pypi_downloads_per_day_by_version_by_installer_by_type_by_country';
  const mirrors = MIRROR_INSTALLERS.map((installer) => `'${installer}'`).join(',');
  const since = `date >= today() - ${HISTORY_DAYS - 1}`;
  const sums = `sum(count) AS all_, sumIf(count, installer NOT IN (${mirrors})) AS nomirror`;
  const query = (field) => clickpy(`SELECT date, ${field ? `${field} AS k,` : ''} ${sums} FROM ${table} WHERE project = '${name}' AND ${since} GROUP BY date${field ? ', k' : ''} ORDER BY date`);

  const total = await query('');
  const dates = Array.from(new Set(total.map((row) => row.date))).sort();
  if (!dates.length) return null;
  const both = (rows, keyField, keys) => ({ all: pivotRows(rows, keyField, 'all_', keys, dates), nomirror: pivotRows(rows, keyField, 'nomirror', keys, dates) });
  const out = { through: dates[dates.length - 1], total: { dates, series: { all: dates.map((date) => num(total.find((row) => row.date === date)?.all_)), nomirror: dates.map((date) => num(total.find((row) => row.date === date)?.nomirror)) } } };

  const dimensions = [['country', 30], ['version', 10], ['type', 6]];
  for (const [label, count] of dimensions) {
    await sleep(PAUSE_MS);
    const field = label === 'country' ? 'country_code' : label;
    const rows = (await query(field)).map((row) => ({ ...row, k: String(row.k ?? '') }));
    out[label] = both(rows, 'k', topKeys(rows.map((row) => ({ ...row, all_: row.all_ })), 'k', count));
  }
  await sleep(PAUSE_MS);
  const installerRows = (await query('installer')).map((row) => ({ ...row, k: String(row.k ?? '') }));
  out.installer = pivotRows(installerRows, 'k', 'all_', topKeys(installerRows, 'k', 10), dates);
  return out;
}

async function fetchPackage(entry) {
  const name = entry.name;
  const out = { name, repo: entry.repo || null, homebrew: entry.homebrew || null };

  const pypi = await getJson(`https://pypi.org/pypi/${name}/json`);
  const info = pypi.info || {};
  const files = Array.isArray(pypi.urls) ? pypi.urls : [];
  const uploaded = files.map((file) => file.upload_time_iso_8601).filter(Boolean).sort().pop() || null;
  const releases = Object.entries(pypi.releases || {})
    .map(([version, list]) => ({ version: text(version, 40), date: (list || []).map((file) => file.upload_time_iso_8601).filter(Boolean).sort()[0]?.slice(0, 10) || null }))
    .filter((release) => release.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  Object.assign(out, { version: text(info.version, 40), summary: text(info.summary, 240), requiresPython: text(info.requires_python, 40), releasedAt: uploaded,
    releases });
  await sleep(PAUSE_MS);

  const recent = (await getJson(`https://pypistats.org/api/packages/${name}/recent`)).data || {};
  out.recent = { day: num(recent.last_day), week: num(recent.last_week), month: num(recent.last_month) };
  await sleep(PAUSE_MS);

  const overall = (await getJson(`https://pypistats.org/api/packages/${name}/overall?mirrors=false`)).data || [];
  out.history = overall.filter((row) => row.category === 'without_mirrors').map((row) => ({ date: text(row.date, 10), downloads: num(row.downloads) }))
    .sort((a, b) => a.date.localeCompare(b.date)).slice(-HISTORY_DAYS);

  await sleep(PAUSE_MS);
  const withMirrors = await optional('downloads with mirrors', async () => (await getJson(`https://pypistats.org/api/packages/${name}/overall?mirrors=true`)).data || []);
  out.withMirrors = (withMirrors || []).filter((row) => row.category === 'with_mirrors').map((row) => ({ date: text(row.date, 10), downloads: num(row.downloads) }))
    .sort((a, b) => a.date.localeCompare(b.date)).slice(-HISTORY_DAYS);
  await sleep(PAUSE_MS);
  const system = await optional('operating systems', async () => (await getJson(`https://pypistats.org/api/packages/${name}/system`)).data || []);
  out.system = system ? pivot(system.filter((row) => row.category !== 'null' || true)) : null;
  await sleep(PAUSE_MS);
  const python = await optional('python versions', async () => (await getJson(`https://pypistats.org/api/packages/${name}/python_minor`)).data || []);
  out.python = python ? pivot(python) : null;

  await sleep(PAUSE_MS);
  out.clickpy = await optional('ClickPy (country, versions, installers, fresher days)', () => fetchClickpy(name));

  if (entry.repo) {
    await sleep(PAUSE_MS);
    out.github = await optional('GitHub repository', async () => {
      const repo = await getJson(`https://api.github.com/repos/${entry.repo}`);
      const github = { stars: num(repo.stargazers_count), forks: num(repo.forks_count), openIssues: num(repo.open_issues_count), url: text(repo.html_url, 200),
        createdAt: text(repo.created_at, 10), pushedAt: text(repo.pushed_at, 10), language: text(repo.language, 30), license: text(repo.license?.spdx_id, 30) };
      await sleep(PAUSE_MS);
      github.starHistory = (await optional('stargazers (GitHub needs a token for this one: set GITHUB_TOKEN)', async () => {
        const stars = await getJson(`https://api.github.com/repos/${entry.repo}/stargazers?per_page=100`, 3, { Accept: 'application/vnd.github.star+json' });
        return stars.map((star) => text(star.starred_at, 10)).filter(Boolean).sort();
      })) || [];
      await sleep(PAUSE_MS);
      github.commits = (await optional('commits', async () => {
        // The statistics endpoint is computed lazily (202 on the first call); listing the commits of the last year is immediate and enough to count per week.
        const since = new Date(Date.now() - 365 * 86_400_000).toISOString();
        const dates = [];
        for (let page = 1; page <= 3; page += 1) {
          const batch = await getJson(`https://api.github.com/repos/${entry.repo}/commits?per_page=100&page=${page}&since=${since}`);
          if (!Array.isArray(batch)) break;
          dates.push(...batch.map((commit) => text(commit.commit?.author?.date, 10)).filter(Boolean));
          if (batch.length < 100) break;
          await sleep(PAUSE_MS);
        }
        const weeks = new Map();
        for (const date of dates) {
          const day = new Date(`${date}T00:00:00Z`);
          day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));   // the Monday of that week
          const key = day.toISOString().slice(0, 10);
          weeks.set(key, (weeks.get(key) || 0) + 1);
        }
        return [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([week, total]) => ({ week, total }));
      })) || [];
      return github;
    });
  }
  return out;
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  let previous = { packages: [] };
  try {
    previous = JSON.parse(await readFile(OUTPUT_PATH, 'utf8'));
  } catch {
    // first run: nothing to fall back on
  }
  const before = new Map((previous.packages || []).map((pkg) => [pkg.name, pkg]));
  const packages = [];
  let fresh = 0;

  for (const entry of config.packages) {
    try {
      const fetched = await fetchPackage(entry);
      if (!fetched.clickpy && before.get(entry.name)?.clickpy) fetched.clickpy = before.get(entry.name).clickpy;   // keep what we had rather than lose the map
      packages.push({ ...fetched, stale: false });
      fresh += 1;
    } catch (error) {
      console.warn(`pypi-stats: ${entry.name} could not be refreshed (${error.message}); keeping the previous values`);
      const old = before.get(entry.name);
      packages.push(old ? { ...old, stale: true } : { name: entry.name, repo: entry.repo || null, homebrew: entry.homebrew || null, recent: { day: 0, week: 0, month: 0 }, history: [], stale: true });
    }
    await sleep(PAUSE_MS);
  }

  if (fresh === 0 && (previous.packages || []).length > 0) {
    console.warn('pypi-stats: nothing could be refreshed; the committed snapshot stays as it is');
    return;
  }
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), owner: config.owner, packages })}\n`);
  console.log(`pypi-stats: ${fresh}/${config.packages.length} packages refreshed`);
}

main().catch((error) => {
  console.warn(`pypi-stats: skipped (${error.message})`);
});
