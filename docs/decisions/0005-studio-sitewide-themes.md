# ADR 0005: Studio across the MGA site and softer themes

Date: 2026-11-07. Status: implemented locally; publication pending.

## Context

After reviewing the first rebrand, the owner identified that the internal pages still retained their earlier structures and that the light appearance was too bright. The owner approved extending the redesign across MGA and refining both palettes. This updates the palette and internal-page scope of [ADR 0004](0004-studio-rebrand.md).

## Decision

- Keep the blue, cyan and lime identity, with quieter shades. Use a green-gray page background in light mode and a charcoal-blue background in dark mode. Primary actions use blue in both modes; lime is an accent. The final contact section uses a neutral surface.
- Centralize semantic colors in `studio-theme.css`. Existing Signal components, legacy Tailwind controls, SVG illustrations and canvas charts consume these roles. Apply the saved or system theme before first paint, then let the existing theme provider manage user changes.
- Give blog, resource catalog, founder portfolio, AgentHub and service catalog explicit page layouts. Rework article reading columns, report headers/KPIs, details, cases, financial/data tools, privacy/process pages and error/offline screens to share hierarchy and surfaces.
- Give the shared first-party assistant its own Studio interface across identity, conversation and composer states. Use inset archive cards and a compact illustrative AgentHub flow. Keep the owner's original color photo in the thumbnail and profile.
- Keep tool calculations, data sources, checkout, contact endpoints, article content, analytics and localized route generation intact. Preserve actual client logos, screenshots, videos and the embedded educational game as content with their own visual identity.
- Use a stable server snapshot plus subscription to root class changes for canvas colors. Resolve semantic tokens before passing colors to Chart.js; changing appearance must not reset filters.
- Preserve static export, trailing slashes and all client-site base paths. Neil and El Portugués remain separate brands and receive no source changes.

## Consequences

New layouts and color tokens cover every authored MGA Next.js route family, including localized equivalents that reuse the components. This is not a manual audit of every generated article. [Coverage and maintenance](../product/studio-design-system.md) records the boundaries and verification approach.

The palette expresses visual judgment approved by the owner; it does not establish conversion improvements or medical claims about eye strain. Primary text, secondary text and primary buttons meet a calculated 4.5:1 contrast on their intended surfaces. Categorical chart colors are supplementary to labels and data tables.
