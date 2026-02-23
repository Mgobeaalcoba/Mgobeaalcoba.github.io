---
slug: python-async-data-pipelines
date: 2026-03-22
---

Tenía un pipeline que tardaba 2 horas en correr. Consumía datos de 50 APIs diferentes, una a la vez. Después de refactorizarlo con `asyncio`, tardó **15 minutos**. El cambio fue mayormente en cómo hacía los requests HTTP.

Este artículo es la guía práctica que me hubiera gustado tener cuando empecé con Python async.

## Por qué async acelera pipelines de datos

La mayoría del tiempo que un pipeline de datos espera es **I/O**: esperando respuestas de APIs, queries a bases de datos, lectura de archivos. Durante ese tiempo, el CPU está idle.

**Sincrónico (una cosa a la vez):**
```
API 1: [====espera====][procesa]
API 2:                 [====espera====][procesa]
API 3:                               [====espera====][procesa]
Tiempo total: 3 × (espera + proceso)
```

**Asincrónico (muchas cosas en paralelo):**
```
API 1: [====espera====][procesa]
API 2: [====espera====][procesa]
API 3: [====espera====][procesa]
Tiempo total: 1 × (espera + proceso)
```

La diferencia es dramática cuando hacés muchas llamadas I/O-bound.

## Conceptos básicos que necesitás entender

### `async def` y `await`

```python
import asyncio

# Función síncrona normal
def fetch_sync(url: str) -> str:
    import requests
    return requests.get(url).text

# Su versión asíncrona
async def fetch_async(url: str) -> str:
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

# Para correr una función async
asyncio.run(fetch_async("https://api.ejemplo.com/datos"))
```

### `asyncio.gather()` — el corazón del speedup

```python
async def main():
    # Estas dos llamadas corren EN PARALELO
    resultado1, resultado2 = await asyncio.gather(
        fetch_async("https://api.ejemplo.com/vendedores"),
        fetch_async("https://api.ejemplo.com/productos"),
    )
    print(resultado1, resultado2)

asyncio.run(main())
```

## El caso real: pipeline con 50 APIs

**Versión sincrónica (2 horas):**

```python
import requests
import time

ENDPOINTS = [f"https://api.mercado.com/seller/{i}/metrics" for i in range(1, 51)]

def fetch_seller_metrics_sync(endpoint: str) -> dict:
    response = requests.get(endpoint, timeout=30)
    response.raise_for_status()
    return response.json()

def pipeline_sync():
    inicio = time.time()
    resultados = []
    
    for endpoint in ENDPOINTS:
        data = fetch_seller_metrics_sync(endpoint)
        resultados.append(data)
    
    print(f"Tiempo: {time.time() - inicio:.1f}s")
    return resultados
```

Si cada API tarda 2 minutos, 50 APIs = 100 minutos. Así de simple.

**Versión asíncrona (15 minutos):**

```python
import aiohttp
import asyncio
import time

ENDPOINTS = [f"https://api.mercado.com/seller/{i}/metrics" for i in range(1, 51)]

async def fetch_seller_metrics(session: aiohttp.ClientSession, endpoint: str) -> dict:
    async with session.get(endpoint, timeout=aiohttp.ClientTimeout(total=30)) as response:
        response.raise_for_status()
        return await response.json()

async def pipeline_async():
    inicio = time.time()
    
    async with aiohttp.ClientSession() as session:
        tareas = [
            fetch_seller_metrics(session, endpoint)
            for endpoint in ENDPOINTS
        ]
        resultados = await asyncio.gather(*tareas, return_exceptions=True)
    
    # Separar éxitos de errores
    exitosos = [r for r in resultados if not isinstance(r, Exception)]
    errores = [r for r in resultados if isinstance(r, Exception)]
    
    print(f"Tiempo: {time.time() - inicio:.1f}s")
    print(f"Exitosos: {len(exitosos)}, Errores: {len(errores)}")
    return exitosos

asyncio.run(pipeline_async())
```

Las 50 requests ahora corren (casi) en paralelo. El tiempo total es el de la request más lenta, no la suma de todas.

## Rate limiting: no bombardees las APIs

El problema de hacer todo en paralelo es que podés exceder los rate limits de la API y recibir 429 Too Many Requests.

**Control de concurrencia con Semaphore:**

```python
async def fetch_con_rate_limit(
    session: aiohttp.ClientSession,
    endpoint: str,
    semaphore: asyncio.Semaphore,
) -> dict:
    async with semaphore:  # Solo X requests concurrentes a la vez
        async with session.get(endpoint) as response:
            response.raise_for_status()
            return await response.json()

async def pipeline_con_rate_limit():
    MAX_CONCURRENT = 10  # No más de 10 requests simultáneas
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    async with aiohttp.ClientSession() as session:
        tareas = [
            fetch_con_rate_limit(session, endpoint, semaphore)
            for endpoint in ENDPOINTS
        ]
        return await asyncio.gather(*tareas, return_exceptions=True)
```

## Retry asíncrono con backoff exponencial

```python
import asyncio
import aiohttp
from tenacity import retry, stop_after_attempt, wait_exponential, RetryError

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30)
)
async def fetch_con_retry(session: aiohttp.ClientSession, endpoint: str) -> dict:
    async with session.get(endpoint, timeout=aiohttp.ClientTimeout(total=15)) as response:
        if response.status == 429:
            # Rate limit: esperar el Retry-After header si está disponible
            retry_after = int(response.headers.get('Retry-After', 5))
            await asyncio.sleep(retry_after)
            raise aiohttp.ClientResponseError(
                response.request_info, response.history, status=429
            )
        response.raise_for_status()
        return await response.json()
```

## Procesamiento por batches

Si tenés 10,000 endpoints, no querés lanzar 10,000 coroutines simultáneas. Procesá en batches:

```python
async def procesar_en_batches(endpoints: list[str], batch_size: int = 100) -> list[dict]:
    todos_resultados = []
    
    for i in range(0, len(endpoints), batch_size):
        batch = endpoints[i:i + batch_size]
        print(f"Procesando batch {i//batch_size + 1}/{len(endpoints)//batch_size + 1}")
        
        async with aiohttp.ClientSession() as session:
            tareas = [fetch_con_retry(session, url) for url in batch]
            resultados_batch = await asyncio.gather(*tareas, return_exceptions=True)
        
        exitosos = [r for r in resultados_batch if not isinstance(r, Exception)]
        todos_resultados.extend(exitosos)
        
        # Pequeña pausa entre batches para ser amables con la API
        await asyncio.sleep(1)
    
    return todos_resultados
```

## Async con bases de datos: asyncpg y aiomysql

El async no es solo para HTTP. Las bases de datos también se benefician:

```python
import asyncpg
import asyncio

async def fetch_desde_postgres():
    # asyncpg es mucho más rápido que psycopg2 para queries concurrentes
    conn = await asyncpg.connect(
        host='localhost',
        database='mydb',
        user='user',
        password='pass'
    )
    
    try:
        # Queries en paralelo
        vendedores, productos = await asyncio.gather(
            conn.fetch("SELECT * FROM sellers WHERE active = true"),
            conn.fetch("SELECT * FROM products WHERE stock > 0"),
        )
        return vendedores, productos
    finally:
        await conn.close()

# Connection pool para múltiples queries simultáneas
async def fetch_con_pool():
    pool = await asyncpg.create_pool(
        host='localhost', database='mydb', user='user', password='pass',
        min_size=5, max_size=20
    )
    
    async with pool.acquire() as conn:
        result = await conn.fetch("SELECT * FROM sellers")
    
    await pool.close()
    return result
```

## Integración con Airflow y Prefect

Si usás un orquestador, podés usar async dentro de tus tasks:

**Con Airflow:**
```python
from airflow.decorators import task
import asyncio

@task
def fetch_all_apis():
    # Los tasks de Airflow son síncronos, pero podés correr async adentro
    async def _async_main():
        return await pipeline_async()
    
    return asyncio.run(_async_main())
```

**Con Prefect:**
```python
from prefect import task, flow

@task
async def fetch_api(endpoint: str) -> dict:
    # Prefect soporta async tasks nativamente
    async with aiohttp.ClientSession() as session:
        async with session.get(endpoint) as r:
            return await r.json()

@flow
async def pipeline():
    endpoints = ["https://api.ejemplo.com/a", "https://api.ejemplo.com/b"]
    # Prefect maneja la concurrencia automáticamente con async tasks
    resultados = await asyncio.gather(*[fetch_api(e) for e in endpoints])
    return resultados
```

## Cuándo NO usar async

Async no ayuda cuando el bottleneck es **CPU**, no I/O. Si estás haciendo transformaciones pesadas de datos en Python puro, async no va a ayudar — para eso usás multiprocessing o Spark.

| Caso | Solución |
|------|----------|
| Muchas calls a APIs | ✅ async + aiohttp |
| Queries a BD en paralelo | ✅ async + asyncpg |
| Procesamiento CPU-intensivo | ❌ async no ayuda → multiprocessing |
| Grandes volúmenes de datos | ❌ async no ayuda → Spark/Dask |

---

El cambio de 2 horas a 15 minutos en mi pipeline no requirió hardware más grande, no requirió una arquitectura diferente. Solo requirió entender que el tiempo de espera I/O puede ser paralelo. Una vez que internalizás ese concepto, el código asíncrono empieza a ser natural.
