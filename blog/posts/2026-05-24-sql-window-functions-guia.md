---
title: "SQL Window Functions: La guía definitiva con ejemplos reales"
date: "2026-05-24"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["sql", "window-functions", "analytics", "bigquery"]
excerpt: "Window functions son la feature más poderosa de SQL que muchos no usan. Te muestro cómo con casos reales de analytics."
featured: true
lang: "es"
---

## El Poder Oculto de SQL

Si solo usás `GROUP BY` para agregaciones, **te estás perdiendo del 50% de SQL**.

Window functions te permiten hacer análisis que serían imposibles (o muy feos) con GROUP BY.

## ¿Qué Son Window Functions?

Operan sobre un "window" (ventana) de filas relacionadas, **sin colapsar las filas** como GROUP BY.

### GROUP BY (colapsa filas)
```sql
SELECT 
    country,
    SUM(amount) as total
FROM transactions
GROUP BY country
```

Output: 3 filas (una por país)

### Window Function (mantiene todas las filas)
```sql
SELECT 
    country,
    amount,
    SUM(amount) OVER (PARTITION BY country) as country_total
FROM transactions
```

Output: 100M filas (todas), pero cada fila tiene el total de su país.

## Caso #1: Ranking de Ventas

**Pregunta:** Top 3 productos por categoría.

```sql
WITH ranked_products AS (
    SELECT 
        category,
        product_name,
        sales,
        ROW_NUMBER() OVER (
            PARTITION BY category 
            ORDER BY sales DESC
        ) as rank
    FROM products
)
SELECT * FROM ranked_products
WHERE rank <= 3
```

**Sin window functions:** Necesitarías subqueries horribles.

## Caso #2: Diferencia con Fila Anterior

**Pregunta:** Crecimiento día a día de ventas.

```sql
SELECT 
    date,
    daily_sales,
    LAG(daily_sales) OVER (ORDER BY date) as prev_day_sales,
    daily_sales - LAG(daily_sales) OVER (ORDER BY date) as growth
FROM sales_by_day
```

## Caso #3: Running Total

**Pregunta:** Ventas acumuladas del mes.

```sql
SELECT 
    date,
    daily_sales,
    SUM(daily_sales) OVER (
        ORDER BY date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as cumulative_sales
FROM sales_by_day
WHERE date >= '2026-05-01'
```

## Caso #4: Moving Average (7 días)

**Pregunta:** Promedio móvil de 7 días para suavizar curva.

```sql
SELECT 
    date,
    daily_sales,
    AVG(daily_sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7d
FROM sales_by_day
```

## Caso #5: Percentiles

**Pregunta:** ¿Este usuario está en top 10% de gastos?

```sql
SELECT 
    user_id,
    total_spent,
    PERCENT_RANK() OVER (ORDER BY total_spent) as percentile,
    CASE 
        WHEN PERCENT_RANK() OVER (ORDER BY total_spent) >= 0.9 
        THEN 'TOP_10%'
        ELSE 'REGULAR'
    END as segment
FROM user_spending
```

## Caso #6: First/Last Value en Grupo

**Pregunta:** Primera y última compra por usuario.

```sql
SELECT DISTINCT
    user_id,
    FIRST_VALUE(purchase_date) OVER (
        PARTITION BY user_id 
        ORDER BY purchase_date
    ) as first_purchase,
    LAST_VALUE(purchase_date) OVER (
        PARTITION BY user_id 
        ORDER BY purchase_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as last_purchase
FROM purchases
```

## Window Functions Disponibles

### Ranking
- `ROW_NUMBER()`: 1, 2, 3, 4...
- `RANK()`: 1, 2, 2, 4... (puede repetir)
- `DENSE_RANK()`: 1, 2, 2, 3... (sin gaps)
- `NTILE(n)`: Divide en n buckets

### Agregación
- `SUM()`, `AVG()`, `MIN()`, `MAX()`, `COUNT()`

### Navegación
- `LAG(col, offset)`: Fila anterior
- `LEAD(col, offset)`: Fila siguiente
- `FIRST_VALUE()`, `LAST_VALUE()`

### Estadística
- `PERCENT_RANK()`, `CUME_DIST()`

## Performance Tips

### 1. Ordena Por Columnas Indexadas

```sql
-- ✅ Rápido si date está indexado
OVER (ORDER BY date)

-- ❌ Lento
OVER (ORDER BY CONCAT(first_name, last_name))
```

### 2. Limita el Window

```sql
-- ❌ Sin límite: escanea toda la tabla
OVER (ORDER BY date)

-- ✅ Con límite: solo últimas 100 filas
OVER (
    ORDER BY date 
    ROWS BETWEEN 99 PRECEDING AND CURRENT ROW
)
```

### 3. Usa Vistas Materializadas

Si ejecutás la misma window function múltiples veces, materializala.

## Errores Comunes

### Error #1: Olvidar ORDER BY

```sql
-- ❌ Sin ORDER BY, el orden es indefinido
LAG(amount) OVER (PARTITION BY user_id)

-- ✅ Con ORDER BY, orden garantizado
LAG(amount) OVER (PARTITION BY user_id ORDER BY date)
```

### Error #2: No Entender ROWS vs RANGE

```sql
-- ROWS: Cuenta filas físicas
ROWS BETWEEN 3 PRECEDING AND CURRENT ROW  -- Exactamente 4 filas

-- RANGE: Cuenta por valor
RANGE BETWEEN INTERVAL 3 DAY PRECEDING AND CURRENT ROW  -- Últimos 3 días
```

## Caso Real en MercadoLibre

Necesitábamos detectar **usuarios con comportamiento anómalo** (posible fraude).

```sql
WITH user_behavior AS (
    SELECT 
        user_id,
        transaction_date,
        amount,
        AVG(amount) OVER (
            PARTITION BY user_id 
            ORDER BY transaction_date
            ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
        ) as avg_amount_last_30,
        STDDEV(amount) OVER (
            PARTITION BY user_id 
            ORDER BY transaction_date
            ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
        ) as stddev_last_30
    FROM transactions
)
SELECT *
FROM user_behavior
WHERE amount > avg_amount_last_30 + (3 * stddev_last_30)
-- Transacciones >3 std dev del promedio = anomalía
```

**Detectamos fraude en tiempo real** con una query.

## Conclusión

Window functions son **game-changer para analytics**.

Si no las usás, estás escribiendo SQL 10x más complejo de lo necesario.

Dominá estos 5 casos y vas a ser top 10% de data analysts.

---

*¿Querés optimizar tus queries? Leé mi post sobre [Optimización BigQuery](https://mgobeaalcoba.github.io/blog-post.html?slug=bigquery-costos-optimizacion)*
