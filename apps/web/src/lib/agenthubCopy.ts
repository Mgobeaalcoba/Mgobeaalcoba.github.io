import type { Language } from '@/contexts/LanguageContext';

type Copy = Record<Language, string>;

/** Public identifiers of the live demo: the agent only answers from the authorised domains. */
export const AGENTHUB_URL = (process.env.NEXT_PUBLIC_AGENTHUB_URL?.trim() || 'https://agents.mgatc.com').replace(/\/$/, '');
export const AGENTHUB_AGENT_ID =
  process.env.NEXT_PUBLIC_AGENTHUB_AGENT_ID?.trim() || '61362cde-2ae1-403d-97a5-52011a7b7545';

export const AGENTHUB_SIGNUP_URL = `${AGENTHUB_URL}/registro?utm_source=mgatc_web&utm_medium=cta&utm_campaign=aaas_demo`;

export const AGENTHUB_HERO = {
  eyebrow: { es: 'MGA AgentHub', en: 'MGA AgentHub' } as Copy,
  title: { es: 'Mirá cómo se arma un agente de IA,', en: 'See how an AI agent is built,' } as Copy,
  emphasis: { es: 'y probalo en vivo.', en: 'and try it live.' } as Copy,
  subtitle: {
    es: 'Te contamos paso a paso cómo configuramos el Asistente de MGA, el mismo que atiende en este sitio, con su conocimiento, su herramienta de cálculo y su base de datos. Al final de cada paso podés probar lo que se configuró.',
    en: 'We walk you through how we configured the MGA Assistant, the same one that answers on this site, with its knowledge, its calculation tool and its database. After each step you can try what was configured.',
  } as Copy,
  cta: { es: 'Probar el asistente de MGA', en: 'Try the MGA assistant' } as Copy,
  ctaSub: { es: 'En vivo · sin registrarte', en: 'Live · no sign-up' } as Copy,
  tryCurrent: { es: 'Ver el asistente actual', en: 'See the current assistant' } as Copy,
  signup: { es: 'Crear una cuenta de prueba', en: 'Create a trial account' } as Copy,
  poc: {
    es: 'Prueba de concepto: no cargues datos personales reales. El registro está limitado a una lista de correos.',
    en: 'Proof of concept: do not enter real personal data. Sign-up is limited to an allow-list.',
  } as Copy,
};

export const AGENTHUB_STATUS = {
  loading: { es: 'Cargando el asistente…', en: 'Loading the assistant…' } as Copy,
  ready: { es: 'Listo: el asistente está abierto abajo a la izquierda.', en: 'Ready: the assistant is open at the bottom left.' } as Copy,
  error: {
    es: 'No pudimos cargar el asistente ahora. Probá de nuevo en unos minutos.',
    en: 'We could not load the assistant right now. Please try again in a few minutes.',
  } as Copy,
};

export const AGENTHUB_FLOW = {
  title: { es: 'El recorrido de cada pregunta', en: 'The path of every question' } as Copy,
  nodes: [
    { es: 'Pregunta', en: 'Question' },
    { es: 'Reglas', en: 'Rules' },
    { es: 'Router', en: 'Router' },
    { es: 'Conocimiento · Herramienta · Datos', en: 'Knowledge · Tool · Data' },
    { es: 'Respuesta', en: 'Answer' },
  ] as Copy[],
};

export interface AgentStep {
  tab: Copy;
  title: Copy;
  story: Copy;
  config: { label: Copy; value: Copy }[];
  code?: string;
  chips?: Copy[];
  prompt: Copy;
}

export const AGENTHUB_STEPS_TITLE = {
  eyebrow: { es: 'La historia en 8 pasos', en: 'The story in 8 steps' } as Copy,
  title: { es: 'De una hoja en blanco a un agente publicado', en: 'From a blank page to a published agent' } as Copy,
  tryIt: { es: 'Probalo', en: 'Try it' } as Copy,
  tryPrompt: { es: 'Pedile al asistente', en: 'Ask the assistant' } as Copy,
};

export const AGENTHUB_STEPS: AgentStep[] = [
  {
    tab: { es: 'Identidad', en: 'Identity' },
    title: { es: 'Primero decidimos quién es', en: 'First we decide who it is' },
    story: {
      es: 'Un agente empieza con un nombre, un rol y una voz. Tomamos las reglas del asistente que ya teníamos en n8n y las pasamos a las instrucciones del agente, para que no dependan del navegador.',
      en: 'An agent starts with a name, a role and a voice. We took the rules of the assistant we already had in n8n and moved them into the agent instructions, so they no longer depend on the browser.',
    },
    config: [
      { label: { es: 'Nombre', en: 'Name' }, value: { es: 'Asistente de MGA', en: 'MGA Assistant' } },
      { label: { es: 'Rol', en: 'Role' }, value: { es: 'Asistente técnico y comercial de MGA Tech Consulting', en: 'Technical and commercial assistant of MGA Tech Consulting' } },
      { label: { es: 'Tono', en: 'Tone' }, value: { es: 'Profesional, técnico, claro y amable', en: 'Professional, technical, clear and friendly' } },
      { label: { es: 'Idioma', en: 'Language' }, value: { es: 'El de la persona que escribe', en: 'The one the person writes in' } },
    ],
    prompt: { es: '¿Qué servicios ofrece MGA?', en: 'What services does MGA offer?' },
  },
  {
    tab: { es: 'Reglas', en: 'Rules' },
    title: { es: 'Después le ponemos límites', en: 'Then we set its limits' },
    story: {
      es: 'Un asistente público tiene que saber qué no hacer. Definimos los temas prohibidos, dos reglas que nunca se rompen y el mensaje con el que rechaza con amabilidad.',
      en: 'A public assistant has to know what not to do. We defined the forbidden topics, a few rules that are never broken and the message it uses to decline politely.',
    },
    config: [
      { label: { es: 'Temas prohibidos', en: 'Forbidden topics' }, value: { es: 'Clima, política, historia, chistes, programación ajena a los servicios', en: 'Weather, politics, history, jokes, programming unrelated to the services' } },
      { label: { es: 'Reglas estrictas', en: 'Strict rules' }, value: { es: 'No inventar información · No nombrar al equipo ni su tamaño', en: 'Never invent information · Never name the team or its size' } },
      { label: { es: 'Si se sale del tema', en: 'If it goes off-topic' }, value: { es: 'Rechaza con un mensaje propio y vuelve a los servicios', en: 'Declines with its own message and goes back to the services' } },
    ],
    prompt: { es: '¿Cómo está el clima hoy en Buenos Aires?', en: 'How is the weather in Buenos Aires today?' },
  },
  {
    tab: { es: 'Conocimiento', en: 'Knowledge' },
    title: { es: 'Le damos algo para leer', en: 'We give it something to read' },
    story: {
      es: 'Cargamos los 29 artículos técnicos del blog, los mismos que consultaba el agente de n8n. La plataforma los corta en fragmentos y busca los más parecidos antes de contestar.',
      en: 'We loaded the 29 technical blog articles, the same ones the n8n agent consulted. The platform splits them into fragments and looks up the closest ones before answering.',
    },
    config: [
      { label: { es: 'Fuente', en: 'Source' }, value: { es: '29 artículos del blog (Markdown)', en: '29 blog articles (Markdown)' } },
      { label: { es: 'Resultado', en: 'Result' }, value: { es: '233 fragmentos listos para consultar', en: '233 fragments ready to query' } },
      { label: { es: 'Búsqueda', en: 'Search' }, value: { es: 'Léxica y local, sin servicios externos', en: 'Lexical and local, no external services' } },
    ],
    prompt: { es: '¿Qué recomiendan para optimizar costos en BigQuery?', en: 'What do you recommend to reduce BigQuery costs?' },
  },
  {
    tab: { es: 'Herramientas', en: 'Tools' },
    title: { es: 'Le damos algo para hacer', en: 'We give it something to do' },
    story: {
      es: 'El cálculo del Impuesto a las Ganancias no puede inventarlo un modelo. Lo convertimos en una herramienta que el agente llama con los datos que le dio la persona, y que solo lee.',
      en: 'Income tax math cannot be made up by a model. We turned it into a tool the agent calls with the data the person gave, and that is read-only.',
    },
    config: [
      { label: { es: 'Servidor MCP', en: 'MCP server' }, value: { es: 'mga (interno)', en: 'mga (internal)' } },
      { label: { es: 'Herramienta', en: 'Tool' }, value: { es: 'calcular_ganancias · solo lectura', en: 'calcular_ganancias · read-only' } },
      { label: { es: 'Quién calcula', en: 'Who computes' }, value: { es: 'La herramienta, con las escalas de enero-junio 2026', en: 'The tool, with the January-June 2026 brackets' } },
    ],
    code: '{ "sueldo_bruto_mensual": 4000000,\n  "hijos": 1, "conyuge": true }\n→ neto_mensual_estimado: 3280178',
    prompt: { es: 'Cobro 4.000.000 brutos por mes, tengo un hijo y cónyuge. ¿Cuánto me queda neto?', en: 'I earn 4,000,000 gross per month, with a child and a spouse. What is my net pay?' },
  },
  {
    tab: { es: 'Datos', en: 'Data' },
    title: { es: 'La conectamos a una base de datos real', en: 'We connect it to a real database' },
    story: {
      es: 'Para que responda con datos del portfolio y de los packs, la conectamos a PostgreSQL con un usuario de solo lectura. El modelo propone la consulta y la plataforma la valida y la limita antes de ejecutarla.',
      en: 'So it can answer with portfolio and pack data, we connected it to PostgreSQL with a read-only user. The model proposes the query and the platform validates and limits it before running it.',
    },
    config: [
      { label: { es: 'Base', en: 'Database' }, value: { es: 'PostgreSQL, usuario de solo lectura', en: 'PostgreSQL, read-only user' } },
      { label: { es: 'Tablas permitidas', en: 'Allowed tables' }, value: { es: '18 de 59: portfolio, packs, blog e impuestos', en: '18 of 59: portfolio, packs, blog and taxes' } },
      { label: { es: 'Queda afuera', en: 'Left out' }, value: { es: 'Contactos, alumnos, pagos y conversaciones', en: 'Contacts, students, payments and conversations' } },
      { label: { es: 'Límites', en: 'Limits' }, value: { es: 'Solo SELECT, con tiempo y filas máximos', en: 'SELECT only, with time and row caps' } },
    ],
    prompt: { es: '¿Qué packs de consultoría ofrecen?', en: 'What consulting packs do you offer?' },
  },
  {
    tab: { es: 'Apariencia', en: 'Look' },
    title: { es: 'Le damos la cara de la marca', en: 'We give it the brand look' },
    story: {
      es: 'Elegimos los colores de MGA, un saludo corto y cuatro respuestas rápidas para empezar. Lo ubicamos abajo a la izquierda para que conviva con el asistente actual.',
      en: 'We picked the MGA colors, a short greeting and four quick replies to get started. We placed it at the bottom left so it lives next to the current assistant.',
    },
    config: [
      { label: { es: 'Colores', en: 'Colors' }, value: { es: 'Cian #22d3ee sobre fondo oscuro #070b12', en: 'Cyan #22d3ee on dark #070b12' } },
      { label: { es: 'Posición', en: 'Position' }, value: { es: 'Abajo a la izquierda', en: 'Bottom left' } },
    ],
    chips: [
      { es: 'Calcular mi impuesto a las Ganancias', en: 'Calculate my income tax' },
      { es: '¿Qué servicios ofrecen?', en: 'What services do you offer?' },
      { es: 'Quiero automatizar un proceso', en: 'I want to automate a process' },
      { es: 'Contactar al equipo', en: 'Contact the team' },
    ],
    prompt: { es: 'Quiero automatizar un proceso', en: 'I want to automate a process' },
  },
  {
    tab: { es: 'Publicar', en: 'Publish' },
    title: { es: 'Lo publicamos con una línea', en: 'We publish it with one line' },
    story: {
      es: 'Autorizamos los dominios donde puede responder y copiamos un script de una línea. Desde cualquier otro sitio, el agente no responde.',
      en: 'We authorized the domains where it may answer and copied a one-line script. From any other site, the agent does not answer.',
    },
    config: [
      { label: { es: 'Dominios', en: 'Domains' }, value: { es: 'www.mgatc.com, mgatc.com y las vistas previas', en: 'www.mgatc.com, mgatc.com and the previews' } },
      { label: { es: 'Peso del widget', en: 'Widget size' }, value: { es: '11,6 KB, aislado en Shadow DOM', en: '11.6 KB, isolated in Shadow DOM' } },
    ],
    code: '<script src="https://agents.mgatc.com/widget/agent.js"\n        data-agent="<ID-DEL-AGENTE>" async></script>',
    prompt: { es: 'Hola, ¿qué podés hacer por mí?', en: 'Hi, what can you do for me?' },
  },
  {
    tab: { es: 'Probar y medir', en: 'Test and measure' },
    title: { es: 'Probamos, miramos y ajustamos', en: 'We test, look and tune' },
    story: {
      es: 'Cada conversación deja trazas paso a paso: qué decidió el router, qué fragmentos leyó, qué herramienta llamó. Con eso afinamos el agente y controlamos el gasto antes de cada llamada al modelo.',
      en: 'Every conversation leaves step-by-step traces: what the router decided, which fragments it read, which tool it called. With that we tune the agent and control spend before every model call.',
    },
    config: [
      { label: { es: 'Trazas', en: 'Traces' }, value: { es: 'Router, conocimiento, herramienta y datos', en: 'Router, knowledge, tool and data' } },
      { label: { es: 'Analítica', en: 'Analytics' }, value: { es: 'Conversaciones, resolución y temas más consultados', en: 'Conversations, resolution and most asked topics' } },
      { label: { es: 'Costos', en: 'Costs' }, value: { es: 'Créditos y tope de gasto, con clave propia opcional', en: 'Credits and spend cap, with optional own key' } },
      { label: { es: 'Contactos', en: 'Contacts' }, value: { es: 'Derivados a una persona por correo', en: 'Handed to a person by email' } },
    ],
    prompt: { es: 'Quiero hablar con una persona del equipo', en: 'I want to talk to someone from the team' },
  },
];

export const AGENTHUB_FINAL = {
  title: { es: 'Ya viste cómo se armó. Ahora probalo.', en: 'You saw how it was built. Now try it.' } as Copy,
  text: {
    es: 'Pedile que calcule tu Ganancias, que busque en el blog o que te cuente qué packs ofrecemos.',
    en: 'Ask it to compute your income tax, search the blog or tell you which packs we offer.',
  } as Copy,
};

export const AGENTHUB_MORE_TABS = [
  { id: 'build', label: { es: 'Del flujo de n8n a la plataforma', en: 'From the n8n flow to the platform' } as Copy },
  { id: 'faq', label: { es: 'Preguntas frecuentes', en: 'FAQ' } as Copy },
] as const;

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
    { from: { es: 'Lectura de Supabase con nodos', en: 'Supabase reads with nodes' }, to: { es: 'Conector de base de datos de solo lectura', en: 'Read-only database connector' } },
    { from: { es: 'Alta del lead en Supabase y correo de aviso', en: 'Lead saved in Supabase plus alert email' }, to: { es: 'Contactos y derivación por correo', en: 'Contacts and email hand-over' } },
    { from: { es: 'Modelo fijo en Hugging Face', en: 'Fixed model on Hugging Face' }, to: { es: 'Modelo configurable por plataforma o con clave propia', en: 'Model set per platform or with your own key' } },
  ],
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
  {
    q: { es: '¿Puede ver todos los datos de la base?', en: 'Can it see all the data in the database?' } as Copy,
    a: { es: 'No. Usa un usuario de solo lectura que solo accede a 18 tablas públicas del sitio; los contactos, alumnos y pagos quedan fuera.', en: 'No. It uses a read-only user with access to 18 public site tables only; contacts, students and payments are left out.' } as Copy,
  },
];

export const AGENTHUB_MOCK = {
  title: { es: 'Constructor y chat', en: 'Builder and chat' } as Copy,
  live: { es: 'en vivo', en: 'live' } as Copy,
  side: [
    { es: 'Identidad', en: 'Identity' },
    { es: 'Conocimiento · 29 artículos', en: 'Knowledge · 29 articles' },
    { es: 'Herramientas · 1', en: 'Tools · 1' },
    { es: 'Datos · 18 tablas', en: 'Data · 18 tables' },
    { es: 'Publicar', en: 'Publish' },
  ] as Copy[],
  user: { es: '¿Cuánto cobro neto con 4.000.000 brutos?', en: 'What is my net pay on 4,000,000 gross?' } as Copy,
  steps: [
    { es: 'router → herramienta', en: 'router → tool' },
    { es: 'calcular_ganancias', en: 'calcular_ganancias' },
  ] as Copy[],
  bot: { es: 'Neto mensual estimado: $3.280.178 (período ene-jun 2026).', en: 'Estimated monthly net: $3,280,178 (Jan-Jun 2026 period).' } as Copy,
};
