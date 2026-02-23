---
slug: vector-databases-guia-practica
date: 2026-03-29
---

Si estás implementando RAG (Retrieval Augmented Generation), tarde o temprano tenés que elegir una base de datos vectorial. Pinecone, Weaviate, Milvus, Qdrant, Chroma, pgvector... la cantidad de opciones es abrumadora.

Esta guía te da el conocimiento mínimo para entender qué son, cómo funcionan, y cuándo usar cada opción.

## ¿Qué es una base de datos vectorial?

Una base de datos vectorial almacena **embeddings** — representaciones numéricas de texto, imágenes, o cualquier dato — como vectores de alta dimensión (típicamente 768, 1536, o 3072 dimensiones).

La operación fundamental es la **búsqueda de similitud**: dado un vector de consulta, encontrá los N vectores más similares en la base de datos.

```python
# Concepto simplificado
query = "¿Cuál es la política de devoluciones?"
query_embedding = embed(query)  # [0.23, -0.45, 0.12, ...]  ← 1536 números

# La base vectorial encuentra los documentos más "parecidos" semánticamente
documentos_relevantes = vector_db.search(
    query_vector=query_embedding,
    top_k=5
)
```

La magia es que "similitud" es **semántica**, no textual. "Cómo hago una devolución" y "quiero retornar un producto" encontrarán los mismos documentos aunque no compartan palabras.

## Cómo funciona el índice vectorial

Las bases vectoriales usan algoritmos de Approximate Nearest Neighbor (ANN) para hacer búsquedas eficientes en millones de vectores:

- **HNSW** (Hierarchical Navigable Small World): El más común, excelente balance velocidad/precisión
- **IVF** (Inverted File): Agrupa vectores en clusters, más eficiente para datasets gigantes
- **LSH** (Locality Sensitive Hashing): Más rápido pero menos preciso

La diferencia clave con una búsqueda exacta: ANN sacrifica algo de precisión (puede no encontrar el MEJOR resultado, pero sí uno muy bueno) a cambio de velocidad.

## El pipeline RAG completo

```python
from openai import OpenAI
import pinecone
from typing import list

client = OpenAI()

def crear_embedding(texto: str) -> list[float]:
    """Convierte texto en vector usando OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texto
    )
    return response.data[0].embedding

def indexar_documentos(documentos: list[str], index):
    """Indexa documentos en Pinecone."""
    for i, doc in enumerate(documentos):
        embedding = crear_embedding(doc)
        index.upsert(vectors=[{
            "id": f"doc-{i}",
            "values": embedding,
            "metadata": {"texto": doc}
        }])

def buscar_contexto(query: str, index, top_k: int = 5) -> list[str]:
    """Busca documentos relevantes para la query."""
    query_embedding = crear_embedding(query)
    resultados = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return [r.metadata["texto"] for r in resultados.matches]

def responder_con_rag(query: str, index) -> str:
    """RAG completo: recuperar contexto + generar respuesta."""
    contextos = buscar_contexto(query, index)
    contexto_unido = "\n\n".join(contextos)
    
    respuesta = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"""Respondé la pregunta basándote SOLO en el siguiente contexto.
Si la información no está en el contexto, decilo claramente.

CONTEXTO:
{contexto_unido}"""
            },
            {"role": "user", "content": query}
        ]
    )
    
    return respuesta.choices[0].message.content
```

## Comparativa: Pinecone vs Weaviate vs Qdrant vs pgvector

### Pinecone

**Pros:**
- Setup en 5 minutos, sin infraestructura que manejar
- Performance excelente para millones de vectores
- SDK limpio y bien documentado
- Filtrado por metadata out-of-the-box

**Contras:**
- Vendor lock-in total (SaaS only)
- Costo alto a escala (puede superar $1000/mes fácilmente)
- Sin control sobre la infraestructura

```python
from pinecone import Pinecone

pc = Pinecone(api_key="tu-api-key")
index = pc.Index("mi-indice")

# Insertar
index.upsert(vectors=[{
    "id": "vec1",
    "values": [0.1, 0.2, 0.3, ...],  # 1536 dimensiones
    "metadata": {"fuente": "doc1", "seccion": "intro"}
}])

# Buscar con filtro
resultados = index.query(
    vector=[0.1, 0.2, ...],
    top_k=10,
    filter={"fuente": {"$eq": "doc1"}},  # Solo documentos de "doc1"
    include_metadata=True
)
```

**Cuándo usar Pinecone**: Prototipado rápido, startup sin equipo de infraestructura, cuando el costo no es un bloqueante.

### Weaviate

**Pros:**
- Open source + managed cloud
- Módulos built-in para vectorización (conecta directo con OpenAI, Cohere, etc.)
- GraphQL API poderosa
- Búsqueda híbrida (vectorial + keyword) out-of-the-box

**Contras:**
- Curva de aprendizaje más alta
- El schema es más complejo de definir

```python
import weaviate
from weaviate.classes.init import Auth

client = weaviate.connect_to_weaviate_cloud(
    cluster_url="tu-cluster.weaviate.network",
    auth_credentials=Auth.api_key("tu-api-key"),
    headers={"X-OpenAI-Api-Key": "tu-openai-key"},
)

# Weaviate puede vectorizar automáticamente
collection = client.collections.get("Documento")
collection.data.insert({
    "titulo": "Política de devoluciones",
    "contenido": "Los productos pueden devolverse en 30 días...",
})

# Búsqueda semántica
resultados = collection.query.near_text(
    query="cómo hago una devolución",
    limit=5
)
```

**Cuándo usar Weaviate**: Cuando necesitás búsqueda híbrida, cuando querés vectorización automática integrada.

### Qdrant

**Pros:**
- Open source, escrito en Rust (muy rápido)
- Excelente para on-premise / self-hosted
- Filtrado avanzado con payload
- Docker compose en 2 minutos

**Contras:**
- Menor ecosistema que Pinecone/Weaviate

```bash
# Levantar Qdrant localmente
docker run -p 6333:6333 qdrant/qdrant
```

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(host="localhost", port=6333)

# Crear colección
client.create_collection(
    collection_name="documentos",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# Insertar
client.upsert(
    collection_name="documentos",
    points=[
        PointStruct(
            id=1,
            vector=[0.1, 0.2, ...],
            payload={"texto": "...", "fuente": "manual"}
        )
    ]
)

# Buscar
resultados = client.search(
    collection_name="documentos",
    query_vector=[0.1, 0.2, ...],
    limit=5
)
```

**Cuándo usar Qdrant**: Self-hosted, performance crítica, cuando querés control total.

### pgvector (extensión de PostgreSQL)

**Pros:**
- Ya tenés Postgres → zero infraestructura adicional
- SQL que ya conocés
- Transacciones ACID
- Gratis si ya pagás por Postgres

**Contras:**
- Performance menor que soluciones dedicadas a millones de vectores
- Índices HNSW requieren ajuste fino

```sql
-- Habilitar extensión
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla con columna vectorial
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    texto TEXT,
    fuente VARCHAR(100),
    embedding vector(1536)
);

-- Índice HNSW para búsqueda eficiente
CREATE INDEX ON documentos USING hnsw (embedding vector_cosine_ops);

-- Insertar (desde Python)
-- INSERT INTO documentos (texto, fuente, embedding)
-- VALUES ('Política de devoluciones...', 'manual', '[0.1, 0.2, ...]')

-- Búsqueda de similitud coseno
SELECT texto, fuente, 1 - (embedding <=> '[0.1, 0.2, ...]') as similitud
FROM documentos
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;
```

**Cuándo usar pgvector**: Dataset pequeño (<1M vectores), ya usás PostgreSQL, simplicidad operacional es prioridad.

## Cómo elegir

| Criterio | Recomendación |
|----------|--------------|
| Prototipo rápido | Pinecone o Chroma (local) |
| Producción, equipo chico, sin infra | Pinecone o Weaviate Cloud |
| Self-hosted, performance | Qdrant o Weaviate |
| Ya tenés Postgres, <1M vectores | pgvector |
| Búsqueda híbrida (vectorial + keyword) | Weaviate |

## Métricas de similitud: qué elegir

Las bases vectoriales ofrecen distintas métricas de distancia:

- **Cosine similarity**: Para texto y embeddings de lenguaje. Mide el ángulo entre vectores, no su magnitud. **La más común para RAG.**
- **Dot product**: Similar a coseno pero magnitud importa. Bueno para embeddings normalizados.
- **Euclidean (L2)**: Para cuando la distancia absoluta importa (imágenes, coordenadas geográficas).

Para RAG con OpenAI embeddings, siempre usá **cosine similarity**.

---

Una base vectorial no es magia — es la capa que hace posible que un LLM "recuerde" miles de documentos sin tenerlos en el context window. Una vez que entendés el concepto, la diferencia entre Pinecone y Qdrant es más de operaciones que de fundamentos.
