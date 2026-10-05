import Link from 'next/link';
import { ArrowRight, Gauge, GitBranch, Layers, Paperclip, PlugZap, Scale, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import ContextBackLink from '@/components/shared/ContextBackLink';
import CopyCommand from '@/components/recursos/CopyCommand';

const IMG = '/images/ia-router';

export const IAR_FAQ = [
  {
    question: '¿Cuesta algo?',
    answer:
      'No. ia-router es software gratuito y de código abierto (Apache-2.0). Usás tus propias suscripciones de Claude, Codex y Antigravity; el router no agrega ningún costo.',
  },
  {
    question: '¿Mis prompts pasan por algún servidor tuyo?',
    answer:
      'No. Cada tarea se ejecuta en el CLI oficial que ya tenés logueado. El router solo lee páginas públicas de Arena y, si activás la clave gratuita, consulta la API de Artificial Analysis. El log local no guarda tus prompts.',
  },
  {
    question: '¿Lo instalo con Homebrew o con pip?',
    answer:
      'Si usás macOS con Homebrew, la opción A (brew install Mgobeaalcoba/tap/ia-router) es la más simple. En cualquier otro caso, pipx install ia-router. Los dos instalan el mismo programa y se actualizan y desinstalan de forma independiente.',
  },
  {
    question: '¿Qué modelos soporta?',
    answer:
      'Los tres CLIs oficiales: claude (Claude Code), codex (OpenAI Codex) y agy (Antigravity, de Google). Alcanza con tener uno instalado, aunque reparte mejor con varios. Se pueden agregar otros editando un archivo de configuración.',
  },
  {
    question: '¿Qué tan confiables son las métricas?',
    answer:
      'La precisión sale de Arena (preferencia humana en comparaciones a ciegas, con control de estilo y margen de error) y, con clave, de benchmarks con respuesta correcta de Artificial Analysis. Las diferencias que caen dentro del margen de error no premian a nadie, y cada puntaje muestra sus fuentes.',
  },
  {
    question: '¿Cómo se mantienen al día?',
    answer:
      'El software trae incluida la última foto de Arena, así que funciona sin red. Al iniciar, si las métricas tienen más de 7 días, te ofrece actualizarlas y te muestra cada paso y qué cambió en el ruteo. Nada se consulta sin que lo pidas.',
  },
];

const USE_CASES = [
  {
    icon: <GitBranch size={20} aria-hidden="true" />,
    title: 'Desarrollo diario con varias suscripciones',
    text: 'El código va al modelo más preciso según Arena y los benchmarks de coding; las tareas rápidas, al más veloz. Dejás de decidir por costumbre.',
  },
  {
    icon: <Wallet size={20} aria-hidden="true" />,
    title: 'Cuidar la cuota',
    text: 'Para tareas repetitivas priorizás costo. El router reparte para que no se agote siempre el mismo modelo mientras los otros sobran.',
  },
  {
    icon: <Paperclip size={20} aria-hidden="true" />,
    title: 'Analizar archivos',
    text: 'Arrastrás código, imágenes o PDF a la terminal. El texto se anexa como contexto; imágenes y PDF van solo a los modelos que pueden abrirlos.',
  },
  {
    icon: <Layers size={20} aria-hidden="true" />,
    title: 'Documentos largos',
    text: 'Para contexto largo mira métricas específicas (razonamiento sobre contexto largo y consultas largas de Arena), no el promedio general.',
  },
  {
    icon: <PlugZap size={20} aria-hidden="true" />,
    title: 'Delegar desde Claude Code',
    text: 'Se registra como servidor MCP: Claude Code puede pedirle al router que mande una subtarea al modelo que mejor encaja.',
  },
  {
    icon: <Scale size={20} aria-hidden="true" />,
    title: 'Equipos que evalúan modelos',
    text: 'Un criterio objetivo, reproducible y con fuentes citadas para decidir qué modelo usar, en lugar de opiniones.',
  },
];

const TRUST = [
  ['Tus CLIs oficiales, tu login', 'No toca tokens OAuth: cada CLI usa su propia sesión y su propia suscripción.'],
  ['Sin «permitir todo»', 'Nunca activa flags que desactiven los permisos de los CLIs.'],
  ['Datos con fuente', 'Arena (CC BY 4.0) y Artificial Analysis, con atribución y fecha en cada pantalla.'],
  ['Sin dependencias', 'Solo la librería estándar de Python (3.9 o superior). Instalación liviana.'],
  ['Funciona sin red', 'Trae la última foto de Arena incluida; actualizar es opcional y visible.'],
  ['Open source', 'Apache-2.0: lo usás y lo modificás, conservando la atribución al autor.'],
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

export default function IaRouterPage() {
  return (
    <>
      <header className="signal-offer-hero signal-iar-hero">
        <div>
          <ContextBackLink href="/recursos/" label="Volver a recursos" />
          <span className="signal-eyebrow">Recursos · herramienta de línea de comandos</span>
          <h1>
            Tus suscripciones de IA, <em>ruteadas con datos.</em>
          </h1>
          <p>
            ia-router manda cada tarea al modelo que mejor rinde en ese tipo de trabajo (Claude, Codex o Gemini) según métricas objetivas de Arena y
            Artificial Analysis, y no según la corazonada del día. Corre sobre los CLIs oficiales y tus propias suscripciones.
          </p>
          <div className="signal-iar-actions">
            <a className="signal-offer-button" href="#instalar" data-analytics="iar_cta_install">
              Instalar <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a className="signal-button signal-button--secondary" href="#como-funciona" data-analytics="iar_cta_how">
              Ver cómo decide
            </a>
          </div>
          <nav className="signal-iar-subnav" aria-label="En esta página">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#casos">Casos de uso</a>
            <a href="#prioridades">Prioridades</a>
            <a href="#instalar">Instalar</a>
            <a href="#faq">Preguntas</a>
          </nav>
        </div>
        <aside>
          <span>Instalación en una línea</span>
          <h2>Probalo en tu terminal</h2>
          <CopyCommand command="brew install Mgobeaalcoba/tap/ia-router" label="Homebrew" />
          <CopyCommand command="pipx install ia-router" label="pip" />
          <p>
            <ShieldCheck size={15} aria-hidden="true" /> Python 3.9+ · Apache-2.0 · sin dependencias
          </p>
        </aside>
      </header>

      <section className="signal-iar-wide" aria-label="El encabezado de ia-router">
        <Shot
          file="ia-router-header.png"
          alt="Terminal con el encabezado de ia-router: logo, fecha de las métricas de Arena y Artificial Analysis, los tres modelos disponibles y el cuadro de entrada"
          w={2000}
          h={926}
          priority
          caption="El encabezado muestra de dónde vienen las métricas que rigen el ruteo, qué modelos tenés disponibles y el cuadro donde escribís o arrastrás archivos."
        />
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-problema">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">El problema</span>
          <h2 id="iar-problema">Pagás tres suscripciones. ¿A cuál le mandás cada tarea?</h2>
        </div>
        <div className="signal-iar-pain">
          <div>
            <strong>Elegís a ojo</strong>
            <p>Cada semana sale un modelo que es «el mejor». Sin un criterio común, decidís por costumbre.</p>
          </div>
          <div>
            <strong>Una cuota se agota y las otras sobran</strong>
            <p>Usás siempre el mismo modelo hasta el rate limit, mientras los otros dos quedan sin tocar.</p>
          </div>
          <div>
            <strong>Los rankings se mueven, tu configuración no</strong>
            <p>Lo que era cierto hace un mes puede no serlo hoy, y nadie te avisa qué cambió.</p>
          </div>
        </div>
      </section>

      <section className="signal-iar-section" id="como-funciona" aria-labelledby="iar-como">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">Cómo funciona</span>
          <h2 id="iar-como">Un puntaje por modelo y por tipo de tarea, con datos publicados.</h2>
        </div>
        <ol className="signal-iar-steps">
          <li>
            <strong>01</strong>
            <h3>Clasifica la tarea</h3>
            <p>Código, debugging, escritura, análisis, matemática, contexto largo, imágenes… por reglas, sin gastar cuota.</p>
          </li>
          <li>
            <strong>02</strong>
            <h3>Puntúa cada modelo</h3>
            <p>
              <b>Precisión</b> (Elo de Arena por categoría, con margen de error), <b>velocidad</b> (tokens por segundo) y <b>costo</b> (precio por millón de
              tokens), relativos a tus modelos.
            </p>
          </li>
          <li>
            <strong>03</strong>
            <h3>Ejecuta en tu CLI oficial</h3>
            <p>Si hay rate limit o falta de login, prueba el siguiente. Cada respuesta muestra el modelo exacto y los tokens que gastó.</p>
          </li>
        </ol>
        <div className="signal-iar-pair">
          <Shot
            file="ia-router-ruteo.png"
            alt="Terminal con una tarea y la tabla de ruteo: puntaje por modelo, categorías detectadas y modelo elegido"
            w={2000}
            h={636}
            caption="Una tarea real: cómo la clasifica y qué puntaje obtiene cada modelo."
          />
          <Shot
            file="ia-router-scores.png"
            alt="Terminal con el comando /scores: tabla de puntajes por categoría y modelo con precisión, velocidad y costo"
            w={2000}
            h={1092}
            caption="/scores: qué elige el router en cada categoría. Con una categoría muestra el desglose y las fuentes."
          />
        </div>
        <p className="signal-iar-note">
          <Sparkles size={15} aria-hidden="true" /> Todo es explicable: cada número tiene su fuente a la vista, y al actualizar las métricas ves qué cambió en el ruteo.
        </p>
      </section>

      <section className="signal-iar-section" id="casos" aria-labelledby="iar-casos">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">Casos de uso</span>
          <h2 id="iar-casos">Para quien usa varias IA todos los días.</h2>
        </div>
        <div className="signal-iar-grid">
          {USE_CASES.map((c) => (
            <article className="signal-card signal-iar-case" key={c.title}>
              <span className="signal-iar-case__icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-iar-section signal-iar-stack" id="prioridades" aria-labelledby="iar-prior">
        <div>
          <span className="signal-eyebrow">Vos ponés el criterio</span>
          <h2 id="iar-prior">¿En código priorizás precisión, velocidad o costo?</h2>
          <p>
            Cinco preguntas de opción múltiple, una por tipo de tarea. Con tus respuestas el ruteo se rearma al instante, sin configurar nada a mano. Si no
            querés responder, rigen valores por defecto razonables.
          </p>
          <ul className="signal-iar-list">
            <li>
              <Gauge size={16} aria-hidden="true" /> Velocidad y costo se ofrecen solo cuando hay datos para todos tus modelos: nunca se mezclan escalas.
            </li>
            <li>
              <Scale size={16} aria-hidden="true" /> Las diferencias dentro del margen de error no premian a nadie.
            </li>
          </ul>
        </div>
        <Shot
          file="ia-router-prioridades.png"
          alt="Terminal con la pregunta «Para código y debugging, ¿qué priorizás?» y cuatro opciones: precisión, equilibrado, velocidad y costo"
          w={2000}
          h={678}
          caption="El selector de prioridades: flechas y Enter."
        />
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-trust">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">Sin sorpresas</span>
          <h2 id="iar-trust">Pensado para no sacarte el control.</h2>
        </div>
        <div className="signal-iar-trust">
          {TRUST.map(([title, text]) => (
            <div key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="signal-iar-section signal-iar-split" id="instalar" aria-labelledby="iar-install">
        <div>
          <span className="signal-eyebrow">Instalar</span>
          <h2 id="iar-install">Dos formas de instalarlo. Elegí una.</h2>
          <p>
            Funciona en macOS (probado) y Linux, con Python 3.9 o superior. Necesitás además al menos uno de los CLIs oficiales instalado y logueado (claude,
            codex o agy): el router no los instala por vos.
          </p>
          <ul className="signal-iar-list">
            <li>
              <Gauge size={16} aria-hidden="true" /> <span><b>Opción A · Homebrew:</b> la más simple en macOS; instala Python si hace falta.</span>
            </li>
            <li>
              <Gauge size={16} aria-hidden="true" /> <span><b>Opción B · pip o pipx:</b> para cualquier sistema con Python. pipx lo instala aislado.</span>
            </li>
          </ul>
        </div>
        <ol className="signal-iar-install">
          <li>
            <strong>1 · Instalá</strong>
            <p className="signal-iar-opt">
              <b>Opción A · Homebrew</b>
            </p>
            <CopyCommand command="brew install Mgobeaalcoba/tap/ia-router" label="Homebrew" />
            <p className="signal-iar-opt">
              <b>Opción B · pipx (o pip)</b>
            </p>
            <CopyCommand command="pipx install ia-router" label="pipx" />
            <CopyCommand command="python3 -m pip install --user ia-router" label="pip" />
            <p>
              ¿No tenés pipx? <code>brew install pipx &amp;&amp; pipx ensurepath</code> en macOS, o <code>python3 -m pip install --user pipx</code> en otros sistemas.
            </p>
          </li>
          <li>
            <strong>2 · Verificá</strong>
            <CopyCommand command="ia-router --version" />
            <CopyCommand command="ia-router doctor" />
            <p>
              <code>doctor</code> muestra qué CLIs tenés instalados y qué modelo usa cada uno, sin gastar cuota. Si dice <code>command not found</code>, ejecutá{' '}
              <code>pipx ensurepath</code> y abrí una terminal nueva.
            </p>
          </li>
          <li>
            <strong>3 · Abrilo</strong>
            <CopyCommand command="ia-router" />
            <p>La primera vez te pregunta antes de gastar algo: detecta qué modelo usa cada CLI y, si las métricas son viejas, ofrece actualizarlas.</p>
          </li>
          <li>
            <strong>4 · (Opcional) Sumá velocidad y costo</strong>
            <p>
              Creá una clave gratuita en{' '}
              <a href="https://artificialanalysis.ai/" target="_blank" rel="noopener noreferrer">
                artificialanalysis.ai
              </a>{' '}
              y guardala en un archivo <code>.env</code>:
            </p>
            <CopyCommand command="mkdir -p ~/.ia-router && echo 'ARTIFICIAL_ANALYSIS_API_KEY=tu_clave' > ~/.ia-router/.env" />
            <CopyCommand command="ia-router metrics refresh" />
          </li>
          <li>
            <strong>Actualizar y desinstalar</strong>
            <p>
              Homebrew: <code>brew upgrade ia-router</code> · <code>brew uninstall ia-router</code>
              <br />
              pipx: <code>pipx upgrade ia-router</code> · <code>pipx uninstall ia-router</code>
              <br />
              pip: <code>python3 -m pip install -U ia-router</code> · <code>python3 -m pip uninstall ia-router</code>
            </p>
            <p>Desinstalar no borra tus datos (<code>~/.ia-router</code>).</p>
          </li>
        </ol>
      </section>

      <section className="signal-iar-section" aria-labelledby="iar-limits">
        <div className="signal-iar-section__head">
          <span className="signal-eyebrow">Con honestidad</span>
          <h2 id="iar-limits">Lo que conviene saber.</h2>
        </div>
        <ul className="signal-iar-limits">
          <li>
            <b>Arena mide preferencia humana</b>, no si la respuesta es correcta. Por eso se complementa con benchmarks con respuesta correcta cuando hay clave.
          </li>
          <li>
            <b>Con modelos de frontera, la precisión suele empatar</b> dentro del margen de error. Ahí desempatan la velocidad y el costo.
          </li>
          <li>
            <b>El costo es el precio de lista por token</b>: un proxy del consumo de cuota, no tu cuota real de suscripción.
          </li>
          <li>
            <b>Mide modelos, no tu CLI.</b> Cada CLI puede correr con otro nivel de esfuerzo que el del ranking; se marca como aproximado.
          </li>
        </ul>
      </section>

      <section className="signal-service-faq" id="faq" aria-labelledby="iar-faq">
        <div>
          <span className="signal-eyebrow">Preguntas</span>
          <h2 id="iar-faq">Lo que suelen preguntar.</h2>
        </div>
        <div>
          {IAR_FAQ.map((item, index) => (
            <details key={item.question} data-analytics={`iar_faq_${index + 1}`} data-analytics-surface="iar_faq">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="signal-section signal-final-cta">
        <div className="signal-final-cta__panel">
          <span className="signal-eyebrow">Probalo</span>
          <h2>Dejá de elegir a ojo.</h2>
          <p>Instalalo, abrilo y mirá qué elige para cada tipo de tarea y por qué. Si querés este criterio para tu equipo, hablemos.</p>
          <div className="signal-iar-actions">
            <a className="signal-offer-button" href="#instalar" data-analytics="iar_final_install">
              Instalar ia-router <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link className="signal-button signal-button--secondary" href="/servicios/" data-analytics="iar_final_services">
              Ver servicios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
