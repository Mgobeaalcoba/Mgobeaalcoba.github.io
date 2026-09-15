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
- `npm run build` ejecuta `prebuild` (sincroniza datos hipotecarios) y `postbuild` (declara `lang="en"` en el HTML exportado de `/en/...`)

## Idiomas

Las rutas `/en/servicios/...` son la versión en inglés de los servicios a demanda: su HTML estático, metadata, JSON-LD y `hreflang` son ingleses, así que se indexan por separado. El idioma de la URL manda sobre la preferencia guardada. El resto del sitio sigue con el toggle de idioma en runtime (`LanguageContext`), sin rutas por idioma.

Ver `AGENTS.md` para invariantes locales y `../../docs/architecture/system.md` para el flujo de deploy.
