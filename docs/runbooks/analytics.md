# Operación de Google Analytics 4

Actualizado: 15 de septiembre de 2026. Propiedad: `G-DG0SLT5RY3`, compartida por las tres apps (`cv`, `neil`, `elportugues`), separadas por `site_section`.

## Fundamentals

1. **Medir resultados, no ruido.** Cada funnel distingue vista, inicio, intento, resultado y error real.
2. **Una acción, un evento.** `generate_lead` se emite una sola vez y sólo después de que el webhook confirma el envío. Newsletter usa `newsletter_subscribe`; no es un alta de cuenta.
3. **Cobertura por construcción.** Todo elemento interactivo se mide, incluso el que nadie instrumentó a mano: la capa genérica lo cubre por delegación. Lo que se agrega con el tiempo no queda invisible.
4. **Las esperas también son comportamiento.** Latencia de datos, main thread bloqueado y Core Web Vitals explican abandonos que ningún clic explica.
5. **Pageviews únicos y comparables.** Las tres apps usan `send_page_view: false` y envían un `page_view` manual por navegación, con `page_referrer` virtual en rutas SPA. Las rutas localizadas (`/en/...`) reportan el mismo `site_section` y `page_type` que su equivalente para que los idiomas sean comparables.
6. **Privacidad por diseño.** Consent Mode parte en `denied`. GA4 nunca recibe nombre, email, teléfono, mensaje, query strings, fragmentos, URLs `mailto:` ni importes financieros personales exactos.
7. **Valores sensibles en bandas.** Escenarios UVA, ingreso, ahorro, sueldo objetivo y longitud de mensajes se agrupan; los resultados de negocio conservan utilidad sin reconstruir un perfil financiero.
8. **Éxito verificable.** Un retorno del navegador no equivale a una compra. `purchase` sólo se habilita desde una notificación de pago autenticada e idempotente.
9. **Errores accionables.** `app_error`, `tool_error` y `lead_webhook_error` usan códigos estables, nunca textos de excepción ni datos ingresados por el usuario.

## Capas de instrumentación

Las tres capas están implementadas en las tres apps del monorepo, no sólo en `cv`. Cada app tiene su propio `gtag.ts` (no comparten runtime, sólo el diseño y el nombre de eventos), así que cada una expone su propio objeto `events.*` con la misma forma.

| Capa | Archivo por app | Qué cubre |
| --- | --- | --- |
| Eventos de recorrido (semánticos) | `apps/web/src/lib/gtag.ts` · `apps/neil/src/lib/gtag.ts` · `apps/el-portugues/src/lib/gtag.ts` | Funnels con significado de negocio: formularios, comercio, herramientas, blog, asistente, propuestas, cotizaciones. |
| Capa genérica de interacción | `apps/web/src/components/shared/InteractionTracker.tsx` · `apps/neil/src/components/InteractionTracker.tsx` · `apps/el-portugues/src/components/InteractionTracker.tsx` | Cualquier clic, toggle, foco, copia o impresión en cualquier página, instrumentado o no. |
| Atención, esperas y salud técnica | `apps/web/src/components/shared/PerformanceTracker.tsx` · `apps/neil/src/components/PerformanceTracker.tsx` · `apps/el-portugues/src/components/PerformanceTracker.tsx` | Web Vitals, long tasks, visibilidad de pestaña, red, errores de runtime y de recursos. |

Las tres conviven: un CTA emite su evento semántico **y** el `ui_click` genérico. Regla de uso: los semánticos alimentan funnels y conversiones; los genéricos sirven para descubrir comportamiento no previsto y elementos sin instrumentar.

`InteractionTracker` y `PerformanceTracker` se montan una sola vez por app (junto a `AnalyticsTracker`, en `AppShell.tsx` para `cv` y en el `RootLayout` de `neil`/`el-portugues`), así que cubren cada página de esa app automáticamente por delegación de eventos — nada por página necesita cablearse a mano.

`neil` y `el-portugues` son apps de una sola sección (`site_section` fijo: `neil` / `elportugues`), así que no tienen `page_type` variable como `cv`; el resto del contrato (identidad de elementos, redacción, límites) es idéntico.

## Contrato de atributos

Para que un elemento tenga un identificador legible en los reportes:

```html
<button
  data-analytics="checkout_diagnostico-automatizacion"
  data-analytics-kind="cta"
  data-analytics-surface="offer_grid"
  data-analytics-index="1"
>
```

- `data-analytics` — id estable del elemento. Es lo único obligatorio para reportes legibles.
- `data-analytics-kind` — `cta`, `tab`, `card`, `toggle`, `menu`… Si falta, se infiere del tag y el rol.
- `data-analytics-surface` — componente o bloque. Si falta, se usa la sección `data-section` más cercana.
- `data-analytics-index` — posición dentro de una lista.

Sin atributos, el tracker deriva un id determinístico usando, en orden: `id`, `aria-label`/`title`, `name`, el path del `href` o los tokens de clase no utilitarios. **Nunca lee el texto del elemento, el valor de un input ni la etiqueta de una opción de un `select`.**

## Funnels canónicos

| Caso | Secuencia |
| --- | --- |
| Formularios | `form_view` → `form_start` → `form_submit_attempt` → `lead_webhook_success` → `generate_lead` |
| Herramientas | `tool_view` → `tool_start` → `tool_result` o `tool_error` (+ `tool_action` para el detalle) |
| Asistente | `ai_assistant_open` → `form_view` → `form_start` → `generate_lead` → `ai_assistant_message_sent` → `ai_assistant_response_result` |
| Artículos e informes | `page_view` → `content_engaged` → `content_complete` → `share` o `contact_click` |
| Videos | `video_select` → `video_start` → `video_progress` (25/50/75) → `video_complete` |
| Servicios | `view_item_list` → `select_item` → `view_item` → `begin_checkout` → `checkout_return` → `purchase` verificado |
| Cualquier página | `ui_click` / `ui_toggle` / `ui_focus` / `ui_copy` / `ui_view` (capa genérica) |
| Espera y atención | `data_wait`, `page_visibility`, `main_thread_blocking`, `web_vitals`, `page_load_timing` |

`content_engaged` requiere al menos 30 segundos activos y 50% de profundidad. `content_complete` requiere 90% de profundidad. Los eventos se deduplican por contenido durante la sesión.

## Diccionario: capa genérica

| Evento | Cuándo se emite | Parámetros propios |
| --- | --- | --- |
| `ui_click` | Clic en cualquier elemento interactivo sin estado toggle | `ui_element`, `ui_kind`, `ui_surface`, `ui_index`, `link_type`, `link_domain`, `link_path` |
| `ui_toggle` | Clic en `summary`/`[aria-expanded]`/checkbox/radio, cambio de `select`, tema, menú | `ui_element`, `ui_kind`, `ui_surface`, `ui_state` (`expanded`/`collapsed`/`checked`/`unchecked`/`option_N`/`open`/`closed`), `from_theme` |
| `ui_focus` | Primer foco en un campo, con throttling | `ui_element`, `field_type` (`text`/`email`/`textarea`/`select`…) |
| `ui_copy` | El usuario copia contenido de la página | `ui_element`, `ui_surface` |
| `ui_view` | Vista que no proviene de un clic: banner de consentimiento, paleta, página offline | `ui_element`, `ui_state`, `source` |
| `ui_action` | Acciones con estado interno: búsqueda en la paleta, ejecución de un comando, atajos de teclado | `ui_element`, `command_id`, `query_length_band`, `result_count` |

Superficies que ya emiten eventos propios además de la capa genérica (todas en `cv`, no tienen equivalente en `neil`/`el-portugues`): paleta de comandos (`command_id`), menú móvil y drawer (`open`/`closed`), toggle de tema (`from_theme`), acordeones de FAQ, terminal del portfolio (`command_id`, `argument_count`, `is_known_command`) y el simulador de sueldo (`tool_action` + `tool_start`/`tool_result`/`tool_error`). En `neil` y `el-portugues`, la carga de datos desde Supabase (`NeilDataContext`, `EpDataContext`) emite `data_wait` con `source` `neil_products` / `ep_content`.

## Diccionario: atención, esperas y salud técnica

| Evento | Cuándo se emite | Parámetros |
| --- | --- | --- |
| `page_visibility` | Cambio de pestaña visible/oculta, con tiempo visible acumulado del lado del cliente | `visibility_state`, `visible_seconds_band`, `hidden_count` |
| `web_vitals` | Al ocultarse la página, con el valor final de cada métrica | `metric_name` (`LCP`/`CLS`/`INP`/`FCP`/`TTFB`), `metric_value`, `metric_rating` (`good`/`needs_improvement`/`poor`) |
| `page_load_timing` | Al terminar la navegación | `ready_state`, `dom_ready_band`, `load_band` |
| `main_thread_blocking` | Agregado por pageview, no por tarea | `long_task_count`, `blocking_time_band` |
| `data_wait` | Espera de datos asíncronos (Supabase, calculadoras) | `source`, `outcome` (`success`/`error`/`timeout`), `wait_ms_band`, `attempt` |
| `network_status` | Eventos `online`/`offline` del navegador | `network_state` |
| `pwa_service_worker` | Ciclo de vida del service worker | `step`, `status` |
| `app_error` | Error de runtime o de recurso | `component`, `operation`, `error_code`, `recoverable` |
| `page_not_found` | Vista de la página 404 | `requested_path`, `referrer_type` |

Las bandas de tiempo son: `under_250ms`, `250ms_1s`, `1s_3s`, `3s_6s`, `6s_15s`, `over_15s` para esperas, y `under_10s`, `10s_30s`, `30s_60s`, `1m_3m`, `3m_10m`, `over_10m` para atención.

## Límites y protecciones de la capa genérica

- **Deduplicación**: el mismo elemento dentro de 400 ms se ignora.
- **Tope por vista**: 250 eventos; al superarlo la capa deja de emitir para no ensuciar la propiedad.
- **Teclado**: sólo combinaciones con modificador de una lista conocida (`⌘K`/`Ctrl+K`, `/`, `Escape`). Nunca se emite la tecla suelta, así el texto tipeado no puede filtrarse.
- **Campos**: de un `select` se envía el índice de la opción; de un `input`, sólo su tipo. Nunca el valor.
- **Redacción automática**: cualquier parámetro que contenga un email o un teléfono formateado se reemplaza por `redacted` antes de salir.
- **Presupuesto de GA4**: la propiedad estándar admite 50 dimensiones de alcance evento. El diccionario completo ronda las 37; registrar sólo las de uso real y consultar el resto vía DebugView o exploraciones.

## Eventos clave a configurar en GA4 Admin

Marcar como key events:

- `generate_lead`
- `newsletter_subscribe`
- `purchase` (sólo después de activar la verificación server-side)
- `contact_channel_select`
- `whatsapp_click`
- `service_onboarding_complete`

No marcar por defecto clics, aperturas, simulaciones o `checkout_return`: sirven para diagnosticar el funnel, no prueban un resultado comercial. Tampoco marcar la capa genérica ni la de salud (`ui_*`, `page_visibility`, `web_vitals`, `main_thread_blocking`, `data_wait`, `network_status`, `app_error`, `pwa_service_worker`): son diagnóstico.

## Definiciones personalizadas

Crear dimensiones de alcance evento para `site_section`, `page_type`, `client_name`, `user_lang`, `app_display_mode`, `form_type`, `source`, `channel`, `status`, `error_code`, `tool_id`, `result_type`, `content_type`, `content_id`, `video_id`, `progress_percent`, `item_id`, `offer_id`, `market_signal`, `market_range`, `monthly_uva_change_band`, `monthly_income_change_band`.

Agregadas con la capa de interacción y de salud:

`ui_element`, `ui_kind`, `ui_surface`, `ui_state`, `ui_index`, `link_type`, `link_domain`, `command_id`, `field_type`, `close_method`, `trigger`, `metric_name`, `metric_rating`, `resource_type`, `network_state`, `visibility_state`, `visible_seconds_band`, `wait_ms_band`, `query_length_band`, `target_net_band`, `referrer_type`.

No registrar como dimensión valores de alta cardinalidad como `page_location`, títulos libres, `metric_value`, `hidden_count`, `long_task_count`, `ui_index`, transaction IDs ni timestamps.

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
- Con consentimiento: un único `page_view` por ruta, incluido `/neil-site/tienda/` y `/en/servicios/`.
- Ningún payload contiene `@`, textos de formularios, query strings, hashes ni el contenido tipeado en el terminal.
- Un `select` reporta `option_N`, nunca el texto de la opción elegida.
- Repetir el mismo clic dos veces en menos de 400 ms produce un solo evento.
- Formularios fallidos muestran error y no emiten `generate_lead`.
- Cancelar compartir no aparece como error técnico.
- `tool_result` se emite una vez por resultado material, no por cada tecla.
- El simulador de sueldo reporta `target_net_band`, nunca el importe ingresado.
- `purchase` no aparece por visitar manualmente la página de gracias.
- Una URL inexistente emite `page_not_found` con el path solicitado.
- Con la pestaña en segundo plano aparece `page_visibility` con `visibility_state=hidden`; al volver, `visible`.
- `web_vitals` llega con `metric_rating` y nunca con valores fuera de `good`/`needs_improvement`/`poor`.
- Repetir el QA de capa genérica y de salud en `/neil-site/` y `/elportugues-site/`, no sólo en el dominio raíz: `ui_click`/`ui_toggle`/`web_vitals`/`page_visibility` deben aparecer ahí también.
- En `neil` y `el-portugues`, la carga inicial de datos de Supabase emite `data_wait` con `outcome=success` en el camino feliz; forzar un fallo de red confirma `outcome=error`.
