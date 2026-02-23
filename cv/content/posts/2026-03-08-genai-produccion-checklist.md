---
slug: genai-produccion-checklist
date: 2026-03-08
---

Poner un modelo de IA generativa en producción es fundamentalmente diferente a hacer un demo que funciona. El demo impresiona en una reunión; el sistema de producción tiene que sobrevivir usuarios reales, edge cases, y 3am on-calls. Acá el checklist que uso antes de hacer deploy.

## Por qué los demos engañan

Un demo con GPT-4 es fácil. Escribís un prompt, el modelo responde algo inteligente, todos aplauden. El problema aparece cuando:

- El input del usuario es ambiguo, malicioso, o inesperado
- El modelo alucina con confianza
- La latencia es inaceptable bajo carga
- El costo escala de forma no lineal
- Cambia la versión del modelo y el comportamiento cambia

## El Checklist Completo

### ✅ Robustez del Prompt

**1. Prompt versioning**

Los prompts son código. Deben estar versionados, no hardcodeados:

```python
# Mal
prompt = "Resumí este texto: {text}"

# Bien
from enum import Enum

class PromptVersion(Enum):
    V1 = "v1"
    V2 = "v2"

PROMPTS = {
    PromptVersion.V1: """Sos un asistente especializado en resúmenes ejecutivos.
    
Dado el siguiente texto, generá un resumen de máximo 3 párrafos.
Enfocate en los puntos de acción y las métricas clave.

Texto:
{text}

Resumen:""",
    PromptVersion.V2: """..."""  # Versión mejorada
}

def get_summary(text: str, version: PromptVersion = PromptVersion.V1) -> str:
    prompt = PROMPTS[version].format(text=text)
    return call_llm(prompt)
```

**2. Input sanitization**

```python
def sanitize_user_input(text: str, max_tokens: int = 2000) -> str:
    # Limitar longitud
    text = text[:max_tokens * 4]  # ~4 chars per token
    
    # Remover injection attempts básicos
    injection_patterns = [
        "ignore previous instructions",
        "disregard all prior",
        "act as if you are",
        "you are now",
    ]
    text_lower = text.lower()
    for pattern in injection_patterns:
        if pattern in text_lower:
            raise ValueError(f"Potentially malicious input detected")
    
    return text.strip()
```

### ✅ Manejo de Output

**3. Output parsing robusto**

Si esperás JSON del modelo, nunca asumas que vendrá perfecto:

```python
import json
import re
from typing import Optional

def parse_json_response(response: str) -> Optional[dict]:
    # Intentar parse directo
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        pass
    
    # Extraer JSON de markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass
    
    # Buscar cualquier objeto JSON en la respuesta
    json_match = re.search(r'\{[^{}]*\}', response, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass
    
    return None  # Fallar explícitamente, no silenciosamente
```

**4. Hallucination detection para datos críticos**

```python
def verify_numerical_claims(text: str, source_data: dict) -> list[str]:
    """Detecta si el LLM inventó números que no están en los datos fuente."""
    
    # Extraer todos los números del texto generado
    numbers_in_text = set(re.findall(r'\b\d+(?:\.\d+)?%?\b', text))
    
    # Verificar contra los datos originales
    source_values = {str(v) for v in source_data.values() if isinstance(v, (int, float))}
    
    unverified = numbers_in_text - source_values
    if unverified:
        return list(unverified)
    return []
```

### ✅ Costos y Latencia

**5. Cost tracking por request**

```python
from dataclasses import dataclass

@dataclass
class LLMUsage:
    input_tokens: int
    output_tokens: int
    model: str
    
    @property
    def cost_usd(self) -> float:
        pricing = {
            'gpt-4o': {'input': 0.0025, 'output': 0.01},
            'gpt-4o-mini': {'input': 0.00015, 'output': 0.0006},
            'claude-3-5-sonnet': {'input': 0.003, 'output': 0.015},
        }
        rates = pricing.get(self.model, {'input': 0.001, 'output': 0.003})
        return (
            self.input_tokens / 1000 * rates['input'] +
            self.output_tokens / 1000 * rates['output']
        )

def track_usage(response, model: str) -> LLMUsage:
    usage = LLMUsage(
        input_tokens=response.usage.prompt_tokens,
        output_tokens=response.usage.completion_tokens,
        model=model
    )
    # Log para análisis de costos
    logger.info("LLM call", extra={
        'cost_usd': usage.cost_usd,
        'model': model,
        'input_tokens': usage.input_tokens,
        'output_tokens': usage.output_tokens,
    })
    return usage
```

**6. Caching agresivo para queries repetidas**

```python
import hashlib
import redis
import json

class LLMCache:
    def __init__(self, redis_client: redis.Redis, ttl_seconds: int = 3600):
        self.redis = redis_client
        self.ttl = ttl_seconds
    
    def _cache_key(self, prompt: str, model: str) -> str:
        content = f"{model}:{prompt}"
        return f"llm:{hashlib.sha256(content.encode()).hexdigest()}"
    
    def get(self, prompt: str, model: str) -> Optional[str]:
        key = self._cache_key(prompt, model)
        cached = self.redis.get(key)
        return cached.decode() if cached else None
    
    def set(self, prompt: str, model: str, response: str):
        key = self._cache_key(prompt, model)
        self.redis.setex(key, self.ttl, response)
```

### ✅ Observabilidad

**7. Logging estructurado de cada interacción**

```python
import uuid
from datetime import datetime

def log_llm_interaction(
    user_id: str,
    prompt: str,
    response: str,
    usage: LLMUsage,
    latency_ms: float,
    cached: bool = False
):
    logger.info("llm_interaction", extra={
        'interaction_id': str(uuid.uuid4()),
        'user_id': user_id,
        'timestamp': datetime.utcnow().isoformat(),
        'prompt_hash': hashlib.sha256(prompt.encode()).hexdigest()[:8],
        'response_length': len(response),
        'cost_usd': usage.cost_usd,
        'latency_ms': latency_ms,
        'cached': cached,
        'model': usage.model,
    })
```

### ✅ Failsafe

**8. Fallback determinístico**

```python
async def get_summary_with_fallback(text: str) -> dict:
    try:
        # Intentar con el modelo principal
        result = await call_gpt4(text, timeout=10)
        return {'source': 'llm', 'content': result}
    except (TimeoutError, RateLimitError) as e:
        logger.warning(f"LLM failed, using fallback: {e}")
        # Fallback: extractive summarization simple
        sentences = text.split('.')[:3]
        return {'source': 'extractive', 'content': '. '.join(sentences)}
```

## La realidad de producción

Los sistemas GenAI en producción exitosos comparten un patrón: **no confían ciegamente en el LLM**. Verifican, validan, tienen fallbacks, y monitorean constantemente.

El modelo es solo una pieza. El sistema alrededor del modelo es donde está la diferencia entre un demo y un producto.
