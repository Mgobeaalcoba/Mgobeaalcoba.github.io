---
title: "Cómo optimizamos queries en MercadoLibre: De 2min a 5seg"
date: "2026-02-01"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["sql", "performance", "bigquery", "mercadolibre"]
excerpt: "Técnicas reales que usamos para reducir costos en BigQuery y mejorar la experiencia de usuario. Un caso práctico de optimización SQL que generó ahorros significativos."
featured: true
lang: "es"
---

## El Problema

En MercadoLibre procesamos millones de transacciones diarias. Una de nuestras queries más críticas estaba tardando **más de 2 minutos** en ejecutarse, afectando dashboards en tiempo real y generando **costos excesivos en BigQuery**.

El equipo de negocio necesitaba datos actualizados cada 5 minutos, pero con 2 minutos de latencia, estábamos siempre desfasados.

## La Query Original

```sql
SELECT *
FROM `project.dataset.transactions`
WHERE DATE(timestamp) >= '2026-01-01'
  AND user_country = 'AR'
ORDER BY timestamp DESC
```

### Problemas Identificados

1. **SELECT ***: Escaneaba 150+ columnas innecesarias
2. **DATE() function**: Invalidaba el particionamiento de la tabla
3. **Sin LIMIT**: Procesaba millones de filas sin restricción
4. **ORDER BY en toda la tabla**: Sorting de dataset completo

## La Solución: Optimización Paso a Paso

### Paso 1: Selección Específica de Columnas

```sql
SELECT 
    transaction_id,
    user_id,
    amount,
    timestamp
FROM `project.dataset.transactions`
```

**Resultado:** Reducción del 90% en datos escaneados.

### Paso 2: Aprovechar Particionamiento

```sql
WHERE _PARTITIONDATE >= '2026-01-01'
  AND user_country = 'AR'
```

**Resultado:** BigQuery ahora usa las particiones eficientemente.

### Paso 3: Agregar LIMIT Apropiado

```sql
LIMIT 1000
```

**Resultado:** Solo procesamos lo que realmente necesitamos mostrar.

### Paso 4: Query Final Optimizada

```sql
SELECT 
    transaction_id,
    user_id,
    amount,
    timestamp
FROM `project.dataset.transactions`
WHERE _PARTITIONDATE >= '2026-01-01'
  AND user_country = 'AR'
ORDER BY timestamp DESC
LIMIT 1000
```

## Resultados Medibles

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Tiempo ejecución** | 120 seg | 5 seg | **-95%** |
| **Datos escaneados** | 45 GB | 2.5 GB | **-94%** |
| **Costo por query** | $0.225 | $0.0125 | **-94%** |
| **Costo mensual** | $540 | $30 | **Ahorro $510/mes** |

## Lecciones Aprendidas

1. **Siempre especifica columnas**: `SELECT *` es tu enemigo en producción
2. **Respeta el particionamiento**: Usa `_PARTITIONDATE` en lugar de funciones sobre columnas
3. **LIMIT es tu amigo**: Rara vez necesitas millones de filas
4. **Mide todo**: Usa `EXPLAIN` de BigQuery para entender el plan de ejecución

## Bonus: Checklist de Optimización SQL

Antes de llevar una query a producción:

- ¿Seleccionas solo las columnas necesarias?
- ¿Aprovechas particionamiento/clustering?
- ¿Tienes un LIMIT razonable?
- ¿El ORDER BY es realmente necesario?
- ¿Los JOINs están optimizados?
- ¿Usaste EXPLAIN para ver el plan?

## Conclusión

Esta optimización no solo mejoró la performance 24x, sino que **generó ahorros de $6,000 USD anuales** en costos de BigQuery.

En datos, las optimizaciones no son opcionales: son un **imperativo de negocio**.

---

*¿Quieres aprender más sobre optimización SQL? Sígueme en [LinkedIn](https://www.linkedin.com/in/mariano-gobea-alcoba/) para más contenido técnico.*
