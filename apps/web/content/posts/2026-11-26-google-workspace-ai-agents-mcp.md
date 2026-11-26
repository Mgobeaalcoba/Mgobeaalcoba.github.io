## Arquitectura de Agentes con MCP: El Caso de Google Workspace y la Restricción de Escritura

La reciente integración del Model Context Protocol (MCP) en el ecosistema de Google Workspace marca un cambio de paradigma en cómo los Large Language Models (LLMs) interactúan con datos corporativos en tiempo real. Sin embargo, el anuncio técnico de que los servidores MCP de Google para Gmail están restringidos exclusivamente a operaciones de lectura (Read-Only) plantea desafíos significativos para la automatización de agentes autónomos. Este artículo analiza la arquitectura subyacente, las implicaciones de seguridad y las estrategias de mitigación ante esta limitación funcional.

## Fundamentos del Model Context Protocol (MCP) en Entornos Enterprise

El MCP es un estándar abierto diseñado para estandarizar la conexión entre asistentes de IA y repositorios de datos locales o remotos. En un entorno corporativo, permite que el agente no solo dependa de la ventana de contexto estática del LLM, sino que actúe como un cliente que consulta dinámicamente herramientas (tools) y recursos.

La arquitectura de un servidor MCP para Google Workspace funciona mediante tres componentes críticos:
1. **Host (LLM):** El cliente que solicita datos (por ejemplo, Claude Desktop o una instancia de Vertex AI).
2. **MCP Server:** El bridge que autentica contra Google Workspace API, traduce las solicitudes del LLM a llamadas de API REST y normaliza la salida.
3. **Transport Layer:** Generalmente sobre Stdio o HTTP/SSE, asegurando la comunicación bidireccional.

El problema fundamental surge cuando los proveedores de servicios (como Google) deciden restringir el espectro de operaciones (Scopes) disponibles para el servidor MCP. En el caso de Gmail, la imposibilidad de ejecutar la función `gmail.users.messages.send` elimina la capacidad del agente para realizar flujos de trabajo de bucle cerrado (closed-loop automation).

## Limitaciones de la API y el Principio de Privilegio Mínimo

La restricción de Google no es una limitación técnica de la infraestructura, sino una decisión de diseño basada en políticas de seguridad. Desde la perspectiva de ingeniería, implementar una interfaz de escritura requiere mecanismos de control que actualmente no están estandarizados en la especificación MCP 1.0:

1. **Human-in-the-loop (HITL):** En flujos de envío de correos, la falta de una capa de aprobación de confianza dentro del servidor MCP expone al usuario a envíos masivos erróneos por alucinaciones del modelo.
2. **Auditoría y Trazabilidad:** Las APIs de escritura requieren logs transaccionales robustos. Un servidor MCP, por definición, es un agente de ejecución. Si el modelo es atacado mediante *prompt injection*, la capacidad de enviar correos desde una cuenta corporativa se convierte en un vector de ataque crítico.
3. **Gestión de Sesiones:** La API de Gmail requiere una gestión compleja de hilos (threads) y etiquetas. Permitir la escritura vía MCP implica que el desarrollador debe encapsular la lógica de negocio completa en el servidor, aumentando la superficie de ataque del servicio.

## Arquitectura de Solución: El Patrón "Sidecar" para Agentes

Dada la restricción de lectura en el servidor MCP de Google, los ingenieros debemos implementar un patrón de *Delegación Segura*. En lugar de intentar forzar la escritura a través del servidor MCP limitado, la arquitectura debe migrar hacia un sistema de herramientas híbridas.

### Implementación del Proxy de Escritura con FastAPI

Para superar esta limitación, se debe desplegar un servicio intermedio que actúe como *Authorized Tool Provider* fuera del servidor MCP restringido, pero que sea consumido por el agente mediante una definición de herramienta personalizada.

```python
from fastapi import FastAPI, HTTPException
from googleapiclient.discovery import build
import os

app = FastAPI()

# Definición del endpoint de envío de correo
# Este no forma parte del MCP server oficial, sino un servicio controlado
@app.post("/secure-send")
async def send_email(to: str, subject: str, body: str):
    try:
        service = build('gmail', 'v1', credentials=get_creds())
        message = create_message(to, subject, body)
        # Aplicamos lógica de validación previa al envío
        if not is_allowed_recipient(to):
            raise HTTPException(status_code=403, detail="Destinatario no autorizado")
        
        return service.users().messages().send(userId="me", body=message).execute()
    except Exception as e:
        return {"error": str(e)}
```

Al utilizar este patrón, se aísla la funcionalidad de escritura del contexto del MCP, permitiendo que el LLM reciba los datos de lectura a través del servidor MCP estándar y ejecute las acciones de escritura a través de un endpoint altamente supervisado que incluya validaciones de negocio y logging estricto.

## Implicaciones para el Flujo de Trabajo del Agente

La arquitectura basada en MCP favorece la modularidad, pero la división entre herramientas de lectura y escritura complica la gestión del estado del agente. Si el modelo debe leer un hilo de correo, procesarlo y responder, el ciclo de ejecución se convierte en:

1. **Query:** El LLM solicita el contenido del hilo al MCP Server (Read).
2. **Processing:** El agente procesa la información y determina que se requiere una respuesta.
3. **Execution:** El agente invoca una herramienta externa (no MCP o MCP con escritura habilitada manualmente) para enviar el mensaje.

El cuello de botella aquí es la **latencia de contexto**. Al requerir múltiples llamadas para completar una acción, el agente consume más tokens y aumenta la posibilidad de divergencia en el estado del objeto de correo. La recomendación de ingeniería para mitigar esto es implementar una caché de estado local dentro del servidor MCP (usando Redis o un store de memoria persistente) para sincronizar los cambios de escritura antes de que el servidor MCP actualice su visión del estado de Gmail.

## Escalabilidad y Futuro del MCP en la Empresa

El despliegue de agentes autónomos en entornos de producción depende de la estandarización de la seguridad. Mientras Google mantenga los servidores MCP en modo lectura, los ingenieros deben:

- **Estandarizar las definiciones de herramientas:** Usar esquemas JSON compatibles con el protocolo para que el LLM pueda mapear las capacidades de escritura y lectura de forma cohesiva.
- **Implementar RBAC a nivel de Proxy:** No confiar únicamente en los tokens de acceso de OAuth2, sino validar el contexto del usuario en cada solicitud de escritura.
- **Observabilidad:** Integrar telemetría OpenTelemetry en cada transacción de escritura para auditar las decisiones del agente.

La restricción actual de Google es un recordatorio de que, aunque la tecnología de agentes es prometedora, el despliegue a gran escala requiere un control granular sobre las capacidades de escritura, especialmente cuando la infraestructura subyacente gestiona información crítica de negocio. La evolución del MCP debería, idealmente, incorporar un mecanismo de 'Permissions Request' similar a OAuth, donde el agente solicite permiso para ejecutar una acción de escritura específica al usuario en tiempo real.

Para las organizaciones que buscan escalar sus operaciones mediante IA, la construcción de una infraestructura propia de conectores y herramientas de agente (más allá de los servidores estándar provistos por terceros) es la única vía para garantizar la seguridad, el cumplimiento normativo y la autonomía operativa del sistema.

Si su organización requiere asesoramiento especializado en la arquitectura de sistemas inteligentes, el despliegue de agentes autónomos o la integración segura de APIs corporativas, le invitamos a consultar nuestros servicios técnicos. Nuestro equipo cuenta con la experiencia necesaria para diseñar arquitecturas escalables que mitiguen los riesgos asociados con la automatización avanzada. Visite [https://www.mgatc.com](https://www.mgatc.com) para más información.