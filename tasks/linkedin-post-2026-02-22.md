# LinkedIn Post — 22 Feb 2026

> **Instrucciones de publicación:**
> - Adjuntar captura del nuevo hero del Portfolio (video de fondo + nombre)
> - Pegar el link al sitio en el **primer comentario**, no en el cuerpo del post
> - Publicar desde perfil personal de Mariano Gobea Alcoba

---

## TEXTO DEL POST

Hoy terminé otro sprint de mejoras en mi portfolio personal y quería compartir lo que cambió 🧵

**¿Qué salió hoy?**

🔧 **Calculadora de Impuesto a las Ganancias — Bug fix crítico**
La torta de composición del salario mostraba una zona gris cuando el sueldo superaba el tope de aportes AFIP (~$3.8M/mes). El problema era un desincronismo entre el resultado calculado y el valor actual del slider. La solución: hacer que el resultado se recalcule automáticamente con cada cambio de input, y que el gráfico derive su propio denominador a partir de los componentes reales (Neto + Aportes + Gcias). Ahora la torta siempre suma 100%, sin importar qué escenario cargues.

⚡ **Deploy sin downtime — Lección aprendida**
Al reemplazar los chunks de `_next/` con `--delete`, los HTML de Portfolio, Consultoría y Blog quedaron apuntando a archivos que ya no existían → pantalla en blanco. El fix fue tan simple como commitear todos los archivos del output en el mismo push. Lo interesante: el build era perfecto, el código estaba bien, pero el deploy parcial rompió todo. Un recordatorio de que el pipeline importa tanto como el código.

📬 **Webhook correcto para el form de Automatización Gratis**
El formulario "Solicitá tu automatización gratis" de Consultoría estaba disparando el webhook del newsletter en lugar del de solicitudes. Un cambio de una línea con impacto real: ahora cada lead llega al workflow de n8n correcto con todos sus datos (nombre, empresa, industria, proceso a automatizar).

---

**Lo que más me gustó de este sprint:**
Los tres fixes fueron pequeños en código (líneas contadas) pero grandes en impacto. Ninguno requirió una refactorización profunda. La diferencia la hizo diagnosticar bien antes de tocar algo.

¿Cuántas veces pushaste algo convencido de que estaba bien y se rompió por un detalle de pipeline? 👇

---

#webdev #nextjs #typescript #debugging #devops #dataanalytics #portfolio #consulting #argentina
