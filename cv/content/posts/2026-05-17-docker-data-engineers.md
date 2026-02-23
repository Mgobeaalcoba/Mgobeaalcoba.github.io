---
slug: docker-data-engineers
date: 2026-05-17
---

Docker resolvió el problema clásico de los data engineers: "funciona en mi máquina". Si tu pipeline corre en local pero falla en producción por diferencias de entorno, Docker es la solución. Guía práctica enfocada en casos de uso de datos.

## El problema concreto

```bash
# En tu MacBook con Python 3.11
pip install pandas==2.1.0 scikit-learn==1.4.0
python train_model.py  # ✅ funciona

# En el servidor de producción con Python 3.9
# scikit-learn 1.4.0 requiere Python 3.10+
# 💥 ImportError: cannot import name 'PolynomialCountSketch'
```

Docker encapsula todo: Python version, dependencias, variables de entorno, y el código.

## Dockerfile para un pipeline de datos

```dockerfile
# Usar imagen oficial de Python slim (más liviana)
FROM python:3.11-slim

# Metadatos
LABEL maintainer="data-team@company.com"
LABEL version="1.0"

# Variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema (si son necesarias)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements PRIMERO (para aprovechar cache de Docker)
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del pipeline
COPY src/ ./src/
COPY config/ ./config/

# Usuario no-root por seguridad
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Comando por defecto
CMD ["python", "src/main.py"]
```

## docker-compose para desarrollo local

```yaml
# docker-compose.yml
version: "3.8"

services:
  pipeline:
    build: .
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/secrets/gcp-sa.json
      - POSTGRES_URL=postgresql://user:pass@postgres:5432/analytics
      - ENV=development
    volumes:
      - ./src:/app/src          # Hot reload del código
      - ~/.config/gcloud:/secrets  # Credenciales GCP
      - ./data:/app/data        # Datos locales
    depends_on:
      postgres:
        condition: service_healthy
    command: python src/main.py --date 2026-01-15

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: analytics
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d analytics"]
      interval: 5s
      timeout: 5s
      retries: 5

  jupyter:
    image: jupyter/scipy-notebook:latest
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/work
    environment:
      - JUPYTER_TOKEN=secret

volumes:
  postgres_data:
```

```bash
# Comandos útiles
docker-compose up pipeline    # Correr el pipeline
docker-compose up -d postgres # Postgres en background
docker-compose logs -f        # Ver logs en tiempo real
docker-compose exec pipeline bash  # Shell dentro del container
```

## Multi-stage build para imágenes más pequeñas

```dockerfile
# Stage 1: Build (con herramientas de compilación)
FROM python:3.11-slim as builder

WORKDIR /app
RUN pip install poetry

COPY pyproject.toml poetry.lock .
RUN poetry export -f requirements.txt --output requirements.txt

# Stage 2: Runtime (imagen final liviana)
FROM python:3.11-slim as runtime

WORKDIR /app

COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

USER nobody
CMD ["python", "src/main.py"]
```

Resultado: imagen de ~200 MB vs ~800 MB sin multi-stage.

## Patterns para pipelines de datos

### Variables de entorno y secrets

```python
import os
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Obligatorias — fallan si no están
    postgres_url: str
    gcs_bucket: str
    
    # Opcionales con defaults
    batch_size: int = 10000
    max_retries: int = 3
    env: str = "production"
    
    class Config:
        env_file = ".env"        # Para desarrollo local
        env_file_encoding = "utf-8"

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

### Logging que funciona con Docker

```python
import logging
import sys

# Docker captura stdout/stderr automáticamente
logging.basicConfig(
    stream=sys.stdout,          # stdout, no archivo
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
```

## Deploy en Cloud Run

```bash
# Build y push a Google Container Registry
docker build -t gcr.io/my-project/data-pipeline:v1.0 .
docker push gcr.io/my-project/data-pipeline:v1.0

# Deploy en Cloud Run (serverless)
gcloud run jobs create data-pipeline \
  --image gcr.io/my-project/data-pipeline:v1.0 \
  --region us-central1 \
  --memory 4Gi \
  --cpu 2 \
  --max-retries 3 \
  --set-secrets POSTGRES_URL=postgres-url:latest \
  --set-env-vars GCS_BUCKET=my-bucket

# Ejecutar manualmente
gcloud run jobs execute data-pipeline
```

Docker + Cloud Run es la combinación que uso para pipelines batch. Sin gestionar servidores, con reproducibilidad garantizada.
