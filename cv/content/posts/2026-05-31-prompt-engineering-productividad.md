---
slug: prompt-engineering-productividad
date: 2025-10-26
---

El prompt engineering no es una habilidad mística — es un conjunto de técnicas concretas que mejoran dramáticamente la calidad de las respuestas de los LLMs. Acá las que más impacto tienen en mi flujo de trabajo.

## Por qué importa el prompting

Con el mismo modelo (GPT-4o, Claude 3.5), un prompt bien construido puede:
- Reducir alucinaciones en 60-70%
- Mejorar la consistencia del formato de salida
- Obtener respuestas más específicas y accionables
- Reducir el número de iteraciones para llegar al resultado

## Técnica 1: Asignación de rol con contexto específico

```
❌ Malo:
"Revisá este código Python."

✅ Bueno:
"Sos un Python senior engineer especializado en data pipelines y performance. 
Tenés 10 años de experiencia en sistemas de alta escala. Tu tarea es revisar 
el siguiente código e identificar:
1. Problemas de performance (memoria, CPU, I/O)
2. Posibles excepciones no manejadas
3. Antipatrones específicos de Python
4. Sugerencias con el fix concreto, no teoría general.

Código:
[código acá]"
```

## Técnica 2: Few-shot examples

Los ejemplos son más poderosos que las instrucciones:

```
Clasificá el siguiente ticket de soporte en una categoría.

Categorías disponibles: BILLING, TECHNICAL, ACCOUNT, DELIVERY, OTHER

Ejemplos:
Input: "No me llega el paquete, ya pasaron 5 días"
Output: DELIVERY

Input: "Me cobró dos veces el mismo pedido"
Output: BILLING

Input: "No puedo iniciar sesión con mi cuenta"
Output: ACCOUNT

Input: "La app se cierra cuando intento agregar al carrito"
Output: TECHNICAL

Ahora clasificá este:
Input: "Quiero cambiar mi contraseña porque la olvidé"
Output:
```

## Técnica 3: Chain of Thought (CoT)

Para tareas de razonamiento, pedirle al modelo que piense paso a paso:

```
Analizá si esta campaña de email marketing fue exitosa. 
Pensá paso a paso antes de dar tu conclusión.

Datos:
- Enviados: 50,000 emails
- Abiertos: 8,500 (17% open rate)
- Clicks: 1,200 (14.1% CTR)
- Conversiones: 48 (4% conversion rate)
- Revenue generado: $14,400
- Costo de la campaña: $2,800

Mostrá tu razonamiento antes de la conclusión final.
```

Esto produce análisis más profundos y con menos errores que pedir directamente "¿fue exitosa?".

## Técnica 4: Restricciones explícitas

```
Escribí un email para rechazar la propuesta de un proveedor.

RESTRICCIONES (obligatorio cumplir todas):
- Máximo 150 palabras
- Tono profesional pero cálido, no frío
- No mencionar el motivo específico del rechazo
- Dejar la puerta abierta para futuras colaboraciones
- En español neutro, no Argentina
- Primer párrafo: agradecimiento
- Segundo párrafo: decisión
- Tercer párrafo: futuro
```

## Técnica 5: Formato de salida explícito

```
Generá un análisis competitivo de las siguientes 3 empresas.

FORMATO DE SALIDA REQUERIDO:
## [Nombre Empresa]
**Fortalezas**: [lista con bullets]
**Debilidades**: [lista con bullets]
**Oportunidad para nosotros**: [1-2 oraciones]
**Score competitivo**: [número del 1 al 10]

No uses otro formato. No agregues introducción ni conclusión.
```

## Técnica 6: Iteración con feedback

En lugar de escribir el prompt perfecto de entrada, usar un ciclo de mejora:

```
Paso 1: "Resumí este documento en 3 bullets"
Paso 2: "El tercer bullet está incompleto. Expandilo con más detalle sobre X"
Paso 3: "Ahora reescribí los 3 bullets en formato ejecutivo, más concreto"
```

## Técnica 7: Delimiter para separar instrucciones de datos

```
Clasificá el texto delimitado por triple comillas según el sentimiento.

Respuesta: solo "POSITIVO", "NEGATIVO" o "NEUTRO". Sin explicación.

"""
El producto llegó antes de lo esperado y la calidad superó mis expectativas. 
Definitivamente volvería a comprar.
"""
```

Los delimitadores (```, ----, ===) previenen que el modelo confunda las instrucciones con el contenido.

## Template para tareas de código

```
CONTEXTO: [Describe el sistema/proyecto en 2-3 líneas]

TAREA: [Qué exactamente necesitás que haga]

CONSTRAINS:
- [Restricción técnica 1]
- [Restricción técnica 2]

CÓDIGO EXISTENTE:
```python
[código acá]
```

SALIDA ESPERADA: [Describe el output exacto que esperás]

NOTA IMPORTANTE: [Cualquier context que el modelo no debe ignorar]
```

## Herramientas para iterar prompts

- **PromptFlow** (Azure): Testing sistemático de prompts
- **LangSmith**: Trazabilidad de chains de LangChain
- **Promptfoo**: Open source, CI/CD para prompts
- **Weights & Biases Prompts**: Para ML workflows

El prompt engineering es una habilidad que mejora con práctica. La clave: iterar rápido, medir el output, y documentar qué funciona.
