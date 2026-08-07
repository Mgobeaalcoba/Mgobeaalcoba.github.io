---
slug: bigquery-costos-optimizacion
date: 2026-01-25
---

BigQuery factura por los bytes escaneados, no por tiempo de ejecución. Esto significa que una sola query mal escrita puede costar más que todo un mes de desarrollo. Acá el framework que uso para mantener los costos bajo control en equipos de 20+ analistas.

## Entender el modelo de costos de BigQuery

BigQuery tiene dos modelos de pricing:

1. **On-demand**: $5-6.25 USD por TB escaneado (según región)
2. **Reservas de slots**: Precio fijo por capacidad de compute

Para la mayoría de los equipos medianos, on-demand es lo que usan. El problema: 1 TB escaneado = $6.25. Una tabla de 5 TB consultada 100 veces por día = $3,125/día sin optimización.

## Las 5 palancas de reducción de costos

### 1. Particionamiento efectivo

```sql
-- Tabla sin particionar: escanea TODO
SELECT * FROM events WHERE DATE(created_at) = '2026-01-15';

-- Tabla particionada por created_at:
-- Escanea solo la partición del 2026-01-15
CREATE TABLE events_partitioned
PARTITION BY DATE(created_at)
AS SELECT * FROM events;

-- Ahora esta query escanea 1/365 de los datos (o menos)
SELECT * FROM events_partitioned WHERE DATE(created_at) = '2026-01-15';
```

**Reducción típica**: 80-95% en tablas con muchos períodos históricos.

### 2. Clustering para filtros frecuentes

El clustering ordena físicamente los datos dentro de cada partición:

```sql
CREATE TABLE events_optimized
PARTITION BY DATE(created_at)
CLUSTER BY country_id, seller_id, event_type
AS SELECT * FROM events;

-- Esta query ahora escanea una fracción mínima de la partición
SELECT seller_id, COUNT(*) as events
FROM events_optimized
WHERE DATE(created_at) = '2026-01-15'
  AND country_id = 'ARG'
  AND event_type = 'purchase'
GROUP BY seller_id;
```

**Cuándo usar**: Cuando las queries frecuentes filtran por las mismas 2-4 columnas.

### 3. Tablas materializadas para queries repetitivas

```sql
CREATE MATERIALIZED VIEW seller_daily_summary AS
SELECT
  DATE(created_at) as metric_date,
  country_id,
  seller_id,
  COUNT(*) as total_events,
  COUNTIF(event_type = 'purchase') as purchases,
  SUM(gmv) as total_gmv
FROM events_partitioned
WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY 1, 2, 3;
```

BigQuery actualiza las materialized views automáticamente cuando los datos fuente cambian (con algunas limitaciones). Para reportes que se consultan cientos de veces por día, esto puede ahorrar 99% del costo.

### 4. Proyección selectiva

```sql
-- Mal: escanea todas las columnas de una tabla de 40 columnas
SELECT * FROM orders WHERE seller_id = 12345;

-- Bien: solo escanea las columnas necesarias
SELECT order_id, status, gmv, created_at
FROM orders
WHERE seller_id = 12345;
```

**Impacto**: En BigQuery columnar storage, `SELECT *` escanea 40 columnas. `SELECT 4 columns` escanea solo esas 4. Si las otras 36 columnas son pesadas (strings largos, arrays), el ahorro puede ser del 70%+.

### 5. Usar BI Engine para dashboards

Para dashboards que los analistas consultan constantemente, BigQuery BI Engine crea un cache in-memory:

```
BigQuery BI Engine:
- Precio: ~$37/GB de capacity reservada por mes
- Velocidad: queries en milisegundos en lugar de segundos
- Costo por query: $0 (no escanea bytes)
```

Para un dashboard consultado 10,000 veces por día sobre una tabla de 100 GB, BI Engine puede ser 10-50x más barato que on-demand.

## Governance de costos en equipos

El problema real no es una sola query costosa — es 20 analistas corriendo queries sin awareness del costo.

### Configurar alertas de costos

```python
# Script para detectar queries costosas via BigQuery Jobs API
from google.cloud import bigquery
from datetime import datetime, timedelta

def get_expensive_queries(project_id: str, threshold_gb: float = 100) -> list:
    client = bigquery.Client(project=project_id)
    
    yesterday = (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    query = f"""
    SELECT
      job_id,
      user_email,
      ROUND(total_bytes_processed / POW(1024, 3), 2) as gb_processed,
      ROUND(total_bytes_processed / POW(1024, 4) * 6.25, 2) as cost_usd,
      query
    FROM `region-us`.INFORMATION_SCHEMA.JOBS
    WHERE creation_time >= '{yesterday}'
      AND total_bytes_processed > {threshold_gb * 1024**3}
    ORDER BY total_bytes_processed DESC
    LIMIT 20
    """
    
    results = client.query(query).result()
    return [dict(row) for row in results]
```

### Custom quotas por usuario

```sql
-- En BigQuery, configurar custom quotas vía API
-- Limitar a 1 TB por día por usuario:
gcloud alpha bigquery quotas update \
  --project=my-project \
  --metric=bigquery.googleapis.com/quota/query/usage \
  --user=analyst@company.com \
  --limit=1000000000000  # 1 TB en bytes
```

### Dashboard de costos en tiempo real

```sql
-- Vista en BigQuery para monitorear costos del día
CREATE OR REPLACE VIEW cost_monitoring AS
SELECT
  DATE(creation_time) as query_date,
  user_email,
  COUNT(*) as query_count,
  SUM(total_bytes_processed) / POW(1024, 4) as total_tb,
  ROUND(SUM(total_bytes_processed) / POW(1024, 4) * 6.25, 2) as estimated_cost_usd
FROM `region-us`.INFORMATION_SCHEMA.JOBS
WHERE creation_time >= DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
  AND job_type = 'QUERY'
  AND state = 'DONE'
GROUP BY 1, 2
ORDER BY estimated_cost_usd DESC;
```

## Resultado real

Implementando estas 5 palancas en nuestro equipo:

- **Costo mensual antes**: ~$45,000 USD
- **Costo mensual después**: ~$8,200 USD
- **Ahorro**: $36,800 USD/mes (82% de reducción)

El cambio más impactante fue el particionamiento + clustering de las 3 tablas más consultadas. Ese solo ajuste redujo el costo en 60%.
