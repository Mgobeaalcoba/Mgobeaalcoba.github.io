---
title: "Data Quality con Great Expectations: No más data corrupta en producción"
date: "2026-06-07"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["data-quality", "testing", "great-expectations", "validation"]
excerpt: "Cómo implementar data quality checks que atrapan problemas antes de que lleguen a producción. Great Expectations en acción."
featured: false
lang: "es"
---

## El Problema: Bad Data in Production

**Pipeline corriendo "bien"** según logs, pero los datos son basura.

Ejemplos reales que viví:
- Fechas en formato incorrecto (2026-31-12)
- Montos negativos en ventas
- User IDs duplicados
- Nulls donde no deberían estar

**Costo:** Dashboards mostrando data incorrecta, decisiones de negocio basadas en basura.

## Enter: Great Expectations

Framework para **definir expectativas sobre tus datos** y validarlas automáticamente.

## Setup Rápido

```bash
pip install great-expectations

# Inicializar proyecto
great_expectations init
```

## Tu Primera Expectation

```python
import great_expectations as ge

# Cargar data
df = ge.read_csv('transactions.csv')

# Definir expectations
df.expect_column_values_to_not_be_null('transaction_id')
df.expect_column_values_to_be_unique('transaction_id')
df.expect_column_values_to_be_between('amount', min_value=0, max_value=1000000)
df.expect_column_values_to_be_in_set('currency', ['ARS', 'USD', 'BRL'])

# Validar
results = df.validate()

if not results['success']:
    raise ValueError("Data validation failed!")
```

## Expectation Suite Completo

```python
expectation_suite = {
    "expectation_suite_name": "transactions_suite",
    "expectations": [
        # Uniqueness
        {
            "expectation_type": "expect_column_values_to_be_unique",
            "kwargs": {"column": "transaction_id"}
        },
        # Not null
        {
            "expectation_type": "expect_column_values_to_not_be_null",
            "kwargs": {"column": "user_id"}
        },
        # Range validation
        {
            "expectation_type": "expect_column_values_to_be_between",
            "kwargs": {
                "column": "amount",
                "min_value": 0,
                "max_value": 10000000
            }
        },
        # Regex validation
        {
            "expectation_type": "expect_column_values_to_match_regex",
            "kwargs": {
                "column": "email",
                "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            }
        },
        # Date validation
        {
            "expectation_type": "expect_column_values_to_be_dateutil_parseable",
            "kwargs": {"column": "transaction_date"}
        }
    ]
}
```

## Integración con Pipeline

```python
import great_expectations as ge
from airflow import DAG
from airflow.operators.python import PythonOperator

def validate_and_load():
    # 1. Extraer
    df = extract_from_api()
    
    # 2. Validar con GE
    gdf = ge.from_pandas(df)
    results = gdf.validate(expectation_suite='transactions_suite')
    
    # 3. Si falla, NO cargar
    if not results['success']:
        send_alert(f"Data quality failed: {results}")
        raise ValueError("Validation failed")
    
    # 4. Si pasa, cargar
    load_to_bigquery(df)

dag = DAG('etl_with_validation')
validate_task = PythonOperator(task_id='validate', python_callable=validate_and_load)
```

## Data Docs: Documentación Auto-Generada

```bash
great_expectations docs build
```

Resultado: **Sitio web HTML** con:
- Todas tus expectations documentadas
- Resultados de validaciones
- Estadísticas de data quality

## Expectations Útiles

### Para Finanzas
```python
# Montos deben sumar
df.expect_column_sum_to_be_between('amount', min_value=0)

# Montos consistentes con moneda
df.expect_column_pair_values_to_be_equal('amount_ars', 'amount_usd * exchange_rate')
```

### Para User Data
```python
# Email único
df.expect_column_values_to_be_unique('email')

# País válido
df.expect_column_values_to_be_in_set('country', ['AR', 'BR', 'MX', 'CO'])

# Edad razonable
df.expect_column_values_to_be_between('age', 18, 100)
```

### Para Time Series
```python
# Sin gaps en fechas
df.expect_column_values_to_be_increasing('date')

# Todas las fechas en rango esperado
df.expect_column_values_to_be_between(
    'date',
    min_value='2026-01-01',
    max_value='2026-12-31'
)
```

## Alternativas

- **Pandera**: Schema validation simple
- **Pydantic**: Para structured data
- **Cerberus**: Validation framework
- **Great Expectations**: **Más completo, enterprise-ready**

## Caso Real: Ahorro de $50K

En un proyecto de consultoría, detectamos **datos corruptos antes de analytics**.

Sin GE: Data mala → Dashboard equivocado → Decisión de negocio errónea → $50K de pérdida.

Con GE: Data validada → Problema detectado → Corregido → Crisis evitada.

**ROI:** Infinito. Te salva de desastres.

## Conclusión

Si tu pipeline no valida data quality, **estás jugando a la ruleta rusa**.

Great Expectations es tu red de seguridad.

Implementalo hoy. Te vas a agradecer mañana.

---

*¿Problemas de data quality? [Puedo ayudarte](https://mgobeaalcoba.github.io/consulting.html)*
