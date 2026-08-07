# MGA repository guide

This repository contains three statically exported Next.js applications. Treat this file as the operational contract; detailed and durable context belongs under `docs/`.

## Applications

- `apps/web/`: MGA Tech Consulting, portfolio, blog and tools. Deployed at the domain root.
- `apps/neil/`: Neil Climatizadores. Exported with `/neil-site` as its base path.
- `apps/el-portugues/`: El Portugués. Exported with `/elportugues-site` as its base path.

## Safe workflow

1. Read `README.md` and the closest application README before editing.
2. Run `npm run doctor` to validate the repository and environment.
3. Keep secrets out of source and generated artifacts. Public browser variables must still be documented in `.env.example`.
4. Preserve `output/`, `tmp/` and unrelated worktree changes.
5. Run the narrowest relevant build while iterating and `npm run check` before handoff.
6. Do not commit generated Next.js output. Deployment artifacts belong on `gh-pages` or in Cloudflare build output.

## Conventions

- Node.js 20 is the supported runtime.
- Use TypeScript and existing component patterns.
- Preserve static export, trailing slashes and the two client-site base paths.
- Prefer focused changes and explicit file staging.
- Update repository documentation when commands, paths or deployment behavior change.
- Keep the root allowlist enforced by `npm run check:root`; new durable files belong in an existing domain directory.

## Change map

- Application behavior: edit the relevant `apps/*` workspace and follow its local `AGENTS.md`.
- Shared build or verification: edit `scripts/`, the root package files and CI together.
- Database schema: add an ordered migration under `infra/supabase/migrations/`; never rewrite an applied migration.
- n8n workflows: keep exports and referenced assets under `automation/n8n/`; scrub credentials before commit.
- Durable knowledge: update `docs/`. Historical artifacts belong under `docs/archive/`.
