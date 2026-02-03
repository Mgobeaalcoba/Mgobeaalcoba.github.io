---
title: "BigQuery: Cómo reduje costos en 70% con estas 7 técnicas"
date: "2026-03-01"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["bigquery", "gcp", "costos", "performance"]
excerpt: "Estrategias probadas en MercadoLibre para reducir costos masivos en BigQuery. Desde particionamiento hasta clustering, técnicas que generan ahorros reales."
featured: true
lang: "es"
---

## El Problema de los Costos en BigQuery

BigQuery es increíblemente poderoso, pero **puede vaciar tu presupuesto** si no sabés lo que estás haciendo.

En MercadoLibre, nuestras queries de analytics estaban generando **$15,000 USD mensuales** en costos. Después de aplicar estas técnicas, bajamos a **$4,500 USD**.

## Técnica #1: Particionamiento por Fecha

**Antes:**
```sql
SELECT * FROM transactions
WHERE DATE(created_at) >= '2026-01-01'
```

**Después:**
```sql
SELECT * FROM transactions
WHERE _PARTITIONDATE >= '2026-01-01'
```

**Ahorro:** 95% menos datos escaneados.

## Técnica #2: Clustering Inteligente

```sql
CREATE TABLE transactions
PARTITION BY DATE(created_at)
CLUSTER BY user_id, country_code
AS SELECT * FROM source_table
```

**Ahorro:** 40% adicional en queries filtradas por user_id.

## Técnica #3: Materializar Queries Frecuentes

Si ejecutás la misma query 100 veces al día, **materializala**.

```sql
CREATE MATERIALIZED VIEW daily_aggregates AS
SELECT 
  DATE(created_at) as date,
  country_code,
  SUM(amount) as total_amount
FROM transactions
GROUP BY 1, 2
```

**Ahorro:** 98% en queries repetidas.

## Técnica #4: Usa Tablas Externas para Staging

Para datos que cambian poco, usa Google Cloud Storage:

```sql
CREATE EXTERNAL TABLE staging_data
OPTIONS (
  format = 'PARQUET',
  uris = ['gs://bucket/data/*.parquet']
)
```

**Ahorro:** $0 de storage en BigQuery.

## Técnica #5: Slots Reservados vs On-Demand

Para workloads predecibles, **slots reservados son más baratos**.

- On-demand: $6.25 por TB escaneado
- Flat-rate: $2,000/mes por 100 slots

Si escaneás >320TB/mes, flat-rate gana.

## Técnica #6: Monitoreo de Costos

```python
# Script diario de monitoring
from google.cloud import bigquery

client = bigquery.Client()

query = """
SELECT 
  user_email,
  SUM(total_bytes_billed) / 1024 / 1024 / 1024 / 1024 as tb_billed,
  SUM(total_bytes_billed) * 6.25 / 1024 / 1024 / 1024 / 1024 as cost_usd
FROM `project.region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
WHERE creation_time >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY 1
ORDER BY 3 DESC
LIMIT 10
"""

# Top 10 usuarios por costo
for row in client.query(query):
    print(f"{row.user_email}: ${row.cost_usd:.2f}")
```

## Técnica #7: Cache de Resultados

BigQuery cachea queries por 24hs. **Aprovechalo.**

```python
# Forzar uso de cache
job_config = bigquery.QueryJobConfig(use_query_cache=True)
results = client.query(query, job_config=job_config)
```

## Resultados en MercadoLibre

| Métrica | Antes | Después | Ahorro |
|---------|-------|---------|--------|
| **Costo mensual** | $15,000 | $4,500 | **-70%** |
| **TB escaneados** | 2,400 TB | 720 TB | **-70%** |
| **Tiempo avg query** | 45s | 8s | **-82%** |

## Conclusión

Optimizar BigQuery no es opcional: **es mandatorio**.

Estas 7 técnicas nos ahorraron **$126,000 USD anuales**. Implementalas y verás resultados inmediatos.

---

*¿Querés más tips de optimización? Seguime en [LinkedIn](https://www.linkedin.com/in/mariano-gobea-alcoba/)*
