import type { Language } from '@/contexts/LanguageContext';

type Copy = Record<Language, string>;

/** Public identifiers of the live demo: the agent only answers from the authorised domains. */
export const AGENTHUB_URL = (process.env.NEXT_PUBLIC_AGENTHUB_URL?.trim() || 'https://agents.mgatc.com').replace(/\/$/, '');
export const AGENTHUB_AGENT_ID =
  process.env.NEXT_PUBLIC_AGENTHUB_AGENT_ID?.trim() || '61362cde-2ae1-403d-97a5-52011a7b7545';

export const AGENTHUB_SIGNUP_URL = `${AGENTHUB_URL}/registro?utm_source=mgatc_web&utm_medium=cta&utm_campaign=aaas_demo`;

export const AGENTHUB_HERO = {
  eyebrow: { es: 'MGA AgentHub', en: 'MGA AgentHub' } as Copy,
  title: { es: 'Agentes de IA conectados a tus datos,', en: 'AI agents connected to your data,' } as Copy,
  emphasis: { es: 'listos para tu sitio.', en: 'ready for your website.' } as Copy,
  subtitle: {
    es: 'Creá, conectá e incrustá agentes con costos de inferencia controlados. Acá abajo podés probar en vivo el mismo asistente que ya atiende en este sitio, reconstruido sobre la plataforma.',
    en: 'Create, connect and embed agents with controlled inference costs. Below you can try live the same assistant that already answers on this site, rebuilt on the platform.',
  } as Copy,
  tryLive: { es: 'Probar el asistente en vivo', en: 'Try the assistant live' } as Copy,
  tryCurrent: { es: 'Ver el asistente actual', en: 'See the current assistant' } as Copy,
  signup: { es: 'Crear una cuenta de prueba', en: 'Create a trial account' } as Copy,
  poc: {
    es: 'Prueba de concepto: el registro está limitado a una lista de correos y no hay que cargar datos personales reales.',
    en: 'Proof of concept: sign-up is limited to an allow-list and no real personal data should be loaded.',
  } as Copy,
};

export const AGENTHUB_STATUS = {
  loading: { es: 'Cargando el asistente…', en: 'Loading the assistant…' } as Copy,
  ready: { es: 'Listo: usá el botón de abajo a la izquierda.', en: 'Ready: use the button at the bottom left.' } as Copy,
  error: {
    es: 'No pudimos cargar el asistente ahora. Probá de nuevo en unos minutos.',
    en: 'We could not load the assistant right now. Please try again in a few minutes.',
  } as Copy,
};

export const AGENTHUB_TABS = [
  { id: 'case', label: { es: 'El caso de uso', en: 'The use case' } as Copy },
  { id: 'build', label: { es: 'Cómo está armado', en: 'How it is built' } as Copy },
  { id: 'observe', label: { es: 'Instrumentación', en: 'Instrumentation' } as Copy },
] as const;

export const AGENTHUB_CASE = {
  title: { es: 'Un asistente técnico y comercial para el sitio', en: 'A technical and commercial assistant for the site' } as Copy,
  points: [
    {
      es: 'Responde sobre servicios, portfolio y el blog técnico, y rechaza con amabilidad los temas ajenos.',
      en: 'Answers about services, portfolio and the technical blog, and politely declines unrelated topics.',
    },
    {
      es: 'Calcula el Impuesto a las Ganancias (Argentina 2026) llamando a una herramienta, no inventando la cuenta.',
      en: 'Computes Argentine income tax (2026) by calling a tool instead of making the math up.',
    },
    {
      es: 'Califica interesados y deriva a una persona del equipo por formulario, WhatsApp o email.',
      en: 'Qualifies leads and hands over to a person from the team by form, WhatsApp or email.',
    },
  ] as Copy[],
  tryTitle: { es: 'Preguntale, por ejemplo', en: 'Try asking' } as Copy,
  prompts: [
    { es: 'Mi sueldo bruto es 4.000.000, tengo un hijo y cónyuge. ¿Cuánto cobro neto?', en: 'My gross salary is 4,000,000, with a child and spouse. What is my net pay?' },
    { es: '¿Qué recomiendan para optimizar costos en BigQuery?', en: 'What do you recommend to reduce BigQuery costs?' },
    { es: '¿Qué diferencia hay entre Airflow y Prefect?', en: 'What is the difference between Airflow and Prefect?' },
    { es: '¿Cómo está el clima hoy?', en: 'How is the weather today?' },
  ] as Copy[],
};

export const AGENTHUB_BUILD = {
  title: { es: 'Del flujo de n8n a componentes de la plataforma', en: 'From the n8n flow to platform components' } as Copy,
  from: { es: 'En n8n', en: 'In n8n' } as Copy,
  to: { es: 'En MGA AgentHub', en: 'In MGA AgentHub' } as Copy,
  rows: [
    { from: { es: 'Prompt de sistema armado por el sitio', en: 'System prompt built by the site' }, to: { es: 'Identidad, tono e instrucciones del agente', en: 'Agent identity, tone and instructions' } },
    { from: { es: 'Rechazo de temas ajenos dentro del prompt', en: 'Off-topic refusal inside the prompt' }, to: { es: 'Reglas: temas prohibidos y mensaje de rechazo', en: 'Rules: forbidden topics and refusal message' } },
    { from: { es: 'Detección de intención por palabras clave', en: 'Keyword intent detection' }, to: { es: 'Router de intención con un modelo económico', en: 'Intent router with a low-cost model' } },
    { from: { es: 'RAG con embeddings y Supabase (29 artículos)', en: 'RAG with embeddings and Supabase (29 articles)' }, to: { es: 'Conocimiento: los mismos 29 artículos del blog', en: 'Knowledge: the same 29 blog articles' } },
    { from: { es: 'Cálculo de Ganancias en un nodo de código', en: 'Income tax math in a code node' }, to: { es: 'Servidor MCP con la herramienta calcular_ganancias', en: 'MCP server with the calcular_ganancias tool' } },
    { from: { es: 'Alta del lead en Supabase y correo de aviso', en: 'Lead saved in Supabase plus alert email' }, to: { es: 'Contactos y derivación por correo', en: 'Contacts and email hand-over' } },
    { from: { es: 'Modelo fijo en Hugging Face', en: 'Fixed model on Hugging Face' }, to: { es: 'Modelo configurable por plataforma o con clave propia', en: 'Model set per platform or with your own key' } },
  ],
};

export const AGENTHUB_OBSERVE = {
  title: { es: 'Qué se ve de cada conversación', en: 'What you can see in every conversation' } as Copy,
  points: [
    { es: 'Trazas paso a paso: qué decidió el router, qué fragmentos se leyeron y qué herramienta se llamó.', en: 'Step-by-step traces: what the router decided, which fragments were read and which tool was called.' },
    { es: 'Analítica de uso: conversaciones, resolución, herramientas y temas más consultados.', en: 'Usage analytics: conversations, resolution, tools and most asked topics.' },
    { es: 'Créditos y tope de gasto (Hard Cap) antes de cada llamada al modelo, con opción de clave propia.', en: 'Credits and spend cap (Hard Cap) before each model call, with a bring-your-own-key option.' },
    { es: 'Auditoría de acciones y registro de contactos derivados al equipo.', en: 'Action audit log and a register of contacts handed to the team.' },
  ] as Copy[],
};

export const AGENTHUB_FAQ = [
  {
    q: { es: '¿Es un producto terminado?', en: 'Is it a finished product?' } as Copy,
    a: { es: 'Es una prueba de concepto pública. Los precios y planes están por confirmarse y los cobros son simulados.', en: 'It is a public proof of concept. Pricing and plans are still to be confirmed and payments are simulated.' } as Copy,
  },
  {
    q: { es: '¿Qué datos guarda el chat?', en: 'What data does the chat store?' } as Copy,
    a: { es: 'Las conversaciones se guardan para mostrar la analítica. No cargues datos personales reales durante la prueba.', en: 'Conversations are stored to show analytics. Do not enter real personal data during the trial.' } as Copy,
  },
  {
    q: { es: '¿El asistente actual del sitio cambia?', en: 'Does the current site assistant change?' } as Copy,
    a: { es: 'No. Sigue funcionando sobre n8n; esta versión corre en paralelo para comparar.', en: 'No. It keeps running on n8n; this version runs alongside it for comparison.' } as Copy,
  },
];

export const AGENTHUB_MOCK = {
  title: { es: 'Constructor y chat', en: 'Builder and chat' } as Copy,
  live: { es: 'en vivo', en: 'live' } as Copy,
  side: [
    { es: 'Identidad', en: 'Identity' },
    { es: 'Conocimiento · 29 artículos', en: 'Knowledge · 29 articles' },
    { es: 'Herramientas · 1', en: 'Tools · 1' },
    { es: 'Reglas', en: 'Rules' },
    { es: 'Publicar', en: 'Publish' },
  ] as Copy[],
  user: { es: '¿Cuánto cobro neto con 4.000.000 brutos?', en: 'What is my net pay on 4,000,000 gross?' } as Copy,
  steps: [
    { es: 'router → herramienta', en: 'router → tool' },
    { es: 'calcular_ganancias', en: 'calcular_ganancias' },
  ] as Copy[],
  bot: { es: 'Neto mensual estimado: $3.280.178 (período ene-jun 2026).', en: 'Estimated monthly net: $3,280,178 (Jan-Jun 2026 period).' } as Copy,
};
