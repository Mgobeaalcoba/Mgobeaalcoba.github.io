# ADR 0003: localized routes for public marketing pages

Status: accepted.

## Context

The site originally had one URL set and a runtime language toggle (`LanguageContext`, persisted in `localStorage`). Two consequences surfaced:

- The toggle only rewrites components that call `useLanguage()`. Anything rendered outside that contract — server components, pages that never opted in — stayed in Spanish.
- Nothing about the toggle reaches the HTML. Metadata, JSON-LD, canonical and `hreflang` are resolved at build time, so English content could never be indexed, and `/servicios/` shipped Spanish copy, Spanish structured data and Spanish metadata to every visitor.

## Decision

- The default locale (es) keeps the unprefixed paths. The non-default locale lives under `/en/...`.
- Only pages whose content genuinely exists in both languages get a localized route. `src/lib/i18n-routes.ts` holds the registry (`LOCALIZED_ROUTE_PATTERNS`); consumers derive links from it instead of hardcoding `/en/`.
- `src/lib/localizedMetadata.ts` builds canonical, `hreflang` alternates and the OpenGraph block from a locale-free path, so a new page needs one call instead of a repeated block.
- Page bodies that need the language live in client components, following the existing `ConsultingPageClient` / `RecursosClient` pattern. Server pages keep owning metadata and structured data, which is where localization has to happen.
- The `/en` subtree wraps its children in an authoritative `LanguageProvider`, so the route's language wins over the stored preference and the preference is persisted for the rest of the site.
- `apps/web/scripts/localize-export.mjs` runs as the workspace `postbuild` and rewrites `<html lang>` in the exported `/en` pages, because the root layout owns that attribute. Wired as a lifecycle script so CI, which builds workspaces directly, applies it too.
- `sitemap.ts` carries `alternates.languages` for every localized pair.

## Consequences

- English pages are real documents: English copy, metadata, JSON-LD and `lang` are present without JavaScript.
- Adding a localized page is a four-step change: add the pattern, create `app/en/<path>/page.tsx` with `buildLocalizedMetadata`, render the shared client component, and add both URLs to the sitemap.
- The runtime toggle still covers everything else, so the rest of the site keeps working without duplicated routes.
- Deliberately not localized: blog articles (their markdown source is Spanish-only), the Argentina tax/salary/mortgage tools (locale-specific), and the privacy policy (legal text needs a deliberate translation, not a routing change).
- There is no `Accept-Language` redirect. A visitor only moves between locales through the toggle, which persists the choice.
- The dev server still serves `<html lang="es">` for `/en` routes; the postbuild only touches the static export, so verify the attribute against `out/` or the deployed site, not against `next dev`.

## Known limitation

`<html lang>` is owned by the root layout and cannot vary per route in a static export without post-processing the output. The current rewrite is intentionally narrow: it only rewrites the first `<html lang="es">` occurrence inside `out/en/**`.
