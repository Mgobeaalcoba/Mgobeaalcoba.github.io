---
slug: errores-comunes-data-pipelines
date: 2026-02-15
---

Construí y rompí cientos de pipelines de datos. En MercadoLibre, donde procesamos billones de eventos por día, los errores son costosos — tanto en tiempo como en dinero. Estos son los 5 errores que veo con más frecuencia, incluyendo el código que los causa y cómo evitarlos.

## Error #1: No manejar la idempotencia

Un pipeline idempotente es aquel que podés ejecutar múltiples veces y siempre obtener el mismo resultado. La mayoría de los pipelines no son idempotentes, y eso genera duplicados cuando algo falla y se reintenta.

**El código problemático:**

```python
def cargar_datos_pedidos(fecha: str):
    df = extraer_pedidos(fecha)
    df.to_sql(
        'pedidos',
        engine,
        if_exists='append',  # ← PROBLEMA: acumula duplicados
        index=False
    )
```

Si esto falla a la mitad y lo reintentás, vas a tener los mismos datos dos veces.

**La solución — UPSERT:**

```python
def cargar_datos_pedidos_idempotente(fecha: str):
    df = extraer_pedidos(fecha)
    
    # Borrar el período que vamos a recargar
    with engine.begin() as conn:
        conn.execute(
            text("DELETE FROM pedidos WHERE fecha_pedido = :fecha"),
            {"fecha": fecha}
        )
        df.to_sql('pedidos', conn, if_exists='append', index=False)
```

O mejor aún, usar `ON CONFLICT` en PostgreSQL:

```sql
INSERT INTO pedidos (id, fecha_pedido, monto, estado)
VALUES (:id, :fecha, :monto, :estado)
ON CONFLICT (id)
DO UPDATE SET
  monto = EXCLUDED.monto,
  estado = EXCLUDED.estado,
  updated_at = NOW();
```

## Error #2: No validar el schema antes de insertar

El pipeline funciona perfectamente... hasta que la fuente de datos cambia silenciosamente y empieza a enviar campos con tipos diferentes, campos nuevos o campos que desaparecen.

**El código que no valida:**

```python
def procesar_eventos(raw_data: list[dict]):
    df = pd.DataFrame(raw_data)
    df.to_sql('eventos', engine, if_exists='append')
    # Oops: si 'monto' viene como string en lugar de float, falló silenciosamente
```

**Con validación usando Pydantic:**

```python
from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class Evento(BaseModel):
    event_id: str
    user_id: int
    monto: float
    timestamp: datetime
    tipo: str
    metadata: Optional[dict] = None
    
    @validator('monto')
    def monto_positivo(cls, v):
        if v < 0:
            raise ValueError(f'Monto negativo: {v}')
        return v
    
    @validator('tipo')
    def tipo_valido(cls, v):
        tipos_validos = {'compra', 'venta', 'devolucion', 'ajuste'}
        if v not in tipos_validos:
            raise ValueError(f'Tipo inválido: {v}. Debe ser uno de {tipos_validos}')
        return v

def procesar_eventos_validados(raw_data: list[dict]):
    eventos_validos = []
    errores = []
    
    for item in raw_data:
        try:
            evento = Evento(**item)
            eventos_validos.append(evento.dict())
        except Exception as e:
            errores.append({"data": item, "error": str(e)})
    
    if errores:
        # Log errores pero no fallar todo el pipeline
        logger.warning(f"{len(errores)} eventos inválidos. Ejemplos: {errores[:3]}")
        # Guardar errores para análisis posterior
        guardar_errores(errores)
    
    if eventos_validos:
        pd.DataFrame(eventos_validos).to_sql(
            'eventos', engine, if_exists='append', index=False
        )
    
    return {"procesados": len(eventos_validos), "errores": len(errores)}
```

## Error #3: Procesar todo en memoria

El error más clásico: funciona en desarrollo con 10K registros, explota en producción con 100M.

**El código que revienta la RAM:**

```python
def calcular_metricas_vendedores():
    # Carga TODO en memoria
    df = pd.read_sql("SELECT * FROM ordenes WHERE año = 2025", engine)
    # df tiene 500M filas y 40 columnas → crash
    metricas = df.groupby('vendedor_id').agg({
        'monto': 'sum',
        'comprador_id': 'nunique',
    })
    return metricas
```

**Con procesamiento en chunks:**

```python
def calcular_metricas_vendedores_optimizado():
    resultados_parciales = []
    chunk_size = 100_000
    
    query = """
        SELECT vendedor_id, monto, comprador_id
        FROM ordenes 
        WHERE año = 2025
        ORDER BY vendedor_id  -- importante para que chunks del mismo vendedor queden juntos
    """
    
    for chunk in pd.read_sql(query, engine, chunksize=chunk_size):
        parcial = chunk.groupby('vendedor_id').agg({
            'monto': 'sum',
            'comprador_id': 'nunique',
        }).reset_index()
        resultados_parciales.append(parcial)
    
    # Consolidar resultados parciales
    df_final = pd.concat(resultados_parciales)
    resultado = df_final.groupby('vendedor_id').agg({
        'monto': 'sum',
        'comprador_id': 'sum',  # Atención: nunique no es aditivo, esto es aproximación
    })
    
    return resultado
```

Para el caso de `nunique`, la aproximación anterior no es exacta. La solución correcta es delegar a la base de datos:

```sql
SELECT 
    vendedor_id,
    SUM(monto) as total_monto,
    COUNT(DISTINCT comprador_id) as compradores_unicos
FROM ordenes
WHERE año = 2025
GROUP BY vendedor_id;
```

## Error #4: No tener observabilidad

El pipeline falla a las 3am. No tenés logs claros, no tenés alertas, no sabés qué falló ni en qué punto. A las 9am el equipo de negocio pregunta por los datos y vos estás adivinando.

**Logging básico pero efectivo:**

```python
import logging
import time
from functools import wraps
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def con_metricas(nombre_paso: str):
    """Decorator que loguea duración, registros procesados y errores."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            inicio = time.time()
            logger.info(f"[INICIO] {nombre_paso}")
            
            try:
                resultado = func(*args, **kwargs)
                duracion = time.time() - inicio
                
                if isinstance(resultado, dict) and 'procesados' in resultado:
                    logger.info(
                        f"[FIN] {nombre_paso} | "
                        f"Duración: {duracion:.1f}s | "
                        f"Procesados: {resultado['procesados']:,} | "
                        f"Errores: {resultado.get('errores', 0):,}"
                    )
                else:
                    logger.info(f"[FIN] {nombre_paso} | Duración: {duracion:.1f}s")
                
                return resultado
            except Exception as e:
                duracion = time.time() - inicio
                logger.error(
                    f"[ERROR] {nombre_paso} | "
                    f"Duración hasta el error: {duracion:.1f}s | "
                    f"Error: {str(e)}",
                    exc_info=True
                )
                raise
        return wrapper
    return decorator

# Uso
@con_metricas("Extracción de órdenes")
def extraer_ordenes(fecha: str) -> dict:
    # ...
    return {"procesados": len(df), "errores": 0}
```

## Error #5: Timeouts y dependencias externas sin retry

APIs externas se caen. La red falla. La base de datos tiene picos de carga. Sin estrategia de retry, tu pipeline falla por problemas transitorios que habrían desaparecido solos en segundos.

**Sin retry:**

```python
def fetch_datos_api(endpoint: str) -> dict:
    response = requests.get(endpoint)
    response.raise_for_status()
    return response.json()
    # Un timeout de 1 segundo falla todo el pipeline
```

**Con retry exponencial:**

```python
import time
import random
from typing import TypeVar, Callable

T = TypeVar('T')

def con_retry(
    max_intentos: int = 3,
    delay_inicial: float = 1.0,
    backoff: float = 2.0,
    jitter: bool = True,
    excepciones_retriables: tuple = (requests.Timeout, requests.ConnectionError),
):
    """
    Decorator de retry con backoff exponencial y jitter.
    jitter=True agrega aleatoriedad para evitar thundering herd.
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            delay = delay_inicial
            
            for intento in range(1, max_intentos + 1):
                try:
                    return func(*args, **kwargs)
                except excepciones_retriables as e:
                    if intento == max_intentos:
                        logger.error(f"Falló después de {max_intentos} intentos: {e}")
                        raise
                    
                    wait = delay + (random.uniform(0, 1) if jitter else 0)
                    logger.warning(
                        f"Intento {intento}/{max_intentos} falló: {e}. "
                        f"Reintentando en {wait:.1f}s..."
                    )
                    time.sleep(wait)
                    delay *= backoff
        return wrapper
    return decorator

# Uso
@con_retry(max_intentos=3, delay_inicial=1.0, backoff=2.0)
def fetch_datos_api(endpoint: str) -> dict:
    response = requests.get(endpoint, timeout=10)
    response.raise_for_status()
    return response.json()
```

## Resumen: el checklist de un pipeline robusto

Antes de llevar un pipeline a producción, verificá:

- [ ] **Idempotente**: ¿Podés ejecutarlo dos veces sin duplicar datos?
- [ ] **Validación de schema**: ¿Qué pasa si el input cambia?
- [ ] **Procesamiento en chunks**: ¿Funciona con 100x el volumen de desarrollo?
- [ ] **Observabilidad**: ¿Tenés logs claros de inicio, fin y errores?
- [ ] **Retry**: ¿Manejás fallos transitorios de APIs y bases de datos?
- [ ] **Alertas**: ¿Alguien se entera si el pipeline falla a las 3am?
- [ ] **Documentación**: ¿Alguien más puede mantenerlo?

Estos errores no son de principiantes — los cometí yo mismo y los vi cometer a ingenieros experimentados bajo presión de tiempo. La diferencia entre un pipeline de producción y uno de juguete está en estos detalles.
