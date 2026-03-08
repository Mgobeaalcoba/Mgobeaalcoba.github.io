## Automatización de una Agencia Tecnológica con Agentes AI en Gemini Free Tier

### Introducción

En el mundo actual, la automatización y la inteligencia artificial (AI) son herramientas cruciales para optimizar procesos y reducir costos. Como desarrollador solitario en Taiwán, he logrado automatizar completamente mi agencia tecnológica utilizando cuatro agentes AI que manejan contenido, ventas, seguridad y operaciones. Todo esto se ejecuta en el tier gratuito de Gemini 2.5 Flash, lo que me permite mantener un costo mensual de $0 en modelos de lenguaje (LLM).

### Arquitectura del Sistema

#### Componentes Principales

1. **Agentes AI**: Cuatro agentes construidos con OpenClaw, una plataforma de agentes AI de código abierto.
2. **Entorno de Ejecución**: Windows Subsystem for Linux 2 (WSL2) en mi máquina local, gestionado con systemd timers.
3. **Infraestructura**: Vercel (hobby tier) y Firebase (free tier) para el hosting y la base de datos.
4. **APIs y Servicios**: Telegram Bot, Resend, Jina Reader para tareas específicas como envío de mensajes y lectura de contenido web.

### Funcionamiento Diario de los Agentes

#### Generación de Contenido Social

- **Proceso**:
  1. **Generación Inicial**: Los agentes generan 8 publicaciones sociales diarias para diferentes plataformas.
  2. **Auto-revisión**: Cada publicación es revisada por el mismo agente para asegurar su calidad.
  3. **Reescritura si Es Necesario**: Si la puntuación de calidad es baja, el agente reescribe la publicación hasta alcanzar un estándar aceptable.

- **Código de Ejemplo**:
  ```python
  def generate_social_post(platform):
      # Leer archivos de inteligencia locales
      intelligence = read_intelligence_files()
      
      # Generar publicación inicial
      initial_post = generate_post(intelligence)
      
      # Auto-revisión
      quality_score = review_post(initial_post)
      
      # Reescritura si es necesario
      while quality_score < MIN_QUALITY_THRESHOLD:
          initial_post = rewrite_post(initial_post)
          quality_score = review_post(initial_post)
      
      return initial_post

  def read_intelligence_files():
      # Leer archivos Markdown locales
      intelligence_files = glob.glob('intelligences/*.md')
      intelligence = {}
      for file in intelligence_files:
          with open(file, 'r') as f:
              intelligence[file] = f.read()
      return intelligence
  ```

#### Manejo de Leads de Ventas

- **Proceso**:
  1. **Identificación de Leads**: Los agentes escanean fuentes de leads potenciales.
  2. **Calificación de Leads**: Cada lead es calificado basado en criterios predefinidos.
  3. **Seguimiento y Conversión**: Los leads calificados son seguidos y convertidos en clientes.

- **Código de Ejemplo**:
  ```python
  def handle_sales_lead(lead):
      # Calificar lead
      lead_score = score_lead(lead)
      
      # Seguimiento y conversión
      if lead_score > MIN_LEAD_SCORE:
          follow_up_lead(lead)
          convert_to_client(lead)

  def score_lead(lead):
      # Calcular puntuación basada en criterios
      criteria = ['email_domain', 'company_size', 'industry']
      score = sum([evaluate_criteria(lead, c) for c in criteria])
      return score
  ```

#### Escaneo de Seguridad

- **Proceso**:
  1. **Análisis de Vulnerabilidades**: Los agentes analizan regularmente el código y las dependencias para identificar vulnerabilidades.
  2. **Generación de Informes**: Se generan informes detallados de seguridad.
  3. **Acciones Correctivas**: Las acciones necesarias para mitigar las vulnerabilidades son implementadas automáticamente.

- **Código de Ejemplo**:
  ```python
  def scan_security():
      # Analizar código y dependencias
      vulnerabilities = analyze_code_and_dependencies()
      
      # Generar informe
      report = generate_security_report(vulnerabilities)
      
      # Acciones correctivas
      apply_patches(vulnerabilities)

  def analyze_code_and_dependencies():
      # Usar herramientas de análisis de seguridad
      vulnerabilities = []
      for tool in SECURITY_TOOLS:
          vulnerabilities.extend(run_security_tool(tool))
      return vulnerabilities
  ```

#### Operaciones

- **Proceso**:
  1. **Monitoreo del Sistema**: Los agentes monitorean constantemente el estado del sistema.
  2. **Mantenimiento Preventivo**: Se realizan tareas de mantenimiento preventivo.
  3. **Respuesta a Incidentes**: En caso de incidentes, se activan protocolos de respuesta automática.

- **Código de Ejemplo**:
  ```python
  def monitor_system():
      # Monitorear estado del sistema
      system_status = check_system_status()
      
      # Mantenimiento preventivo
      perform_preventive_maintenance(system_status)
      
      # Respuesta a incidentes
      if system_status['incident']:
          handle_incident(system_status['incident'])

  def check_system_status():
      # Verificar CPU, memoria, disco, etc.
      status = {
          'cpu': check_cpu_usage(),
          'memory': check_memory_usage(),
          'disk': check_disk_usage(),
          'incident': check_for_incidents()
      }
      return status
  ```

### Optimización de Tokens

Para maximizar la eficiencia y minimizar el uso de tokens, he implementado una estrategia de optimización:

1. **Lectura de Archivos Locales**: Los agentes leen archivos de inteligencia locales en formato Markdown, lo que no consume tokens.
2. **Prompts Focales**: Cada solicitud de LLM incluye un prompt enfocado con todo el contexto necesario.
3. **Respuestas Concisas**: Las respuestas de los agentes son procesadas y actuadas de manera inmediata, evitando conversaciones largas.

- **Código de Ejemplo**:
  ```python
  def optimize_token_usage(prompt, context):
      # Leer archivos de inteligencia locales
      intelligence = read_intelligence_files()
      
      # Construir prompt focal
      full_prompt = f"{prompt} {context} {intelligence}"
      
      # Enviar solicitud a LLM
      response = send_to_llm(full_prompt)
      
      # Procesar y actuar
      action = parse_response(response)
      execute_action(action)

  def send_to_llm(prompt):
      # Enviar solicitud a Gemini 2.5 Flash
      response = requests.post(GEMINI_API_URL, json={'prompt': prompt})
      return response.json()['text']
  ```

### Pipeline de Investigación

El pipeline de investigación, que incluye la recopilación de noticias y contenido web, no consume tokens de LLM. Utilizo RSS feeds, HN (Hacker News) y web scraping, junto con Jina Reader, para obtener información relevante.

- **Código de Ejemplo**:
  ```python
  def research_pipeline():
      # Recopilar noticias y contenido web
      news = fetch_rss_feeds()
      hn_posts = fetch_hn_posts()
      web_content = scrape_web_pages()
      
      # Procesar y almacenar información
      processed_info = process_information(news + hn_posts + web_content)
      store_information(processed_info)

  def fetch_rss_feeds():
      # Obtener feeds RSS
      feeds = []
      for url in RSS_FEEDS:
          feed = feedparser.parse(url)
          feeds.extend(feed.entries)
      return feeds
  ```

### Resultados y Estadísticas

- **Cuentas de Threads Automatizadas**: 27 cuentas, 12K+ seguidores, 3.3M+ vistas.
- **Timers y Scripts**: 25 systemd timers, 62 scripts, 19 archivos de inteligencia.
- **Utilización de RPD**: 7% (105/1,500) — 93% de capacidad restante.
- **Costo Mensual**: $0 en LLM + ~$5 en infraestructura (Vercel hobby + Firebase free).

### Problemas y Lecciones Aprendidas

- **Facturación Inesperada**: Creé una API key desde un proyecto GCP habilitado para facturación en lugar de AI Studio, lo que resultó en una factura de $127 en 7 días. La lección es siempre crear claves API directamente desde AI Studio.
- **Bucle de Compromiso**: Un error en el bucle de compromiso hizo que todos los posts fueran iterados en lugar de los top N, quemando 800 RPD en un día y dejando sin recursos a otras tareas.
- **Conflicto de Actualizaciones de Telegram**: Las verificaciones de salud de Telegram llamaban a `getUpdates`, lo que entraba en conflicto con el gateway de largo polling, resultando en 18 mensajes duplicados en 3 minutos.

### Conclusión

La automatización con agentes AI ha permitido que mi agencia tecnológica funcione eficientemente con un costo mínimo. Al aprovechar el tier gratuito de Gemini 2.5 Flash y una arquitectura bien diseñada, he podido manejar tareas complejas de contenido, ventas, seguridad y operaciones. Si estás interesado en implementar una solución similar o necesitas asesoramiento en automatización y AI, no dudes en visitar [https://www.mgatc.com](https://www.mgatc.com) para servicios de consultoría.