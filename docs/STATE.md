# Repository state

Updated: 2026-11-07 · Codex.

MGA Studio is implemented locally across the main site's route families in `apps/web/`, with the owner's approved softer light/dark palettes. Branch: `codex/mga-studio-rebrand`. [ADR 0005](decisions/0005-studio-sitewide-themes.md) updates the palette and scope of [ADR 0004](decisions/0004-studio-rebrand.md); [coverage and maintenance](product/studio-design-system.md) records the page families. The original [benchmark](product/reports/Rebranding%20de%20consultor%C3%ADa%20MGA.md) remains available.

## Implemented

- Canonical semantic palette, prepaint appearance, blue primary actions, neutral final contact surface, theme-aware controls, SVG and canvas charts, and matching icon/social assets.
- New blog/resource/founder/AgentHub/catalog layouts; inset archive cards, original color portrait, a compact illustrative agent flow and a complete Studio assistant interface; article reading rail, report headers and KPI strips; consistent details, cases, dashboards, process/privacy and error/offline pages. Localized equivalents reuse the same components.
- Mobile: compact preference header, five-item bottom navigation and an Explore sheet with assistant/search access. El Portugués, Racing and Unicorn now have prominent cards with local, labeled interactive previews.
- Existing calculations, data sources, article content, checkout and contact integrations retained. Neil and El Portugués source apps and actual client/embedded media retain their own identity.

## Verified

- Ran `NEXT_BUILD_ENGINE=webpack npm run check`: all three production builds completed, including 182 main-site pages. Repository doctor, root allowlist and final static smoke checks passed. Follow-up builds, localization post-processing and static smoke checks covered the final canvas cleanup and the owner’s visual corrections to cards, chat, AgentHub and photo. Further verification covered the public Racing route, mobile bottom navigation and local project demos; final narrow builds/static checks covered presentation refinements.
- TypeScript passed. Targeted ESLint reported no errors; existing effect/dependency warnings remain in legacy components, plus the existing root custom-font warning. Runtime was installed Node 26.10.0; a separate Node 20 compatibility run was not available.
- Browser review: desktop 1440×1000, mobile 390×844 and minimum width 320. Reviewed representative page families in both appearances, with a light-mode minimum-width sweep through the three INDEC dashboards, mortgage, ia-router, cases, video library, process, privacy, thanks and offline routes. These checks are not a manual review of every generated article.
- Resource category/tool/hash switching, PyPI period filtering and theme changes, article search, AgentHub disclosures, report funnel disclosure and menu Escape behavior worked. No messages, widget chats or payments were submitted.
- Final mobile review covered 400×588 and 320×568: bottom navigation, Explore/assistant access, contact-dialog sizing, Escape and focus return. Project controls changed all three previews as expected; final desktop screenshots and text-contrast checks covered the cards in both themes with no flagged pairs.
- Main reading/secondary/action contrast was calculated: minimum 5.03:1 in light mode and 6.09:1 in dark mode across page, surface and raised backgrounds; primary buttons 5.56:1 / 6.51:1. A DOM-based follow-up checked text/background pairs on 28 representative routes in both themes and all 12 tool selections in both themes (80 states), with no remaining flagged pairs in those checked states after corrections. It excludes media/gradient/SVG/canvas pixels and is not an accessibility certification.
- Secret scan of tracked source and whitespace checks passed. Build-only refreshes to mortgage, PyPI and INDEC snapshots were restored. Generated Next.js output is not staged.

## Local review

The compiled main-site export is served at `http://127.0.0.1:3000/` for the owner's requested review. The preview is intentionally left running; it serves `apps/web/out/` with a temporary server outside the repository. The normal editable development command remains `npm run dev`.

Racing is public in the local export at `/trabajos/racing/`; `/racing-propuesta/` redirects directly to it. No implementation outcomes or sales metrics were invented.

No deployment or push has been performed. Pre-existing edits to `apps/web/AGENTS.md`, `apps/web/next-env.d.ts`, `infra/supabase/README.md`, migration 020 and local `.agents/`/`.codex/` entries belong to other work and remain outside this change.
