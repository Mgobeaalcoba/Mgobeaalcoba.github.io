# ADR 0004: MGA Studio visual identity

Date: 2026-11-07. Status: implemented locally; publication pending.

## Context

The commercial homepage mixed generic impact targets, case-like examples and an extensive service catalog. Michroma headings and repeated grids gave most sections equal visual weight. The owner requested a full rebrand while keeping the existing colors.

The [benchmark](../product/reports/Rebranding%20de%20consultor%C3%ADa%20MGA.md) documents nine primary-source references and distinguishes direct competition, adjacent platforms and aspirational studios. It does not establish conversion performance.

## Decision

- Keep the Signal dark/light color tokens, blue, cyan and lime. Use lime for actions and blue for text emphasis in the light theme to preserve legibility.
- Use Geist for both display and body text; reserve IBM Plex Mono for small labels. Remove the Selene presentation layer from the root layout.
- Introduce an SVG stacked mark, lowercase wordmark and authored icons/social cover. Regenerate with `node scripts/generate-studio-assets.mjs`; this script does not fetch external assets or touch Next.js output.
- Use one navigation model on all screen sizes: Services, Work, Studio, Explore, plus contact. Explore contains the blog, tools, AgentHub and the detailed service catalog. Preserve the command palette through Explore and its keyboard shortcut.
- Explain four capabilities on the homepage: AI agents, automation, software and data. Keep actual prices, scope and checkout in the existing service routes. Add category filters to the catalog.
- Show identifiable projects and their status. Neil and Henry are featured; El Portugués remains accessible; Racing is a proposal; Unicorn is in progress. The Neil image is an optimized existing product asset, and the card is an editorial composition rather than a screenshot of the deployed site.
- Label the workflow examples as illustrative and disconnected. They never execute automations or simulate production telemetry.
- Share process/FAQ copy through `src/lib/studioContent.ts`. Remove unsupported savings/free-diagnostic promises from the homepage metadata, structured data and process page.
- Retain static exports, localized documents, existing project/tool routes, analytics and the real contact integrations. Contact improvements include labels, initial focus, focus cycling and return focus.

## Consequences

Shared navigation, footer and typography update deeper routes, including blog, resources, portfolio and AgentHub. Their specialized interactions and content structures remain intact. Neil and El Portugués source applications receive no rebrand changes.

The report and source notes are observations as of 2026-11-07; competitor sites may change. A visual benchmark is not evidence of better conversion. Post-publication evaluation should use the existing consent-aware analytics contract and observed customer tasks.
