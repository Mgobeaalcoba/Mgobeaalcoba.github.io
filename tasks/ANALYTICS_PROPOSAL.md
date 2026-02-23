# 📊 Propuesta de Mejoras en Analytics para Portfolio

## 🎯 Objetivo
Mejorar el tracking en Google Analytics para obtener insights completos sobre el comportamiento de los usuarios y las conversiones en todas las páginas del sitio.

---

## 🚨 PRIORIDAD 1: Trackeo en recursos.html

### Herramientas a trackear:

#### 1. Calculadora de Impuesto a las Ganancias
```javascript
// Al calcular impuestos
gtag('event', 'tax_calculator_use', {
  event_category: 'tool_usage',
  salario_bruto: salarioBruto,
  tiene_deducciones: tieneS_AC,
  impuesto_calculado: resultado,
  value: 5 // Valor estimado de engagement
});

// Al usar casos de estudio
gtag('event', 'tax_case_study_used', {
  event_category: 'tool_usage',
  case_number: casoId,
  case_name: nombreCaso
});
```

#### 2. Calculadora de Tokens GenAI
```javascript
// Al calcular tokens
gtag('event', 'token_calculator_use', {
  event_category: 'tool_usage',
  input_tokens: inputTokens,
  output_ratio: outputRatio,
  models_compared: modelosSeleccionados.join(','),
  value: 5
});

// Al subir archivo
gtag('event', 'token_file_upload', {
  event_category: 'tool_usage',
  file_type: fileExtension,
  file_size: fileSize
});
```

#### 3. Dashboard de Salud Económica
```javascript
// Al cambiar período
gtag('event', 'investment_dashboard_period_change', {
  event_category: 'dashboard_interaction',
  period: period, // 3m, 6m, 12m
  value: 3
});

// Al compartir dashboard
gtag('event', 'share', {
  method: 'image',
  content_type: 'dashboard',
  item_id: 'investment_dashboard'
});
```

#### 4. Cotizaciones en Tiempo Real
```javascript
// Al refrescar cotizaciones
gtag('event', 'currency_refresh', {
  event_category: 'widget_interaction',
  widget_type: 'currency_rates'
});

// Al hacer click en una cotización específica
gtag('event', 'currency_view_detail', {
  event_category: 'widget_interaction',
  currency_type: currencyType, // blue, mep, oficial, etc.
});
```

#### 5. Indicadores Económicos
```javascript
// Al abrir gráfico histórico
gtag('event', 'historical_chart_view', {
  event_category: 'widget_interaction',
  indicator: indicatorName, // inflation, risk, uva, etc.
  period: timePeriod // 7d, 30d, 90d, 1y, max
});

// Al hacer click en widget de indicador
gtag('event', 'indicator_click', {
  event_category: 'widget_interaction',
  indicator_type: widgetType
});
```

---

## 🎮 PRIORIDAD 2: Trackeo en ing_req_game.html

### Eventos del juego educativo:

```javascript
// Inicio del juego
gtag('event', 'game_start', {
  event_category: 'gamification',
  game_name: 'ReqQuest 3D',
  value: 10 // Alto valor educativo
});

// Nivel completado
gtag('event', 'level_complete', {
  event_category: 'gamification',
  level_name: levelName,
  time_spent: timeInSeconds,
  score: playerScore
});

// Desafío resuelto
gtag('event', 'challenge_solved', {
  event_category: 'gamification',
  challenge_type: challengeType,
  attempts: numberOfAttempts,
  success: isSuccess
});

// Interacción con stakeholder
gtag('event', 'stakeholder_interaction', {
  event_category: 'gamification',
  stakeholder_name: stakeholderName,
  interaction_type: interactionType
});

// Juego completado
gtag('event', 'game_complete', {
  event_category: 'gamification',
  total_time: totalTimeInMinutes,
  challenges_completed: totalChallenges,
  final_score: finalScore,
  value: 50 // Muy alto valor de engagement
});
```

---

## 💼 PRIORIDAD 3: Mejorar funnel de conversión en consulting.html

### Eventos de e-commerce mejorados:

```javascript
// Cuando usuario muestra interés en servicio
gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: serviceValue,
  items: [{
    item_id: serviceId,
    item_name: serviceName,
    item_category: 'consulting_service',
    quantity: 1,
    price: serviceValue
  }]
});

// Cuando revisa detalles del pack
gtag('event', 'view_cart', {
  currency: 'USD',
  value: packValue,
  items: packItems
});

// Cuando genera propuesta (simular purchase)
gtag('event', 'purchase', {
  transaction_id: `PROP-${Date.now()}`,
  currency: 'USD',
  value: proposalValue,
  items: [{
    item_id: 'custom_proposal',
    item_name: 'Propuesta Personalizada',
    item_category: 'consulting',
    quantity: 1,
    price: proposalValue
  }]
});
```

---

## 🏷️ PRIORIDAD 4: Implementar Google Tag Manager (GTM)

### Beneficios:
- ✅ Gestión centralizada de tags sin tocar código
- ✅ A/B testing de eventos
- ✅ Debugging mejorado con Preview Mode
- ✅ Triggers personalizados (clicks, scrolls, timers, etc.)
- ✅ Variables reutilizables
- ✅ Fácil integración con otras herramientas (Hotjar, Mixpanel, LinkedIn Ads, Facebook Pixel)
- ✅ Versioning y rollback de cambios

### Pasos de implementación:
1. Crear cuenta de GTM
2. Agregar container snippet a todas las páginas
3. Migrar eventos existentes de gtag.js a GTM
4. Configurar triggers y tags desde la interfaz
5. Publicar y verificar

---

## 👤 PRIORIDAD 5: User ID Tracking

### Implementación:

```javascript
// Cuando usuario genera propuesta
gtag('config', 'G-DG0SLT5RY3', {
  'user_id': hashEmail(userEmail) // Hash del email para privacidad
});

// Cuando usuario agenda con Calendly
gtag('config', 'G-DG0SLT5RY3', {
  'user_id': calendlyUserId
});

// Helper function para hash
function hashEmail(email) {
  return btoa(email.toLowerCase()); // Simple encoding, usar SHA-256 en producción
}
```

**Beneficios:**
- Seguimiento cross-device
- Mejor understanding del customer journey
- Atribución más precisa de conversiones
- Retargeting más efectivo

---

## 📧 PRIORIDAD 6: Activar Newsletter Tracking

El código está comentado pero listo para activar. Solo necesitas:

```javascript
// Newsletter subscription
gtag('event', 'newsletter_signup', {
  event_category: 'engagement',
  method: 'footer_form',
  value: 20 // Valor de lead de newsletter
});

gtag('event', 'generate_lead', {
  currency: 'USD',
  value: 20,
  lead_source: 'newsletter'
});
```

---

## 📈 PRIORIDAD 7: Core Web Vitals Tracking

### Implementación con web-vitals library:

```bash
npm install web-vitals
```

```javascript
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToGoogleAnalytics({name, delta, id}) {
  gtag('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    event_label: id,
    non_interaction: true,
  });
}

getCLS(sendToGoogleAnalytics);
getFID(sendToGoogleAnalytics);
getFCP(sendToGoogleAnalytics);
getLCP(sendToGoogleAnalytics);
getTTFB(sendToGoogleAnalytics);
```

**Beneficios:**
- Monitoreo de performance real
- Correlación entre performance y conversiones
- Identificar páginas lentas
- Optimización basada en datos

---

## 🐛 PRIORIDAD 8: Error Tracking

### Capturar errores JavaScript:

```javascript
// Global error handler
window.addEventListener('error', (e) => {
  gtag('event', 'exception', {
    description: `${e.message} | ${e.filename}:${e.lineno}:${e.colno}`,
    fatal: false,
    page: window.location.pathname
  });
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  gtag('event', 'exception', {
    description: `Unhandled Promise Rejection: ${e.reason}`,
    fatal: false,
    page: window.location.pathname
  });
});

// API errors
function trackApiError(endpoint, statusCode, errorMessage) {
  gtag('event', 'api_error', {
    event_category: 'errors',
    endpoint: endpoint,
    status_code: statusCode,
    error_message: errorMessage
  });
}
```

---

## 📊 Configuración Recomendada en GA4

### 1. Conversiones personalizadas a crear:
- ✅ `proposal_generated` (ya existe como form_submit)
- ✅ `cv_download` (ya existe como file_download)
- ✅ `calendly_booking` (ya existe como contact)
- 🆕 `tax_calculator_use` (NUEVO)
- 🆕 `token_calculator_use` (NUEVO)
- 🆕 `game_complete` (NUEVO)
- 🆕 `newsletter_signup` (NUEVO)

### 2. Custom Dimensions a configurar:
- `user_type` (visitor, lead, prospect, client)
- `service_interest` (automation, ai, bi)
- `calculator_type` (tax, token)
- `game_progress` (level, challenges completed)
- `content_category` (blog category)

### 3. Custom Metrics:
- `proposal_value` (valor estimado de propuesta)
- `time_in_game` (tiempo en juego educativo)
- `tools_used_count` (número de herramientas usadas)

### 4. Audiences a crear:
- **High Intent Leads**: Usuarios que generaron propuesta O agendaron Calendly
- **Tool Users**: Usuarios que usaron al menos 1 calculadora
- **Engaged Visitors**: >2min en sitio + 3+ páginas vistas
- **Game Players**: Usuarios que jugaron ReqQuest 3D
- **Blog Readers**: Leyeron al menos 1 post completo

---

## 🎯 KPIs Sugeridos para Dashboards

### Dashboard 1: Conversiones
- Proposals Generated (goal)
- CV Downloads (goal)
- Calendly Bookings (goal)
- WhatsApp Clicks (goal)
- Email Clicks (goal)
- Conversion Rate por fuente

### Dashboard 2: Engagement de Herramientas
- Tax Calculator Usage
- Token Calculator Usage
- Dashboard Views
- Currency Widget Interactions
- Tool Usage Funnel

### Dashboard 3: Contenido Educativo
- Game Starts
- Game Completions
- Challenges Solved
- Blog Post Reads
- Video Plays
- Average Engagement Time

### Dashboard 4: Performance
- Core Web Vitals (LCP, FID, CLS)
- Page Load Times
- API Response Times
- Error Rate
- Pages con problemas de performance

---

## 📝 Checklist de Implementación

### Fase 1: Crítico (1-2 semanas)
- [ ] Implementar trackeo en recursos.html (calculadoras e indicadores)
- [ ] Implementar trackeo en ing_req_game.html
- [ ] Activar newsletter tracking
- [ ] Configurar conversiones personalizadas en GA4

### Fase 2: Importante (2-3 semanas)
- [ ] Migrar a Google Tag Manager
- [ ] Implementar User ID tracking
- [ ] Configurar Custom Dimensions y Metrics
- [ ] Crear Audiences en GA4

### Fase 3: Optimización (3-4 semanas)
- [ ] Implementar Web Vitals tracking
- [ ] Implementar Error tracking
- [ ] Crear dashboards personalizados en GA4
- [ ] Documentar estrategia de measurement

---

## 💡 Recomendaciones Adicionales

### 1. Event Naming Convention
Usar convención consistente:
- **Formato**: `[object]_[action]` (e.g., `proposal_generated`, `game_started`)
- **Categorías**: `engagement`, `tool_usage`, `conversion`, `gamification`, `content`

### 2. Testing
- Usar GA4 DebugView para verificar eventos
- Configurar ambiente de testing (diferente Measurement ID)
- Documentar cada evento nuevo agregado

### 3. Privacy & GDPR
- Configurar cookie consent banner
- Anonymizar IPs automáticamente
- Documentar política de privacidad
- Agregar opt-out link

### 4. Integrations
Considerar integrar:
- **Hotjar**: Para heatmaps y session recordings
- **Microsoft Clarity**: Alternativa gratuita a Hotjar
- **Mixpanel**: Para event-based analytics más detallados
- **LinkedIn Insight Tag**: Para retargeting en LinkedIn

---

## 🚀 Próximos Pasos

1. **Revisar esta propuesta** y priorizar qué implementar primero
2. **Crear issues/tickets** para cada mejora
3. **Asignar responsables** y timelines
4. **Comenzar con Fase 1** (Crítico)
5. **Iterar y optimizar** basado en insights

---

## 📚 Recursos Útiles

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GTM Documentation](https://developers.google.com/tag-platform/tag-manager)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)

---

**Autor:** Análisis realizado el 04/02/2026  
**Versión:** 1.0
