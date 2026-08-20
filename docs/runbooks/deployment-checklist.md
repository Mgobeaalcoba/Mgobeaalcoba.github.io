# 🚀 CHECKLIST DE DEPLOY - Analytics Fase 1

> **Documento histórico.** Los nombres y objetivos de esta Fase 1 ya no son la taxonomía vigente. Para cualquier release actual usar [`docs/runbooks/analytics.md`](./analytics.md); en particular, newsletter emite `newsletter_subscribe` sólo después del webhook exitoso y las herramientas usan el funnel `tool_view` → `tool_start` → `tool_result`/`tool_error`.

## ✅ COMPLETADO - Listo para Producción

---

## 📦 Archivos Listos para Commit

### Código JavaScript (5 archivos):
- ✅ `assets/js/simulador-sueldo.js` - +20 líneas
- ✅ `assets/js/token-calculator.js` - +40 líneas
- ✅ `assets/js/dashboard-inversiones.js` - +15 líneas
- ✅ `assets/js/recursos.js` - +25 líneas
- ✅ `assets/js/game.js` - +80 líneas

### HTML (2 archivos):
- ✅ `index.html` - Newsletter activado
- ✅ `recursos.html` - Newsletter activado

### Documentación (4 archivos):
- ✅ `ANALYTICS_PROPOSAL.md` - Propuesta inicial
- ✅ `GA4_CONFIGURATION_GUIDE.md` - Guía de configuración
- ✅ `PHASE1_IMPLEMENTATION_SUMMARY.md` - Resumen técnico
- ✅ `ANALYTICS_PHASE1_COMPLETE.md` - Resumen ejecutivo

**Total:** 11 archivos modificados/creados

---

## 🎯 Comando de Deploy

```bash
# 1. Ver status
git status

# 2. Agregar archivos modificados
git add assets/js/simulador-sueldo.js
git add assets/js/token-calculator.js
git add assets/js/dashboard-inversiones.js
git add assets/js/recursos.js
git add assets/js/game.js
git add index.html
git add recursos.html

# 3. Agregar documentación
git add ANALYTICS_PROPOSAL.md
git add GA4_CONFIGURATION_GUIDE.md
git add PHASE1_IMPLEMENTATION_SUMMARY.md
git add ANALYTICS_PHASE1_COMPLETE.md
git add DEPLOY_CHECKLIST.md

# 4. Commit
git commit -m "feat: implement comprehensive GA4 analytics tracking

- Add tracking to tax calculator (2 events)
- Add tracking to token calculator (2 events)
- Add tracking to investment dashboard (2 events)
- Add tracking to currency widgets (4 events)
- Add tracking to educational game ReqQuest 3D (6 events)
- Activate newsletter with tracking (2 events)
- Total: 18 new GA4 events implemented
- Add comprehensive documentation for GA4 configuration

This completes Phase 1 of analytics strategy."

# 5. Push
git push origin main
```

---

## 🧪 Testing en Producción

### 1. Esperar Deploy (2-5 minutos)
GitHub Pages tarda unos minutos en actualizar.

### 2. Instalar Google Analytics Debugger
- Chrome: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
- Firefox: Abre consola de desarrollador (F12)

### 3. Abrir Sitio en Incógnito
```
https://mgobeaalcoba.github.io/
```

### 4. Activar Debugger
- Click en icono de extensión
- Debe mostrar "Debug: ON"

### 5. Testing Checklist

#### Página: recursos.html

**Calculadora de Ganancias:**
- [ ] Ingresa salario y calcula
  - Debe aparecer: `tax_calculator_use`
- [ ] Click en caso de estudio
  - Debe aparecer: `tax_case_study_used`

**Calculadora de Tokens:**
- [ ] Ingresa texto y calcula
  - Debe aparecer: `token_calculator_use`
- [ ] Sube un archivo
  - Debe aparecer: `token_file_upload`

**Dashboard de Inversiones:**
- [ ] Cambia período (3m, 6m, 12m)
  - Debe aparecer: `investment_dashboard_period_change`
- [ ] Click en "Compartir"
  - Debe aparecer: `share`

**Cotizaciones:**
- [ ] Click en "Actualizar"
  - Debe aparecer: `currency_refresh`

**Indicadores Económicos:**
- [ ] Click en widget de inflación/UVA/etc
  - Debe aparecer: `indicator_click`
- [ ] Se abre modal con gráfico
  - Debe aparecer: `historical_chart_view`
- [ ] Cambia período (7d, 30d, etc)
  - Debe aparecer: `historical_chart_period_change`

**Newsletter:**
- [ ] Ingresa email y suscribe
  - Debe aparecer: `newsletter_signup`
  - Debe aparecer: `generate_lead`

---

#### Página: ing_req_game.html

**Juego Educativo:**
- [ ] Click en "Iniciar Juego"
  - Debe aparecer: `game_start`
- [ ] Acércate a un stakeholder
  - Aparece prompt "Presiona E"
- [ ] Presiona E o Space
  - Debe aparecer: `stakeholder_interaction`
- [ ] Selecciona una respuesta
  - Debe aparecer: `challenge_solved`
  - Debe aparecer: `level_progress`
- [ ] Completa 12 desafíos
  - Debe aparecer: `boss_unlocked`
  - Boss se hace visible en centro
- [ ] Completa boss final (13/13)
  - Debe aparecer: `game_complete`
  - Pantalla de victoria

---

#### Página: index.html

**Newsletter:**
- [ ] Scroll hasta el footer
- [ ] Ingresa email en newsletter banner
- [ ] Submit form
  - Debe aparecer: `newsletter_signup`
  - Debe aparecer: `generate_lead`
  - Muestra mensaje de éxito

---

## 📊 Verificación en GA4 DebugView

### Acceder:
1. [Google Analytics](https://analytics.google.com/)
2. Selecciona propiedad `G-DG0SLT5RY3`
3. Configurar > DebugView

### Verificar en Tiempo Real:
- Los eventos deben aparecer INMEDIATAMENTE
- Verifica que los parámetros sean correctos
- Revisa que los valores ($) se registren

### DebugView debe mostrar:
```
✅ game_start
   ├─ event_category: gamification
   ├─ game_name: ReqQuest 3D
   └─ value: 10

✅ tax_calculator_use
   ├─ event_category: tool_usage
   ├─ neto_deseado: 2500000
   ├─ tiene_conyuge: false
   └─ value: 5

✅ newsletter_signup
   ├─ event_category: engagement
   ├─ method: footer_form
   └─ value: 20
```

---

## ⚠️ Troubleshooting

### Problema: No aparecen eventos en DebugView
**Soluciones:**
1. Verificar que gtag.js esté cargando (Network tab)
2. Verificar consola de Chrome (debe aparecer `[Analytics] Event tracked`)
3. Verificar que el Tracking ID sea correcto en HTML
4. Desactivar AdBlock temporalmente
5. Probar en otro browser

### Problema: Eventos aparecen pero sin parámetros
**Soluciones:**
1. Verificar estructura del evento en código
2. Revisar consola de errores JavaScript
3. Verificar que los parámetros no sean `undefined`

### Problema: Newsletter no se suscribe
**Soluciones:**
1. Verificar que `newsletter.js` esté en el directorio
2. Revisar consola de errores
3. Verificar que el endpoint de backend esté funcionando
4. Por ahora, el tracking funciona independiente del backend

---

## 📈 Métricas de Éxito

### Semana 1:
- 🎯 **Objetivo:** 50+ eventos de tool_usage
- 🎯 **Objetivo:** 10+ game_start
- 🎯 **Objetivo:** 5+ newsletter_signup

### Mes 1:
- 🎯 **Objetivo:** 200+ tool usage total
- 🎯 **Objetivo:** 20+ game completions
- 🎯 **Objetivo:** 50+ newsletter subscribers
- 🎯 **Objetivo:** Identificar top 3 herramientas más usadas

### Mes 2-3:
- 🎯 **Objetivo:** Correlación tool usage → conversiones
- 🎯 **Objetivo:** ROI por feature
- 🎯 **Objetivo:** Optimizar basado en datos

---

## 🎓 Aprendizajes para Reportar

Al final del primer mes, podrás responder:

### Preguntas de Negocio:
- ¿Qué herramientas generan más leads?
- ¿El juego educativo convierte en clientes?
- ¿Qué casos de estudio resuenan más?
- ¿Los usuarios prefieren visualizar datos a corto o largo plazo?

### Preguntas Técnicas:
- ¿Qué eventos tienen más volumen?
- ¿Cuál es el valor promedio por usuario?
- ¿Qué features no se usan (candidatos a deprecar)?
- ¿Dónde está el mayor engagement?

### Preguntas Educativas (Único):
- ¿Qué temas de ingeniería de requerimientos son más difíciles?
- ¿Cuánto tiempo toma completar el juego?
- ¿Los jugadores entienden los conceptos?
- ¿Vale la pena invertir más en gamificación?

---

## 📚 Referencias Rápidas

### Archivos de Documentación:
| Archivo | Propósito |
|---------|-----------|
| `ANALYTICS_PROPOSAL.md` | 🎯 Propuesta y estrategia completa |
| `GA4_CONFIGURATION_GUIDE.md` | 📖 Guía paso a paso para GA4 |
| `PHASE1_IMPLEMENTATION_SUMMARY.md` | 🔧 Detalles técnicos |
| `ANALYTICS_PHASE1_COMPLETE.md` | 📊 Resumen ejecutivo |
| `DEPLOY_CHECKLIST.md` | ✅ Este archivo - Deploy guide |

### Eventos por Archivo:
| Archivo JavaScript | Eventos | Value Total |
|-------------------|---------|-------------|
| `game.js` | 6 eventos | $87 |
| `recursos.js` | 5 eventos | $12 |
| `token-calculator.js` | 2 eventos | $8 |
| `simulador-sueldo.js` | 2 eventos | $8 |
| `dashboard-inversiones.js` | 2 eventos | $8 |
| Newsletter scripts | 2 eventos | $40 |

---

## 🎊 Celebración

Has completado una implementación de analytics que incluye:

✅ **Tracking financiero** (calculadoras, cotizaciones)  
✅ **Tracking de inversiones** (dashboard comparativo)  
✅ **Tracking educativo** (juego gamificado) ← **ÚNICO**  
✅ **Tracking de engagement** (newsletter, widgets)  
✅ **Valores monetarios** (para ROI analysis)  

**Pocos portfolios personales tienen este nivel de instrumentación.**

---

**Status:** 🟢 READY TO DEPLOY  
**Confianza:** 95% (eventos testeados con console.log)  
**Riesgo:** Bajo (fallback si gtag no está disponible)  
**Tiempo de deploy:** ~5 minutos  
**Tiempo hasta primeros datos:** 24-48 horas en GA4

---

## 🏁 ¡Estás listo para hacer push!

**Comando final:**
```bash
git add .
git commit -m "feat: Phase 1 analytics - comprehensive tracking for all tools and game"
git push origin main
```

Luego, abre GA4 DebugView y empieza a probar. 🎉
