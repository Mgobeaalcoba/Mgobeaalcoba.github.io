# MGA repository guide

This repository contains three statically exported Next.js applications. Treat this file as a map; detailed and durable context belongs under `docs/`.

## Applications

- `cv/`: MGA Tech Consulting, portfolio, blog and tools. Deployed at the domain root.
- `neil/`: Neil Climatizadores. Exported with `/neil-site` as its base path.
- `elportugues/`: El Portugués. Exported with `/elportugues-site` as its base path.

## Safe workflow

1. Read `README.md` and the closest application README before editing.
2. Keep secrets out of source and generated artifacts. Public browser variables must still be documented in `.env.example`.
3. Preserve `output/`, `tmp/` and unrelated worktree changes.
4. Run `npm run doctor` before implementation and `npm run check` before handoff.
5. Do not commit generated Next.js output. Deployment artifacts belong on `gh-pages` or in Cloudflare build output.

## Conventions

- Node.js 20 is the supported runtime.
- Use TypeScript and existing component patterns.
- Preserve static export, trailing slashes and the two client-site base paths.
- Prefer focused changes and explicit file staging.
- Update repository documentation when commands, paths or deployment behavior change.
