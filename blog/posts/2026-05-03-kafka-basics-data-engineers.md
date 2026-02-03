---
title: "Kafka para Data Engineers: Lo esencial en 10 minutos"
date: "2026-05-03"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["kafka", "streaming", "real-time", "architecture"]
excerpt: "Todo lo que un data engineer necesita saber sobre Kafka sin el ruido. Conceptos clave, cuándo usarlo y cómo NO romper producción."
featured: false
lang: "es"
---

## ¿Qué Es Kafka en Una Frase?

**Sistema de mensajería distribuido y ultra-rápido** para mover datos en tiempo real entre sistemas.

## Conceptos Clave

### 1. Topics

Categorías donde se publican mensajes.

```python
# Publicar mensaje a topic "transactions"
producer.send('transactions', value={'user_id': 123, 'amount': 5000})
```

### 2. Particiones

Topics divididos en particiones para **paralelismo**.

```
Topic: transactions (3 partitions)
├── Partition 0: [msg1, msg4, msg7, ...]
├── Partition 1: [msg2, msg5, msg8, ...]
└── Partition 2: [msg3, msg6, msg9, ...]
```

### 3. Consumer Groups

Múltiples consumers procesando el mismo topic en paralelo.

```python
# Consumer 1 lee partitions 0-1
# Consumer 2 lee partition 2
# = 2x throughput
```

## Producer Example (Python)

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Enviar mensaje
producer.send('transactions', {
    'transaction_id': '123abc',
    'user_id': 456,
    'amount': 5000,
    'timestamp': '2026-05-03T10:30:00Z'
})

producer.flush()
```

## Consumer Example

```python
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'transactions',
    bootstrap_servers=['localhost:9092'],
    group_id='analytics-group',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    data = message.value
    print(f"Processing transaction {data['transaction_id']}")
    # Tu lógica de procesamiento aquí
```

## Kafka en Arquitectura Real

```
[Web App] ─┬─> Kafka Topic: "events"
[Mobile]  ─┤
[API]     ─┘
           │
           ├─> Consumer Group 1 (Real-time analytics)
           ├─> Consumer Group 2 (BigQuery sink)
           ├─> Consumer Group 3 (ML predictions)
           └─> Consumer Group 4 (Alerting system)
```

**Un mensaje → Múltiples consumers independientes.**

## Cuándo Usar Kafka

### ✅ Casos de Uso Ideales

1. **Event Streaming**: Trackear eventos de usuario
2. **Log Aggregation**: Centralizar logs de múltiples servicios
3. **CDC (Change Data Capture)**: Replicar cambios de DB
4. **Microservices Communication**: Desacoplar servicios

### ❌ Cuándo NO Usar Kafka

1. **Baja volumetría**: <100 mensajes/seg (overkill)
2. **No necesitás replay**: Queue simple alcanza
3. **Team chico sin DevOps**: Complejidad operacional alta
4. **Latencia ultra-baja**: Redis Streams puede ser mejor

## Kafka vs Alternatives

| Feature | Kafka | RabbitMQ | Redis Streams |
|---------|-------|----------|---------------|
| **Throughput** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Latency** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Durability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Replay** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ |
| **Complexity** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Errores Comunes

### 1. No Configurar Partitions Key

```python
# ❌ Sin key: mensajes en particiones random
producer.send('topic', value=data)

# ✅ Con key: mismo user siempre en misma partition (orden garantizado)
producer.send('topic', key=str(user_id).encode(), value=data)
```

### 2. No Hacer Commit

```python
# ❌ Auto-commit puede perder mensajes
consumer = KafkaConsumer(enable_auto_commit=True)

# ✅ Commit manual después de procesar
consumer = KafkaConsumer(enable_auto_commit=False)

for message in consumer:
    process(message.value)
    consumer.commit()  # Solo commitear si procesamiento exitoso
```

### 3. Ignorar Backpressure

```python
# ✅ Limitar batch size
consumer = KafkaConsumer(
    max_poll_records=100,  # Procesar 100 mensajes máximo por poll
    max_poll_interval_ms=300000  # 5 minutos para procesar batch
)
```

## Setup Rápido con Docker

```yaml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
  
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
```

Levantar:
```bash
docker-compose up -d
```

## Conclusión

Kafka es intimidante al principio, pero **vale la pena aprenderlo**.

Es el estándar de facto para streaming de datos en 2026.

Dominarlo te hace más valioso como data engineer.

---

*¿Implementando Kafka? Te ayudo: [Servicios de Automatización](https://mgobeaalcoba.github.io/consulting.html)*
