---
title: "Prompt Engineering para Productividad: 15 prompts que uso todos los días"
date: "2026-05-31"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["prompts", "genai", "productivity", "chatgpt"]
excerpt: "Los prompts que me hacen 3x más productivo como Technical Leader. Copia, pega y adapta a tu trabajo."
featured: true
lang: "es"
---

## La Productividad con GenAI

ChatGPT no es un chatbot: **es tu asistente técnico senior**.

Estos 15 prompts me ahorran **10+ horas semanales**.

## 1. Code Review Automático

```
Revisá este código Python y encontrá:
1. Bugs potenciales
2. Security issues
3. Performance problems
4. Mejoras de legibilidad

[pega tu código aquí]

Dame feedback en bullets puntuales.
```

## 2. Escribir Tests

```
Generame pytest tests para esta función:

[pega función]

Incluí:
- Happy path
- Edge cases
- Error handling
- Mocking de llamadas externas
```

## 3. Documentación de Código

```
Generame docstring completo para esta función en formato Google:

[pega función]

Incluí:
- Args con tipos
- Returns
- Raises
- Ejemplo de uso
```

## 4. Optimizar SQL

```
Optimizá esta query de BigQuery:

[pega query]

Explicame:
1. Qué está mal
2. Query optimizada
3. Por qué es mejor
4. Estimación de ahorro de costos
```

## 5. Debugging Assistant

```
Tengo este error:

[pega stack trace]

Mi código:
[pega código relevante]

Ayudame a:
1. Identificar la causa root
2. Proponer solución
3. Prevenir que pase de nuevo
```

## 6. Traducir Requisitos a User Stories

```
Convertí este requisito vago a user stories INVEST:

Requisito: "Necesitamos un dashboard de ventas"

Dame:
- User stories específicas
- Acceptance criteria
- Estimación de complejidad
```

## 7. Generar Data Sintética

```
Generame un dataset CSV de 100 filas con estas columnas:

- transaction_id (UUID)
- user_id (integer 1000-9999)
- amount (float 100-10000)
- currency (ARS, USD, BRL con distribución 70%, 20%, 10%)
- date (entre 2026-01-01 y 2026-05-31)
- status (completed, pending, failed con distribución 85%, 10%, 5%)

Datos realistas, no repetitivos.
```

## 8. Regex Helper

```
Necesito un regex para validar:

- Email válido
- Teléfono argentino formato +54 9 11 1234-5678
- DNI argentino (7-8 dígitos)

Dame:
1. El regex
2. Ejemplos que matchean
3. Ejemplos que NO matchean
4. Código Python para usar
```

## 9. Refactoring Suggestions

```
Este código funciona pero es feo:

[pega código]

Refactorizalo siguiendo:
- Clean Code principles
- SOLID principles
- Python best practices

Explicame los cambios.
```

## 10. Error Messages Amigables

```
Convertí este error técnico en mensaje user-friendly:

Error: "psycopg2.OperationalError: could not connect to server: Connection refused"

Dame:
1. Mensaje para usuario final
2. Mensaje para logs técnicos
3. Acciones sugeridas
```

## 11. Naming Things

```
Tengo que nombrar:

- Función que calcula impuesto a las ganancias mensual
- Variable que guarda el monto neto después de descuentos
- Clase que maneja simulación de salario

Dame 3 opciones para cada una en inglés, siguiendo:
- Python conventions
- Clean Code
- Descriptive but concise
```

## 12. Meeting Notes → Action Items

```
Convertí estas notas caóticas de reunión en action items:

[pega notas]

Dame:
- Action items claros con owner
- Deadlines sugeridos
- Priorización (P0, P1, P2)
- Formato Markdown
```

## 13. Generar Fixtures de Test

```
Generame fixtures de pytest para testear esta función:

[pega función]

Incluí casos:
- Usuario argentino con cónyuge
- Usuario sin deducciones
- Usuario con sueldo en mínimo no imponible
- Usuario con sueldo alto (top bracket)
```

## 14. Configuración de Herramientas

```
Generame:

1. .gitignore para proyecto Python con:
   - Jupyter notebooks
   - Virtual environments
   - Data files (CSV, Parquet)
   - Secrets (.env)
   - IDE configs

2. requirements.txt con versiones específicas para:
   - pandas, numpy, requests
   - testing (pytest, pytest-cov)
   - linting (black, flake8)
```

## 15. Onboarding Docs

```
Generame README.md para este proyecto:

[descripción breve del proyecto]

Incluí:
- Descripción clara
- Prerequisites
- Setup instructions paso a paso
- Cómo correr tests
- Cómo deployar
- Troubleshooting común
- Contacto para preguntas
```

## Meta-Prompt: Mejorar tus Prompts

```
Analizá este prompt y mejoralo:

[tu prompt original]

Dame:
1. Version mejorada del prompt
2. Qué le faltaba al original
3. Por qué la nueva versión es mejor
```

## Conclusión

GenAI no reemplaza a developers: **los amplifica**.

Estos 15 prompts son mi "toolkit" diario.

Adaptalos a tu workflow y multiplicá tu productividad.

---

*¿Querés más prompts útiles? Suscribite a mi blog: [Blog](https://mgobeaalcoba.github.io/blog.html)*
