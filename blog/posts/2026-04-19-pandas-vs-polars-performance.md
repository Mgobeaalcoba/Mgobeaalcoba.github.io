---
title: "Pandas vs Polars: Benchmark real con 100M filas"
date: "2026-04-19"
author: "Mariano Gobea Alcoba"
category: "python"
tags: ["pandas", "polars", "performance", "dataframes"]
excerpt: "¿Vale la pena migrar de Pandas a Polars? Test con datos reales de MercadoLibre. Spoiler: Polars es 10-20x más rápido."
featured: false
lang: "es"
---

## El Benchmark

Dataset: 100 millones de filas de transacciones de MercadoLibre.

Operaciones comunes:
- Filtrado
- Agregaciones
- Joins
- Group by

**Hardware:** MacBook Pro M2, 16GB RAM

## Test #1: Lectura de CSV

### Pandas
```python
import pandas as pd
import time

start = time.time()
df = pd.read_csv('transactions_100m.csv')
print(f"Pandas: {time.time() - start:.2f}s")
# Output: Pandas: 87.3s
```

### Polars
```python
import polars as pl

start = time.time()
df = pl.read_csv('transactions_100m.csv')
print(f"Polars: {time.time() - start:.2f}s")
# Output: Polars: 12.4s
```

**Ganador: Polars (7x más rápido)**

## Test #2: Filtrado

```python
# Pandas
filtered = df[df['amount'] > 1000]
# Tiempo: 2.3s

# Polars
filtered = df.filter(pl.col('amount') > 1000)
# Tiempo: 0.18s
```

**Ganador: Polars (12x más rápido)**

## Test #3: Group By + Aggregation

```python
# Pandas
result = df.groupby('country_code').agg({
    'amount': ['sum', 'mean', 'count']
})
# Tiempo: 8.7s

# Polars
result = df.groupby('country_code').agg([
    pl.col('amount').sum(),
    pl.col('amount').mean(),
    pl.col('amount').count()
])
# Tiempo: 0.6s
```

**Ganador: Polars (14x más rápido)**

## Test #4: Join de Dos Tablas

```python
# Pandas (100M filas + 10M filas)
merged = pd.merge(df1, df2, on='user_id', how='left')
# Tiempo: 45.2s
# Memoria: 8.5GB

# Polars
merged = df1.join(df2, on='user_id', how='left')
# Tiempo: 4.1s
# Memoria: 2.1GB
```

**Ganador: Polars (11x más rápido, 4x menos memoria)**

## Tabla Resumen

| Operación | Pandas | Polars | Speedup |
|-----------|--------|--------|---------|
| **Read CSV** | 87.3s | 12.4s | **7x** |
| **Filter** | 2.3s | 0.18s | **12x** |
| **GroupBy** | 8.7s | 0.6s | **14x** |
| **Join** | 45.2s | 4.1s | **11x** |
| **Uso Memoria** | 8.5GB | 2.1GB | **4x mejor** |

## Sintaxis Comparada

### Pandas
```python
result = (df
    .query('amount > 1000')
    .groupby('country')['amount']
    .sum()
    .reset_index()
)
```

### Polars
```python
result = (df
    .filter(pl.col('amount') > 1000)
    .groupby('country')
    .agg(pl.col('amount').sum())
)
```

Polars es más explícito, pero **más claro**.

## ¿Debería Migrar a Polars?

### SÍ, migrá si:
- ✅ Trabajás con >10M filas regularmente
- ✅ Performance es crítico
- ✅ Tus pipelines son lentos
- ✅ Te quedás sin memoria

### NO migres si:
- ❌ Dataset < 1M filas (diferencia mínima)
- ❌ Tu código depende de features específicas de Pandas
- ❌ Team no tiene tiempo de aprender nueva API

## Cómo Migrar Gradualmente

1. **Usa Polars para lectura**: `pl.read_csv()` → `to_pandas()`
2. **Procesa con Polars, exporta a Pandas** si otros sistemas lo requieren
3. **Migrá pipeline por pipeline**, no todo de golpe

## Conclusión

Polars es **objetivamente superior en performance**.

Para data engineering moderno, es el nuevo estándar.

Pandas sigue vivo para notebooks y análisis exploratorio, pero **para producción, Polars gana**.

---

*¿Optimizando pipelines? Mirá mi [post sobre Python Async](https://mgobeaalcoba.github.io/blog-post.html?slug=python-async-data-pipelines)*
