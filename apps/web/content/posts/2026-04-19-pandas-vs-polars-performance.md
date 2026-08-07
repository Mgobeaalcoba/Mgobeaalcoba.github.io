---
slug: pandas-vs-polars-performance
date: 2025-12-07
---

Polars promete ser 10-100x más rápido que Pandas. Hice benchmarks reales con datasets del tamaño que procesamos en producción. Los resultados son interesantes.

## Setup del benchmark

Dataset: 50 millones de filas, 12 columnas (similar a nuestra tabla de eventos).

```python
import pandas as pd
import polars as pl
import time

# Generamos datos de prueba
n_rows = 50_000_000
df_pandas = pd.DataFrame({
    "user_id": np.random.randint(1, 1_000_000, n_rows),
    "event_type": np.random.choice(["view", "click", "purchase"], n_rows),
    "gmv": np.random.exponential(500, n_rows),
    "created_at": pd.date_range("2025-01-01", periods=n_rows, freq="s"),
    "country": np.random.choice(["AR", "BR", "MX", "CO", "CL"], n_rows),
})

df_polars = pl.from_pandas(df_pandas)
```

## Benchmark 1: GroupBy + Aggregation

```python
# Pandas
start = time.time()
result_pandas = df_pandas.groupby(["country", "event_type"]).agg(
    total_gmv=("gmv", "sum"),
    count=("user_id", "count"),
    unique_users=("user_id", "nunique")
).reset_index()
pandas_time = time.time() - start

# Polars
start = time.time()
result_polars = df_polars.group_by(["country", "event_type"]).agg([
    pl.col("gmv").sum().alias("total_gmv"),
    pl.col("user_id").count().alias("count"),
    pl.col("user_id").n_unique().alias("unique_users"),
])
polars_time = time.time() - start

print(f"Pandas: {pandas_time:.2f}s")   # 18.4s
print(f"Polars: {polars_time:.2f}s")   # 1.8s
print(f"Speedup: {pandas_time/polars_time:.1f}x")  # 10.2x
```

## Benchmark 2: Filtros + Joins

```python
# Pandas
start = time.time()
filtered = df_pandas[
    (df_pandas["event_type"] == "purchase") &
    (df_pandas["gmv"] > 100) &
    (df_pandas["country"].isin(["AR", "BR"]))
]
merged = filtered.merge(sellers_pandas, on="user_id", how="left")
result = merged.groupby("country")["gmv"].mean()
pandas_time = time.time() - start

# Polars - lazy evaluation
start = time.time()
result = (
    df_polars.lazy()
    .filter(
        (pl.col("event_type") == "purchase") &
        (pl.col("gmv") > 100) &
        (pl.col("country").is_in(["AR", "BR"]))
    )
    .join(sellers_polars.lazy(), on="user_id", how="left")
    .group_by("country")
    .agg(pl.col("gmv").mean())
    .collect()
)
polars_time = time.time() - start

# Pandas: 24.1s | Polars: 2.3s | Speedup: 10.5x
```

## Uso de memoria

| Dataset | Pandas | Polars | Ahorro |
|---------|--------|--------|--------|
| 50M filas | 4.8 GB | 1.9 GB | 60% |
| 100M filas | 9.6 GB | 3.7 GB | 61% |

Polars usa memoria más eficientemente gracias a Arrow columnar format.

## Cuándo Pandas sigue siendo mejor

1. **Ecosistema**: scikit-learn, matplotlib, seaborn — todos hablan Pandas nativamente
2. **Operaciones string complejas**: Pandas tiene operaciones de string más ricas
3. **Datos pequeños** (< 1M filas): la diferencia no importa
4. **Interoperabilidad**: más fácil de integrar con código existente

## Cuándo usar Polars

1. Datasets > 5M filas donde la velocidad importa
2. Transformaciones que se pueden expresar con lazy evaluation
3. Proyectos nuevos donde podés elegir libremente
4. Cuando la memoria es un constraint

## Conclusión

Polars es genuinamente más rápido. El speedup de 10x en groupby/aggregation es real y reproducible. Si empezás un proyecto nuevo hoy y vas a procesar datos grandes, Polars es la elección correcta.

Para proyectos existentes: migrar no es trivial, la API es diferente. Solo vale la pena si tenés problemas reales de performance.
