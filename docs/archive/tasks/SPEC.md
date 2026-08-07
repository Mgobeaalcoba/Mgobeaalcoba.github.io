# Project SPEC: El Portugués S.A. - Premium Static Migration

## 1. Contexto & Objetivo
- **Cliente:** El Portugués S.A. (Empresa de Logística y Distribución).
- **Meta:** MVP de alto impacto visual alojado en GitHub Pages.
- **Inspiración Visual:** [travelx.io](https://www.travelx.io/). Estética "Deep Dark", moderna y tecnológica.
- **URL Destino:** `mgobeaalcoba.github.io/elportugues.html`

## 2. Tech Stack (Static-Only)
- **Framework:** Next.js 14+ (App Router) con configuración de salida estática (`output: 'export'`).
- **Styling:** Tailwind CSS (Dark Theme).
- **Animations:** Framer Motion (Scroll animations, Fade-ins).
- **Data Source:** `src/data/content.json` (Toda la información del sitio debe residir aquí).
- **Icons:** Lucide React.

## 3. Requerimientos de Diseño (Estilo XTravel)
- **Paleta de Colores:** - Fondo: `#000000` y `#0B1120` (Dark Navy).
  - Acento: `#0CC1C1` (Cyan/Teal) y `#2D4F8F` (Royal Blue).
  - Texto: Base `#FFFFFF`, Secundario `#94A3B8`.
- **Componentes:**
  - Hero con tipografía gigante y gradientes de texto.
  - Secciones con bordes sutiles (Glow effect) y Glassmorphism.
  - Cards de servicios con hover transitions suaves.

## 4. Migración de Contenidos (Scraping Task)
El agente debe extraer de `elportuguessa.com.ar`:
1. **Textos:** Historia (desde 1927), Servicios (Logística, Distribución, Almacenaje), flota de 70+ equipos, certificaciones ISO 9001.
2. **Imágenes:** Usar las URLs originales de las fotos de camiones, depósitos y logos encontradas en el sitio legacy. **NO usar placeholders externos**.
3. **Estructura JSON:** Organizar los datos en `content.json` con una interfaz TypeScript que permita migrar a una base de datos en el futuro.

## 5. Automatización & Analytics
- **Webhooks:** Implementar un servicio `src/services/webhookService.ts` que use `fetch` para enviar datos de formularios (Contact/Quotes) a una URL de n8n (placeholder en `.env`).
- **Tracking:** Configurar `lib/gtag.ts` con GA4. Eventos a trackear: `lead_form_sent`, `service_view`, `scroll_depth`.
- **Compatibilidad:** Dado que GitHub Pages no soporta rutas dinámicas de Next.js fácilmente, el proyecto debe generar un archivo `elportugues.html` (o configurar `trailingSlash: true`).

## 6. Reglas de Oro para el Agente
- **Autonomía:** Ejecutar scraping, estructurar JSON y diseñar UI sin preguntar.
- **Código Limpio:** Separar lógica de presentación. El consumo del JSON debe ser mediante una capa de "Repository" o "Service".
- **Asset Integrity:** Mantener las fotos del sitio original para preservar la identidad de la empresa.