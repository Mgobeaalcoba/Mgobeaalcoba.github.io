# MGA web

Sitio principal de MGA Tech Consulting: consulting, portfolio, blog y herramientas. Es un export estático de Next.js publicado en el dominio root.

Ejecutar siempre desde el root del repositorio:

```bash
npm run dev
npm run build
```

- Rutas y UI: `src/`
- Artículos: `content/posts/`
- Assets desplegados en el root: `public/`
- Configuración local: copiar `.env.example` a `.env.local`
- `npm run build` ejecuta `prebuild` (sincroniza datos hipotecarios, PyPI e INDEC) y `postbuild` (declara `lang="en"` en el HTML exportado de `/en/...`)

## Identidad MGA Studio

La portada presenta agentes de IA, automatizaciones, software y datos con una identidad editorial sobre la paleta Signal. `src/app/studio.css` define la capa visual, `src/lib/studioContent.ts` concentra capacidades, método y FAQ, y la navegación compartida agrupa blog, herramientas, AgentHub y catálogo bajo Explorar. El menú superior reemplaza la barra móvil inferior.

Los ejemplos de flujos son ilustrativos y no ejecutan integraciones. Los precios y pagos siguen en `/servicios/`. Para regenerar íconos, portada social e imagen optimizada de Neil: `node scripts/generate-studio-assets.mjs` desde el root. Ver [benchmark](../../docs/product/reports/Rebranding%20de%20consultor%C3%ADa%20MGA.md) y [decisión de diseño](../../docs/decisions/0004-studio-rebrand.md).

## Argentina en datos

Tres páginas independientes enlazadas desde Recursos: `/recursos/poder-adquisitivo/`, `/recursos/actividad-argentina/` y `/recursos/comercio-exterior/`. Comparten estilos Signal y componentes Chart.js, con filtros, tablas, CSV e informes que se recalculan en el navegador.

Los snapshots oficiales viven en `public/data/indec/`. Para actualizarlos, configurar `INDEC_API_TOKEN` en `.env.local` y ejecutar `node scripts/sync-indec-data.mjs --force` desde el root. En GitHub Actions, usar el secreto de repositorio del mismo nombre. El token se usa sólo en la sincronización; no se envía al navegador. Sin token o ante un error de la fuente, se conserva el snapshot disponible. Detalle de cobertura, fórmulas y mantenimiento en [el runbook](../../docs/runbooks/indec-dashboards.md).

## Idiomas

El locale por defecto (es) usa las rutas sin prefijo; el inglés vive bajo `/en/`:

- `/` y `/en/` — landing de consultoría
- `/servicios/`, `/servicios/[slug]/`, `/servicios/gracias/` y sus pares bajo `/en/...`

Las páginas localizadas son documentos reales: copia, `metadata`, JSON-LD, canonical y `hreflang` se resuelven en build, así que se indexan por separado. El idioma de la URL manda sobre la preferencia guardada (que igual se persiste para el resto del sitio).

Piezas del mecanismo:

- `src/lib/i18n-routes.ts` — registro de rutas con par en inglés (`LOCALIZED_ROUTE_PATTERNS`); es el único lugar donde se da de alta una ruta.
- `src/lib/localizedMetadata.ts` — canonical, `hreflang` y OpenGraph a partir del path sin locale.
- `src/lib/site.ts` — origen canónico único.
- `src/app/en/layout.tsx` — fuerza el idioma de la ruta.
- `scripts/localize-export.mjs` — `postbuild` que declara `lang="en"` en el HTML exportado.

Para agregar una página localizada: sumar el patrón al registro, crear `app/en/<ruta>/page.tsx` con `buildLocalizedMetadata`, reusar el client component y agregar el par al `sitemap.ts`. Detalle y consecuencias en `../../docs/decisions/0003-localized-routes.md`.

Quedan sin ruta en inglés, a propósito: los artículos del blog (el markdown es sólo español), las herramientas financieras argentinas y la política de privacidad.

## Analítica

Tres capas en `src/`:

- `lib/gtag.ts` — catálogo de eventos semánticos y contexto común de la propiedad GA4.
- `components/shared/InteractionTracker.tsx` — capa genérica delegada: mide cualquier elemento interactivo. Los ids legibles salen de `data-analytics`, `data-analytics-kind`, `data-analytics-surface` e `data-analytics-index`.
- `components/shared/PerformanceTracker.tsx` — Web Vitals, long tasks, visibilidad, red y errores.

Antes de sumar un evento nuevo, revisar el diccionario y el contrato en [docs/runbooks/analytics.md](../../docs/runbooks/analytics.md): evita duplicar lo que la capa genérica ya cubre y respeta el presupuesto de dimensiones de GA4.

Ver `AGENTS.md` para invariantes locales y `../../docs/architecture/system.md` para el flujo de deploy.
