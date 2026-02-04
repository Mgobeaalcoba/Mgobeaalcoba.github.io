# 📊 Guía de Configuración GA4 - Fase 1 Completada

## ✅ Eventos Implementados en el Código

### 🧮 Calculadora de Impuesto a las Ganancias
**Evento:** `tax_calculator_use`
- **Categoría:** `tool_usage`
- **Parámetros:**
  - `neto_deseado`: Monto redondeado a miles
  - `tiene_conyuge`: boolean
  - `num_hijos`: número
  - `tiene_alquiler`: boolean
  - `value`: 5

**Evento:** `tax_case_study_used`
- **Categoría:** `tool_usage`
- **Parámetros:**
  - `case_number`: 1-4
  - `case_name`: soltero_sin_hijos | casado_2_hijos | soltero_alquila | con_bono_anual
  - `value`: 3

---

### 🤖 Calculadora de Tokens GenAI
**Evento:** `token_calculator_use`
- **Categoría:** `tool_usage`
- **Parámetros:**
  - `input_tokens`: Redondeado a cientos
  - `output_ratio`: 0.5 - 3.0
  - `models_compared`: Lista de top 3 modelos
  - `value`: 5

**Evento:** `token_file_upload`
- **Categoría:** `tool_usage`
- **Parámetros:**
  - `file_type`: txt | csv | pdf | doc | docx
  - `file_size_kb`: Tamaño en KB
  - `value`: 3

---

### 📊 Dashboard de Salud Económica
**Evento:** `investment_dashboard_period_change`
- **Categoría:** `dashboard_interaction`
- **Parámetros:**
  - `period`: 3m | 6m | 12m
  - `value`: 3

**Evento:** `share` (Evento estándar GA4)
- **Parámetros:**
  - `method`: image
  - `content_type`: dashboard
  - `item_id`: investment_dashboard
  - `value`: 5

---

### 💱 Cotizaciones en Tiempo Real
**Evento:** `currency_refresh`
- **Categoría:** `widget_interaction`
- **Parámetros:**
  - `widget_type`: currency_rates
  - `value`: 2

---

### 📈 Indicadores Económicos
**Evento:** `indicator_click`
- **Categoría:** `widget_interaction`
- **Parámetros:**
  - `indicator_type`: inflation | annual-inflation | uva | risk | fixed-term | fci
  - `value`: 2

**Evento:** `historical_chart_view`
- **Categoría:** `widget_interaction`
- **Parámetros:**
  - `indicator`: Tipo de indicador
  - `value`: 3

---

### 🎮 ReqQuest 3D (Juego Educativo)
**Evento:** `game_start`
- **Categoría:** `gamification`
- **Parámetros:**
  - `game_name`: ReqQuest 3D
  - `value`: 10

**Evento:** `challenge_solved`
- **Categoría:** `gamification`
- **Parámetros:**
  - `challenge_id`: ID del stakeholder
  - `challenge_name`: Nombre del stakeholder
  - `success`: true | false
  - `value`: 5 (si correcto) | 1 (si incorrecto)

**Evento:** `level_progress`
- **Categoría:** `gamification`
- **Parámetros:**
  - `challenges_completed`: 1-13
  - `total_challenges`: 13
  - `progress_percent`: 0-100
  - `value`: 3

**Evento:** `boss_unlocked`
- **Categoría:** `gamification`
- **Parámetros:**
  - `challenges_before_boss`: 12
  - `value`: 15

**Evento:** `stakeholder_interaction`
- **Categoría:** `gamification`
- **Parámetros:**
  - `stakeholder_id`: ID del NPC
  - `stakeholder_name`: Nombre
  - `stakeholder_role`: Rol
  - `value`: 2

**Evento:** `game_complete`
- **Categoría:** `gamification`
- **Parámetros:**
  - `final_reputation`: 0-100
  - `final_budget`: 0-100
  - `total_time_minutes`: Tiempo total
  - `challenges_completed`: 13
  - `value`: 50

---

### 📧 Newsletter
**Evento:** `newsletter_signup`
- **Categoría:** `engagement`
- **Parámetros:**
  - `method`: footer_form
  - `page`: portfolio | recursos
  - `value`: 20

**Evento:** `generate_lead` (Evento estándar GA4)
- **Parámetros:**
  - `currency`: USD
  - `value`: 20
  - `lead_source`: newsletter
  - `page`: portfolio | recursos

---

## 🎯 PASO 1: Marcar Eventos como Conversiones en GA4

### Acceder a GA4:
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad (Tracking ID: **G-DG0SLT5RY3**)
3. En el menú lateral: **Configurar > Eventos**

### Conversiones a Crear:

#### ✅ **Conversión 1: tax_calculator_use**
- Tipo: Uso de herramienta
- Valor estimado: $5
- Descripción: Usuario usa calculadora de ganancias

#### ✅ **Conversión 2: token_calculator_use**
- Tipo: Uso de herramienta
- Valor estimado: $5
- Descripción: Usuario usa calculadora de tokens

#### ✅ **Conversión 3: game_complete**
- Tipo: Engagement educativo
- Valor estimado: $50
- Descripción: Usuario completa juego ReqQuest 3D

#### ✅ **Conversión 4: newsletter_signup**
- Tipo: Lead generation
- Valor estimado: $20
- Descripción: Usuario se suscribe a newsletter

#### ✅ **Conversión 5: proposal_generated** (ya existe como form_submit)
- Tipo: Lead generation
- Valor estimado: $300
- Descripción: Usuario genera propuesta de consultoría

### Pasos para marcar como conversión:
1. En **Configurar > Eventos**, verás la lista de todos los eventos
2. Espera 24-48 horas después del deploy para que aparezcan los nuevos eventos
3. Marca como conversión los eventos listados arriba haciendo click en el toggle

---

## 🏷️ PASO 2: Crear Parámetros Personalizados (Custom Dimensions)

### En GA4 > Configurar > Definiciones personalizadas > Crear dimensión personalizada:

#### Dimensión 1: calculator_type
- **Nombre para mostrar:** Calculator Type
- **Descripción:** Tipo de calculadora utilizada
- **Alcance:** Evento
- **Parámetro de evento:** `calculator_type`

#### Dimensión 2: game_progress
- **Nombre para mostrar:** Game Progress
- **Descripción:** Progreso en juego educativo
- **Alcance:** Evento
- **Parámetro de evento:** `progress_percent`

#### Dimensión 3: indicator_type
- **Nombre para mostrar:** Economic Indicator Type
- **Descripción:** Tipo de indicador económico consultado
- **Alcance:** Evento
- **Parámetro de evento:** `indicator_type`

#### Dimensión 4: case_name
- **Nombre para mostrar:** Tax Case Study Name
- **Descripción:** Caso de estudio usado en calculadora
- **Alcance:** Evento
- **Parámetro de evento:** `case_name`

---

## 📊 PASO 3: Crear Audiencias en GA4

### En GA4 > Configurar > Audiencias > Nueva audiencia:

#### Audiencia 1: Tool Users (Usuarios de Herramientas)
**Condiciones:**
- Ha activado cualquiera de estos eventos en los últimos 30 días:
  - `tax_calculator_use` O
  - `token_calculator_use` O
  - `investment_dashboard_period_change`

**Descripción:** Usuarios que han usado al menos una herramienta

---

#### Audiencia 2: Game Players (Jugadores)
**Condiciones:**
- Ha activado el evento `game_start` en los últimos 90 días

**Descripción:** Usuarios que iniciaron el juego educativo

---

#### Audiencia 3: Game Completers (Completaron Juego)
**Condiciones:**
- Ha activado el evento `game_complete` en los últimos 90 días

**Descripción:** Usuarios que completaron todo el juego (alta engagement)

---

#### Audiencia 4: High Intent Leads
**Condiciones:**
- Ha activado cualquiera de estos eventos en los últimos 7 días:
  - `form_submit` (propuesta) O
  - `contact` (Calendly/WhatsApp/Email) O
  - `newsletter_signup`

**Descripción:** Leads de alta intención para retargeting

---

#### Audiencia 5: Engaged Visitors
**Condiciones:**
- `session_duration` > 120 segundos Y
- `page_view` >= 3 páginas

**Descripción:** Visitantes altamente comprometidos

---

## 📈 PASO 4: Crear Informes Personalizados

### Informe 1: Tool Usage Dashboard
**Dimensiones:**
- Fecha
- Nombre del evento

**Métricas:**
- Recuento de eventos
- Usuarios totales
- Valor del evento

**Filtro:** Incluir solo eventos:
- `tax_calculator_use`
- `token_calculator_use`
- `investment_dashboard_period_change`
- `currency_refresh`
- `indicator_click`

---

### Informe 2: Gamification Funnel
**Dimensiones:**
- Nombre del evento
- Progreso del juego

**Métricas:**
- Usuarios totales
- Tasa de conversión

**Secuencia:**
1. `game_start`
2. `challenge_solved` (al menos 1)
3. `level_progress` (50%+)
4. `boss_unlocked`
5. `game_complete`

---

### Informe 3: Conversion Funnel Complete
**Dimensiones:**
- Fuente/medio
- Página de destino

**Métricas:**
- Usuarios nuevos
- Conversiones por tipo
- Valor de conversión

**Eventos incluidos:**
- `page_view`
- `tool_usage` (cualquier herramienta)
- `generate_lead` (newsletter, propuesta)
- `contact` (WhatsApp, email, Calendly)
- `file_download` (CV)

---

## 🔍 PASO 5: Verificar Implementación

### Usar GA4 DebugView:
1. Ve a **Configurar > DebugView**
2. Abre tu sitio en modo incógnito
3. Instala extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
4. Activa la extensión
5. Interactúa con las herramientas y verifica que los eventos aparezcan en tiempo real

### Checklist de Verificación:
- [ ] ✅ Calcula impuesto a las ganancias → Aparece `tax_calculator_use`
- [ ] ✅ Usa un caso de estudio → Aparece `tax_case_study_used`
- [ ] ✅ Calcula tokens → Aparece `token_calculator_use`
- [ ] ✅ Sube archivo a calculadora tokens → Aparece `token_file_upload`
- [ ] ✅ Cambia período dashboard → Aparece `investment_dashboard_period_change`
- [ ] ✅ Comparte dashboard → Aparece `share`
- [ ] ✅ Actualiza cotizaciones → Aparece `currency_refresh`
- [ ] ✅ Click en indicador económico → Aparece `indicator_click`
- [ ] ✅ Abre gráfico histórico → Aparece `historical_chart_view`
- [ ] ✅ Inicia juego → Aparece `game_start`
- [ ] ✅ Interactúa con stakeholder → Aparece `stakeholder_interaction`
- [ ] ✅ Resuelve desafío → Aparece `challenge_solved`
- [ ] ✅ Desbloquea boss → Aparece `boss_unlocked`
- [ ] ✅ Completa juego → Aparece `game_complete`
- [ ] ✅ Se suscribe a newsletter → Aparece `newsletter_signup` y `generate_lead`

---

## 📚 Documentación de Eventos

### Convención de Nombres:
- **Formato:** `[object]_[action]`
- **Ejemplos:** `tax_calculator_use`, `game_start`, `newsletter_signup`

### Categorías Usadas:
- `tool_usage`: Uso de calculadoras y herramientas
- `dashboard_interaction`: Interacción con dashboards
- `widget_interaction`: Interacción con widgets de indicadores
- `gamification`: Eventos del juego educativo
- `engagement`: Newsletter y otras acciones de engagement

### Valores Asignados:
- **Herramientas simples**: $2-3
- **Herramientas complejas**: $5
- **Engagement medio**: $10-15
- **Newsletter signup**: $20
- **Game completion**: $50 (muy alto valor educativo)
- **Conversiones consultoría**: $75-300

---

## 🎯 Próximos Pasos Post-Implementación

### Semana 1:
- [ ] Deploy del código a producción
- [ ] Verificar eventos en DebugView
- [ ] Documentar cualquier ajuste necesario

### Semana 2:
- [ ] Marcar eventos como conversiones en GA4
- [ ] Crear parámetros personalizados
- [ ] Crear audiencias

### Semana 3-4:
- [ ] Crear informes personalizados
- [ ] Configurar alertas para conversiones clave
- [ ] Comenzar análisis de datos

---

## 💡 Tips de Análisis

### KPIs Clave a Monitorear:

#### Engagement de Herramientas:
- **Calculadora de Ganancias**: Uso diario/semanal
- **Calculadora de Tokens**: Modelos más comparados
- **Dashboard**: Período más consultado (3m vs 12m)
- **Cotizaciones**: Frecuencia de refresh

#### Gamificación:
- **Tasa de inicio**: Visitantes que empiezan el juego
- **Tasa de completado**: Jugadores que completan todo
- **Desafíos más difíciles**: Cuáles tienen menos aciertos
- **Tiempo promedio**: Cuánto tardan en completar

#### Conversiones:
- **Funnel completo**: Visita → Tool usage → Lead
- **Valor por usuario**: Valor promedio de conversiones
- **Mejor fuente**: De dónde vienen los leads de mayor valor

---

## 🔗 Links Útiles

- [GA4 Admin](https://analytics.google.com/analytics/web/#/a12345p67890/admin/streams/table/) (reemplazar con tu Property ID)
- [DebugView](https://analytics.google.com/analytics/web/#/a12345p67890/admin/debugview/) (reemplazar con tu Property ID)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

**✅ Fase 1 completada:** Todos los eventos críticos han sido implementados en el código.
**📅 Fecha:** 04/02/2026
**🚀 Próximo deploy:** Subir cambios a producción y verificar en DebugView
