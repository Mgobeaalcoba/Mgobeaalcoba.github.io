# Plan de Optimización SEO - Portfolio Mariano Gobea

## 📊 Estado Actual (Línea Base)

### Problemas Identificados ✅ RESUELTOS
- ❌ Logos no aparecen en resultados de Google (personal photo en lugar de logo profesional)
- ❌ Sitemap con errores de validación XML (caracteres `&` sin escapar)
- ❌ Títulos genéricos poco descriptivos
- ❌ Falta de SEO local para Buenos Aires
- ❌ Robots.txt básico sin optimizaciones
- ❌ Sin archivo humans.txt
- ❌ Eventos de Google Analytics no configurados como "key events"

## 🚀 Implementaciones Completadas

### 1. Corrección de Metadatos y Logos ✅
**Archivos modificados:** `index.html`, `consulting.html`, `recursos.html`, `sitemap.xml`

- **Portfolio:** Cambio a `portfolio_claro_logo.png`
- **Consulting:** Cambio a `logo_claro_recortado.png`
- **Favicon consulting:** Añadido `&mask=circle&p=8` para formato circular
- **Sitemap:** Caracteres `&` escapados correctamente (`&amp;`)

**Impacto esperado:** Mejora en rich snippets de Google

### 2. Optimización de Títulos ✅
- **Portfolio:** "CV" → "Data Engineer & Technical Leader | MercadoLibre Portfolio"
- **Consulting:** "Automatización & IA" → "Consultoría Tecnológica Buenos Aires | Automatización IA & BI"

**Impacto esperado:** 15-25% mejora en CTR

### 3. SEO Local Buenos Aires ✅
**Metadatos añadidos:**
```html
<meta name="geo.region" content="AR-B">
<meta name="geo.placename" content="Buenos Aires">
<meta name="geo.position" content="-34.6118;-58.3960">
<meta name="ICBM" content="-34.6118, -58.3960">
<meta name="business.type" content="Technology Consulting">
<meta name="service.area" content="Buenos Aires, Argentina">
```

### 4. Robots.txt Optimizado ✅
- Directivas específicas por motor de búsqueda
- Crawl-delay optimizado
- Referencias a sitemap y humans.txt

### 5. Humans.txt Creado ✅
- Información del equipo
- Detalles técnicos
- Contacto y ubicación

### 6. Structured Data ✅
- Breadcrumb navigation en página consulting
- Mejora para rich snippets

### 7. Google Analytics Optimizado ✅
**Archivos modificados:** `consulting.js`, `main.js`

- Eventos estándar GA4 implementados: `generate_lead`, `contact`, `file_download`, `form_submit`
- Funciones `trackConversion()` añadidas
- Eventos ecommerce: `view_item`, `begin_checkout`
- Eliminado delay problemático de 500ms
- Tracking de engagement mejorado

## 📈 Próximas Implementaciones (Por Orden de Prioridad)

### FASE 1: Contenido y Estructura (Semanas 1-2)

#### 1. Rich Snippets con FAQ Schema
**Objetivo:** Aparecer en "People Also Ask" de Google
**Implementación:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué servicios de automatización ofrecen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Implementamos soluciones de BI, automatización de procesos y desarrollo de sistemas de ML."
      }
    }
  ]
}
```
**Impacto esperado:** +20% visibilidad en búsquedas long-tail

#### 2. Sección de Blog/Artículos
**Objetivos:**
- Targeting long-tail keywords
- Demostrar expertise técnico
- Mejorar tiempo en sitio

**Artículos propuestos:**
- "Cómo implementar BI en PyMEs argentinas"
- "Automatización de procesos con Python: Casos reales"
- "ML en MercadoLibre: Insights desde adentro"
- "Migración a la nube: Guía para startups"

#### 3. Página de Casos de Estudio
**Estructura:**
- Problema → Solución → Resultados
- Métricas específicas de ROI
- Testimonios de clientes
- Call-to-actions optimizados

### FASE 2: Expansión y Alcance (Semanas 3-4)

#### 4. Versión en Inglés
**Objetivo:** Mercado internacional
**Dominios objetivo:**
- `/en/` para versión inglesa
- Hreflang tags implementados
- Contenido adaptado (no traducido)

#### 5. Video SEO
**Implementación:**
- VideoObject schema
- Transcripciones para accesibilidad
- Thumbnails optimizados
- Embed en páginas relevantes

### FASE 3: Link Building y Autoridad (Semanas 5-8)

#### 6. Estrategia de Link Building Local
**Targets identificados:**
- Cámaras de comercio BA
- Eventos tech Buenos Aires
- Universidades (UTN, UBA)
- Medios tech argentinos
- Directorios profesionales

#### 7. Guest Posting Strategy
**Objetivos:**
- 5-10 guest posts por trimestre
- Medios tech en español
- Backlinks de alta calidad
- Brand awareness

### FASE 4: Optimizaciones Técnicas Avanzadas (Semanas 9-12)

#### 8. Core Web Vitals Optimization
**Métricas objetivo:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

**Implementaciones:**
- Image lazy loading
- CSS crítico inline
- Service Worker para caching
- WebP images

#### 9. Mobile-First Improvements
- AMP para blog posts
- Progressive Web App features
- Touch-friendly interactions
- Mobile-specific CTAs

## 📊 KPIs y Métricas de Seguimiento

### Métricas Principales
1. **Posiciones promedio:** Objetivo <10 para keywords principales
2. **CTR orgánico:** Objetivo >5% (actual ~3%)
3. **Tráfico orgánico:** +50% en 6 meses
4. **Conversiones desde SEO:** +100% en 6 meses
5. **Domain Authority:** Objetivo >40

### Keywords Objetivo
**Portfolio (Data Engineer):**
- "data engineer mercadolibre"
- "ingeniero datos python argentina"
- "portfolio data science"
- "data engineer portfolio"

**Consulting (Automatización):**
- "consultoria automatizacion buenos aires"
- "automatizacion procesos python"
- "consultor bi argentina"
- "implementacion ml empresas"

### Herramientas de Seguimiento
- Google Search Console
- Google Analytics 4
- SEMrush/Ahrefs (mensual)
- Core Web Vitals (semanal)

## 🎯 Cronograma de Implementación

### Enero 2024
- ✅ Semana 1: Metadatos y logos (COMPLETADO)
- ✅ Semana 2: Títulos y SEO local (COMPLETADO)
- ✅ Semana 3: Analytics y technical SEO (COMPLETADO)
- 🔄 Semana 4: FAQ Schema + primer artículo

### Febrero 2024
- Semana 1: Blog estructura + 2 artículos
- Semana 2: Casos de estudio + testimonials
- Semana 3: Versión inglés planning
- Semana 4: Video content + schema

### Marzo 2024
- Semana 1: Link building campaigns
- Semana 2: Guest posting outreach
- Semana 3: Core Web Vitals optimization
- Semana 4: Mobile improvements

## 💰 ROI Esperado

### Costos Estimados
- Herramientas SEO: $100/mes
- Content creation: $500/mes
- Link building: $300/mes
- **Total mensual:** $900

### Retorno Esperado (6 meses)
- Leads orgánicos: +200%
- Consultas calificadas: +150%
- Brand awareness: +100%
- **ROI estimado:** 300-500%

## 📝 Notas de Implementación

### Próxima Acción Inmediata
1. Implementar FAQ Schema en consulting.html
2. Crear primer artículo de blog
3. Configurar tracking avanzado en GA4
4. Iniciar outreach para guest posting

### Consideraciones Técnicas
- Todas las modificaciones deben ser mobile-first
- Mantener Core Web Vitals óptimos
- Testear cambios en staging antes de producción
- Monitorear indexación post-cambios

---

**Última actualización:** Enero 2024  
**Responsable:** Mariano Gobea  
**Estado:** En progreso - Fase 1 