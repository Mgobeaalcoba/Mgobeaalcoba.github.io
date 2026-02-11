# Plan de Implementación: 3 Nuevos Servicios para Consulting

## Análisis de Estructura Actual

### Arquitectura Identificada:

**HTML (consulting.html)**:
- **Service Cards** (línea ~394-420): Grid de 3 servicios principales
  - Automatización (data-service="automation")
  - IA Aplicada (data-service="ai")
  - Business Intelligence (data-service="bi")
- **Service Modals** (línea ~1147-1357): Modales detallados para cada servicio
  - automation-service-modal
  - ai-service-modal  
  - bi-service-modal
- **Packs Section**: 3 paquetes de precios
- **Examples Section**: Casos de éxito con workflows

**JavaScript (consulting.js)**:
- `initializeServiceModals()`: Vincula cards con modals vía data-service
- `updatePackDataAttributes()`: Maneja traducciones dinámicas
- Analytics tracking integrado

**CSS (consulting.css)**:
- `.service-card`: Hover effects, transitions
- `.modal-overlay`, `.modal-content`: Sistema modal
- Animaciones para icons y counters

**Translations (translations.js)**:
- Patrón: `consulting_[service]_title`, `consulting_[service]_desc`
- Bilingüe español/inglés completo

---

## Estrategia de Implementación: 3 Nuevos Servicios

### 🎯 Posicionamiento Diferencial

Los 3 nuevos servicios forman un **ecosistema de desarrollo humano** que complementa perfectamente los servicios tecnológicos existentes:

**Servicios Actuales** (foco en producto/solución):
- Automatización → Optimiza procesos
- IA Aplicada → Agrega inteligencia  
- BI → Visualiza datos

**Servicios Nuevos** (foco en personas/capacidades):
- Mentorías → Acelera profesionales
- Cursos Grupales → Transforma equipos
- Reclutamiento → Encuentra talento

---

## 📋 Servicios a Implementar

### 1. Mentorías Tech 1-a-1

**Propuesta de Valor**:
> "Destranque su carrera tech con un mentor que vivió desde el código hasta el liderazgo en MercadoLibre"

**Diferenciadores**:
- Experiencia real MercadoLibre (6+ años, de developer a Technical Leader)
- Enfoque práctico: resolvemos problemas reales, no teoría
- Flexibilidad: consultas puntuales o mentoría continua
- Áreas: Data Engineering, BI, GenAI, Automatización, Career Growth

**Estructura Card**:
- Icon: `fa-user-graduate` (color amber-500)
- Título: "Mentorías Tech Personalizadas"
- Descripción: "Acelere su carrera con mentoría 1-a-1. Desde debugging de problemas técnicos hasta estrategia de carrera en tech."
- data-service: "mentoring"

**Modal Detallado**:
- **Qué Resolvemos**:
  - 🎯 Problemas técnicos específicos (SQL queries, pipelines, dashboards)
  - 📈 Transición a roles senior/leadership
  - 🚀 Proyectos de portfolio impactantes
  - 💡 Decisiones de arquitectura y diseño
  - 🧠 Preparación para entrevistas tech

- **Formato**:
  - Sesión única: USD 80 (60min)
  - Pack 4 sesiones: USD 280 (ahorro 12%)
  - Mentoría mensual: USD 250/mes (2 sesiones + consultas async)

- **Ideal Para**:
  - Data Analysts queriendo pasar a Data Engineer
  - Engineers junior buscando crecer a semi-senior
  - Profesionales de otras áreas transitando a tech
  - Freelancers armando su portfolio

- **ROI**: Casos de éxito de mentees consiguiendo aumentos salariales del 30-50% post-mentoría

---

### 2. Cursos Intensivos Grupales

**Propuesta de Valor**:
> "Upskilling intensivo en grupos ultra-reducidos. No más cursos masivos donde sos un número."

**Diferenciadores**:
- Máximo 4 participantes → atención personalizada garantizada
- Instructor con experiencia real (MercadoLibre + Henry + UADE)
- Formato intensivo: resultados en 4-6 semanas
- Proyectos finales aplicados a casos reales

**Estructura Card**:
- Icon: `fa-users` (color indigo-500)
- Título: "Cursos Intensivos en Tech"
- Descripción: "Grupos ultra-reducidos (máx 4 personas) para upskilling en SQL, Analytics, Data Science, GenAI y Automatización."
- data-service: "courses"

**Modal Detallado**:
- **Cursos Disponibles**:
  1. **SQL para Analytics** (5 semanas)
     - De cero a queries complejas (JOINs, CTEs, Window Functions)
     - Optimización y performance
     - Proyecto: Dashboard con datos reales
  
  2. **Data Analytics con Python** (6 semanas)
     - Pandas, NumPy, visualización
     - Proyecto: EDA completo + reporte ejecutivo
  
  3. **Introducción a Data Science** (6 semanas)
     - ML supervisado/no supervisado
     - Proyecto: Modelo predictivo deployado
  
  4. **GenAI & Automatización** (5 semanas)
     - Prompting avanzado, RAG, LangChain
     - n8n para workflows inteligentes
     - Proyecto: Chatbot funcional
  
  5. **Power BI Avanzado** (4 semanas)
     - DAX, modelado de datos, storytelling
     - Proyecto: Dashboard interactivo completo

- **Formato**:
  - 2 clases/semana (2hrs cada una) + proyecto final
  - Modalidad: Online sincrónico
  - Incluye: Grabaciones, materiales, soporte async
  - Precio: USD 400-600 por curso (según duración)

- **Ideal Para**:
  - Equipos pequeños buscando upskilling coordinado
  - Profesionales que prefieren aprendizaje colaborativo
  - Empresas invirtiendo en capacitación de su talento

- **Certificado**: Con proyecto final aprobado

---

### 3. Reclutamiento Tech Especializado

**Propuesta de Valor**:
> "Encontramos el talento que otros recruiters no detectan. Evaluación técnica real por quien hace el trabajo."

**Diferenciadores**:
- Evaluación técnica real (no solo CV)
- Enfoque en fit cultural y técnico
- Especialización: Data, GenAI, Automation
- Proceso ágil: 2-3 semanas promedio

**Estructura Card**:
- Icon: `fa-search-dollar` o `fa-user-check` (color teal-500)
- Título: "Reclutamiento Tech Especializado"
- Descripción: "Encontramos y evaluamos talento en Data, GenAI y Automation. Evaluación técnica real por un Technical Leader de MercadoLibre."
- data-service: "recruiting"

**Modal Detallado**:
- **Nuestro Proceso**:
  1. **Discovery** (Semana 1)
     - Workshop con stakeholders
     - Definición precisa del perfil
     - Identificación de red flags técnicos/culturales
  
  2. **Sourcing** (Semana 2)
     - Búsqueda activa en LinkedIn, comunidades tech
     - Pre-screening de CVs (descartamos 80% rápido)
     - Primera entrevista telefónica (15min)
  
  3. **Evaluación Técnica** (Semana 3)
     - Challenge técnico realista (no algoritmos teóricos)
     - Entrevista técnica profunda (60min)
     - Code review con feedback detallado
  
  4. **Presentación** (Semana 3)
     - Shortlist de 2-3 finalistas
     - Reporte técnico detallado por candidato
     - Acompañamiento en negociación

- **Perfiles que Reclutamos**:
  - Data Analyst / Data Engineer (Junior → Senior)
  - BI Developer / BI Analyst
  - ML Engineer / Data Scientist
  - Automation Engineer
  - GenAI Engineer

- **Inversión**:
  - Modelo success-based: USD 1,500 solo si contrata
  - O retainer mensual: USD 800/mes con búsquedas ilimitadas
  - Garantía: 3 meses de reemplazo sin costo si no funciona

- **Por Qué Somos Diferentes**:
  - Evaluamos técnicamente nosotros mismos (no terceros)
  - Conocemos qué buscar porque lo hacemos diariamente
  - Network real en comunidades tech de Argentina
  - Proceso transparente con feedback continuo

---

## 🎨 Propuesta de UI/UX

### Reorganización de Secciones:

**Nuevo orden sugerido en la página:**

1. **Hero Section** (sin cambios)

2. **"Cómo Funciona" Free Automation** (sin cambios)

3. **NUEVA SECCIÓN: "Servicios Tecnológicos"** 
   - Grid 3 columnas con servicios actuales
   - Título: "Transformación Digital para su Negocio"
   - Subtítulo: "Desde automatización simple hasta IA completa"

4. **NUEVA SECCIÓN: "Servicios de Desarrollo de Talento"**
   - Grid 3 columnas con servicios nuevos
   - Título: "Impulse su Carrera y Equipo Tech"
   - Subtítulo: "Mentoría, capacitación y reclutamiento especializado"
   - **Diseño visual distintivo**: 
     - Background con gradiente diferente (indigo → purple)
     - Border especial para diferenciarlo

5. **Packs Section** (sin cambios)

6. **Examples Section** (sin cambios)

7. **Process Section** (sin cambios)

8. **About Section** (sin cambios)

9. **Contact Section** (sin cambios)

---

## 📐 Design System para Nuevos Servicios

### Colores por Servicio:

| Servicio | Icon | Color Principal | Color Hover | Gradiente Modal |
|----------|------|----------------|-------------|-----------------|
| Mentorías | fa-user-graduate | amber-500 (#f59e0b) | amber-600 | amber → orange |
| Cursos | fa-users | indigo-500 (#6366f1) | indigo-600 | indigo → purple |
| Recruiting | fa-user-check | teal-500 (#14b8a6) | teal-600 | teal → cyan |

### Iconografía Secundaria:

**Mentorías**:
- fa-rocket (Career growth)
- fa-code (Technical skills)
- fa-chart-line (Progression)
- fa-lightbulb (Problem solving)

**Cursos**:
- fa-graduation-cap (Learning)
- fa-laptop-code (Hands-on)
- fa-project-diagram (Projects)
- fa-certificate (Certification)

**Recruiting**:
- fa-user-tie (Candidates)
- fa-clipboard-check (Evaluation)
- fa-handshake (Placement)
- fa-shield-check (Quality)

---

## 🔧 Implementación Técnica

### Archivos a Modificar:

1. **consulting.html** (3 cambios):
   - [ ] Agregar nueva sección "Servicios de Desarrollo de Talento"
   - [ ] Agregar 3 nuevos service cards
   - [ ] Agregar 3 nuevos modales detallados

2. **consulting.js** (1 cambio):
   - [ ] Actualizar `initializeServiceModals()` con nuevos IDs:
     ```javascript
     const serviceModals = {
         'automation': document.getElementById('automation-service-modal'),
         'ai': document.getElementById('ai-service-modal'),
         'bi': document.getElementById('bi-service-modal'),
         'mentoring': document.getElementById('mentoring-service-modal'),
         'courses': document.getElementById('courses-service-modal'),
         'recruiting': document.getElementById('recruiting-service-modal')
     };
     ```

3. **consulting.css** (1 cambio):
   - [ ] Agregar estilos específicos para la nueva sección:
     ```css
     /* Talent Development Section Styling */
     #talent-services {
         background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
         border: 1px solid rgba(99, 102, 241, 0.2);
     }
     ```

4. **translations.js** (1 cambio mayor):
   - [ ] Agregar ~60 nuevas keys de traducción para:
     - 3 service cards (title, desc)
     - 3 modales completos (title, subtitle, benefits, format, investment, ideal_for, success_case, cta)

---

## 📝 Copy Marketing para Cada Servicio

### 1. MENTORÍAS TECH 1-A-1

**Card Title (ES)**: "Mentorías Tech Personalizadas"
**Card Title (EN)**: "1-on-1 Tech Mentoring"

**Card Description (ES)**:
"Destranque su carrera tech con mentoría personalizada. Desde debugging de código hasta transición a roles senior. Sesiones prácticas enfocadas en sus desafíos reales."

**Card Description (EN)**:
"Unlock your tech career with personalized mentoring. From code debugging to transitioning to senior roles. Practical sessions focused on your real challenges."

**Modal - Headline (ES)**:
"De Developer a Leader: Su Mentor con Experiencia Real"

**Modal - Subtitle (ES)**:
"6+ años en MercadoLibre, de ingeniero a Technical Leader. Docente en Henry y UADE. Conozco el camino porque lo recorrí."

**Modal - Beneficios**:
- 🎯 **Consultas Técnicas Puntuales**: SQL complejo, arquitectura de pipelines, optimización de dashboards
- 📈 **Crecimiento Profesional**: Transición junior → senior, preparación entrevistas, negociación salarial
- 🚀 **Proyectos de Portfolio**: Guía para crear proyectos impactantes que llamen la atención
- 💡 **Decisiones de Arquitectura**: RAG, LLMs, ML pipelines, BI stack, cloud design
- 🧠 **Mindset de Liderazgo**: De IC a Tech Lead, gestión de equipos, stakeholder management

**Modal - Formato**:
- **Sesión Única**: USD 80/hora (ideal para consultas puntuales)
- **Pack 4 Sesiones**: USD 280 (ahorro 12%, seguimiento continuo)
- **Mentoría Mensual**: USD 250/mes (2 sesiones + consultas async ilimitadas por Slack/WhatsApp)

**Modal - Ideal Para**:
- Data Analysts queriendo ser Data Engineers
- Engineers junior apuntando a roles senior
- Profesionales de otras áreas transitando a tech
- Freelancers armando portfolio para conseguir clientes

**Modal - Caso de Éxito**:
"Juan, Data Analyst con 2 años de exp, pasó a Sr Data Engineer en 8 meses. Resultado: aumento salarial del 45% + remote internacional."

---

### 2. CURSOS INTENSIVOS GRUPALES

**Card Title (ES)**: "Cursos Intensivos para Equipos"
**Card Title (EN)**: "Intensive Team Training"

**Card Description (ES)**:
"UpSkilling en grupos ultra-reducidos (máx 4 personas). SQL, Analytics, Data Science, GenAI y Automatización. Atención personalizada + proyecto real incluido."

**Card Description (EN)**:
"UpSkilling in ultra-small groups (max 4 people). SQL, Analytics, Data Science, GenAI and Automation. Personalized attention + real project included."

**Modal - Headline (ES)**:
"Capacitación Tech Boutique: Grupos de Máximo 4 Personas"

**Modal - Subtitle (ES)**:
"No más cursos masivos donde sos un número. Aquí cada participante importa. Contenido práctico + proyectos reales + feedback individualizado."

**Modal - Cursos Disponibles**:

1. **SQL para Analytics** (5 semanas - 10 clases)
   - De SELECT básico a Window Functions
   - Optimización de queries y performance
   - Proyecto: Dashboard con KPIs reales
   - Precio: USD 450/persona

2. **Python para Data Analytics** (6 semanas - 12 clases)
   - Pandas, NumPy, Matplotlib, Seaborn
   - Web scraping y APIs
   - Proyecto: EDA completo + reporte ejecutivo
   - Precio: USD 550/persona

3. **Data Science End-to-End** (6 semanas - 12 clases)
   - ML supervisado/no supervisado
   - Feature engineering, validación, deployment
   - Proyecto: Modelo predictivo en producción
   - Precio: USD 600/persona

4. **GenAI & Automatización Práctica** (5 semanas - 10 clases)
   - Prompting avanzado, RAG, LangChain
   - n8n para workflows inteligentes
   - Proyecto: Chatbot con IA + automatización real
   - Precio: USD 500/persona

5. **Power BI para Business** (4 semanas - 8 clases)
   - Modelado de datos, DAX, visualización
   - Storytelling con datos
   - Proyecto: Dashboard ejecutivo completo
   - Precio: USD 400/persona

**Modal - Formato**:
- 2 clases/semana (2 horas cada una)
- Modalidad: Online sincrónico vía Google Meet
- Incluye: Grabaciones + materiales + ejercicios + proyecto final
- Soporte async por Slack durante todo el curso
- Certificado con proyecto aprobado

**Modal - Inversión**:
- **Individual**: USD 400-600 según curso
- **Empresas (2-4 personas)**: 15% descuento
- **Early Bird**: 10% descuento inscribiéndose 2 semanas antes

**Modal - Ideal Para**:
- Equipos pequeños buscando upskilling coordinado
- Profesionales que prefieren aprendizaje colaborativo
- Empresas invirtiendo en capacitación interna
- Grupos de estudio queriendo instructor experto

**Modal - Próximas Fechas**:
- Cursada Marzo 2026: SQL + GenAI
- Cursada Abril 2026: Python Analytics + Power BI
- Cursada Mayo 2026: Data Science

---

### 3. RECLUTAMIENTO TECH ESPECIALIZADO

**Card Title (ES)**: "Reclutamiento Tech Especializado"
**Card Title (EN)**: "Specialized Tech Recruitment"

**Card Description (ES)**:
"Encontramos y evaluamos talento en Data, GenAI y Automation. Evaluación técnica real por un Technical Leader con 6+ años en MercadoLibre."

**Card Description (EN)**:
"We find and evaluate talent in Data, GenAI and Automation. Real technical evaluation by a Technical Leader with 6+ years at MercadoLibre."

**Modal - Headline (ES)**:
"Reclutamiento con Evaluación Técnica Real"

**Modal - Subtitle (ES)**:
"No contrate a ciegas. Evaluamos candidatos con el mismo rigor que usamos en MercadoLibre. Usted recibe un reporte técnico detallado de cada finalista."

**Modal - Nuestro Proceso**:

**Semana 1: Discovery**
- Workshop con stakeholders (2hrs)
- Definición precisa del perfil técnico
- Identificación de red flags y must-haves
- Entregable: Job description + criterios de evaluación

**Semana 2: Sourcing & Pre-screening**
- Búsqueda activa: LinkedIn + comunidades tech + referidos
- Pre-screening de CVs (filtramos 80% rápido)
- Primera llamada telefónica (15min) con candidatos prometedores
- Entregable: Longlist de 5-7 candidatos

**Semana 3: Evaluación Técnica**
- Challenge técnico realista (no algoritmos teóricos de LeetCode)
- Entrevista técnica profunda (60min) por mí directamente
- Code review con feedback detallado
- Verificación de referencias técnicas
- Entregable: Shortlist 2-3 finalistas + reporte técnico detallado

**Semana 4: Cierre**
- Presentación de finalistas con scoring comparativo
- Acompañamiento en entrevistas finales (opcional)
- Negociación salarial y offer letter
- Entregable: Candidato seleccionado + backup plan

**Modal - Perfiles que Reclutamos**:

| Rol | Seniority | Áreas de Evaluación |
|-----|-----------|---------------------|
| Data Analyst | Jr → Sr | SQL, Python, BI tools, storytelling |
| Data Engineer | Jr → Sr | Python/SQL, pipelines, cloud, data modeling |
| BI Developer | Jr → Semi-Sr | Power BI/Looker, DAX, SQL, design |
| Data Scientist | Jr → Sr | ML, stats, Python, deployment, business sense |
| Automation Engineer | Jr → Sr | n8n, Python, APIs, problem solving |
| GenAI Engineer | Jr → Semi-Sr | LLMs, RAG, LangChain, Python |

**Modal - Inversión**:

**Opción 1: Success-Based (recomendado)**
- USD 1,500 solo si contrata al candidato
- Sin costo upfront
- Garantía: 3 meses de reemplazo sin cargo si no funciona

**Opción 2: Retainer Mensual**
- USD 800/mes con búsquedas ilimitadas
- Ideal para empresas con hiring recurrente
- Incluye: 2 búsquedas activas simultáneas + pre-screening ilimitado

**Modal - Por Qué Elegirnos**:
- ✅ **Evaluación Real**: Yo evalúo técnicamente (Technical Leader MercadoLibre)
- ✅ **Network de Calidad**: Acceso a comunidades tech de Argentina
- ✅ **Proceso Ágil**: 2-3 semanas promedio (vs 6-8 semanas de recruiters tradicionales)
- ✅ **Transparencia**: Feedback continuo + reporte técnico detallado
- ✅ **Garantía**: 3 meses de reemplazo sin costo

**Modal - Casos de Éxito**:
"Startup fintech necesitaba Sr Data Engineer. 15 candidatos evaluados, 3 finalistas presentados. Contrataron en semana 4. El candidato sigue en la empresa 18 meses después con performance excepcional."

---

## 🎯 CTA Strategy por Servicio

### Mentorías:
- Primary CTA: "Agendar Primera Sesión" → Calendly directo
- Secondary CTA: "Ver Disponibilidad" → Calendly con calendarios

### Cursos:
- Primary CTA: "Inscribirme a Próxima Cursada" → Form con datos + curso de interés
- Secondary CTA: "Descargar Programa Completo" → PDF con temario detallado

### Recruiting:
- Primary CTA: "Solicitar Discovery Call" → Calendly específico recruiting (60min)
- Secondary CTA: "Enviar Job Description" → Form con upload de JD

---

## 📊 Analytics Tracking para Nuevos Servicios

Agregar eventos en `consulting.js`:

```javascript
// Track mentoring interest
serviceCards['mentoring'].addEventListener('click', () => {
    trackConversion('service_view', {
        service_type: 'mentoring',
        value: 80, // Session price
        items: [{
            item_id: 'mentoring_session',
            item_name: 'Tech Mentoring Session',
            item_category: 'talent_development',
            price: 80
        }]
    });
});

// Track course interest
serviceCards['courses'].addEventListener('click', () => {
    trackConversion('service_view', {
        service_type: 'courses',
        value: 500, // Avg course price
        items: [{
            item_id: 'intensive_course',
            item_name: 'Tech Intensive Course',
            item_category: 'talent_development',
            price: 500
        }]
    });
});

// Track recruiting interest
serviceCards['recruiting'].addEventListener('click', () => {
    trackConversion('service_view', {
        service_type: 'recruiting',
        value: 1500, // Success fee
        items: [{
            item_id: 'tech_recruiting',
            item_name: 'Specialized Tech Recruitment',
            item_category: 'talent_development',
            price: 1500
        }]
    });
});
```

---

## 🚀 Orden de Implementación Sugerido

### Fase 1: Setup (1 paso)
- [ ] Crear branch `feature/talent-development-services`

### Fase 2: Traducciones (1 archivo)
- [ ] Agregar todas las keys en `translations.js`

### Fase 3: HTML - Service Cards (1 sección)
- [ ] Agregar sección "Servicios de Desarrollo de Talento" en consulting.html
- [ ] Agregar 3 service cards (mentoring, courses, recruiting)

### Fase 4: HTML - Modales (3 modales)
- [ ] Crear modal detallado para Mentorías
- [ ] Crear modal detallado para Cursos
- [ ] Crear modal detallado para Recruiting

### Fase 5: JavaScript (1 actualización)
- [ ] Actualizar `initializeServiceModals()` en consulting.js
- [ ] Agregar analytics tracking para nuevos servicios

### Fase 6: CSS (estilos específicos)
- [ ] Agregar estilos para nueva sección
- [ ] Verificar responsive design

### Fase 7: Testing
- [ ] Verificar funcionamiento de modales
- [ ] Verificar traducciones en ambos idiomas
- [ ] Verificar responsive en mobile/tablet/desktop
- [ ] Verificar analytics tracking

---

## 💡 Consideraciones de Marketing

### Jerarquía de Servicios:

**Servicios Tecnológicos** (B2B - Empresas):
- Entrada baja: Automatización gratis
- Ticket promedio: USD 100-500/mes
- Cliente ideal: Pymes 5-50 empleados

**Servicios de Talento** (B2C + B2B):
- Entrada media: Sesión mentoría USD 80
- Ticket promedio: USD 400-1,500
- Cliente ideal: 
  - B2C: Profesionales tech buscando crecer
  - B2B: Empresas contratando o capacitando

### Cross-selling Opportunities:

1. **Cliente de Automatización** → Puede necesitar capacitar a su equipo en las nuevas herramientas
2. **Mentee de Carrera** → Puede referir su empresa para servicios de automatización
3. **Empresa que recluta** → Puede necesitar upskilling del equipo actual
4. **Alumno de Curso** → Puede necesitar mentoría 1-a-1 post-curso

---

## 🎨 Wireframe Visual

```
┌─────────────────────────────────────────────────────┐
│              HERO + FREE AUTOMATION                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│        SERVICIOS TECNOLÓGICOS (3 actuales)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 🤖 Auto  │  │ 🧠 GenAI │  │ 📊 BI    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ✨ NUEVO: SERVICIOS DE DESARROLLO DE TALENTO       │
│     (Background con gradiente indigo → purple)      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 🎓 Mentor│  │ 👥 Cursos│  │ 🔍 Recrui│          │
│  │   1-a-1  │  │  Grupos  │  │   ting   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                PACKS (sin cambios)                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              EXAMPLES (sin cambios)                 │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] Traducciones completas (ES + EN)
- [ ] 3 Service cards agregadas con diseño distintivo
- [ ] 3 Modales detallados con toda la info
- [ ] JavaScript actualizado con nuevos modals
- [ ] CSS con estilos para nueva sección
- [ ] Analytics tracking funcionando
- [ ] Responsive design verificado
- [ ] CTAs configurados (Calendly + Forms)
- [ ] Testing en dark/light mode
- [ ] SEO metadata actualizado

---

## 🎉 Resultado Esperado

Una página de consulting que:
1. Mantiene su propuesta de valor principal (automatización gratis)
2. Expande su oferta a desarrollo de talento humano
3. Posiciona a Mariano como consultor 360° (tech + people)
4. Genera múltiples puntos de entrada según el perfil del visitante
5. Crea oportunidades de cross-selling entre servicios
6. Mantiene coherencia visual y UX excepcional
