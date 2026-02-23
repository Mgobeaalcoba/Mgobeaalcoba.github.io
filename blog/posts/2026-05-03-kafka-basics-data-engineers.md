---
slug: kafka-basics-data-engineers
date: 2026-05-03
---

Kafka aparece en casi todas las arquitecturas de datos a escala. Pero la curva de aprendizaje puede sentirse innecesariamente alta, llena de terminología y conceptos que asustan. En este artículo te cuento lo esencial — lo que un data engineer realmente necesita saber para trabajar con Kafka día a día.

## La idea central (en dos oraciones)

Kafka es una cola de mensajes distribuida y persistente. Los productores escriben mensajes a Kafka, los consumidores los leen a su ritmo, y Kafka los guarda hasta que expiren (por tiempo o espacio).

La diferencia con una queue tradicional (RabbitMQ, SQS): los mensajes **no se borran cuando se consumen**. Kafka los guarda y múltiples consumidores independientes pueden leer el mismo mensaje en distintos momentos.

## Conceptos que tenés que manejar

### Topics y Particiones

Un **topic** es como una tabla: tiene un nombre y guarda mensajes de un tipo. Ej: `pedidos-creados`, `usuarios-registrados`, `clicks-web`.

Cada topic se divide en **particiones** — fragmentos independientes que pueden estar en distintos servidores. Las particiones son la clave del paralelismo de Kafka.

```
Topic: pedidos-creados
├── Partición 0: [msg1, msg2, msg5, msg8, ...]
├── Partición 1: [msg3, msg6, msg9, ...]
└── Partición 2: [msg4, msg7, msg10, ...]
```

Los mensajes dentro de una partición tienen un **offset** (número de secuencia) y siempre se leen en orden.

### Productores y Consumidores

```python
# Producer — enviar mensajes a Kafka
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    key_serializer=lambda k: k.encode('utf-8') if k else None,
)

# Enviar un pedido
pedido = {
    "id": "ORD-12345",
    "seller_id": 42,
    "monto": 2500.00,
    "estado": "creado",
    "timestamp": "2026-05-03T10:30:00Z"
}

future = producer.send(
    topic='pedidos-creados',
    key=str(pedido["seller_id"]),  # Mismos seller_id → misma partición
    value=pedido,
)

# Esperar confirmación
record_metadata = future.get(timeout=10)
print(f"Offset: {record_metadata.offset}, Partición: {record_metadata.partition}")

producer.flush()  # Enviar mensajes pendientes
```

```python
# Consumer — leer mensajes de Kafka
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'pedidos-creados',
    bootstrap_servers=['localhost:9092'],
    group_id='notificaciones-service',  # Consumer group
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',  # Leer desde el principio si es primera vez
)

for mensaje in consumer:
    pedido = mensaje.value
    print(f"Nuevo pedido: {pedido['id']} de vendedor {pedido['seller_id']}")
    
    # Procesar el pedido
    enviar_notificacion(pedido)
    
    # El offset se commitea automáticamente por defecto
    # Podés hacerlo manual para control más fino
```

### Consumer Groups: el concepto más importante

Cuando múltiples instancias de tu servicio consumen el mismo topic, se agrupan en un **consumer group**. Kafka asigna particiones a los consumidores del grupo para que cada mensaje sea procesado por UN solo consumidor del grupo.

```
Topic con 6 particiones, Consumer Group "notificaciones-service":

Consumer A → Particiones 0, 1, 2
Consumer B → Particiones 3, 4, 5

Si agregás Consumer C:
Consumer A → Particiones 0, 1
Consumer B → Particiones 2, 3
Consumer C → Particiones 4, 5
```

Esto permite escalar horizontalmente: más instancias del servicio = más particiones procesadas en paralelo.

Dos consumer groups diferentes leen el mismo topic independientemente:

```
Topic: pedidos-creados
├── Consumer Group "notificaciones" → lee TODOS los mensajes para notificar al comprador
└── Consumer Group "analytics"     → lee TODOS los mensajes para actualizar el dashboard
```

## Casos de uso comunes en Data Engineering

### 1. Event streaming de alta frecuencia

```python
# Capturar clicks de la web en tiempo real
def publicar_click(usuario_id: str, producto_id: str, accion: str):
    evento = {
        "usuario_id": usuario_id,
        "producto_id": producto_id,
        "accion": accion,  # "ver", "agregar_carrito", "comprar"
        "timestamp": datetime.utcnow().isoformat(),
    }
    producer.send("clicks-web", key=usuario_id, value=evento)
```

### 2. CDC (Change Data Capture) con Debezium

Debezium conecta a tu base de datos y publica en Kafka cada insert/update/delete:

```yaml
# connector-config.json (configuración de Debezium)
{
  "name": "pedidos-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "db.ejemplo.com",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "secret",
    "database.dbname": "ecommerce",
    "table.include.list": "public.pedidos",
    "topic.prefix": "cdc"
  }
}
```

Resultado: cada cambio en la tabla `pedidos` llega automáticamente al topic `cdc.public.pedidos`.

### 3. Pipeline ETL asíncrono

```python
# Producer: pipeline de extracción
def extraer_y_publicar(fecha: str):
    datos = bigquery.query(f"SELECT * FROM ventas WHERE fecha = '{fecha}'")
    
    for fila in datos:
        producer.send(
            "ventas-para-procesar",
            value=fila,
            partition=hash(fila["country_id"]) % NUM_PARTICIONES,
        )
    
    print(f"Publicadas {len(datos)} filas para {fecha}")

# Consumer: proceso de transformación (puede escalar independientemente)
def consumir_y_transformar():
    consumer = KafkaConsumer(
        "ventas-para-procesar",
        group_id="transformador-ventas",
    )
    
    batch = []
    for mensaje in consumer:
        venta = mensaje.value
        venta_transformada = transformar(venta)
        batch.append(venta_transformada)
        
        # Commit por lotes para mejor performance
        if len(batch) >= 1000:
            cargar_a_warehouse(batch)
            consumer.commit()
            batch = []
```

## Configuraciones que importan para Data Engineers

```python
# Producer: configuraciones de confiabilidad
producer = KafkaProducer(
    bootstrap_servers=['kafka1:9092', 'kafka2:9092', 'kafka3:9092'],
    acks='all',           # Esperar confirmación de todos los replicas
    retries=3,            # Reintentar en caso de error transitorio
    batch_size=16384,     # Agrupar mensajes para mejor throughput
    linger_ms=10,         # Esperar hasta 10ms para llenar el batch
    compression_type='gzip',  # Comprimir para reducir red y storage
)

# Consumer: configuraciones de performance
consumer = KafkaConsumer(
    'mi-topic',
    fetch_min_bytes=1024,       # Esperar al menos 1KB antes de retornar
    fetch_max_wait_ms=500,      # Máximo 500ms de espera
    max_poll_records=500,       # Máximo 500 mensajes por poll
    enable_auto_commit=False,   # Manual commit para control fino
)
```

## Kafka en el stack de datos moderno

```
Fuentes → Kafka → Consumidores
├── Postgres CDC (Debezium)    →  Kafka   →  Flink/Spark Streaming → BigQuery
├── App clickstream events     →  Kafka   →  Python consumer → Elasticsearch  
├── IoT sensors                →  Kafka   →  TimescaleDB
└── Microservices events       →  Kafka   →  Analytics pipeline (batch)
```

## Lo que NO necesitás saber todavía

Si estás empezando con Kafka, podés ignorar por ahora:
- Kafka Streams vs Flink (procesamiento stateful complejo)
- Configuración de ZooKeeper / KRaft (la operación de Kafka)
- Schema Registry y Avro (para cuando necesitás schema enforcement)
- Tuning avanzado de particiones y replicas

Usá Confluent Cloud o Amazon MSK para no tener que operar Kafka vos mismo hasta que valga la pena.

---

Kafka puede parecer intimidante desde afuera, pero para un data engineer que lo consume (sin administrarlo), los conceptos son manejables en un día. El resto se aprende en la práctica.
