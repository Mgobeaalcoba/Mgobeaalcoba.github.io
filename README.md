# Mgobeaalcoba.github.io — Multi-Site Portfolio

> Repositorio principal de presencia digital de **Mariano Gobea Alcoba** y proyectos de clientes de **MGA Tech Consulting**.  
> Stack: **Next.js 14+ · TypeScript · Tailwind CSS · Framer Motion**

---

## Arquitectura del Repositorio

```
/                               ← Build estático del portfolio (Next.js)
├── index.html                  ← Portfolio personal (/)
├── consulting/                 ← Consultoría tecnológica (/consulting)
├── blog/                       ← Blog técnico (/blog) + fuentes markdown
│   ├── blog-index.json         ← Índice de posts
│   ├── videos.json             ← Videos del blog
│   └── posts/                  ← Markdown de cada post
├── recursos/                   ← Recursos financieros (/recursos)
├── resources/                  ← Redirect → /recursos/
├── _next/                      ← Chunks JS/CSS del portfolio
├── images/                     ← Imágenes servidas del portfolio
├── videos/                     ← Videos servidos del portfolio
│
├── neil-site/                  ← Build estático: Neil Climatizadores
├── elportugues-site/           ← Build estático: El Portugués S.A.
│
├── cv/                         ← Fuente Next.js del portfolio
│   ├── src/                    ← Código fuente (app, components, lib, data)
│   └── public/                 ← Assets estáticos
│       ├── images/             ← Imágenes del portfolio
│       ├── videos/             ← Videos del portfolio
│       └── favicon.png         ← Favicon circular (generado desde assets/images/logo.png)
│
├── neil/                       ← Fuente Next.js de Neil Climatizadores
├── elportugues/                ← Fuente Next.js de El Portugués S.A.
│
├── assets/                     ← Assets fuente originales
│   ├── images/                 ← Imágenes fuente originales (logos, profile, etc.)
│   └── videos/                 ← Videos fuente originales
│
├── scripts/                    ← Scripts utilitarios
│   └── gen-favicon.mjs         ← Generador de favicon circular
│
├── tasks/                      ← Documentación interna / planes de trabajo
│   └── docs/                   ← PDFs y documentos de referencia
│
├── private/                    ← Archivos privados (no publicar)
│
├── neil.html                   ← Redirect → /neil-site/
└── elportugues.html            ← Redirect → /elportugues-site/
```

---

## URLs del Portfolio Principal

| URL | Contenido |
|-----|-----------|
| `/` | Portfolio personal de Mariano Gobea Alcoba |
| `/consulting/` | Consultoría tecnológica MGA Tech |
| `/blog/` | Blog: "Data Engineering en las Trincheras" |
| `/recursos/` | Calculadoras financieras, cotizaciones, indicadores |
| `/resources/` | Redirect → `/recursos/` |

## URLs de Sitios de Clientes

| URL | Cliente |
|-----|---------|
| `/neil-site/` | Neil Climatizadores |
| `/elportugues-site/` | El Portugués S.A. |

---

## Scripts raíz (`package.json`)

| Comando | Acción |
|---------|--------|
| `npm run dev` | Dev server del portfolio (localhost:3000) |
| `npm run dev:neil` | Dev server de Neil (localhost:3001) |
| `npm run dev:elportugues` | Dev server de El Portugués |
| `npm run build` | Build del portfolio |
| `npm run build:neil` | Build de Neil |
| `npm run build:elportugues` | Build de El Portugués |
| `npm run deploy` | Build + sync completo del portfolio al root |
| `npm run deploy:neil` | Build + sync de Neil → `/neil-site/` |
| `npm run deploy:elportugues` | Build + sync de El Portugués → `/elportugues-site/` |

### Deploy manual del portfolio (equivalente a `npm run deploy`)

```bash
cd cv && npm run build

# Assets estáticos + root HTML
rsync -a --exclude='_next' --exclude='consulting' --exclude='recursos' --exclude='blog' cv/out/ ./

# Bundles JS/CSS
rsync -a --delete cv/out/_next/ ./_next/

# Páginas
rsync -a --delete cv/out/consulting/ ./consulting/
rsync -a --delete cv/out/recursos/ ./recursos/

# Blog (sin --delete para preservar .json/.md fuentes)
rsync -a cv/out/blog/ ./blog/
```

### Regenerar favicon

```bash
node scripts/gen-favicon.mjs
# Luego rebuild + deploy
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14+ (App Router, Static Export) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + @tailwindcss/typography |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Markdown | remark + remark-html + remark-gfm |
| Analytics | Google Analytics 4 (G-DG0SLT5RY3) |
| Automatización | n8n webhook |
| Hosting | GitHub Pages |

---

## Autor

**Mariano Gobea Alcoba** — Data & Analytics Technical Leader en MercadoLibre  
[mgobeaalcoba.github.io](https://mgobeaalcoba.github.io) · [LinkedIn](https://www.linkedin.com/in/mariano-gobea-alcoba/) · [GitHub](https://github.com/Mgobeaalcoba)
