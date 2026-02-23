---
slug: dbt-analytics-engineering
date: 2026-04-05
---

dbt (data build tool) transformó cómo los equipos de datos escriben SQL. Dos años después de adoptarlo en producción, acá el análisis honesto de qué funciona y qué no.

## ¿Por qué dbt?

Antes de dbt, nuestro SQL de transformación era un desastre:
- Scripts SQL en carpetas sin orden
- Sin tests para validar los datos
- Sin documentación sobre qué hace cada query
- Dependencias entre queries manejadas manualmente

dbt resuelve esto con un enfoque de software engineering aplicado al SQL.

## La estructura básica

```
analytics/
├── dbt_project.yml
├── models/
│   ├── staging/           # Datos crudos limpiados
│   │   ├── stg_orders.sql
│   │   └── stg_sellers.sql
│   ├── intermediate/      # Joins y transformaciones
│   │   └── int_seller_orders.sql
│   └── marts/             # Tablas finales para BI
│       └── mart_seller_metrics.sql
├── tests/
└── macros/
```

## Modelos con referencias

```sql
-- models/staging/stg_orders.sql
-- Limpia datos crudos de la tabla orders

SELECT
  order_id,
  TRIM(seller_id) as seller_id,
  CAST(gmv AS NUMERIC) as gmv,
  PARSE_TIMESTAMP("%Y-%m-%d %H:%M:%S", created_at) as created_at,
  LOWER(status) as status
FROM {{ source("raw", "orders") }}
WHERE order_id IS NOT NULL
  AND gmv > 0

-- models/marts/mart_seller_metrics.sql
-- Métricas diarias por seller

WITH orders AS (
  SELECT * FROM {{ ref("stg_orders") }}
),
sellers AS (
  SELECT * FROM {{ ref("stg_sellers") }}
)
SELECT
  DATE(o.created_at) as metric_date,
  s.seller_id,
  s.country,
  COUNT(*) as total_orders,
  SUM(o.gmv) as total_gmv,
  AVG(o.gmv) as avg_gmv
FROM orders o
JOIN sellers s USING (seller_id)
WHERE o.status = "completed"
GROUP BY 1, 2, 3
```

## Tests: la killer feature

```yaml
# models/staging/schema.yml
version: 2

models:
  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: gmv
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000
      - name: status
        tests:
          - accepted_values:
              values: ["pending", "completed", "cancelled"]
```

```bash
# Correr todos los tests
dbt test

# Output
Found 24 models, 89 tests
Completed successfully. Pass: 89, Warn: 0, Error: 0, Skip: 0
```

## Materializations

```sql
-- Table: reconstruye la tabla completa cada run
{{ config(materialized="table") }}

-- View: no almacena datos, solo la query
{{ config(materialized="view") }}

-- Incremental: solo procesa registros nuevos
{{ config(
    materialized="incremental",
    unique_key="order_id",
    partition_by={"field": "created_at", "data_type": "timestamp"}
) }}

SELECT * FROM {{ source("raw", "orders") }}
{% if is_incremental() %}
  WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}
```

## Lo que no funciona bien

1. **Debugging es difícil**: Cuando un modelo falla, el error a veces está varios pasos upstream
2. **No es para lógica compleja**: dbt es SQL. Si necesitás Python, se complica (dbt Python models existen pero son limitados)
3. **Compile time**: Con 300+ modelos, `dbt compile` tarda. Los CI/CD se sienten lentos

## Veredicto

dbt es casi obligatorio para equipos de analytics de 3+ personas. El valor está en los tests y la documentación automática. La curva de aprendizaje es de 1-2 semanas para alguien con SQL sólido.
