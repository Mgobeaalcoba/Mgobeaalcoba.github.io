---
slug: chatgpt-api-trucos-avanzados
date: 2026-05-10
---

La mayoría de los developers que usan la API de OpenAI la usan de la forma más básica: mandar un mensaje, recibir una respuesta. Pero hay funcionalidades que cambian lo que podés construir y que no aparecen en los primeros tutoriales.

Acá están los 10 trucos que más impacto tuvieron en los proyectos donde uso la API.

## 1. Structured Outputs: JSON garantizado

El problema clásico: querés que el LLM retorne JSON, especificás el formato en el prompt, y el 5% de las veces retorna algo que no parsea.

**Structured Outputs** garantiza que el output siempre sea el JSON que especificaste:

```python
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional

client = OpenAI()

class AnalisisProducto(BaseModel):
    nombre: str
    categoria: str
    precio_estimado: float
    puntos_fuertes: list[str]
    puntos_debiles: list[str]
    recomendacion: str  # "comprar" | "esperar" | "evitar"
    confianza: float  # 0.0 a 1.0

completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Analizá este producto: iPhone 17 Pro, $1299"}
    ],
    response_format=AnalisisProducto,
)

analisis = completion.choices[0].message.parsed
print(analisis.nombre)          # "iPhone 17 Pro"
print(analisis.recomendacion)   # "comprar"
print(type(analisis.confianza)) # <class 'float'> — garantizado
```

El SDK parsea el JSON y te da un objeto Pydantic typado. Si el modelo no puede generar el JSON correcto (muy raro), la API lanza una excepción.

## 2. Function Calling para conectar con sistemas externos

Function Calling permite al modelo decidir cuándo llamar funciones externas — bases de datos, APIs, cálculos:

```python
import json

# Definir las herramientas disponibles
herramientas = [
    {
        "type": "function",
        "function": {
            "name": "buscar_precio_producto",
            "description": "Busca el precio actual de un producto por ID o nombre",
            "parameters": {
                "type": "object",
                "properties": {
                    "producto": {"type": "string", "description": "Nombre o ID del producto"},
                    "moneda": {"type": "string", "enum": ["ARS", "USD"], "default": "ARS"},
                },
                "required": ["producto"],
            },
        }
    }
]

def buscar_precio_producto(producto: str, moneda: str = "ARS") -> dict:
    # Tu lógica real aquí
    precios = {"iPhone 17 Pro": {"ARS": 2_850_000, "USD": 1299}}
    return precios.get(producto, {"error": "Producto no encontrado"})

# Conversación con function calling
messages = [{"role": "user", "content": "¿Cuánto sale el iPhone 17 Pro en dólares?"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=herramientas,
    tool_choice="auto",
)

# Si el modelo decidió usar una función
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    
    resultado = buscar_precio_producto(**args)
    
    # Agregar el resultado al conversation y pedir respuesta final
    messages.append(response.choices[0].message)
    messages.append({
        "role": "tool",
        "content": json.dumps(resultado),
        "tool_call_id": tool_call.id,
    })
    
    respuesta_final = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
    )
    print(respuesta_final.choices[0].message.content)
    # "El iPhone 17 Pro cuesta 1299 dólares."
```

## 3. Streaming para mejor UX

En vez de esperar la respuesta completa, mostrala mientras se genera:

```python
import sys

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explicame el teorema de Bayes"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)
sys.stdout.write("\n")
```

Para aplicaciones FastAPI:

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.post("/chat")
async def chat_stream(pregunta: str):
    async def generar():
        async with client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": pregunta}],
            stream=True,
        ) as stream:
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
    
    return StreamingResponse(generar(), media_type="text/plain")
```

## 4. System Prompt + Few-Shot para control de estilo

El system prompt define la personalidad y reglas del modelo. Los examples (few-shot) enseñan el formato exacto:

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": """Sos un asistente de e-commerce especializado en Argentina.
Respondé siempre en español rioplatense (tuteo).
Sé conciso (máximo 3 oraciones).
Si no sabés algo, decilo claramente en vez de inventar.""",
        },
        # Few-shot examples
        {"role": "user", "content": "¿Cómo hago una devolución?"},
        {"role": "assistant", "content": "Entrá a 'Mis compras', elegí el producto y clickeá 'Devolver'. Tenés 30 días desde la entrega. El vendedor tiene 3 días hábiles para responder."},
        {"role": "user", "content": "¿Por qué mi pago fue rechazado?"},
        {"role": "assistant", "content": "Los pagos se rechazan por datos incorrectos, falta de fondos o bloqueos del banco. Revisá los datos de tu tarjeta o probá con otro medio de pago. Si el problema continúa, contactá a tu banco."},
        # Pregunta real del usuario
        {"role": "user", "content": "¿Puedo comprar sin cuenta de usuario?"},
    ]
)
```

## 5. Logprobs: medir confianza del modelo

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "¿Buenos Aires es la capital de Argentina? Responde solo: Sí o No"}],
    logprobs=True,
    top_logprobs=2,
)

for token_logprob in response.choices[0].logprobs.content:
    import math
    probabilidad = math.exp(token_logprob.logprob)
    print(f"Token: '{token_logprob.token}' → Prob: {probabilidad:.2%}")
```

Útil para detectar cuándo el modelo está "adivinando" vs respondiendo con alta confianza.

## 6. Batch API para procesar grandes volúmenes

Si tenés miles de requests que no necesitan respuesta inmediata, la Batch API es 50% más barata:

```python
import json

# Preparar el archivo de requests
requests_batch = []
for i, texto in enumerate(mis_textos):
    requests_batch.append({
        "custom_id": f"request-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": f"Clasificá este texto: {texto}"}],
            "max_tokens": 50,
        }
    })

# Subir el archivo
with open("batch_requests.jsonl", "w") as f:
    for req in requests_batch:
        f.write(json.dumps(req) + "\n")

batch_input_file = client.files.create(
    file=open("batch_requests.jsonl", "rb"),
    purpose="batch"
)

# Crear el batch
batch = client.batches.create(
    input_file_id=batch_input_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
)

print(f"Batch ID: {batch.id}")  # Guardar para consultar después
```

## 7. Embeddings para similitud semántica

```python
def crear_embedding(texto: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",  # Más barato que el large
        input=texto,
    )
    return response.data[0].embedding

def similitud_coseno(vec1: list[float], vec2: list[float]) -> float:
    import numpy as np
    v1, v2 = np.array(vec1), np.array(vec2)
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

# Ejemplo: encontrar documentos similares
query = "política de devoluciones para electrónica"
docs = [
    "Los productos electrónicos pueden devolverse en 15 días...",
    "Para ropa y calzado, el plazo de devolución es 30 días...",
    "Las devoluciones de electrónica requieren el empaque original...",
]

query_emb = crear_embedding(query)
scores = [(doc, similitud_coseno(query_emb, crear_embedding(doc))) for doc in docs]
scores.sort(key=lambda x: x[1], reverse=True)

for doc, score in scores:
    print(f"Score: {score:.3f} | {doc[:60]}...")
```

## 8. Moderation API para filtrar contenido

```python
def es_contenido_seguro(texto: str) -> bool:
    response = client.moderations.create(input=texto)
    resultado = response.results[0]
    return not resultado.flagged

def analizar_moderacion(texto: str) -> dict:
    response = client.moderations.create(input=texto)
    cats = response.results[0].categories
    scores = response.results[0].category_scores
    
    return {
        "flagged": response.results[0].flagged,
        "categorias_activas": [k for k, v in vars(cats).items() if v],
        "scores": {k: round(v, 4) for k, v in vars(scores).items()},
    }

print(analizar_moderacion("Este producto es una porquería, odio a este vendedor"))
```

## 9. Usar gpt-4o-mini estratégicamente

gpt-4o-mini es ~20x más barato que gpt-4o. Para muchas tareas, la calidad es suficiente:

```python
def elegir_modelo(complejidad: str) -> str:
    """Elegir modelo según la complejidad de la tarea."""
    if complejidad == "simple":
        return "gpt-4o-mini"  # Clasificación, extracción simple, Q&A factual
    elif complejidad == "media":
        return "gpt-4o-mini"  # Resúmenes, análisis moderado
    else:
        return "gpt-4o"  # Razonamiento complejo, código, análisis profundo

# Regla práctica: probá primero con mini, migrá a gpt-4o solo si la calidad no alcanza
```

## 10. Prompt caching para reducir costos en producción

OpenAI cachea el prefix de los prompts si el system prompt es largo. Para maximizar el beneficio:

```python
# El system prompt (parte que se cachea) debe ir primero y ser estático
SYSTEM_PROMPT = """[System prompt muy largo con instrucciones, ejemplos, contexto...]
"""

def chat(pregunta_usuario: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},  # Se cachea en OpenAI
            {"role": "user", "content": pregunta_usuario},  # Cambia cada vez
        ],
    )
    
    # Verificar cache hit
    usage = response.usage
    print(f"Tokens totales: {usage.total_tokens}")
    print(f"Tokens cacheados: {usage.prompt_tokens_details.cached_tokens}")
    
    return response.choices[0].message.content
```

El caching aplica automáticamente cuando el prefix del prompt es idéntico en requests consecutivos.

---

Estos trucos no son complicados, pero hacen una diferencia enorme en producción — menos errores, mejor UX, menor costo. El primer paso es usar Structured Outputs: elimina la mayoría de los problemas de parsing de JSON al instante.
