---
slug: errores-comunes-data-pipelines
date: 2026-02-15
---

Después de revisar cientos de pipelines de datos en producción, los mismos errores aparecen una y otra vez. No son errores de código — son errores de diseño que se vuelven críticos a escala. Acá los 7 más frecuentes y cómo evitarlos.

## 1. No manejar idempotencia

El error más común y más costoso. Un pipeline idempotente puede ejecutarse múltiples veces con el mismo resultado. Sin idempotencia, un retry por falla de red duplica datos.

**Mal:**
```python
def load_orders(orders: list[dict]):
    conn.execute("INSERT INTO orders VALUES (%s)", orders)
```

**Bien:**
```python
def load_orders(orders: list[dict]):
    conn.execute("""
        INSERT INTO orders VALUES (%s)
        ON CONFLICT (order_id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
    """, orders)
```

En BigQuery, usar `MERGE` en lugar de `INSERT`. En Spark, usar `DataFrame.write.mode("overwrite")` sobre particiones específicas.

## 2. Procesar todo en memoria

```python
# Pipeline que falla con 10M de registros
def process_all():
    df = pd.read_sql("SELECT * FROM events", conn)  # OOM en prod
    return df.groupby('user_id')['revenue'].sum()
```

**Fix**: Chunking con generators:

```python
def process_chunked(chunk_size: int = 100_000):
    query = "SELECT * FROM events"
    
    for chunk in pd.read_sql(query, conn, chunksize=chunk_size):
        yield chunk.groupby('user_id')['revenue'].sum()

result = pd.concat(process_chunked()).groupby(level=0).sum()
```

## 3. Ignorar la zona horaria

El bug más silencioso de todos. Los datos llegan en UTC, se procesan en Buenos Aires (UTC-3), y los reportes de "ventas del día" son incorrectos para el horario nocturno.

```python
from datetime import datetime, timezone
import pytz

# Mal - datetime sin timezone
created_at = datetime.now()

# Bien - siempre UTC internamente
created_at = datetime.now(timezone.utc)

# Para mostrar al usuario final
bsas_tz = pytz.timezone('America/Argentina/Buenos_Aires')
created_at_local = created_at.astimezone(bsas_tz)
```

**Regla de oro**: Almacenar siempre en UTC. Convertir solo en la capa de presentación.

## 4. No versionar los schemas

Los schemas de datos cambian. Sin versionado, un campo nuevo en la fuente puede romper todos los consumidores del pipeline.

```python
# Usando Pydantic para schema validation
from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class OrderEvent(BaseModel):
    order_id: str
    seller_id: int
    buyer_id: int
    gmv: float
    currency: str = "ARS"
    created_at: datetime
    # Campo nuevo - Optional con default para backward compatibility
    payment_method: Optional[str] = None
    
    @validator('gmv')
    def gmv_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('GMV cannot be negative')
        return v

# Si el campo es requerido, incrementar versión major del schema
```

## 5. Logs insuficientes para debugging

Cuando un pipeline falla en producción a las 3am, los logs son lo único que tenés.

```python
import logging
import time
from functools import wraps

logger = logging.getLogger(__name__)

def log_execution(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        logger.info(f"Starting {func.__name__}", extra={
            'function': func.__name__,
            'args_count': len(args),
        })
        try:
            result = func(*args, **kwargs)
            elapsed = time.time() - start
            logger.info(f"Completed {func.__name__}", extra={
                'function': func.__name__,
                'elapsed_seconds': round(elapsed, 2),
                'records_processed': len(result) if hasattr(result, '__len__') else 'N/A',
            })
            return result
        except Exception as e:
            logger.error(f"Failed {func.__name__}: {e}", extra={
                'function': func.__name__,
                'error_type': type(e).__name__,
            }, exc_info=True)
            raise
    return wrapper
```

## 6. Sin circuit breakers para APIs externas

Un pipeline que llama a una API externa sin retry logic con backoff puede generar cascadas de fallas.

```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_robust_session() -> requests.Session:
    session = requests.Session()
    
    retry_strategy = Retry(
        total=3,
        backoff_factor=2,  # 2s, 4s, 8s entre intentos
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"],
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    
    return session
```

## 7. Mezclar transformación con carga

El patrón ELT (Extract, Load, Transform) en BigQuery es más robusto que ETL (Extract, Transform, Load) porque:
- Los datos crudos siempre están disponibles para re-procesar
- Las transformaciones se pueden cambiar sin re-extraer
- El debugging es más simple

```python
# Mal: ETL clásico
def etl_pipeline():
    raw = extract_from_source()
    transformed = complex_transform(raw)  # Si falla, perdiste los datos raw
    load_to_warehouse(transformed)

# Bien: ELT
def elt_pipeline():
    raw = extract_from_source()
    load_raw(raw)                          # Primero cargar datos crudos
    run_dbt_transformations()              # Transformar con dbt/SQL
```

---

Estos 7 errores no son teoría — los vi en código de producción de equipos con años de experiencia. La diferencia entre un pipeline amateur y uno profesional está en estos detalles.
