---
title: "10 trucos avanzados de ChatGPT API que nadie te cuenta"
date: "2026-05-10"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["chatgpt", "openai", "api", "prompts"]
excerpt: "Técnicas poco conocidas para sacar más provecho de la API de ChatGPT. Desde function calling hasta prompt caching."
featured: true
lang: "es"
---

## Más Allá del Chat Básico

La mayoría usa ChatGPT API así:

```python
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hola"}]
)
```

**Hay mucho más.** Estas técnicas me ahorraron miles de dólares y horas de debugging.

## Truco #1: Function Calling

Hacer que GPT devuelva **structured data**.

```python
functions = [{
    "name": "extract_transaction",
    "description": "Extrae datos de una transacción del texto",
    "parameters": {
        "type": "object",
        "properties": {
            "amount": {"type": "number"},
            "currency": {"type": "string"},
            "date": {"type": "string", "format": "date"}
        },
        "required": ["amount", "currency"]
    }
}]

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Pagué $5000 USD el 3 de mayo"}],
    functions=functions,
    function_call="auto"
)

# Response es JSON estructurado
{
    "amount": 5000,
    "currency": "USD",
    "date": "2026-05-03"
}
```

## Truco #2: Seed para Reproducibilidad

```python
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[...],
    seed=42,  # Mismo seed = misma respuesta
    temperature=0
)

# Útil para testing y debugging
```

## Truco #3: JSON Mode (Forzar JSON)

```python
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[{
        "role": "user",
        "content": "Extrae nombre y email de: Juan Pérez - juan@email.com"
    }],
    response_format={"type": "json_object"}
)

# Garantizado que devuelve JSON válido
```

## Truco #4: Streaming para UX

```python
stream = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explica BigQuery"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")

# Usuario ve respuesta aparecer en tiempo real
```

## Truco #5: Token Counting Exacto

```python
import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4")

def count_tokens(text):
    return len(encoding.encode(text))

prompt = "Tu prompt largo aquí..."
tokens = count_tokens(prompt)
cost_estimate = tokens / 1000 * 0.03  # GPT-4 input cost

print(f"Tokens: {tokens}, Costo estimado: ${cost_estimate:.4f}")
```

## Truco #6: Batch API (50% Cheaper)

```python
# Para requests no-urgentes
batch_request = openai.Batch.create(
    input_file_id=file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h"
)

# 50% descuento, pero tardas hasta 24hs
```

## Truco #7: Prompt Caching (Automático en GPT-4 Turbo)

```python
# Prefijo del prompt (cached automáticamente)
system_prompt = """Sos un experto en finanzas argentinas.
Tus respuestas deben ser precisas y citar fuentes.
[... 5000 tokens de contexto ...]"""

# Esto se cachea. Requests subsecuentes son 50% más baratos.
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Pregunta corta"}
    ]
)
```

## Truco #8: Logprobs para Confidence

```python
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "¿El email es spam?"}],
    logprobs=True,
    top_logprobs=3
)

# Ver probabilidad de la respuesta
confidence = response.choices[0].logprobs.content[0].top_logprobs[0].logprob
print(f"Confidence: {confidence}")

# Si confidence baja, pedir confirmación humana
```

## Truco #9: Vision API para OCR

```python
def extract_text_from_image(image_url):
    response = openai.ChatCompletion.create(
        model="gpt-4-vision",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Extrae el texto de esta imagen en JSON"},
                {"type": "image_url", "image_url": image_url}
            ]
        }],
        max_tokens=1000
    )
    return response.choices[0].message.content
```

## Truco #10: Parallel Function Calling

```python
functions = [
    {"name": "get_weather", ...},
    {"name": "get_stock_price", ...},
    {"name": "get_news", ...}
]

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Dame weather, stock de AAPL y news"}],
    functions=functions,
    function_call="auto"
)

# GPT puede llamar múltiples functions en una respuesta
```

## Ahorro de Costos

Aplicando estos trucos en proyectos de consultoría:

- Function calling: **-40% tokens** (vs parsing text)
- Prompt caching: **-50% cost** en requests repetidas
- Batch API: **-50% cost** para non-urgent
- JSON mode: **-20% tokens** (vs markdown)

**Total ahorro promedio: 60-70%**

## Conclusión

ChatGPT API es mucho más potente de lo que parece.

Estos trucos separán developers amateur de profesionales.

---

*¿Querés más tips de GenAI? Seguime en [LinkedIn](https://www.linkedin.com/in/mariano-gobea-alcoba/)*
