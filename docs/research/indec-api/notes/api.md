# Capacidades verificadas de API INDEC

Fecha de consulta: 2026-11-03 (Argentina). Investigación de lectura; no se creó cuenta ni se buscó un token. Se verificaron catálogo y contrato OpenAPI públicos; las series autenticadas no pudieron consultarse sin credenciales.

## ¿Qué ofrece realmente el catálogo?

### Takeaway

El catálogo nuevo tiene 19 servicios de datos, incluyendo IPC, salarios, canastas, actividad económica, producción industrial, EPH, población y comercio exterior. La cobertura proviene del catálogo y OpenAPI consultados por HTTP, no de asumir que todo lo publicado por INDEC ya está en la API. [Catálogo JSON](https://api.indec.gob.ar/api/datasets), [página 2](https://api.indec.gob.ar/api/datasets?page=2), [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).

### Cited Findings

El catálogo público devuelve `count: 19`, `page: 1`, `totalPages: 2`; cada página incluye hasta diez servicios con slug, descripción y columnas. El portal renderiza las listas del lado del cliente, por eso un extractor web sin JavaScript muestra inicialmente cero servicios. [Catálogo JSON](https://api.indec.gob.ar/api/datasets), [página 2](https://api.indec.gob.ar/api/datasets?page=2).

| Servicio / ruta bajo `https://api.indec.gob.ar/v1/` | Cobertura declarada en catálogo/OpenAPI |
| --- | --- |
| `ipc_nacional` | Desde diciembre 2016; región, división, grupo, clase y subclase; base diciembre 2016=100. |
| `indice_salarios` | Privado registrado y público desde noviembre 2015; privado no registrado y total desde octubre 2016. Evolución de índices, no salario promedio en pesos. |
| `valorizacion_canastas_cba_cbt` | Valorización mensual de CBA y CBT, Gran Buenos Aires, desde abril 2016. |
| `canasta-crianza` | Mensual, Gran Buenos Aires, desde mayo 2023; bienes y servicios más tiempo de cuidado; cuatro tramos hasta 12 años. |
| `estimador-mensual-de-actividad-economica-nivel-general` | Enero 2004 en adelante; base 2004=100; serie original, desestacionalizada y tendencia-ciclo. |
| `estimador-mensual-de-actividad-economica-sectores` | Enero 2004 en adelante; base 2004=100; sectores, serie original e interanual. No promete desestacionalización por sector. |
| `ipi_manufacturero` | Enero 2016 en adelante; base 2004=100; nivel general y actividades; series original, desestacionalizada y tendencia-ciclo. |
| `ipi_minero` | Enero 2017 en adelante; base 2016=100; nivel general, series original, desestacionalizada y tendencia-ciclo. |
| `mercado_trabajo_eph` | Frecuencia trimestral, segundo trimestre 2016 en adelante, total 31 aglomerados urbanos. Incluye actividad, empleo, formal/informal, desocupación y subocupación. |
| `pobreza_eph` | Semestral, segundo semestre 2016 en adelante, total 31 aglomerados urbanos; pobreza e indigencia de hogares y personas. |
| `comercio_exterior_exportacion_bienes` | Mensual desde enero 1986; rubros/subrubros/país destino; USD FOB y peso neto. |
| `comercio_exterior_importacion_bienes` | Mensual desde enero 1986; uso económico/categoría/país origen; USD CIF y peso neto. |
| `comercio_exterior_nomenclaturas` | Diccionario de códigos de país, rubros y usos económicos. |
| `icc_precios_construccion` | GBA, base 1993, desde noviembre 2015. |
| `sipm_precios_mayoristas` | IPIM, IPIB e IPP, desde diciembre 2015. |
| `redeterminacion_precios_contratos_obras_publicas` | Aperturas ICC/IPIB para contratos; desde diciembre 2015. |
| `estimaciones_poblacion_departamento_2022_2035` | Estimaciones por departamento y sexo, base Censo 2022, años 2022–2035 según título/descripción. |
| `proyecciones_poblacion_jurisdiccion_2022_2040` | Jurisdicción, sexo y grupos de edad, base Censo 2022, 2022–2040. |
| `proyecciones_poblacion_nacional_2022_2040` | Total país por sexo y edad, base Censo 2022, 2022–2040. |

Fuente para todas las filas: [especificación OpenAPI oficial](https://api.indec.gob.ar/api/openapi?v=2) y [catálogo público, página 1](https://api.indec.gob.ar/api/datasets), [página 2](https://api.indec.gob.ar/api/datasets?page=2).

El schema EPH tiene `area_geografica_nom` y `area_geografica_cod`; el texto de cobertura garantiza total de 31 aglomerados urbanos. Sin filas autenticadas no se verificaron los valores disponibles ni que cada aglomerado esté expuesto individualmente. No equivale a cobertura provincial ni rural. [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).

### Inferences

- El catálogo permite tres productos autónomos sin fuentes externas: radiografía de inflación; poder adquisitivo con IPC/índice salarial e ingresos ingresados por el visitante; radar de actividad por sectores. Son propuestas, no productos existentes ni resultados calculados.
- La división del índice salarial por IPC debe usar una fecha base común y períodos coincidentes; los índices salariales no sirven por sí solos para estimar salario promedio o cantidad de canastas comprables en pesos.

### Gaps

- No se verificó el último período efectivo ni el número de filas de cada serie: los endpoints de datos requieren token.
- No figura ISAC entre los 19 servicios observados; puede incorporarse en otro momento, pero no debe prometerse como disponible en esta API al corte de consulta.
- La descripción de una columna de población departamental menciona 2023–2040, mientras el título y descripción del servicio dicen 2022–2035: confirmar datos antes de implementar.

## ¿Cómo se consulta y cuáles son las condiciones técnicas?

### Takeaway

La API es REST/JSON y usa Bearer JWT; la cuenta es gratuita, el token vence a los doce meses y debe mantenerse privado en una integración del sitio. La documentación ofrece filtros estilo PostgREST y paginación de hasta mil filas por respuesta. [FAQ](https://api.indec.gob.ar/ayuda/faq), [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).

### Cited Findings

- Servidor documentado: `https://api.indec.gob.ar/v1/`; todos los endpoints de datos requieren `Authorization: Bearer <token>`. La obtención requiere registro, verificación por código enviado por correo y generación en el perfil; regenerar revoca el token previo. [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).
- Formato JSON; cuenta gratuita y vigencia del token de doce meses. La FAQ afirma límites de uso pero no da una cuota numérica. La página de términos consultada tampoco publica una cuota numérica. [FAQ](https://api.indec.gob.ar/ayuda/faq), [términos](https://api.indec.gob.ar/ayuda/terminos).
- Parámetros: `select`, `limit`, `offset`, `order` y filtros por columna con `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`. Máximo mil filas por respuesta, incluso si `limit` es mayor. Para paginar sin pérdidas se debe ordenar por la clave completa de cada tabla. `Prefer: count=exact` devuelve total en `Content-Range`, con `206` para resultados parciales. [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).
- La respuesta documentada es un array de filas. Hay valores numéricos anulables, observaciones y signos convencionales como `s` (confidencial), `...` (no disponible) y `*` (provisorio); no deben reemplazarse por cero. Las diferencias de redondeo pueden producir variaciones calculadas distintas de los informes oficiales. [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2).
- Prueba HTTP real sin autenticación, 2026-11-03: `GET https://api.indec.gob.ar/v1/ipc_nacional?limit=1` respondió `401 Unauthorized`, `WWW-Authenticate: Bearer` y JSON `{"code":"42501","details":null,"hint":null,"message":"permission denied for schema api"}`. Confirma que el recurso existe pero no valida filas ni filtros autenticados. [Endpoint probado](https://api.indec.gob.ar/v1/ipc_nacional?limit=1).
- Preflight `OPTIONS` al mismo recurso, origen `https://mgatc.com`, método GET y encabezado Authorization: respuesta 200 con `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, HEAD, OPTIONS` y Authorization permitido. Es evidencia de ese preflight particular, no garantía de funcionamiento de una consulta autenticada. [Recurso probado](https://api.indec.gob.ar/v1/ipc_nacional).

Ejemplos construidos con rutas y operadores del contrato, **no ejecutados con autenticación**:

```text
GET https://api.indec.gob.ar/v1/ipc_nacional?anio=eq.2025&select=periodo,region,descripcion,tipo_de_indicador,valor&limit=1000
GET https://api.indec.gob.ar/v1/indice_salarios?anio=gte.2020&limit=1000
GET https://api.indec.gob.ar/v1/estimador-mensual-de-actividad-economica-sectores?anio=eq.2025&order=anio,mes,codigo,descripcion,periodo,tipo_de_indicador&limit=1000&offset=0
```

Fuente del esquema de ejemplos: [OpenAPI](https://api.indec.gob.ar/api/openapi?v=2). Para uso real deben completarse filtros de indicadores y dimensiones luego de inspeccionar valores de filas.

### Inferences

- Para un export estático, conviene una sincronización periódica en CI con token como secreto, generación de JSON público agregado y despliegue del snapshot. No hace falta exponer el token al visitante, aunque CORS permita consultas.
- La interfaz debería mostrar último período efectivo por indicador, fecha de sincronización, unidad, cobertura y observaciones. Un refresco diario puede detectar publicaciones mensuales o revisiones sin consumir la API por cada visita.
- Como INDEC advierte diferencias por redondeo, conviene preferir variaciones oficiales cuando existan y documentar las métricas propias.

### Gaps

- No se obtuvo cuota de requests por minuto/día ni SLA ni esquema de reintentos documentado.
- No se validaron JSON de filas autenticadas, valores enumerados de dimensiones, período final ni comportamiento de filtros con credenciales.

## ¿Qué se puede reutilizar y qué se debe explicar al visitante?

### Takeaway

INDEC autoriza copiar, reutilizar y redistribuir con atribución primaria; pide fuente visible y referencia al servicio consultado. El portal está marcado BETA. [Inicio](https://api.indec.gob.ar/), [FAQ](https://api.indec.gob.ar/ayuda/faq).

### Cited Findings

- El catálogo declara uso para tableros, análisis e integración en sistemas propios; permite copiar, reutilizar y redistribuir citando la fuente primaria. [Inicio oficial](https://api.indec.gob.ar/).
- Se debe mostrar `Fuente: INDEC` de manera clara y visible, con referencia al servicio específico. [FAQ](https://api.indec.gob.ar/ayuda/faq).
- El portal muestra BETA y pide comentarios para mejorar el nuevo servicio. [Inicio oficial](https://api.indec.gob.ar/).

### Inferences

- Cada visual debería distinguir el dato oficial de cálculos propios (por ejemplo índice de salario real calculado por el sitio), citar servicio, fecha y metodología, y conservar advertencias de provisionalidad.

### Gaps

- No se realizó una auditoría jurídica de los términos; las condiciones técnicas y de atribución reseñadas se limitan a las páginas consultadas.
