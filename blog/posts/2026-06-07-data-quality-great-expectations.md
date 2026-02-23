---
slug: data-quality-great-expectations
date: 2026-06-07
---

"Los datos están mal" es la frase que más miedo genera en un equipo de analytics. Después de un incidente donde un error en los datos llegó hasta un reporte ejecutivo, implementamos Great Expectations. Acá te cuento cómo y por qué.

## El problema que Great Expectations resuelve

Los pipelines de datos tienen un supuesto implícito peligroso: que los datos de entrada son los que esperamos. La realidad es que los datos cambian:

- Una columna que siempre tenía valores entre 0 y 100 empieza a tener -1
- Un campo de texto que era email empieza a recibir teléfonos
- Una tabla que siempre tenía 50K filas llega con 500 (o con 500K)
- Un join que siempre matcheaba el 99% de registros empieza a perder el 30%

Sin validación, estos problemas llegan silenciosamente a producción.

## ¿Qué es Great Expectations?

Great Expectations (GX) es una librería Python para definir, documentar y validar expectativas sobre tus datos. Las "expectations" son assertions sobre la forma y contenido de los datos:

- "La columna `email` no puede tener nulos"
- "El `precio` debe estar entre 0 y 1,000,000"
- "Los valores de `estado` deben ser uno de: pendiente, procesado, cancelado"
- "La tabla debe tener entre 40,000 y 60,000 filas"

Si alguna expectativa falla, obtenés un reporte detallado de qué salió mal.

## Setup básico

```bash
pip install great-expectations
gx init
```

Esto crea el directorio `gx/` con la configuración del proyecto.

## Tu primera suite de expectativas

```python
import great_expectations as gx
import pandas as pd

# Cargar datos
df = pd.read_parquet("pedidos_hoy.parquet")

# Crear contexto de GX
context = gx.get_context()

# Crear un "batch" de datos para validar
data_source = context.sources.add_pandas("pedidos_datasource")
data_asset = data_source.add_dataframe_asset("pedidos_asset")
batch_request = data_asset.build_batch_request(dataframe=df)

# Crear suite de expectativas
suite = context.add_expectation_suite("pedidos_suite")

# Agregar las expectations
validator = context.get_validator(
    batch_request=batch_request,
    expectation_suite_name="pedidos_suite",
)

# === Expectations de estructura ===
validator.expect_table_row_count_to_be_between(min_value=10_000, max_value=500_000)
validator.expect_table_columns_to_match_ordered_list([
    "pedido_id", "seller_id", "buyer_id", "monto", "estado", "fecha_creacion"
])

# === Expectations de columnas ===
# Columnas que no pueden ser nulas
for columna in ["pedido_id", "seller_id", "buyer_id", "monto"]:
    validator.expect_column_values_to_not_be_null(column=columna)

# Tipos de datos
validator.expect_column_values_to_be_in_type_list("monto", ["float64", "float32", "int64"])
validator.expect_column_values_to_be_in_type_list("pedido_id", ["int64", "int32"])

# Rangos de valores
validator.expect_column_values_to_be_between(
    column="monto",
    min_value=0,
    max_value=10_000_000,
    mostly=0.999  # 99.9% de los valores deben cumplir
)

validator.expect_column_values_to_be_between(
    column="seller_id",
    min_value=1,
    strict_min=True,
)

# Valores permitidos
validator.expect_column_values_to_be_in_set(
    column="estado",
    value_set=["pendiente", "procesado", "enviado", "entregado", "cancelado", "devuelto"],
)

# Unicidad
validator.expect_column_values_to_be_unique(column="pedido_id")

# Formato de fechas
validator.expect_column_values_to_match_strftime_format(
    column="fecha_creacion",
    strftime_format="%Y-%m-%dT%H:%M:%S",
    mostly=0.99
)

# Guardar la suite
validator.save_expectation_suite()
```

## Ejecutar las validaciones

```python
from great_expectations.checkpoint import SimpleCheckpoint

# Crear checkpoint
checkpoint_config = {
    "name": "pedidos_checkpoint",
    "config_version": 1,
    "class_name": "SimpleCheckpoint",
    "expectation_suite_name": "pedidos_suite",
}

context.add_checkpoint(**checkpoint_config)

# Ejecutar
results = context.run_checkpoint(
    checkpoint_name="pedidos_checkpoint",
    validations=[{"batch_request": batch_request}],
)

if results.success:
    print("✅ Todas las validaciones pasaron!")
else:
    print(f"❌ {results['statistics']['unsuccessful_expectations']} expectativas fallaron")
    
    # Ver el detalle
    for result in results.list_validation_results():
        for expectation in result.results:
            if not expectation.success:
                print(f"  FALLA: {expectation.expectation_config.expectation_type}")
                print(f"  Columna: {expectation.expectation_config.kwargs.get('column', 'N/A')}")
                print(f"  Detalle: {expectation.result}")
```

## Integración con Airflow

```python
from airflow.decorators import task, dag
from airflow.utils.dates import days_ago
import great_expectations as gx

@dag(schedule_interval="@daily", start_date=days_ago(1))
def pipeline_pedidos():
    
    @task
    def extraer_pedidos():
        import pandas as pd
        # Tu lógica de extracción
        return pd.read_sql("SELECT * FROM pedidos WHERE DATE(fecha) = CURRENT_DATE", conn)
    
    @task
    def validar_pedidos(df):
        context = gx.get_context(context_root_dir="/opt/airflow/gx")
        
        # Configurar el batch con el DataFrame de Airflow
        data_source = context.sources.add_or_update_pandas("pedidos")
        data_asset = data_source.add_or_update_dataframe_asset("daily")
        batch_request = data_asset.build_batch_request(dataframe=df)
        
        results = context.run_checkpoint(
            checkpoint_name="pedidos_checkpoint",
            validations=[{"batch_request": batch_request}],
        )
        
        if not results.success:
            raise ValueError(
                f"Validación de datos fallida: "
                f"{results['statistics']['unsuccessful_expectations']} expectativas no cumplidas. "
                "Pipeline detenido para evitar propagación de datos incorrectos."
            )
        
        return df
    
    @task
    def transformar_y_cargar(df):
        # Solo llegamos acá si los datos pasaron validación
        pass
    
    datos_raw = extraer_pedidos()
    datos_validados = validar_pedidos(datos_raw)
    transformar_y_cargar(datos_validados)

dag_pedidos = pipeline_pedidos()
```

## Profiling: dejar que GX aprenda tus datos

En vez de definir todas las expectations manualmente, podés dejar que GX las genere automáticamente desde datos históricos:

```python
# Cargar datos históricos "buenos" (último mes)
df_historico = pd.read_parquet("pedidos_historico.parquet")

# GX analiza los datos y propone expectations
validator = context.get_validator(
    batch_request=batch_request_historico,
    expectation_suite_name="pedidos_auto_suite",
)

# Generar expectations automáticas
validator.expect_table_row_count_to_be_between(
    min_value=int(len(df_historico) * 0.8),
    max_value=int(len(df_historico) * 1.2),
)

# Usar el profiler para expectativas estadísticas
from great_expectations.profile.user_configurable_profiler import UserConfigurableProfiler

profiler = UserConfigurableProfiler(profile_dataset=validator)
suite, validation_result = profiler.build_suite()

# Revisar manualmente las expectations generadas
for expectation in suite.expectations:
    print(expectation)
```

## Documentación automática: Data Docs

GX genera documentación HTML desde las expectativas y los resultados de validación:

```python
# Generar documentación
context.build_data_docs()

# Abrir en el browser (solo en desarrollo)
context.open_data_docs()
```

Los Data Docs muestran:
- Qué expectativas están definidas para cada dataset
- Los resultados de las últimas validaciones (qué pasó, qué falló)
- Estadísticas de los datos validados

Esto actúa como **contrato de datos** — cualquier stakeholder puede ver qué garantías tienen los datos.

## Estrategia para implementarlo en un equipo

1. **Empezar con las tablas más críticas**: No arrancar con las 200 tablas. Las 5 que alimentan los dashboards más importantes.

2. **Definir expectations conservadoras primero**: Mejor pocas expectations que siempre pasan que muchas que se violan constantemente y nadie las atiende.

3. **Modo "warning" antes de "error"**: Al principio, configurá las validaciones para que solo logueen warnings sin detener el pipeline. Cuando tenés confianza en las expectations, las convertís en errores que detienen el pipeline.

4. **Data Docs como comunicación**: Compartí el link de Data Docs con el equipo de negocio. "Estos son los checks que hacemos sobre los datos que usás" es una conversación valiosa.

---

Great Expectations no previene todos los problemas de data quality, pero sí los detecta antes de que lleguen a producción. Después de implementarlo, pasamos de "¿cuándo se rompió esto?" a "el pipeline de ayer detectó 5,000 registros con `estado` inválido antes de cargarlos al warehouse". Esa diferencia vale todo el tiempo de setup.
