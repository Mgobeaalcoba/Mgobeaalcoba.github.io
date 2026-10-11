# Deployment

The canonical workflow is `.github/workflows/deploy.yml`. It builds the three npm workspaces, downloads their static artifacts and publishes the assembled site to `gh-pages`.

For Cloudflare Pages use:

- Build command: `npm run deploy`
- Output directory: `_site`
- Node.js: 20

Static root artifacts belong in `apps/web/public/`. Never copy generated output back into the repository root.

The workflows install Node from `.nvmrc` and pin the `actions/*` majors to their Node 24 runtimes, so the runner does not warn about deprecated action runtimes.

## Propagation after a deploy

A push to `main` triggers GitHub Actions, which publishes `gh-pages` in roughly a minute. The custom domain is served by Cloudflare, which runs **its own build** (`npm run deploy` → `_site`) and therefore trails `gh-pages` by a couple of minutes.

When a brand new URL looks broken right after a deploy, check the GitHub Pages origin first (`https://mgobeaalcoba.github.io/...`). If it serves the page and the custom domain returns 404, the Cloudflare build has not finished yet; it is not a code problem.

## Daily PyPI dashboard data

The deploy workflow refreshes PyPI data at 09:17, 15:17 and 21:17 UTC. GitHub may delay scheduled runs. Each refresh uses a single dynamic UTC yesterday cutoff (`targetDate` in `data/pypi-stats.json`) and queries ClickPy through that date. The previous published snapshot is reused when it is newer than main's committed fallback, so a failed source cannot undo a successful scheduled refresh. pypistats failures preserve that source's previous values without blocking ClickPy.

Scheduled GitHub builds publish to `gh-pages`; they do not trigger a new Cloudflare source build. The dashboard therefore reads both the same-origin JSON and the public `gh-pages/data/pypi-stats.json` on raw.githubusercontent.com, retaining the newest successful snapshot. It refreshes on load, every 15 minutes and when the tab becomes visible. The HTML snapshot remains the offline fallback; the displayed refresh timestamp follows the data actually shown.

The default series uses ClickPy with mirror installers excluded. Yesterday is recalculated in the browser in UTC, including across midnight. A partial source day is included and explicitly labelled provisional; an unavailable date produces a freshness notice. Public source delays cannot be converted into real download counts. The pypistats OS/Python filters retain their own available date ranges and definitions.

Run `node --test scripts/tests/pypi-stats.test.mjs` for offline coverage of UTC rollover, segment dates, partial-day visibility and independent source failures. `npm run check` verifies all static exports.
