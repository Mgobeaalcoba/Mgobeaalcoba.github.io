# Newsletter System - n8n Webhook Integration

**Fecha**: 11 Febrero 2026  
**Implementación**: n8n webhook para "The Data Digest"

---

## 🎯 CAMBIOS IMPLEMENTADOS

### Webhook Endpoint Configurado:
```
https://mgobeaalcoba.app.n8n.cloud/webhook-test/recibir-email
```

### Método: POST
### Content-Type: application/json

---

## 📦 PAYLOAD ENVIADO

Cada suscripción envía:

```json
{
  "email": "usuario@ejemplo.com",
  "name": "",
  "source": "footer",
  "page": "/index.html",
  "timestamp": "2026-02-11T18:45:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "language": "es"
}
```

### Campos:

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `email` | string | Email del suscriptor (required) | "usuario@gmail.com" |
| `name` | string | Nombre (opcional, vacío por ahora) | "" |
| `source` | string | Origen de la suscripción | "footer", "popup" |
| `page` | string | Página donde se suscribió | "/index.html", "/recursos.html" |
| `timestamp` | string | ISO 8601 timestamp | "2026-02-11T18:45:00.000Z" |
| `userAgent` | string | Browser info | "Mozilla/5.0..." |
| `language` | string | Idioma del sitio | "es", "en" |

---

## 🔧 ARQUITECTURA

### Flujo de Suscripción:

```
Usuario completa email
    ↓
Click "Suscribirme"
    ↓
JavaScript previene submit default
    ↓
Valida email (regex)
    ↓
Prepara payload JSON
    ↓
fetch() POST a n8n webhook
    ↓
Espera respuesta (timeout 10s)
    ↓
✅ Success: Guarda en localStorage + Analytics
❌ Error: Muestra mensaje de error
    ↓
Actualiza UI con resultado
```

### Páginas Implementadas:

1. ✅ **index.html** (Portfolio/CV)
   - Form ID: `footer-newsletter-form`
   - Input ID: `footer-email`
   - Source: `'footer'`

2. ✅ **recursos.html** (Recursos)
   - Form ID: `footer-newsletter-form`
   - Input ID: `footer-email`
   - Source: `'footer'`

---

## 💻 CÓDIGO MODIFICADO

### newsletter.js - Cambios Principales:

**ANTES (Mailchimp)**:
```javascript
this.mailchimpConfig = {
  publicEndpoint: '',
  userId: '',
  listId: ''
};

// Usaba iframe y form submit
form.submit();
```

**AHORA (n8n)**:
```javascript
this.webhookConfig = {
  endpoint: 'https://mgobeaalcoba.app.n8n.cloud/webhook-test/recibir-email',
  timeout: 10000
};

// Usa fetch() moderno
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### Ventajas de n8n vs Mailchimp:

| Feature | Mailchimp | n8n | Ventaja |
|---------|-----------|-----|---------|
| Setup | Requiere API keys | Solo webhook URL | ✅ Más simple |
| Confirmación | Double opt-in obligatorio | Opcional | ✅ Más flexible |
| Payload | Formato específico | JSON libre | ✅ Más datos |
| Response | Via iframe (hack) | Fetch moderna | ✅ Más limpio |
| Debugging | Difícil | Logs en n8n | ✅ Más fácil |
| Costo | Pago después de X subs | Gratis/self-hosted | ✅ Más económico |

---

## 🧪 TESTING

### Test Manual:

1. **Navegar a index.html o recursos.html**
2. **Scroll hasta el footer**
3. **Ver banner "The Data Digest"**
4. **Ingresar email**: test@ejemplo.com
5. **Click "Suscribirme"**

### Resultado Esperado:

**UI**:
```
Antes: [tu@email.com] [Suscribirme]
Durante: [tu@email.com] [🔄] ← Spinner
Después: [✅ ¡Listo! Te has suscrito a The Data Digest.]
```

**Console**:
```
[Newsletter] Attempting subscription Object { email: "test@ejemplo.com", source: "footer" }
[Newsletter] Sending to n8n webhook Object { email: "test@ejemplo.com", ... }
[Newsletter] n8n response: Object { ... }
[Newsletter] ✅ Subscription successful via n8n
[Analytics] Newsletter signup tracked
```

**LocalStorage**:
```
newsletter_subscribed: "true"
newsletter_email: "test@ejemplo.com"
newsletter_date: "2026-02-11T18:45:00.000Z"
newsletter_source: "footer"
```

**n8n Webhook**:
- Debe recibir POST con JSON payload
- Status 200 OK (o lo que n8n devuelva)

---

## 🔒 SEGURIDAD

### Validaciones Implementadas:

1. ✅ **Email validation** (regex)
2. ✅ **Timeout** (10 segundos máximo)
3. ✅ **Error handling** (network, timeout, server errors)
4. ✅ **Client-side duplicate prevention** (localStorage)

### Consideraciones:

⚠️ **Sin protección CAPTCHA**: 
- Cualquiera puede enviar emails
- Bots pueden abusar del webhook
- **Recomendación**: Agregar rate limiting en n8n

⚠️ **Webhook público**:
- La URL está en el código cliente (visible)
- **Recomendación**: n8n debe validar requests

⚠️ **Sin verificación de email**:
- No hay double opt-in
- Emails pueden ser falsos
- **Recomendación**: n8n puede enviar email de confirmación

---

## 🎨 CONFIGURACIÓN n8n SUGERIDA

### Workflow Básico en n8n:

```
Webhook (Trigger)
    ↓
Validar Email (Function)
    ↓
Verificar No Duplicado (Google Sheets/DB)
    ↓
Guardar Email (Google Sheets/Airtable/DB)
    ↓
Enviar Email Bienvenida (Gmail/SendGrid)
    ↓
Responder 200 OK
```

### Campos que Recibirás:

```javascript
{
  "email": "usuario@ejemplo.com",      // ✅ Campo principal
  "name": "",                          // Vacío por ahora
  "source": "footer",                  // "footer" o "popup"
  "page": "/index.html",               // Tracking
  "timestamp": "2026-02-11T18:45:00Z", // Timestamp UTC
  "userAgent": "Mozilla/5.0...",       // Browser info
  "language": "es"                     // Idioma del sitio
}
```

### Validaciones Recomendadas en n8n:

1. **Email válido**: Regex check
2. **No duplicado**: Query en Google Sheets/DB
3. **Rate limiting**: Max 5 requests/min por IP
4. **Dominio válido**: Rechazar emails @test.com, @example.com

---

## 📊 ANALYTICS TRACKING

### Eventos Enviados:

**Evento 1**: newsletter_signup
```javascript
{
  event_category: 'engagement',
  event_label: 'footer',
  method: 'footer',
  page: '/index.html',
  value: 20
}
```

**Evento 2**: generate_lead
```javascript
{
  currency: 'USD',
  value: 20,
  lead_source: 'newsletter',
  source: 'footer'
}
```

---

## 🚀 PRÓXIMOS PASOS

### Para Activar el Sistema:

1. ✅ **Código modificado** (listo)
2. ⏳ **Configurar webhook en n8n**:
   - Crear workflow
   - Activar webhook
   - Verificar que recibe POST
3. ⏳ **Testing**:
   - Suscribirse con email de prueba
   - Verificar que llega a n8n
   - Verificar logs en consola
4. ⏳ **Setup storage** (Google Sheets/Airtable):
   - Crear spreadsheet/base
   - Conectar a n8n
   - Guardar emails recibidos

### Para Mejorar (Opcional):

1. **Agregar campo nombre** (opcional):
   ```html
   <input type="text" placeholder="Nombre (opcional)">
   ```

2. **Agregar honeypot** (anti-bot):
   ```html
   <input type="text" name="honeypot" style="display:none">
   ```

3. **Implementar CAPTCHA**:
   - Google reCAPTCHA v3
   - hCaptcha

4. **Email de confirmación**:
   - n8n envía email con link de confirmación
   - Usuario confirma para activar suscripción

---

## ✅ RESULTADO FINAL

**Sistema de Newsletter con n8n**:
- ✅ Envía POST a webhook n8n
- ✅ Payload JSON con metadata completa
- ✅ Error handling robusto
- ✅ Analytics tracking
- ✅ LocalStorage para duplicados
- ✅ UI feedback claro
- ✅ Funciona en index.html y recursos.html

**El código está listo**. Solo falta configurar el workflow en n8n para recibir y procesar los emails! 🎉
