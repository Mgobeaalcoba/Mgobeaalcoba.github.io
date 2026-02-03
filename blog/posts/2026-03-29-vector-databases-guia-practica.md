---
title: "Vector Databases: Guía práctica para RAG en producción"
date: "2026-03-29"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["vector-db", "rag", "embeddings", "genai"]
excerpt: "Todo lo que necesitás saber sobre vector databases para implementar RAG (Retrieval Augmented Generation) en producción. Pinecone vs Weaviate vs Milvus."
featured: true
lang: "es"
---

## ¿Por Qué Vector Databases?

Los LLMs tienen un problema: **su conocimiento está congelado en el tiempo de entrenamiento**.

Para darles contexto actualizado (tus documentos, tu data), necesitás **RAG: Retrieval Augmented Generation**.

Y RAG necesita vector databases.

## ¿Qué es un Vector Database?

Almacena embeddings (vectores numéricos) de tus textos y permite búsqueda por similitud semántica.

```python
# Texto → Embedding (vector)
text = "Cómo optimizar queries en BigQuery"
embedding = openai.Embedding.create(input=text, model="text-embedding-3-small")
# Output: [0.023, -0.154, 0.892, ..., 0.231]  # 1536 dimensiones
```

## El Pipeline RAG Completo

```python
import openai
import pinecone

# 1. Inicializar vector DB
pinecone.init(api_key="tu-api-key")
index = pinecone.Index("knowledge-base")

# 2. Indexar documentos
def index_documents(docs):
    for doc in docs:
        # Generate embedding
        embedding = openai.Embedding.create(
            input=doc["text"],
            model="text-embedding-3-small"
        )["data"][0]["embedding"]
        
        # Store in Pinecone
        index.upsert([(doc["id"], embedding, {"text": doc["text"]})])

# 3. Query con contexto
def query_with_context(question):
    # Generate embedding del question
    q_embedding = openai.Embedding.create(
        input=question,
        model="text-embedding-3-small"
    )["data"][0]["embedding"]
    
    # Buscar docs similares
    results = index.query(q_embedding, top_k=3, include_metadata=True)
    
    # Construir contexto
    context = "\n\n".join([r["metadata"]["text"] for r in results["matches"]])
    
    # LLM con contexto
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Contexto:\n{context}"},
            {"role": "user", "content": question}
        ]
    )
    
    return response.choices[0].message.content
```

## Comparativa: Pinecone vs Weaviate vs Milvus

### Pinecone (Cloud-Only)

**Pros:**
- Setup en 5 minutos
- Managed completamente
- Performance excelente
- SDKs en todo lenguaje

**Contras:**
- Caro ($70/mes plan starter)
- Vendor lock-in
- No self-hosted

**Ideal para:** MVPs, startups, no quieres ops

### Weaviate (Cloud o Self-Hosted)

**Pros:**
- Open-source
- GraphQL API
- Filtros complejos
- Multi-tenancy

**Contras:**
- Más complejo de configurar
- Performance variable self-hosted

**Ideal para:** Empresas con DevOps team

### Milvus (Self-Hosted)

**Pros:**
- 100% open-source
- Performance brutal (GPU support)
- Escalabilidad masiva

**Contras:**
- Requiere K8s en producción
- Curva de aprendizaje alta

**Ideal para:** Big tech, millones de vectors

## Costos Comparados

| DB | Almacenamiento | Queries | Total/Mes |
|----|----------------|---------|-----------|
| **Pinecone** | $70 (1M vectors) | Incluido | $70 |
| **Weaviate Cloud** | $25 | $0.0003/query | ~$50 |
| **Milvus (self)** | $20 (GCP disk) | $0 | ~$150 (compute) |

## Tips de Producción

### 1. Chunk Strategy

```python
def chunk_document(text, chunk_size=500, overlap=50):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)
    return chunks
```

**Por qué:** Embeddings funcionan mejor en chunks de 200-800 tokens.

### 2. Metadata Filtering

```python
# Buscar solo en documentos de 2026
results = index.query(
    embedding,
    top_k=5,
    filter={"year": {"$eq": 2026}}
)
```

### 3. Hybrid Search (Vector + Keywords)

```python
# Weaviate permite combinar
results = client.query.get("Document", ["text"]).with_hybrid(
    query="BigQuery optimization",
    alpha=0.5  # 50% vector, 50% keyword
).do()
```

## Checklist Pre-Producción

- [ ] Chunking strategy definida
- [ ] Embeddings model seleccionado
- [ ] Vector DB elegido y configurado
- [ ] Metadata schema diseñado
- [ ] Rate limits configurados
- [ ] Monitoring de costos activo
- [ ] Fallback si vector DB falla
- [ ] Cache de queries frecuentes

## Conclusión

RAG es el futuro de LLMs contextuales.

Vector databases son **la pieza clave** para RAG en producción.

Elegí bien según tu scale y presupuesto.

---

*¿Implementando RAG? Te ayudo: [Consultoría GenAI](https://mgobeaalcoba.github.io/consulting.html)*
