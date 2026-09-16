# Contenido privado en sitios estáticos

## Regla

Ocultar HTML con CSS, JavaScript, una clave embebida o un hash en el navegador no protege información: el documento completo ya fue descargado.

## Estado implementado

`/racing-propuesta/` publica únicamente una pantalla genérica sin datos de la propuesta. La versión anterior es recuperable desde el historial Git, pero no debe volver a copiarse dentro de `public/`.

## Activación segura

Para volver a servir el documento completo:

1. Hospedarlo fuera del export estático público.
2. Protegerlo con Cloudflare Access, autenticación del servidor o un proveedor de documentos con usuarios nominados.
3. Exigir MFA o código de un solo uso y limitar el acceso a destinatarios autorizados.
4. Desactivar indexación, cache compartida y previews públicas.
5. Registrar accesos del lado del servidor sin guardar el contenido ni credenciales en GA4.
6. Revocar el acceso al finalizar la negociación.

Nunca almacenar contraseñas, listas de emails autorizados o secretos de acceso en el repositorio ni en variables `NEXT_PUBLIC_*`.
