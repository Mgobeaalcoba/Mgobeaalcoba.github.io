---
slug: kafka-basics-data-engineers
date: 2026-05-03
---

Apache Kafka es el backbone de los pipelines de datos en tiempo real. Antes de usarlo, hay conceptos fundamentales que hay que entender bien. Acá la guía práctica para data engineers.

## ¿Qué problema resuelve Kafka?

Sin Kafka, los sistemas se comunican directamente:

```
Service A → API Call → Service B → API Call → Service C
```

El problema: si B está caído, A no puede procesar. Si C es lento, bloquea todo. No hay buffer, no hay replay.

Con Kafka:

```
Service A → Kafka Topic → Service B
                       → Service C  
                       → Service D (replay histórico)
```

Kafka desacopla productores de consumidores y persiste mensajes para replay.

## Conceptos clave

**Topic**: Un canal de mensajes. Como una tabla en una base de datos, pero append-only.

**Partition**: Un topic se divide en particiones para paralelismo. Cada partición es una secuencia ordenada de mensajes.

**Offset**: La posición de un mensaje dentro de una partición. Los consumers trackean su offset para saber qué procesaron.

**Consumer Group**: Un grupo de consumers que dividen las particiones de un topic. Permite escalar horizontalmente el consumo.

## Productor en Python

```python
from kafka import KafkaProducer
import json
from datetime import datetime

producer = KafkaProducer(
    bootstrap_servers=["kafka-broker:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    key_serializer=lambda k: k.encode("utf-8") if k else None,
    acks="all",        # Esperar confirmación de todos los replicas
    retries=3,
    max_in_flight_requests_per_connection=1  # Orden garantizado
)

def publish_order_event(order: dict):
    event = {
        **order,
        "event_type": "order_created",
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    future = producer.send(
        topic="orders",
        key=str(order["seller_id"]),  # Misma key → misma partición → orden garantizado
        value=event,
    )
    
    # Confirmar que el mensaje fue enviado
    record_metadata = future.get(timeout=10)
    return record_metadata.offset

producer.flush()
producer.close()
```

## Consumer en Python

```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "orders",
    bootstrap_servers=["kafka-broker:9092"],
    group_id="order-processor-v1",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    auto_offset_reset="earliest",    # Si es nuevo consumer group, empieza desde el principio
    enable_auto_commit=False,        # Commit manual para control exacto
    max_poll_records=500,
)

def process_batch(messages: list) -> bool:
    """Procesar un batch de mensajes. Devuelve True si todo salió bien."""
    try:
        for msg in messages:
            order = msg.value
            # Tu lógica de negocio acá
            enrich_and_load(order)
        return True
    except Exception as e:
        logger.error(f"Batch processing failed: {e}")
        return False

for message in consumer:
    success = process_batch([message])
    
    if success:
        # Solo commitear si el procesamiento fue exitoso
        consumer.commit()
    else:
        # No commitear: el mensaje se va a re-procesar
        logger.error("Message not committed, will retry")
```

## Particionamiento y ordenamiento

```python
# Si necesitás orden garantizado para un seller:
# Usar el seller_id como key → siempre va a la misma partición

producer.send("orders", key="seller_123", value=event)

# Si necesitás máximo throughput sin orden garantizado:
producer.send("orders", value=event)  # Kafka distribuye round-robin
```

## Dead Letter Queue

```python
MAIN_TOPIC = "orders"
DLQ_TOPIC = "orders-dlq"

def consume_with_dlq():
    for message in consumer:
        try:
            process(message.value)
            consumer.commit()
        except NonRetryableError as e:
            # Error irrecuperable: mover al DLQ
            producer.send(DLQ_TOPIC, value={
                "original_message": message.value,
                "error": str(e),
                "failed_at": datetime.utcnow().isoformat(),
                "topic": message.topic,
                "partition": message.partition,
                "offset": message.offset,
            })
            consumer.commit()  # Commitear para no repetir
        except RetryableError:
            # No commitear: Kafka va a re-entregar
            pass
```

## Kafka vs otras alternativas

| Criterio | Kafka | RabbitMQ | AWS SQS |
|----------|-------|----------|---------|
| Throughput | Muy alto | Alto | Alto |
| Retention | Configurable (días/semanas) | Hasta consumo | 14 días max |
| Replay | Sí | No | No |
| Complejidad | Alta | Media | Baja |
| Managed | Confluent Cloud, AWS MSK | CloudAMQP | Nativo AWS |

Kafka es la elección correcta cuando necesitás retention + replay + alto throughput. Para colas simples, SQS o RabbitMQ son más simples y suficientes.
