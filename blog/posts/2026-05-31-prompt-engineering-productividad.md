---
slug: prompt-engineering-productividad
date: 2026-05-31
---

Como Technical Leader, uso IAs generativas decenas de veces por día. No como curiosidad — como parte real de mi flujo de trabajo. Después de un año optimizando cómo uso estas herramientas, tengo 15 prompts que uso casi todos los días y que me hacen significativamente más productivo.

No son prompts genéricos de internet. Son los que funcionan en mi trabajo específico como lead técnico en data engineering.

## Los principios antes de los prompts

Antes de los prompts específicos, los principios que los hacen funcionar:

1. **Dar contexto de rol**: "Actuá como un senior data engineer con experiencia en BigQuery" produce mejores resultados que preguntar directamente.
2. **Especificar el formato de salida**: Si querés bullet points, decilo. Si querés código Python sin explicación, especificalo.
3. **Dar ejemplos del output esperado**: El few-shot (darle ejemplos) es la técnica más poderosa del prompt engineering.
4. **Iterar**: El primer prompt casi nunca es el mejor. Refiná basándote en el output.

---

## Los 15 Prompts

### 1. Code Review Express

```
Revisá este código Python como un senior engineer. Identificá:
- Bugs potenciales
- Problemas de performance
- Problemas de seguridad
- Violaciones de principios como DRY, SRP, etc.
- Sugerencias de mejora con código alternativo

Código:
[PEGAR CÓDIGO]

Respondé con una tabla: Categoría | Línea | Problema | Solución sugerida
```

### 2. Documentar funciones en segundos

```
Escribí docstrings Google Style para estas funciones Python. Incluí:
- Una descripción concisa en la primera línea
- Args con tipo y descripción
- Returns con tipo y descripción
- Raises si aplica
- Un ejemplo de uso en la sección Examples

[PEGAR FUNCIONES]
```

### 3. Explicar código heredado

```
Explicame este código como si yo fuera un junior developer que no lo conoce. 
Incluí:
1. ¿Qué hace a alto nivel? (1-2 oraciones)
2. ¿Cuál es el flujo de ejecución? (paso a paso)
3. ¿Qué decisiones de diseño llamativas tiene y por qué?
4. ¿Hay algo que podría fallar? ¿Cuándo?

[PEGAR CÓDIGO]
```

### 4. Refactoring guiado

```
Refactorizá este código siguiendo estos principios:
- Aplicar Single Responsibility Principle (una función = una responsabilidad)
- Eliminar duplicación (DRY)
- Mejorar los nombres de variables y funciones
- Agregar type hints donde falten
- Mantener el comportamiento exactamente igual

Mostrá el código refactorizado y explicá brevemente cada cambio relevante.

[PEGAR CÓDIGO]
```

### 5. Query SQL → explicación

```
Explicame esta query SQL como si fuera para documentación técnica:
1. ¿Qué pregunta de negocio responde?
2. ¿Cuál es el flujo de la query? (CTE por CTE o paso a paso)
3. ¿Hay algo en la query que podría ser un problema de performance?
4. ¿Hay algún edge case que podría retornar resultados inesperados?

Query:
[PEGAR SQL]
```

### 6. Diseñar un schema de base de datos

```
Diseñá el schema de base de datos relacional para este requerimiento:

[DESCRIBIR EL DOMINIO]

Requisitos:
- PostgreSQL
- Normalización hasta 3NF salvo que justifiques desnormalizar
- Incluir índices para las queries más comunes
- Incluir consideraciones de auditoría (created_at, updated_at)

Respondé con:
1. Diagrama de tablas (en formato markdown)
2. DDL SQL para crear las tablas
3. Índices recomendados con justificación
4. Queries de ejemplo para las operaciones más comunes
```

### 7. Generar datos de prueba

```
Generá datos de prueba realistas para esta tabla PostgreSQL. 
Necesito 20 registros que:
- Tengan distribución realista (no solo valores extremos)
- Cubran edge cases: valores nulos donde aplique, strings con caracteres especiales, fechas en distintos meses
- Incluyan al menos 2-3 casos "interesantes" para testear lógica de negocio

Schema:
[PEGAR DDL]

Respondé con un INSERT INTO válido.
```

### 8. Escribir tests unitarios

```
Escribí tests unitarios completos para esta función usando pytest.
Incluí:
- Happy path (caso normal que funciona)
- Edge cases (inputs vacíos, valores extremos, tipos incorrectos)
- Error cases (cuándo debe lanzar excepciones)
- Un test parametrizado donde tenga sentido

Usá fixtures cuando sea apropiado. Los tests deben ser independientes entre sí.

Función:
[PEGAR FUNCIÓN]
```

### 9. Arquitectura de solución técnica

```
Proponé una arquitectura para este problema técnico:

[DESCRIBIR EL PROBLEMA]

Restricciones:
- Stack actual: [listar tecnologías]
- Presupuesto mensual aproximado: [monto]
- SLA requerido: [uptime, latencia]
- Equipo: [cantidad de personas y skills]

Respondé con:
1. Arquitectura propuesta con diagrama textual
2. Tecnologías específicas recomendadas con justificación
3. Riesgos y cómo mitigarlos
4. Alternativas que descartaste y por qué
5. Plan de implementación en fases
```

### 10. Preparar una entrevista técnica

```
Actuá como un entrevistador senior en [empresa/dominio]. Voy a tener una entrevista de [tipo: diseño de sistemas / algoritmos / behavioral / data engineering].

Dame:
1. Las 5 preguntas más probables para este tipo de rol y empresa
2. Los criterios que evaluarían en cada respuesta
3. Las respuestas que considerarían "excelentes" vs "aceptables"
4. Red flags que descartarían a un candidato en estas preguntas

Mi perfil: [describir experiencia]
```

### 11. Traducir requerimientos de negocio a técnicos

```
Tengo estos requerimientos de negocio:

[PEGAR REQUERIMIENTOS]

Traducílos a requerimientos técnicos que pueda usar para planificar el desarrollo. Para cada requerimiento de negocio:
1. Requerimiento técnico específico
2. Componentes del sistema afectados
3. Estimación de complejidad (S/M/L/XL)
4. Dependencias con otros requerimientos
5. Criterios de aceptación técnicos (cómo saber que está terminado)
```

### 12. Análisis de un error de producción

```
Tengo este error en producción. Necesito entenderlo y resolverlo rápido.

Stack trace:
[PEGAR ERROR]

Contexto:
- Lenguaje/framework: [...]
- Cuándo ocurre: [...]
- Frecuencia: [...]
- Logs adicionales: [...]

Dame:
1. Causa raíz más probable
2. Cómo verificar si esa es la causa
3. Fix inmediato (si existe)
4. Fix definitivo
5. Cómo prevenir este tipo de error en el futuro
```

### 13. Writing técnico: documenting architecture decisions

```
Escribí un Architecture Decision Record (ADR) para esta decisión técnica:

Decisión: [qué decidimos]
Contexto: [por qué había que decidir]
Opciones consideradas: [qué alternativas evaluamos]
Decisión tomada: [qué elegimos]

Usá este formato:
- Status: [Proposed/Accepted/Deprecated]
- Context: (el problema que necesitábamos resolver)
- Decision: (qué decidimos y por qué)
- Consequences: (qué implica esta decisión, positivo y negativo)
- Alternatives considered: (qué descartamos y por qué)
```

### 14. Crear presentación técnica para stakeholders no técnicos

```
Necesito explicar este tema técnico a [CEO/gerentes/equipo de negocio].
Ellos NO tienen background técnico. Su única preocupación es [impacto en negocio/costos/tiempo/riesgo].

Tema técnico: [descripción detallada]

Creá una estructura de presentación de 5-7 slides con:
1. Título sugerido para cada slide
2. El mensaje principal en 1 oración
3. Las 3 ideas clave a transmitir
4. Analogías o ejemplos del mundo real que los no técnicos entiendan
5. Qué decisión querés que tomen al final de la presentación
```

### 15. Retrospectiva técnica de un proyecto

```
Voy a hacer una retrospectiva de un proyecto. Ayudame a estructurarla.

Descripción del proyecto:
[qué era, duración, equipo, resultado]

Cosas que sé que salieron bien: [...]
Cosas que sé que salieron mal: [...]

Generá:
1. Preguntas para sacar más insights de lo que salió bien (para replicarlo)
2. Preguntas para entender la causa raíz de lo que salió mal (sin buscar culpables)
3. Formato de action items que capture: qué, quién, cuándo
4. Una forma de medir si las mejoras tuvieron efecto en el próximo proyecto
```

---

Estos prompts no son recetas mágicas — son puntos de partida. La clave es ajustarlos a tu contexto específico, iterar cuando el output no es exactamente lo que necesitás, y con el tiempo desarrollar tu propio "library" de prompts para tu dominio.

La diferencia entre alguien que usa IA como una curiosidad y alguien que la usa como un multiplicador de productividad es exactamente esta: tener workflows concretos, no solo preguntas ad-hoc.
