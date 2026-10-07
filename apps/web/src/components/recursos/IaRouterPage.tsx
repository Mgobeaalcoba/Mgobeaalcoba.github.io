import Link from 'next/link';
import { ArrowRight, Gauge, GitBranch, Layers, Paperclip, Plug, PlugZap, Scale, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import CopyCommand from '@/components/recursos/CopyCommand';
import { localizePath } from '@/lib/i18n-routes';
import type { Language } from '@/contexts/LanguageContext';

const IMG = '/images/ia-router';
const REPO = 'https://github.com/Mgobeaalcoba/ia-suscription-router';

type Pair = { es: string; en: string };

const FAQ: { question: Pair; answer: Pair }[] = [
  {
    question: { es: '¿Cuesta algo?', en: 'Does it cost anything?' },
    answer: {
      es: 'No. ia-router es software gratuito y de código abierto (Apache-2.0). Usás tus propias suscripciones de Claude, Codex y Antigravity; el router no agrega ningún costo.',
      en: 'No. ia-router is free, open-source software (Apache-2.0). You use your own Claude, Codex and Antigravity subscriptions; the router adds no cost.',
    },
  },
  {
    question: { es: '¿Mis prompts pasan por algún servidor tuyo?', en: 'Do my prompts go through any of your servers?' },
    answer: {
      es: 'No. Cada tarea se ejecuta en el CLI oficial que ya tenés logueado. El router solo lee páginas públicas de Arena y, si activás la clave gratuita, consulta la API de Artificial Analysis. El log local no guarda tus prompts.',
      en: 'No. Each task runs in the official CLI you are already logged into. The router only reads public Arena pages and, if you turn on the free key, queries the Artificial Analysis API. The local log does not store your prompts.',
    },
  },
  {
    question: { es: '¿Lo instalo con Homebrew o con pip?', en: 'Should I install it with Homebrew or pip?' },
    answer: {
      es: 'Si usás macOS con Homebrew, la opción A (brew install Mgobeaalcoba/tap/ia-router) es la más simple. En cualquier otro caso, pipx install ia-router. Los dos instalan el mismo programa y se actualizan y desinstalan de forma independiente.',
      en: 'If you use macOS with Homebrew, option A (brew install Mgobeaalcoba/tap/ia-router) is the simplest. In any other case, pipx install ia-router. Both install the same program and are updated and uninstalled independently.',
    },
  },
  {
    question: { es: '¿Qué modelos soporta?', en: 'Which models does it support?' },
    answer: {
      es: 'Los tres CLIs oficiales: claude (Claude Code), codex (OpenAI Codex) y agy (Antigravity, de Google). Alcanza con tener uno instalado, aunque reparte mejor con varios. Se pueden agregar otros editando un archivo de configuración.',
      en: 'The three official CLIs: claude (Claude Code), codex (OpenAI Codex) and agy (Antigravity, from Google). One installed is enough, although it splits work better with several. Others can be added by editing a configuration file.',
    },
  },
  {
    question: { es: '¿Qué tan confiables son las métricas?', en: 'How reliable are the metrics?' },
    answer: {
      es: 'La precisión sale de Arena (preferencia humana en comparaciones a ciegas, con control de estilo y margen de error) y, con clave, de benchmarks con respuesta correcta de Artificial Analysis. Las diferencias que caen dentro del margen de error no premian a nadie, y cada puntaje muestra sus fuentes.',
      en: 'Accuracy comes from Arena (human preference in blind comparisons, with style control and a margin of error) and, with a key, from correct-answer benchmarks by Artificial Analysis. Differences that fall within the margin of error reward nobody, and every score shows its sources.',
    },
  },
  {
    question: { es: '¿Cómo se mantienen al día?', en: 'How are they kept up to date?' },
    answer: {
      es: 'El software trae incluida la última foto de Arena, así que funciona sin red. Al iniciar, si las métricas tienen más de 7 días, te ofrece actualizarlas y te muestra cada paso y qué cambió en el ruteo. Nada se consulta sin que lo pidas.',
      en: 'The software ships with the latest Arena snapshot, so it works offline. On startup, if the metrics are more than 7 days old, it offers to update them and shows you every step and what changed in the routing. Nothing is queried unless you ask.',
    },
  },
  {
    question: { es: '¿Qué son los conectores y es seguro darle acceso a mi mail?', en: 'What are connectors, and is it safe to give it access to my email?' },
    answer: {
      es: 'Los conectores son servidores MCP (Gmail, Calendar, Slack, GitHub…) que el router le da a cualquier modelo. Cada servidor hace su propio login: el router nunca toca tus tokens. Por defecto pueden leer y escribir, así que un modelo podría enviar un mail si se lo pedís; podés ocultar herramientas con listas allow/deny o apagarlos con /connectors off. Cada llamada queda en un log local sin argumentos ni resultados.',
      en: 'Connectors are MCP servers (Gmail, Calendar, Slack, GitHub…) that the router hands to any model. Each server does its own login: the router never touches your tokens. By default they can read and write, so a model could send an email if you ask it to; you can hide tools with allow/deny lists or turn them off with /connectors off. Every call is recorded in a local log without arguments or results.',
    },
  },
  {
    question: { es: '¿Está en inglés o en español?', en: 'Is it in English or Spanish?' },
    answer: {
      es: 'La interfaz y la documentación del programa están en inglés. El clasificador de tareas entiende tareas escritas en inglés y en español.',
      en: 'The interface and the documentation of the program are in English. The task classifier understands tasks written in English and in Spanish.',
    },
  },
];

/** FAQ in one language, for the JSON-LD of each route. */
export function getIarFaq(lang: Language): { question: string; answer: string }[] {
  return FAQ.map(({ question, answer }) => ({ question: question[lang], answer: answer[lang] }));
}

const USE_CASES: { icon: React.ReactNode; title: Pair; text: Pair }[] = [
  {
    icon: <GitBranch size={20} aria-hidden="true" />,
    title: { es: 'Desarrollo diario con varias suscripciones', en: 'Daily development with several subscriptions' },
    text: {
      es: 'El código va al modelo más preciso según Arena y los benchmarks de coding; las tareas rápidas, al más veloz. Dejás de decidir por costumbre.',
      en: 'Code goes to the most accurate model according to Arena and the coding benchmarks; quick tasks go to the fastest one. You stop deciding out of habit.',
    },
  },
  {
    icon: <Wallet size={20} aria-hidden="true" />,
    title: { es: 'Cuidar la cuota', en: 'Looking after your quota' },
    text: {
      es: 'Para tareas repetitivas priorizás costo. El router reparte para que no se agote siempre el mismo modelo mientras los otros sobran.',
      en: 'For repetitive tasks you prioritize cost. The router spreads the work so the same model does not always run out while the others sit idle.',
    },
  },
  {
    icon: <Paperclip size={20} aria-hidden="true" />,
    title: { es: 'Analizar archivos', en: 'Analyzing files' },
    text: {
      es: 'Arrastrás código, imágenes o PDF a la terminal. El texto se anexa como contexto; imágenes y PDF van solo a los modelos que pueden abrirlos.',
      en: 'You drag code, images or PDFs onto the terminal. Text is appended as context; images and PDFs go only to the models that can open them.',
    },
  },
  {
    icon: <Layers size={20} aria-hidden="true" />,
    title: { es: 'Documentos largos', en: 'Long documents' },
    text: {
      es: 'Para contexto largo mira métricas específicas (razonamiento sobre contexto largo y consultas largas de Arena), no el promedio general.',
      en: 'For long context it looks at specific metrics (long-context reasoning and Arena long queries), not the overall average.',
    },
  },
  {
    icon: <Plug size={20} aria-hidden="true" />,
    title: { es: 'Conectar tus apps (Gmail, Calendar…)', en: 'Connecting your apps (Gmail, Calendar…)' },
    text: {
      es: 'Registrás servidores MCP una vez y cualquier modelo los usa: resumir los mails del día, agendar un bloque en el calendario, consultar tu CRM.',
      en: 'You register MCP servers once and any model uses them: summarize today’s emails, book a block on your calendar, query your CRM.',
    },
  },
  {
    icon: <PlugZap size={20} aria-hidden="true" />,
    title: { es: 'Delegar desde Claude Code', en: 'Delegating from Claude Code' },
    text: {
      es: 'Se registra como servidor MCP: Claude Code puede pedirle al router que mande una subtarea al modelo que mejor encaja.',
      en: 'It registers as an MCP server: Claude Code can ask the router to send a subtask to the model that fits best.',
    },
  },
  {
    icon: <Scale size={20} aria-hidden="true" />,
    title: { es: 'Equipos que evalúan modelos', en: 'Teams evaluating models' },
    text: {
      es: 'Un criterio objetivo, reproducible y con fuentes citadas para decidir qué modelo usar, en lugar de opiniones.',
      en: 'An objective, reproducible criterion with cited sources to decide which model to use, instead of opinions.',
    },
  },
];

const TRUST: [Pair, Pair][] = [
  [
    { es: 'Tus CLIs oficiales, tu login', en: 'Your official CLIs, your login' },
    { es: 'No toca tokens OAuth: cada CLI usa su propia sesión y su propia suscripción.', en: 'It never touches OAuth tokens: each CLI uses its own session and its own subscription.' },
  ],
  [
    { es: 'Sin «permitir todo»', en: 'No “allow everything”' },
    { es: 'Nunca activa flags que desactiven los permisos de los CLIs.', en: 'It never turns on flags that disable the CLIs’ permissions.' },
  ],
  [
    { es: 'Datos con fuente', en: 'Data with sources' },
    { es: 'Arena (CC BY 4.0) y Artificial Analysis, con atribución y fecha en cada pantalla.', en: 'Arena (CC BY 4.0) and Artificial Analysis, with attribution and date on every screen.' },
  ],
  [
    { es: 'Sin dependencias', en: 'No dependencies' },
    { es: 'Solo la librería estándar de Python (3.9 o superior). Instalación liviana.', en: 'Only the Python standard library (3.9 or higher). A lightweight install.' },
  ],
  [
    { es: 'Funciona sin red', en: 'Works offline' },
    { es: 'Trae la última foto de Arena incluida; actualizar es opcional y visible.', en: 'It ships with the latest Arena snapshot; updating is optional and visible.' },
  ],
  [
    { es: 'Open source', en: 'Open source' },
    { es: 'Código público en GitHub bajo Apache-2.0: lo usás y lo modificás, conservando la atribución al autor.', en: 'Public code on GitHub under Apache-2.0: use it and modify it, keeping the attribution to the author.' },
  ],
];

function Shot({ file, alt, w, h, caption, priority = false }: { file: string; alt: string; w: number; h: number; caption: string; priority?: boolean }) {
  return (
    <figure className="signal-iar-shot">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/${file}`} alt={alt} width={w} height={h} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/**
 * The ia-router landing page in one language. The Spanish and English routes render the same
 * structure, so a change to the layout lands in both; only the copy differs.
 * The program's own interface is in English, so the screenshots are shared by both languages.
 */
export default function IaRouterPage({ lang }: { lang: Language }) {
  const t = <T,>(es: T, en: T): T => (lang === 'es' ? es : en);
  const servicesHref = localizePath('/servicios/', lang);

  return (
    <>
      <header className="signal-offer-hero signal-iar-hero">
        <div>
          <ContextBackLink href="/recursos/" label={t('Volver a recursos', 'Back to resources')} />
          <span className="signal-eyebrow">{t('Recursos · herramienta de línea de comandos', 'Resources · command-line tool')}</span>
          <h1>
            {t('Tus suscripciones de IA, ', 'Your AI subscriptions, ')}
            <em>{t('ruteadas con datos.', 'routed with data.')}</em>
          </h1>
          <p>
            {t(
              'ia-router manda cada tarea al modelo que mejor rinde en ese tipo de trabajo (Claude, Codex o Gemini) según métricas objetivas de Arena y Artificial Analysis, y no según la corazonada del día. Corre sobre los CLIs oficiales y tus propias suscripciones.',
              'ia-router sends each task to the model that performs best at that kind of work (Claude, Codex or Gemini) based on objective metrics from Arena and Artificial Analysis, not on the hunch of the day. It runs on the official CLIs and your own subscriptions.',
            )}
          </p>
          <div className="signal-iar-actions">
            <a className="signal-offer-button" href="#instalar" data-analytics="iar_cta_install">
              {t('Instalar', 'Install')} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a className="signal-button signal-button--secondary" href="#como-funciona" data-analytics="iar_cta_how">
              {t('Ver cómo decide', 'See how it decides')}
            </a>
          </div>
          <nav className="signal-iar-subnav" aria-label={t('En esta página', 'On this page')}>
            <a href="#como-funciona">{t('Cómo funciona', 'How it works')}</a>
            <a href="#casos">{t('Casos de uso', 'Use cases')}</a>
            <a href="#prioridades">{t('Prioridades', 'Priorities')}</a>
            <a href="#conectores">{t('Conectores', 'Connectors')}</a>
            <a href="#instalar">{t('Instalar', 'Install')}</a>
            <a href="#faq">{t('Preguntas', 'Questions')}</a>
          </nav>
        </div>
        <aside>
          <span>{t('Instalación en una línea', 'One-line install')}</span>
          <h2>{t('Probalo en tu terminal', 'Try it in your terminal')}</h2>
          <CopyCommand lang={lang} command="brew install Mgobeaalcoba/tap/ia-router" label="Homebrew" />
          <CopyCommand lang={lang} command="pipx install ia-router" label="pip" />
          <p>
            <ShieldCheck size={15} aria-hidden="true" /> {t('Python 3.9+ · Apache-2.0 · sin dependencias · ', 'Python 3.9+ · Apache-2.0 · no dependencies · ')}
            <a href={REPO} target="_blank" rel="noopener noreferrer" data-analytics="iar_source_link">
              {t('código en GitHub', 'code on GitHub')}
            </a>
          </p>
        </aside>
      </header>

      <section className="signal-iar-wide" aria-label={t('El encabezado de ia-router', 'The ia-router header')}>
        <Shot
          file="ia-router-header.png"
          alt={t(
            'Terminal con el encabezado de ia-router: logo, fecha de las métricas de Arena y Artificial Analysis, los tres modelos disponibles y el cuadro de entrada (la interfaz del programa está en inglés)',
            'Terminal with the ia-router header: logo, date of the Arena and Artificial Analysis metrics, the three available models and the input box',
          )}
          w={2000}
          h={926}
          priority
          caption={t(
            'El encabezado muestra de dónde vienen las métricas que rigen el ruteo, qué modelos tenés disponibles y el cuadro donde escribís o arrastrás archivos. La interfaz del programa está en inglés.',
            'The header shows where the metrics that drive the routing come from, which models you have available and the box where you type or drag files.',
          )}
        />
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-problema">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">{t('El problema', 'The problem')}</span>
          <h2 id="iar-problema">{t('Pagás tres suscripciones. ¿A cuál le mandás cada tarea?', 'You pay for three subscriptions. Which one do you send each task to?')}</h2>
        </div>
        <div className="signal-iar-pain">
          <div>
            <strong>{t('Elegís a ojo', 'You choose by eye')}</strong>
            <p>{t('Cada semana sale un modelo que es «el mejor». Sin un criterio común, decidís por costumbre.', 'Every week a new model is “the best”. Without a common criterion, you decide out of habit.')}</p>
          </div>
          <div>
            <strong>{t('Una cuota se agota y las otras sobran', 'One quota runs out and the others go unused')}</strong>
            <p>{t('Usás siempre el mismo modelo hasta el rate limit, mientras los otros dos quedan sin tocar.', 'You always use the same model until the rate limit, while the other two are left untouched.')}</p>
          </div>
          <div>
            <strong>{t('Los rankings se mueven, tu configuración no', 'Rankings move, your setup does not')}</strong>
            <p>{t('Lo que era cierto hace un mes puede no serlo hoy, y nadie te avisa qué cambió.', 'What was true a month ago may not be true today, and nobody tells you what changed.')}</p>
          </div>
        </div>
      </section>

      <section className="signal-iar-section" id="como-funciona" aria-labelledby="iar-como">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">{t('Cómo funciona', 'How it works')}</span>
          <h2 id="iar-como">{t('Un puntaje por modelo y por tipo de tarea, con datos publicados.', 'One score per model and per kind of task, with published data.')}</h2>
        </div>
        <ol className="signal-iar-steps">
          <li>
            <strong>01</strong>
            <h3>{t('Clasifica la tarea', 'It classifies the task')}</h3>
            <p>{t('Código, debugging, escritura, análisis, matemática, contexto largo, imágenes… por reglas, sin gastar cuota.', 'Code, debugging, writing, analysis, math, long context, images… by rules, spending no quota.')}</p>
          </li>
          <li>
            <strong>02</strong>
            <h3>{t('Puntúa cada modelo', 'It scores each model')}</h3>
            <p>
              {t(
                <>
                  <b>Precisión</b> (Elo de Arena por categoría, con margen de error), <b>velocidad</b> (tokens por segundo) y <b>costo</b> (precio por millón de tokens), relativos a tus modelos.
                </>,
                <>
                  <b>Accuracy</b> (Arena Elo per category, with a margin of error), <b>speed</b> (tokens per second) and <b>cost</b> (price per million tokens), relative to your models.
                </>,
              )}
            </p>
          </li>
          <li>
            <strong>03</strong>
            <h3>{t('Ejecuta en tu CLI oficial', 'It runs in your official CLI')}</h3>
            <p>{t('Si hay rate limit o falta de login, prueba el siguiente. Cada respuesta muestra el modelo exacto y los tokens que gastó.', 'If there is a rate limit or a missing login, it tries the next one. Each answer shows the exact model and the tokens it used.')}</p>
          </li>
        </ol>
        <div className="signal-iar-pair">
          <Shot
            file="ia-router-ruteo.png"
            alt={t(
              'Terminal con una tarea y la tabla de ruteo: puntaje por modelo, categorías detectadas y modelo elegido (la interfaz del programa está en inglés)',
              'Terminal with a task and the routing table: score per model, detected categories and chosen model',
            )}
            w={2000}
            h={636}
            caption={t('Una tarea real: cómo la clasifica y qué puntaje obtiene cada modelo.', 'A real task: how it classifies it and what score each model gets.')}
          />
          <Shot
            file="ia-router-scores.png"
            alt={t(
              'Terminal con el comando /scores: tabla de puntajes por categoría y modelo con precisión, velocidad y costo (la interfaz del programa está en inglés)',
              'Terminal with the /scores command: table of scores per category and model with accuracy, speed and cost',
            )}
            w={2000}
            h={1092}
            caption={t('/scores: qué elige el router en cada categoría. Con una categoría muestra el desglose y las fuentes.', '/scores: what the router picks in each category. With a category it shows the breakdown and the sources.')}
          />
        </div>
        <p className="signal-iar-note">
          <Sparkles size={15} aria-hidden="true" />{' '}
          {t('Todo es explicable: cada número tiene su fuente a la vista, y al actualizar las métricas ves qué cambió en el ruteo.', 'Everything is explainable: every number has its source in plain sight, and when you update the metrics you see what changed in the routing.')}
        </p>
      </section>

      <section className="signal-iar-section" id="casos" aria-labelledby="iar-casos">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">{t('Casos de uso', 'Use cases')}</span>
          <h2 id="iar-casos">{t('Para quien usa varias IA todos los días.', 'For anyone who uses several AIs every day.')}</h2>
        </div>
        <div className="signal-iar-grid">
          {USE_CASES.map((c) => (
            <article className="signal-card signal-iar-case" key={c.title.es}>
              <span className="signal-iar-case__icon">{c.icon}</span>
              <h3>{c.title[lang]}</h3>
              <p>{c.text[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-iar-section signal-iar-stack" id="prioridades" aria-labelledby="iar-prior">
        <div>
          <span className="signal-eyebrow">{t('Vos ponés el criterio', 'You set the criterion')}</span>
          <h2 id="iar-prior">{t('¿En código priorizás precisión, velocidad o costo?', 'For code, do you prioritize accuracy, speed or cost?')}</h2>
          <p>
            {t(
              'Cinco preguntas de opción múltiple, una por tipo de tarea. Con tus respuestas el ruteo se rearma al instante, sin configurar nada a mano. Si no querés responder, rigen valores por defecto razonables.',
              'Five multiple-choice questions, one per kind of task. With your answers the routing is rebuilt instantly, with nothing to configure by hand. If you prefer not to answer, sensible defaults apply.',
            )}
          </p>
          <ul className="signal-iar-list">
            <li>
              <Gauge size={16} aria-hidden="true" />{' '}
              {t('Velocidad y costo se ofrecen solo cuando hay datos para todos tus modelos: nunca se mezclan escalas.', 'Speed and cost are offered only when there is data for all your models: scales are never mixed.')}
            </li>
            <li>
              <Scale size={16} aria-hidden="true" /> {t('Las diferencias dentro del margen de error no premian a nadie.', 'Differences within the margin of error reward nobody.')}
            </li>
          </ul>
        </div>
        <Shot
          file="ia-router-prioridades.png"
          alt={t(
            'Terminal con la pregunta «For code and debugging, what do you prioritize?» y cuatro opciones: precisión, equilibrado, velocidad y costo (la interfaz del programa está en inglés)',
            'Terminal with the question “For code and debugging, what do you prioritize?” and four options: accuracy, balanced, speed and cost',
          )}
          w={2000}
          h={678}
          caption={t('El selector de prioridades: flechas y Enter.', 'The priorities selector: arrows and Enter.')}
        />
      </section>

      <section className="signal-iar-section signal-iar-split" id="conectores" aria-labelledby="iar-connectors">
        <div>
          <span className="signal-eyebrow">{t('Nuevo en 0.4 · Conectores', 'New in 0.4 · Connectors')}</span>
          <h2 id="iar-connectors">{t('Que cualquier modelo use tus otras apps.', 'Let any model use your other apps.')}</h2>
          <p>
            {t(
              'Registrás servidores MCP una sola vez (Gmail, Calendar, Drive, Slack, GitHub, tu CRM…) y el router se los da a claude, codex y agy a través de un único proxy. Un solo lugar para permisos, auditoría y credenciales, con el modelo que sea.',
              'You register MCP servers once (Gmail, Calendar, Drive, Slack, GitHub, your CRM…) and the router hands them to claude, codex and agy through a single proxy. One place for permissions, audit and credentials, with whichever model.',
            )}
          </p>
          <ul className="signal-iar-list">
            <li>
              <ShieldCheck size={16} aria-hidden="true" />{' '}
              {t('El router nunca toca tokens OAuth: cada servidor MCP hace su propio login. Las claves pueden ser referencias ${NOMBRE} a tu entorno.', 'The router never touches OAuth tokens: each MCP server does its own login. Keys can be ${NAME} references to your environment.')}
            </li>
            <li>
              <Scale size={16} aria-hidden="true" />{' '}
              {t('Pueden leer y escribir: ocultá herramientas con listas allow/deny o apagalos con /connectors off.', 'They can read and write: hide tools with allow/deny lists or turn them off with /connectors off.')}
            </li>
            <li>
              <Gauge size={16} aria-hidden="true" />{' '}
              {t('Cada llamada queda en un log local, sin argumentos ni resultados.', 'Every call is recorded in a local log, without arguments or results.')}
            </li>
          </ul>
        </div>
        <ol className="signal-iar-install">
          <li>
            <strong>{t('1 · Registrá un servidor', '1 · Register a server')}</strong>
            <CopyCommand lang={lang} command="ia-router connectors add files -- npx -y @modelcontextprotocol/server-filesystem ~/Documents" />
            <p>{t('Usá el servidor MCP de la app que quieras; su documentación explica cómo iniciar sesión.', 'Use the MCP server of the app you want; its documentation explains how to log in.')}</p>
          </li>
          <li>
            <strong>{t('2 · Probalo sin gastar cuota', '2 · Test it without spending quota')}</strong>
            <CopyCommand lang={lang} command="ia-router connectors test" />
          </li>
          <li>
            <strong>{t('3 · Usalo desde el chat', '3 · Use it from the chat')}</strong>
            <CopyCommand lang={lang} command="ia-router" />
            <p>
              {t(
                <>
                  Con conectores registrados, cada tarea los usa; <code>/connectors off</code> los apaga. Para <code>agy</code>, una vez: <code>ia-router connectors install agy</code>.
                </>,
                <>
                  With connectors registered, every task uses them; <code>/connectors off</code> turns them off. For <code>agy</code>, once: <code>ia-router connectors install agy</code>.
                </>,
              )}
            </p>
          </li>
        </ol>
      </section>

      <section className="signal-iar-wide" aria-label={t('Conectores en la terminal', 'Connectors in the terminal')}>
        <Shot
          file="ia-router-connectors.png"
          alt={t(
            'Terminal registrando dos servidores MCP oficiales (filesystem y memory), probándolos con connectors test y listándolos (la interfaz del programa está en inglés)',
            'Terminal registering two official MCP servers (filesystem and memory), testing them with connectors test and listing them',
          )}
          w={2000}
          h={1008}
          caption={t(
            'Salida real: se registran dos servidores MCP oficiales, se prueban sin gastar cuota y se listan. Cualquier modelo los usa a través del mismo proxy.',
            'Real output: two official MCP servers are registered, tested without spending quota and listed. Any model uses them through the same proxy.',
          )}
        />
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-trust">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">{t('Sin sorpresas', 'No surprises')}</span>
          <h2 id="iar-trust">{t('Pensado para no sacarte el control.', 'Designed not to take control away from you.')}</h2>
        </div>
        <div className="signal-iar-trust">
          {TRUST.map(([title, text]) => (
            <div key={title.es}>
              <strong>{title[lang]}</strong>
              <p>{text[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="signal-iar-section signal-iar-split" id="instalar" aria-labelledby="iar-install">
        <div>
          <span className="signal-eyebrow">{t('Instalar', 'Install')}</span>
          <h2 id="iar-install">{t('Dos formas de instalarlo. Elegí una.', 'Two ways to install it. Pick one.')}</h2>
          <p>
            {t(
              'Probado en macOS; no tiene dependencias de sistema, así que debería funcionar también en Linux. Requiere Python 3.9 o superior. Necesitás además al menos uno de los CLIs oficiales instalado y logueado (claude, codex o agy): el router no los instala por vos.',
              'Tested on macOS; it has no system dependencies, so it should also work on Linux. It requires Python 3.9 or higher. You also need at least one of the official CLIs installed and logged in (claude, codex or agy): the router does not install them for you.',
            )}
          </p>
          <ul className="signal-iar-list">
            <li>
              <Gauge size={16} aria-hidden="true" />{' '}
              <span>
                {t(
                  <>
                    <b>Opción A · Homebrew:</b> la más simple en macOS; instala Python si hace falta.
                  </>,
                  <>
                    <b>Option A · Homebrew:</b> the simplest on macOS; it installs Python if needed.
                  </>,
                )}
              </span>
            </li>
            <li>
              <Gauge size={16} aria-hidden="true" />{' '}
              <span>
                {t(
                  <>
                    <b>Opción B · pip o pipx:</b> para cualquier sistema con Python. pipx lo instala aislado.
                  </>,
                  <>
                    <b>Option B · pip or pipx:</b> for any system with Python. pipx installs it isolated.
                  </>,
                )}
              </span>
            </li>
          </ul>
        </div>
        <ol className="signal-iar-install">
          <li>
            <strong>{t('1 · Instalá', '1 · Install')}</strong>
            <p className="signal-iar-opt">
              <b>{t('Opción A · Homebrew', 'Option A · Homebrew')}</b>
            </p>
            <CopyCommand lang={lang} command="brew install Mgobeaalcoba/tap/ia-router" label="Homebrew" />
            <p className="signal-iar-opt">
              <b>{t('Opción B · pipx (o pip)', 'Option B · pipx (or pip)')}</b>
            </p>
            <CopyCommand lang={lang} command="pipx install ia-router" label="pipx" />
            <CopyCommand lang={lang} command="python3 -m pip install --user ia-router" label="pip" />
            <p>
              {t('¿No tenés pipx? ', 'Do not have pipx? ')}
              <code>brew install pipx &amp;&amp; pipx ensurepath</code> {t('en macOS, o', 'on macOS, or')} <code>python3 -m pip install --user pipx</code>{' '}
              {t('en otros sistemas.', 'on other systems.')}
            </p>
          </li>
          <li>
            <strong>{t('2 · Verificá', '2 · Verify')}</strong>
            <CopyCommand lang={lang} command="ia-router --version" />
            <CopyCommand lang={lang} command="ia-router doctor" />
            <p>
              {t(
                <>
                  <code>doctor</code> muestra qué CLIs tenés instalados y qué modelo usa cada uno, sin gastar cuota. Si dice <code>command not found</code>, ejecutá <code>pipx ensurepath</code> y abrí una terminal nueva.
                </>,
                <>
                  <code>doctor</code> shows which CLIs you have installed and which model each one uses, spending no quota. If it says <code>command not found</code>, run <code>pipx ensurepath</code> and open a new terminal.
                </>,
              )}
            </p>
          </li>
          <li>
            <strong>{t('3 · Abrilo', '3 · Open it')}</strong>
            <CopyCommand lang={lang} command="ia-router" />
            <p>
              {t(
                'La primera vez te pregunta antes de gastar algo: detecta qué modelo usa cada CLI y, si las métricas son viejas, ofrece actualizarlas.',
                'The first time it asks before spending anything: it detects which model each CLI uses and, if the metrics are old, offers to update them.',
              )}
            </p>
          </li>
          <li>
            <strong>{t('4 · (Opcional) Sumá velocidad y costo', '4 · (Optional) Add speed and cost')}</strong>
            <p>
              {t('Creá una clave gratuita en ', 'Create a free key at ')}
              <a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">
                artificialanalysis.ai
              </a>{' '}
              {t('y guardala en un archivo ', 'and save it in a ')}
              <code>.env</code>
              {t(':', ' file:')}
            </p>
            <CopyCommand lang={lang} command={t("mkdir -p ~/.ia-router && echo 'ARTIFICIAL_ANALYSIS_API_KEY=tu_clave' > ~/.ia-router/.env", "mkdir -p ~/.ia-router && echo 'ARTIFICIAL_ANALYSIS_API_KEY=your_key' > ~/.ia-router/.env")} />
            <CopyCommand lang={lang} command="ia-router metrics refresh" />
          </li>
          <li>
            <strong>{t('Actualizar y desinstalar', 'Update and uninstall')}</strong>
            <p>
              Homebrew: <code>brew upgrade ia-router</code> · <code>brew uninstall ia-router</code>
              <br />
              pipx: <code>pipx upgrade ia-router</code> · <code>pipx uninstall ia-router</code>
              <br />
              pip: <code>python3 -m pip install -U ia-router</code> · <code>python3 -m pip uninstall ia-router</code>
            </p>
            <p>
              {t('Desinstalar no borra tus datos (', 'Uninstalling does not delete your data (')}
              <code>~/.ia-router</code>
              {t(').', ').')}
            </p>
          </li>
        </ol>

        <div className="signal-iar-links" aria-label={t('Dónde encontrar ia-router', 'Where to find ia-router')}>
          <strong>{t('Dónde encontrarlo', 'Where to find it')}</strong>
          <ul>
            <li>
              <a href="https://pypi.org/project/ia-router/" target="_blank" rel="noopener noreferrer" data-analytics="iar_link_pypi">PyPI</a>
              <span>pipx install ia-router</span>
            </li>
            <li>
              <a href="https://github.com/Mgobeaalcoba/homebrew-tap" target="_blank" rel="noopener noreferrer" data-analytics="iar_link_homebrew">{t('Tap de Homebrew', 'Homebrew tap')}</a>
              <span>brew install Mgobeaalcoba/tap/ia-router</span>
            </li>
            <li>
              <a href={REPO} target="_blank" rel="noopener noreferrer" data-analytics="iar_link_source">{t('Código en GitHub', 'Code on GitHub')}</a>
              <span>Apache-2.0</span>
            </li>
            <li>
              <a href={`${REPO}/blob/main/docs/USAGE.md`} target="_blank" rel="noopener noreferrer" data-analytics="iar_link_docs">{t('Guía de uso', 'Usage guide')}</a>
              <span>{t('paso a paso, con salidas reales (en inglés)', 'step by step, with real outputs')}</span>
            </li>
            <li>
              <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noopener noreferrer" data-analytics="iar_link_changelog">{t('Cambios', 'Changelog')}</a>
              <span>{t('qué trae cada versión', 'what each version brings')}</span>
            </li>
            <li>
              <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer" data-analytics="iar_link_issues">{t('Problemas e ideas', 'Problems and ideas')}</a>
              <span>{t('issues en GitHub', 'issues on GitHub')}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-limits">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">{t('Con honestidad', 'In all honesty')}</span>
          <h2 id="iar-limits">{t('Lo que conviene saber.', 'What is worth knowing.')}</h2>
        </div>
        <ul className="signal-iar-limits">
          <li>
            {t(
              <>
                <b>Arena mide preferencia humana</b>, no si la respuesta es correcta. Por eso se complementa con benchmarks con respuesta correcta cuando hay clave.
              </>,
              <>
                <b>Arena measures human preference</b>, not whether the answer is correct. That is why it is complemented with correct-answer benchmarks when there is a key.
              </>,
            )}
          </li>
          <li>
            {t(
              <>
                <b>Con modelos de frontera, la precisión suele empatar</b> dentro del margen de error. Ahí desempatan la velocidad y el costo.
              </>,
              <>
                <b>With frontier models, accuracy usually ties</b> within the margin of error. Speed and cost break the tie.
              </>,
            )}
          </li>
          <li>
            {t(
              <>
                <b>El costo es el precio de lista por token</b>: un proxy del consumo de cuota, no tu cuota real de suscripción.
              </>,
              <>
                <b>Cost is the list price per token</b>: a proxy for quota consumption, not your real subscription quota.
              </>,
            )}
          </li>
          <li>
            {t(
              <>
                <b>Mide modelos, no tu CLI.</b> Cada CLI puede correr con otro nivel de esfuerzo que el del ranking; se marca como aproximado.
              </>,
              <>
                <b>It measures models, not your CLI.</b> Each CLI may run at a different effort level than the ranking’s; it is marked as approximate.
              </>,
            )}
          </li>
        </ul>
      </section>

      <section className="signal-service-faq" id="faq" aria-labelledby="iar-faq">
        <div>
          <span className="signal-eyebrow">{t('Preguntas', 'Questions')}</span>
          <h2 id="iar-faq">{t('Lo que suelen preguntar.', 'What people usually ask.')}</h2>
        </div>
        <div>
          {FAQ.map((item, index) => (
            <details key={item.question.es} data-analytics={`iar_faq_${index + 1}`} data-analytics-surface="iar_faq">
              <summary>{item.question[lang]}</summary>
              <p>{item.answer[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="signal-section signal-final-cta">
        <div className="signal-final-cta__panel">
          <span className="signal-eyebrow">{t('Probalo', 'Try it')}</span>
          <h2>{t('Dejá de elegir a ojo.', 'Stop choosing by eye.')}</h2>
          <p>
            {t(
              'Instalalo, abrilo y mirá qué elige para cada tipo de tarea y por qué. Si querés este criterio para tu equipo, hablemos.',
              'Install it, open it and see what it picks for each kind of task and why. If you want this criterion for your team, let’s talk.',
            )}
          </p>
          <div className="signal-iar-actions">
            <a className="signal-offer-button" href="#instalar" data-analytics="iar_final_install">
              {t('Instalar ia-router', 'Install ia-router')} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link className="signal-button signal-button--secondary" href={servicesHref} data-analytics="iar_final_services">
              {t('Ver servicios', 'See services')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
