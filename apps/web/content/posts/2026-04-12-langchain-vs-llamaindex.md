---
slug: langchain-vs-llamaindex
date: 2025-12-14
---

LangChain y LlamaIndex son los dos frameworks más populares para construir aplicaciones con LLMs. Después de usarlos ambos en proyectos reales, acá el análisis honesto.

## LangChain

LangChain es el framework más general: cadenas, agentes, herramientas, memoria, routing. Querés orquestar LLMs con tools externas — LangChain tiene el ecosistema.

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain import hub

llm = ChatOpenAI(model="gpt-4o", temperature=0)

@tool
def search_database(query: str) -> str:
    """Search the internal database for relevant information."""
    results = db.execute(query)
    return str(results[:5])

@tool
def get_current_price(product_id: str) -> str:
    """Get the current price for a product."""
    return str(price_api.get(product_id))

tools = [search_database, get_current_price]
prompt = hub.pull("hwchase17/react")

agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = agent_executor.invoke({"input": "What is the current price of product ABC123?"})
```

**Fortalezas**:
- Ecosistema masivo de integraciones
- Agentes flexibles con tool use
- Buena documentación

**Debilidades**:
- Abstracción excesiva que dificulta debugging
- Cambios breaking frecuentes entre versiones
- Overhead para casos simples

## LlamaIndex

LlamaIndex está optimizado para RAG y búsqueda sobre documentos propios:

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

Settings.llm = OpenAI(model="gpt-4o")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# Indexar documentos
documents = SimpleDirectoryReader("./docs").load_data()
index = VectorStoreIndex.from_documents(documents)

# Query engine con RAG automático
query_engine = index.as_query_engine(
    similarity_top_k=5,
    response_mode="compact"
)

response = query_engine.query(
    "¿Cuáles son los principales riesgos mencionados en los contratos?"
)
print(response)
```

**Fortalezas**:
- RAG out-of-the-box con muy poco código
- Excelente para documentos estructurados
- Connectors para muchas fuentes (PDFs, Notion, databases)
- Más estable que LangChain

**Debilidades**:
- Menos flexible para workflows complejos de agentes
- Ecosistema más pequeño

## Cuándo usar cada uno

| Caso de uso | Recomendación |
|-------------|---------------|
| RAG sobre documentos propios | LlamaIndex |
| Agentes con múltiples herramientas | LangChain |
| Chatbot sobre knowledge base | LlamaIndex |
| Pipeline complejo de LLMs | LangChain |
| Proyecto nuevo simple | LlamaIndex |
| Integración con APIs externas | LangChain |

## La alternativa: ninguno de los dos

Para muchos casos de uso, las SDKs oficiales de OpenAI/Anthropic son suficientes y más simples:

```python
from openai import OpenAI

client = OpenAI()

def rag_simple(query: str, context: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"Context:\n{context}"},
            {"role": "user", "content": query}
        ]
    )
    return response.choices[0].message.content
```

Si tu caso de uso cabe en 20 líneas de código con la SDK directa, no necesitás un framework.

## Conclusión

- **LlamaIndex** para RAG y búsqueda en documentos
- **LangChain** para agentes y pipelines multi-herramienta
- **SDK directa** para casos simples

Evitá el hype de adoptar frameworks por defecto. Empieza simple, agregá abstracción cuando la necesites.
