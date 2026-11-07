# Repository state

Updated: 2026-11-07 · Codex.

MGA's Studio rebrand is implemented locally in `apps/web/`, preserving the Signal palette and static export. Branch: `codex/mga-studio-rebrand`. The [design decision](decisions/0004-studio-rebrand.md) describes the implementation; the [benchmark](product/reports/Rebranding%20de%20consultor%C3%ADa%20MGA.md) compares nine public references and records evidence limits.

## Verified

- `NEXT_BUILD_ENGINE=webpack npm run check`: passed all three builds, TypeScript checks and static smoke checks. The final homepage metadata adjustment was then checked with a narrow Webpack build, localization post-processing and another static smoke check.
- Standard Turbopack initially passed, but later recompilation was blocked by sandbox port binding (`EPERM`), including an escalated attempt. The repository's existing Webpack fallback completed successfully. No build configuration was changed.
- Targeted ESLint: zero errors; the root layout retains the existing custom-font warning. Runtime used the installed Node 26.10.0; Node 20 was not installed for a separate compatibility run.
- Browser: desktop 1440×1000, mobile 390×844 and minimum width 320; dark/light themes and ES/EN. Checked menus, Escape/focus return, contact focus cycling, capability accordions, illustrative scenarios and catalog filter counts (5/3/2). No messages or payments were submitted.
- Fresh production-export tab: interactive examples and catalog filtering worked; no console errors were observed during that smoke test. No horizontal overflow or broken images in the checked homepage states. Exported ES/EN language and brand titles verified.
- Secret scan of staged content and whitespace checks passed. Brand assets can be regenerated with `node scripts/generate-studio-assets.mjs`.

Next step: visual review and publication coordination. No deployment or push has been performed. Local preview servers were stopped. Economic/PyPI snapshots refreshed by prebuild were restored to their initial source versions; generated Next.js output is not staged.

Pre-existing edits to `apps/web/AGENTS.md`, `apps/web/next-env.d.ts`, `infra/supabase/README.md`, migration 020 and local `.agents/`/`.codex/` entries belong to other work and remain outside this change.
