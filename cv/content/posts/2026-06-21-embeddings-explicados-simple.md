---
slug: embeddings-explicados-simple
date: 2026-06-21
---

Los embeddings son la tecnología detrás de la búsqueda semántica, los sistemas RAG, y gran parte de las aplicaciones modernas de IA. La mayoría de las explicaciones son demasiado matemáticas o demasiado superficiales. Acá la versión práctica que necesitás entender para usarlos.

## La intuición básica

Un embedding es una representación numérica de texto (o imágenes, audio) que captura su significado.

```
"Perro" → [0.12, -0.34, 0.89, 0.45, -0.67, ...]  (1536 números)
"Can"   → [0.11, -0.32, 0.91, 0.43, -0.65, ...]  (muy similar)
"Auto"  → [0.78, 0.23, -0.45, -0.12, 0.34, ...]  (muy diferente)
```

Textos con significado similar tienen embeddings similares (vectores cercanos en el espacio).

## ¿Por qué esto importa?

Con embeddings podés:
- Encontrar documentos semánticamente similares a una query
- Detectar duplicados aunque estén escritos diferente
- Clasificar texto sin entrenamiento explícito
- Recomendar contenido relacionado

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Demostración
emb_perro = get_embedding("El perro ladra")
emb_can = get_embedding("El can ladra")
emb_auto = get_embedding("El automóvil acelera")

print(cosine_similarity(emb_perro, emb_can))   # ~0.95 (muy similares)
print(cosine_similarity(emb_perro, emb_auto))   # ~0.45 (muy diferentes)
```

## Cómo se generan los embeddings

Los embeddings vienen de modelos de lenguaje grandes entrenados para mapear texto a vectores. Los más usados:

| Modelo | Dimensiones | Costo | Calidad |
|--------|------------|-------|---------|
| text-embedding-3-small | 1536 | $0.02/1M tokens | Buena |
| text-embedding-3-large | 3072 | $0.13/1M tokens | Excelente |
| text-embedding-ada-002 | 1536 | $0.10/1M tokens | Buena (legacy) |
| sentence-transformers | 768 | Gratis (local) | Buena |

## Caso de uso 1: Búsqueda semántica en documentos

```python
from openai import OpenAI
import numpy as np
import json

client = OpenAI()

class SemanticSearchEngine:
    def __init__(self):
        self.documents = []
        self.embeddings = []
    
    def add_documents(self, docs: list[str]):
        """Indexa documentos calculando sus embeddings."""
        batch_size = 100
        for i in range(0, len(docs), batch_size):
            batch = docs[i:i+batch_size]
            response = client.embeddings.create(
                input=batch,
                model="text-embedding-3-small"
            )
            self.documents.extend(batch)
            self.embeddings.extend([e.embedding for e in response.data])
    
    def search(self, query: str, top_k: int = 5) -> list[tuple[str, float]]:
        """Busca los documentos más similares a la query."""
        query_emb = client.embeddings.create(
            input=query,
            model="text-embedding-3-small"
        ).data[0].embedding
        
        query_arr = np.array(query_emb)
        doc_matrix = np.array(self.embeddings)
        
        # Cosine similarity vectorizado
        similarities = np.dot(doc_matrix, query_arr) / (
            np.linalg.norm(doc_matrix, axis=1) * np.linalg.norm(query_arr)
        )
        
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        return [(self.documents[i], float(similarities[i])) for i in top_indices]

# Uso
engine = SemanticSearchEngine()
engine.add_documents([
    "Como optimizar queries en BigQuery",
    "Técnicas de machine learning para clasificación",
    "Mejores prácticas de Python para data engineering",
    "Cómo implementar RAG con LangChain",
    "Docker para data scientists",
])

results = engine.search("cómo mejorar performance de SQL")
for doc, score in results:
    print(f"{score:.3f} | {doc}")
# 0.847 | Como optimizar queries en BigQuery
# 0.623 | Mejores prácticas de Python para data engineering
```

## Caso de uso 2: Deduplicación de datos

```python
def find_near_duplicates(
    records: list[dict],
    text_field: str,
    threshold: float = 0.95
) -> list[tuple[int, int, float]]:
    """Encuentra registros semánticamente duplicados."""
    
    texts = [r[text_field] for r in records]
    embeddings = [get_embedding(t) for t in texts]
    emb_matrix = np.array(embeddings)
    
    duplicates = []
    
    for i in range(len(embeddings)):
        for j in range(i+1, len(embeddings)):
            sim = cosine_similarity(embeddings[i], embeddings[j])
            if sim >= threshold:
                duplicates.append((i, j, sim))
    
    return duplicates

# Encontrar productos duplicados en un catálogo
products = [
    {"id": 1, "name": "iPhone 15 Pro 256GB Negro"},
    {"id": 2, "name": "Apple iPhone 15 Pro 256 GB color negro"},
    {"id": 3, "name": "Samsung Galaxy S24"},
]

dupes = find_near_duplicates(products, "name", threshold=0.90)
for i, j, sim in dupes:
    print(f"Posible duplicado ({sim:.2%}): {products[i]['name']} == {products[j]['name']}")
# Posible duplicado (96.3%): iPhone 15 Pro 256GB Negro == Apple iPhone 15 Pro 256 GB color negro
```

## Caso de uso 3: Clasificación zero-shot

```python
def classify_zero_shot(
    text: str,
    categories: list[str]
) -> str:
    """Clasifica texto en categorías sin entrenamiento explícito."""
    
    text_emb = get_embedding(text)
    cat_embs = [get_embedding(cat) for cat in categories]
    
    similarities = [cosine_similarity(text_emb, cat_emb) for cat_emb in cat_embs]
    best_idx = np.argmax(similarities)
    
    return categories[best_idx]

# Clasificar tickets de soporte sin modelo entrenado
categories = ["problema de entrega", "falla técnica", "facturación incorrecta", "solicitud de información"]

ticket = "El package llegó roto, la caja estaba golpeada"
print(classify_zero_shot(ticket, categories))  # "problema de entrega"
```

## Caching de embeddings

Los embeddings son deterministas: el mismo texto siempre produce el mismo embedding. Cachearlos ahorra costo y latencia:

```python
import hashlib
import json
import redis

redis_client = redis.Redis()

def get_embedding_cached(text: str) -> list[float]:
    cache_key = f"emb:{hashlib.sha256(text.encode()).hexdigest()}"
    
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    embedding = get_embedding(text)
    redis_client.setex(cache_key, 86400 * 30, json.dumps(embedding))  # 30 días
    
    return embedding
```

Los embeddings son una de las herramientas más versátiles de la IA moderna. Una vez que los entendés, los ves en todas partes: búsqueda, recomendación, clasificación, deduplicación. La barrera de entrada es baja — con la API de OpenAI podés tener un sistema de búsqueda semántica funcionando en menos de 50 líneas de Python.
