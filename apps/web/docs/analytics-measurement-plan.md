# Plan de medición GA4 — MGA Tech Consulting

Actualizado: 20 de agosto de 2026.

## Preguntas que debe responder

1. ¿Qué contenido y herramienta generan interés real, no sólo una visita?
2. ¿En qué paso se abandona cada formulario o simulador?
3. ¿Qué canal produce leads confirmados por el backend?
4. ¿Qué oferta inicia checkout y qué operación termina en compra verificada?
5. ¿Los fallos son de datos, interfaz, webhook o proveedor externo?

## Modelo

- Contexto común: `site_section`, `page_type`, idioma y modo navegador/PWA.
- Contenido: selección, 30 segundos + 50%, 90%, guardado y compartido.
- Herramientas: vista, primera interacción, resultado, error y recuperación.
- Formularios: vista, inicio, validación, intento, entrega del webhook y lead.
- Comercio: catálogo, producto, checkout, retorno y compra server-side.
- Privacidad: parámetros sanitizados, URLs sin query/hash, datos financieros en bandas y consentimiento previo.

La taxonomía y el checklist operativo viven en [docs/runbooks/analytics.md](../../../docs/runbooks/analytics.md).

## Propiedad compartida

Las aplicaciones MGA, Neil y El Portugués comparten propiedad, pero siempre emiten `site_section` y `client_name`. Los reportes deben segmentarse por esas dimensiones antes de comparar resultados.

## Criterio de conversión

Una acción se considera resultado sólo cuando hay evidencia suficiente:

- Lead: webhook exitoso.
- Newsletter: webhook exitoso.
- Video completo: estado final real del reproductor.
- Lectura: tiempo activo y profundidad.
- Compra: Webhook firmado, consulta server-side e idempotencia.

Un clic, un retorno de URL o una pantalla de agradecimiento no constituyen por sí mismos una conversión confirmada.
