# ADR 0007: Bottom navigation and interactive project previews

Date: 2026-11-07. Status: implemented locally; publication pending.

## Context

The owner's mobile review rejected the hamburger menu and requested bottom navigation with an overall mobile-layout improvement. The owner also requested prominent, interactive cards for El Portugués, Racing and Unicorn, alongside Neil and Henry.

## Decision

- Keep desktop navigation. Below 821px, use a compact brand/language/theme header and five bottom actions: Home, Services, Work, Explore and Contact.
- Explore opens a two-column sheet with five page destinations, the AI assistant and site search. Keep Escape, focus containment, return focus, outside dismissal and scroll locking. Hash links remain native anchors so browser history and deep links work without a client router dependency.
- Reserve bottom space, including device safe areas. Move assistant access into Explore and place the mortgage summary above the bar; hide floating assistant/contact triggers on mobile so they do not cover content. Align mobile headings, spacing and contact dialogs with the smaller header.
- Replace the three small project rows with complete cards. El Portugués offers a three-step illustrative logistics flow; Racing switches between its three documented consulting workstreams; Unicorn explores an illustrative learning journey while retaining its in-progress status.
- Project controls are local presentation only. They do not query client systems, expose operational data, or imply deployed client functionality. Each card keeps its real site/case destination.

## Consequences

This updates the one-navigation-model decision in ADR 0004. Studio now has a deliberately different mobile navigation model. The illustrations add no external service dependency, credentials or new data collection. Both appearances use semantic foreground/background pairs.
