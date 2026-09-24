# Contenido privado en sitios estáticos

## Regla

Ocultar HTML con CSS, JavaScript, una clave embebida o un hash en el navegador no protege información: el documento completo ya fue descargado.

## Estado implementado

Cuando el entregable no es público, la tarjeta del trabajo apunta a una pantalla de acceso en `public/` que no contiene ningún dato del documento: sólo indica de qué se trata y cómo pedir acceso.

- `/racing-propuesta/` — propuesta de Racing Club. La versión anterior es recuperable desde el historial Git, pero no debe volver a copiarse dentro de `public/`. Se publica con `noindex,nofollow,noarchive`.

Los trabajos de Henry y Unicorn Academy no usan pantalla de acceso: tienen una página de caso en `/trabajos/<cliente>/` que resume el trabajo sin datos confidenciales (precios, horas, condiciones comerciales, casos internos ni material del cliente).

- `/trabajos/henry/` — rediseño de la carrera de AI Automation. Enlaza a la masterclass en `/blog/videos/?v=VRezpIcvG4U`.
- `/trabajos/unicorn-academy/` — marcado como WIP y `noindex`, sin detalles del rediseño hasta que el trabajo esté entregado.

## Activación segura

Para volver a servir el documento completo:

1. Hospedarlo fuera del export estático público.
2. Protegerlo con Cloudflare Access, autenticación del servidor o un proveedor de documentos con usuarios nominados.
3. Exigir MFA o código de un solo uso y limitar el acceso a destinatarios autorizados.
4. Desactivar indexación, cache compartida y previews públicas.
5. Registrar accesos del lado del servidor sin guardar el contenido ni credenciales en GA4.
6. Revocar el acceso al finalizar la negociación.

Nunca almacenar contraseñas, listas de emails autorizados o secretos de acceso en el repositorio ni en variables `NEXT_PUBLIC_*`.
