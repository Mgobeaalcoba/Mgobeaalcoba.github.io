# ADR 0006: Public Racing consulting case

Date: 2026-11-07. Status: implemented locally; publication pending.

## Context

The owner requested removing the private Racing entry screen and turning the offer into a public account of the service. The current public file contained only an access notice. A prior repository version contained the actual consulting proposal.

## Decision

- Publish `/trabajos/racing/` with the Studio shell and both appearances. Link it directly from the homepage and include it in the sitemap and static smoke checks.
- Replace `/racing-propuesta/` with an immediate, unauthenticated redirect and a fallback link to the public case. There is no password, access request or token in either public route.
- Base the narrative on documented consulting work: assessment, reference architecture, three business areas and a 90-day roadmap. Use design/definition verbs; do not turn planned implementation into a claimed production deployment or invent commercial results.
- Cover the commercial data foundation, sponsor measurement and Locademia unified commerce. Keep private prices, personal exchanges and the full historical proposal out of the new page.

## Consequences

Racing is now an open consulting case in the main application, rather than a separate private proposal artifact. This updates that boundary from ADR 0004/0005. The historical proposal is a source for the authored summary, not a file served to visitors. Deployment remains separate from the local review.
