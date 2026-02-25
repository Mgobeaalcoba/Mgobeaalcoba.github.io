---
slug: airflow-vs-prefect-2026
date: 2026-01-11
---

Llevamos 3 años usando Apache Airflow como orquestador de pipelines en Mercado Libre. El año pasado migramos un subconjunto de pipelines a Prefect para comparar en condiciones reales. Acá el análisis honesto de qué usar y cuándo.

## El contexto

No existe el "mejor" orquestador en abstracto. Depende del equipo, la infraestructura, y el tipo de pipelines. Lo que sí existe son trade-offs claros.

## Apache Airflow

### Fortalezas

**Ecosistema maduro**: Airflow tiene providers para todo — BigQuery, Snowflake, dbt, Kubernetes, AWS, GCP. La mayoría de integraciones están resueltas out-of-the-box.

**Visibilidad**: La UI de Airflow muestra el DAG, el estado de cada task, los logs históricos, y permite re-runs de tasks individuales. Para debugging en producción, es invaluable.

**Escalabilidad probada**: Con CeleryExecutor o KubernetesExecutor, Airflow puede manejar miles de DAGs concurrentes. Empresas como Airbnb, Twitter, y Lyft lo usan a escala masiva.

### Debilidades

**Setup complejo**: Airflow requiere una base de datos (PostgreSQL recomendado), un executor (Celery o K8s), y configuración cuidadosa. Managed (Cloud Composer, MWAA) resuelve esto a costo elevado.

**DAGs como código Python con restricciones**: El código del DAG se parsea constantemente por el scheduler. Si hacés requests HTTP o lógica pesada al nivel del DAG (fuera de tasks), podés romper el scheduler.

**Backfill verboso**: Hacer backfill de un rango de fechas es soportado pero la UX no es intuitiva.

```python
# Airflow DAG típico
from airflow import DAG
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': True,
}

with DAG(
    'seller_metrics',
    default_args=default_args,
    schedule_interval='@daily',
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['analytics', 'sellers'],
) as dag:
    
    extract = BigQueryInsertJobOperator(
        task_id='extract_orders',
        configuration={
            'query': {
                'query': 'SELECT * FROM orders WHERE DATE(created_at) = "{{ ds }}"',
                'useLegacySql': False,
                'destinationTable': {
                    'projectId': 'my-project',
                    'datasetId': 'staging',
                    'tableId': 'orders_{{ ds_nodash }}',
                },
                'writeDisposition': 'WRITE_TRUNCATE',
            }
        }
    )
    
    transform = BigQueryInsertJobOperator(
        task_id='compute_metrics',
        configuration={...}
    )
    
    extract >> transform
```

## Prefect

### Fortalezas

**Developer experience**: La experiencia de escribir flows en Prefect es mucho más cercana a escribir Python normal. No hay restricciones de cómo estructurás el código.

```python
# El mismo pipeline en Prefect
from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=1))
def extract_orders(date: str) -> list[dict]:
    # Código Python normal, sin restricciones
    result = bigquery_client.query(f"""
        SELECT * FROM orders WHERE DATE(created_at) = '{date}'
    """).result()
    return [dict(row) for row in result]

@task(retries=3, retry_delay_seconds=60)
def compute_metrics(orders: list[dict]) -> dict:
    # Lógica Python pura
    return {
        'total_gmv': sum(o['gmv'] for o in orders),
        'order_count': len(orders),
    }

@flow(name="seller-metrics")
def seller_metrics_flow(date: str = None):
    if date is None:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    
    orders = extract_orders(date)
    metrics = compute_metrics(orders)
    return metrics
```

**Caching nativo**: El caching de tasks es un ciudadano de primera clase en Prefect. Evitar re-procesar datos ya procesados es trivial.

**Deployment moderno**: Prefect Cloud o Prefect Server gestionan el scheduling y observabilidad. El deployment a Kubernetes es más simple que en Airflow.

### Debilidades

**Ecosistema más pequeño**: Menos providers out-of-the-box. Integraciones complejas requieren más código custom.

**Observabilidad más limitada**: La UI de Prefect es más moderna pero tiene menos detalle histórico que Airflow para debugging profundo.

**Menor adopción enterprise**: Menos documentación de casos de uso a gran escala.

## Comparación directa

| Criterio | Airflow | Prefect |
|----------|---------|---------|
| Curva de aprendizaje | Alta | Media |
| Setup inicial | Complejo | Simple |
| Developer experience | Buena | Excelente |
| Ecosistema de providers | Muy amplio | Amplio |
| Observabilidad | Excelente | Buena |
| Escalabilidad probada | Sí | Sí |
| Costo managed | Alto ($$$) | Medio ($$) |
| Debugging en prod | Excelente | Bueno |

## Mi recomendación

**Usar Airflow si:**
- Tenés un equipo > 5 data engineers
- Necesitás integraciones enterprise (Snowflake, dbt Cloud, etc.)
- La observabilidad y debugging en producción es crítica
- Ya tenés Airflow y el equipo lo conoce

**Usar Prefect si:**
- Empezás un proyecto nuevo con equipo pequeño
- Querés iterar rápido en los pipelines
- El equipo viene de Python y quiere la experiencia más Pythónica
- Los pipelines son principalmente de Python/ML

**La respuesta honesta**: Para la mayoría de equipos de 3-10 data engineers, Prefect va a ser más productivo. Para equipos grandes con pipelines complejos y muchas integraciones, Airflow sigue siendo el estándar.

En nuestro caso, mantenemos Airflow para pipelines de producción críticos (los que mueven millones de dólares) y usamos Prefect para pipelines de analytics experimentales y ML.
