---
title: "5 errores comunes en pipelines de datos (y cómo evitarlos)"
date: "2026-02-15"
author: "Mariano Gobea Alcoba"
category: "data-engineering"
tags: ["data-pipeline", "best-practices", "architecture", "mercadolibre"]
excerpt: "Lecciones aprendidas construyendo pipelines a escala en MercadoLibre. Evita estos errores y ahorra tiempo y dinero."
featured: false
lang: "es"
---

## Introducción

Después de 6+ años construyendo pipelines de datos en MercadoLibre, aprendí que **los errores más costosos son los que parecen inofensivos al principio**.

Estos son los 5 errores que veo repetirse constantemente y cómo evitarlos.

## Error #1: No Manejar Idempotencia

### El Problema

```python
# ❌ Pipeline NO idempotente
def process_daily_sales():
    sales = fetch_sales_from_api()
    insert_into_database(sales)  # Duplica datos si se re-ejecuta
```

Si el pipeline falla y lo re-ejecutás, **duplicás todos los datos**.

### La Solución

```python
# ✅ Pipeline idempotente
def process_daily_sales(date):
    sales = fetch_sales_from_api(date)
    
    # DELETE antes de INSERT (o usa MERGE)
    delete_existing_data(date)
    insert_into_database(sales)
```

**Regla de oro:** Tu pipeline debe poder ejecutarse N veces y el resultado debe ser el mismo.

## Error #2: Hardcodear Fechas

### El Problema

```python
# ❌ Fechas hardcodeadas
sales = fetch_sales(start_date='2026-01-01', end_date='2026-01-31')
```

El código funciona en enero, pero **explota en febrero**.

### La Solución

```python
# ✅ Fechas dinámicas
from datetime import datetime, timedelta

today = datetime.now()
yesterday = today - timedelta(days=1)

sales = fetch_sales(
    start_date=yesterday.strftime('%Y-%m-%d'),
    end_date=today.strftime('%Y-%m-%d')
)
```

**Mejor aún:** Usa variables de entorno o parámetros del scheduler.

## Error #3: No Validar Datos de Entrada

### El Problema

Asumís que los datos siempre vienen bien:

```python
# ❌ Sin validación
for record in api_response:
    amount = float(record['amount'])  # BOOM si amount es None
```

### La Solución

```python
# ✅ Con validación robusta
import pandas as pd
from pydantic import BaseModel, validator

class SaleRecord(BaseModel):
    transaction_id: str
    amount: float
    currency: str = 'ARS'
    
    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

# Usar Pydantic o Pandas para validar
validated_data = [SaleRecord(**record) for record in api_response]
```

**Resultado:** Los errores se detectan temprano, no en producción.

## Error #4: No Monitorear el Pipeline

### El Problema

El pipeline corre silenciosamente... hasta que explota y **nadie se entera por horas**.

### La Solución

```python
# ✅ Logging y alertas
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def run_pipeline():
    start_time = datetime.now()
    records_processed = 0
    
    try:
        logger.info(f"Pipeline started at {start_time}")
        
        data = fetch_data()
        records_processed = len(data)
        process_data(data)
        
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(f"Pipeline completed: {records_processed} records in {duration}s")
        
        # Enviar métricas a monitoring
        send_metrics({
            'records': records_processed,
            'duration_seconds': duration,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        send_alert(f"Pipeline failure: {e}")
        raise
```

**Herramientas recomendadas:** Datadog, Grafana, CloudWatch

## Error #5: No Testear con Datos Reales

### El Problema

Tu pipeline funciona perfecto con 100 registros de prueba, pero **colapsa con 10 millones en producción**.

### La Solución

```python
# ✅ Testing con volúmenes reales
import pytest

@pytest.mark.parametrize("size", [100, 10_000, 1_000_000])
def test_pipeline_scalability(size):
    """Test pipeline con diferentes volúmenes"""
    data = generate_mock_data(size)
    
    start = time.time()
    result = process_pipeline(data)
    duration = time.time() - start
    
    # Validar performance
    assert duration < size * 0.001  # <1ms por registro
    assert len(result) == size
    assert result['errors'] == 0
```

**Pro tip:** Crea datasets sintéticos que simulen casos extremos (nulls, duplicados, caracteres especiales).

## Bonus: Checklist de Pipeline Production-Ready

Antes de deployar a producción:

- ✅ Es idempotente?
- ✅ Tiene logging completo?
- ✅ Valida datos de entrada?
- ✅ Maneja excepciones correctamente?
- ✅ Tiene alertas configuradas?
- ✅ Se testeó con volúmenes reales?
- ✅ Tiene rollback strategy?
- ✅ Documenta sus dependencias?

## Conclusión

Construir pipelines confiables no es magia: es **disciplina y best practices**.

Los pipelines que construí siguiendo estos principios llevan **años corriendo sin intervención manual** en MercadoLibre.

---

*¿Querés ver estos conceptos en acción? Mirá mi [Masterclass de Data Engineering](blog.html#videos)*
