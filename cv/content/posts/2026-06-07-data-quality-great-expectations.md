---
slug: data-quality-great-expectations
date: 2025-10-19
---

La calidad de datos es el problema silencioso que destruye la confianza en los sistemas de analytics. Un pipeline puede correr perfectamente mientras que los datos que produce están incorrectos. Great Expectations (GX) es el framework que usamos para automatizar las validaciones.

## El problema

Sin validación de datos:

```python
# Este pipeline "funciona" pero el resultado puede ser incorrecto
def compute_conversion_rate(df):
    return df[df['event'] == 'purchase'].count() / df.count()

# ¿Qué pasa si:
# - Hay filas duplicadas?
# - El campo 'event' tiene valores nulos?
# - Los timestamps son del futuro (bug en el source)?
# - El rate calculado es 150% (matemáticamente imposible)?
```

Los dashboards muestran números incorrectos. El equipo de negocio toma decisiones basadas en datos rotos. Nadie lo sabe hasta que es demasiado tarde.

## Great Expectations: conceptos

**Expectation**: Una aserción sobre los datos. "La columna `user_id` no debe tener nulos."

**Expectation Suite**: Conjunto de expectations que definen la calidad esperada de un dataset.

**Checkpoint**: Valida un dataset contra un Expectation Suite y genera un reporte.

## Setup básico

```bash
pip install great-expectations
gx init  # Crea el directorio gx/ con la configuración
```

## Crear Expectations

```python
import great_expectations as gx

context = gx.get_context()

# Definir una fuente de datos
datasource = context.sources.add_pandas("my_datasource")
data_asset = datasource.add_dataframe_asset("orders")

batch_request = data_asset.build_batch_request(dataframe=df_orders)
validator = context.get_validator(batch_request=batch_request)

# Expectations sobre columnas críticas
validator.expect_column_to_exist("order_id")
validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_unique("order_id")

validator.expect_column_to_exist("gmv")
validator.expect_column_values_to_not_be_null("gmv")
validator.expect_column_values_to_be_between("gmv", min_value=0, max_value=1_000_000)

validator.expect_column_values_to_be_in_set(
    "status",
    ["pending", "completed", "cancelled", "refunded"]
)

validator.expect_column_values_to_match_regex(
    "seller_id",
    regex=r"^\d{6,12}$"  # IDs numéricos de 6-12 dígitos
)

# Expectations estadísticas
validator.expect_column_mean_to_be_between("gmv", min_value=50, max_value=5000)
validator.expect_column_proportion_of_unique_values_to_be_between(
    "buyer_id", min_value=0.3, max_value=1.0
)

# Guardar el Expectation Suite
validator.save_expectation_suite(discard_failed_expectations=False)
```

## Integrar en el pipeline

```python
import great_expectations as gx
from great_expectations.core.batch import RuntimeBatchRequest

def validate_and_load(df: pd.DataFrame, suite_name: str) -> bool:
    """Valida el dataframe antes de cargarlo. Devuelve False si falla la validación."""
    
    context = gx.get_context()
    
    checkpoint = context.add_or_update_checkpoint(
        name=f"{suite_name}_checkpoint",
        validations=[{
            "batch_request": {
                "datasource_name": "my_datasource",
                "data_asset_name": "orders",
                "runtime_parameters": {"batch_data": df},
                "batch_identifiers": {"default_identifier_name": "default_identifier"},
            },
            "expectation_suite_name": suite_name,
        }],
    )
    
    result = checkpoint.run()
    
    if not result.success:
        # Loggear qué falló
        for validation_result in result.run_results.values():
            for exp_result in validation_result["validation_result"]["results"]:
                if not exp_result["success"]:
                    logger.error(f"Data quality failure: {exp_result['expectation_config']}")
        
        return False
    
    return True

def etl_pipeline(date: str):
    df = extract_orders(date)
    
    if not validate_and_load(df, "orders_suite"):
        raise DataQualityException(f"Data quality check failed for {date}")
    
    transformed = transform(df)
    load(transformed)
```

## Expectations personalizadas

```python
from great_expectations.expectations.expectation import ColumnExpectation
from great_expectations.execution_engine import PandasExecutionEngine

class ExpectColumnValuesToBeValidArgentinaDate(ColumnExpectation):
    """Verifica que las fechas sean válidas para el contexto argentino."""
    
    metric_dependencies = ("column.values.to_be_valid_ar_date",)
    success_keys = ("min_date", "max_date")
    
    @classmethod
    def _validate(cls, configuration, metrics, *args, **kwargs):
        column_value_counts = metrics.get("column.value_counts.without_modifying_index")
        min_date = configuration.kwargs.get("min_date", "2020-01-01")
        max_date = configuration.kwargs.get("max_date")
        
        # Tu lógica de validación acá
        ...
```

## Reporting automático

Great Expectations genera reportes HTML automáticamente:

```python
context.build_data_docs()
context.open_data_docs()  # Abre en el navegador
```

Los reportes muestran qué expectativas pasaron, cuáles fallaron, ejemplos de valores que no cumplen, y estadísticas del dataset.

## El impacto real

Después de implementar GX en nuestros pipelines principales:
- **0 incidentes de datos incorrectos** en producción en 8 meses
- **Detección temprana**: los problemas se detectan en el pipeline, no cuando el equipo de negocio reporta números raros
- **Documentación viva**: las expectations documentan qué propiedades se garantizan del dataset
