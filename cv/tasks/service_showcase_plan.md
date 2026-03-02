# Plan de Implementación: Services Showcase

Este plan detalla la implementación de las herramientas interactivas para demostrar los servicios de consultoría de Mariano Gobea Alcoba.

## Estado Actual

- [x] **Calculadora de ROI de Automatización**: Implementada y funcional en `/recursos#roi`.
- [x] **Integración Consulting Hero**: Botones premium y enlaces directos a ROI e IA Assistant.

## Próximos Pasos

### 1. Auditor de "Salud de Datos" (AI Audit)

Demuestra el expertise en Data Engineering mediante un diagnóstico rápido.

- **UI**: Textarea para pegar muestras de datos (JSON/CSV) o descripción de stack.
- **n8n Workflow**: Nuevo trigger que recibe la muestra, la procesa con un Prompt de "Senior Data Architect" y devuelve Score y Issues.

### 2. Visualizador de Arquitectura Dinámico

Muestra cómo se conectan las piezas de una solución tech.

- **Librería**: Uso de un canvas SVG interactivo o `react-flow`.
- **Funcionalidad**: El usuario elige conectores y el componente explica el flujo.

### 3. Live Dashboard del Agente (Transparency BI)

Muestra el éxito del actual asistente como "caso de éxito".

- **Métricas**: Consultas totales, leads generados, tiempo de respuesta.
- **Data Source**: Consultas directas a Supabase.

---

_Referencia: Ver plan extendido en `/Users/mgobea/.gemini/antigravity/brain/77f56122-69bf-4c3f-bc4c-1b950e282eb8/showcase_services_plan.md`_
