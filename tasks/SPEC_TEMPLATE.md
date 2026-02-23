# Project SPEC: {{CLIENT_NAME}} — Premium Static Migration

<!--
INSTRUCTIONS FOR USE
────────────────────
Reemplazá cada {{VARIABLE}} con los datos reales del cliente.
Las secciones marcadas con [OPCIONAL] pueden eliminarse si no aplican.
Completá el BRIEF con el cliente antes de empezar cualquier implementación.
-->

---

## 0. BRIEF DE RELEVAMIENTO (completar con el cliente)

| Campo | Valor |
|---|---|
| **Nombre legal** | {{CLIENT_LEGAL_NAME}} |
| **Rubro / industria** | {{CLIENT_INDUSTRY}} |
| **Sitio legacy** | {{CLIENT_LEGACY_URL}} |
| **URL destino** | `mgobeaalcoba.github.io/{{CLIENT_SLUG}}.html` |
| **Inspiración visual** | {{DESIGN_REFERENCE_URL}} |
| **Fecha de entrega MVP** | {{DELIVERY_DATE}} |
| **Contacto cliente** | {{CLIENT_CONTACT}} |
| **Departamentos con automation** | {{DEPARTMENTS_LIST}} |
| **GA4 Property ID** | {{GA4_MEASUREMENT_ID}} |
| **n8n instancia** | {{N8N_BASE_URL}} |

---

## 1. Contexto & Objetivo

- **Cliente:** {{CLIENT_NAME}} ({{CLIENT_INDUSTRY}}).
- **Meta:** MVP de alto impacto visual alojado en GitHub Pages, presentable como venta cerrada.
- **Inspiración visual:** {{DESIGN_REFERENCE_URL}}. Estética "Deep Dark", moderna y tecnológica.
- **URL destino:** `mgobeaalcoba.github.io/{{CLIENT_SLUG}}.html`
- **Problema que resuelve:** {{CLIENT_PAIN_POINT}}

---

## 2. Tech Stack (Static-Only)

- **Framework:** Next.js 14+ (App Router), `output: 'export'`, `trailingSlash: true`
- **Styling:** Tailwind CSS v3 (Dark Theme)
- **Animations:** Framer Motion (scroll animations, fade-ins, hover transitions)
- **Data Source:** `src/data/content.json` — toda la información del sitio reside aquí
- **Types:** `src/types/content.ts` — interfaces TypeScript para cada sección del JSON
- **Icons:** Lucide React
- **Hosting:** GitHub Pages (costo $0, disponibilidad 100%)
- **basePath:** `/{{CLIENT_SLUG}}-site`

### Estructura de carpetas obligatoria

```
{{CLIENT_SLUG}}/              ← proyecto Next.js (dev)
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← GA4 + metadata + favicon
│   │   ├── page.tsx          ← composición de secciones
│   │   └── globals.css       ← tokens + animaciones CSS
│   ├── components/           ← un archivo por sección
│   ├── data/
│   │   └── content.json      ← ÚNICA fuente de verdad del contenido
│   ├── types/
│   │   └── content.ts        ← interfaces TypeScript exportables
│   ├── services/
│   │   ├── contentService.ts ← Repository pattern sobre content.json
│   │   └── webhookService.ts ← fetch a n8n
│   └── lib/
│       └── gtag.ts           ← plan de medición GA4
├── public/
│   ├── favicon.png           ← favicon circular (procesado con Pillow)
│   └── logo.png              ← logo blanco del cliente (para dark bg)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                ← NO commitear
└── .gitignore

{{CLIENT_SLUG}}-site/         ← output estático (sí commitear)
{{CLIENT_SLUG}}.html          ← redirect a /{{CLIENT_SLUG}}-site/
```

---

## 3. Paleta de Colores y Design Tokens

Adaptar a la identidad del cliente. Defaults del template:

```
Fondos:     #000000 (negro puro) / #0B1120 (dark navy)
Acento 1:   #0CC1C1 (cyan/teal)       ← color interactivo principal
Acento 2:   #2D4F8F (royal blue)      ← gradientes y fondos secundarios
Texto base: #FFFFFF
Texto sec:  #94A3B8 (slate-400)
```

**Personalización por cliente:**
- Acento 1: `{{CLIENT_PRIMARY_COLOR}}` (extraer del logo/brand guidelines)
- Acento 2: `{{CLIENT_SECONDARY_COLOR}}`

### Componentes de diseño obligatorios

- Hero con tipografía gigante (`text-7xl/8xl font-black`) y gradiente de texto
- Glassmorphism: `backdrop-blur-12px` + `bg-white/5` + border `rgba(accent, 0.15)`
- Glow effect en cards: `box-shadow: 0 0 20px rgba(accent, 0.1)`
- Grid decorativo de fondo: líneas `rgba(accent, 0.05)` cada 60–80px
- Scroll animations con `useInView` de Framer Motion (`once: true, margin: -100px`)

---

## 4. Secciones del Sitio

Implementar en este orden (ajustar según el cliente):

| # | Componente | ID de sección | Contenido clave |
|---|---|---|---|
| 1 | `Navbar.tsx` | — | Logo, links, CTA "Cotizar" |
| 2 | `Hero.tsx` | `#inicio` | Headline, stats, slideshow de imágenes reales, CTAs |
| 3 | `About.tsx` | `#nosotros` | Historia, descripción, pilares del negocio |
| 4 | `Services.tsx` | `#servicios` | Categorías de servicios con cards + hover |
| 5 | `History.tsx` | `#historia` | Timeline + galería de fotos reales |
| 6 | `Quality.tsx` | — | Certificaciones, política de calidad |
| 7 | `Values.tsx` | — | Valores organizacionales |
| 8 | `Contact.tsx` | `#contacto` | Formulario → webhook n8n + datos de contacto |
| 9 | `SalesProposal.tsx` | `#propuesta` | Sección temporal de pitch comercial |
| 10 | `Footer.tsx` | — | Logo, links, copyright |
| — | `AutomationBadge.tsx` | — | Badge ⚡ en formularios con modal de automation |
| — | `ProposalCTA.tsx` | — | Botón flotante animado → scroll a #propuesta |
| — | `ScrollTracker.tsx` | — | GA4: scroll depth + section view vía IntersectionObserver |

---

## 5. Migración de Contenidos (Scraping Task)

### 5.1 Extracción de datos del sitio legacy

El agente debe ejecutar, en este orden:

1. **Fetch del HTML** con `curl -L -A "Mozilla/5.0..."` para evitar bloqueos
2. **WP Media API** (si es WordPress): `{{CLIENT_LEGACY_URL}}/wp-json/wp/v2/media?per_page=50`
3. **Subpáginas clave**: `/servicios/`, `/nosotros/`, `/contacto/`, `/historia/`

Datos a extraer:
- Textos: historia, fundación, servicios, certificaciones, valores, datos de contacto
- Imágenes: URLs originales de logos (header y footer/white version), fotos de operaciones, galería
- Metadata: dirección, teléfonos, emails, redes sociales, horarios

**Regla crítica: NO usar placeholders. Toda imagen debe ser una URL real o un archivo descargado en `public/`.**

### 5.2 Estructura obligatoria de content.json

```jsonc
{
  "meta": { "siteName", "siteUrl", "description", "keywords", "language" },
  "brand": { "name", "legalName", "tagline", "founded", "yearsOfExperience",
              "logo", "logoFooter", "primaryColor", "accentColor" },
  "hero": { "headline", "headlineHighlight", "subheadline", "cta", "stats", "backgroundImages" },
  "about": { "sectionLabel", "title", "description", "image", "pillars" },
  "services": { "categories", "coverage" },
  "history": { "founder", "timeline", "galleryImages" },
  "quality": { "certImages", "commitments" },
  "values": { "items" },
  "contact": { "location", "emails", "phones", "formTypes", "formFields" },
  "footer": { "copyright", "links" },
  "automations": { "contactLead": {...}, "quoteRequest": {...} },
  "salesProposal": { "comparison", "impactItems", "departments", "consultingUrl", "signature" }
}
```

### 5.3 Logo y Favicon

```bash
# Detectar logo blanco (para dark backgrounds)
curl -s {{CLIENT_LEGACY_URL}} | grep -oE 'https?://[^ ]*logo[^ ]*(png|svg)'

# Generar favicon circular con Pillow
python3 -c "
from PIL import Image, ImageDraw
img = Image.open('source.png').convert('RGBA').resize((512,512), Image.LANCZOS)
mask = Image.new('L', (512,512), 0)
ImageDraw.Draw(mask).ellipse((0,0,512,512), fill=255)
result = Image.new('RGBA', (512,512), (0,0,0,0))
result.paste(img, mask=mask)
result.save('public/favicon.png')
"
```

---

## 6. Automatización & Analytics

### 6.1 Webhooks n8n

Archivo: `src/services/webhookService.ts`

```
NEXT_PUBLIC_N8N_CONTACT_WEBHOOK=https://{{N8N_BASE_URL}}/webhook/{{CLIENT_SLUG}}-contact
NEXT_PUBLIC_N8N_QUOTE_WEBHOOK=https://{{N8N_BASE_URL}}/webhook/{{CLIENT_SLUG}}-quote
```

Cada formulario debe tener un `<AutomationBadge>` que explique:
- Flujo paso a paso de la automation
- Tech stack (n8n, Gmail API, WhatsApp Business, CRM, etc.)
- Ventajas de negocio cuantificadas

### 6.2 Plan de medición GA4

Archivo: `src/lib/gtag.ts`

Property ID: `{{GA4_MEASUREMENT_ID}}` (mismo que el dominio principal si aplica)

Custom dimensions obligatorias:
- `site_section`: `"{{CLIENT_SLUG}}"` — permite filtrar en GA4 por cliente
- `client_name`: `"{{CLIENT_NAME}}"`

Eventos mínimos:
```
page_view          → automático
scroll_depth       → 25 / 50 / 75 / 90 / 100%
section_view       → IntersectionObserver por sección
service_view       → hover sobre card
proposal_view      → cuando #propuesta entra al viewport
lead_form_sent     → submit exitoso + generate_lead
quote_requested    → cotización enviada
proposal_cta_click → botón flotante
consulting_click   → link al portfolio
```

### 6.3 Catálogo de automations por departamento

Incluir en `content.json > salesProposal > departments` al menos:

| Departamento | Automations mínimas a proponer |
|---|---|
| {{DEPT_1}} | Tracking, alertas, reportes automáticos |
| {{DEPT_2}} | Control de inventario, notificaciones |
| Administración | Facturación, conciliación, seguimiento de pagos |
| RRHH | Onboarding, vencimiento de documentos |
| Gerencia | Dashboard KPIs, informes semanales |
| Contabilidad | Liquidaciones, obligaciones fiscales |

---

## 7. Sección Sales Proposal (temporal)

Siempre incluir como última sección antes del footer, marcada con banner de advertencia:

```
⚠ PROPUESTA COMERCIAL — Esta sección es temporal y no será visible al cliente final
```

Contenido obligatorio:
1. Comparativa legacy vs propuesta nueva (bullets con X rojo y ✓ verde)
2. Métricas de impacto (−80% tiempo de respuesta, ×3 conversión, $0 hosting, etc.)
3. Grid de automations por departamento
4. CTA → `https://mgobeaalcoba.github.io/consulting.html`
5. Firma: "Creado por Mariano Gobea Alcoba como propuesta comercial. Todos los derechos reservados."

---

## 8. Deploy & Compatibilidad GitHub Pages

### Checklist pre-push

- [ ] `basePath` en `next.config.js` = `/{{CLIENT_SLUG}}-site`
- [ ] Verificar que `index.html` del output referencie `/{{CLIENT_SLUG}}-site/_next/...`
- [ ] `{{CLIENT_SLUG}}.html` en raíz del repo con `<meta http-equiv="refresh" content="0; url=/{{CLIENT_SLUG}}-site/">`
- [ ] `{{CLIENT_SLUG}}/.gitignore` excluye `node_modules/`, `.next/`, `out/`, `.env.local`
- [ ] GA ID hardcodeado como fallback en `layout.tsx` (no depender solo de `.env.local`)
- [ ] Favicon circular en `src/app/icon.png` y `public/favicon.png`

### Comandos de build y deploy

```bash
cd {{CLIENT_SLUG}}
npm run build                              # genera out/
rm -rf ../{{CLIENT_SLUG}}-site
cp -r out ../{{CLIENT_SLUG}}-site
cp public/logo.png ../{{CLIENT_SLUG}}-site/logo.png
cp public/favicon.png ../{{CLIENT_SLUG}}-site/favicon.png

# Verificar asset paths
python3 -c "
import re
with open('../{{CLIENT_SLUG}}-site/index.html') as f: html = f.read()
print(re.findall(r'src=\"(/[^\"]+\.js)\"', html)[:2])
"

# Push
cd ..
git add {{CLIENT_SLUG}}-site/ {{CLIENT_SLUG}}/ {{CLIENT_SLUG}}.html
git commit -m 'feat: Add {{CLIENT_NAME}} landing page MVP'
git push origin main
```

---

## 9. Reglas de Oro para el Agente

1. **Autonomía total:** scraping, estructuración JSON, diseño UI y build sin preguntar al usuario salvo que falte una credencial crítica.
2. **Clean Code:** lógica separada de presentación. Todo acceso al JSON pasa por `ContentRepository` en `contentService.ts`.
3. **Asset integrity:** las fotos del cliente son identidad de la empresa. Nunca usar imágenes de stock genéricas.
4. **Build antes de declarar done:** el build debe pasar con `exit_code: 0` antes de marcar cualquier tarea como completa.
5. **Verificación de paths:** siempre confirmar que `basePath` en `next.config.js` coincide con la carpeta de output servida en GitHub Pages.
6. **Sin `.env.local` en git:** el GA ID debe estar hardcodeado como fallback en `layout.tsx`.
7. **Propuesta comercial siempre:** la sección `SalesProposal` y el botón `ProposalCTA` son obligatorios en cada entrega.

---

## 10. Pricing Reference

Ver `tasks/PRICING_ELPORTUGUES.md` para benchmark. Regla rápida:

| Entregable | Piso USD | Techo USD |
|---|---|---|
| Sitio MVP solo | 1.500 | 3.500 |
| Sitio + 2 automations | 2.000 | 5.000 |
| Suite completa (sitio + 6 depts) | 8.000 | 18.000 |
| Mantenimiento mensual | 200 | 600 |
