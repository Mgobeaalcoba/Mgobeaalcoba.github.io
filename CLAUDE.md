# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

npm-workspaces monorepo (`apps/*`) containing three independently deployed, statically exported Next.js 16 sites that share one toolchain and lockfile:

| Workspace | Path | Deployed to | Purpose |
| --- | --- | --- | --- |
| `cv` | `apps/web/` | domain root | MGA Tech Consulting: portfolio, consulting pages, blog, tools |
| `neil-landing` | `apps/neil/` | `/neil-site/` | Client landing page (Neil Climatizadores), multilingual |
| `elportugues-landing` | `apps/el-portugues/` | `/elportugues-site/` | Client landing page (El Portugués) |

Every app builds with `output: 'export'`, `trailingSlash: true`, and a fixed `basePath` (`''`, `/neil-site`, `/elportugues-site` respectively) — see each app's `next.config.js`. Never change these without updating the deployment assembly.

## Commands

```bash
nvm use              # Node 20 (required)
npm ci                # install from the root lockfile only
npm run doctor        # validate required files/scripts + Node version, then check:root
npm run dev           # run apps/web (cv) on :3000
npm run dev:neil      # run apps/neil
npm run dev:elportugues  # run apps/el-portugues
npm run build         # build apps/web only (runs prebuild: scripts/sync-mortgage-data.mjs)
npm run build:neil
npm run build:elportugues
npm run build:all     # build all three workspaces in sequence
npm run check         # doctor + build:all + smoke-static — run before handing off any change
npm run check:static  # verify expected out/ files exist per app (no build)
npm run check:root    # enforce the allowed set of root-level entries
npm run lint          # eslint apps
npm run format        # prettier --write over html/css/js/ts/tsx/json
npm run deploy        # scripts/build-deploy.sh -> produces _site/ (Cloudflare Pages)
```

There is no test suite (no Jest/Vitest/Playwright config) — correctness is enforced via `npm run doctor`, `npm run build:all`/per-app `next build`, `npm run check:static`, and `npm run lint`. To validate a single app, run that app's own `npm run build`/`npm run lint` from the repo root (workspace-scoped), not `next build` inside `apps/*` directly, since `prebuild` hooks and shared config are wired through the root scripts.

## Architecture

- **Static assembly, not a running server.** GitHub Actions (`.github/workflows/deploy.yml`) builds the three workspaces independently, then assembles their `out/` artifacts into the final site and publishes to `gh-pages`. `scripts/build-deploy.sh` produces the equivalent `_site/` layout for Cloudflare Pages. `apps/web/out` → `/`, `apps/neil/out` → `/neil-site/`, `apps/el-portugues/out` → `/elportugues-site/`.
- **Supabase is optional content data, not a runtime dependency.** `infra/supabase/` holds the canonical schema/migrations (append-only — never rewrite an applied migration). Each app must still build and function using documented public placeholders when Supabase is unavailable; `apps/el-portugues` in particular keeps a local fallback JSON so content still renders without Supabase.
- **n8n workflows (`automation/n8n/`) are operational assets**, not part of the static build. Scrub credentials before committing exports; reference connections by name/placeholder only.
- **Root allowlist is enforced.** `scripts/check-root.mjs` fails the build if a root-level file/dir isn't in its known set — new durable files go inside an existing domain directory (`apps/`, `docs/`, `scripts/`, `infra/`, `automation/`), not the repo root.
- **`apps/web` internals**: `content/posts/` holds blog markdown with frontmatter (parsed via `gray-matter`/`remark`); `src/app/` is the Next.js App Router tree (blog, consulting, portfolio, recursos, servicios, privacidad, offline); `src/lib/queries/` wraps Supabase reads; `scripts/sync-knowledge.ts` and root `scripts/sync-mortgage-data.mjs` (run as `prebuild`) pull/generate data consumed at build time.
  - **Theme system**: `src/contexts/ThemeContext.tsx` toggles `dark`/`light` via a class on `<html>` (`dark`, or `light` + `light-mode`), persisted to `localStorage`. Two parallel CSS-variable systems key off `html.light-mode`: `src/app/globals.css` (`--bg`, `--text`, `--primary`, etc., plus a long tail of per-utility-class light-mode overrides) and `src/app/signal.css` (the "MGA Signal" design tokens — `--signal-*` — used by Navbar/Footer/CommandPalette/terminal dock). `ConsultingHero.tsx`'s `THEME_CONFIG` and `Navbar.tsx`'s `THEME_ICONS` are both keyed by theme value and must stay exhaustive over `Theme`'s union if it's ever extended. Keep light/dark behaviorally equivalent — the portfolio terminal (`src/components/cv/Terminal.tsx`) renders in both and is intentionally theme-agnostic in its own styling.
- **Client sites (`apps/neil`, `apps/el-portugues`)** must preserve their base path, trailing slashes, and static export config. Copy is multilingual in `apps/neil`; update every locale together when changing copy. Client-facing browser config lives in `.env.local`, documented with placeholders in `.env.example` — `NEXT_PUBLIC_*` values are public (embedded in the browser bundle), never put secrets there.

## Working in this repo with Claude Code

- **`AGENTS.md` files are edit-protected.** A `PreToolUse` hook (`.claude/hooks/proteger-agents.sh`) denies any `Edit`/`Write` to a path containing `AGENTS.md`, at any level of the repo, unless Mariano explicitly approves it first. Don't retry the same edit — ask for approval instead.
- **`review-pr` skill**: run before merging any change in `apps/web`, `apps/neil`, or `apps/el-portugues`. It diffs against a base branch and checks it against `.claude/skills/review-pr/resources/checklist-riesgos.md` (no secrets hardcoded, no unreviewed edits to `infra/supabase/migrations/`, local `npm run check` passes, etc.).
- **`content-reviewer` agent**: read-only pass over visible text (typos, tone drift, unverifiable claims like prices/hours/contact info) — use after any content change, before committing.

## Documentation map

- `docs/architecture/system.md` — system boundaries/deployment flow (summarized above).
- `docs/product/overview.md` — applications and ownership.
- `docs/decisions/` — durable architecture decisions (ADRs).
- `docs/runbooks/` — development, deployment, analytics, secrets runbooks.
- `docs/archive/` — superseded/historical material.
- Nearest `AGENTS.md` (root and per-app under `apps/*/AGENTS.md`) is the operational contract — read it before editing that workspace.

## Conventions

- Node.js 20 only; install exactly from the root lockfile (`npm ci`), never a per-app lockfile.
- TypeScript + existing component patterns; strict mode is on in `tsconfig.base.json`.
- Do not commit generated Next.js output (`out/`, `.next/`) or `_site/` — deployment artifacts live on `gh-pages` or in Cloudflare build output only.
- Preserve `output/`, `tmp/`, and unrelated worktree changes.
- Rotate any credential immediately if it lands in git history; deleting the file afterward is not sufficient.
