---
slug: sql-window-functions-guia
date: 2026-05-24
---

Las window functions son la herramienta más poderosa de SQL que la mayoría de los analistas subutiliza. Permiten cálculos sobre grupos de filas sin colapsar el resultado como GROUP BY. Guía completa con casos de uso reales.

## La diferencia fundamental

```sql
-- GROUP BY: colapsa las filas, perdés el detalle
SELECT seller_id, SUM(gmv) as total_gmv
FROM orders
GROUP BY seller_id;
-- Resultado: 1 fila por seller

-- Window Function: mantiene todas las filas + agrega el cálculo
SELECT
  seller_id,
  order_id,
  gmv,
  SUM(gmv) OVER (PARTITION BY seller_id) as seller_total_gmv,
  gmv / SUM(gmv) OVER (PARTITION BY seller_id) as pct_of_seller_total
FROM orders;
-- Resultado: todas las órdenes + el total del seller en cada fila
```

## ROW_NUMBER, RANK, DENSE_RANK

```sql
-- ¿Cuál fue la primera orden de cada buyer?
SELECT *
FROM (
  SELECT
    buyer_id,
    order_id,
    gmv,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY buyer_id ORDER BY created_at ASC) as order_number
  FROM orders
)
WHERE order_number = 1;

-- Top 3 sellers por GMV en cada país
SELECT *
FROM (
  SELECT
    country,
    seller_id,
    SUM(gmv) as total_gmv,
    RANK() OVER (PARTITION BY country ORDER BY SUM(gmv) DESC) as country_rank
  FROM orders
  GROUP BY country, seller_id
)
WHERE country_rank <= 3;
```

**Diferencia ROW_NUMBER vs RANK vs DENSE_RANK**:

| Valores | ROW_NUMBER | RANK | DENSE_RANK |
|---------|-----------|------|-----------|
| 100, 100, 90 | 1, 2, 3 | 1, 1, 3 | 1, 1, 2 |

## LAG y LEAD: acceder a filas anteriores/siguientes

```sql
-- Comparar métricas del mes actual vs mes anterior
WITH monthly_gmv AS (
  SELECT
    DATE_TRUNC('month', created_at) as month,
    country,
    SUM(gmv) as gmv
  FROM orders
  GROUP BY 1, 2
)
SELECT
  month,
  country,
  gmv as current_gmv,
  LAG(gmv) OVER (PARTITION BY country ORDER BY month) as prev_month_gmv,
  LEAD(gmv) OVER (PARTITION BY country ORDER BY month) as next_month_gmv,
  ROUND(
    (gmv - LAG(gmv) OVER (PARTITION BY country ORDER BY month)) * 100.0 /
    NULLIF(LAG(gmv) OVER (PARTITION BY country ORDER BY month), 0),
    2
  ) as mom_growth_pct
FROM monthly_gmv
ORDER BY country, month;
```

## Running totals y Moving Averages

```sql
-- Acumulado de GMV por día
SELECT
  order_date,
  daily_gmv,
  SUM(daily_gmv) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) as cumulative_gmv,
  AVG(daily_gmv) OVER (ORDER BY order_date ROWS 6 PRECEDING) as rolling_7day_avg
FROM (
  SELECT DATE(created_at) as order_date, SUM(gmv) as daily_gmv
  FROM orders
  GROUP BY 1
);
```

## NTILE: dividir en percentiles

```sql
-- Clasificar sellers en cuartiles por GMV
SELECT
  seller_id,
  total_gmv,
  NTILE(4) OVER (ORDER BY total_gmv) as gmv_quartile,
  CASE NTILE(4) OVER (ORDER BY total_gmv)
    WHEN 4 THEN 'Top Seller'
    WHEN 3 THEN 'Good Seller'
    WHEN 2 THEN 'Average Seller'
    WHEN 1 THEN 'Low Seller'
  END as seller_tier
FROM (
  SELECT seller_id, SUM(gmv) as total_gmv
  FROM orders
  GROUP BY seller_id
);
```

## FIRST_VALUE y LAST_VALUE

```sql
-- Para cada orden, mostrar el primer y último precio del seller ese mes
SELECT
  order_id,
  seller_id,
  price,
  created_at,
  FIRST_VALUE(price) OVER (
    PARTITION BY seller_id, DATE_TRUNC('month', created_at)
    ORDER BY created_at
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) as first_price_of_month,
  LAST_VALUE(price) OVER (
    PARTITION BY seller_id, DATE_TRUNC('month', created_at)
    ORDER BY created_at
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) as last_price_of_month
FROM order_items;
```

## Caso de uso completo: cohort analysis

```sql
-- Retention de compradores por cohorte mensual
WITH first_purchase AS (
  SELECT
    buyer_id,
    DATE_TRUNC('month', MIN(created_at)) as cohort_month
  FROM orders
  GROUP BY buyer_id
),
monthly_activity AS (
  SELECT DISTINCT
    o.buyer_id,
    DATE_TRUNC('month', o.created_at) as activity_month
  FROM orders o
)
SELECT
  fp.cohort_month,
  DATE_DIFF(ma.activity_month, fp.cohort_month, MONTH) as months_since_first,
  COUNT(DISTINCT fp.buyer_id) as cohort_size,
  COUNT(DISTINCT ma.buyer_id) as retained_buyers,
  ROUND(COUNT(DISTINCT ma.buyer_id) * 100.0 / 
    FIRST_VALUE(COUNT(DISTINCT ma.buyer_id)) OVER (
      PARTITION BY fp.cohort_month
      ORDER BY DATE_DIFF(ma.activity_month, fp.cohort_month, MONTH)
    ), 2) as retention_pct
FROM first_purchase fp
JOIN monthly_activity ma USING (buyer_id)
GROUP BY 1, 2
ORDER BY 1, 2;
```

Las window functions hacen que análisis complejos como cohort analysis sean posibles directamente en SQL, sin necesidad de Python o múltiples queries.
