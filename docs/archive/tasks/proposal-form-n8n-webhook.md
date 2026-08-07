# Formulario de Automatización Gratis - n8n Webhook

**Fecha**: 12 Febrero 2026  
**Implementación**: Webhook n8n para solicitudes de automatización

---

## 🎯 ENDPOINT CONFIGURADO

```
URL: https://mgobeaalcoba.app.n8n.cloud/webhook-test/solicitud-automatizacion
Method: POST
Content-Type: application/json
Timeout: 15 segundos
```

---

## 📦 PAYLOAD ENVIADO

```json
{
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "company": "Mi Empresa SA",
  "industry": "Retail",
  "problem": "Facturación manual toma 15 horas semanales",
  "timestamp": "2026-02-12T08:45:00.000Z",
  "page": "/consulting.html",
  "referrer": "https://linkedin.com/...",
  "language": "es",
  "userAgent": "Mozilla/5.0...",
  "formType": "automatizacion-gratis",
  "source": "consulting-page"
}
```

### Campos del Formulario:

| Campo | Tipo | Required | Descripción | Ejemplo |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ | Nombre y Apellido | "Juan Pérez" |
| `email` | string | ✅ | Email de contacto | "juan@empresa.com" |
| `company` | string | ✅ | Nombre de la empresa | "Mi Empresa SA" |
| `industry` | string | ✅ | Rubro/Industria | "Retail", "Servicios", "Tech" |
| `problem` | string | ✅ | Proceso a automatizar | "Facturación manual..." |

### Metadata Automática:

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `timestamp` | string | ISO 8601 timestamp | "2026-02-12T08:45:00.000Z" |
| `page` | string | Página de origen | "/consulting.html" |
| `referrer` | string | De dónde vino | "https://google.com", "direct" |
| `language` | string | Idioma del sitio | "es", "en" |
| `userAgent` | string | Browser/device info | "Mozilla/5.0..." |
| `formType` | string | Tipo de formulario | "automatizacion-gratis" |
| `source` | string | Origen específico | "consulting-page" |

---

## 🔧 FLUJO COMPLETO

```
Usuario completa formulario
    ↓
Click "Solicitar Automatización Gratis"
    ↓
Validación HTML5 (campos required)
    ↓
JavaScript extrae todos los campos
    ↓
Prepara payload JSON con metadata
    ↓
POST a n8n webhook
    ↓
Espera respuesta (máx 15 segundos)
    ↓
✅ Success:
    - Cierra modal formulario
    - Abre modal con opciones de contacto
    - WhatsApp y Email pre-poblados
    - Analytics tracking
    
❌ Error:
    - Muestra alert con error
    - Mantiene datos en formulario
    - Botón se reactiva
```

---

## 🎨 UI/UX

### Estado del Botón:

**Inicial**:
```
[🎁 Solicitar Automatización Gratis]
```

**Durante envío**:
```
[🔄 ..................] ← Spinner
```

**Después éxito**:
```
Modal cierra → Modal de éxito abre
```

### Modal de Éxito:

```
✅ ¡Solicitud Recibida!

Perfecto, hemos recibido su solicitud.
Elija cómo prefiere que nos contactemos:

[📱 Contactar por WhatsApp] [✉️ Enviar Email]
```

---

## 🔍 CONFIGURACIÓN N8N SUGERIDA

### Workflow Recomendado:

```
1. Webhook Trigger (POST)
   ↓
2. Set (Extraer y normalizar campos)
   ↓
3. Google Sheets (Append Row)
   - Sheet: "Solicitudes Automatización"
   - Columns: [Timestamp, Name, Email, Company, Industry, Problem, Language]
   ↓
4. IF (Validar email no duplicado)
   ├─ Duplicado → Enviar notificación "Ya contactado"
   └─ Nuevo → Continuar
   ↓
5. Gmail (Enviar notificación a ti)
   - To: gobeamariano@gmail.com
   - Subject: "🎁 Nueva solicitud: {{ $json.company }}"
   - Body: Detalles del lead
   ↓
6. Gmail (Enviar confirmación a cliente) - OPCIONAL
   - To: {{ $json.email }}
   - Subject: "Recibimos tu solicitud de automatización"
   - Body: "Hola {{ $json.name }}, nos contactaremos pronto..."
   ↓
7. Slack/Discord (Notificación) - OPCIONAL
   - Channel: #leads
   - Message: "Nuevo lead: {{ $json.company }} - {{ $json.problem }}"
   ↓
8. Respond to Webhook
   - Status: 200 OK
   - Body: { "success": true, "message": "Solicitud recibida" }
```

---

## 📊 DATOS QUE RECIBIRÁS

### Google Sheet Sugerido:

| Timestamp | Name | Email | Company | Industry | Problem | Language | Page | Source |
|-----------|------|-------|---------|----------|---------|----------|------|--------|
| 2026-02-12 09:15 | Juan Pérez | juan@empresa.com | Mi Empresa | Retail | Facturación manual... | es | /consulting.html | consulting-page |
| 2026-02-12 10:30 | María López | maria@startup.com | Startup XYZ | Tech | Reportes demoran... | es | /consulting.html | consulting-page |

### Análisis Posible:

- **Por industria**: ¿Qué rubros solicitan más?
- **Por problema**: ¿Cuáles son los pain points más comunes?
- **Por idioma**: ¿ES vs EN conversion?
- **Por hora**: ¿Cuándo llegan más solicitudes?
- **Por referrer**: ¿De dónde vienen (LinkedIn, Google, directo)?

---

## 🔒 SEGURIDAD Y VALIDACIONES

### Client-Side (JavaScript):

1. ✅ **HTML5 validation** (required fields)
2. ✅ **Email format** (type="email")
3. ✅ **Timeout protection** (15 segundos)
4. ✅ **Error handling** robusto
5. ✅ **Loading state** (disable button)

### Server-Side (n8n) - RECOMENDADO:

1. ⚠️ **Validar email format** (regex)
2. ⚠️ **Detectar duplicados** (evitar spam)
3. ⚠️ **Rate limiting** (máx 5 requests/hora por IP)
4. ⚠️ **Sanitizar inputs** (prevenir injection)
5. ⚠️ **Verificar honeypot** (campo oculto anti-bot)

### Honeypot Anti-Bot (Opcional):

Agregar al formulario:
```html
<input type="text" 
       name="website" 
       style="display:none" 
       tabindex="-1" 
       autocomplete="off">
```

En n8n:
```javascript
if ($json.website && $json.website !== '') {
  // Es un bot, rechazar
  return { success: false, message: 'Invalid request' };
}
```

---

## 🧪 TESTING

### Test Manual:

1. **Abrir**: http://127.0.0.1:8002/consulting.html
2. **Click**: "Automatización Gratis" (cualquier botón)
3. **Completar formulario**:
   - Nombre: Test User
   - Email: test@ejemplo.com
   - Empresa: Test Company
   - Rubro: Testing
   - Problema: Testing webhook integration
4. **Submit**
5. **Verificar**:
   - Botón muestra spinner
   - Modal cierra
   - Modal de éxito abre
   - Links WhatsApp/Email funcionan

### Verificar en n8n:

1. Ir a workflow execution log
2. Buscar ejecución reciente
3. Ver payload recibido
4. Verificar que se guardó en Google Sheets

### Console Output Esperado:

```
[ProposalForm] Sending to n8n webhook: Object { name: "Test User", ... }
[ProposalForm] n8n response: Object { success: true }
[ProposalForm] ✅ Form sent successfully to n8n
[Analytics] Form submit tracked
[Analytics] Lead generation tracked
```

---

## 📧 LINKS PRE-POBLADOS

### WhatsApp:

```
https://wa.me/5491127475569?text=
Hola Mariano, soy Juan Pérez de Mi Empresa SA.
Acabo de solicitar automatización gratis desde tu web.
Nos dedicamos a Retail y nuestro desafío es:
"Facturación manual toma 15 horas".
Me gustaría conversar sobre la propuesta.
```

### Email:

```
mailto:gobeamariano@gmail.com?
subject=Contacto desde la web - Propuesta para Mi Empresa SA
&body=Hola Mariano,

Mi nombre es Juan Pérez y te escribo desde Mi Empresa SA (rubro: Retail).

Solicité automatización gratis sobre: "Facturación manual..."

Me gustaría coordinar una llamada.

Saludos.
```

---

## 📈 ANALYTICS TRACKING

### Eventos Registrados:

**1. form_submit**:
```javascript
{
  form_id: 'proposal_form',
  section: 'proposal_form',
  value: 300,
  conversion_type: 'automation_request'
}
```

**2. generate_lead**:
```javascript
{
  currency: 'USD',
  value: 300,
  lead_source: 'automation_request',
  company: 'Mi Empresa SA',
  industry: 'Retail'
}
```

**Value**: USD 300 (alto porque es lead calificado con problema específico)

---

## 🎯 VENTAJAS vs PDF

| Feature | PDF Download | n8n Webhook |
|---------|--------------|-------------|
| **Datos centralizados** | ❌ Cliente tiene PDF | ✅ Todo en sheets |
| **Seguimiento** | ❌ Manual | ✅ Automático |
| **Notificaciones** | ❌ No | ✅ Email/Slack instant |
| **Análisis** | ❌ Difícil | ✅ Fácil (sheets/BI) |
| **Duplicados** | ❌ No detecta | ✅ Puede detectar |
| **Respuesta** | ❌ Depende de cliente | ✅ Proactiva |

---

## 🚀 PRÓXIMOS PASOS

### Inmediato (Ya implementado):

- [x] Modificar consulting.js para usar webhook
- [x] Actualizar mensajes en UI
- [x] Actualizar traducciones
- [x] Agregar error handling
- [x] Agregar analytics tracking
- [x] Mantener links WhatsApp/Email

### Pendiente (Setup n8n):

- [ ] Crear workflow en n8n
- [ ] Configurar Google Sheets
- [ ] Setup notificaciones (Gmail/Slack)
- [ ] Testing con lead real
- [ ] Verificar datos llegan correctamente

### Opcional (Mejoras):

- [ ] Agregar honeypot anti-bot
- [ ] Implementar rate limiting
- [ ] Enviar email de confirmación automático
- [ ] Crear dashboard de leads en n8n

---

## ✅ RESULTADO FINAL

**Sistema de Solicitud de Automatización**:
- ✅ Formulario con 5 campos required
- ✅ POST a n8n webhook con payload rico
- ✅ Error handling robusto (15s timeout)
- ✅ UI feedback claro (spinner, modales)
- ✅ Analytics tracking completo
- ✅ Links de contacto pre-poblados
- ✅ Sin necesidad de PDF

**El formulario está listo para recibir leads!** 🎉

Solo falta configurar el workflow en n8n para procesar las solicitudes.
