# Newsletter Setup Guide

## Estado Actual

El sistema de newsletter está **DESACTIVADO** pero el código está listo para activar.

## Para Activar Newsletter

### Paso 1: Crear Cuenta Mailchimp

1. Ir a [mailchimp.com](https://mailchimp.com)
2. Crear cuenta gratuita (hasta 500 suscriptores)
3. Crear una nueva "Audience" llamada "The Data Digest"

### Paso 2: Obtener Endpoint de Suscripción

1. En Mailchimp, ir a: **Audience → Signup forms → Embedded forms**
2. Copiar el formulario HTML generado
3. Buscar la línea `<form action="...">` 
4. Copiar la URL del `action`, se ve así:
   ```
   https://XXXXX.us21.list-manage.com/subscribe/post?u=USER_ID&amp;id=LIST_ID
   ```

### Paso 3: Configurar en Código

Editar `assets/js/newsletter.js` línea ~10:

```javascript
this.mailchimpConfig = {
  publicEndpoint: 'https://XXXXX.us21.list-manage.com/subscribe/post?u=USER_ID&id=LIST_ID',
  userId: 'USER_ID',
  listId: 'LIST_ID'
};
```

### Paso 4: Descomentar HTML

En los siguientes archivos, descomentar las secciones de newsletter:

#### `index.html`
- Buscar: `<!-- Newsletter Banner - DESACTIVADO`
- Descomentar todo el bloque hasta `-->`

#### `consulting.html`
- Buscar: `<!-- Newsletter Banner - DESACTIVADO`
- Descomentar todo el bloque hasta `-->`

#### `recursos.html`
- Buscar: `<!-- Newsletter Banner - DESACTIVADO`
- Descomentar todo el bloque hasta `-->`

### Paso 5: Activar Scripts

En los mismos archivos, descomentar:
```html
<!-- Newsletter System - DESACTIVADO temporalmente -->
```

### Paso 6: Activar Popup (Opcional)

Editar `assets/js/newsletter.js` línea ~265:

```javascript
// Cambiar de:
// document.addEventListener('DOMContentLoaded', () => {

// A:
document.addEventListener('DOMContentLoaded', () => {
  newsletter.showPopup(30000);
});
```

### Paso 7: Configurar Double Opt-In

En Mailchimp:
1. **Audience → Settings → Audience name and campaign defaults**
2. Activar "Enable double opt-in"
3. Personalizar email de confirmación

### Paso 8: Diseñar Template de Email

1. Crear campaign template en Mailchimp
2. Secciones sugeridas:
   - Header: "The Data Digest - Semana X"
   - Sección 1: "3 Noticias de Data & GenAI"
   - Sección 2: "Tip Financiero Argentina"
   - Sección 3: "Nuevo Contenido del Blog"
   - Footer: Links a redes sociales

### Paso 9: Testing

1. Suscribirse con tu propio email
2. Verificar que llegue email de confirmación
3. Confirmar suscripción
4. Testear que aparezca en Mailchimp audience

### Paso 10: Deploy

```bash
git add .
git commit -m "feat: activate newsletter system"
git push origin main
```

## Frecuencia Sugerida

**Semanal** - Cada lunes a las 9am

Contenido:
- 3 noticias/artículos de Data Engineering o GenAI
- 1 tip financiero relevante para Argentina
- Link al último post del blog
- Call-to-action a servicios de consultoría

## Métricas a Trackear

En Mailchimp dashboard:
- **Tasa de apertura** (objetivo: >25%)
- **Click-through rate** (objetivo: >10%)
- **Unsuscribes** (mantener <2%)
- **Growth rate** (objetivo: +50 suscriptores/mes)

## Compliance (GDPR/Argentina)

- ✅ Double opt-in configurado
- ✅ Link de unsuscribe en cada email
- ✅ Política de privacidad clara
- ✅ No compartir emails con terceros

---

**Tiempo estimado de setup completo: 30-45 minutos**
