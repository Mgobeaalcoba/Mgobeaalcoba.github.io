---
title: "Python Async para Data Pipelines: De 2 horas a 15 minutos"
date: "2026-03-22"
author: "Mariano Gobea Alcoba"
category: "python"
tags: ["python", "async", "performance", "asyncio"]
excerpt: "Cómo usar asyncio y aiohttp para paralelizar fetches de APIs y acelerar pipelines de datos dramáticamente."
featured: true
lang: "es"
---

## El Problema: Fetching Secuencial

Nuestro pipeline fetcheaba datos de 50 APIs externas... una por vez.

**Tiempo total: 2 horas y 15 minutos.**

Inaceptable para un pipeline que debía correr cada hora.

## Código Original (Síncrono)

```python
import requests

def fetch_all_data():
    results = []
    
    for api_url in API_URLS:  # 50 URLs
        response = requests.get(api_url, timeout=30)
        results.append(response.json())
    
    return results

# Tiempo: 50 APIs × 2.7min avg = 135 minutos
```

## Solución: Async con aiohttp

```python
import asyncio
import aiohttp

async def fetch_one(session, url):
    async with session.get(url, timeout=30) as response:
        return await response.json()

async def fetch_all_data():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in API_URLS]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

# Ejecutar
data = asyncio.run(fetch_all_data())

# Tiempo: ~15 minutos (limitado por la API más lenta)
```

**Mejora: 88% más rápido.**

## Explicación: ¿Por Qué Funciona?

### Código Síncrono
```
API1: [====wait====][process]
API2:                         [====wait====][process]
API3:                                                 [====wait====][process]
```

### Código Asíncrono
```
API1: [====wait====][process]
API2: [====wait====][process]
API3: [====wait====][process]
```

**Todas en paralelo = Tiempo total = API más lenta (no suma de todas)**

## Manejo de Errores Robusto

```python
async def fetch_with_retry(session, url, retries=3):
    for attempt in range(retries):
        try:
            async with session.get(url, timeout=30) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.warning(f"Status {response.status} for {url}")
        except asyncio.TimeoutError:
            logger.warning(f"Timeout attempt {attempt+1}/{retries} for {url}")
            await asyncio.sleep(2 ** attempt)  # Exponential backoff
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            
    return None  # Failed after all retries

async def fetch_all_with_fallback():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_with_retry(session, url) for url in API_URLS]
        results = await asyncio.gather(*tasks)
        
        # Filter out failed requests
        valid_results = [r for r in results if r is not None]
        
        logger.info(f"Fetched {len(valid_results)}/{len(API_URLS)} APIs successfully")
        return valid_results
```

## Rate Limiting con Semáforo

```python
async def fetch_with_rate_limit(session, url, semaphore):
    async with semaphore:  # Solo N requests concurrentes
        return await fetch_one(session, url)

async def fetch_all_rate_limited(max_concurrent=10):
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async with aiohttp.ClientSession() as session:
        tasks = [
            fetch_with_rate_limit(session, url, semaphore) 
            for url in API_URLS
        ]
        return await asyncio.gather(*tasks)
```

## Benchmark Real

Pipeline de 50 APIs en MercadoLibre:

| Método | Tiempo | Speedup |
|--------|--------|---------|
| **Sync (requests)** | 135 min | 1x |
| **ThreadPoolExecutor** | 45 min | 3x |
| **Async (aiohttp)** | 15 min | **9x** |
| **Async + cache** | 2 min | **67x** |

## Cuándo NO usar Async

- ❌ I/O no es el bottleneck (CPU-bound)
- ❌ API externa tiene rate limit bajo
- ❌ Team no conoce asyncio (learning curve)

## Conclusión

Async en Python **no es hype**: es necesidad para pipelines modernos.

Si tu pipeline espera mucho I/O, async es tu solución.

---

*¿Querés optimizar tus pipelines? Mirá mi [Masterclass](https://mgobeaalcoba.github.io/blog.html#videos)*
