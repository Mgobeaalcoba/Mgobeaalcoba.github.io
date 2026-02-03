---
title: "GenAI en Producción: Checklist de 15 puntos antes de deploy"
date: "2026-03-08"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["genai", "llm", "production", "best-practices"]
excerpt: "No lleves tu modelo de IA a producción sin revisar esto. Lecciones de proyectos reales de GenAI en MercadoLibre y consultoría."
featured: true
lang: "es"
---

## La Realidad de GenAI en Producción

Hacer un demo de ChatGPT es fácil. **Llevarlo a producción sin que explote es otra cosa.**

He visto proyectos de GenAI fallar por cosas básicas que nadie chequeó antes del deploy.

## Pre-Deploy Checklist

### 1. Rate Limits & Throttling

```python
from ratelimit import limits, sleep_and_retry

@sleep_and_retry
@limits(calls=50, period=60)  # 50 llamadas por minuto
def call_llm(prompt):
    return openai.ChatCompletion.create(...)
```

**Por qué:** Las APIs de LLM tienen límites estrictos.

### 2. Timeout Configuration

```python
import openai
openai.api_timeout = 30  # 30 segundos máximo

# Con manejo de timeout
try:
    response = openai.ChatCompletion.create(...)
except openai.error.Timeout:
    logger.warning("LLM timeout, usando fallback")
    return fallback_response()
```

### 3. Cost Monitoring

```python
# Trackear tokens por request
def track_llm_cost(prompt_tokens, completion_tokens, model="gpt-4"):
    costs = {
        "gpt-4": {"input": 0.03, "output": 0.06},  # por 1K tokens
        "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015}
    }
    
    cost = (prompt_tokens / 1000 * costs[model]["input"] +
            completion_tokens / 1000 * costs[model]["output"])
    
    # Log a metrics system
    metrics.increment('llm_cost_usd', cost)
```

### 4. Prompt Versioning

```python
PROMPTS = {
    "v1": "Clasifica este email: {text}",
    "v2": "Sos un clasificador experto. Email: {text}. Categorías: [spam, importante, normal]"
}

# Usar versiones para A/B testing
response = call_llm(PROMPTS["v2"].format(text=email_text))
```

### 5. Output Validation

```python
from pydantic import BaseModel

class LLMResponse(BaseModel):
    category: str
    confidence: float
    reasoning: str

# Validar siempre la respuesta
try:
    validated = LLMResponse.parse_raw(llm_output)
except ValidationError:
    logger.error("LLM returned invalid format")
    return fallback_response()
```

### 6. Fallback Strategy

```python
def classify_with_fallback(text):
    try:
        # Intentar LLM
        return classify_with_llm(text)
    except Exception as e:
        logger.warning(f"LLM failed: {e}, using rule-based fallback")
        return classify_with_rules(text)  # Fallback tradicional
```

### 7. Content Moderation

```python
from better_profanity import profanity

def moderate_input(text):
    if profanity.contains_profanity(text):
        raise ValueError("Contenido inapropiado detectado")
    
    if len(text) > 5000:  # Límite razonable
        raise ValueError("Input demasiado largo")
    
    return text
```

### 8. PII Detection

```python
import re

def remove_pii(text):
    # Email
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
    
    # Teléfono argentino
    text = re.sub(r'\+?54\s?9?\s?\d{2,4}\s?\d{4}\s?\d{4}', '[PHONE]', text)
    
    # DNI
    text = re.sub(r'\b\d{8}\b', '[DNI]', text)
    
    return text
```

### 9. Caching Inteligente

```python
import hashlib
import redis

cache = redis.Redis()

def cached_llm_call(prompt, ttl=3600):
    # Hash del prompt
    cache_key = hashlib.md5(prompt.encode()).hexdigest()
    
    # Check cache
    cached = cache.get(cache_key)
    if cached:
        return cached.decode()
    
    # Call LLM
    response = call_llm(prompt)
    
    # Save to cache
    cache.setex(cache_key, ttl, response)
    
    return response
```

### 10. Retry Logic con Exponential Backoff

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def call_llm_with_retry(prompt):
    return openai.ChatCompletion.create(...)
```

### 11. Monitoring & Alerting

```python
# Métricas clave a trackear
metrics = {
    'llm_calls_total': Counter(),
    'llm_errors_total': Counter(),
    'llm_latency_seconds': Histogram(),
    'llm_cost_usd': Gauge(),
    'llm_tokens_used': Counter()
}

def monitored_llm_call(prompt):
    start_time = time.time()
    
    try:
        metrics['llm_calls_total'].inc()
        response = call_llm(prompt)
        metrics['llm_latency_seconds'].observe(time.time() - start_time)
        return response
    except Exception as e:
        metrics['llm_errors_total'].inc()
        raise
```

### 12. Multimodal Support

```python
def call_llm_with_image(prompt, image_url):
    return openai.ChatCompletion.create(
        model="gpt-4-vision",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": image_url}
            ]
        }]
    )
```

### 13. Token Estimation (Antes de llamar)

```python
def estimate_tokens(text):
    # Aproximación: ~4 caracteres por token
    return len(text) // 4

def is_prompt_too_expensive(prompt, max_cost=0.10):
    estimated_tokens = estimate_tokens(prompt)
    estimated_cost = estimated_tokens / 1000 * 0.03  # GPT-4 input
    
    if estimated_cost > max_cost:
        raise ValueError(f"Prompt demasiado costoso: ${estimated_cost:.2f}")
    
    return True
```

### 14. A/B Testing de Prompts

```python
import random

def get_prompt_variant():
    variants = ["v1", "v2", "v3"]
    return random.choice(variants)

# Log para comparar performance
variant = get_prompt_variant()
response = call_llm(PROMPTS[variant].format(text=input_text))

metrics.record('prompt_variant', variant, {
    'success': response.success,
    'user_satisfaction': calculate_satisfaction(response)
})
```

### 15. Graceful Degradation

```python
def smart_classification(text):
    # Intentar orden de menor a mayor costo
    
    # 1. Rule-based (gratis, rápido)
    if simple_rules_can_handle(text):
        return rule_based_classify(text)
    
    # 2. Small model (barato)
    try:
        return call_llm(text, model="gpt-3.5-turbo")
    except Exception:
        pass
    
    # 3. Large model (costoso, solo si es necesario)
    try:
        return call_llm(text, model="gpt-4")
    except Exception:
        # 4. Fallback final
        return default_classification()
```

## Checklist Completo

Antes de deploy a producción:

- [ ] Rate limits configurados
- [ ] Timeouts definidos
- [ ] Cost monitoring activo
- [ ] Prompts versionados
- [ ] Output validation implementada
- [ ] Fallback strategy funcional
- [ ] Content moderation activa
- [ ] PII detection implementada
- [ ] Cache configurado
- [ ] Retry logic con backoff
- [ ] Monitoring & alerting activos
- [ ] Multimodal support (si aplica)
- [ ] Token estimation habilitado
- [ ] A/B testing preparado
- [ ] Graceful degradation implementada

## Conclusión

GenAI en producción requiere **ingeniería sólida**, no solo buenas prompts.

Estos 15 puntos son la diferencia entre un POC y un sistema production-ready.

---

*¿Implementando GenAI? Consultame: [Servicios de Consultoría](https://mgobeaalcoba.github.io/consulting.html)*
