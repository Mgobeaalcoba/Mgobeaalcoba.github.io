---
title: "dbt: La herramienta que cambió el Analytics Engineering"
date: "2026-04-05"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["dbt", "analytics-engineering", "sql", "transformation"]
excerpt: "Por qué dbt se convirtió en el estándar de la industria y cómo empezar a usarlo en tu equipo de datos."
featured: false
lang: "es"
---

## El Antes y Después de dbt

Antes de dbt, los pipelines de transformación eran un **desastre**:
- SQL scripts en Jupyter notebooks
- Copy-paste de queries
- Zero testing
- Deploy manual con copy-paste a producción

dbt cambió todo.

## ¿Qué es dbt?

**Data Build Tool**: Framework para transformaciones SQL con:
- Versionado (Git)
- Testing automático
- Documentación auto-generada
- Lineage de datos
- CI/CD integration

## Tu Primer Modelo dbt

```sql
-- models/staging/stg_transactions.sql
{{
  config(
    materialized='view'
  )
}}

SELECT
    transaction_id,
    user_id,
    CAST(amount AS FLOAT64) as amount,
    DATE(created_at) as transaction_date,
    country_code
FROM {{ source('raw', 'transactions') }}
WHERE amount > 0
```

## Testing Built-in

```yaml
# models/staging/schema.yml
version: 2

models:
  - name: stg_transactions
    description: "Transactions staging table"
    columns:
      - name: transaction_id
        tests:
          - unique
          - not_null
      - name: amount
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              inclusive: false
```

Correr tests:
```bash
dbt test --select stg_transactions
```

## Documentación Automática

```yaml
models:
  - name: stg_transactions
    description: "Cleaned and validated transactions"
    columns:
      - name: transaction_id
        description: "Unique transaction identifier"
      - name: user_id
        description: "Reference to users table"
```

Generar docs:
```bash
dbt docs generate
dbt docs serve  # Localhost:8080
```

Resultado: **Documentación visual con lineage graph**.

## Incremental Models (Para Tablas Grandes)

```sql
{{
  config(
    materialized='incremental',
    unique_key='transaction_id'
  )
}}

SELECT * FROM {{ source('raw', 'transactions') }}

{% if is_incremental() %}
  WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}
```

Solo procesa **datos nuevos** en cada corrida.

## Macros: DRY en SQL

```sql
-- macros/calculate_margin.sql
{% macro calculate_margin(revenue, cost) %}
  ROUND((({{ revenue }} - {{ cost }}) / {{ revenue }}) * 100, 2)
{% endmacro %}

-- Usar en modelos
SELECT
  product_id,
  {{ calculate_margin('revenue', 'cost') }} as margin_percent
FROM products
```

## Deployment con GitHub Actions

```yaml
# .github/workflows/dbt.yml
name: dbt CI/CD

on:
  push:
    branches: [main]

jobs:
  dbt-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dbt
        run: pip install dbt-bigquery
      - name: Run dbt
        run: |
          dbt deps
          dbt test
          dbt run --target prod
```

## Por Qué Adoptamos dbt en MercadoLibre

1. **Version control**: Todos los cambios en Git
2. **Testing**: Captura errores antes de producción
3. **Documentación**: Self-documenting codebase
4. **Reusabilidad**: Macros eliminan duplicación
5. **Collaboration**: Analysts y engineers usan mismo tool

## Alternativas

- **Dataform** (Google, similar syntax)
- **SQLMesh** (Más features, más complejo)
- **Plain SQL** (No lo hagas en 2026)

## Conclusión

Si hacés analytics engineering y no usás dbt, **estás perdiendo tiempo y dinero**.

La inversión de aprender dbt se paga en semanas.

---

*¿Implementando dbt? Puedo ayudarte: [Consultoría BI](https://mgobeaalcoba.github.io/consulting.html)*
