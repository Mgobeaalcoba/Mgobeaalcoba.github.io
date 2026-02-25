# Automations — Documentación

Este directorio documenta los workflows de n8n que corren en producción para el sitio `mgobeaalcoba.github.io`.

**Instancia:** [mgobeaalcoba.app.n8n.cloud](https://mgobeaalcoba.app.n8n.cloud)

> Los archivos `.json` son versiones **sanitizadas** (sin credenciales ni API keys). Los valores sensibles están reemplazados por placeholders `{{ NOMBRE_VARIABLE }}`. Para importar a n8n, reemplazá cada placeholder con el valor real desde el panel de credenciales de n8n o Supabase.

---

## Workflows activos

| Archivo | Nombre | Trigger | RSS Source | Estado |
|---|---|---|---|---|
| `01-ai-blog-creator.json` | AI Blog Creator | Lun/Jue 8am + Manual | Hacker News Frontpage | ✅ Activo |

---

## 01 — AI Blog Creator

**Archivo:** `01-ai-blog-creator.json`

### ¿Qué hace?

1. Lee los trending topics de **Hacker News** (RSS `hnrss.org/frontpage`)
2. Filtra y selecciona el más relevante para la audiencia de data/AI/engineering
3. Genera un **artículo técnico bilingüe completo** (ES + EN) con **OpenRouter** vía AI Agent + Structured Output Parser
4. Sube el `.md` al repositorio en `cv/content/posts/` vía **GitHub OAuth2** → dispara el CI/CD automáticamente
5. Inserta el metadata y los tags en **Supabase** (`blog_posts` + `blog_post_tags`) → el post aparece en el blog
6. Publica el artículo en **dev.to** con `canonical_url` apuntando al blog original

### Flujo de nodos

```
⏰ Schedule (Lun/Jue 8am)
        ↓
⚙️ Configuración  ← credenciales y config
        ↓
📡 Hacker News RSS
        ↓
🔧 Parsear RSS  ← filtra por relevancia, selecciona topic
        ↓
🤖 AI Agent (OpenRouter + Structured Output Parser)
        ↓
🔧 Parsear Artículo  ← prepara filename, base64, canonical URL
        ↓
📊 Supabase: Insert Post  ← retorna ID del nuevo post
        ↓
🔧 Preparar Tags
        ↓
📊 Supabase: Insert Tags
        ↓
📁 Create a file (GitHub OAuth2)  ← dispara CI/CD rebuild
        ↓
🚀 dev.to: Publicar
```

### Modelo AI

- **Tipo:** AI Agent con Structured Output Parser
- **Proveedor:** OpenRouter (`@n8n/n8n-nodes-langchain.lmChatOpenRouter`)
- **Modelo en producción:** `z-ai/glm-4.5-air:free`
- **Output parser:** JSON Schema estructurado (slug, title_es/en, excerpt_es/en, category, tags, read_time, content_markdown_es/en)

---

## Credenciales necesarias (configurar en n8n → Credentials)

| Nombre en n8n | Tipo | Descripción |
|---|---|---|
| `OpenRouter account` | OpenRouter API | Acceso a modelos LLM vía OpenRouter |
| `Mgobeaalcoba Github` | GitHub OAuth2 | Push de archivos al repositorio |

---

## Variables / placeholders a completar tras importar

| Placeholder | Descripción | Dónde obtenerlo |
|---|---|---|
| `{{ DEVTO_API_KEY }}` | API Key de dev.to | dev.to → Settings → Extensions → API Keys |
| `{{ SUPABASE_SERVICE_ROLE_KEY }}` | Service Role Key de Supabase | Supabase Dashboard → Settings → API → Legacy → service_role |
| `{{ SUPABASE_URL }}` | URL del proyecto Supabase | Supabase Dashboard → Settings → API → Project URL |
| `{{ CREDENTIAL_ID }}` | ID auto-asignado por n8n | Se completa automáticamente al vincular las credenciales |

> Los placeholders se completan en el nodo **⚙️ Configuración** y en los headers de los nodos HTTP de Supabase y dev.to.

---

## Tablas de Supabase involucradas

| Tabla | Operación | Descripción |
|---|---|---|
| `blog_posts` | `INSERT` | Metadata del artículo (slug, títulos, excerpts, fecha, categoría, read_time, author) |
| `blog_post_tags` | `INSERT` (batch) | Tags asociados al post (post_id, tag) |

---

## Notas de implementación

- El archivo `.md` se crea en `cv/content/posts/YYYY-MM-DD-{slug}.md` con frontmatter mínimo (`slug` + `date`)
- El push a GitHub dispara automáticamente el GitHub Actions `deploy.yml` (path `cv/content/posts/**`)
- El `sort_order` del post se inserta como `99` — reordenar manualmente en Supabase si se desea otro orden
- El artículo se publica en dev.to con `canonical_url` apuntando al blog original para preservar el SEO
