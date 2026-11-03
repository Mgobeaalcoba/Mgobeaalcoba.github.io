# Encaje de analítica argentina en el sitio MGA

Fecha de revisión: 2026-11-03. Alcance: inspección del código local; las propuestas y estimaciones son inferencias de producto, no herramientas ya implementadas. La disponibilidad de cada serie en la API del INDEC debe surgir de la investigación técnica paralela.

## ¿Qué ofrece hoy el sitio y qué conviene complementar?

### Takeaway
El sitio ya contiene un laboratorio financiero argentino con inflación general e históricos, cotizaciones, inversiones, Ganancias e hipotecarios UVA. Las nuevas propuestas deberían convertir series oficiales en preguntas y comparaciones útiles, con más profundidad que otro conjunto de tarjetas de indicadores.

### Cited Findings
- El área de recursos organiza herramientas en Financieros, Tech & Automatización y Generales. En Finanzas aparecen Ganancias, Hipotecarios UVA, Inversiones, Cotizaciones e Indicadores. — [RecursosClient.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/app/recursos/RecursosClient.tsx:49)
- Ya hay indicadores de inflación mensual/interanual, riesgo país, plazo fijo, fondos money market y UVA; los históricos de inflación se consultan a ArgentinaDatos. — [EconomicIndicators.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/EconomicIndicators.tsx:19), [históricos](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/EconomicIndicators.tsx:86), [consultas actuales](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/EconomicIndicators.tsx:200)
- El comparador de inversiones dibuja series mensuales de plazo fijo, inflación y variaciones de UVA mediante SVG. — [InvestmentDashboard.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/InvestmentDashboard.tsx:16), [gráfico](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/InvestmentDashboard.tsx:108)
- Existe un componente SalarySimulator para estimar bruto a partir del neto deseado, con comentario explícito de que los montos personales permanecen en el navegador. No encontré importación de ese componente bajo `src/app` en esta inspección, por lo que no lo cuento como una herramienta publicada. — [SalarySimulator.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/SalarySimulator.tsx:7), [cálculo](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/SalarySimulator.tsx:24)
- El sitio ya dedica rutas propias a paneles mayores, como PyPI Stats, enlazadas desde la portada de recursos. — [enlace desde recursos](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/app/recursos/RecursosClient.tsx:209), [ruta PyPI](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/app/recursos/pypi-stats/page.tsx:10)

### Inferences
- Hay una audiencia natural para poder adquisitivo: conecta salario, impuestos, inflación e hipotecarios existentes sin repetir el cálculo de Ganancias.
- Un análisis por rubros y regiones aporta segmentación que no ofrece el panel actual de inflación general.
- Un radar sectorial puede demostrar modelado y BI orientado a decisiones empresariales, y acompañar la presencia de consultoría del sitio.
- Tres rutas propuestas, no existentes: `/recursos/poder-adquisitivo/`, `/recursos/actividad-argentina/` y `/recursos/argentina-social/`. Se enlazarían desde Recursos, con páginas específicas para metadatos e indexación, como el patrón de PyPI Stats. La selección final depende de la nota de datos y metodología.

### Gaps
- No se revisaron datos de tráfico ni conversiones, así que no se afirma cuál idea tendría más visitas.
- No se validó visualmente la aplicación publicada: el encaje se basa en el checkout local.
- La cobertura INDEC de salarios, IPC regional/rubros y EMAE/IPI/ISAC queda pendiente de la nota técnica de la API. Ninguna propuesta debe atribuir a la API series no verificadas.

## ¿Cuáles son tres propuestas útiles y diferenciadas?

### Takeaway
Tres familias complementarias por encaje: poder adquisitivo, actividad y comparación social/laboral territorial. Para evitar dos proyectos muy similares sobre IPC, la segmentación por rubros/regiones puede formar parte del primero. Actividad prioriza analytics para consultoría; poder adquisitivo conecta con las herramientas existentes; el atlas social/laboral abre un público interesado en datos argentinos y demuestra modelado geográfico. Esta nota no reemplaza la validación de series de las otras investigaciones.

### Cited Findings
- El texto de Recursos presenta el área como calculadoras y laboratorios interactivos para modelar decisiones financieras, de automatización y arquitectura. — [RecursosClient.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/app/recursos/RecursosClient.tsx:198)
- Las herramientas financieras argentinas están deliberadamente fuera del conjunto de rutas en inglés. — [README de web](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/README.md:37)
- El dashboard PyPI ofrece un precedente para acompañar gráficos con notas sobre definición, cobertura, rezago y diferencia entre fuentes. — [PypiStatsPage.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/PypiStatsPage.tsx:59)

### Inferences
1. **Mi sueldo en pesos constantes / poder adquisitivo.** Pregunta: «¿Mi aumento le ganó a la inflación?». MVP: monto en una fecha, monto actual y período; comparar aumento nominal con variación acumulada del IPC, presentar variación real y monto necesario para mantener poder de compra. Gráfico de ingreso nominal y real con base común. Índice salarial oficial opcional si está disponible y con rezagos/cobertura explícitos. Ampliación: varios aumentos, escenarios editables, comparar contra canasta básica y explorar inflación por rubros/regiones. Para simular un presupuesto por rubro, llamarlo estimación de exposición a inflación, no IPC personal oficial; las contribuciones oficiales requieren ponderaciones compatibles. Esfuerzo relativo bajo a medio. Valor portfolio: transformaciones temporales, cálculo reproducible y UX de decisiones. El sueldo individual debe permanecer en el navegador, siguiendo la intención del SalarySimulator existente.
2. **Radar de actividad económica por sector.** Pregunta: «¿Qué sectores crecen, cuáles caen y cómo cambió la tendencia?». MVP: selector de sectores y período, variación interanual, ranking y series rebasadas a 100; usar el indicador sectorial efectivamente expuesto por la API (EMAE o IPI, según evidencia). Comparaciones mensuales sólo con series desestacionalizadas comparables, si existen. Ampliación: comparadores industria/comercio, resúmenes editoriales y descarga CSV. Esfuerzo relativo medio a alto porque exige mantener definiciones y agregaciones. Valor portfolio: ETL, modelo dimensional, comparación sectorial y explicación de métricas para empresas.
3. **Atlas de trabajo y condiciones de vida.** Pregunta: «¿Cómo cambian empleo, ingresos y pobreza entre áreas urbanas?». MVP: selector de aglomerados y períodos efectivamente disponibles, ranking y evolución de tasas con definiciones visibles; incorporar pobreza sólo con períodos y geografía compatibles. Evitar representar tasas de aglomerados como si fueran datos provinciales o municipales completos. Ampliación: pequeñas visualizaciones múltiples, comparación de dos aglomerados y descarga CSV. Usar selector/tablas en la primera versión si un mapa aporta falsa cobertura. Esfuerzo relativo medio a alto por armonización territorial y frecuencias. Valor portfolio: modelado dimensional, geografía, comparaciones responsables y narrativa de interés público. Su cobertura exacta depende de la inspección del contrato técnico EPH; esta nota propone el encaje, no confirma los campos del API.
- No mezclar «aumento nominal menos inflación» con variación real: el resultado real requiere cociente de factores o índices. No restar tasas acumuladas como sustituto del cálculo.
- Evitar empezar con pronósticos, recomendaciones de inversión o explicaciones causales que estos índices descriptivos no sostienen.
- Si el catálogo API no trae rubros/regiones o actividad sectorial, rediseñar esas propuestas con sus operaciones efectivamente verificadas, sin esconder una dependencia nueva en planillas oficiales.

### Gaps
- No hay estimación en jornadas porque no se diseñó ni implementó el flujo ni se completó la inspección del API. Las dificultades son relativas, no compromisos de entrega.

## ¿Cómo integrarlo sin romper el export estático?

### Takeaway
El patrón más compatible es obtener y validar los datos oficiales en una sincronización programada/build, publicar un JSON pequeño con metadatos y servir la interacción desde React. Ya existen precedentes con snapshots hipotecarios y PyPI; no hace falta introducir un servidor Next.js en ejecución.

### Cited Findings
- La aplicación usa `output: 'export'`, `trailingSlash: true` y dominio root (`basePath: ''`). — [next.config.js](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/next.config.js:2)
- El `prebuild` sincroniza datos hipotecarios y PyPI antes de compilar. Chart.js y react-chartjs-2 ya son dependencias. — [package.json](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/package.json:5), [dependencias](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/package.json:15)
- El script hipotecario obtiene datos de fuentes permitidas, valida respuestas y conserva el último snapshot válido si falla la fuente y hay fallback. — [sync-mortgage-data.mjs](/Users/mgobea/Documents/Mgobeaalcoba.github.io/scripts/sync-mortgage-data.mjs:38), [fallback](/Users/mgobea/Documents/Mgobeaalcoba.github.io/scripts/sync-mortgage-data.mjs:229)
- PyPI Stats carga JSON al compilar y entrega un componente cliente para filtros y gráficos; la capa cliente puede actualizar desde un snapshot publicado conservando el último éxito. — [PypiStatsPage.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/PypiStatsPage.tsx:10), [PypiStatsLive.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/PypiStatsLive.tsx:25)
- El dashboard PyPI adapta colores a las variables del tema claro y oscuro. — [PypiDashboard.tsx](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/components/recursos/PypiDashboard.tsx:114)
- Hay un catálogo existente de eventos `tool_view`, `tool_start`, `tool_result`, `tool_error` y `tool_action`. — [gtag.ts](/Users/mgobea/Documents/Mgobeaalcoba.github.io/apps/web/src/lib/gtag.ts:337)

### Inferences
- Flujo recomendado: API oficial → normalización/validación → JSON de datos y metadatos → página estática → filtros/gráficos cliente. La frecuencia de refresco debe seguir publicaciones, no aparentar cotizaciones en tiempo real.
- Guardar período del dato, instante de consulta, definición/base del índice, fuente y estado de actualización por serie. La hora de consulta no equivale a la fecha del dato.
- Conservar último snapshot válido y señalar datos atrasados; evitar reemplazarlos por cifras aproximadas sin período explícito. Este enfoque además evita depender de que el API permita CORS desde el dominio del sitio.
- Usar Chart.js existente para líneas, barras y heatmaps sólo si no exige un plugin innecesario; un heatmap simple se puede hacer con HTML accesible y tabla equivalente. Reusar tokens de tema y patrones de fuente/metodología.
- Medir uso de la herramienta con eventos existentes, sin enviar sueldos o presupuestos personales a GA4. Para medir valor: visitas de herramienta, interacción y resultados válidos; no atribuir conversiones comerciales sin evidencia.
- Para nuevas rutas, mantener trailing slash, metadata y sitemap; la primera versión puede ser sólo español siguiendo el patrón de herramientas argentinas.

### Gaps
- La investigación técnica paralela confirmó que el API usa token. El diseño recomendado guarda ese token como secreto de CI y publica sólo datos procesados: no debe quedar en `NEXT_PUBLIC_*` ni en un bundle estático. Referencia técnica a contrastar con la nota API: [OpenAPI INDEC](https://api.indec.gob.ar/api/openapi?v=2).
- Tamaño, paginación, cobertura exacta EPH y condiciones de uso quedan a la nota técnica. No fue necesaria una implementación para proponer el patrón de snapshots compatible con el sitio.
