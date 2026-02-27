# MGA Tech Consulting — Presencia Digital Integral

Monorepo que contiene la presencia digital completa de **Mariano Gobea Alcoba** y **MGA Tech Consulting**: sitio principal de consultoría + portfolio personal, blog técnico, herramientas financieras y los sitios web de dos clientes de la consultora.

🌐 **Dominio principal:** [www.mgatc.com](https://www.mgatc.com)  
🔀 **Redirect legacy:** [mgobeaalcoba.github.io](https://mgobeaalcoba.github.io) → `www.mgatc.com`  
📧 **Contacto profesional:** [mariano@mgatc.com](mailto:mariano@mgatc.com)

---

## Sitios incluidos en el monorepo

| Sitio | Directorio | URL producción | Descripción |
|---|---|---|---|
| MGA Tech Consulting + Portfolio | `cv/` | `www.mgatc.com` | Sitio principal — consultoría + CV interactivo |
| Neil Climatizadores | `neil/` | `www.mgatc.com/neil-site/` | Cliente: climatización vehicular |
| El Portugués S.A. | `elportugues/` | `www.mgatc.com/elportugues-site/` | Cliente: logística y distribución |

---

## Estructura del sitio principal (`cv/`)

### `/` — MGA Tech Consulting (home)

Página institucional de **MGA Tech Consulting**, la consultora orientada a PyMEs que quieren automatizar procesos, implementar BI o adoptar IA sin un equipo técnico propio.

**Contenido:**
- **Hero con efecto parallax** — cohete animado con trail de fuego scroll-driven, fondo adaptativo a los tres temas (dark/light/terminal), typing animation de servicios
- **Propuesta de valor** — "El Cambio de Paradigma": desarrollo ágil con ROI medible
- **Servicios** — Automatización de Procesos (n8n, Zapier, webhooks), Business Intelligence & Analytics, Transformación Digital con IA (RAG, agentes, fine-tuning), Mentorías Tech, Cursos para Equipos, Reclutamiento Tech
- **Proceso de trabajo** — metodología en 4 pasos: diagnóstico → diseño → implementación → transferencia
- **Portfolio de clientes** — Neil Climatizadores y El Portugués S.A.
- **Casos de éxito** — resultados concretos de proyectos
- **Formulario "Automatización Gratis"** — webhook a n8n, respuesta en < 24 hs
- **Testimonios** — opiniones de clientes
- **Calendly** — agendar reunión directamente desde la página

> ⚠️ `/consulting/` y `/consulting.html` redirigen a `/` (el home es la consultora desde Feb 2026)

---

### `/portfolio/` — CV Interactivo

Portfolio personal de Mariano con animación de intro y CV completo.

**Contenido:**
- **Hero** — nombre, cargo (Data & Analytics Technical Leader · MercadoLibre), acceso a consultoría y descarga de CV en PDF
- **Sobre mí** — resumen profesional con +6 años en MercadoLibre liderando equipos de datos e IA
- **Experiencia profesional** — 14+ posiciones con tags de tecnologías, modales de detalle
- **Proyectos destacados** — repos de GitHub filtrables por tecnología (n8n, Python, AI, etc.)
- **Stack tecnológico** — Fullstack & Data, ML, AI & Automation, Cloud & DevOps, BI, Developer Tools
- **Educación** — desde Bachiller (2003) hasta Posgrado en Ing. de Software en UAI (en curso)
- **Dashboard económico** — comparador de inversiones en Argentina a 12 meses (tiempo real)
- **Newsletter "The Data Digest"** — suscripción semanal sobre Data, Analytics y Finanzas

---

### `/blog/` — "Data Engineering en las Trincheras"

Blog técnico sobre ingeniería de datos, Python, IA y automatización.

**Contenido:**
- Posts en Markdown con syntax highlighting, tablas y tipografía optimizada
- Videos (masterclasses y grabaciones de clases)
- Filtro visual entre videos y posts escritos
- Posts generados automáticamente vía n8n + OpenRouter desde trending topics de Hacker News
- **23+ artículos** sobre: BigQuery, dbt, Airflow, embeddings, Docker, automatización de impuestos, optimización de queries en MercadoLibre, y más

---

### `/recursos/` — Herramientas Financieras

Herramientas gratuitas para el contexto económico argentino.

**Contenido:**
- **Calculadora de Ganancias** — Art. 94 LIG, escala completa, deducciones del Art. 30, valores AFIP 2026, gráfico de torta, escenarios precargados
- **Cotizaciones del dólar** — oficial, blue, MEP, CCL, cripto, tarjeta — en tiempo real con histórico interactivo
- **Indicadores económicos** — inflación, plazo fijo, riesgo país con histórico

---

### Funcionalidades transversales

- **3 temas** — `dark` (default), `light`, `terminal` (CLI con comandos navegables)
- **Modo terminal** — comandos: `about`, `experience`, `education`, `projects`, `neofetch`, `matrix`, `help`, etc.
- **Bilingüe** — todo el contenido en ES / EN, switcheable desde el navbar
- **SEO** — sitemap dinámico (`/sitemap.xml`), robots.txt, llms.txt, JSON-LD Schema.org
- **Analytics** — GA4 con key events (`cv_download`, `sign_up`, `generate_lead`, `calendly_click`), cross-domain tracking

---

## Sitios de clientes

### Neil Climatizadores — `neil/`

Sitio institucional para empresa de climatización vehicular con patente exclusiva (AR-031005B1).

- **Disponible en 6 idiomas** — ES, EN, IT, FR, PT, DE
- Showcase de productos (climatizadores, AA, calderas, energía solar)
- Sistema de Pre-Enfriado patentado
- Presencia internacional — representantes en Europa
- Formulario de contacto/cotización conectado a n8n
- `basePath: '/neil-site'`

### El Portugués S.A. — `elportugues/`

Sitio institucional para empresa de logística y distribución con 80+ años de historia.

- Servicios: transporte, distribución AMBA/interior, almacenamiento 8.200 m²
- Certificación ISO 9001:2015
- Historia de 4 generaciones (desde 1927)
- Formulario de contacto/cotización conectado a n8n
- Propuesta comercial de automatización interna (sección temporal)
- `basePath: '/elportugues-site'`

> **Redirect automático:** `mgobeaalcoba.github.io/neil-site/*` → `www.mgatc.com/neil-site/*`  
> `mgobeaalcoba.github.io/elportugues-site/*` → `www.mgatc.com/elportugues-site/*`

---

## Arquitectura técnica

### Frontend — Stack

| Tecnología | Uso |
|---|---|
| **Next.js 14** (App Router, static export) | Framework principal para los 3 sitios |
| **TypeScript** | Lenguaje en todo el codebase |
| **Tailwind CSS** + `@tailwindcss/typography` | Estilos |
| **Framer Motion** | Animaciones (parallax, scroll-driven, intro) |
| **Lucide React** | Iconografía |
| **remark** + `remark-html` + `remark-gfm` | Procesado de Markdown para el blog |
| **@supabase/supabase-js** | Cliente de base de datos |

### Hosting & Deploy

| Capa | Tecnología | URL |
|---|---|---|
| **Hosting principal** | Cloudflare Pages | `www.mgatc.com` |
| **Dominio** | Cloudflare Registrar | `mgatc.com` |
| **DNS** | Cloudflare DNS | MX, CNAME, TXT, DMARC |
| **Redirect legacy** | GitHub Pages (gh-pages branch) | `mgobeaalcoba.github.io` |
| **CI/CD** | GitHub Actions | Push a `main` → rebuild + redeploy |
| **Email** | Cloudflare Email Routing + Brevo SMTP | `mariano@mgatc.com` |

### Build

El repo usa **builds en paralelo** para los 3 sitios vía GitHub Actions, con un paso final de ensamblado:

```
build-cv ─┐
build-neil ─┤→ deploy (merge outputs → gh-pages + Cloudflare)
build-elportugues ─┘
```

**Para Cloudflare Pages** se usa el script `build-cloudflare.sh` en el root:
```bash
bash build-cloudflare.sh   # Build command en Cloudflare Pages
# Output directory: _site
```

El script buildea los 3 sitios y ensambla:
```
_site/                     ← CV (root)
_site/neil-site/           ← Neil
_site/elportugues-site/    ← El Portugués
```

### Base de datos — Supabase (PostgreSQL)

Todo el contenido dinámico del CV vive en Supabase. Actualizar contenido = un SQL, sin tocar código.

| Tabla | Descripción |
|---|---|
| `experience` + `experience_tags` | 14+ posiciones profesionales con tags de tecnologías |
| `projects` + `project_tags` | Proyectos de GitHub con filtrado |
| `education` + `education_tags` | Títulos y formaciones |
| `certifications` + `certification_tags` | 109+ certificaciones |
| `blog_posts` | Metadata de posts del blog (slug, date, title, canonical_url) |
| `consulting_packs` + features + automations | Packs de consultoría |
| `consulting_case_studies` + tags | Casos de éxito |

**Archivos locales** (no en Supabase):

| Archivo | Contenido |
|---|---|
| `cv/src/data/content.json` | Meta (nombre, email, redes), about, techStack, processSteps |
| `cv/src/data/videos.json` | Lista de videos de YouTube |
| `cv/content/posts/*.md` | Contenido de los posts en Markdown |

### Analytics & Tracking

- **Google Analytics 4** — property `G-DG0SLT5RY3`, compartida entre los 3 sitios
- **Cross-domain tracking** — `mgatc.com`, `mgobeaalcoba.github.io`, `mgatc.pages.dev`
- **Google Search Console** — `www.mgatc.com` verificado por DNS TXT
- **Cloudflare Web Analytics** — segunda fuente sin cookies, inmune a ad-blockers
- **Key events configurados** — `cv_download`, `sign_up`, `generate_lead`, `calendly_click`
- **GA4 inline en `<head>`** — carga sincrónica para mejor tag quality score

### Automatizaciones — n8n

5 workflows productivos documentados en `docs/automations/`:

| # | Workflow | Trigger | Descripción |
|---|---|---|---|
| 01 | AI Blog Creator | Schedule (semanal) | Toma trending topics de Hacker News, genera artículo con OpenRouter (Claude/GPT), publica en dev.to, guarda en GitHub (`cv/content/posts/`) y registra en Supabase |
| 02 | Webhook Contact Form | Webhook | Recibe formularios de contacto de neil-site y elportugues-site, envía notificación por email |
| 03 | Newsletter Subscription | Webhook | Captura suscripciones a "The Data Digest", registra en Google Sheets, envía email de bienvenida |
| 04 | Free Automation Lead | Webhook | Recibe leads del form "Automatización Gratis" de la consultora, notifica y agenda seguimiento |
| 05 | Daily Content Digest | Schedule (diario) | Genera resumen de noticias tech, lo envía por email |

**Credenciales usadas por n8n:**
- OpenRouter API (modelos LLM)
- GitHub OAuth2 (commits de posts)
- Brevo SMTP (emails)
- Supabase API (registro de posts)
- Google Sheets OAuth2

### SEO & Discoverabilidad

| Archivo | URL | Descripción |
|---|---|---|
| `cv/src/app/sitemap.ts` | `/sitemap.xml` | Sitemap dinámico (rutas estáticas + posts del blog) |
| `cv/public/robots.txt` | `/robots.txt` | Directivas para crawlers, `Allow` especial para LLMs |
| `cv/public/llms.txt` | `/llms.txt` | Descripción del sitio para agentes de IA |
| JSON-LD en layouts | (embebido) | Schema.org: Person, WebSite, Service |
| Canonical URLs | (embebido) | Apuntan todas a `https://www.mgatc.com` |

### Redirect Strategy

```
mgobeaalcoba.github.io/           → www.mgatc.com/portfolio/
mgobeaalcoba.github.io/consulting → www.mgatc.com/
mgobeaalcoba.github.io/neil-site/ → www.mgatc.com/neil-site/
mgobeaalcoba.github.io/elportugues-site/ → www.mgatc.com/elportugues-site/

www.mgatc.com/consulting          → www.mgatc.com/   (Cloudflare _redirects, 301)
www.mgatc.com/consulting/         → www.mgatc.com/   (Cloudflare _redirects, 301)
```

Mecanismos:
- **JS inline en `<head>`** de cada layout (dispara antes que GA4, preserva path+hash+query)
- **`cv/public/_redirects`** — Cloudflare Pages CDN-level 301s

---

## Variables de entorno

```bash
# cv/.env.local  (desarrollo local — nunca commitear)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# neil/.env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_N8N_CONTACT_WEBHOOK=...
NEXT_PUBLIC_N8N_QUOTE_WEBHOOK=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DG0SLT5RY3

# elportugues/.env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_N8N_CONTACT_WEBHOOK=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DG0SLT5RY3
```

En producción (Cloudflare Pages y GitHub Actions): configuradas como secrets/env vars en cada plataforma.

---

## Desarrollo local

```bash
# Instalar dependencias de cada sitio
cd cv && npm install
cd neil && npm install
cd elportugues && npm install

# Levantar dev server del sitio principal
cd cv && npm run dev   # → http://localhost:3000

# Build completo (todos los sitios)
bash build-cloudflare.sh
```

---

## Migraciones de base de datos

Las migraciones de Supabase están en `db/migrations/`. Cada archivo es un SQL numerado:

```
db/migrations/
├── 001_initial_schema.sql
├── 002_...
├── ...
└── 007_add_new_tags.sql    ← última migración
```

Correr directamente en el SQL Editor de Supabase. Un push que incluya cambios en `db/migrations/**` triggerará automáticamente un redeploy del sitio.

---

## Documentación adicional

| Documento | Ubicación | Contenido |
|---|---|---|
| Automations README | `docs/automations/README.md` | Descripción detallada de los 5 workflows de n8n |
| Automations JSONs | `docs/automations/*.json` | Exports sanitizados de cada workflow (sin API keys) |
| SEO & Tracking | `tasks/seo-tracking-strategy.md` | Estrategia SEO completa, implementada y pendiente |
| DB Migrations | `db/migrations/` | Historial de cambios en el schema de Supabase |

---

## Autor

**Mariano Gobea Alcoba**  
Data & Analytics Technical Leader · MercadoLibre  
Fundador · MGA Tech Consulting  
Buenos Aires, Argentina

[www.mgatc.com](https://www.mgatc.com) · [LinkedIn](https://www.linkedin.com/in/mariano-gobea-alcoba/) · [GitHub](https://github.com/Mgobeaalcoba) · [mariano@mgatc.com](mailto:mariano@mgatc.com)
