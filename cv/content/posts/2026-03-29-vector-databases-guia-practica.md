---
slug: vector-databases-guia-practica
date: 2026-03-29
---

Las bases de datos vectoriales son la infraestructura clave para sistemas RAG (Retrieval-Augmented Generation). Evaluamos Pinecone, Weaviate, Qdrant y pgvector en producción. Acá el análisis.

## ¿Qué es una base de datos vectorial?

Una vector database almacena embeddings (representaciones numéricas de texto, imágenes, audio) y permite buscar por similitud semántica en lugar de igualdad exacta.

```python
# Ejemplo conceptual
query = "cómo optimizo queries en BigQuery"
query_embedding = embed(query)  # [0.12, -0.34, 0.89, ...]

# Busca los documentos semánticamente más similares
results = vector_db.search(query_embedding, top_k=5)
# Devuelve documentos sobre BigQuery, SQL optimization, etc.
```

## pgvector: empezar simple

Si ya usás PostgreSQL, pgvector es el punto de partida natural:

```sql
-- Instalar extensión
CREATE EXTENSION vector;

-- Tabla con embeddings
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536),  -- OpenAI ada-002 dimension
  metadata JSONB
);

-- Índice para búsqueda aproximada
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Búsqueda por similitud
SELECT content, 1 - (embedding <=> $1::vector) as similarity
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

**Cuándo usar pgvector**: < 1M vectores, ya tenés PostgreSQL, no querés infraestructura adicional.

## Pinecone: managed sin fricción

```python
import pinecone
from openai import OpenAI

pinecone.init(api_key="...", environment="us-east-1-aws")
index = pinecone.Index("my-index")
openai_client = OpenAI()

def upsert_document(doc_id: str, text: str, metadata: dict):
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-ada-002"
    )
    embedding = response.data[0].embedding
    
    index.upsert(vectors=[(doc_id, embedding, metadata)])

def search(query: str, top_k: int = 5, filter: dict = None) -> list:
    response = openai_client.embeddings.create(
        input=query,
        model="text-embedding-ada-002"
    )
    query_embedding = response.data[0].embedding
    
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        filter=filter,
        include_metadata=True
    )
    
    return results.matches
```

**Cuándo usar Pinecone**: > 1M vectores, querés managed service, latencia < 50ms es crítica.

## Qdrant: open source y self-hosted

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(host="localhost", port=6333)

client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=1,
            vector=embedding,
            payload={"content": text, "source": "blog"}
        )
    ]
)

results = client.search(
    collection_name="documents",
    query_vector=query_embedding,
    limit=5,
    query_filter=Filter(must=[FieldCondition(key="source", match=MatchValue(value="blog"))])
)
```

**Cuándo usar Qdrant**: Open source, self-hosted, necesitás filtros complejos, costo es factor crítico.

## Comparación

| Criterio | pgvector | Pinecone | Qdrant |
|----------|----------|----------|--------|
| Setup | Trivial | Trivial | Medio |
| Escala | < 1M | Ilimitado | > 10M |
| Latencia | 10-50ms | < 10ms | 5-20ms |
| Costo | Bajo | Alto | Muy bajo |
| Filtros | SQL completo | Limitado | Avanzado |
| Managed | Via RDS | Sí | Sí (cloud) |

## Recomendación

1. **Empieza con pgvector** si ya tenés PostgreSQL y tu dataset es < 500K documentos
2. **Migra a Qdrant** cuando necesites más de 1M vectores y self-hosted
3. **Usa Pinecone** si el presupuesto no es problema y querés cero operaciones
