# Plan de medición GA4 — MGA Tech Consulting

Actualizado: 15 de septiembre de 2026.

## Preguntas que debe responder

1. ¿Qué contenido y herramienta generan interés real, no sólo una visita?
2. ¿En qué paso se abandona cada formulario o simulador?
3. ¿Qué canal produce leads confirmados por el backend?
4. ¿Qué oferta inicia checkout y qué operación termina en compra verificada?
5. ¿Los fallos son de datos, interfaz, webhook o proveedor externo?

## Modelo

Tres capas, detalladas en el runbook:

1. **Recorrido (semántica)**: eventos nombrados por caso de uso.
2. **Interacción genérica**: delegación sobre cualquier elemento interactivo, instrumentado o no.
3. **Atención, espera y salud**: Web Vitals, long tasks, visibilidad, red y errores.

- Contexto común: `site_section`, `page_type`, idioma y modo navegador/PWA. Las rutas `/en/...` reportan el mismo `site_section` y `page_type` que su equivalente.
- Contenido: selección, 30 segundos + 50%, 90%, guardado y compartido.
- Herramientas: vista, primera interacción, resultado, error y recuperación.
- Formularios: vista, inicio, validación, intento, entrega del webhook y lead.
- Comercio: catálogo, producto, checkout, retorno y compra server-side.
- Interacción: `ui_click`, `ui_toggle`, `ui_focus`, `ui_copy`, `ui_view`, `ui_action` con `ui_element`, `ui_kind`, `ui_surface` y `ui_state`.
- Espera y atención: `data_wait`, `page_visibility`, `web_vitals`, `page_load_timing`, `main_thread_blocking`, `network_status`, `pwa_service_worker`, `page_not_found`.
- Privacidad: parámetros sanitizados con redacción automática de emails y teléfonos, URLs sin query/hash, datos financieros en bandas, nunca texto del elemento ni valores de inputs, y consentimiento previo.

## Cobertura automática

La capa genérica garantiza que todo elemento interactivo quede medido aunque nadie lo instrumente: un `data-analytics="id_estable"` mejora la legibilidad del reporte, y sin atributo el tracker deriva un id determinístico. Nunca lee texto ni valores. Tiene deduplicación de 400 ms, tope de 250 eventos por vista y sólo observa atajos de teclado con modificador, para que el texto tipeado no pueda filtrarse.

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

Un clic, un evento genérico (`ui_*`), un retorno de URL o una pantalla de agradecimiento no constituyen por sí mismos una conversión confirmada.
