---
slug: optimizar-queries-mercadolibre
date: 2026-02-01
---

Hace dos años, teníamos una query en BigQuery que tardaba **2 minutos y 10 segundos** en ejecutarse. Procesaba 180 millones de filas y consumía 340 GB de datos escaneados por ejecución. Se ejecutaba 500 veces por día. Las matemáticas eran devastadoras.

Hoy esa misma query tarda **4.8 segundos** y escanea 8 GB. Acá te cuento exactamente cómo lo hicimos.

## El problema original

La query calculaba métricas de performance de vendedores para el equipo de analytics. El SQL original era así:

```sql
SELECT
  seller_id,
  COUNT(*) as total_orders,
  SUM(gmv) as total_gmv,
  AVG(delivery_time) as avg_delivery,
  COUNT(DISTINCT buyer_id) as unique_buyers
FROM orders_raw
WHERE DATE(created_at) BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY seller_id
ORDER BY total_gmv DESC
```

Simple, ¿no? El problema estaba en los detalles.

## Error #1: No usar particionamiento

`orders_raw` tenía **12 años de datos** — aproximadamente 15 billones de filas. La cláusula `WHERE DATE(created_at)` no usaba la partición de la tabla porque aplicaba una función sobre la columna particionada.

**Fix**: Cambiar `DATE(created_at)` por `created_at`:

```sql
WHERE created_at >= '2025-01-01'
  AND created_at < '2026-01-01'
```

Esto redujo los datos escaneados de 340 GB a 120 GB de un solo movimiento. Ahorro: 65% de costos en esa sola línea.

## Error #2: `COUNT(DISTINCT)` sin pre-agrupación

El `COUNT(DISTINCT buyer_id)` sobre 180 millones de filas es extremadamente costoso en BigQuery. BigQuery tiene que construir un mapa de hash gigante para cada vendedor.

**Fix**: Pre-agregar en un subquery:

```sql
WITH buyer_counts AS (
  SELECT
    seller_id,
    COUNT(DISTINCT buyer_id) as unique_buyers
  FROM orders_raw
  WHERE created_at >= '2025-01-01'
    AND created_at < '2026-01-01'
  GROUP BY seller_id
),
order_metrics AS (
  SELECT
    seller_id,
    COUNT(*) as total_orders,
    SUM(gmv) as total_gmv,
    AVG(delivery_time) as avg_delivery
  FROM orders_raw
  WHERE created_at >= '2025-01-01'
    AND created_at < '2026-01-01'
  GROUP BY seller_id
)
SELECT
  om.*,
  bc.unique_buyers
FROM order_metrics om
LEFT JOIN buyer_counts bc USING (seller_id)
ORDER BY total_gmv DESC
```

Esto parecía más código pero era mucho más eficiente porque BigQuery podía paralelizar mejor los dos subqueries.

## Error #3: Clustering no configurado

La tabla tenía particionamiento por fecha pero no tenía **clustering**. El clustering en BigQuery permite que el motor elimine bloques de datos que no coinciden con los filtros de la query.

Después de analizar las queries más frecuentes, vimos que siempre filtrábamos por `country_id` además de la fecha. Recreamos la tabla con clustering:

```sql
CREATE TABLE orders_raw_v2
PARTITION BY DATE(created_at)
CLUSTER BY country_id, seller_id
AS SELECT * FROM orders_raw;
```

Con clustering por `country_id`, las queries que filtraban por Argentina (el 40% del volumen) pasaron a escanear 40% menos datos automáticamente.

## Error #4: Materializar resultados intermedios

El equipo de analytics corría la misma query base (sin los filtros específicos) múltiples veces por día con distintos filtros downstream. Cada corrida re-escaneaba todo.

**Fix**: Crear una tabla materializada que se actualizaba una vez por día:

```sql
CREATE OR REPLACE TABLE seller_daily_metrics
PARTITION BY metric_date
CLUSTER BY seller_id
AS (
  SELECT
    DATE(created_at) as metric_date,
    seller_id,
    country_id,
    COUNT(*) as total_orders,
    SUM(gmv) as total_gmv,
    AVG(delivery_time) as avg_delivery,
    COUNT(DISTINCT buyer_id) as unique_buyers
  FROM orders_raw
  WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 400 DAY)
  GROUP BY 1, 2, 3
);
```

Las 500 corridas diarias ahora consultaban `seller_daily_metrics` (8 GB) en lugar de `orders_raw` (340 GB). El ahorro fue del orden de los **$15,000 USD mensuales** solo en esa tabla.

## Error #5: Proyección excesiva

Un detalle menor pero importante: BigQuery cobra por columnas escaneadas. Varios pipelines hacían `SELECT *` cuando solo necesitaban 5-6 columnas de una tabla de 40 columnas.

**Fix**: Listar explícitamente las columnas necesarias. Parecía obvio, pero en un contexto de equipo con decenas de analistas, era sorprendentemente común.

## Resultado final

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Duración | 2m 10s | 4.8s | **27x más rápido** |
| Datos escaneados | 340 GB | 8 GB | **97.6% reducción** |
| Costo por ejecución | ~$1.70 | ~$0.04 | **97% menos costo** |
| Costo mensual (500 runs/día) | ~$25,500 | ~$600 | **$24,900 ahorrados** |

## El proceso para encontrar estas optimizaciones

No llegamos a estas soluciones de golpe. El proceso fue:

1. **Identificar la query más costosa** con el Query History de BigQuery y los billing reports de GCP
2. **Analizar el execution plan** en BigQuery con "Execution Details" — ahí ves exactamente cuánto tiempo tarda cada step y cuántos bytes procesa
3. **Medir antes de optimizar** — siempre con `EXPLAIN` o la preview de bytes antes de ejecutar
4. **Cambios incrementales** — no hacer 5 optimizaciones a la vez; medir el impacto de cada una
5. **Documentar** — crear un registro de qué se cambió y por qué

## Herramientas que usamos

- **BigQuery Information Schema**: Para identificar queries frecuentes y costosas
- **GCP Cost Breakdown**: Para mapear qué datasets y jobs generan más costo
- **dbt**: Para versionar y documentar los cambios en las queries
- **Looker**: Para validar que los resultados del optimizado coincidían con el original

---

La optimización de queries no es magia — es metodología. Identificá el problema correcto, medí, cambiá una cosa a la vez, medí de nuevo. El ahorro de $24,900 mensuales pagó en días el tiempo invertido.

Si querés profundizar en BigQuery, en breve publico otro artículo con las 7 técnicas que usamos para reducir costos generales en un 70%. Stay tuned.
