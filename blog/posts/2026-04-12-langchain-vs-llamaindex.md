---
title: "LangChain vs LlamaIndex: ¿Cuál usar para tu app de GenAI?"
date: "2026-04-12"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["langchain", "llamaindex", "genai", "framework"]
excerpt: "Comparativa práctica de los dos frameworks más populares para aplicaciones GenAI. Con ejemplos de código y casos de uso reales."
featured: true
lang: "es"
---

## El Ecosistema de Frameworks GenAI

En 2024 había 50+ frameworks para GenAI. En 2026, **quedaron dos claros ganadores**:

- **LangChain**: El ecosistema completo
- **LlamaIndex**: El especialista en RAG

## LangChain: El Swiss Army Knife

### ¿Qué hace bien?

**1. Chains de múltiples pasos**
```python
from langchain.chains import LLMChain, SequentialChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

# Step 1: Analizar email
analyze_prompt = PromptTemplate(
    template="Analiza este email y extrae: {email}",
    input_variables=["email"]
)

# Step 2: Generar respuesta
respond_prompt = PromptTemplate(
    template="Genera respuesta para: {analysis}",
    input_variables=["analysis"]
)

# Chain secuencial
chain = SequentialChain(
    chains=[
        LLMChain(llm=OpenAI(), prompt=analyze_prompt),
        LLMChain(llm=OpenAI(), prompt=respond_prompt)
    ]
)

result = chain.run(email=user_email)
```

**2. Agents con Tools**
```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

tools = [
    Tool(
        name="Calculator",
        func=lambda x: eval(x),
        description="Para cálculos matemáticos"
    ),
    Tool(
        name="DatabaseQuery",
        func=query_database,
        description="Para buscar en la base de datos"
    )
]

agent = initialize_agent(tools, OpenAI(), agent="zero-shot-react-description")
agent.run("¿Cuántos usuarios activos tenemos?")
```

**3. Memory Systems**
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
chain = LLMChain(llm=OpenAI(), memory=memory)

# Mantiene contexto entre llamadas
chain.run("Mi nombre es Mariano")
chain.run("¿Cuál es mi nombre?")  # "Tu nombre es Mariano"
```

### Contras de LangChain

- ❌ **Abstracción pesada**: A veces más simple hacer directo
- ❌ **Breaking changes**: Versiones incompatibles frecuentes
- ❌ **Performance**: Overhead de abstracciones
- ❌ **Debugging difícil**: Stack traces complejos

## LlamaIndex: El Especialista RAG

### ¿Qué hace bien?

**1. Indexing Super Simple**
```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader

# Cargar documentos
documents = SimpleDirectoryReader('docs/').load_data()

# Crear index (automático)
index = VectorStoreIndex.from_documents(documents)

# Query con contexto
response = index.as_query_engine().query(
    "¿Cómo optimizar queries en BigQuery?"
)
print(response)
```

**2. Múltiples Index Types**
```python
from llama_index import (
    VectorStoreIndex,  # Similarity search
    TreeIndex,          # Tree-based retrieval
    KeywordTableIndex,  # Keyword-based
    ListIndex           # Sequential scan
)

# Elegir según caso de uso
index = TreeIndex.from_documents(docs)  # Para docs jerárquicos
```

**3. Response Synthesis Modes**
```python
# Modo 1: Compact (rápido, menos contexto)
engine = index.as_query_engine(response_mode="compact")

# Modo 2: Tree Summarize (más contexto, más lento)
engine = index.as_query_engine(response_mode="tree_summarize")

# Modo 3: Simple Concatenate
engine = index.as_query_engine(response_mode="simple_concat")
```

### Contras de LlamaIndex

- ❌ **Solo RAG**: No tiene agents, chains complejos
- ❌ **Menos flexible**: Opinado en su approach
- ❌ **Community menor**: Menos integraciones

## ¿Cuándo Usar Cada Uno?

### Usa LangChain si:
- ✅ Necesitás agents con tools
- ✅ Workflows complejos multi-step
- ✅ Memory entre conversaciones
- ✅ Integración con muchos servicios

### Usa LlamaIndex si:
- ✅ Tu caso de uso es 80% RAG
- ✅ Querés algo simple y que funcione
- ✅ Performance es crítica
- ✅ No necesitás agents complejos

### Usa Ambos (Hybrid)
```python
# LlamaIndex para RAG
from llama_index import VectorStoreIndex

index = VectorStoreIndex.from_documents(docs)
retriever = index.as_retriever()

# LangChain para agent
from langchain.agents import initialize_agent, Tool

tools = [
    Tool(
        name="KnowledgeBase",
        func=lambda q: retriever.retrieve(q),
        description="Busca en knowledge base"
    )
]

agent = initialize_agent(tools, llm)
```

## Mi Setup en Producción

Para proyectos de consultoría uso:

- **RAG puro**: LlamaIndex (más rápido de implementar)
- **Chatbots complejos**: LangChain (necesito memory + tools)
- **MVPs**: LlamaIndex siempre (time to market)

## Conclusión

**2026 Recommendation:**
- **Default choice:** LlamaIndex (80% de casos)
- **Complex cases:** LangChain
- **Best of both:** Hybrid approach

Ambos son excelentes. Elegí según tu caso de uso.

---

*¿Construyendo apps GenAI? [Hablemos](https://calendly.com/mariano-gobea-mercadolibre/30min)*
