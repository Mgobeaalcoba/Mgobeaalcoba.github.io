# Exec plan: agentification service page and special report

Status: in review — ready to publish (2026-10-17).

## Goal

Launch the "agentification" offer and its public special report:

1. `/servicios/agentificacion/` — service detail (ES/EN) with a contact channel instead of checkout (custom quote, no published price). CTA opens the shared contact modal (WhatsApp/email).
2. `/blog/special/agentificacion/` — data-driven special report (2025–2026 research + MGATC pilot case) with a Research desk card and sitemap entry.

## Changes

- `apps/web/src/lib/offers.ts`: new offer `agentificacion`; `priceUsd` now optional; adds `pricingNote` / `customQuote`.
- `apps/web/src/components/commerce/*`: checkout button, grid and detail support offers without a price (contact CTA, custom final heading, no diagnostic-discount guarantee).
- `apps/web/src/contexts/LanguageContext.tsx`: `checkout_contact*`, `services_custom_quote`, `services_quote_note`; `services_grid_sub` adjusted.
- `apps/web/src/app/blog/special/agentificacion/*`: report page + content (bilingual, 5 Chart.js charts, timeline, pilot KPIs, service CTA).
- `apps/web/src/components/blog/SpecialReportsSection.tsx`: report card 04.
- `apps/web/src/app/sitemap.ts`: new special.
- Catalog schemas (ES/EN list + detail): `offers` block emitted only when a price exists.

## Data provenance

Pilot figures are MGATC internal data verified 2026-10-17 (recorded in the mgatc-juan-manuel repo memory and `docs/research/agentificacion.md` here). Third-party figures cite their sources inside the report (sources block).

## Verification

- `npx tsc --noEmit` clean; `npx next build` (with placeholder Supabase env vars locally — real values come from CI secrets) prerenders `/blog/special/agentificacion/`, `/servicios/agentificacion/` and `/en/servicios/agentificacion/`.
- Publish: a push of `main` touching `apps/**` triggers the deploy workflow (pushed by Mariano).

## Follow-ups

- Decide the price model (pricing ideas shared 2026-10-17); the page intentionally shows no price.
- The commercial deck (pptx) lives outside this repo (mgatc-juan-manuel workstream / Drive).
