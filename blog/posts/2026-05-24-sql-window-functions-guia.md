---
slug: sql-window-functions-guia
date: 2026-05-24
---

Si escribís SQL para analytics y no usás window functions, estás haciendo el doble de trabajo para la mitad del resultado. Las window functions son la feature más poderosa de SQL moderno, y también una de las más subestimadas.

En este artículo te las explico con ejemplos reales de e-commerce — el tipo de queries que hago en MercadoLibre.

## ¿Qué es una window function?

Una window function calcula un valor para cada fila usando un "ventana" de filas relacionadas, sin colapsar el resultado en una sola fila (como haría GROUP BY).

```sql
-- GROUP BY colapsa → una fila por grupo
SELECT seller_id, SUM(monto) as total
FROM pedidos
GROUP BY seller_id;
-- Resultado: N filas (una por vendedor)

-- Window function → una fila por pedido, con el total del vendedor
SELECT 
    pedido_id,
    seller_id,
    monto,
    SUM(monto) OVER (PARTITION BY seller_id) as total_vendedor
FROM pedidos;
-- Resultado: una fila por pedido, con el total del vendedor en cada una
```

La sintaxis básica:
```sql
funcion() OVER (
    PARTITION BY columna_agrupacion
    ORDER BY columna_orden
    ROWS/RANGE BETWEEN ... AND ...
)
```

## Las window functions que más uso

### 1. ROW_NUMBER() — Numerar filas

El caso más común: obtener el primer o último registro por grupo.

```sql
-- Top 3 pedidos por vendedor (por monto)
SELECT *
FROM (
    SELECT 
        seller_id,
        pedido_id,
        monto,
        fecha,
        ROW_NUMBER() OVER (
            PARTITION BY seller_id 
            ORDER BY monto DESC
        ) as ranking_por_vendedor
    FROM pedidos
    WHERE fecha >= '2026-01-01'
) ranked
WHERE ranking_por_vendedor <= 3;
```

Sin window functions, esto requería un subquery y un JOIN costoso.

### 2. RANK() y DENSE_RANK() — Rankings con empates

```sql
-- Diferencia entre ROW_NUMBER, RANK y DENSE_RANK
SELECT 
    vendedor_nombre,
    gmv,
    ROW_NUMBER() OVER (ORDER BY gmv DESC) as row_number,
    RANK() OVER (ORDER BY gmv DESC) as rank,
    DENSE_RANK() OVER (ORDER BY gmv DESC) as dense_rank
FROM (VALUES 
    ('A', 1000),
    ('B', 800),
    ('C', 800),   -- empate con B
    ('D', 600)
) AS t(vendedor_nombre, gmv);

-- Resultado:
-- vendedor | gmv  | row_number | rank | dense_rank
-- A        | 1000 | 1          | 1    | 1
-- B        | 800  | 2          | 2    | 2
-- C        | 800  | 3          | 2    | 2  ← mismo rank que B
-- D        | 600  | 4          | 4    | 3  ← RANK salta el 3, DENSE_RANK no
```

### 3. LAG() y LEAD() — Comparar con filas anteriores/siguientes

Ideales para análisis de tendencias:

```sql
-- Comparar ventas mes a mes
SELECT 
    seller_id,
    DATE_TRUNC('month', fecha) as mes,
    SUM(monto) as gmv_mes,
    LAG(SUM(monto)) OVER (
        PARTITION BY seller_id 
        ORDER BY DATE_TRUNC('month', fecha)
    ) as gmv_mes_anterior,
    SUM(monto) - LAG(SUM(monto)) OVER (
        PARTITION BY seller_id 
        ORDER BY DATE_TRUNC('month', fecha)
    ) as variacion_abs,
    ROUND(
        (SUM(monto) / NULLIF(LAG(SUM(monto)) OVER (
            PARTITION BY seller_id 
            ORDER BY DATE_TRUNC('month', fecha)
        ), 0) - 1) * 100,
        2
    ) as variacion_pct
FROM pedidos
WHERE fecha >= '2025-01-01'
GROUP BY seller_id, DATE_TRUNC('month', fecha)
ORDER BY seller_id, mes;
```

```sql
-- ¿Cuánto tiempo entre compras del mismo usuario?
SELECT 
    buyer_id,
    pedido_id,
    fecha,
    LAG(fecha) OVER (PARTITION BY buyer_id ORDER BY fecha) as compra_anterior,
    fecha - LAG(fecha) OVER (PARTITION BY buyer_id ORDER BY fecha) as dias_entre_compras
FROM pedidos
ORDER BY buyer_id, fecha;
```

### 4. SUM() OVER — Acumulados y ventanas móviles

```sql
-- GMV acumulado por mes
SELECT 
    mes,
    gmv_mes,
    SUM(gmv_mes) OVER (ORDER BY mes 
                       ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                      ) as gmv_acumulado
FROM ventas_mensuales;

-- Media móvil de 7 días
SELECT 
    fecha,
    gmv_diario,
    AVG(gmv_diario) OVER (
        ORDER BY fecha
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW  -- 7 días (6 anteriores + actual)
    ) as media_movil_7d
FROM ventas_diarias
ORDER BY fecha;

-- GMV de los últimos 30 días para cada día (ventana deslizante)
SELECT 
    fecha,
    gmv_diario,
    SUM(gmv_diario) OVER (
        ORDER BY fecha
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) as gmv_30d
FROM ventas_diarias;
```

### 5. PERCENT_RANK() y NTILE() — Percentiles y cuartiles

```sql
-- ¿En qué percentil está cada vendedor?
SELECT 
    seller_id,
    gmv_total,
    ROUND(PERCENT_RANK() OVER (ORDER BY gmv_total) * 100, 1) as percentil,
    NTILE(4) OVER (ORDER BY gmv_total) as cuartil  -- 1=bottom, 4=top
FROM (
    SELECT seller_id, SUM(monto) as gmv_total
    FROM pedidos
    WHERE EXTRACT(YEAR FROM fecha) = 2026
    GROUP BY seller_id
) vendedores_gmv;
```

### 6. FIRST_VALUE() y LAST_VALUE() — Primer/último valor de la ventana

```sql
-- Para cada pedido, mostrar el primer y último pedido del mismo comprador
SELECT 
    buyer_id,
    pedido_id,
    fecha,
    monto,
    FIRST_VALUE(fecha) OVER (
        PARTITION BY buyer_id 
        ORDER BY fecha
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as primera_compra,
    LAST_VALUE(fecha) OVER (
        PARTITION BY buyer_id 
        ORDER BY fecha
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as ultima_compra
FROM pedidos;
```

## Un caso real complejo: análisis de cohortes

Las cohortes agrupan usuarios por su fecha de primera compra y miden la retención en el tiempo:

```sql
WITH primera_compra AS (
    -- Determinar el mes de primera compra de cada usuario
    SELECT 
        buyer_id,
        DATE_TRUNC('month', MIN(fecha)) as cohort_mes
    FROM pedidos
    GROUP BY buyer_id
),
actividad_mensual AS (
    -- Para cada usuario, determinar en qué meses compró
    SELECT DISTINCT
        p.buyer_id,
        pc.cohort_mes,
        DATE_TRUNC('month', p.fecha) as mes_actividad,
        DATE_DIFF(
            DATE_TRUNC('month', p.fecha),
            pc.cohort_mes,
            MONTH
        ) as meses_desde_cohort
    FROM pedidos p
    JOIN primera_compra pc USING (buyer_id)
)
SELECT 
    cohort_mes,
    meses_desde_cohort,
    COUNT(DISTINCT buyer_id) as usuarios_activos,
    FIRST_VALUE(COUNT(DISTINCT buyer_id)) OVER (
        PARTITION BY cohort_mes 
        ORDER BY meses_desde_cohort
    ) as usuarios_cohort,
    ROUND(
        COUNT(DISTINCT buyer_id) * 100.0 / 
        FIRST_VALUE(COUNT(DISTINCT buyer_id)) OVER (
            PARTITION BY cohort_mes 
            ORDER BY meses_desde_cohort
        ),
        1
    ) as tasa_retencion_pct
FROM actividad_mensual
GROUP BY cohort_mes, meses_desde_cohort
ORDER BY cohort_mes, meses_desde_cohort;
```

Este análisis, sin window functions, requeriría múltiples JOINs y subqueries. Con window functions, es legible y eficiente.

## Performance: cuándo las window functions son costosas

Las window functions son generalmente eficientes, pero pueden ser costosas cuando:

1. **La partición es muy grande**: Si `PARTITION BY seller_id` resulta en una sola partición con millones de filas, toda la data tiene que procesarse junta
2. **Muchas window functions en la misma query**: Cada `OVER()` diferente puede requerir un sort adicional
3. **Ventanas de tamaño variable**: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` sobre tablas grandes

**Optimización**: Si usás la misma `OVER()` en múltiples funciones, el motor las puede combinar:

```sql
-- Eficiente: misma ventana para todas las funciones
SELECT 
    seller_id,
    fecha,
    monto,
    SUM(monto) OVER w as total,
    AVG(monto) OVER w as promedio,
    COUNT(*) OVER w as cantidad
FROM pedidos
WINDOW w AS (PARTITION BY seller_id ORDER BY fecha)
```

La cláusula `WINDOW` define la ventana una vez y la reutilizás — más legible y el optimizer puede ser más eficiente.

---

Las window functions van a cambiar cómo escribís SQL. Una vez que las internalizás, vas a encontrar aplicaciones en casi cada análisis que hacés. El mejor ejercicio: la próxima vez que uses un subquery con JOIN para comparar filas del mismo grupo, preguntate si `LAG()` o `ROW_NUMBER()` no resuelven lo mismo en una sola query.
