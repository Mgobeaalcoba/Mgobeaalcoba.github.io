# Automations — Documentación

Este directorio documenta los workflows de n8n que corren en producción para el sitio `mgobeaalcoba.github.io`.

**Instancia:** [mgobeaalcoba.app.n8n.cloud](https://mgobeaalcoba.app.n8n.cloud)

> Los archivos `.json` son versiones **sanitizadas** (sin credenciales ni API keys). Los valores sensibles están reemplazados por placeholders `{{ NOMBRE_VARIABLE }}`. Para importar a n8n, reemplazá cada placeholder con el valor real desde el panel de credenciales de n8n o Supabase.

---

## Workflows activos

| # | Archivo | Nombre | Trigger | Estado |
|---|---|---|---|---|
| 01 | `01-ai-blog-creator.json` | AI Blog Creator | Lun/Jue 8am + Manual | ✅ Activo |
| 02 | `02-webhook-contact-form.json` | Webhook Contact Form Handler | Webhook POST `/contacto-webhook` | ✅ Activo |
| 03 | `03-newsletter-subscription.json` | Newsletter Subscription Handler | Webhook POST `/recibir-email` | ✅ Activo |
| 04 | `04-free-automation-lead.json` | Free Automation Lead Handler | Webhook POST `/solicitud-automatizacion` | ✅ Activo |
| 05 | `05-daily-content-digest.json` | Daily Content Digest Newsletter | Schedule diario 8am | ✅ Activo |

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

---

## 02 — Webhook Contact Form Handler

**Archivo:** `02-webhook-contact-form.json`

### ¿Qué hace?

Recibe los envíos del formulario de contacto del sitio web, los registra en Google Sheets y envía dos emails HTML automáticamente: uno de agradecimiento al usuario y una notificación al administrador.

### Flujo de nodos

```
📬 Webhook POST (/webhook/contacto-webhook)
        ↓
🔧 Limpiar y Procesar Datos  ← extrae name, email, message, source, etc.
        ↓
📊 Guardar en Google Sheets  ← CRM: hoja "contact_me_cv"
        ↓
    ┌───────────────────────────────────┐
    ↓                                   ↓
🖊️ Construir Email HTML            🖊️ Construir Email Notificación Admin
    ↓                                   ↓
📧 Enviar Email de Agradecimiento  📧 Enviar Notificación Admin
   (→ email del usuario)              (→ gobeamariano@gmail.com)
```

### Payload esperado del formulario

```json
{
  "name": "...",
  "email": "...",
  "message": "...",
  "source": "cv-portfolio-contact",
  "form_type": "contact_portfolio",
  "page": "/",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "userAgent": "...",
  "language": "es"
}
```

### Credenciales necesarias

| Nombre en n8n | Tipo | Descripción |
|---|---|---|
| `Sheets gobeamariano@gmail.com` | Google Sheets OAuth2 | Acceso a la spreadsheet de contactos |
| `gobeamariano@gmail.com Gmail` | Gmail OAuth2 | Envío de emails de agradecimiento y notificación |

### Placeholders a completar tras importar

| Placeholder | Descripción | Dónde obtenerlo |
|---|---|---|
| `{{ GOOGLE_SHEETS_DOCUMENT_ID }}` | ID de la spreadsheet en Google Sheets | URL de la sheet: `/spreadsheets/d/{ID}/` |
| `{{ GOOGLE_SHEETS_SHEET_ID }}` | ID numérico de la pestaña/hoja | URL de la sheet: `#gid={ID}` |
| `{{ ADMIN_EMAIL }}` | Email del administrador para notificaciones | El tuyo personal |
| `{{ CREDENTIAL_ID }}` | ID auto-asignado por n8n | Se completa al vincular las credenciales |
| `{{ WEBHOOK_ID }}` | ID auto-asignado por n8n | Se genera al activar el workflow |

### Bugs conocidos

- El campo `Email` de la fila en Google Sheets está mapeado a `$json.timestamp` en lugar de `$json.email`. El email real sí llega en el body — simplemente corregir el mapeo en el nodo **Guardar en Google Sheets**.

---

---

## 03 — Newsletter Subscription Handler

**Archivo:** `03-newsletter-subscription.json`

### ¿Qué hace?

Recibe las suscripciones al newsletter del sitio web. Registra el email del suscriptor en Google Sheets y dispara dos emails en paralelo: una bienvenida al suscriptor y una notificación al administrador.

### Flujo de nodos

```
📬 Webhook POST (/webhook/recibir-email)
        ↓
⚙️ Workflow Configuration  ← nombre empresa, logo, fromEmail
        ↓
🔧 Preparar Datos  ← extrae email, genera timestamp
        ↓
📊 Append row in sheet  ← hoja "newsletter" (Email, Fecha, Origen)
        ↓
    ┌──────────────────────────────┐
    ↓                              ↓
📧 Notificación al Lead       📧 Notificación a Mariano
   (→ email del suscriptor)      (→ admin)
```

### Payload esperado

```json
{ "email": "...", "name": "(opcional)" }
```

### Credenciales necesarias

| Nombre en n8n | Tipo |
|---|---|
| `Sheets gobeamariano@gmail.com` | Google Sheets OAuth2 |
| `gobeamariano@gmail.com Gmail` | Gmail OAuth2 |

### Placeholders a completar

| Placeholder | Descripción |
|---|---|
| `{{ GOOGLE_SHEETS_DOCUMENT_ID }}` | ID de la spreadsheet de suscriptores |
| `{{ GOOGLE_SHEETS_SHEET_ID }}` | ID de la pestaña "newsletter" (gid=0 para la primera) |
| `{{ ADMIN_EMAIL }}` | Email del administrador |
| `{{ CREDENTIAL_ID }}` | Auto-asignado por n8n |
| `{{ WEBHOOK_ID }}` | Auto-asignado por n8n |

---

## 04 — Free Automation Lead Handler

**Archivo:** `04-free-automation-lead.json`

### ¿Qué hace?

Procesa los leads del formulario de "Automatización Gratis" de la página Consulting. Captura nombre, email, empresa, rubro y el proceso a automatizar. Guarda el lead en Google Sheets y envía dos emails: confirmación al usuario y notificación detallada al admin.

### Flujo de nodos

```
📬 Webhook POST (/webhook/solicitud-automatizacion)
        ↓
⚙️ Workflow Configuration  ← nombre empresa, logo
        ↓
🔧 Preparar Datos  ← extrae email, nombre, empresa, rubro, proceso, timestamp (AR timezone)
        ↓
📊 Append row in sheet  ← hoja "free_automation" (ID ejecución, Email, Nombre, Empresa, Rubro, Proceso, Fecha, Origen)
        ↓
    ┌──────────────────────────────┐
    ↓                              ↓
📧 Mail al Usuario            📧 Notificación a Mariano
   (confirmación + recursos)     (tabla completa del lead)
```

### Payload esperado

```json
{
  "name": "...", "email": "...", "company": "...", "industry": "...",
  "problem": "...", "page": "/consulting.html", "referrer": "...",
  "language": "es", "formType": "automatizacion-gratis", "source": "consulting-page"
}
```

### Credenciales necesarias

| Nombre en n8n | Tipo |
|---|---|
| `Sheets gobeamariano@gmail.com` | Google Sheets OAuth2 |
| `gobeamariano@gmail.com Gmail` | Gmail OAuth2 |

### Placeholders a completar

| Placeholder | Descripción |
|---|---|
| `{{ GOOGLE_SHEETS_DOCUMENT_ID }}` | ID de la spreadsheet |
| `{{ GOOGLE_SHEETS_SHEET_ID }}` | ID numérico de la pestaña "free_automation" |
| `{{ ADMIN_EMAIL }}` | Email del administrador |
| `{{ CREDENTIAL_ID }}` | Auto-asignado por n8n |
| `{{ WEBHOOK_ID }}` | Auto-asignado por n8n |

---

## 05 — Daily Content Digest Newsletter

**Archivo:** `05-daily-content-digest.json`

### ¿Qué hace?

Genera y envía diariamente un newsletter HTML con las 3 noticias más disruptivas del día sobre GenAI y Data Engineering. Usa un AI Agent (OpenAI GPT-4.1-mini + SerpAPI para búsqueda en tiempo real), construye un email HTML con diseño mobile-first, y lo envía a todos los suscriptores registrados en Google Sheets.

### Flujo de nodos

```
⏰ Schedule (diario 8am)
        ↓
🤖 Newsletter AI Agent
   ├── 🧠 OpenAI Chat Model (gpt-4.1-mini)
   └── 🔍 SerpAPI News Search (búsqueda en tiempo real)
        ↓
📊 Get Recipients from Sheet  ← lee hoja "newsletter" (itera por cada suscriptor)
        ↓
🔧 Prepare Email Data  ← arma to, subject, html para cada destinatario
        ↓
📧 Send Newsletter Email  ← Gmail (un envío por suscriptor)
```

### Modelo AI y herramientas

| Componente | Detalle |
|---|---|
| **Modelo LLM** | `gpt-4.1-mini` (OpenAI) |
| **Temperatura** | 0.7 |
| **Search tool** | SerpAPI (noticias del día en tiempo real) |
| **Output** | HTML completo listo para email (mobile-first, estilo branded) |

### Credenciales necesarias

| Nombre en n8n | Tipo |
|---|---|
| `n8n free OpenAI API credits` (o cuenta propia) | OpenAI API |
| `SerpAPI account` | SerpAPI |
| `Sheets gobeamariano@gmail.com` | Google Sheets OAuth2 |
| `gobeamariano@gmail.com Gmail` | Gmail OAuth2 |

### Placeholders a completar

| Placeholder | Descripción |
|---|---|
| `{{ GOOGLE_SHEETS_DOCUMENT_ID }}` | ID de la spreadsheet de suscriptores |
| `{{ GOOGLE_SHEETS_SHEET_ID }}` | ID de la pestaña "newsletter" |
| `{{ CREDENTIAL_ID }}` | Auto-asignado por n8n para cada credencial |
| `{{ WEBHOOK_ID }}` | Auto-asignado por n8n |

### Nota de costos

- **OpenAI**: gpt-4.1-mini tiene costo por token (muy bajo). Alternativamente se puede reemplazar por un modelo gratuito vía OpenRouter.
- **SerpAPI**: plan gratuito con 100 búsquedas/mes; plan pago desde USD 50/mes.

---

## Notas de implementación

- El archivo `.md` se crea en `cv/content/posts/YYYY-MM-DD-{slug}.md` con frontmatter mínimo (`slug` + `date`)
- El push a GitHub dispara automáticamente el GitHub Actions `deploy.yml` (path `cv/content/posts/**`)
- El `sort_order` del post se inserta como `99` — reordenar manualmente en Supabase si se desea otro orden
- El artículo se publica en dev.to con `canonical_url` apuntando al blog original para preservar el SEO
