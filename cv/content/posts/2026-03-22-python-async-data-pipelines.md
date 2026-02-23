---
slug: python-async-data-pipelines
date: 2026-03-22
---

Los pipelines de datos tradicionales son síncronos y secuenciales: extraen, transforman, cargan, y esperan en cada paso. Cuando procesás miles de fuentes de datos en paralelo, esto se convierte en un cuello de botella. Python async (asyncio) puede transformar un pipeline de 2 horas en uno de 15 minutos.

## El problema con los pipelines síncronos

Un pipeline típico de ETL que consulta 50 APIs externas:

```python
# Síncrono: 50 APIs * 2 segundos promedio = 100 segundos
def extract_all_sources(sources: list[str]) -> list[dict]:
    results = []
    for source in sources:
        result = requests.get(source, timeout=10)
        results.append(result.json())
    return results
```

Con asyncio:

```python
import asyncio
import aiohttp

# Async: todas las APIs en paralelo = ~2 segundos
async def extract_all_sources(sources: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_source(session, url) for url in sources]
        return await asyncio.gather(*tasks)

async def fetch_source(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
        return await response.json()

results = asyncio.run(extract_all_sources(sources))
```

## Limitaciones y rate limits

El problema con `gather` sin control: si tenés 500 fuentes, lanzás 500 requests simultáneos, lo cual puede:
1. Saturar la red o la API destino
2. Violar rate limits y recibir 429s
3. Consumir toda la memoria

```python
import asyncio
from asyncio import Semaphore

async def extract_with_rate_limit(
    sources: list[str], 
    max_concurrent: int = 20
) -> list[dict]:
    semaphore = Semaphore(max_concurrent)
    
    async def fetch_with_limit(url: str) -> dict:
        async with semaphore:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    return await response.json()
    
    tasks = [fetch_with_limit(url) for url in sources]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

## Async + retry logic

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30)
)
async def fetch_with_retry(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
        resp.raise_for_status()
        return await resp.json()
```

## Pipeline async completo

```python
import asyncio
import aiohttp
from asyncio import Semaphore
import logging

logger = logging.getLogger(__name__)

class AsyncDataPipeline:
    def __init__(self, max_concurrent: int = 20):
        self.semaphore = Semaphore(max_concurrent)
    
    async def extract(self, sources: list[str]) -> list[dict]:
        async with aiohttp.ClientSession() as session:
            tasks = [self._fetch(session, url) for url in sources]
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        successful = [r for r in results if not isinstance(r, Exception)]
        failed = [r for r in results if isinstance(r, Exception)]
        
        if failed:
            logger.warning(f"{len(failed)} sources failed")
        
        return successful
    
    async def _fetch(self, session: aiohttp.ClientSession, url: str) -> dict:
        async with self.semaphore:
            try:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    resp.raise_for_status()
                    data = await resp.json()
                    return {url: url, data: data, status: ok}
            except Exception as e:
                logger.error(f"Failed to fetch {url}: {e}")
                raise
    
    async def run(self, sources: list[str]) -> dict:
        raw_data = await self.extract(sources)
        transformed = [self.transform(item) for item in raw_data]
        return {records: len(transformed), data: transformed}

pipeline = AsyncDataPipeline(max_concurrent=15)
result = asyncio.run(pipeline.run(sources))
```

Resultado: pipelines que antes tardaban horas ahora corren en minutos.
