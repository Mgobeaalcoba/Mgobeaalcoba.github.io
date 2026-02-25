---
slug: chatgpt-api-trucos-avanzados
date: 2025-11-16
---

Más allá del "hola mundo" con la API de OpenAI, hay patterns avanzados que marcan la diferencia en sistemas de producción. Estos son los que más usé en el último año.

## 1. Structured Outputs (el cambio más importante de 2025)

Antes, para obtener JSON del modelo, rezabas que no alucinara el formato. Ahora con Structured Outputs, el modelo garantiza el schema:

```python
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional

client = OpenAI()

class ProductAnalysis(BaseModel):
    product_name: str
    sentiment: str  # "positive", "negative", "neutral"
    key_features: list[str]
    price_mentioned: Optional[float]
    confidence_score: float

def analyze_product_review(review: str) -> ProductAnalysis:
    response = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "Analizá la reseña y extraé la información estructurada."},
            {"role": "user", "content": review},
        ],
        response_format=ProductAnalysis,
    )
    return response.choices[0].message.parsed

result = analyze_product_review("Me encantó el celular, la batería dura 2 días. Vale $800.")
print(result.sentiment)      # "positive"
print(result.price_mentioned)  # 800.0
```

## 2. Function Calling para Tool Use

```python
import json
from openai import OpenAI

client = OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_seller_metrics",
            "description": "Get sales metrics for a specific seller",
            "parameters": {
                "type": "object",
                "properties": {
                    "seller_id": {"type": "string"},
                    "start_date": {"type": "string", "format": "date"},
                    "end_date": {"type": "string", "format": "date"},
                    "metrics": {
                        "type": "array",
                        "items": {"type": "string", "enum": ["gmv", "orders", "conversion"]}
                    }
                },
                "required": ["seller_id"],
            },
        },
    }
]

def chat_with_tools(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )
        
        choice = response.choices[0]
        
        if choice.finish_reason == "stop":
            return choice.message.content
        
        if choice.finish_reason == "tool_calls":
            messages.append(choice.message)
            
            for tool_call in choice.message.tool_calls:
                args = json.loads(tool_call.function.arguments)
                
                if tool_call.function.name == "get_seller_metrics":
                    result = fetch_seller_metrics(**args)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result),
                })

answer = chat_with_tools("¿Cuánto vendió el seller ABC123 el mes pasado?")
```

## 3. Streaming para mejor UX

```python
import streamlit as st
from openai import OpenAI

client = OpenAI()

def stream_response(prompt: str):
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        stream = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                full_response += chunk.choices[0].delta.content
                message_placeholder.markdown(full_response + "▌")
        
        message_placeholder.markdown(full_response)
    
    return full_response
```

## 4. Embeddings para búsqueda semántica

```python
from openai import OpenAI
import numpy as np
from scipy.spatial.distance import cosine

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small",  # 1536 dims, mucho más barato que ada-002
    )
    return response.data[0].embedding

def find_similar_documents(
    query: str, 
    documents: list[str], 
    top_k: int = 5
) -> list[tuple[str, float]]:
    query_embedding = get_embedding(query)
    doc_embeddings = [get_embedding(doc) for doc in documents]
    
    similarities = [
        1 - cosine(query_embedding, doc_emb)
        for doc_emb in doc_embeddings
    ]
    
    ranked = sorted(
        zip(documents, similarities),
        key=lambda x: x[1],
        reverse=True
    )
    
    return ranked[:top_k]
```

## 5. Batch API para procesamiento masivo (90% más barato)

```python
import json
from openai import OpenAI

client = OpenAI()

def create_batch_job(items: list[dict]) -> str:
    """Procesa miles de items a 50% del costo normal con 24h de SLA."""
    
    batch_requests = []
    for i, item in enumerate(items):
        batch_requests.append({
            "custom_id": f"request-{i}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "user", "content": f"Clasificá esta descripción: {item['text']}"}
                ],
                "max_tokens": 100,
            }
        })
    
    # Subir archivo JSONL
    with open("/tmp/batch_input.jsonl", "w") as f:
        for req in batch_requests:
            f.write(json.dumps(req) + "\n")
    
    with open("/tmp/batch_input.jsonl", "rb") as f:
        batch_file = client.files.create(file=f, purpose="batch")
    
    batch = client.batches.create(
        input_file_id=batch_file.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
    )
    
    return batch.id

# Usar cuando tenés > 1000 items para procesar sin urgencia
batch_id = create_batch_job(items)
print(f"Batch creado: {batch_id}. Resultados en ~24h.")
```

## Costos comparados (GPT-4o)

| Método | Input | Output | Cuándo usar |
|--------|-------|--------|-------------|
| API normal | $2.50/1M | $10/1M | Tiempo real |
| Batch API | $1.25/1M | $5/1M | Offline, volumen alto |
| GPT-4o-mini | $0.15/1M | $0.60/1M | Tareas simples |

El Batch API es el cambio más impactante para procesamiento masivo — 50% de descuento por esperar 24 horas.
