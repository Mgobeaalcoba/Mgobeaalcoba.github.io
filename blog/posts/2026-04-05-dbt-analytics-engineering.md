---
slug: dbt-analytics-engineering
date: 2026-04-05
---

Antes de dbt, la transformación de datos en muchos equipos era un caos: queries SQL ad-hoc en notebooks, stored procedures sin versionado, pipelines en Python que mezclaban extracción, transformación y carga. Nadie sabía exactamente de dónde venían los datos que usaban los dashboards.

dbt (data build tool) resolvió este problema definiendo un estándar para el analytics engineering que hoy es adoptado por prácticamente toda empresa de datos seria.

## ¿Qué es dbt y qué problema resuelve?

dbt es una herramienta de línea de comandos que te permite escribir transformaciones de datos como **modelos SQL** versionados, testeables y documentados.

**El antes (sin dbt):**
```
Analista escribe SQL ad-hoc → lo copia a un stored procedure → alguien lo modifica → 
nadie sabe qué cambió → el dashboard muestra números inconsistentes → reunión de 3 horas
```

**El después (con dbt):**
```
Modelo SQL en git → PR review → tests automáticos → deploy → documentación generada automáticamente
```

La filosofía: los datos ya llegaron al warehouse. dbt solo hace la capa de **transformación** (la T de ELT). No extrae ni carga datos — eso lo hace tu pipeline (Airbyte, Fivetran, Kafka, etc.).

## Los conceptos clave

### Modelos

Un modelo en dbt es un archivo `.sql` con una SELECT statement. dbt lo ejecuta y crea la tabla o vista correspondiente en tu warehouse.

```sql
-- models/marts/ventas_diarias.sql
with pedidos as (
    select * from {{ ref('stg_pedidos') }}
),

vendedores as (
    select * from {{ ref('stg_vendedores') }}
)

select
    date_trunc('day', p.created_at) as fecha,
    p.seller_id,
    v.nombre_vendedor,
    count(*) as total_pedidos,
    sum(p.monto) as gmv,
    count(distinct p.buyer_id) as compradores_unicos
from pedidos p
left join vendedores v using (seller_id)
group by 1, 2, 3
```

La macro `{{ ref('stg_pedidos') }}` es la magia: dbt resuelve las dependencias automáticamente y construye el DAG de transformaciones.

### Estructura de carpetas estándar

```
models/
├── staging/           # Datos crudos limpiados, renombrados
│   ├── stg_pedidos.sql
│   ├── stg_vendedores.sql
│   └── stg_productos.sql
├── intermediate/      # Lógica compleja, combinaciones
│   └── int_pedidos_enriquecidos.sql
└── marts/             # Tablas finales para consumo
    ├── fct_ventas_diarias.sql
    └── dim_vendedores.sql
```

Esta convención (staging → intermediate → marts) es el estándar de la industria para organizar transformaciones.

### Tests

dbt incluye tests out-of-the-box:

```yaml
# models/schema.yml
models:
  - name: ventas_diarias
    columns:
      - name: seller_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_vendedores')
              field: seller_id
      - name: fecha
        tests:
          - not_null
      - name: gmv
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"
```

También podés escribir tests singulares (queries SQL que no deben retornar filas):

```sql
-- tests/ventas_no_tienen_gmv_negativo.sql
select *
from {{ ref('ventas_diarias') }}
where gmv < 0
```

Si la query retorna filas, el test falla. Simple y poderoso.

### Documentación automática

```yaml
models:
  - name: ventas_diarias
    description: "Métricas diarias de ventas por vendedor"
    columns:
      - name: gmv
        description: "Gross Merchandise Value — valor total de pedidos, sin devoluciones"
      - name: compradores_unicos
        description: "Cantidad de compradores únicos (distinct buyer_id) en el día"
```

`dbt docs generate` crea un sitio web con el linaje de datos completo. Nunca más "¿de dónde sale este número?".

## Flujo de trabajo con dbt

```bash
# Iniciar un proyecto nuevo
dbt init mi_proyecto

# Correr todos los modelos
dbt run

# Correr solo modelos específicos
dbt run --select ventas_diarias
dbt run --select +ventas_diarias  # con todos sus ancestros

# Correr tests
dbt test

# Generar y servir documentación
dbt docs generate
dbt docs serve

# Run + test en un comando
dbt build
```

## Macros: SQL DRY

dbt usa Jinja templating para macros reutilizables:

```sql
-- macros/fecha_argentina.sql
{% macro fecha_argentina(columna) %}
    CONVERT_TIMEZONE('UTC', 'America/Argentina/Buenos_Aires', {{ columna }})
{% endmacro %}
```

```sql
-- Uso en cualquier modelo
select
    {{ fecha_argentina('created_at') }} as created_at_arg,
    ...
from pedidos
```

## Materialización: cuándo usar views vs tables vs incremental

**View**: Para modelos ligeros que se calculan al momento de consulta. Rápido de actualizar, caro de consultar si es complejo.

**Table**: Se recalcula completo en cada `dbt run`. Bueno para modelos finales que se consultan frecuentemente.

**Incremental**: Solo procesa datos nuevos desde la última corrida. Esencial para tablas grandes:

```sql
-- models/fct_eventos.sql
{{ config(materialized='incremental', unique_key='event_id') }}

select
    event_id,
    user_id,
    event_type,
    created_at
from source_events

{% if is_incremental() %}
  -- Solo procesa eventos después del último registro en la tabla
  where created_at > (select max(created_at) from {{ this }})
{% endif %}
```

## dbt Cloud vs dbt Core

- **dbt Core**: Open source, corré en tu máquina o en tu CI/CD
- **dbt Cloud**: SaaS con IDE, scheduler, CI/CD integrado, alertas

Para equipos pequeños, dbt Core + GitHub Actions + Airflow/Prefect para scheduling es suficiente y gratis. Para equipos medianos/grandes, dbt Cloud hace la operación mucho más simple.

## El impacto real

En los proyectos donde implementé dbt, los cambios más notables fueron:

1. **Tiempo de respuesta a preguntas de negocio**: De días a horas, porque los datos ya están documentados y el linaje es visible
2. **Confianza en los datos**: Los tests automáticos atrapan regresiones antes de que lleguen a producción
3. **Onboarding de nuevos analistas**: En vez de semanas entendiendo el sistema, con `dbt docs serve` tienen el mapa completo desde el día 1
4. **Code review de transformaciones**: Por primera vez, las transformaciones de datos pasaban por PR review como código de aplicación

---

Si tu equipo todavía hace transformaciones SQL sin versionado ni tests, dbt es la mejora de mayor ROI que podés implementar este trimestre. El setup inicial lleva un día; el retorno se ve en semanas.
