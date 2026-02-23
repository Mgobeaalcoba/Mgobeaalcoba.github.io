---
slug: langchain-vs-llamaindex
date: 2026-04-12
---

Si estás construyendo una aplicación de IA con LLMs, en algún momento llegás a la pregunta: ¿LangChain o LlamaIndex? Los dos frameworks son populares, bien documentados, y resuelven problemas similares. Pero tienen filosofías diferentes.

En este artículo te cuento cuándo usar cada uno, basado en proyectos reales.

## El punto de partida: ¿para qué sirve cada uno?

**LangChain** nació como un framework para construir **cadenas de razonamiento** (chains) con LLMs. Su fuerza está en orquestar secuencias complejas de pasos: llamar al LLM, parsear el output, decidir qué herramienta usar, llamar otra vez, etc. Es el framework para aplicaciones de **agentes y workflows complejos**.

**LlamaIndex** (antes llamado GPT Index) nació con un foco diferente: hacer fácil **indexar y recuperar** información de documentos para RAG. Si tenés documentos y querés que el LLM los "lea", LlamaIndex es el experto en la parte de retrieval.

Dicho eso, los dos han convergido bastante. LangChain tiene buenas capacidades de RAG. LlamaIndex tiene agentes. La distinción sigue siendo útil para guiar la elección inicial.

## LangChain: fortalezas

### Chains y Agents

LangChain brilla cuando tu aplicación necesita tomar decisiones basadas en outputs de pasos anteriores:

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableParallel

llm = ChatOpenAI(model="gpt-4o")

# Chain simple
prompt = ChatPromptTemplate.from_messages([
    ("system", "Sos un experto en finanzas."),
    ("human", "{pregunta}")
])

chain = prompt | llm | StrOutputParser()
respuesta = chain.invoke({"pregunta": "¿Qué es el ROI?"})
```

**Agents con herramientas:**

```python
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain.tools import Tool
import requests

def buscar_cotizacion(simbolo: str) -> str:
    """Busca la cotización de una acción o divisa."""
    # Simulado
    cotizaciones = {"BTC": "$65,000", "ETH": "$3,200", "DOLAR": "$1,200"}
    return cotizaciones.get(simbolo.upper(), "No encontrado")

def calcular_conversion(expresion: str) -> str:
    """Calcula una conversión de moneda. Input: 'X USD a ARS'."""
    # Simulado
    return "1 USD = 1,250 ARS"

herramientas = [
    Tool(name="buscar_cotizacion", func=buscar_cotizacion,
         description="Busca cotizaciones de criptos o divisas. Input: símbolo como BTC, ETH, DOLAR"),
    Tool(name="calcular_conversion", func=calcular_conversion,
         description="Convierte montos entre monedas"),
]

agent = create_openai_functions_agent(llm, herramientas, prompt)
executor = AgentExecutor(agent=agent, tools=herramientas, verbose=True)

resultado = executor.invoke({
    "input": "¿Cuánto equivalen 500 dólares en pesos argentinos hoy?"
})
```

El agente decide solo cuándo usar qué herramienta y combina los resultados.

### LCEL (LangChain Expression Language)

La API moderna de LangChain usa pipes (`|`) para componer chains:

```python
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel

class AnalisisSentimiento(BaseModel):
    sentimiento: str  # positivo, negativo, neutro
    confianza: float  # 0-1
    justificacion: str

parser = PydanticOutputParser(pydantic_object=AnalisisSentimiento)

chain = (
    ChatPromptTemplate.from_template(
        "Analizá el sentimiento del siguiente texto:\n{texto}\n\n{format_instructions}"
    )
    | llm
    | parser
)

resultado = chain.invoke({
    "texto": "El producto llegó tarde y estaba roto. Pésimo servicio.",
    "format_instructions": parser.get_format_instructions()
})

print(resultado.sentimiento)  # "negativo"
print(resultado.confianza)    # 0.95
```

## LlamaIndex: fortalezas

### Indexación y RAG

LlamaIndex simplifica enormemente el proceso de ingestar documentos y hacer retrieval:

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

# Configurar LLM y embeddings globalmente
Settings.llm = OpenAI(model="gpt-4o")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# Cargar documentos desde una carpeta
documentos = SimpleDirectoryReader("./documentos").load_data()

# Indexar (genera embeddings automáticamente)
index = VectorStoreIndex.from_documents(documentos)

# Crear motor de consulta
query_engine = index.as_query_engine(similarity_top_k=5)

# Consultar
respuesta = query_engine.query("¿Cuáles son las condiciones de la garantía?")
print(respuesta.response)
print(respuesta.source_nodes)  # ← los fragmentos usados como contexto
```

### Múltiples estrategias de retrieval

LlamaIndex tiene soporte built-in para estrategias avanzadas:

```python
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor, KeywordNodePostprocessor

# Retriever con filtros
retriever = VectorIndexRetriever(
    index=index,
    similarity_top_k=10,
)

# Post-procesamiento: filtrar por score mínimo y keywords
postprocessors = [
    SimilarityPostprocessor(similarity_cutoff=0.7),
    KeywordNodePostprocessor(required_keywords=["garantía", "warranty"]),
]

query_engine = RetrieverQueryEngine(
    retriever=retriever,
    node_postprocessors=postprocessors,
)
```

### Indexación de múltiples fuentes

```python
from llama_index.core import SQLDatabase, VectorStoreIndex
from llama_index.readers.web import SimpleWebPageReader
from llama_index.readers.database import DatabaseReader

# Mezclar web + base de datos + archivos
web_docs = SimpleWebPageReader(html_to_text=True).load_data([
    "https://empresa.com/faqs",
    "https://empresa.com/condiciones",
])

db_docs = DatabaseReader(engine=mi_engine).load_data(
    query="SELECT pregunta, respuesta FROM faqs WHERE activo = true"
)

archivo_docs = SimpleDirectoryReader("./manuales").load_data()

todos = web_docs + db_docs + archivo_docs
index = VectorStoreIndex.from_documents(todos)
```

## Comparativa directa

| Criterio | LangChain | LlamaIndex |
|----------|-----------|------------|
| RAG básico | Bueno | Excelente |
| Agentes con herramientas | Excelente | Bueno |
| Multi-step reasoning | Excelente | Bueno |
| Indexación de documentos | Bueno | Excelente |
| Curva de aprendizaje | Alta (muchos conceptos) | Media |
| Ecosistema de integraciones | Enorme | Grande |
| Observabilidad (LangSmith) | Excelente | Bueno |

## Mi recomendación

**Usá LlamaIndex cuando:**
- El core de tu app es RAG sobre documentos
- Necesitás estrategias avanzadas de retrieval (hybrid search, reranking, query routing)
- Querés algo que "funcione" rápido con menos boilerplate

**Usá LangChain cuando:**
- Necesitás agentes que usen herramientas dinámicamente
- Tenés workflows multi-step complejos con lógica condicional
- Querés LangSmith para observabilidad y debugging de traces
- El equipo ya lo conoce

**Los dos juntos:** No son excluyentes. Podés usar LlamaIndex para la capa de retrieval y LangChain para la orquestación del agente. De hecho, LangChain tiene integración con LlamaIndex como retriever.

## El error que veo más seguido

Elegir el framework antes de entender el problema. Primero definí:
1. ¿Necesitás que el sistema tome decisiones autónomas? → Agentes → LangChain
2. ¿Necesitás que el sistema busque en documentos? → RAG → LlamaIndex
3. ¿Necesitás las dos cosas? → Probablemente los dos, o LangChain con buenos retrievers

---

En 2026, ambos frameworks siguen evolucionando rápido. Revisá la documentación oficial antes de cualquier decisión final — las APIs cambian frecuentemente.
