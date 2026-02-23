---
name: legacy-landing-migration
description: Migrates a company's legacy website to a premium Next.js 14 static landing page hosted on GitHub Pages. Includes real content scraping, dark tech aesthetic (Framer Motion, Tailwind, glassmorphism), GA4 measurement plan, n8n automation badges, department automation catalog, and a commercial sales proposal section. Use when the user asks to build, migrate, or create a landing page for a client company from an existing website, or when they mention scraping, Next.js static export, GitHub Pages deployment, or client site MVP.
---

# Legacy Landing Migration

Builds a premium static landing for any company by scraping their existing site, structuring data in `content.json`, and deploying to GitHub Pages.

## Required inputs before starting

Collect from the user (or infer from context):

| Input | Variable | Example |
|---|---|---|
| Company name | `CLIENT_NAME` | El Portugués S.A. |
| Legacy URL | `CLIENT_LEGACY_URL` | elportuguessa.com.ar |
| URL slug | `CLIENT_SLUG` | elportugues |
| Design reference | `DESIGN_REF` | travelx.io |
| GA4 property | `GA4_ID` | G-DG0SLT5RY3 |
| n8n base URL | `N8N_URL` | n8n.instance.com |

If any input is missing, infer it or use a placeholder — do not stop to ask.

## Workflow

### Phase 1 — Scrape & structure

```bash
# 1. Fetch homepage HTML with user-agent
curl -L -A "Mozilla/5.0 (Macintosh)" CLIENT_LEGACY_URL -o /tmp/home.html

# 2. If WordPress, extract media library
curl "CLIENT_LEGACY_URL/wp-json/wp/v2/media?per_page=50" | python3 -c "
import sys, json
for item in json.load(sys.stdin): print(item['source_url'])
"

# 3. Extract all image URLs from HTML
python3 -c "
import re
with open('/tmp/home.html') as f: html = f.read()
print('\n'.join(set(re.findall(r'https?://[^ \"<>]+\.(png|jpg|jpeg|webp|svg)', html))))
"
```

Identify:
- **Header logo** (usually dark, needs CSS invert on dark bg)
- **Footer/white logo** (transparent bg, white pixels — use this on dark theme)
- Hero images, gallery images, warehouse/operations photos

Populate `src/data/content.json` following the full schema in `tasks/SPEC_TEMPLATE.md §5.2`.

### Phase 2 — Project scaffold

```bash
mkdir -p CLIENT_SLUG/src/{app,components,data,types,services,lib} CLIENT_SLUG/public
```

Config files to create: `package.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `.env.local`, `.gitignore`.

**Critical next.config.js values:**
```js
output: 'export', trailingSlash: true, basePath: '/CLIENT_SLUG-site'
```

**Critical .gitignore for the sub-project:**
```
node_modules/  .next/  out/  .env.local
```

### Phase 3 — Components

Build in this order, each as a `'use client'` component pulling data from `ContentRepository`:

1. `Navbar` — logo image (white version), links, CTA pill
2. `Hero` — rotating background images, giant headline, stat cards, dual CTAs
3. `About` — split layout: image with glow + pillars list
4. `Services` — transport grid cards + warehouse feature panel
5. `History` — alternating timeline + photo gallery
6. `Quality` — ISO cert display + commitments list
7. `Values` — numbered cards with icons
8. `Contact` — form → webhook + info cards + `AutomationBadge`
9. `SalesProposal` — amber warning banner + comparison + impact stats + department grid
10. `Footer` — logo, links, ISO badge
11. `AutomationBadge` — `⚡ Automatización` pill → Framer Motion modal with steps/tech/benefits
12. `ProposalCTA` — fixed bottom-right floating button, CSS gradient animation cycling colors, auto-hides when `#propuesta` visible
13. `ScrollTracker` — scroll depth (25/50/75/90/100%) + IntersectionObserver per section

### Phase 4 — Service layer

**`contentService.ts`** — Repository pattern:
```ts
const ContentRepository = {
  getHero: () => typedContent.hero,
  getAutomations: () => typedContent.automations,
  getSalesProposal: () => typedContent.salesProposal,
  // one getter per content key
};
```

**`webhookService.ts`** — single `sendToWebhook(url, data)` used by both contact and quote forms.

**`gtag.ts`** — full measurement plan. Always include `site_section: CLIENT_SLUG` and `client_name: CLIENT_NAME` on every event so traffic is filterable in GA4 without a separate property.

Minimum events: `scroll_depth`, `section_view`, `service_view`, `proposal_view`, `lead_form_sent`, `quote_requested`, `proposal_cta_click`, `consulting_click`.

### Phase 5 — Favicon

```python
from PIL import Image, ImageDraw
img = Image.open('source_logo.png').convert('RGBA').resize((512,512), Image.LANCZOS)
mask = Image.new('L', (512,512), 0)
ImageDraw.Draw(mask).ellipse((0,0,512,512), fill=255)
result = Image.new('RGBA', (512,512), (0,0,0,0))
result.paste(img, mask=mask)
result.save('CLIENT_SLUG/public/favicon.png')
result.save('CLIENT_SLUG/src/app/icon.png')
```

### Phase 6 — Build & verify

```bash
cd CLIENT_SLUG && npm install && npm run build
# Must exit 0 before proceeding

# Verify asset paths match basePath
python3 -c "
import re
with open('out/index.html') as f: html = f.read()
scripts = re.findall(r'src=\"(/[^\"]+\.js)\"', html)[:1]
assert '/CLIENT_SLUG-site/' in scripts[0], 'basePath mismatch!'
print('Asset paths OK:', scripts[0][:50])
"
```

### Phase 7 — Deploy output

```bash
rm -rf ../CLIENT_SLUG-site
cp -r out ../CLIENT_SLUG-site
cp public/logo.png ../CLIENT_SLUG-site/logo.png
cp public/favicon.png ../CLIENT_SLUG-site/favicon.png
```

Create `../CLIENT_SLUG.html` at repo root:
```html
<!DOCTYPE html><html><head>
<meta http-equiv="refresh" content="0; url=/CLIENT_SLUG-site/">
<script>window.location.replace('/CLIENT_SLUG-site/')</script>
</head></html>
```

## Key gotchas

- **BasePath mismatch** is the #1 failure mode. JS/CSS paths in HTML must start with `/CLIENT_SLUG-site/`, not `/CLIENT_SLUG/`. Verify after every build.
- **Framer Motion `opacity:0`** means content is invisible if JS fails. Fix: correct basePath so JS loads. Don't override with CSS `!important`.
- **Favicon in App Router**: place `icon.png` in `src/app/` — Next.js auto-generates the `<link rel="icon">` tag with cache-busting hash.
- **GA ID baking**: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` AND hardcode a fallback in `layout.tsx`. Static exports bake env vars at build time.
- **node_modules in git**: always create `CLIENT_SLUG/.gitignore` excluding `node_modules/`, `.next/`, `out/`, `.env.local` before the first `git add`.
- **Logo selection**: the white/footer logo version works on dark backgrounds. Sample pixels programmatically to confirm which variant is brighter.

## SalesProposal section (always required)

Every delivery must include a `SalesProposal` component with:
- Amber `⚠ PROPUESTA COMERCIAL` sticky warning banner
- Legacy vs New comparison (red ✗ / green ✓ bullets)
- 4 impact stats cards (response time, conversion rate, hosting cost, uptime)
- 6-department automation grid (Logística, Depósito, Administración, RRHH, Gerencia, Contabilidad)
- CTA → `https://mgobeaalcoba.github.io/consulting.html`
- Signature: "Creado por Mariano Gobea Alcoba como propuesta comercial. Todos los derechos reservados."

## Pricing reference

See `tasks/PRICING_ELPORTUGUES.md`. Quick reference:
- Site only: USD 1.500–3.500
- Site + 2 automations: USD 2.000–5.000
- Full suite (site + 6 departments): USD 8.000–18.000
- Monthly maintenance: USD 200–600

## Additional reference

- Full agnostic SPEC template: `tasks/SPEC_TEMPLATE.md`
- Pricing benchmark: `tasks/PRICING_ELPORTUGUES.md`
- Real implementation example: `elportugues/` directory
