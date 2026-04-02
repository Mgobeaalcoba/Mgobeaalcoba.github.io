La exposición de direcciones de correo electrónico en entornos web públicos ha sido, durante décadas, un punto crítico para la seguridad y privacidad de los usuarios. La omnipresencia de *bots* de *scraping* ha impulsado la necesidad de técnicas de ofuscación, con el objetivo de dificultar la recolección automática de direcciones para fines de *spam*, *phishing* y otros ataques cibernéticos. A medida que avanzamos hacia 2026, el panorama de amenazas ha evolucionado significativamente, superando las capacidades de las técnicas de ofuscación tradicionales. La integración de inteligencia artificial (IA), particularmente modelos de lenguaje grandes (LLMs) y *frameworks* de automatización de navegadores *headless* con capacidades de *machine vision* y procesamiento de lenguaje natural (NLP), ha redefinido lo que significa "funcionar" en el ámbito de la ofuscación de correo electrónico.

### Evolución de las Amenazas para 2026

La eficacia de las técnicas de ofuscación se mide por su resistencia a los métodos de extracción automatizada. Históricamente, estos métodos han progresado en varias etapas:

1.  **Scrapers Basados en Expresiones Regulares (RegEx):** La primera generación de *scrapers* operaba directamente sobre el código fuente HTML, buscando patrones de correo electrónico (`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`). Estos son trivialmente eludidos por cualquier técnica de ofuscación que altere la cadena literal del correo electrónico.
2.  **Scrapers Basados en DOM (Document Object Model):** Con la evolución de JavaScript y las bibliotecas de manipulación del DOM, los *scrapers* más sofisticados comenzaron a utilizar *parsers* HTML para construir el DOM y luego buscar elementos específicos o aplicar RegEx sobre el contenido textual renderizado, no solo el código fuente.
3.  **Navegadores Headless (Puppeteer, Playwright, Selenium):** La tercera generación, predominante actualmente y en constante mejora, utiliza navegadores web completos (aunque sin interfaz gráfica) para cargar páginas, ejecutar JavaScript, renderizar CSS y simular interacciones de usuario. Estos *scrapers* ven la página "como un humano", lo que permite que el JavaScript de ofuscación se ejecute, pero también permite la extracción del texto final renderizado. Su capacidad para ejecutar código JavaScript complejo los hace inmunes a la mayoría de las técnicas de ofuscación basadas puramente en HTML o JS simple.
4.  **Extractores Basados en IA y LLMs:** Esta es la amenaza emergente y dominante para 2026. Los LLMs, combinados con técnicas de *computer vision* para interpretar el diseño y el contexto visual de una página, son capaces de:
    *   **Comprender el Contexto Semántico:** Identificar patrones de correo electrónico incluso cuando están fragmentados o descritos en lenguaje natural (ej. "mi dirección es `ejemplo` arroba `dominio` punto `com`").
    *   **Ejecutar e Interpretar JavaScript:** Aunque los LLMs no "ejecutan" JavaScript como un navegador, pueden analizar el código JS, predecir su salida y, en algunos casos, generar código propio para desofuscar. Los *frameworks* de automatización impulsados por IA pueden invocar directamente funciones JS y extraer el resultado.
    *   **Reconocimiento Óptico de Caracteres (OCR):** Para imágenes de texto, los algoritmos de OCR, ahora a menudo mejorados con IA, son extremadamente precisos y rápidos, lo que anula la eficacia de las direcciones de correo electrónico presentadas como imágenes.
    *   **Detección de Interacción Humana:** A través del análisis del comportamiento del ratón, clics, tiempos de respuesta, etc., los *bots* avanzados pueden simular mejor la interacción humana, haciendo que las técnicas que dependen de un "clic humano" sean menos efectivas si no están respaldadas por una verificación robusta.

### Técnicas de Ofuscación Tradicionales y su Eficacia en 2026

Examinemos algunas técnicas comunes y su relevancia futura:

#### 1. Enlaces `mailto:` Directos

```html
<a href="mailto:ejemplo@dominio.com">ejemplo@dominio.com</a>
```
**Eficacia en 2026:** Nula. Cualquier *scraper*, desde RegEx hasta LLMs, puede extraer esta dirección directamente del atributo `href` o del texto del enlace. Constituye un riesgo inaceptable.

#### 2. Reemplazos de Texto o Caracteres

```html
<p>Mi correo es ejemplo [AT] dominio [DOT] com</p>
<p>Contacte a ejemplo(a)dominio.com</p>
```
**Eficacia en 2026:** Nula. Los LLMs son extremadamente competentes en la resolución de ambigüedades lingüísticas y la normalización de estas representaciones a un formato estándar de correo electrónico. Incluso un *scraper* basado en RegEx con algunas reglas de reemplazo simples podría desofuscar esto.

#### 3. Entidades HTML

```html
<a href="mailto:&#x65;&#x78;&#x61;&#x6d;&#x70;&#x6c;&#x65;&#x40;&#x64;&#x6f;&#x6d;&#x61;&#x69;&#x6e;&#x2e;&#x63;&#x6f;&#x6d;">&#x65;&#x78;&#x61;&#x6d;&#x70;&#x6c;&#x65;&#x40;&#x64;&#x6f;&#x6d;&#x61;&#x69;&#x6e;&#x2e;&#x63;&#x6f;&#x6d;</a>
```
**Eficacia en 2026:** Nula. Los navegadores web decodifican automáticamente estas entidades, y los *parsers* HTML, los navegadores *headless* y los LLMs tienen funciones nativas para resolverlas a su forma legible.

#### 4. Manipulación CSS (`direction: rtl`)

```html
<span style="unicode-bidi: bidi-override; direction: rtl;">moc.niamod@elpmaxe</span>
```
**Eficacia en 2026:** Baja. Si bien esta técnica invierte la cadena en el código fuente, los navegadores *headless* renderizarán el texto correctamente. Un LLM con capacidades de *computer vision* o un análisis del DOM post-renderizado detectaría y revertiría la inversión con facilidad. La fricción para el usuario es mínima, pero la seguridad también lo es.

#### 5. JavaScript Básico de Ensamblaje

```html
<script>
    document.write('<a href="mailto:' + 'ejemplo' + '@' + 'dominio' + '.' + 'com">' + 'ejemplo' + '@' + 'dominio' + '.' + 'com' + '</a>');
</script>
```
**Eficacia en 2026:** Muy baja. Esta técnica detiene los *scrapers* basados únicamente en RegEx del código fuente. Sin embargo, los navegadores *headless* ejecutan JavaScript y el DOM resultante contendrá el correo electrónico sin ofuscar. Un LLM que analice el DOM o la salida JavaScript también lo extraerá. El simple concatenado de cadenas es fácilmente predecible.

#### 6. Imágenes de Correo Electrónico

```html
<img src="/img/email.png" alt="Mi correo electrónico">
```
**Eficacia en 2026:** Muy baja. Aunque esto previene la extracción directa de texto, los algoritmos de OCR (Reconocimiento Óptico de Caracteres) han alcanzado una precisión del 99% o más, especialmente en texto claro. La integración de OCR con *bots* de *scraping* es una práctica estándar, y los LLMs pueden invocar motores OCR para procesar imágenes incrustadas. Además, la accesibilidad y la experiencia de usuario (copiar/pegar) se ven gravemente comprometidas.

### Estrategias de Ofuscación Avanzadas para 2026

Para que una técnica de ofuscación de correo electrónico sea mínimamente efectiva en 2026, debe considerar la inteligencia de los *bots* modernos, incluyendo su capacidad de ejecución de JavaScript, simulación de interacción humana e inferencia contextual basada en IA. Ninguna técnica es infalible, por lo que un enfoque de defensa en profundidad es esencial.

#### 1. Ensamblaje Dinámico Client-Side con Interacción o Cálculo Complejo

La simple concatenación de cadenas en JavaScript ya no es suficiente. Se requiere una lógica más compleja que los LLMs o *scrapers* deban "descifrar" o ejecutar.

**Implementación Detallada:**

Esta técnica busca fragmentar el correo electrónico y requerir una interacción del usuario o un cálculo no trivial para su ensamblaje. Incluye codificación (Base64), fragmentación aleatoria y un evento de usuario.

```html
<div id="email-container" class="email-obfuscated" data-ep1="ZXhhbXBsZQ==" data-ep2="ZG9tYWlu" data-ep3="Y29t">
    <span class="email-placeholder">Cargando correo electrónico...</span>
    <button id="reveal-email-btn" aria-label="Mostrar mi dirección de correo electrónico">Mostrar Correo Electrónico</button>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const emailContainer = document.getElementById('email-container');
    const revealButton = document.getElementById('reveal-email-btn');

    // Función para simular un cálculo "complejo" o retraso para disuadir la ejecución directa
    function simulateComplexCalculation(parts) {
        // En un escenario real, esto podría ser un WebAssembly module,
        // una serie de transformaciones criptográficas ligeras, o
        // una recuperación asíncrona de claves de desofuscación.
        return new Promise(resolve => {
            setTimeout(() => { // Introduce un retraso intencional
                const decodedParts = parts.map(p => atob(p));
                resolve(decodedParts.join('@').replace('@', '@' + decodedParts[1]).replace('.' + decodedParts[2], '')); // Reensamblaje complejo
            }, 100); // Pequeño retraso para dificultar el scripting automático
        });
    }

    revealButton.addEventListener('click', async function() {
        if (!emailContainer.dataset.revealed) {
            revealButton.disabled = true;
            emailContainer.querySelector('.email-placeholder').textContent = 'Descifrando...';

            const part1 = emailContainer.dataset.ep1; // 'ZXhhbXBsZQ=='
            const part2 = emailContainer.dataset.ep2; // 'ZG9tYWlu'
            const part3 = emailContainer.dataset.ep3; // 'Y29t'
            const part4 = 'dummy_part'; // Una parte extra para confundir, que se descarta

            const obfuscatedArray = [part1, part2, part3]; // Excluye part4 intencionalmente

            try {
                const fullEmailRaw = await simulateComplexCalculation(obfuscatedArray);
                // Ejemplo de reensamblaje más complejo para ilustrar:
                // email = part1 + '@' + part2 + '.' + part3
                const finalEmail = fullEmailRaw.replace(/@domain/, '@' + atob(part2) + '.' + atob(part3)); // Reensamblaje basado en partes

                const emailLink = document.createElement('a');
                emailLink.href = `mailto:${finalEmail}`;
                emailLink.textContent = finalEmail;
                emailLink.classList.add('email-revealed');

                emailContainer.innerHTML = ''; // Eliminar contenido original
                emailContainer.appendChild(emailLink);
                emailContainer.dataset.revealed = 'true';
            } catch (error) {
                console.error("Error al descifrar el correo:", error);
                emailContainer.querySelector('.email-placeholder').textContent = 'Error al cargar.';
                revealButton.disabled = false;
            }
        }
    });

    // Pequeño truco para dificultar la extracción inicial:
    // El texto real "ejemplo@dominio.com" no existe en el DOM hasta la interacción.
    // Además, el reensamblaje podría ser aún más dinámico o depender de datos externos.
});
</script>
<style>
/* CSS para ocultar el email hasta que se cargue, si el JS falla */
.email-obfuscated .email-placeholder {
    font-family: monospace;
    letter-spacing: 2px;
    color: #ccc;
    user-select: none;
}
.email-obfuscated button {
    margin-left: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.email-obfuscated button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>
```

**Análisis de Seguridad (2026):**
*   **Ventajas:** Dificulta los *scrapers* estáticos y RegEx. Requiere ejecución de JavaScript y simulación de interacción de usuario (clic).
*   **Desafíos:** Los navegadores *headless* pueden simular el clic y ejecutar `simulateComplexCalculation` o analizar el script para inferir las partes. Los LLMs pueden analizar el código JavaScript, entender la lógica de `atob` y ensamblar el correo. El mayor desafío es si la lógica de `simulateComplexCalculation` es verdaderamente incomprensible o costosa computacionalmente para un *bot* sin que afecte la UX. La adición de un retardo (`setTimeout`) y la aleatorización del orden de las partes (`obfuscatedArray`) son medidas paliativas, no soluciones definitivas.

#### 2. Revelación de Correo Electrónico mediante API con Verificación Server-Side (Método Recomendado)

Esta es, con diferencia, la técnica más robusta y escalable para 2026. La dirección de correo electrónico nunca está presente en el código fuente HTML o JavaScript del cliente. Se recupera de un servidor *backend* solo después de que se ha pasado una serie de verificaciones de "humanidad".

**Implementación Detallada:**

**a) Cliente (HTML y JavaScript):**

```html
<div id="contact-info">
    <p>Para contactarnos, por favor, verifique que no es un bot:</p>
    <button id="get-email-btn">Verificar y Mostrar Correo Electrónico</button>
    <div id="email-display" style="margin-top: 10px;"></div>
</div>

<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const getEmailBtn = document.getElementById('get-email-btn');
    const emailDisplayDiv = document.getElementById('email-display');
    const recaptchaSiteKey = 'YOUR_RECAPTCHA_SITE_KEY'; // Sustituye con tu clave de sitio reCAPTCHA v3

    getEmailBtn.addEventListener('click', async () => {
        getEmailBtn.disabled = true;
        emailDisplayDiv.innerHTML = '<p>Realizando verificación de seguridad...</p>';

        try {
            // 1. Obtener token de reCAPTCHA v3
            grecaptcha.ready(async function() {
                const recaptchaToken = await grecaptcha.execute(recaptchaSiteKey, { action: 'get_email' });

                // 2. Enviar token al servidor para validación y obtener el correo
                const response = await fetch('/api/get-contact-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        captchaToken: recaptchaToken,
                        // Añadir más datos de telemetría del cliente para detección de bots,
                        // como user-agent, dimensiones de la ventana, etc.
                        clientData: {
                            userAgent: navigator.userAgent,
                            screenWidth: window.screen.width,
                            screenHeight: window.screen.height,
                            // ... otras métricas para un análisis más profundo
                        }
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error en el servidor: ${errorData.error || response.statusText}`);
                }

                const data = await response.json();
                if (data.email) {
                    const emailLink = document.createElement('a');
                    emailLink.href = `mailto:${data.email}`;
                    emailLink.textContent = data.email;
                    emailDisplayDiv.innerHTML = '<p>Su correo es:</p>';
                    emailDisplayDiv.appendChild(emailLink);
                } else {
                    emailDisplayDiv.innerHTML = '<p>No se pudo obtener el correo electrónico. Inténtelo de nuevo o contacte por otro medio.</p>';
                }
            });

        } catch (error) {
            console.error('Error al obtener el correo:', error);
            emailDisplayDiv.innerHTML = `<p>Error al procesar su solicitud: ${error.message}.</p>`;
            getEmailBtn.disabled = false;
        }
    });
});
</script>
```
**Nota sobre reCAPTCHA:** Sustituye `YOUR_RECAPTCHA_SITE_KEY` por tu clave pública de reCAPTCHA v3. Este servicio ayuda a distinguir humanos de *bots* basándose en el comportamiento del usuario sin interacción directa.

**b) Servidor (Python/Flask como ejemplo):**

```python
from flask import Flask, jsonify, request
import requests
import os
import time

app = Flask(__name__)

# Configuración de reCAPTCHA (idealmente de variables de entorno)
RECAPTCHA_SECRET_KEY = os.environ.get('RECAPTCHA_SECRET_KEY', 'YOUR_RECAPTCHA_SECRET_KEY')
RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

# Almacena el correo electrónico en una variable de entorno o base de datos segura
ACTUAL_EMAIL = os.environ.get('CONTACT_EMAIL', 'contacto@mgatc.com')

# Mecanismo de limitación de tasa simple (para producción usar algo como Flask-Limiter)
request_counts = {}
RATE_LIMIT_SECONDS = 60 # 1 solicitud por IP por minuto
MAX_REQUESTS_PER_PERIOD = 1

def is_rate_limited(ip_address):
    current_time = time.time()
    if ip_address not in request_counts:
        request_counts[ip_address] = {'count': 1, 'timestamp': current_time}
        return False
    
    if current_time - request_counts[ip_address]['timestamp'] < RATE_LIMIT_SECONDS:
        request_counts[ip_address]['count'] += 1
        if request_counts[ip_address]['count'] > MAX_REQUESTS_PER_PERIOD:
            return True
    else:
        request_counts[ip_address] = {'count': 1, 'timestamp': current_time}
    return False

@app.route('/api/get-contact-email', methods=['POST'])
def get_contact_email():
    client_ip = request.remote_addr

    if is_rate_limited(client_ip):
        return jsonify({'error': 'Demasiadas solicitudes. Inténtelo de nuevo más tarde.'}), 429

    data = request.get_json()
    if not data or 'captchaToken' not in data:
        return jsonify({'error': 'Solicitud inválida: falta token CAPTCHA.'}), 400

    captcha_token = data['captchaToken']
    client_data = data.get('clientData', {})

    # 1. Verificar token reCAPTCHA en el servidor
    recaptcha_response = requests.post(RECAPTCHA_VERIFY_URL, data={
        'secret': RECAPTCHA_SECRET_KEY,
        'response': captcha_token,
        'remoteip': client_ip
    })
    recaptcha_result = recaptcha_response.json()

    if not recaptcha_result.get('success'):
        # Logear la razón del fallo para análisis
        app.logger.warning(f"Fallo CAPTCHA para IP: {client_ip}, errores: {recaptcha_result.get('error-codes')}")
        return jsonify({'error': 'Verificación de seguridad fallida. Por favor, intente de nuevo.'}), 403

    # Opcional: Analizar la puntuación de reCAPTCHA v3
    score = recaptcha_result.get('score', 0.0)
    if score < 0.5: # Umbral, ajustar según la tolerancia al riesgo
        app.logger.warning(f"Puntuación CAPTCHA baja ({score}) para IP: {client_ip}")
        return jsonify({'error': 'Verificación de seguridad insuficiente. Por favor, intente de nuevo.'}), 403

    # 2. Heurísticas adicionales (p.ej., detección de User-Agent sospechoso)
    # Considerar una lista negra de User-Agents o un análisis de patrones.
    user_agent = request.headers.get('User-Agent', '').lower()
    suspicious_ua_patterns = ['bot', 'spider', 'crawler', 'headless']
    if any(pattern in user_agent for pattern in suspicious_ua_patterns):
        # Para evitar bloquear bots legítimos, esto podría ser una señal, no un bloqueo directo
        # Podría reducir la puntuación interna de confianza.
        app.logger.info(f"User-Agent sospechoso detectado: {user_agent} para IP: {client_ip}")
        # return jsonify({'error': 'Acceso denegado (posible bot)'}), 403 # Descomentar para bloqueo estricto

    # 3. Análisis de la telemetría del cliente (clientData)
    # Comparar