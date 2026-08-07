# Deployment

The canonical workflow is `.github/workflows/deploy.yml`. It builds the three npm workspaces, downloads their static artifacts and publishes the assembled site to `gh-pages`.

For Cloudflare Pages use:

- Build command: `npm run deploy`
- Output directory: `_site`
- Node.js: 20

Static root artifacts belong in `apps/web/public/`. Never copy generated output back into the repository root.
