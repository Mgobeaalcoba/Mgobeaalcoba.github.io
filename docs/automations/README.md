# Automations — Documentación

Este directorio documenta los workflows de n8n que corren en producción para el sitio `mgobeaalcoba.github.io`.

**Instancia:** [mgobeaalcoba.app.n8n.cloud](https://mgobeaalcoba.app.n8n.cloud)

> Los archivos `.json` son versiones **sanitizadas** (sin credenciales ni API keys). Los valores sensibles están reemplazados por placeholders `{{ NOMBRE_VARIABLE }}`. Para importar a n8n, reemplazá cada placeholder con el valor real desde el panel de credenciales de n8n o Supabase.

---

## Workflows activos

| Archivo | Nombre | Trigger | Estado |
|---|---|---|---|
| `01-ai-blog-creator.json` | AI Blog Creator | Lun/Jue 8am | ✅ Activo |

---

## Credenciales necesarias (configurar en n8n → Credentials)

| Nombre en n8n | Tipo | Descripción |
|---|---|---|
| `OpenRouter account` | OpenRouter API | Acceso a modelos LLM vía OpenRouter |
| `Mgobeaalcoba Github` | GitHub OAuth2 | Push de archivos al repositorio |

---

## Variables de entorno / placeholders

| Placeholder | Descripción | Dónde obtenerlo |
|---|---|---|
| `{{ DEVTO_API_KEY }}` | API Key de dev.to | dev.to → Settings → Extensions → API Keys |
| `{{ SUPABASE_SERVICE_ROLE_KEY }}` | Service Role Key de Supabase | Supabase Dashboard → Settings → API → Legacy → service_role |
| `{{ SUPABASE_URL }}` | URL del proyecto Supabase | Supabase Dashboard → Settings → API → Project URL |
| `{{ GITHUB_OWNER }}` | Owner del repositorio | `Mgobeaalcoba` |
| `{{ GITHUB_REPO }}` | Nombre del repositorio | `Mgobeaalcoba.github.io` |
