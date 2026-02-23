---
slug: genai-produccion-checklist
date: 2026-03-08
---

Llevar un modelo de IA a producción no es lo mismo que hacer una demo. He visto proyectos con meses de desarrollo fallar en el día 1 de launch porque se saltaron pasos que parecían menores. Este checklist está basado en mis experiencias reales y en las lecciones más dolorosas.

## ¿Por qué los sistemas GenAI fallan en producción?

Los sistemas tradicionales fallan de formas predecibles: el servidor se cae, la base de datos está llena, hay un bug en el código. Los sistemas GenAI fallan de formas sutiles: generan respuestas plausibles pero incorrectas, son inconsistentes entre ejecuciones, responden de forma diferente en producción que en staging.

Además, las expectativas del usuario final suelen ser desproporcionadas. Si el sistema dice algo incorrecto una vez, pierde credibilidad para siempre.

---

## El Checklist de 15 Puntos

### GRUPO 1: Calidad de Outputs

**1. ¿Definiste métricas de calidad y tenés baseline?**

Antes de ir a producción, medí la calidad de los outputs sobre un set de test representativo. Sin baseline, no podés detectar degradación.

```python
# Ejemplo simplificado de evaluación automatizada
def evaluar_batch(prompts: list[str], expected: list[str]) -> dict:
    resultados = []
    for prompt, esperado in zip(prompts, expected):
        respuesta = llm.generate(prompt)
        score = calcular_similitud(respuesta, esperado)  # BLEU, cosine similarity, etc.
        resultados.append({"prompt": prompt, "score": score})
    
    return {
        "score_promedio": sum(r["score"] for r in resultados) / len(resultados),
        "score_minimo": min(r["score"] for r in resultados),
        "porcentaje_sobre_umbral": sum(1 for r in resultados if r["score"] > 0.7) / len(resultados),
    }
```

**2. ¿Evaluaste casos extremos y adversariales?**

Los usuarios van a intentar cosas que no esperás. Probá:
- Inputs vacíos o muy cortos
- Inputs extremadamente largos (test el límite de tokens)
- Preguntas fuera del scope del sistema
- Prompt injection intentos
- Idiomas o formatos no esperados

**3. ¿Los outputs son deterministas o manejás la variabilidad?**

Con `temperature > 0`, el mismo input puede dar outputs diferentes. Si tu sistema necesita consistencia, considerá `temperature = 0` o usá caching de respuestas.

```python
# Cache de respuestas para queries frecuentes
from functools import lru_cache
import hashlib

def cache_key(prompt: str, model: str, temperature: float) -> str:
    return hashlib.md5(f"{prompt}|{model}|{temperature}".encode()).hexdigest()

response_cache = {}

def generate_with_cache(prompt: str, **kwargs):
    key = cache_key(prompt, kwargs.get('model', 'default'), kwargs.get('temperature', 0))
    
    if key in response_cache:
        return response_cache[key]
    
    response = llm.generate(prompt, **kwargs)
    response_cache[key] = response
    return response
```

---

### GRUPO 2: Confiabilidad y Manejo de Errores

**4. ¿Tenés fallback cuando el LLM falla o timeout?**

Las APIs de LLM tienen latencia variable y fallan. ¿Qué muestra el usuario mientras esperás? ¿Qué pasa si hay un error 429 (rate limit)?

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
async def generar_con_retry(prompt: str, timeout: float = 30.0) -> str:
    try:
        async with asyncio.timeout(timeout):
            return await llm.agenerate(prompt)
    except asyncio.TimeoutError:
        raise TimeoutError(f"LLM no respondió en {timeout}s")
```

**5. ¿Tenés manejo de context length exceeded?**

Los modelos tienen límites de tokens. Si el input + output supera el límite, el request falla.

```python
import tiktoken

def truncar_si_necesario(texto: str, max_tokens: int = 3000, model: str = "gpt-4") -> str:
    encoder = tiktoken.encoding_for_model(model)
    tokens = encoder.encode(texto)
    
    if len(tokens) <= max_tokens:
        return texto
    
    # Truncar preservando el principio y el final (lo más relevante)
    mitad = max_tokens // 2
    tokens_truncados = tokens[:mitad] + tokens[-mitad:]
    return encoder.decode(tokens_truncados)
```

**6. ¿Tenés circuit breaker para el proveedor de LLM?**

Si el proveedor está caído, no querés que cada request espere el timeout completo antes de fallar.

```python
# Usando la librería 'circuitbreaker'
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
def llamar_openai(prompt: str) -> str:
    return openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    ).choices[0].message.content
```

---

### GRUPO 3: Seguridad y Privacidad

**7. ¿Protegiste contra prompt injection?**

Los usuarios pueden intentar "hackear" el sistema con prompts que override las instrucciones del sistema.

```python
def sanitizar_input(user_input: str) -> str:
    # Detectar patrones comunes de prompt injection
    patrones_sospechosos = [
        "ignore previous instructions",
        "forget everything above",
        "you are now",
        "pretend you are",
        "system:",
        "SYSTEM:",
    ]
    
    input_lower = user_input.lower()
    for patron in patrones_sospechosos:
        if patron.lower() in input_lower:
            raise ValueError("Input potencialmente malicioso detectado")
    
    return user_input.strip()
```

**8. ¿Los datos de usuarios no van al modelo sin sanitización?**

Datos personales (nombres, emails, DNI, números de tarjeta) no deben enviarse al LLM. Si el usuario comparte PII en su prompt, debés filtrarla antes de enviarla.

**9. ¿Tenés logging de inputs/outputs con consideraciones de privacidad?**

Necesitás logs para debugging, pero esos logs no deben incluir datos sensibles de usuarios.

---

### GRUPO 4: Performance y Costos

**10. ¿Mediste la latencia end-to-end en producción?**

La latencia del LLM en staging puede ser muy diferente a producción (carga del proveedor, red, etc.). Medí P50, P90, P99.

```python
import time
from prometheus_client import Histogram

llm_latency = Histogram(
    'llm_request_duration_seconds',
    'LLM request duration',
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

def generate_con_metricas(prompt: str) -> str:
    inicio = time.time()
    try:
        resultado = llm.generate(prompt)
        return resultado
    finally:
        llm_latency.observe(time.time() - inicio)
```

**11. ¿Estimaste los costos a escala real?**

Calculá: tokens promedio por request × requests por día × precio por token.

```python
def estimar_costo_mensual(
    requests_por_dia: int,
    tokens_input_promedio: int,
    tokens_output_promedio: int,
    precio_input_por_millon: float = 2.50,   # GPT-4o precio input
    precio_output_por_millon: float = 10.00,  # GPT-4o precio output
) -> dict:
    requests_mes = requests_por_dia * 30
    
    costo_input = (requests_mes * tokens_input_promedio / 1_000_000) * precio_input_por_millon
    costo_output = (requests_mes * tokens_output_promedio / 1_000_000) * precio_output_por_millon
    
    return {
        "costo_input_usd": round(costo_input, 2),
        "costo_output_usd": round(costo_output, 2),
        "costo_total_usd": round(costo_input + costo_output, 2),
    }
```

---

### GRUPO 5: Operaciones y Monitoreo

**12. ¿Tenés health checks específicos para el LLM?**

El health check general de tu API no detecta si el LLM está respondiendo mal.

```python
@app.get("/health/llm")
async def llm_health():
    try:
        respuesta = await llm.agenerate("Responde solo: OK")
        if "ok" not in respuesta.lower():
            return {"status": "degraded", "detail": "LLM respondió de forma inesperada"}
        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "detail": str(e)}
```

**13. ¿Tenés alertas para degradación de calidad?**

Configurá alertas cuando:
- La latencia P99 supera umbral
- La tasa de errores aumenta
- El costo diario supera presupuesto

**14. ¿Tenés un proceso de evaluación continua (CI para calidad)?**

Cada vez que cambies el prompt o el modelo, corrés el suite de evaluación automáticamente. Si la calidad baja más del X%, la deploy se bloquea.

**15. ¿Tenés un runbook para incidentes?**

Documentá:
- ¿Cómo se ve una falla del proveedor vs falla propia?
- ¿Cómo habilitar el modo degradado (sin LLM)?
- ¿Quién tiene las keys de API y cómo rotar si se comprometen?
- ¿Cómo estimar el impacto de un incidente?

---

## Antes del Launch: la lista rápida

- [ ] Métricas de calidad definidas y medidas en test set
- [ ] Casos adversariales probados
- [ ] Retry con backoff exponencial
- [ ] Manejo de context length
- [ ] Circuit breaker
- [ ] Prompt injection mitigado
- [ ] PII no enviado al modelo
- [ ] Logging con privacidad
- [ ] Latencia medida (P50/P90/P99)
- [ ] Costo estimado para volumen real
- [ ] Health check específico para LLM
- [ ] Alertas configuradas
- [ ] CI de evaluación de calidad
- [ ] Runbook de incidentes
- [ ] Modo degradado sin LLM

---

Un sistema GenAI que falla en producción no solo genera costo — genera desconfianza que es muy difícil de recuperar. Vale la pena invertir 2-3 días extra en este checklist antes del launch.
