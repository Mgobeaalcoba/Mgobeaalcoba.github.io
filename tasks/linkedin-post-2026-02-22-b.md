# LinkedIn Post — 22 Feb 2026 (B)

> **Instrucciones de publicación:**
> - Adjuntar captura del nuevo sitio en acción (hero con video de fondo o la calculadora de ganancias en mobile)
> - Pegar el link al sitio en el **primer comentario**, no en el cuerpo del post
> - Publicar desde perfil personal de Mariano Gobea Alcoba

---

## TEXTO DEL POST

Hace unas semanas rehicé mi sitio web de cero. Si lo visitaste antes, te invito a volver: no vas a encontrar lo mismo.

**¿Qué cambió exactamente?**

El sitio pasó de ser cuatro páginas HTML con JavaScript vanilla a una app completa en Next.js 14, TypeScript y Tailwind CSS. Pero lo que importa no es la tecnología: es lo que eso habilitó.

Algunas de las cosas que podés encontrar hoy:

📊 **Calculadora de Impuesto a las Ganancias 2026 (Argentina)**
Con escalas actualizadas de AFIP, tope de aportes, deducciones por cónyuge e hijos, escenarios predefinidos (soltero sin hijos, casado con dos hijos, monotributista) y un gráfico de torta que muestra en tiempo real cómo se distribuye tu sueldo bruto entre neto, aportes y ganancias. Funciona en mobile.

📱 **UI completamente responsiva**
El menú de recursos en mobile pasó de ser una lista interminable a un desplegable limpio. Los cards del resultado de la calculadora escalan su tipografía según el espacio disponible. El newsletter se apila verticalmente en pantallas chicas.

🎥 **Video de fondo en el hero del Portfolio**
El clip de presentación corre automáticamente detrás de mi foto y nombre, con overlay ajustado para que todo sea legible. Hay un botón para activar el sonido si querés escuchar el audio.

📬 **Formulario de contacto que realmente envía datos**
El formulario del Portfolio ahora manda nombre, email y mensaje a un webhook de n8n que registra el lead. Antes sólo disparaba un evento de GA4 y los datos se perdían.

📅 **Botón flotante de Calendly en cada sección**
Con un pequeño botón animado en el margen derecho podés agendar un espacio conmigo directamente desde cualquier página del sitio, en español o inglés según el idioma que tengas configurado.

📈 **GA4 con funnels de conversión completos**
Ahora puedo ver exactamente en qué punto la gente abandona: si abre el formulario sin enviarlo, si le da foco al input del newsletter sin suscribirse, si abre el modal de consultoría o si hace click en el Calendly flotante desde el blog vs desde el portfolio.

---

También migré todas las rutas legacy (`index.html`, `consulting.html`, `recursos.html`, `blog.html`) con redirects automáticos, agregué un 404 personalizado, actualicé favicon, sitemap, robots.txt y reescribí el README para que describa el proyecto en vez de explicar cómo deployarlo.

Sprint largo. Pero este tipo de proyectos me recarga: tenés control total del stack, del diseño y del resultado.

**¿Qué te parece? ¿Hay algo que les resulta útil de estas herramientas (calculadora de ganancias, cotizaciones, blog técnico) o algo que agregarían?** 👇

---

#nextjs #typescript #tailwindcss #webdevelopment #portfolio #argentina #dataanalytics #n8n #googleanalytics #ux
