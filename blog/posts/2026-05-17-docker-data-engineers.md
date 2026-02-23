---
slug: docker-data-engineers
date: 2026-05-17
---

"En mi máquina funciona" es el meme que Docker vino a matar. Para data engineers, Docker resuelve un problema real: entornos reproducibles para pipelines, notebooks y servicios de datos.

Esta guía es lo que necesitás saber para usar Docker efectivamente en tu trabajo diario — sin profundizar en conceptos de infraestructura que no vas a usar.

## Por qué Docker importa para Data Engineers

**Escenarios donde Docker hace la diferencia:**
- Tu pipeline de Airflow corre localmente pero falla en el server de producción porque las versiones de Python o las dependencias son diferentes
- Querés probar Kafka, PostgreSQL, o Elasticsearch sin instalarlos en tu máquina
- Necesitás que un nuevo miembro del equipo tenga el entorno correcto en minutos, no días
- Querés correr una query en BigQuery desde un script Python con dependencias específicas

## Los comandos que usás el 90% del tiempo

```bash
# Correr un contenedor
docker run -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16

# Correr en background (detached)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16

# Ver contenedores corriendo
docker ps

# Ver logs
docker logs <container_id>

# Entrar al contenedor
docker exec -it <container_id> bash

# Parar y eliminar contenedores
docker stop <container_id>
docker rm <container_id>

# Descargar una imagen
docker pull python:3.11-slim

# Limpiar todo lo que no se usa
docker system prune -f
```

## Tu primer Dockerfile para un pipeline

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema (si las necesitás)
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero (aprovecha el cache de Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Comando por defecto
CMD ["python", "pipeline.py"]
```

```text
# requirements.txt
pandas==2.2.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
requests==2.31.0
```

```bash
# Construir la imagen
docker build -t mi-pipeline:v1 .

# Correr el pipeline
docker run --env-file .env mi-pipeline:v1

# Con volumen para persistir outputs
docker run \
  --env-file .env \
  -v $(pwd)/output:/app/output \
  mi-pipeline:v1
```

## Docker Compose: el stack completo en un archivo

Para desarrollo local, Docker Compose levanta múltiples servicios juntos:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dw_user
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: warehouse
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d  # scripts de inicialización
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dw_user -d warehouse"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  pipeline:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://dw_user:secret@postgres:5432/warehouse
      REDIS_URL: redis://redis:6379
    volumes:
      - ./src:/app/src  # montar código para desarrollo
    command: python -m uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload

  jupyter:
    image: jupyter/scipy-notebook:latest
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/work
    environment:
      JUPYTER_ENABLE_LAB: "yes"

volumes:
  postgres_data:
```

```bash
# Levantar todo
docker compose up -d

# Ver logs de todos los servicios
docker compose logs -f

# Parar todo (sin borrar datos)
docker compose stop

# Parar y eliminar contenedores + redes
docker compose down

# Parar y eliminar TODO incluyendo volúmenes
docker compose down -v
```

## Stack de Data Engineering local completo

```yaml
# docker-compose.data-stack.yml
version: '3.8'

services:
  # Base de datos OLTP
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: ecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Kafka + Zookeeper
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
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

  # Airflow (modo simplificado para desarrollo)
  airflow:
    image: apache/airflow:2.8.0
    environment:
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://admin:admin123@postgres/airflow
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__CORE__LOAD_EXAMPLES: "false"
    ports:
      - "8080:8080"
    volumes:
      - ./dags:/opt/airflow/dags
    command: airflow standalone
    depends_on:
      - postgres

  # MinIO (S3 compatible, para desarrollo local)
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

```bash
# Levantar solo lo que necesitás
docker compose -f docker-compose.data-stack.yml up postgres kafka -d

# Airflow disponible en http://localhost:8080 (admin/admin por defecto)
# MinIO UI en http://localhost:9001
```

## Buenas prácticas para el Dockerfile

```dockerfile
# ✅ Usar versiones específicas, no :latest
FROM python:3.11.7-slim

# ✅ Crear usuario no-root para seguridad
RUN groupadd -r pipeline && useradd -r -g pipeline pipeline

# ✅ Multi-stage build para reducir tamaño de imagen final
FROM python:3.11.7-slim as builder
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11.7-slim
COPY --from=builder /root/.local /root/.local
COPY . .
USER pipeline
CMD ["python", "pipeline.py"]

# ✅ .dockerignore para no copiar lo que no necesitás
```

```text
# .dockerignore
__pycache__/
*.pyc
.env
.env.*
*.log
.git
.venv
venv/
node_modules/
*.parquet
*.csv
data/
output/
```

## Variables de entorno: nunca en la imagen

```bash
# ❌ Nunca
ENV API_KEY=mi-api-key-secreta  # Queda grabada en la imagen

# ✅ En runtime
docker run -e API_KEY=$API_KEY mi-pipeline

# ✅ Con archivo .env
docker run --env-file .env mi-pipeline

# ✅ Con Docker Compose
# En docker-compose.yml: env_file: .env
```

## Debugging de contenedores

```bash
# Entrar a un contenedor que está fallando en el arranque
docker run -it --entrypoint bash mi-pipeline

# Ver qué hay en la imagen
docker run --rm mi-pipeline ls -la /app

# Inspeccionar configuración
docker inspect <container_id>

# Ver uso de recursos
docker stats

# Copiar archivos desde/hacia el contenedor
docker cp <container_id>:/app/output.csv ./output.csv
```

---

Docker para un data engineer es principalmente: reproducibilidad de entornos y poder levantar servicios localmente en minutos. Con `docker run` y `docker compose`, cubrís el 90% de los casos de uso. El resto (Kubernetes, Docker Swarm) es infraestructura que generalmente maneja otro equipo.
