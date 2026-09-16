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
