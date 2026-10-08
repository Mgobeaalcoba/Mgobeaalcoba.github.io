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
const PAUSE_MS = 1200;
const HISTORY_DAYS = 180;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, tries = 3) {
  if (!ALLOWED.some((prefix) => url.startsWith(prefix))) throw new Error('SOURCE_NOT_ALLOWED');
  const headers = { Accept: 'application/json', 'User-Agent': 'mgatc.com-pypi-stats (https://www.mgatc.com/recursos/pypi-stats/)' };
  if (url.startsWith('https://api.github.com/') && process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    const response = await fetch(url, { headers, redirect: 'error', signal: AbortSignal.timeout(20_000) });
    if (response.status === 429 && attempt < tries) {   // rate limited: wait longer each time
      await sleep(5_000 * attempt);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    return response.json();
  }
  throw new Error('UNREACHABLE');
}

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const text = (value, max = 300) => (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '');

async function fetchPackage(entry) {
  const name = entry.name;
  const out = { name, repo: entry.repo || null, homebrew: entry.homebrew || null };

  const pypi = await getJson(`https://pypi.org/pypi/${name}/json`);
  const info = pypi.info || {};
  const files = Array.isArray(pypi.urls) ? pypi.urls : [];
  const uploaded = files.map((file) => file.upload_time_iso_8601).filter(Boolean).sort().pop() || null;
  Object.assign(out, { version: text(info.version, 40), summary: text(info.summary, 240), requiresPython: text(info.requires_python, 40), releasedAt: uploaded,
    releases: Object.keys(pypi.releases || {}).length });
  await sleep(PAUSE_MS);

  const recent = (await getJson(`https://pypistats.org/api/packages/${name}/recent`)).data || {};
  out.recent = { day: num(recent.last_day), week: num(recent.last_week), month: num(recent.last_month) };
  await sleep(PAUSE_MS);

  const overall = (await getJson(`https://pypistats.org/api/packages/${name}/overall?mirrors=false`)).data || [];
  out.history = overall.filter((row) => row.category === 'without_mirrors').map((row) => ({ date: text(row.date, 10), downloads: num(row.downloads) }))
    .sort((a, b) => a.date.localeCompare(b.date)).slice(-HISTORY_DAYS);

  if (entry.repo) {
    await sleep(PAUSE_MS);
    try {
      const repo = await getJson(`https://api.github.com/repos/${entry.repo}`);
      out.github = { stars: num(repo.stargazers_count), forks: num(repo.forks_count), openIssues: num(repo.open_issues_count), url: text(repo.html_url, 200) };
    } catch {
      out.github = null;   // GitHub is a nice-to-have: PyPI numbers still count
    }
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
      packages.push({ ...(await fetchPackage(entry)), stale: false });
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
  await writeFile(OUTPUT_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), owner: config.owner, packages }, null, 2)}\n`);
  console.log(`pypi-stats: ${fresh}/${config.packages.length} packages refreshed`);
}

main().catch((error) => {
  console.warn(`pypi-stats: skipped (${error.message})`);
});
