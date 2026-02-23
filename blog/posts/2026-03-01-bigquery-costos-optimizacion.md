---
slug: bigquery-costos-optimizacion
date: 2026-03-01
---

Cuando llegué al equipo de Data en MercadoLibre, el gasto mensual en BigQuery estaba cerca de los $180,000 USD. Dieciocho meses después, con el mismo volumen de datos y más queries, lo bajamos a $54,000. Acá están las 7 técnicas que más impacto tuvieron.

## Por qué BigQuery puede volverse muy caro muy rápido

BigQuery cobra de dos formas:
- **Por consultas**: $5 USD por TB de datos escaneados (o $0.01/GB)
- **Por almacenamiento**: ~$0.02/GB/mes para almacenamiento activo

El problema es que el pricing por consultas incentiva muy mal comportamiento: analistas que hacen `SELECT *` sobre tablas de terabytes para responder una pregunta simple.

## Técnica 1: Particionamiento de tablas

Esta es la técnica con mayor ROI. Una tabla particionada divide los datos en segmentos (generalmente por fecha), y BigQuery solo escanea las particiones relevantes.

**Antes:**
```sql
-- Escanea TODA la tabla (ej: 5 años de datos = 2TB)
SELECT * FROM eventos WHERE DATE(timestamp) = '2026-01-15'
```

**Después — crear tabla particionada:**
```sql
CREATE TABLE eventos_particionada
PARTITION BY DATE(timestamp)
AS SELECT * FROM eventos;

-- Ahora esta query escanea solo 1 día de datos (ej: ~1GB)
SELECT * FROM eventos_particionada WHERE DATE(timestamp) = '2026-01-15'
```

**Importante**: Para que BigQuery use la partición, el filtro debe ser directamente sobre la columna particionada. `WHERE DATE(timestamp) = x` funciona; `WHERE EXTRACT(YEAR FROM timestamp) = 2026` no siempre.

**Impacto en nuestro caso**: 65% de reducción en bytes escaneados en las tablas más consultadas.

## Técnica 2: Clustering

El clustering organiza físicamente los datos dentro de cada partición según los valores de 1-4 columnas. Cuando queries filtran por esas columnas, BigQuery puede eliminar bloques enteros sin escanearlos.

```sql
CREATE TABLE pedidos_optimizada
PARTITION BY DATE(created_at)
CLUSTER BY country_id, seller_category, status
AS SELECT * FROM pedidos;
```

Ahora una query que filtre por `country_id = 'ARG' AND status = 'delivered'` puede ignorar todos los bloques de otros países y estados.

**Regla para elegir columnas de clustering:**
1. Columnas que aparecen en `WHERE` con más frecuencia
2. Columnas de alta cardinalidad relativa (no sirven columnas binarias como `active = true`)
3. Máximo 4 columnas

**Impacto**: 30-50% de reducción adicional sobre las tablas ya particionadas.

## Técnica 3: Materializar resultados intermedios

Muchos pipelines de analytics calculan las mismas agregaciones base una y otra vez. La solución es materializar esos resultados en una tabla y consultarla en lugar del raw data.

**El pattern:**

```sql
-- Tabla de hechos materializada (actualizar 1x/día)
CREATE OR REPLACE TABLE seller_metrics_daily AS (
  SELECT
    DATE(created_at) as metric_date,
    seller_id,
    country_id,
    COUNT(*) as orders,
    SUM(gmv) as total_gmv,
    COUNT(DISTINCT buyer_id) as unique_buyers,
    AVG(delivery_days) as avg_delivery
  FROM pedidos_raw
  WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 13 MONTH)
  GROUP BY 1, 2, 3
);
```

**Ahora las queries de los analistas:**

```sql
-- En lugar de escanear la tabla raw (200GB), escanea la materializada (2GB)
SELECT
  seller_id,
  SUM(total_gmv) as gmv_ultimo_trimestre,
  SUM(orders) as orders_ultimo_trimestre
FROM seller_metrics_daily
WHERE metric_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY seller_id
ORDER BY gmv_ultimo_trimestre DESC
LIMIT 100;
```

**Impacto**: 95%+ de reducción en bytes para queries analíticas sobre tablas materializadas.

## Técnica 4: Proyección columnar — no uses SELECT *

BigQuery es columnar: cuando hacés `SELECT *`, escanea TODAS las columnas, aunque tu análisis solo necesite 3.

**El error más común:**
```sql
-- Tabla con 40 columnas. Solo necesitás 3. Escaneás 40.
SELECT *
FROM transacciones
WHERE fecha = '2026-01-15'
  AND country = 'ARG'
LIMIT 100
```

**El fix (tedioso pero importante):**
```sql
SELECT transaction_id, amount, status
FROM transacciones
WHERE fecha = '2026-01-15'
  AND country = 'ARG'
LIMIT 100
```

En una tabla de 1TB con 40 columnas y solo necesitás 3, esto te da una reducción de **92.5%** de datos escaneados.

**Cómo hacerlo cumplir en equipo**: Configurar alertas en GCP cuando una query escanea más de X GB. Después hay una conversación educativa.

## Técnica 5: Usar Reservations en lugar de on-demand

Si tu empresa tiene una carga de BigQuery predecible, las **BigQuery Reservations** (slots comprometidos) pueden ser mucho más baratas que el pricing on-demand.

- On-demand: $5/TB escaneado, sin límite de concurrencia
- Reservations: Precio fijo por capacidad de procesamiento (slots), ideal para cargas predecibles

**Cuándo cambia el análisis**: Si tu gasto on-demand supera ~$10,000 USD/mes, vale la pena analizar reservations. El breakeven depende de tu patrón de uso.

En nuestro caso, pasamos un 60% de nuestras cargas a reservations (el batch diario) y mantuvimos el 40% ad-hoc en on-demand. Esto redujo el costo total en 25% adicional.

## Técnica 6: Table expiration y archivado

Datos viejos que nadie consulta siguen cobrando almacenamiento. BigQuery permite configurar expiración automática:

```sql
-- Configurar expiración a 90 días para tablas temporales
CREATE TABLE logs_temporales
OPTIONS (expiration_timestamp = TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 90 DAY))
AS SELECT * FROM logs_raw WHERE DATE(created_at) = CURRENT_DATE();
```

Para datos históricos que se consultan raramente, moverlos a **long-term storage** (automático después de 90 días sin modificación) reduce el costo de almacenamiento de $0.02/GB a $0.01/GB.

Identificar tablas candidatas:
```sql
SELECT
  table_id,
  ROUND(size_bytes / POW(10, 9), 2) as size_gb,
  DATE(TIMESTAMP_MILLIS(last_modified_time)) as last_modified,
  DATE_DIFF(CURRENT_DATE(), DATE(TIMESTAMP_MILLIS(last_modified_time)), DAY) as days_since_modified
FROM `project.dataset.__TABLES__`
WHERE DATE_DIFF(CURRENT_DATE(), DATE(TIMESTAMP_MILLIS(last_modified_time)), DAY) > 180
ORDER BY size_bytes DESC;
```

**Impacto**: 15% de reducción en costos de almacenamiento.

## Técnica 7: Query caching y scheduled queries

BigQuery cachea resultados por 24hs. Aprovechar esto:

```python
# Airflow DAG: correr la query pesada una vez y guardar
def ejecutar_y_cachear():
    client = bigquery.Client()
    
    job_config = bigquery.QueryJobConfig(
        destination=f"project.dataset.resultado_diario_{datetime.today().strftime('%Y%m%d')}",
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        use_query_cache=True,
    )
    
    query = """
        SELECT ... FROM tabla_grande ...
    """
    
    job = client.query(query, job_config=job_config)
    job.result()
```

Con Scheduled Queries en BigQuery, podés materializar resultados automáticamente en horarios de bajo costo (madrugada) para que estén disponibles durante el día.

## El dashboard de costos que te recomiendo implementar

Antes de optimizar, necesitás visibilidad. Este es el dataset de monitoreo que implementamos:

```sql
-- ¿Quién gasta más? ¿En qué queries?
SELECT
  user_email,
  COUNT(*) as query_count,
  ROUND(SUM(total_bytes_billed) / POW(10, 12) * 5, 2) as costo_usd,
  ROUND(AVG(total_bytes_billed) / POW(10, 9), 1) as avg_gb_por_query
FROM `region-us`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
GROUP BY user_email
ORDER BY costo_usd DESC
LIMIT 20;
```

Esta query sola te dice quiénes son los "top consumers" y dónde empezar.

## Resumen: impacto de cada técnica

| Técnica | Reducción estimada | Esfuerzo |
|---------|-------------------|----------|
| Particionamiento | 40-70% | Medio |
| Clustering | 20-50% adicional | Bajo |
| Materialización | 70-95% en analytics | Medio |
| Proyección columnar | 30-90% por query | Bajo |
| Reservations | 20-40% total | Alto (análisis inicial) |
| Table expiration | 10-20% almacenamiento | Bajo |
| Query caching | 5-15% | Bajo |

Combinando estas técnicas, pasamos de $180K a $54K mensuales. Los primeros 3 cambios (particionamiento + clustering + materialización) generaron el 80% del ahorro.

---

¿Tenés alguna situación específica donde los costos se te escaparon? Contame en LinkedIn — siempre tengo ganas de hablar de optimización de datos.
