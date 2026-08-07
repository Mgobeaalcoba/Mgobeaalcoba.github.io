# Plan de medición GA4 — MGA Tech Consulting

Actualizado: 5 de agosto de 2026

## Objetivos

1. Convertir visitas calificadas en consultas.
2. Medir si el asistente facilita el contacto.
3. Entender qué contenido genera interés real.
4. Evaluar adopción y valor de las herramientas y la PWA.

## Eventos clave

| Resultado | Evento GA4 | Lectura |
| --- | --- | --- |
| Lead enviado | `generate_lead` | Conversión comercial principal |
| Suscripción | `sign_up` | Crecimiento de audiencia propia |
| Canal elegido | `contact_channel_select` | Intención de contacto por WhatsApp o email |
| WhatsApp directo | `whatsapp_click` | Intención comercial fuera del modal |
| CV descargado | `cv_download` | Interés profesional |
| Simulación ROI | `roi_simulate` | Lead potencial de alta intención |
| CTA del dashboard | `agent_dashboard_cta_click` | Interés en solución de agentes |

`purchase` permanece como evento clave reservado por GA4, aunque el sitio hoy no tiene checkout.

## Dimensiones personalizadas configuradas

`app_display_mode`, `site_section`, `form_type`, `source`, `channel`, `tool_id`, `action`, `content_type`, `layer`, `close_method` y `consent_choice`.

No registrar como dimensión: nombre, email, teléfono, mensaje, query de búsqueda completa, IDs de sesión o cualquier dato que pueda identificar a una persona.

## Funnels recomendados

### Comercial

`page_view` → `section_view` → `contact_click` → `contact_modal_open` → `contact_channel_select` → `generate_lead`

Segmentar por `site_section`, `source`, dispositivo y canal.

### Asistente

`ai_assistant_open` → `ai_assistant_form_view` → `ai_assistant_user_identified` → `ai_assistant_message_sent` → `ai_assistant_contact_click` → `generate_lead`

La identidad del usuario nunca debe enviarse a GA4; solo se mide que el paso fue completado.

### Instalación PWA

`pwa_install_eligible` → `pwa_install_prompt_view` → `pwa_install_click` → `pwa_install_accepted` → `pwa_installed` → `pwa_launch`

### Contenido

`section_view` → `blog_post_card_click` o `video_select` → `blog_post_read` o `video_click` → `contact_click`

## Tablero ejecutivo

Crear cuatro páginas en Looker Studio o cuatro exploraciones en GA4:

1. Resumen: usuarios, sesiones, engagement, eventos clave y tasa de conversión.
2. Adquisición: fuente/medio, campaña, landing page y conversión por canal.
3. Producto: secciones, contenidos, herramientas, PWA y modo de visualización.
4. Conversión: los funnels anteriores, abandonos por paso y canal final.

Comparar siempre 28 días contra el período anterior y separar navegador de PWA con `app_display_mode`.

## Control de calidad

- Revisar DebugView después de cada release que cambie el tracking.
- Mantener una sola taxonomía; no reintroducir eventos legacy.
- Verificar semanalmente que los webhooks exitosos (`lead_webhook_success`) sean consistentes con `generate_lead`.
- Revisar mensualmente consentimiento, retención, Signals y accesos a la propiedad.
