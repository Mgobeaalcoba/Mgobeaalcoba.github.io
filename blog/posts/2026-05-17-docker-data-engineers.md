---
title: "Docker para Data Engineers: Lo que realmente necesitás saber"
date: "2026-05-17"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["docker", "containers", "devops", "development"]
excerpt: "Docker sin el fluff. Comandos esenciales, best practices y cómo dockerizar tus pipelines de datos correctamente."
featured: false
lang: "es"
---

## Por Qué Docker es Mandatorio en 2026

**"Works on my machine"** dejó de ser excusa hace años.

Si tu pipeline corre en tu laptop pero no en producción, **el problema sos vos, no el código**.

## Dockerfile para Data Pipeline

```dockerfile
FROM python:3.11-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy código
COPY . .

# Run pipeline
CMD ["python", "pipeline.py"]
```

## docker-compose para Local Development

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: analytics
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pipeline:
    build: .
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
    volumes:
      - ./data:/app/data

volumes:
  postgres_data:
```

Levantar todo:
```bash
docker-compose up -d
```

## Comandos Esenciales

```bash
# Construir imagen
docker build -t mi-pipeline:latest .

# Correr container
docker run -d --name pipeline mi-pipeline:latest

# Ver logs
docker logs -f pipeline

# Entrar al container (debugging)
docker exec -it pipeline bash

# Ver containers corriendo
docker ps

# Parar y eliminar
docker stop pipeline
docker rm pipeline

# Limpiar imágenes viejas
docker image prune -a

# Ver uso de recursos
docker stats
```

## Multi-Stage Build (Optimización)

```dockerfile
# Stage 1: Build
FROM python:3.11 as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime (más chica)
FROM python:3.11-slim

WORKDIR /app

# Copy solo lo necesario del stage anterior
COPY --from=builder /root/.local /root/.local
COPY . .

# Asegurar que scripts estén en PATH
ENV PATH=/root/.local/bin:$PATH

CMD ["python", "pipeline.py"]
```

**Beneficio:** Imagen final 60% más chica.

## .dockerignore (Esencial)

```.dockerignore
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
venv/
.venv/

# Data (no querés esto en imagen)
*.csv
*.parquet
*.json
data/

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/
*.swp

# Secrets
.env
*.key
credentials.json
```

## Volúmenes para Data

```bash
# ❌ Mal: Data en imagen (pesado, no persiste)
COPY data/ /app/data/

# ✅ Bien: Data en volumen
docker run -v $(pwd)/data:/app/data mi-pipeline
```

## Secrets Management

```python
# ❌ MAL: Hardcoded
API_KEY = "sk-abc123..."

# ❌ MAL: En imagen
ENV API_KEY=sk-abc123

# ✅ BIEN: Environment variables en runtime
docker run -e API_KEY=$API_KEY mi-pipeline

# ✅ MEJOR: Secrets manager
docker run --env-file .env mi-pipeline
```

## Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1
```

## Caso Real: Pipeline en MercadoLibre

Antes de Docker:
- Setup local: 2 horas
- "Works on my machine" bugs: Frecuentes
- Deploy a producción: Manual, frágil

Después de Docker:
- Setup local: 5 minutos (`docker-compose up`)
- Consistency: 100%
- Deploy: `docker push` + K8s auto-deploy

## Docker vs Alternativas

| Tool | Use Case | Learning Curve |
|------|----------|----------------|
| **Docker** | General purpose | ⭐⭐⭐ |
| **Conda** | Python-specific | ⭐⭐⭐⭐ |
| **Virtualenv** | Python dev only | ⭐⭐⭐⭐⭐ |
| **VM** | Full isolation | ⭐⭐ |

## Tips Pro

### 1. Layer Caching

```dockerfile
# ❌ Malo: requirements se invalida con cada código change
COPY . .
RUN pip install -r requirements.txt

# ✅ Bueno: requirements cachea unless cambie
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

### 2. Non-Root User

```dockerfile
# Security best practice
RUN adduser --disabled-password --gecos '' appuser
USER appuser
```

### 3. Logging a STDOUT

```python
# Para que docker logs funcione
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]  # STDOUT
)
```

## Conclusión

Docker no es opcional para data engineering moderno.

Es la diferencia entre **amateur y profesional**.

Invertí 2 días en aprenderlo bien. Te va a servir por años.

---

*¿Necesitás ayuda con containers? [Consultoría DevOps](https://mgobeaalcoba.github.io/consulting.html)*
