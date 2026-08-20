# Operación de Google Analytics 4

Actualizado: 20 de agosto de 2026. Propiedad: `G-DG0SLT5RY3`.

## Fundamentals

1. **Medir resultados, no ruido.** Cada funnel distingue vista, inicio, intento, resultado y error real.
2. **Una acción, un evento.** `generate_lead` se emite una sola vez y sólo después de que el webhook confirma el envío. Newsletter usa `newsletter_subscribe`; no es un alta de cuenta.
3. **Pageviews únicos y comparables.** Las tres apps usan `send_page_view: false` y envían un `page_view` manual por navegación, con `page_referrer` virtual en rutas SPA.
4. **Privacidad por diseño.** Consent Mode parte en `denied`. GA4 nunca recibe nombre, email, teléfono, mensaje, query strings, fragmentos, URLs `mailto:` ni importes financieros personales exactos.
5. **Valores sensibles en bandas.** Escenarios UVA, ingreso, ahorro y longitud de mensajes se agrupan; los resultados de negocio conservan utilidad sin reconstruir un perfil financiero.
6. **Éxito verificable.** Un retorno del navegador no equivale a una compra. `purchase` sólo se habilita desde una notificación de pago autenticada e idempotente.
7. **Errores accionables.** `app_error`, `tool_error` y `lead_webhook_error` usan códigos estables, nunca textos de excepción ni datos ingresados por el usuario.

## Funnels canónicos

| Caso | Secuencia |
| --- | --- |
| Formularios | `form_view` → `form_start` → `form_submit_attempt` → `lead_webhook_success` → `generate_lead` |
| Herramientas | `tool_view` → `tool_start` → `tool_result` o `tool_error` |
| Asistente | `ai_assistant_open` → `form_view` → `form_start` → `generate_lead` → `ai_assistant_message_sent` → `ai_assistant_response_result` |
| Artículos e informes | `page_view` → `content_engaged` → `content_complete` → `share` o `contact_click` |
| Videos | `video_select` → `video_start` → `video_progress` (25/50/75) → `video_complete` |
| Servicios | `view_item_list` → `select_item` → `view_item` → `begin_checkout` → `checkout_return` → `purchase` verificado |

`content_engaged` requiere al menos 30 segundos activos y 50% de profundidad. `content_complete` requiere 90% de profundidad. Los eventos se deduplican por contenido durante la sesión.

## Eventos clave a configurar en GA4 Admin

Marcar como key events:

- `generate_lead`
- `newsletter_subscribe`
- `purchase` (sólo después de activar la verificación server-side)
- `contact_channel_select`
- `whatsapp_click`
- `service_onboarding_complete`

No marcar por defecto clics, aperturas, simulaciones o `checkout_return`: sirven para diagnosticar el funnel, no prueban un resultado comercial.

## Definiciones personalizadas

Crear dimensiones de alcance evento para `site_section`, `page_type`, `client_name`, `user_lang`, `app_display_mode`, `form_type`, `source`, `channel`, `status`, `error_code`, `tool_id`, `result_type`, `content_type`, `content_id`, `video_id`, `progress_percent`, `item_id`, `offer_id`, `market_signal`, `market_range`, `monthly_uva_change_band` y `monthly_income_change_band`.

No registrar como dimensión valores de alta cardinalidad como `page_location`, títulos libres, transaction IDs o timestamps.

## Ajustes obligatorios en la propiedad

1. Confirmar que Enhanced Measurement no duplique `page_view` (`send_page_view` ya está desactivado en código).
2. Si Enhanced Measurement mide videos de YouTube, desactivar ese módulo: el reproductor propio ya emite los hitos y evita duplicados.
3. Mantener Google Signals sólo para quienes eligen “Analítica + Signals” en MGA principal.
4. Configurar retención y acceso con mínimo privilegio; revisar usuarios de la propiedad cada trimestre.
5. Crear filtros internos/desarrollo para `localhost` y tráfico del equipo, sin alterar datos históricos.
6. Validar cada release en DebugView y Realtime antes de usar los datos para decisiones.

## Compra verificada con Mercado Pago

La página de retorno sólo procesa `status`, `collection_status` y un `external_reference` perteneciente al catálogo local. Ignora IDs de pago, emails y parámetros desconocidos; emite `checkout_return`, nunca `purchase`.

Para activar `purchase`:

1. Crear preferencias de Checkout Pro desde un backend o n8n autenticado; no desde el navegador.
2. Incluir un `external_reference` de catálogo, nunca PII, y `back_urls` hacia `/servicios/gracias/`.
3. Recibir Webhooks de Mercado Pago por HTTPS, validar la firma secreta y consultar el pago con credenciales server-side.
4. Aceptar sólo pagos `approved`, importe y moneda esperados, y una referencia de oferta válida.
5. Deduplicar por payment ID en almacenamiento persistente antes de emitir GA4 Measurement Protocol `purchase`.
6. Guardar tokens de Mercado Pago y `GA4_API_SECRET` únicamente en el gestor de credenciales del backend/n8n.

Hasta completar esos seis pasos, `purchase` debe permanecer sin llamadas desde el cliente. Referencias oficiales: [Webhooks de Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/payment-notifications) y [back URLs](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/configure-back-urls).

## QA por release

- Sin consentimiento: `analytics_storage=denied`; no hay cookies analíticas.
- Con consentimiento: un único `page_view` por ruta, incluido `/neil-site/tienda/`.
- Ningún payload contiene `@`, textos de formularios, query strings o hashes.
- Formularios fallidos muestran error y no emiten `generate_lead`.
- Cancelar compartir no aparece como error técnico.
- `tool_result` se emite una vez por resultado material, no por cada tecla.
- `purchase` no aparece por visitar manualmente la página de gracias.
