# SCAFFOLDING - Mariano Gobea Alcoba's Interactive CV & Consulting Platform

## 📋 Project Summary

Una plataforma integral de CV interactivo y consultoría profesional desarrollada con tecnologías web modernas y arquitectura optimizada. El scaffolding proporciona una estructura modular, escalable y de alto rendimiento para mantener y extender eficientemente tanto el portfolio personal como las características de consultoría empresarial.

## ⚡ **ARQUITECTURA OPTIMIZADA (2024-2026)**

### **Performance Achievements**
- **Bundle Size**: -40% (315KB → 190KB inicial)
- **Code Duplication**: -100% (0 líneas duplicadas)
- **Production Logs**: -100% (logging condicional)
- **Image Loading**: -77% inicial (lazy loading inteligente)
- **Time to Interactive**: +40% mejorado

### **Enterprise-Ready Architecture**
- ✅ **Modular Design**: Separación clara de responsabilidades
- ✅ **Zero Duplication**: DRY principles aplicados completamente
- ✅ **Conditional Logging**: Sistema profesional dev/prod
- ✅ **Code Splitting**: Carga bajo demanda de features
- ✅ **Lazy Loading**: Optimización de recursos y imágenes

### **🆕 Traffic Growth Features (V3.0 - 2026)**
- ✅ **Dashboard Inversiones**: Comparador en tiempo real con datos de APIs
- ✅ **Blog Técnico**: Sistema Markdown + videos YouTube para SEO
- ✅ **Simulador Sueldo**: Calculadora inversa para negociaciones
- ✅ **Newsletter**: Sistema de captura de audiencia con Mailchimp

## 🏗️ Project Structure (Actual - Febrero 2026)

```
Mgobeaalcoba.github.io/
│
├── 📄 PÁGINAS HTML
│   ├── index.html                 # Página principal CV (Portfolio) + Widget Dashboard
│   ├── consulting.html            # Página servicios consultoría
│   ├── recursos.html              # Recursos útiles/calculadoras/dashboard/simulador
│   ├── blog.html                  # 🆕 Blog técnico con posts y videos
│   ├── blog-post.html             # 🆕 Template para posts individuales
│   ├── ing_req_game.html          # Juego interactivo de Ingeniería de Requisitos
│   └── model_ganancias.html       # Modelo calculadora ganancias (legacy/standalone)
│
├── 📁 blog/                       # 🆕 Contenido del blog
│   ├── 📁 posts/                  # Posts en Markdown
│   │   ├── 2026-02-01-optimizar-queries-mercadolibre.md
│   │   ├── 2026-02-08-python-automatizar-impuestos-argentina.md
│   │   ├── 2026-02-15-errores-comunes-data-pipelines.md
│   │   └── 2026-02-22-negociacion-salarial-it-argentina-2026.md
│   ├── blog-index.json            # Metadata de posts
│   └── videos.json                # Catálogo de videos YouTube
│
├── 📁 assets/
│   │
│   ├── 📁 css/                    # Estilos organizados por módulos
│   │   ├── base.css               # Reset y estilos base (169 lines)
│   │   ├── main.css               # Estilos principales y variables CSS (225 lines)
│   │   ├── components.css         # Estilos componentes compartidos (1000+ lines)
│   │   ├── consulting.css         # Estilos específicos consultoría (190 lines)
│   │   ├── recursos.css           # Estilos página recursos + dashboard (4000+ lines)
│   │   ├── blog.css               # 🆕 Estilos blog y posts (400+ lines) (V3.0)
│   │   ├── game.css               # Estilos juego requisitos (400+ lines)
│   │   ├── terminal.css           # Estilos modo terminal (76 lines)
│   │   ├── intro.css              # Estilos animación introducción (252 lines)
│   │   ├── themes.css             # Definiciones de temas (1 line - imports)
│   │   └── styles.css             # Archivo principal importador CSS (126 lines)
│   │
│   ├── 📁 js/                     # JavaScript Modular (ES6+) OPTIMIZADO
│   │   ├── app.js                 # ⚡ Orquestador principal aplicación
│   │   ├── init.js                # ⚡ Script inicialización principal
│   │   ├── main.js                # ⚡ Lógica aplicación principal
│   │   ├── consulting.js          # ⚡ Funcionalidad página consultoría
│   │   ├── recursos.js            # ⚡ Funcionalidad página recursos (3500+ lines)
│   │   ├── game.js                # 🎮 Lógica juego ingeniería requisitos
│   │   ├── logger.js              # 🆕 Sistema logging condicional dev/prod
│   │   ├── mobile-menu.js         # 🆕 Servicio centralizado menú móvil
│   │   ├── image-optimizer.js     # 🆕 Sistema optimización imágenes lazy
│   │   ├── translation-loader.js  # 🆕 Carga lazy traducciones
│   │   ├── dashboard-inversiones.js  # 🆕 Dashboard salud económica (V3.0)
│   │   ├── simulador-sueldo.js    # 🆕 Simulador neto/bruto (V3.0)
│   │   ├── blog.js                # 🆕 Sistema de blog Markdown (V3.0)
│   │   ├── newsletter.js          # 🆕 Newsletter subscription system (V3.0)
│   │   ├── data-index.js          # ⚡ Datos CV específicos index (code splitting)
│   │   ├── translations.js        # ⚡ Traducciones completas ES/EN (900+ keys)
│   │   ├── terminal.js            # ⚡ Funcionalidad terminal (dynamic import)
│   │   ├── themes.js              # ⚡ Gestión temas (dark/light/terminal)
│   │   ├── intro.js               # ⚡ Animación introducción
│   │   ├── pdf.js                 # ⚡ Generación PDF
│   │   ├── utils.js               # ⚡ Utilidades y funciones helper
│   │   ├── config.js              # ⚡ Configuración centralizada
│   │   └── resources-config.json  # 📋 Configuración recursos externos
│   │
│   ├── 📁 images/                 # Imágenes proyecto OPTIMIZADAS
│   │   ├── profile.png            # 🚀 Imagen perfil CV (preload crítico)
│   │   ├── new_profile_photo.png  # Foto perfil alternativa
│   │   ├── meli.jpg               # 🚀 Logo MercadoLibre (preload)
│   │   ├── logo.png               # Logo principal sitio
│   │   ├── logo_claro.png         # Logo versión clara
│   │   ├── logo_oscuro.png        # Logo versión oscura
│   │   ├── logo_claro_recortado.png    # Logo claro recortado (favicon)
│   │   ├── logo_oscuro_recortado.png   # Logo oscuro recortado
│   │   ├── portfolio_claro_logo.png    # Logo portfolio claro
│   │   ├── portfolio_oscuro_logo.png   # Logo portfolio oscuro
│   │   ├── chatbot.jpg            # ⚡ Caso estudio consultoría (lazy loading)
│   │   ├── feedback.jpg           # ⚡ Ejemplo análisis IA (lazy loading)
│   │   ├── ventas.jpg             # ⚡ Ejemplo dashboard ventas (lazy loading)
│   │   ├── inventario.jpg         # ⚡ Ejemplo control inventario (lazy loading)
│   │   ├── marketing_flow.png     # Diagrama flujo marketing
│   │   ├── operation_flow.png     # Diagrama flujo operaciones
│   │   ├── rrhh_flow.png          # Diagrama flujo RRHH
│   │   └── ventas_flow.png        # Diagrama flujo ventas
│   │
│   └── 📁 docs/                   # Documentos y recursos PDF
│       ├── Deducciones-personales-art-30-ene-a-jun-2026.pdf   # Deducciones AFIP 2026
│       ├── Tabla-Art-94-LIG-per-ene-a-jun-2026.pdf           # Escala impuesto ganancias
│       ├── descuentos_maximos_aportes.md                      # Topes aportes seguridad social
│       └── Profile (10).pdf                                   # CV en PDF
│
├── 📋 CONFIGURACIÓN Y METADATOS
│   ├── package.json               # Dependencias proyecto y scripts npm
│   ├── .gitignore                 # Archivos ignorados por Git
│   ├── .pre-commit-config.yaml    # Configuración pre-commit hooks
│   ├── robots.txt                 # Directivas para crawlers
│   ├── sitemap.xml                # Mapa del sitio para SEO
│   └── humans.txt                 # Créditos humanos del proyecto
│
├── 📚 DOCUMENTACIÓN
│   ├── README.md                  # Documentación principal proyecto
│   ├── SCAFFOLDING.md             # Documentación técnica estructura (este archivo)
│   ├── CHANGELOG.md               # Historial de versiones
│   ├── CODE_ANALYSIS.md           # Análisis de optimizaciones de código
│   ├── BRIEF.md                   # Brief del proyecto
│   ├── CLAUDE.md                  # Instrucciones para AI assistants
│   ├── SEO_PLAN.md                # Plan de optimización SEO
│   └── LICENSE                    # Licencia MIT
│
└── (archivos de test eliminados)
```

## 🎯 Páginas y Rutas de Navegación

### **Mapa de Navegación**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         index.html                                   │
│                  (Portfolio Principal + Widget Dashboard)            │
│  ┌─────────┬─────────┬─────────┬─────────────────┬────────────────┐ │
│  │    ↓    │    ↓    │    ↓    │        ↓        │       ↓        │ │
│  ▼         ▼         ▼         ▼                 ▼                │ │
│consulting blog   recursos  ing_req_game   Secciones internas:   │ │
│  .html    .html   .html      .html         #about, #projects,   │ │
│                                            #experience, #contact │ │
└─────────────────────────────────────────────────────────────────────┘
        │         │        │
        │         │        │
        ▼         ▼        ▼
┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐
│ consulting    │ │   blog.html   │ │   recursos.html      │
│    .html      │ │               │ │                      │
│               │ │ Secciones:    │ │ Secciones:           │
│ Secciones:    │ │ - Posts list  │ │ #calculadoras        │
│ #services     │ │ - Categories  │ │ #dashboard 🆕        │
│ #packs        │ │ - Videos      │ │ #cotizaciones        │
│ #examples     │ │               │ │ #indicadores         │
│ #process      │ │ Posts:        │ │                      │
│ #about        │ │ blog-post.html│ │ Features:            │
│ #contact      │ │ (dynamic)     │ │ - Simulador 🆕       │
└───────────────┘ └───────────────┘ └──────────────────────┘
        ◄──────────────┬──────────────►
                   Newsletter Banner
                   (presente en todas)

Nota: model_ganancias.html es standalone (sin navegación directa)
```

### **Detalle de Páginas**

| Página | Propósito | CSS | JS | Navegación |
|--------|-----------|-----|----|-----------| 
| `index.html` | Portfolio/CV principal + Widget Dashboard | `styles.css` (importa todos) | `init.js`, `dashboard-inversiones.js` | Hub central |
| `consulting.html` | Servicios consultoría | `consulting.css` | `consulting.js`, `newsletter.js` | Bidireccional con todas |
| `blog.html` | 🆕 Blog técnico posts/videos | `blog.css` | `blog.js`, `newsletter.js` | Bidireccional con todas |
| `blog-post.html` | 🆕 Post individual dinámico | `blog.css` | `blog.js` | Desde blog.html |
| `recursos.html` | Herramientas + Dashboard + Simulador | `recursos.css` | `recursos.js`, `dashboard-inversiones.js`, `simulador-sueldo.js`, `newsletter.js` | Bidireccional con todas |
| `ing_req_game.html` | Juego educativo | `game.css` | `game.js` | Solo retorno a index |
| `model_ganancias.html` | Calculadora standalone | Inline (Tailwind CDN) | Inline | Sin navegación (legacy) |

## 📁 **MÓDULOS CSS**

### `base.css` (169 lines)
- CSS Reset y estilos base
- Tipografía y elementos fundamentales
- Variables CSS globales

### `main.css` (225 lines)
- Variables CSS sistema temas
- Estilos principales layouts
- Estilos base componentes compartidos

### `components.css` (389 lines)
- Cards proyectos, experiencia, educación
- Elementos interactivos y animaciones
- Consistencia cross-page

### `consulting.css` (190 lines)
- Estilos específicos página consultoría
- Cards service packs y modales
- Efectos glassmorphism

### `recursos.css` (3400+ lines)
- Estilos calculadora impuestos
- Cotizaciones de monedas
- Indicadores económicos
- Charts y gráficos
- Widgets financieros
- Light/Dark mode específico

### `game.css` (400+ lines)
- Estilos juego 3D
- Animaciones y efectos
- UI elementos del juego

### `terminal.css` (76 lines)
- Estilos modo terminal
- Efecto Matrix
- Input/output terminal

### `intro.css` (252 lines)
- Animaciones introducción
- Overlay y controles
- Efectos typing

### `themes.css` (1 line)
- Coordinación imports temas

### `styles.css` (126 lines)
- Archivo principal importador
- Utilidades globales

## 📁 **MÓDULOS JAVASCRIPT**

### **Módulos Core**

#### `init.js` - Inicialización Principal
- Punto de entrada para index.html
- Carga de módulos
- Configuración inicial

#### `app.js` - Orquestador
- Logging integration
- Error handling
- Performance monitoring
- Cross-page state

#### `main.js` - Lógica Principal
- Funcionalidad CV
- Interacciones usuario
- Gestión estados

#### `consulting.js` - Página Consultoría
- Modales interactivos
- Cards servicios
- Formularios contacto

#### `recursos.js` (3200+ lines) - Página Recursos
- Calculadora impuesto ganancias (con topes 2026)
- Cotizaciones dólar (oficial, blue, MEP, CCL)
- Indicadores económicos (inflación, UVA, riesgo país)
- Feriados Argentina
- Charts y gráficos interactivos
- Actualización tiempo real APIs

#### `game.js` - Juego Ingeniería Requisitos
- Three.js 3D rendering
- Lógica del juego
- Puntuación y niveles

### **Módulos de Optimización**

#### `logger.js` (45 lines)
```javascript
// Sistema logging condicional automático
- Detección automática entorno prod/dev
- Producción: Solo warn/error (silencioso)
- Desarrollo: Logs completos con timestamp
```

#### `mobile-menu.js` (89 lines)
```javascript
// Servicio centralizado menú móvil
- API flexible para todas las páginas
- Soporte ARIA y accessibility
- Escape key y click-outside
```

#### `image-optimizer.js` (67 lines)
```javascript
// Sistema optimización imágenes lazy loading
- IntersectionObserver API
- WebP detection automático
- Placeholders SVG con transiciones
```

#### `translation-loader.js` (34 lines)
```javascript
// Carga lazy traducciones por idioma
- Solo carga idioma activo (-50% data)
- Cache inteligente en memoria
- Fallback automático a español
```

### **Módulos de Features**

#### `translations.js` (800+ keys)
- Español (ES) - idioma por defecto
- English (EN) - traducción completa
- Cobertura: CV, Consulting, Recursos, UI, Terminal

#### `terminal.js` (367 lines)
- Dynamic import (lazy loading)
- Comandos CLI interactivos
- Efecto Matrix opcional

#### `themes.js`
- Dark mode (default)
- Light mode
- Terminal mode

#### `data-index.js` (453 lines)
- Datos CV específicos
- Code splitting (solo carga en index.html)

#### `utils.js` (343 lines)
- Funciones helper
- Device detection
- Performance monitoring

#### `pdf.js`
- Generación PDF del CV

#### `intro.js`
- Animación de introducción

#### `config.js`
- Configuración centralizada

## 🔄 **FLUJOS DE INICIALIZACIÓN**

### index.html (Portfolio)
```
1. HTML Loading
2. Logger Init (prod/dev detection)
3. Module Import (init.js)
4. Mobile Menu Service
5. Image Optimizer (lazy loading)
6. Theme Init (saved theme)
7. Translation Load (active language)
8. Content Population (CV data)
9. Intro Animation
10. Application Ready
```

### consulting.html
```
1. HTML Loading
2. Logger Init (synced)
3. Module Import (consulting.js)
4. Mobile Menu (consulting config)
5. Image Lazy Loading (case studies)
6. Translation Setup
7. Modal System Init
8. Event Listeners
9. Theme/Language Sync
10. Page Ready
```

### recursos.html
```
1. HTML Loading
2. Logger Init
3. Module Import (recursos.js)
4. Mobile Menu Service
5. Theme Init
6. Translation Load
7. Tax Calculator Init (Chart.js)
8. Currency Rates Fetch (APIs)
9. Economic Indicators Load
10. Holidays Argentina Load
11. Event Listeners
12. Application Ready
```

### ing_req_game.html
```
1. HTML Loading
2. Three.js Init
3. Game.js Load
4. 3D Scene Setup
5. Game Logic Init
6. Event Listeners
7. Game Ready
```

## 🌍 **SISTEMA INTERNACIONALIZACIÓN**

### **Translation Categories**
- **CV Content**: Experiencia, educación, proyectos
- **Consulting Services**: Paquetes, descripciones, proceso
- **Recursos**: Calculadoras, cotizaciones, indicadores
- **UI Elements**: Navegación, botones, labels
- **Terminal Commands**: Respuestas CLI
- **Error Messages**: Validación y errores

### **Features**
- 800+ translation keys
- Lazy loading por idioma
- Persistent state (localStorage)
- Cross-page consistency
- Chart labels dinámicos

## 📊 **MÉTRICAS PERFORMANCE**

### **Bundle Analysis**
```
Categoría              Inicial   Lazy      Total
─────────────────────────────────────────────────
JavaScript             145KB     110KB     255KB
CSS                    45KB      -         45KB
Imágenes              108KB     300KB     408KB
```

### **Core Web Vitals (Estimados)**
```
Métrica                 Valor     Status
─────────────────────────────────────────
LCP                     1.3s      ✅ Good
FID                     80ms      ✅ Good
CLS                     0.05      ✅ Good
TTI                     1.7s      ✅ Good
```

## 🎨 **SISTEMA TEMAS**

### Dark Mode (Default)
- Fondo oscuro con glass effects
- Texto claro y acentos azules
- Performance: Carga inmediata

### Light Mode
- Fondo claro con alto contraste
- Transición suave sin reflow

### Terminal Mode
- Interfaz CLI completa
- Efecto Matrix (lazy loaded)
- Dynamic import: 0KB inicial

## 🚀 **TERMINAL COMMANDS**

```bash
help                              # Lista comandos
about                             # Información CV
experience                        # Experiencia profesional
education                         # Educación y certificaciones
projects [--tag <tech>]           # Portfolio proyectos
contact                           # Información contacto
neofetch                          # Info sistema
matrix                            # Efecto Matrix (lazy)
clear                             # Clear terminal
gui                               # Volver vista normal
theme [dark|light|terminal]       # Cambiar tema
lang [es|en]                      # Cambiar idioma
performance                       # Métricas performance
debug [on|off]                    # Toggle debug mode
```

## 🔧 **DEVELOPMENT WORKFLOW**

### **Debug Mode (Localhost)**
```javascript
logger.debug('Component', 'Debug message', { data });
logger.success('Component', 'Success message');
logger.warn('Component', 'Warning message');
logger.error('Error occurred', error);
```

### **Production Mode (GitHub Pages)**
- Solo errores críticos logged
- Bundle optimizado
- Performance tracking habilitado

### **Commands**
```bash
npm run dev              # Servidor desarrollo
npm run analyze          # Análisis bundle
npm run lint             # Code linting
```

## 🏆 **LOGROS ARQUITECTURA**

### ✅ Enterprise-Ready
- Modular, mantenible, escalable
- Zero código duplicado (DRY)
- Separación clara responsabilidades
- Logging profesional contextual

### ✅ Performance First
- Bundle size -40% optimizado
- Lazy loading implementado
- Core Web Vitals buenos
- Time to Interactive +40%

### ✅ Developer Experience
- Debugging limpio (dev vs prod)
- Arquitectura documentada
- APIs consistentes
- Build process optimizado

### ✅ User Experience
- Carga rápida
- Imágenes lazy loading suaves
- Navegación responsive
- Funcionalidad completa

## 🚀 **NUEVAS CARACTERÍSTICAS V3.0 (FEBRERO 2026)**

### **Objetivo: Traffic Growth & User Engagement**

La versión 3.0 introduce 4 funcionalidades estratégicas diseñadas para aumentar tráfico recurrente y autoridad SEO:

#### 1️⃣ **Dashboard de Salud Económica**
- **Ubicación**: `recursos.html#dashboard-salud-economica` + widget en `index.html`
- **Funcionalidad**: Comparador visual de Plazo Fijo vs Dólar MEP vs Inflación
- **Datos**: APIs argentinas en tiempo real (dolarApi, argentinadatos)
- **Features**: Períodos configurables (7, 30, 90 días), exportar imagen para compartir
- **Objetivo**: Tráfico recurrente diario (check de inversiones)

#### 2️⃣ **Blog Técnico "Data Engineering en las Trincheras"**
- **Ubicación**: `blog.html` + posts individuales en `blog-post.html`
- **Sistema**: Markdown con frontmatter YAML + videos YouTube embebidos
- **Contenido Inicial**: 4 posts técnicos SEO-optimizados
- **Features**: Filtros por categoría, related posts, social sharing
- **Objetivo**: Tráfico orgánico SEO + thought leadership

#### 3️⃣ **Simulador Sueldo Neto/Bruto**
- **Ubicación**: `recursos.html#calculadoras` (tab 2 de calculadora)
- **Funcionalidad**: Calculadora inversa (ingresá neto deseado → obtené bruto necesario)
- **Algoritmo**: Newton-Raphson iterativo con aportes + impuesto a las Ganancias
- **Features**: Situación familiar, rango de negociación (±5%), desglose completo
- **Objetivo**: Viralidad social (herramienta para entrevistas laborales)

#### 4️⃣ **Newsletter "The Data Digest"**
- **Ubicación**: Footer banner en todas las páginas + popup opcional (30s delay)
- **Sistema**: Mailchimp integration (listo para configurar)
- **Smart Logic**: No molesta si suscrito, respeta cooldown, desktop-only popup
- **Contenido**: 3 noticias Data + 1 tip financiero semanal
- **Objetivo**: Captura y retención de audiencia

### **Métricas Esperadas**

| Feature | Objetivo Mes 1 | Tipo Tráfico |
|---------|---------------|--------------|
| Dashboard | >100 usuarios diarios | Recurrente |
| Blog | +200% tráfico orgánico | SEO/Orgánico |
| Simulador | >500 usos/mes | Viral/Social |
| Newsletter | >100 suscriptores | Retención |

### **Impacto en Arquitectura**

- **+4 nuevos módulos JS**: dashboard-inversiones.js, blog.js, simulador-sueldo.js, newsletter.js
- **+2 nuevas páginas HTML**: blog.html, blog-post.html
- **+1 nuevo CSS module**: blog.css
- **+80 translation keys**: Cobertura bilingüe completa
- **+~31KB bundle**: Impacto mínimo con lazy loading
- **+5 URLs en sitemap**: SEO coverage expandido

---

**Última actualización: Febrero 2026**

*Este scaffolding representa una arquitectura enterprise-ready con performance de primera clase y features estratégicas para crecimiento de audiencia.* 🚀
