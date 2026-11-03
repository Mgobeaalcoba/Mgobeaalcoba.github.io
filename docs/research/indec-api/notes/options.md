# Tres productos de analítica argentina

Investigación: 2026-11-03, Argentina. Las propuestas son ideas de producto; no están implementadas ni se probaron consultas autenticadas. El agente que exploró la API confirmó su catálogo y contrato públicos; las fuentes metodológicas siguientes se consultaron directamente. No se atribuye a la API un último dato que no se pudo consultar con credenciales.

## 1. ¿Tu ingreso le ganó a los precios?

### Takeaway
Una herramienta de poder adquisitivo responde una pregunta concreta del visitante: cuánto cambió el valor real de sus ingresos entre dos fechas y cuál sería el ingreso equivalente al final del período. Combinar IPC e índice de salarios con una trayectoria propia ofrece más utilidad que repetir el indicador de inflación mensual que ya está en el sitio.

### Cited Findings
- El IPC mide cambios de precios del consumo de hogares; el INDEC difunde cobertura nacional y seis regiones estadísticas desde 2017. No es una comparación de niveles absolutos del costo de vida entre ciudades. — [IPC: descripción y series](https://www.indec.gob.ar/Nivel4/Tema/3/5/31); [Metodología IPC, base diciembre 2016](https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf).
- El índice de salarios estima variaciones salariales del sector público y del privado registrado y no registrado. Es una referencia de evolución, no el monto del salario promedio de cada visitante. — [Salarios INDEC](https://sitioanterior.indec.gob.ar/nivel4_default.asp?id_tema_1=4&id_tema_2=31&id_tema_3=61).
- El visualizador oficial ya permite comparar índices rebasados a 100 y calcular la canasta básica del hogar para GBA. Esto establece una referencia de funcionalidad pública que la propuesta debe superar en utilidad. — [Visualizador de indicadores de precios](https://shiny.indec.gob.ar/vip/).
- El catálogo y OpenAPI incluyen `ipc_nacional`, `indice_salarios` y `valorizacion_canastas_cba_cbt`. El primero permite seleccionar región y aperturas de consumo; la canasta corresponde al Gran Buenos Aires. La confirmación técnica detallada corresponde a las notas del agente API. — [Catálogo JSON](https://api.indec.gob.ar/api/datasets); [OpenAPI v2](https://api.indec.gob.ar/api/openapi?v=2).

### Inferences
- **MVP propuesto:** dos fechas, ingreso inicial y final; referencia IPC nacional o de una región; opcionalmente sector salarial. Salida: variación nominal, inflación acumulada, variación real y monto final que preservaría el poder adquisitivo inicial. Gráfico del ingreso, IPC e índice salarial rebasados a 100; explicación legible de la brecha.
- **Cálculo propuesto:** inflación acumulada = `IPC_final / IPC_inicial - 1`; ingreso equivalente = `ingreso_inicial * IPC_final / IPC_inicial`; cambio real = `(ingreso_final / ingreso_inicial) / (IPC_final / IPC_inicial) - 1`. Es algebra de índices: la resta de las dos tasas no es la variación real exacta. Para una serie propia, expresar cada monto en pesos de un único mes con `ingreso_t * IPC_base / IPC_t`.
- **Evolución:** ingreso mes a mes, aumentos discontinuos, exportación y módulo opcional de canasta GBA.
- **Valor para portfolio:** deflactación, fechas homogéneas, comparación de series, cálculo verificable y traducción de métricas a una respuesta útil. **Complejidad relativa:** baja a media; sería la primera en salir por utilidad amplia e integración natural con las herramientas actuales.
- **Cuidados:** intersección de fechas disponibles, sin extender curvas a meses no publicados; ingreso comparable (neto con neto). Los cálculos propios no requieren almacenar ingresos.

### Gaps
- La cobertura contractual no prueba la respuesta autenticada real ni los últimos períodos de cada serie. Se necesita un token para validarlos.

## 2. Radar productivo: ¿qué sectores sostienen la actividad?

### Takeaway
Un explorador de EMAE por sector muestra si el movimiento de la actividad es amplio o concentrado y permite comparar trayectorias históricas. Es la opción con mayor afinidad con el posicionamiento de consultoría y analítica de negocios del sitio.

### Cited Findings
- El EMAE es un indicador mensual provisorio de actividad a precios constantes de 2004. La publicación presenta serie original, serie desestacionalizada y tendencia-ciclo; la variación interanual se asocia a la original y la mensual a las series ajustadas. — [Metodología EMAE, INDEC n.º 20](https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_emae_ago_16.pdf).
- El EMAE refleja la evolución del conjunto de sectores productivos a nivel nacional y permite anticipar variaciones del PIB trimestral. No ofrece por sí mismo una medición mensual de cada provincia. — [Descripción oficial EMAE](https://sitioanterior.indec.gob.ar/nivel4_default.asp?id_tema_1=3&id_tema_2=9&id_tema_3=48).
- El agente API confirmó el EMAE general y sectorial desde enero de 2004 en el contrato público. Los sectores ofrecen la serie original y variación interanual; el ajuste estacional está disponible para el agregado. También hay IPI manufacturero e IPI minero para una segunda etapa. — [Catálogo JSON](https://api.indec.gob.ar/api/datasets); [OpenAPI v2](https://api.indec.gob.ar/api/openapi?v=2).

### Inferences
- **MVP propuesto:** selector de período y sectores, mapa de calor sector × mes con variación interanual, líneas con base 100 al inicio elegido y una tarjeta de amplitud: `sectores con crecimiento interanual / sectores con observación válida`. Mostrar su denominador.
- **Pregunta del visitante:** «El agregado sube o baja: ¿qué pasa en industria, comercio, agro o servicios y desde cuándo?». Sirve a lectores del portfolio y a personas que evalúan contexto de negocio para su sector.
- **Lectura cuidada:** el conteo de sectores es un indicador analítico propio sin ponderación; no representa contribuciones al PIB ni permite tratar todos los sectores como si tuvieran el mismo tamaño. Etiquetarlo como elaboración propia basada en INDEC. Para contribuciones al agregado se necesita información adecuada sobre ponderaciones/incidencias, no solo tasas.
- **Interacción:** historia del sector al tocar una celda, con diferencia en puntos porcentuales frente al agregado. Variación mensual únicamente sobre la serie desestacionalizada del total.
- **Evolución:** detalle industria/minería mediante sus IPI, exportación CSV y comparación histórica de caídas/recuperaciones. Sin presentar datos históricos como pronósticos.
- **Valor para portfolio:** analítica sectorial, estacionalidad, visualización de muchas series y diseño de indicadores derivados transparentes. **Complejidad relativa:** media; puede ser el primer proyecto si prima la captación de clientes B2B sobre alcance al público general.

### Gaps
- La taxonomía exacta y la cantidad de sectores válidos se deben tomar del catálogo/respuesta real; no fijar un número tomado de terceros.
- No se validaron incidencias o ponderadores en respuestas autenticadas. El MVP debe ser comparativo, sin prometer descomponer contribuciones.

## 3. Atlas urbano del empleo y las condiciones de vida

### Takeaway
Un comparador geográfico de aglomerados urbanos permite explorar qué lugares muestran cambios en empleo, actividad y desocupación. Una segunda capa de pobreza ofrece contexto social, manteniendo separadas las frecuencias y los períodos de ambos operativos.

### Cited Findings
- La EPH publica tasas de actividad, empleo, desocupación y subocupación. Actividad y empleo tienen como denominador la población; la desocupación se expresa sobre la población económicamente activa. Son medidas diferentes que conviene leer en conjunto. — [Mercado de trabajo: definiciones y series](https://www.indec.gob.ar/Nivel4/Tema/4/31/58).
- La cobertura usual trimestral es de 31 aglomerados urbanos; no equivale a toda la superficie o población de cada provincia. — [EPH: objetivo y cobertura geográfica](https://redatam.indec.gob.ar/redarg/encuestas/EPH/RpOutput.htm).
- Las estimaciones tienen incertidumbre muestral. El informe oficial de cuarto trimestre de 2025 publica intervalos del 90% de confianza y coeficientes de variación; advierte sobre estimaciones con variabilidad elevada. — [Mercado de trabajo, cuarto trimestre 2025](https://biblioteca.indec.gob.ar/bases/minde/mercado_trabajo_eph_4trim25.pdf).
- La pobreza e indigencia se informa por semestre para los 31 aglomerados urbanos y distingue hogares y personas; no debe confundirse un porcentaje de hogares con uno de población. — [Pobreza INDEC](https://www.indec.gob.ar/indec/web/Nivel3-Tema-4--46).
- El agente API confirmó empleo EPH trimestral desde segundo trimestre de 2016 y pobreza semestral desde segundo semestre de 2016 en el contrato. El esquema contempla áreas geográficas, pero los identificadores concretos y la cobertura desagregada no se verificaron sin token. — [Catálogo JSON](https://api.indec.gob.ar/api/datasets); [OpenAPI v2](https://api.indec.gob.ar/api/openapi?v=2).

### Inferences
- **MVP propuesto, condicionado a verificar desagregación:** seleccionar trimestre y hasta tres aglomerados; comparar empleo, actividad y desocupación con igual trimestre del año anterior, en puntos porcentuales. El mapa puede esperar: primero un comparador accesible. Si el servicio entrega solo totales, comenzar como monitor urbano agregado y sumar desagregación oficial por otra vía.
- **Pregunta del visitante:** «¿Cómo cambió el mercado laboral de mi aglomerado y cómo se compara con otros?». Una menor desocupación acompañada por menor actividad no equivale necesariamente a más empleo; el producto puede explicar ese caso en lenguaje simple.
- **Mapa:** puntos por aglomerado, sin colorear provincias completas ni promediar tasas locales sin ponderación.
- **Evolución:** pobreza e indigencia en pestaña semestral con períodos propios y selector personas/hogares. Sin interpolar trimestres ni inferir causalidad empleo-pobreza.
- **Valor para portfolio:** analítica geográfica, integración de catálogos territoriales, cohortes temporales, lectura estadística y comunicación social. **Complejidad relativa:** media a alta por geografía, accesibilidad y frecuencias distintas; tercera prioridad si se implementan todas.
- **Incertidumbre:** evitar rankings de ciudades por diferencias pequeñas sin intervalos; si la API no los incluye, comparación descriptiva con enlace al informe técnico.

### Gaps
- Desagregación geográfica concreta, intervalos y coeficientes de variación pendientes de consulta autenticada; geometrías/coordenadas requerirían otra fuente oficial.

## Selección para el informe

La selección final conserva poder adquisitivo y radar productivo; difiere el atlas EPH, que queda como candidata, porque la desagregación efectiva por aglomerado todavía no está confirmada. Como tercera opción final se propone un **explorador de comercio exterior**: destinos/orígenes, principales rubros de exportación y usos económicos de importación, tendencias y concentración por socio. El contrato público confirma servicios mensuales desde enero de 1986, exportaciones en USD FOB, importaciones en USD CIF, peso neto y diccionario de nomenclaturas. Conviene un MVP con dos pestañas y países/períodos comparables: participación por destino/origen, evolución interanual y desglose dentro de la clasificación de cada flujo. Los valores nominales en dólares no prueban cambios de volumen; el peso neto no convierte productos heterogéneos en un índice de volumen. FOB y CIF tienen bases de valoración distintas y los rubros de exportación no deben emparejarse directamente con usos económicos de importación. Es una propuesta de producto basada en contrato, pendiente de validar filas autenticadas y detalle efectivo de códigos. — [Catálogo, página 2](https://api.indec.gob.ar/api/datasets?page=2); [OpenAPI oficial](https://api.indec.gob.ar/api/openapi?v=2); ver también `api.md`.
