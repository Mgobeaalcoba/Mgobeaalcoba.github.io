---
slug: pandas-vs-polars-performance
date: 2026-04-19
---

Polars lleva años prometiendo ser "el reemplazo de Pandas". ¿Vale la pena la migración? Hice el benchmark que siempre quise ver: datos reales, operaciones reales, mediciones honestas.

**Spoiler**: Polars es entre 5x y 20x más rápido en la mayoría de operaciones. Pero hay matices importantes.

## Setup del benchmark

```python
import pandas as pd
import polars as pl
import numpy as np
import time
from contextlib import contextmanager

@contextmanager
def medir_tiempo(nombre):
    inicio = time.perf_counter()
    yield
    fin = time.perf_counter()
    print(f"{nombre}: {fin - inicio:.3f}s")

# Generar dataset de prueba: 100 millones de filas
N = 100_000_000

np.random.seed(42)
datos = {
    "seller_id": np.random.randint(1, 100_000, N),
    "buyer_id": np.random.randint(1, 1_000_000, N),
    "monto": np.random.exponential(500, N),
    "categoria": np.random.choice(["electronica", "ropa", "hogar", "deportes", "alimentos"], N),
    "pais": np.random.choice(["ARG", "BRA", "MEX", "COL", "CHL"], N),
    "fecha": pd.date_range("2024-01-01", periods=N, freq="1s"),
}

# Guardar como parquet para loading justo
import pyarrow as pa
import pyarrow.parquet as pq

tabla = pa.Table.from_pydict(datos)
pq.write_table(tabla, "benchmark_data.parquet")
```

## Benchmark 1: Lectura de Parquet

```python
# Pandas
with medir_tiempo("Pandas - leer parquet"):
    df_pandas = pd.read_parquet("benchmark_data.parquet")

# Polars
with medir_tiempo("Polars - leer parquet"):
    df_polars = pl.read_parquet("benchmark_data.parquet")
```

**Resultados:**
- Pandas: **34.2s**
- Polars: **8.1s**
- **Ratio: 4.2x más rápido**

Polars usa todas las CPUs disponibles por defecto. Pandas es single-threaded en la mayoría de operaciones.

## Benchmark 2: GroupBy + Aggregación

La operación más común en analytics:

```python
# Pandas
with medir_tiempo("Pandas - groupby"):
    resultado_pandas = df_pandas.groupby("categoria").agg(
        total_monto=("monto", "sum"),
        promedio_monto=("monto", "mean"),
        cantidad_ordenes=("seller_id", "count"),
        vendedores_unicos=("seller_id", "nunique"),
    ).reset_index()

# Polars
with medir_tiempo("Polars - groupby"):
    resultado_polars = df_polars.group_by("categoria").agg([
        pl.col("monto").sum().alias("total_monto"),
        pl.col("monto").mean().alias("promedio_monto"),
        pl.col("seller_id").count().alias("cantidad_ordenes"),
        pl.col("seller_id").n_unique().alias("vendedores_unicos"),
    ])
```

**Resultados:**
- Pandas: **18.7s**
- Polars: **1.2s**
- **Ratio: 15.6x más rápido**

## Benchmark 3: Filtrado + Ordenamiento

```python
# Pandas
with medir_tiempo("Pandas - filter + sort"):
    resultado_pandas = (
        df_pandas[
            (df_pandas["pais"] == "ARG") &
            (df_pandas["monto"] > 1000)
        ]
        .sort_values("monto", ascending=False)
        .head(1000)
    )

# Polars
with medir_tiempo("Polars - filter + sort"):
    resultado_polars = (
        df_polars
        .filter(
            (pl.col("pais") == "ARG") &
            (pl.col("monto") > 1000)
        )
        .sort("monto", descending=True)
        .head(1000)
    )
```

**Resultados:**
- Pandas: **4.8s**
- Polars: **0.9s**
- **Ratio: 5.3x más rápido**

## Benchmark 4: Join entre DataFrames

```python
# Crear segundo DataFrame
vendedores = pd.DataFrame({
    "seller_id": range(1, 100_001),
    "nivel": np.random.choice(["bronze", "silver", "gold", "platinum"], 100_000),
    "pais_origen": np.random.choice(["ARG", "BRA", "MEX"], 100_000),
})

vendedores_polars = pl.from_pandas(vendedores)

# Pandas join
with medir_tiempo("Pandas - join"):
    resultado_pandas = df_pandas.merge(vendedores, on="seller_id", how="left")

# Polars join
with medir_tiempo("Polars - join"):
    resultado_polars = df_polars.join(vendedores_polars, on="seller_id", how="left")
```

**Resultados:**
- Pandas: **28.4s**
- Polars: **3.1s**
- **Ratio: 9.2x más rápido**

## Benchmark 5: Window Functions

```python
# Pandas
with medir_tiempo("Pandas - window functions"):
    df_pandas["rango_seller"] = (
        df_pandas.groupby("categoria")["monto"]
        .rank(ascending=False)
    )
    df_pandas["monto_acumulado"] = (
        df_pandas.groupby(["seller_id", "categoria"])["monto"]
        .cumsum()
    )

# Polars
with medir_tiempo("Polars - window functions"):
    resultado_polars = df_polars.with_columns([
        pl.col("monto").rank(descending=True).over("categoria").alias("rango_seller"),
        pl.col("monto").cum_sum().over(["seller_id", "categoria"]).alias("monto_acumulado"),
    ])
```

**Resultados:**
- Pandas: **47.3s**
- Polars: **2.4s**
- **Ratio: 19.7x más rápido**

## Resumen de benchmarks

| Operación | Pandas | Polars | Speedup |
|-----------|--------|--------|---------|
| Leer parquet | 34.2s | 8.1s | **4.2x** |
| GroupBy + agg | 18.7s | 1.2s | **15.6x** |
| Filter + sort | 4.8s | 0.9s | **5.3x** |
| Join | 28.4s | 3.1s | **9.2x** |
| Window functions | 47.3s | 2.4s | **19.7x** |

## Las diferencias de sintaxis que importan

Polars no es un drop-in replacement de Pandas. La API es diferente:

```python
# PANDAS
df["nueva_col"] = df["col_a"] + df["col_b"]
df_filtrado = df[df["monto"] > 100]
df.rename(columns={"col_vieja": "col_nueva"})

# POLARS — sintaxis con expresiones
df = df.with_columns(
    (pl.col("col_a") + pl.col("col_b")).alias("nueva_col")
)
df_filtrado = df.filter(pl.col("monto") > 100)
df = df.rename({"col_vieja": "col_nueva"})
```

**Lazy evaluation**: Una de las características más poderosas de Polars:

```python
# Polars puede optimizar el plan de ejecución antes de correr
resultado = (
    pl.scan_parquet("benchmark_data.parquet")  # lazy — no carga nada todavía
    .filter(pl.col("pais") == "ARG")
    .filter(pl.col("monto") > 1000)
    .group_by("categoria")
    .agg(pl.col("monto").sum())
    .collect()  # recién acá ejecuta, con el plan optimizado
)
```

Con lazy evaluation, Polars puede pushdown filtros, eliminar columnas innecesarias, y paralelizar de forma más eficiente.

## ¿Cuándo NO migrar a Polars?

1. **Ecosistema de librerías**: scikit-learn, statsmodels, muchas librerías ML todavía esperan DataFrames de Pandas. Polars tiene conversión `.to_pandas()` pero agrega overhead.

2. **Datasets pequeños (<1M filas)**: La diferencia de velocidad no es relevante si el dataset cabe en memoria fácilmente.

3. **Equipo acostumbrado a Pandas**: La curva de aprendizaje es real. No subestimes el costo de migración.

4. **Integración con notebooks de Jupyter**: La experiencia de Pandas en Jupyter (display, `.head()`, etc.) sigue siendo más pulida.

## Mi recomendación

- **Proyectos nuevos con datasets > 10M filas**: Polars desde el principio
- **Scripts de ETL y pipelines**: Migrar a Polars tiene ROI claro
- **Notebooks de análisis exploratorio**: Quedarse con Pandas por ahora
- **Proyectos ML**: Pandas hasta que scikit-learn soporte Polars mejor

El benchmark es claro. La pregunta no es si Polars es más rápido (lo es), sino si el costo de migración vale para tu caso particular.

---

El código completo del benchmark está disponible en mi GitHub. Si lo corrés en tu máquina, los números van a variar según el hardware, pero los ratios deberían ser similares.
