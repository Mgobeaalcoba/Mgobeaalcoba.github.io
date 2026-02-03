---
title: "Embeddings explicados simple: La magia detrás de GenAI"
date: "2026-06-21"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["embeddings", "genai", "ml", "vector-search"]
excerpt: "Qué son embeddings, cómo funcionan y por qué son la tecnología clave detrás de ChatGPT, search semántico y RAG."
featured: true
lang: "es"
---

## ¿Qué Son Embeddings?

**Vectores numéricos que representan el significado de un texto.**

Ejemplo:
- "perro" → [0.2, -0.5, 0.8, ..., 0.1] (1536 números)
- "gato" → [0.18, -0.48, 0.75, ..., 0.09]

Palabras similares tienen vectores similares.

## Por Qué Importan

Computadoras no entienden texto. **Entienden números.**

Embeddings convierten texto → números de forma que **preserve el significado**.

## Código: Tu Primer Embedding

```python
import openai

text = "Python es un lenguaje de programación"

response = openai.Embedding.create(
    input=text,
    model="text-embedding-3-small"
)

embedding = response['data'][0]['embedding']

print(f"Dimensiones: {len(embedding)}")  # 1536
print(f"Primeros 5 valores: {embedding[:5]}")
# [0.023, -0.154, 0.892, 0.421, -0.667]
```

## Similitud Semántica

Dos textos similares = embeddings cercanos.

```python
import numpy as np

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# Embeddings
emb_python = get_embedding("Python es un lenguaje")
emb_java = get_embedding("Java es un lenguaje")
emb_pizza = get_embedding("Me gusta la pizza")

# Similitudes
print(cosine_similarity(emb_python, emb_java))   # 0.87 (muy similar)
print(cosine_similarity(emb_python, emb_pizza))  # 0.12 (no relacionados)
```

## Aplicación #1: Search Semántico

```python
# Indexar documentos
docs = [
    "Cómo optimizar queries en BigQuery",
    "Python para automatizar tareas",
    "Guía de Docker para data engineers"
]

embeddings_docs = [get_embedding(doc) for doc in docs]

# Query del usuario
query = "mejorar performance de SQL"
emb_query = get_embedding(query)

# Encontrar doc más similar
similarities = [cosine_similarity(emb_query, emb_doc) for emb_doc in embeddings_docs]
best_match_idx = np.argmax(similarities)

print(f"Mejor match: {docs[best_match_idx]}")
# Output: "Cómo optimizar queries en BigQuery"
```

**Magia:** Encontró "BigQuery" aunque busqué "SQL".

## Aplicación #2: RAG (Retrieval Augmented Generation)

```python
def ask_with_context(question, knowledge_base):
    # 1. Buscar docs relevantes
    emb_q = get_embedding(question)
    similarities = [cosine_similarity(emb_q, emb_doc) 
                    for emb_doc in knowledge_base_embeddings]
    
    # Top 3 docs
    top_3_idx = np.argsort(similarities)[-3:]
    context = "\n".join([knowledge_base[i] for i in top_3_idx])
    
    # 2. LLM con contexto
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Contexto:\n{context}"},
            {"role": "user", "content": question}
        ]
    )
    
    return response.choices[0].message.content

# Usar
answer = ask_with_context(
    "¿Cómo optimizar BigQuery?",
    knowledge_base=mis_documentos
)
```

## Aplicación #3: Clasificación de Texto

```python
# Embeddings de categorías
categorias = {
    "soporte": get_embedding("problema técnico, error, no funciona, ayuda"),
    "ventas": get_embedding("comprar, precio, producto, cotización"),
    "rrhh": get_embedding("empleo, trabajo, vacante, sueldo")
}

# Clasificar email
email_text = "Hola, no puedo iniciar sesión en el sistema"
emb_email = get_embedding(email_text)

# Encontrar categoría más similar
scores = {cat: cosine_similarity(emb_email, emb_cat) 
          for cat, emb_cat in categorias.items()}

categoria_final = max(scores, key=scores.get)
print(f"Categoría: {categoria_final}")  # "soporte"
```

## Modelos de Embeddings en 2026

| Modelo | Dimensiones | Costo/1M tokens | Use Case |
|--------|-------------|-----------------|----------|
| **text-embedding-3-small** | 1536 | $0.02 | General purpose |
| **text-embedding-3-large** | 3072 | $0.13 | Max quality |
| **ada-002** (old) | 1536 | $0.10 | Legacy |

**Recomendación:** text-embedding-3-small (mejor calidad/precio).

## Embeddings Multilingües

```python
# Mismo embedding model funciona en múltiples idiomas
emb_es = get_embedding("Hola, cómo estás")
emb_en = get_embedding("Hello, how are you")

similarity = cosine_similarity(emb_es, emb_en)
print(similarity)  # ~0.85 (alta similitud cross-language!)
```

## Limitaciones

### 1. Contexto Limitado

Embeddings capturan significado de **~8000 tokens máximo**.

Para documentos largos: **chunking**.

### 2. No Es Perfecto

```python
# Estas dos tienen embeddings similares:
"Amo Python"
"Odio Python"

# Embeddings capturan TÓPICO, no necesariamente sentimiento
```

### 3. Costo

1M tokens de embeddings = $0.02

Para millones de docs, el costo escala.

## Tips de Producción

### 1. Cache Embeddings

```python
import hashlib
import pickle

def get_embedding_cached(text, cache_dir='embeddings_cache'):
    # Hash del texto
    text_hash = hashlib.md5(text.encode()).hexdigest()
    cache_path = f"{cache_dir}/{text_hash}.pkl"
    
    # Check cache
    if os.path.exists(cache_path):
        with open(cache_path, 'rb') as f:
            return pickle.load(f)
    
    # Generate embedding
    embedding = get_embedding(text)
    
    # Save to cache
    os.makedirs(cache_dir, exist_ok=True)
    with open(cache_path, 'wb') as f:
        pickle.dump(embedding, f)
    
    return embedding
```

### 2. Batch Processing

```python
# ✅ Procesar en batch (más eficiente)
texts = ["texto1", "texto2", ..., "texto100"]

response = openai.Embedding.create(
    input=texts,  # Lista de textos
    model="text-embedding-3-small"
)

embeddings = [item['embedding'] for item in response['data']]
```

## Conclusión

Embeddings son la **tecnología fundamental** detrás de GenAI moderno.

Entenderlos te permite construir:
- Search semántico
- RAG systems
- Clasificadores de texto
- Recomendadores

No es magia: **es matemática bien aplicada**.

---

*¿Implementando search semántico? [Vector DB post](https://mgobeaalcoba.github.io/blog-post.html?slug=vector-databases-guia-practica)*
