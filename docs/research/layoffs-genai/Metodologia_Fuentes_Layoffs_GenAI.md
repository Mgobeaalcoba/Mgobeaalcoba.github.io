# DOCUMENTO DE METODOLOGÍA Y FUENTES

**Informe:** Layoffs, Contratación & GenAI — El Gran Reajuste Laboral
**Trazabilidad completa:** afirmación → dataset → fuente original
**Autor:** Mariano Daniel Gobea Alcoba • [mgatc.com](https://www.mgatc.com)
**Fecha:** Abril 2026

---

## 1. Propósito y alcance de este documento

Este documento acompaña al informe interactivo ["Layoffs, Contratación & GenAI: El Gran Reajuste Laboral"](https://www.mgatc.com/blog/special/layoffs-genai/) y responde a la necesidad de trazabilidad completa entre cada afirmación del reporte y los datos crudos que la sustentan.

Para cada claim relevante del informe se documenta:

- La afirmación exacta tal como aparece en el reporte
- La fuente primaria (dataset, reporte institucional o estudio académico)
- El dato crudo original y cómo se procesó o agregó
- Las limitaciones, márgenes de error y alternativas consideradas
- El enlace verificable para reproducción independiente

**Alcance temporal del informe:**

El informe cubre el período 2020–2026 (con proyecciones hasta 2035). Los datos históricos tienen como última actualización disponible marzo de 2026. Las proyecciones se basan en informes publicados por instituciones de primer nivel hasta esa fecha.

---

## 2. Datasets primarios utilizados

El informe se apoya en cuatro categorías de fuentes: **(A)** trackers de layoffs en tiempo real, **(B)** reportes institucionales, **(C)** datos gubernamentales y **(D)** proyecciones de grandes consultoras e instituciones académicas.

### 2.1 Trackers de Layoffs en tiempo real

#### layoffs.fyi

Fuente principal para los datos de despidos en el sector tecnológico. Es un tracker público crowdsourceado creado por Roger Lee en 2020 que agrega datos de anuncios de despidos en empresas de tecnología a nivel global.

| Atributo | Detalle |
|---|---|
| URL principal | https://layoffs.fyi/ |
| Cobertura sectorial | Empresas de tecnología (no cubre white collar general) |
| Método de captura | Crowdsourcing + noticias verificadas + comunicados corporativos |
| Actualización | En tiempo real (diaria) |
| Acceso | Público y gratuito |
| Limitación principal | Posible subregistro de empresas pequeñas; discrepancias ±15% vs otros trackers |

**Valores específicos extraídos de layoffs.fyi para el informe:**

| Año | Valor (trabajadores) | Nota aclaratoria |
|---|---|---|
| 2020 | 80.998 | Inicio pandemia; mayormente startups y empresas medianas |
| 2021 | 10.536 | Mínimo histórico; boom de hiring absorbe el mercado |
| 2022 | 165.269 | Corrección post-pandemia + suba de tasas Fed |
| 2023 | 264.220 | Pico histórico; Meta, Amazon, Google, Microsoft |
| 2024 | 152.922 | Moderación; IA empieza como driver explícito |
| 2025 | 245.953 | Nuevo pico; IA atribuida en 55K+ despidos |
| 2026 (Q1) | 90.474 | Solo enero–marzo 2026; ~212 eventos registrados |

> **Nota metodológica:** layoffs.fyi define "evento de layoff" como un anuncio público de recorte de personal por parte de una empresa tecnológica. No todos los anuncios se materializan en la cifra exacta declarada. El tracker incluye tanto despidos efectivos como reducciones de fuerza laboral anunciadas. El dato de 2026 Q1 (90.474) tiene como ratio anualizado ≈360.000, que se usa en el reporte como proyección indicativa.

#### TechCrunch y Crunchbase como fuentes secundarias de validación

Se usan para cross-check de los datos de layoffs.fyi. TechCrunch mantiene una lista cronológica de layoffs tech verificados por redactores. Crunchbase News complementa con datos de financiamiento y contexto empresarial.

| Fuente | URL | Uso en el informe |
|---|---|---|
| TechCrunch Layoffs 2025 | techcrunch.com/2025/12/22/tech-layoffs-2025-list/ | Validación de totales anuales |
| Crunchbase Layoffs | news.crunchbase.com/startups/tech-layoffs/ | Contexto por empresa y ronda de financiamiento |
| Computerworld Timeline | computerworld.com/article/3816579 | Timeline 2026 con detalle por empresa |

### 2.2 Challenger, Gray & Christmas

Challenger, Gray & Christmas (CG&C) es la firma de outplacement más antigua de EE.UU. (fundada 1961). Publica mensual y anualmente los "Job Cut Reports", que son el estándar de la industria para medir anuncios de recortes de empleo en TODOS los sectores de la economía de EE.UU.

| Atributo | Detalle |
|---|---|
| URL principal | https://www.challengergray.com/ |
| Reporte específico usado | Year-End 2025 Challenger Report (dic. 2025) |
| Cobertura | Todos los sectores industriales de EE.UU. |
| Método de captura | Monitoreo sistemático de anuncios corporativos, PR, filings SEC |
| Qué mide exactamente | Anuncios de intención de recorte (no despidos consumados) |
| Periodicidad | Mensual con resumen anual |
| Acceso | Gratuito (resumen); pago (detalle completo) |

**Valores usados en el informe (en miles de empleos anunciados para recorte):**

| Año | Miles anunciados | Factor contextual relevante |
|---|---|---|
| 2019 | 592K | Línea base pre-COVID |
| 2020 | 2.304K | Pico COVID-19; masivos en retail, turismo, hospitality |
| 2021 | 267K | Mínimo histórico; boom de contratación generalizado |
| 2022 | 363K | Inicio de ciclo restrictivo Fed; primeros recortes tech |
| 2023 | 721K | Pico post-pandemia en white collar |
| 2024 | 761K | Aceleración gradual; IA aparece como razón |
| 2025 | 1.206K | Máximo desde 2020; incluye 293K de DOGE (recorte federal) |

> **Diferencia clave: anuncios vs despidos efectivos.**
> Challenger mide ANUNCIOS de recorte, no despidos consumados. Es posible que una empresa anuncie 10.000 recortes y ejecute 7.000 o 12.000. Esto explica por qué los números de Challenger (1.2M en 2025) pueden diferir significativamente de los de layoffs.fyi (246K en 2025 para tech). La diferencia es también de alcance: Challenger cubre TODOS los sectores incluyendo gobierno; layoffs.fyi solo cubre tecnología.

#### Dato específico: 55.000 layoffs atribuidos a IA en 2025

Challenger reporta que en su reporte anual 2025, 54.836 anuncios de recorte citaron explícitamente a la Inteligencia Artificial como razón. Este dato es el único en la literatura que cuantifica despidos con causalidad declarada en IA. El reporte lo redondea a "55.000+" por convención.

**Fuente directa:** Challenger, Gray & Christmas, Year-End 2025 Report, página de síntesis ejecutiva.
**URL:** https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/

#### Dato específico: "+58% vs 2024" en el KPI hero

Cálculo: (1.206K − 761K) / 761K = +58,5%. Ambas cifras provienen de Challenger Gray & Christmas reportes anuales 2024 y 2025. El KPI del hero lo redondea a "+58%".

### 2.3 Indeed Hiring Lab

Indeed Hiring Lab es la unidad de investigación económica de Indeed.com. Publica análisis de tendencias de mercado laboral basados en los 250+ millones de postings mensuales de la plataforma. Es el dataset más grande y representativo de oferta laboral disponible públicamente.

| Atributo | Detalle |
|---|---|
| URL | https://www.hiringlab.org/ |
| Qué mide | Volumen y tendencias de job postings en Indeed.com |
| Base de datos | 250M+ postings/mes a nivel global |
| Índice de referencia | Feb 2020 = 100 (base pre-pandemia) |
| Reportes usados | Tech Hiring Freeze (jul. 2025) + Jobs mentioning AI (ene. 2026) |
| Limitación | Mide OFERTA de empleo, no contrataciones efectivas; sesgado hacia EE.UU. |

#### Dato: "−36% vs pre-pandemia en job postings tech" (KPI hero)

**Fuente:** Indeed Hiring Lab, "The US Tech Hiring Freeze Continues", publicado el 30 de julio de 2025.
**Dato original:** el reporte de Hiring Lab indica que en julio de 2025, el volumen de job postings en tecnología se ubicaba 36% por debajo del nivel de febrero de 2020 (base = 100, valor observado en julio 2025 = 64).
**URL:** https://www.hiringlab.org/2025/07/30/the-us-tech-hiring-freeze-continues/

#### Dato: "+45% en postings con mención de IA vs pre-pandemia"

**Fuente:** Indeed Hiring Lab, "January Labor Market Update: Jobs Mentioning AI Are Growing Amid Broader Hiring Weakness", enero 2026.
**Dato original:** jobs que incluyen la palabra "AI", "artificial intelligence" o términos relacionados en su descripción superan en 45% el nivel de febrero 2020, incluso mientras el total de postings colapsa.
**URL:** https://www.hiringlab.org/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/

#### Gráfico 4: Índice de hiring trends (datos tabulados)

El gráfico de línea del informe (sección 3) usa valores indexados extraídos o interpolados de los reportes periódicos de Indeed Hiring Lab:

| Fecha | Índice Total Tech | Índice Postings con mención IA | Fuente |
|---|---|---|---|
| Feb 2020 | 100 | 100 | Base (referencia) |
| Jun 2020 | 78 | 102 | Hiring Lab — pandemia inicial |
| Dic 2020 | 95 | 108 | Hiring Lab — recuperación parcial |
| Jun 2021 | 130 | 115 | Hiring Lab — boom hiring |
| Dic 2021 | 155 | 122 | Hiring Lab — pico boom |
| Jun 2022 | 148 | 130 | Hiring Lab — inicio declive |
| Dic 2022 | 120 | 145 | Hiring Lab — post-ChatGPT impulso IA |
| Jun 2023 | 98 | 158 | Hiring Lab — desaceleración general |
| Dic 2023 | 90 | 175 | Hiring Lab — bifurcación acentuada |
| Jun 2024 | 82 | 190 | Hiring Lab — caída sostenida |
| Dic 2024 | 75 | 195 | Hiring Lab — máximo relativo IA |
| Jul 2025 | 64 | 145 | Hiring Lab jul. 2025 (dato exacto -36%) |
| Mar 2026 | 60 | 130 | Hiring Lab ene. 2026 (estimación) |

> **Nota:** los valores intermedios (jun 2020 a dic 2024) son interpolaciones lineales o estimaciones basadas en la trayectoria reportada en sucesivos releases de Hiring Lab. El valor exacto verificable de manera independiente es el dato de julio 2025 (64, equivalente a -36%).

### 2.4 BLS/JOLTS — Bureau of Labor Statistics

El Job Openings and Labor Turnover Survey (JOLTS) del BLS es la encuesta mensual del gobierno federal de EE.UU. que mide aperturas de empleo, contrataciones y separaciones (renuncias + despidos) por sector.

| Atributo | Detalle |
|---|---|
| URL | https://www.bls.gov/news.release/jolts.htm |
| Frecuencia | Mensual; publicado con rezago de 6 semanas |
| Cobertura | EE.UU., todos los sectores; >21.000 establecimientos encuestados |
| Variable clave usada | Separations (despidos + ceses) en Professional & Business Services |
| Limitación | No distingue entre despido por IA vs por otras causas; agrega razones |

#### Dato: 3,7M de despidos/ceses en Servicios Profesionales (primeros 9 meses 2024)

**Fuente:** BLS JOLTS, datos acumulados enero–septiembre 2024 para la categoría "Professional and Business Services" (sector NAICS 54–56).
**Procesamiento:** se sumó el dato mensual de "separations" (que incluye quits + layoffs + discharges + other) para los meses enero a septiembre 2024 del sector relevante.
**Referencia complementaria:** S&P Global Market Intelligence, "Layoffs surge in US white collar jobs", noviembre 2024. URL: https://www.spglobal.com/market-intelligence/en/news-insights/articles/2024/11/layoffs-surge-in-us-white-collar-jobs-as-rates-ai-alter-office-work-85986794

#### Dato: "Niveles de apertura de empleo más bajos desde 2014"

**Fuente:** BLS JOLTS, comparativa de Job Openings en Professional & Business Services entre 2014 y 2024.
**Dato:** en agosto 2024, el número de vacantes abiertas en este sector alcanzó el nivel más bajo desde junio 2014, según los microdatos del JOLTS disponibles en data.bls.gov/timeseries/JTU540099JOL.

#### Dato: "22,7M → 22,6M trabajadores white collar en EE.UU. (2024–2025)"

**Fuente:** BLS Current Employment Statistics (CES), Employment, Hours, and Earnings survey. La categoría "white collar" se aproxima con la suma de sectores: Financial Activities, Professional and Business Services, Education and Health Services, Information, y Management.
**Dato bruto:** el total reportado por BLS para estos sectores agregados mostró una contracción neta de aproximadamente 100.000 posiciones entre el promedio de 2024 y el promedio 2025. El dato exacto varía según la definición adoptada de "white collar".

### 2.5 CompTIA — State of the Tech Workforce

CompTIA (Computing Technology Industry Association) publica anualmente el "State of the Tech Workforce", el informe de referencia sobre el empleo tecnológico en EE.UU.

| Atributo | Detalle |
|---|---|
| URL | https://www.comptia.org/en-us/blog/state-of-the-tech-workforce-2026-trends-job-growth-and-future-opportunities/ |
| Edición usada | State of the Tech Workforce 2026 |
| Cobertura | EE.UU.; todos los roles tecnológicos independientemente del sector |
| Base de datos | Datos propios + BLS Occupational Employment Statistics |

#### Datos específicos de CompTIA usados en el informe

| Afirmación en el informe | Dato original CompTIA | Procesamiento |
|---|---|---|
| Roles AI/ML/Data Science: +163% vs 2024 | 49.200 postings en 2025 vs 18.700 en 2024 | (49.200-18.700)/18.700 = 163% |
| Roles ciberseguridad: +124% vs 2024 | 66.800 postings en 2025 vs 29.800 en 2024 | (66.800-29.800)/29.800 = 124% |
| 9,8M empleos tech con IA en EE.UU. para 2026 | Proyección CompTIA sobre fuerza laboral tech total | Proyección directa sin ajuste |
| +1,9% crecimiento proyectado empleos tech con IA | Tasa de crecimiento anual estimada por CompTIA 2026 | Dato directo del informe |

---

## 3. Trazabilidad de los KPIs del hero del informe

El informe presenta cinco indicadores destacados (KPIs) en la sección superior. A continuación se detalla la trazabilidad exacta de cada uno.

| KPI | Valor mostrado | Fuente primaria | Dato crudo original | Proceso |
|---|---|---|---|---|
| Pico Layoffs Tech 2023 | 265K | layoffs.fyi | 264.220 trabajadores en 2023 | Redondeado a 265K por convención |
| Anuncios despido 2025 | 1.2M | Challenger Gray & Christmas Yr-End 2025 | 1.206.000 empleos anunciados | Redondeado a 1,2M |
| Caída job postings tech | −36% | Indeed Hiring Lab jul. 2025 | Índice 64 (base 100 = feb. 2020) | 100 - 64 = 36 puntos de caída |
| Layoffs atribuidos a IA | 55K+ | Challenger Gray & Christmas Yr-End 2025 | 54.836 anuncios citan explícitamente IA | Redondeado a 55K+ |
| Empleos en riesgo global | 300M | Goldman Sachs Research 2023 | 300M full-time jobs equivalentes | Dato directo del informe de GS |

> **Sobre el dato de Goldman Sachs (300M):**
> El informe de Goldman Sachs "The Potentially Large Effects of Artificial Intelligence on Economic Growth" (Briggs/Kodnani, marzo 2023) proyecta que la IA generativa podría "expose" 300M de full-time job equivalents globalmente. "Expose" no significa desplazamiento total sino que más del 50% de las tareas de ese puesto pueden ser automatizadas por IA. El dato se reporta correctamente en el informe con el calificador "proyección". Acceso al paper: https://research.aimultiple.com/ai-job-loss/ (compilación) o el white paper original de GS Research.

---

## 4. Trazabilidad de afirmaciones específicas

### 4.1 Sector White Collar — Datos cualitativos

#### Consultoría: Big 4 recortaron +9.000 empleos combinados

**Fuente:** reportes individuales de cada firma, compilados por Fortune y CNBC en 2024-2025.

- Deloitte: anunció 3.500 recortes en EE.UU. en mayo 2024 (WSJ, CNBC reportaron)
- EY: anunció ~3.000 recortes globales en 2024 tras el colapso del plan "Project Everest"
- KPMG: anunció ~1.700 recortes en EE.UU. en 2024 (Bloomberg)
- PwC: recortes menores pero restructuraciones en divisiones de advisory

La cifra "+9.000" es la suma de los anuncios públicos reportados. No existe una fuente única que compile el total Big 4 en un solo dataset; se construye agregando noticias verificadas.

**Referencias:** CNBC "White collar layoffs, AI, cost-cutting" (nov. 2025): https://www.cnbc.com/2025/11/04/white-collar-layoffs-ai-cost-cutting-tariffs.html

#### Accenture: 19.000 recortes

Accenture anunció en marzo 2023 la eliminación de 19.000 empleos (aproximadamente 2,5% de su fuerza laboral global de 738.000 personas). El anuncio fue oficial y ampliamente cubierto por Reuters, Bloomberg, Financial Times y Wall Street Journal. El dato es directo del comunicado corporativo de Accenture (SEC Filing 8-K, 23 de marzo de 2023).

#### Klarna: agentes de IA reemplazan 700 agentes humanos

Klarna CEO Sebastian Siemiatkowski anunció públicamente en su LinkedIn y en entrevistas a Bloomberg (febrero 2024) que los agentes de IA de Klarna habían procesado en el primer mes tantas conversaciones como 700 representantes de servicio al cliente. Esto se interpretó (y el CEO lo confirmó) como un factor en la decisión de no reponer esas posiciones.

---

## 5. Fuentes de proyecciones

### 5.1 World Economic Forum — Future of Jobs 2025

| Atributo | Detalle |
|---|---|
| URL | https://reports.weforum.org/docs/WEF_Four_Futures_for_Jobs_in_the_New_Economy_AI_and_Talent_in_2030_2025.pdf |
| Metodología WEF | Encuesta a 1.000+ empleadores globales representando 14M+ trabajadores; modelado económico |
| Proyección usada | 92M empleos desplazados; 170M creados; neto +78M hacia 2030 |
| 14% de trabajadores cambiarán carrera | Estimación basada en encuesta WEF + McKinsey MGI |
| Limitación | Encuesta a empleadores (no trabajadores); sesgo hacia grandes corporaciones |

### 5.2 McKinsey Global Institute

| Dato proyectado | Valor | Fuente McKinsey |
|---|---|---|
| Horas de trabajo en EE.UU. automatizables para 2030 | 30% | McKinsey MGI, "The Future of Work After COVID-19" + update 2023 |
| Trabajadores globales que deberán cambiar carrera | 14% | McKinsey MGI "Jobs Lost, Jobs Gained" + WEF 2025 |
| Horas laborales actuales automatizables hoy | 57% | McKinsey MGI "Generative AI and the Future of Work" 2023 |
| Ventaja de productividad para adopters IA | 15–40% | McKinsey Global Survey on AI 2024-2025 |
| Productividad empresas con IA: +15-20% | 15–20% | McKinsey Tech Report 2025 (estimación por sector) |

### 5.3 Escenarios del gráfico de proyecciones

| Escenario | Asunción central | Fuentes base |
|---|---|---|
| Escenario base | Adopción IA continua moderada; regulación parcial; re-skilling efectivo en ~50% de casos | WEF 2025, McKinsey MGI, CompTIA 2026 |
| Escenario optimista | Regulación activa, re-skilling masivo exitoso, nuevas categorías laborales emergen rápidamente | WEF escenario "best case", OECD optimistic |
| Escenario pesimista | AGI narrow 2028-2030, adopción acelerada, re-skilling fracasa, recesión global | McKinsey "disruption" scenario, OECD worst case |

> **Las proyecciones no son predicciones.**
> Los números del gráfico de proyección son escenarios ilustrativos, no pronósticos. Ningún modelo económico puede predecir con precisión el impacto laboral de la IA a 10 años. Los valores son consistentes con los rangos publicados por WEF, McKinsey y Goldman Sachs, pero la incertidumbre crece exponencialmente después de 2028.

---

## 6. Notas sobre gráficos cualitativos

> **Naturaleza del gráfico "Razones declaradas para layoffs": estimación cualitativa.**
> El gráfico de barras apiladas sobre "Razones declaradas para layoffs" NO representa datos de encuestas ni datasets estadísticos. Es una estimación cualitativa construida a partir del análisis de comunicados corporativos, cobertura periodística y los reportes de Challenger (que sí captura la razón declarada cuando las empresas la especifican). Los porcentajes deben interpretarse como órdenes de magnitud, no como mediciones exactas.

---

## 7. Limitaciones conocidas

> **Sobre REZI (entry-level roles -73%):**
> El informe de REZI es producido por una empresa de software de CV, no por una institución académica ni gubernamental. Sus datos son propietarios y difícilmente replicables de forma independiente. Se cita porque no existe una alternativa institucional que mida específicamente el colapso de roles entry-level con ese nivel de detalle. El dato de -73% debe interpretarse con precaución; estudios de BLS y CompTIA confirman la dirección (colapso de entry-level) aunque no la magnitud exacta.

---

## 8. Comparativa de trackers

| Tracker | Qué mide | Cobertura | Cifra 2025 |
|---|---|---|---|
| layoffs.fyi | Despidos en empresas tech (global) | Tech only | ~246K |
| Challenger Gray & Christmas | Anuncios de recorte (todos los sectores, EE.UU.) | All sectors | 1.206K |
| TrueUp.io | Empresas tech que confirmaron despidos | Tech only | ~230K |
| Crunchbase | Startups y scale-ups con funding | Tech + startups | Variable |
| BLS Mass Layoff Statistics | Despidos efectivos >50 personas (mensual) | All sectors, EE.UU. | No es anual |
