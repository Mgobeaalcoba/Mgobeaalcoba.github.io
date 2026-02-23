---
slug: embeddings-explicados-simple
date: 2026-06-21
---

"Embeddings" es una de esas palabras que aparece en toda discusión de IA pero que pocos explican bien. Se la menciona cuando se habla de RAG, de búsqueda semántica, de LLMs, de recomendaciones. ¿Qué son exactamente? ¿Por qué son tan importantes? ¿Cómo funcionan?

Esta es la explicación que me hubiera gustado tener cuando empecé a trabajar con ellos.

## La intuición: representar el significado como números

Los computadores no entienden palabras — entienden números. Para que una computadora trabaje con texto, necesitamos convertir ese texto en números de una forma que capture el **significado**.

La representación más básica sería un diccionario: asignar a cada palabra un número único. "perro" = 1, "gato" = 2, "pelota" = 3. Pero esto no captura ningún significado — "perro" y "gato" son conceptos relacionados (ambos son mascotas), pero en esta representación son 1 y 2, tan diferentes como 1 y 1,000,000.

Los embeddings resuelven esto: en vez de un solo número, representan cada palabra (o texto) como un **vector de cientos o miles de números** de forma que textos con significados similares tienen vectores similares.

```
"perro"  → [0.23, -0.45, 0.12, 0.67, ...]  (1536 números)
"gato"   → [0.21, -0.43, 0.15, 0.64, ...]  (1536 números)  ← similar a perro
"auto"   → [-0.89, 0.34, -0.67, 0.12, ...]  (1536 números)  ← muy diferente
```

La "distancia" entre los vectores de "perro" y "gato" es pequeña. La distancia entre "perro" y "auto" es grande. Y esta distancia **captura similitud semántica**, no textual.

## La metáfora del espacio de significados

Imaginá un espacio en 3D (aunque en realidad son 1536 dimensiones — difícil de visualizar, pero el concepto aplica):

```
                    "gato" ●
                   "perro" ●
                  "mascota" ●
    
    
            "auto" ●    "bicicleta" ●
            "moto" ●    "transporte" ●
    
    
    "Python" ●   "JavaScript" ●
    "código" ●   "programación" ●
```

Los conceptos relacionados están cerca en este espacio. Los conceptos distintos están lejos. Eso es lo que hace un embedding — pone cada texto en su lugar correcto en este espacio de significados.

## La propiedad más asombrosa: aritmética de significados

Una de las primeras demostraciones de embeddings (Word2Vec, 2013) mostró algo fascinante:

```python
embedding("rey") - embedding("hombre") + embedding("mujer") ≈ embedding("reina")
embedding("París") - embedding("Francia") + embedding("Italia") ≈ embedding("Roma")
embedding("BigQuery") - embedding("Google") + embedding("Amazon") ≈ embedding("Redshift")
```

El vector de "rey" menos "hombre" captura el concepto de "realeza sin género". Agregar "mujer" lo lleva al lugar de "reina". Esto es **álgebra de conceptos**, no de palabras.

## Cómo se crean: aprendizaje no supervisado

Los embeddings modernos se crean entrenando redes neuronales gigantes sobre enormes cantidades de texto. La red aprende a predecir qué palabras tienden a aparecer juntas, en qué contextos.

Simplificado: si "perro" y "gato" aparecen frecuentemente junto a "mascota", "veterinario", "comida de mascotas", la red aprende que son conceptos similares y les asigna vectores cercanos.

Los modelos como `text-embedding-3-large` de OpenAI o `embed-v3` de Cohere hacen esto a escala, con billones de textos. El resultado son vectores que capturan una comprensión profunda del lenguaje.

## Cómo usarlos en código

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    """Genera embedding para un texto."""
    response = client.embeddings.create(
        model="text-embedding-3-small",  # 1536 dimensiones, buen balance precio/calidad
        input=text,
    )
    return response.data[0].embedding

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """Calcula similitud coseno entre dos vectores. Rango: [-1, 1]"""
    v1, v2 = np.array(vec1), np.array(vec2)
    return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))

# Ejemplo: similitud semántica
textos = [
    "Cómo optimizar queries en BigQuery",
    "Técnicas para reducir costos en BigQuery",
    "Recetas de pasta italiana",
    "Ravioles con salsa de tomate",
]

embeddings = [get_embedding(t) for t in textos]

# Similitud entre BigQuery y BigQuery
sim_bigquery = cosine_similarity(embeddings[0], embeddings[1])
print(f"BigQuery 1 vs BigQuery 2: {sim_bigquery:.3f}")  # ~0.85

# Similitud entre BigQuery y pasta
sim_diferente = cosine_similarity(embeddings[0], embeddings[2])
print(f"BigQuery vs Pasta: {sim_diferente:.3f}")  # ~0.15

# Similitud entre pasta y pasta
sim_pasta = cosine_similarity(embeddings[2], embeddings[3])
print(f"Pasta 1 vs Pasta 2: {sim_pasta:.3f}")  # ~0.82
```

## Las aplicaciones principales

### 1. Búsqueda semántica (RAG)

La aplicación más común hoy. En vez de buscar por keywords exactas, encontrás documentos por significado:

```python
documentos = [
    "Para cancelar un pedido, entrá a 'Mis compras' y seleccioná 'Cancelar'",
    "Los envíos llegan en 3-7 días hábiles según tu ubicación",
    "Podés pagar con tarjeta de crédito, débito o MercadoPago",
]

doc_embeddings = [get_embedding(doc) for doc in documentos]

def buscar(query: str, top_k: int = 2) -> list[tuple[str, float]]:
    query_emb = get_embedding(query)
    scores = [(doc, cosine_similarity(query_emb, emb)) 
               for doc, emb in zip(documentos, doc_embeddings)]
    return sorted(scores, key=lambda x: x[1], reverse=True)[:top_k]

resultados = buscar("quiero anular mi compra")
for doc, score in resultados:
    print(f"Score: {score:.3f} | {doc[:60]}...")
# Score: 0.892 | Para cancelar un pedido, entrá a 'Mis compras'...
```

La búsqueda encontró el documento correcto aunque "anular" y "cancelar" son sinónimos, no la misma palabra.

### 2. Clasificación de texto

```python
# Categorías con sus embeddings "ancla"
categorias = {
    "data-engineering": get_embedding("pipelines de datos, ETL, BigQuery, Spark, Airflow"),
    "python": get_embedding("programación Python, pandas, scripting, automatización"),
    "genai": get_embedding("inteligencia artificial generativa, LLMs, embeddings, RAG"),
}

def clasificar(texto: str) -> str:
    texto_emb = get_embedding(texto)
    scores = {cat: cosine_similarity(texto_emb, emb) for cat, emb in categorias.items()}
    return max(scores, key=scores.get)

# Test
print(clasificar("Cómo usar asyncio para acelerar pipelines"))  # "python"
print(clasificar("Optimizar costos en BigQuery con particiones"))  # "data-engineering"
print(clasificar("Construir un chatbot con LangChain y GPT-4"))  # "genai"
```

### 3. Detección de duplicados

```python
def son_similares(texto1: str, texto2: str, umbral: float = 0.90) -> bool:
    emb1 = get_embedding(texto1)
    emb2 = get_embedding(texto2)
    return cosine_similarity(emb1, emb2) >= umbral

# Detectar preguntas duplicadas en un foro
print(son_similares(
    "¿Cómo instalo Docker en Ubuntu?",
    "Pasos para instalar Docker en Linux Ubuntu"
))  # True — son duplicados

print(son_similares(
    "¿Cómo instalo Docker en Ubuntu?",
    "¿Cómo desinstalo Docker en Windows?"
))  # False — son diferentes
```

### 4. Recomendaciones

```python
# Dado un artículo, encontrar artículos similares
articulos = {
    "sql-window-functions": "SQL Window Functions: la guía definitiva",
    "bigquery-costos": "BigQuery: cómo reduje costos en 70%",
    "airflow-vs-prefect": "Airflow vs Prefect: cuál elegir",
    "dbt-intro": "dbt: la herramienta que cambió el analytics engineering",
    "streamlit-dashboards": "Streamlit: de idea a dashboard en 30 minutos",
}

articulo_embeddings = {slug: get_embedding(titulo) for slug, titulo in articulos.items()}

def recomendar(slug_actual: str, top_n: int = 3) -> list[str]:
    emb_actual = articulo_embeddings[slug_actual]
    scores = [
        (slug, cosine_similarity(emb_actual, emb))
        for slug, emb in articulo_embeddings.items()
        if slug != slug_actual
    ]
    return [slug for slug, _ in sorted(scores, key=lambda x: x[1], reverse=True)[:top_n]]

print(recomendar("bigquery-costos"))
# ['sql-window-functions', 'dbt-intro', 'airflow-vs-prefect']
# Los artículos de data engineering aparecen juntos
```

## Los modelos de embedding más usados

| Modelo | Dimensiones | Precio (aprox.) | Cuándo usar |
|--------|-------------|-----------------|-------------|
| OpenAI text-embedding-3-small | 1536 | $0.02/1M tokens | La mayoría de casos |
| OpenAI text-embedding-3-large | 3072 | $0.13/1M tokens | Máxima precisión |
| Cohere embed-v3 | 1024 | $0.10/1M tokens | Búsqueda multilingual |
| sentence-transformers (local) | 768 | Gratis (self-hosted) | Sin costo, sin dependencia externa |

## Por qué los embeddings son la tecnología clave de GenAI

Sin embeddings, los LLMs solo conocen lo que está en su contexto window (típicamente 8K-128K tokens). Con embeddings y RAG, pueden "recordar" millones de documentos — buscan semánticamente los más relevantes y los incluyen en el contexto.

Embeddings también son lo que hace posible que ChatGPT y otros modelos entiendan preguntas con sinónimos, paráfrasis, y preguntas formuladas de forma diferente a como está la respuesta en los documentos.

Son, en muchos sentidos, la infraestructura invisible que hace útil a la IA moderna.

---

La próxima vez que veas "embedding" en un artículo o en código, ya sabés exactamente qué significa: una representación numérica de significado que hace posible operar matemáticamente sobre conceptos. Simple en principio, transformador en práctica.
