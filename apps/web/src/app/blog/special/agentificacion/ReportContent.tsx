'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Bot, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler
);

type Bi = { es: string; en: string };
const bi = (es: string, en: string): Bi => ({ es, en });
const pick = (b: Bi, l: Language) => b[l];

const C = {
  red: '#f85149', blue: '#58a6ff', green: '#3fb950', yellow: '#d29922',
  purple: '#bc8cff', orange: '#ffa657',
  redA: 'rgba(248,81,73,0.15)', blueA: 'rgba(88,166,255,0.15)',
  greenA: 'rgba(63,185,80,0.15)', yellowA: 'rgba(210,153,34,0.15)',
  purpleA: 'rgba(188,140,255,0.15)', orangeA: 'rgba(255,166,87,0.15)',
};

const GRID_COLOR = 'rgba(48,54,61,0.7)';
const AXIS_COLOR = '#8b949e';

const baseBarOpts = (yCallback: (v: number | string) => string) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { callback: yCallback, color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
    x: { grid: { display: false }, ticks: { color: AXIS_COLOR } },
  },
});

function Section({ num, title, subtitle, children }: { num: number; title: string; subtitle: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-sm font-extrabold text-emerald-400 shrink-0">{num}</div>
        <div>
          <h2 className="text-xl font-bold report-heading">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Card({ title, subtitle, children, className = '' }: { title?: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 mb-6 ${className}`}>
      {title && <h3 className="text-base font-bold report-heading mb-1">{title}</h3>}
      {subtitle && <p className="text-xs text-gray-500 mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}

function Analysis({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 rounded-r-lg border-l-[3px] border-emerald-500 bg-emerald-500/5 px-5 py-4 text-sm leading-relaxed text-gray-400 report-analysis">{children}</div>;
}

function HighlightBox({ variant, title, children }: { variant: 'red' | 'green'; title: string; children: React.ReactNode }) {
  const styles = variant === 'red' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400';
  return (
    <div className={`rounded-xl border p-5 ${styles}`}>
      <h4 className="text-sm font-bold mb-2">{title}</h4>
      <div className="text-xs text-gray-400 leading-relaxed report-hl-body">{children}</div>
    </div>
  );
}

/* ================================================================
   BILINGUAL DATA
   ================================================================ */

const KPIS = [
  { value: '31', label: bi('Repos y directorios relevados', 'Repos & directories assessed'), sub: bi('Barrido completo de un ecosistema en una jornada', 'Full ecosystem sweep in one day'), color: C.blue },
  { value: '23', label: bi('Con el kit de agentificación', 'With the agentification kit'), sub: bi('AGENTS.md + puentes + memoria, solo agregados', 'AGENTS.md + bridges + memory, additions only'), color: C.green },
  { value: '19', label: bi('Hooks de secretos activos', 'Secret-scanning hooks active'), sub: bi('14 directos + 5 con lista blanca revisada', '14 direct + 5 with reviewed allowlist'), color: C.purple },
  { value: '−28,6%', label: bi('Wall-clock con AGENTS.md', 'Wall-clock with AGENTS.md'), sub: bi('Estudio pareado: 10 repos, 124 PRs', 'Paired study: 10 repos, 124 PRs'), color: C.yellow },
  { value: '+19%', label: bi('Tiempo real en el RCT de METR', 'Real time in METR RCT'), sub: bi('Los devs creían haberse acelerado 20%', 'Developers believed they were 20% faster'), color: C.red },
];

const TIMELINE = [
  { date: bi('Mayo 2025', 'May 2025'), title: bi('Nace AGENT.md (Amp)', 'AGENT.md is born (Amp)'), body: bi('El primer formato de instrucciones por repositorio aparece como AGENT.md, antes de que la industria convergiera en un nombre común.', 'The first per-repository instruction format appears as AGENT.md, before the industry converged on a common name.'), color: C.blue },
  { date: bi('Agosto 2025', 'August 2025'), title: bi('La industria converge en AGENTS.md', 'The industry converges on AGENTS.md'), body: bi('Amp adopta el nombre (20/08) y Copilot agrega soporte nativo (28/08). Hoy lo leen Codex, Cursor, Jules, Gemini CLI y más de 20 herramientas.', 'Amp adopts the name (Aug 20) and Copilot adds native support (Aug 28). Today it is read by Codex, Cursor, Jules, Gemini CLI and 20+ tools.'), color: C.blue },
  { date: bi('Octubre 2025', 'October 2025'), title: bi('Anthropic lanza Agent Skills', 'Anthropic launches Agent Skills'), body: bi('Conocimiento procedural portable con carga bajo demanda: ~100 tokens de metadata por skill y cuerpo recomendado de menos de 5.000 tokens.', 'Portable procedural knowledge loaded on demand: ~100 metadata tokens per skill and a recommended body under 5,000 tokens.'), color: C.purple },
  { date: bi('Noviembre 2025', 'November 2025'), title: bi('Primeros estudios a escala', 'First studies at scale'), body: bi('Un paper releva 2.303 archivos de contexto en 1.925 repos: test (75,9%), implementación (70,8%) y arquitectura (68,1%) frecuentes — con huecos en seguridad (14,8%).', 'A paper surveys 2,303 context files across 1,925 repos: tests (75.9%), implementation (70.8%) and architecture (68.1%) are frequent — with gaps in security (14.8%).'), color: C.yellow },
  { date: bi('09/12/2025', '12/09/2025'), title: bi('Nace la Agentic AI Foundation', 'The Agentic AI Foundation is born'), body: bi('La Linux Foundation pasa a custodiar AGENTS.md junto con MCP y Goose: los tres artefactos que hoy configuran un repositorio.', 'The Linux Foundation takes custody of AGENTS.md along with MCP and Goose: the three artifacts that configure a repository today.'), color: C.green },
  { date: bi('18/12/2025', '12/18/2025'), title: bi('Agent Skills se vuelve estándar abierto', 'Agent Skills becomes an open standard'), body: bi('Microsoft y OpenAI lo adoptan en 48 horas. Hacia julio de 2026 hay 56.804 skills públicas en 1.133 repos.', 'Microsoft and OpenAI adopt it within 48 hours. By July 2026 there are 56,804 public skills across 1,133 repos.'), color: C.purple },
  { date: bi('21/01/2026', '01/21/2026'), title: bi('Factory lanza "Agent Readiness"', 'Factory launches "Agent Readiness"'), body: bi('Un framework de 8 ejes y 5 niveles comercializa la etiqueta. GitLab, Harness y Cloudflare la usan con sentidos distintos: no existe una spec única.', 'An 8-axis, 5-level framework commercializes the label. GitLab, Harness and Cloudflare use it with different meanings: there is no single spec.'), color: C.orange },
  { date: bi('Abril 2026', 'April 2026'), title: bi('La evidencia se contradice (y el costo aparece)', 'The evidence contradicts itself (and cost shows up)'), body: bi('Un estudio pareado mide −28,6% de wall-clock con AGENTS.md; otro mide más de 20% de costo de inferencia en promedio. La resolución: contenido y métrica.', 'A paired study measures −28.6% wall-clock with AGENTS.md; another measures over 20% average inference cost. The resolution: content and measurement.'), color: C.yellow },
  { date: bi('02/08/2026', '08/02/2026'), title: bi('El EU AI Act se aplica de forma general', 'The EU AI Act applies generally'), body: bi('Sin clasificar a los agentes de código como alto riesgo per se, pero con obligaciones de transparencia y gobierno ya vigentes.', 'Without classifying coding agents as high-risk per se, but with transparency and governance obligations already in force.'), color: C.red },
  { date: bi('17/10/2026', '10/17/2026'), title: bi('Corte del informe + piloto MGATC', 'Report cutoff + MGATC pilot'), body: bi('31 repositorios y directorios relevados y agentificados en una jornada, con verificación posterior y cero credenciales versionadas.', '31 repositories and directories assessed and agentified in one day, with post-verification and zero committed credentials.'), color: C.green },
];

const AGENTS_TABLE = [
  { agent: bi('Copilot cloud agent', 'Copilot cloud agent'), env: bi('VM efímera sobre Actions', 'Ephemeral VM on Actions'), limits: bi('1 repo · 1 rama · 1 PR · ≤59 min', '1 repo · 1 branch · 1 PR · ≤59 min') },
  { agent: bi('Codex Cloud', 'Codex Cloud'), env: bi('VM por tarea (2–4 vCPU)', 'VM per task (2–4 vCPU)'), limits: bi('Multi-repo · estado 7 días', 'Multi-repo · 7-day state') },
  { agent: bi('Claude Code cloud', 'Claude Code cloud'), env: bi('VM aislada o self-hosted', 'Isolated or self-hosted VM'), limits: bi('Solo GitHub · upload <100 MB', 'GitHub only · upload <100 MB') },
  { agent: bi('Cursor Cloud Agents', 'Cursor Cloud Agents'), env: bi('VM por agente', 'VM per agent'), limits: bi('Multi-repo · read-write', 'Multi-repo · read-write') },
  { agent: bi('Devin', 'Devin'), env: bi('Sesión con IDE/shell/browser', 'IDE/shell/browser session'), limits: bi('≈3 h por tarea', '≈3 h per task') },
];

const PILOT_KIT = [
  { title: bi('Punto de entrada canónico', 'Canonical entrypoint'), body: bi('AGENTS.md corto por repo (12 agregados), como mapa hacia docs/ — no como enciclopedia.', 'Short AGENTS.md per repo (12 added), as a map into docs/ — not an encyclopedia.') },
  { title: bi('Puentes multi-agente', 'Multi-agent bridges'), body: bi('CLAUDE.md con import, GEMINI.md y copilot-instructions: cada agente lee el mismo contrato.', 'CLAUDE.md with import, GEMINI.md and copilot-instructions: every agent reads the same contract.') },
  { title: bi('Memoria de continuidad', 'Continuity memory'), body: bi('STATE (estado real), LOG (qué pasó y por qué) y DECISIONS: retomar sin arqueología.', 'STATE (real status), LOG (what happened and why) and DECISIONS: resume with no archaeology.') },
  { title: bi('Guardas de seguridad', 'Security guardrails'), body: bi('Escaneo de secretos + hook pre-commit en 19 repos (14 directos, 5 con lista blanca revisada).', 'Secret scanning + pre-commit hook in 19 repos (14 direct, 5 with a reviewed allowlist).') },
  { title: bi('Protocolo de arranque y cierre', 'Start and close protocol'), body: bi('Reglas anti-conflicto entre agentes y handoff de sesión: quién escribió qué y desde dónde seguir.', 'Anti-conflict rules between agents and session handoff: who wrote what and where to continue.') },
  { title: bi('Solo agregados', 'Additions only'), body: bi('Ninguna estructura existente se reescribió; 2 repos ocultaban el kit con reglas de .gitignore y quedó resuelto.', 'No existing structure was rewritten; 2 repos were hiding the kit behind .gitignore rules and it was resolved.') },
];

/* ================================================================
   CHART DATA
   ================================================================ */

function buildChartData(lang: Language) {
  const w = (es: string, en: string) => lang === 'es' ? es : en;

  const metr = {
    labels: [w('Creían haberse acelerado', 'Believed they were faster'), w('Tiempo real medido', 'Actual measured time')],
    datasets: [{ label: w('Variación', 'Change'), data: [-20, 19], backgroundColor: [C.greenA, C.redA], borderColor: [C.green, C.red], borderWidth: 2, borderRadius: 6 }],
  };

  const paired = {
    labels: [w('Wall-clock', 'Wall-clock'), w('Tokens de salida', 'Output tokens')],
    datasets: [{ label: w('Variación', 'Change'), data: [-28.64, -16.58], backgroundColor: [C.greenA, C.blueA], borderColor: [C.green, C.blue], borderWidth: 2, borderRadius: 6 }],
  };

  const antipatterns = {
    labels: ['Lint leakage', 'Context bloat', 'Skill leakage'],
    datasets: [{ label: w('% de repos', '% of repos'), data: [62, 42, 35], backgroundColor: [C.redA, C.yellowA, C.purpleA], borderColor: [C.red, C.yellow, C.purple], borderWidth: 2, borderRadius: 6 }],
  };

  const guardrails = {
    labels: [w('Guardrails ejecutables', 'Executable guardrails'), w('Solo prompt', 'Prompt only'), w('Reflexión', 'Reflection')],
    datasets: [{ label: w('Cumplimiento', 'Compliance'), data: [88.3, 67.0, 50.3], backgroundColor: [C.greenA, C.yellowA, C.redA], borderColor: [C.green, C.yellow, C.red], borderWidth: 2, borderRadius: 6 }],
  };

  const pilot = {
    labels: [w('Relevados', 'Assessed'), w('Kit completo', 'Full kit'), w('Hook de secretos', 'Secrets hook'), w('Sincronizados', 'Synced')],
    datasets: [{ label: w('Repos / directorios', 'Repos / directories'), data: [31, 23, 19, 22], backgroundColor: [C.blueA, C.greenA, C.purpleA, C.yellowA], borderColor: [C.blue, C.green, C.purple, C.yellow], borderWidth: 2, borderRadius: 8 }],
  };

  return { metr, paired, antipatterns, guardrails, pilot };
}

const SOURCES = [
  { label: 'agents.md — estándar de facto para instrucciones de agentes', url: 'https://agents.md/' },
  { label: 'agentskills.io — Agent Skills specification', url: 'https://agentskills.io/specification' },
  { label: 'OpenAI — Harness engineering (AGENTS.md corto como mapa)', url: 'https://openai.com/index/harness-engineering' },
  { label: 'Anthropic — Effective context engineering for AI agents', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
  { label: 'Anthropic — Claude Code best practices', url: 'https://www.anthropic.com/engineering/claude-code-best-practices' },
  { label: 'claude.dev — Solving code review at Anthropic', url: 'https://claude.dev/blog/solving-code-review-at-anthropic/' },
  { label: 'METR — RCT: desarrolladores expertos, 246 issues reales', url: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/' },
  { label: 'DORA 2025 — State of AI-assisted software development', url: 'https://dora.dev/research/2025/dora-report/' },
  { label: 'arXiv — Do context files help? (2602.11988)', url: 'https://arxiv.org/abs/2602.11988' },
  { label: 'arXiv — AGENTS.md paired study, 124 PRs (2601.20404)', url: 'https://arxiv.org/html/2601.20404v2' },
  { label: 'arXiv — Survey de archivos de contexto (2511.12884)', url: 'https://arxiv.org/abs/2511.12884' },
  { label: 'arXiv — Antipatrones en 100 repos (2606.15828)', url: 'https://arxiv.org/abs/2606.15828' },
  { label: 'arXiv — Guardrails ejecutables vs prompt (2603.00822)', url: 'https://arxiv.org/abs/2603.00822' },
  { label: 'arXiv — Validación de parches de agentes (2610.18004)', url: 'https://arxiv.org/abs/2610.18004' },
  { label: 'arXiv — Fidelidad de harnesses de validación (2610.16870)', url: 'https://arxiv.org/abs/2610.16870' },
  { label: 'Chroma — Context rot (18 modelos)', url: 'https://research.trychroma.com/context-rot' },
  { label: 'Thoughtworks Radar vol. 34 — Agent instruction bloat en Caution', url: 'https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2026/04/tr_technology_radar_vol_34_en.pdf' },
  { label: 'GitHub Docs — Third-party coding agents', url: 'https://docs.github.com/en/copilot/concepts/agent-capabilities/about-agents/about-third-party-coding-agents' },
  { label: 'Comment and Control — inyección en las tres capas de Copilot Agent', url: 'https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/' },
  { label: 'Wiz — s1ngularity: ataque a la cadena de suministro de Nx', url: 'https://www.wiz.io/blog/s1ngularity-supply-chain-attack' },
  { label: 'OWASP — AI Agent and MCP Security', url: 'https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-5-AI-Agent-and-MCP-Security/' },
  { label: 'OWASP GenAI — Top 10 for Agentic Applications 2026', url: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/' },
  { label: 'CISA/NSA/ACSC — Secure adoption of agentic AI', url: 'https://www.cisa.gov/news-events/news/cisa-us-and-international-partners-release-guide-secure-adoption-agentic-ai' },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function ReportContent() {
  const { lang } = useLanguage();
  const t = (es: string, en: string) => lang === 'es' ? es : en;
  const charts = buildChartData(lang);

  return (
    <div className="pt-28 pb-12">
      {/* Hero */}
      <section className="report-hero border-b border-white/10 px-4 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-sky-500/5 to-purple-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-5">
            {t('Análisis · Octubre 2026', 'Analysis · October 2026')}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 special-report-title">
            {t('Agentificación', 'Agentification')}
            <br />
            <span className="text-2xl sm:text-3xl opacity-80">{t('Cómo preparar tu código para que la IA trabaje con contexto', 'Getting your codebase ready for AI agents to work with context')}</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10">
            {t(
              'Qué dice la evidencia 2025–2026 sobre contexto, verificación y seguridad de agentes — y el caso piloto real: un ecosistema completo de 31 repositorios y directorios agentificado en una jornada.',
              'What 2025–2026 evidence says about agent context, verification and security — plus the real pilot: a full ecosystem of 31 repositories and directories agentified in one day.'
            )}
          </p>

          <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto">
            {KPIS.map((kpi, i) => (
              <div key={i} className="glass rounded-xl px-6 py-4 min-w-[160px] max-w-[210px] text-center glow-border">
                <div className="text-3xl font-extrabold leading-none mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{pick(kpi.label, lang)}</div>
                <div className="text-[11px] text-gray-600 mt-1">{pick(kpi.sub, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* S1 — Reality check */}
        <Section num={1} title={t('Qué promete la IA en el código y qué dice la evidencia', 'What AI promises for code and what the evidence says')} subtitle={t('Contexto, productividad y el espejismo de la velocidad · Fuentes: METR, DORA 2025, arXiv 2025–2026', 'Context, productivity and the speed illusion · Sources: METR, DORA 2025, arXiv 2025–2026')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('El experimento que incomoda a todos', 'The experiment that makes everyone uncomfortable')} subtitle={t('RCT de METR: 16 desarrolladores expertos, 246 issues reales en repos maduros', 'METR RCT: 16 experienced developers, 246 real issues in mature repos')}>
              <div className="h-[300px]"><Bar data={charts.metr} options={{ ...baseBarOpts((v) => `${v}%`), plugins: { legend: { display: false } } }} /></div>
              <p className="text-[11px] text-gray-600 italic mt-3">{t('* Negativo = más rápido. La IA aumentó 19% el tiempo real, pero los devs sentían que habían ido 20% más rápido.', '* Negative = faster. AI increased real time by 19%, yet developers felt they had gone 20% faster.')}</p>
              <Analysis>
                {t(
                  'El hallazgo no es "la IA no sirve": es que la percepción de velocidad no es una métrica. DORA 2025 lo sintetiza: la IA es amplificador de fortalezas y debilidades existentes, y la adopción es un problema de sistemas, no de herramientas.',
                  'The finding is not "AI is useless": it is that perceived speed is not a metric. DORA 2025 synthesizes it: AI amplifies existing strengths and weaknesses, and adoption is a systems problem, not a tools problem.'
                )}
              </Analysis>
            </Card>
            <Card title={t('Las dos verdades que hay que sostener a la vez', 'The two truths you must hold at once')} subtitle={t('La contradicción central de los archivos de contexto', 'The central contradiction of context files')}>
              <div className="grid grid-cols-1 gap-4">
                <HighlightBox variant="red" title={t('En contra', 'Against')}>
                  <p>• {t('Los archivos de contexto no mejoran en general la tasa de éxito y encarecen la inferencia', 'Context files do not generally improve success rates and make inference more expensive')} <strong>&gt;20% {t('en promedio', 'on average')}</strong> ({t('arXiv 2602.11988', 'arXiv 2602.11988')})</p>
                  <p className="mt-2">• {t('Los "repository overviews" no sirven: las instrucciones sí se siguen, pero cada token siempre cargado se paga en cada ronda y las reglas irrelevantes reducen el cumplimiento.', '"Repository overviews" do not work: instructions are followed, but every always-loaded token is paid on every turn and irrelevant rules reduce compliance.')}</p>
                  <p className="mt-2">• <strong>23,0%</strong> {t('de 356 repos tenía referencias a código inexistente: los archivos de contexto también envejecen.', 'of 356 repos referenced code that no longer exists: context files decay too.')}</p>
                </HighlightBox>
                <HighlightBox variant="green" title={t('A favor', 'In favor')}>
                  <p>• {t('En un diseño pareado de 10 repos y 124 PRs, AGENTS.md dio', 'In a paired design across 10 repos and 124 PRs, AGENTS.md delivered')} <strong>−28,64% wall-clock</strong> {t('y', 'and')} <strong>−16,58% {t('tokens de salida', 'output tokens')}</strong> ({t('significativo, Wilcoxon p&lt;0,05', 'significant, Wilcoxon p&lt;0.05')})</p>
                  <p className="mt-2">• {t('El antídoto al bloat es conocido: un AGENTS.md de ~100 líneas que funciona como mapa hacia docs/, con procedimiento en skills de carga on demand.', 'The antidote to bloat is known: a ~100-line AGENTS.md that acts as a map into docs/, with procedures in on-demand skills.')}</p>
                </HighlightBox>
              </div>
            </Card>
          </div>
          <Card title={t('Dónde está el cuello de botella real: la verificación', 'Where the real bottleneck is: verification')} subtitle={t('Los números más duros de la literatura 2026', 'The hardest numbers in the 2026 literature')}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { v: '59,29%', l: t('reproduce la transición de referencia', 'reproduces the reference transition'), s: '619 tareas, 82.579 parches' },
                { v: '9,21%', l: t('de validación conjunta (la mejor config.)', 'joint validation (best config.)'), s: t('"suite verde" = proxy débil', '"green suite" = weak proxy') },
                { v: '≤63%', l: t('fidelidad máxima de los harnesses propios', 'max fidelity of self-built harnesses'), s: '291 tareas' },
                { v: '88,3%', l: t('de cumplimiento con guardrails ejecutables', 'compliance with executable guardrails'), s: t('vs 67,0% prompt · 50,3% reflexión', 'vs 67.0% prompt · 50.3% reflection') },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-extrabold report-heading mb-1">{item.v}</div>
                  <div className="text-[11px] text-gray-400 leading-relaxed">{item.l}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{item.s}</div>
                </div>
              ))}
            </div>
            <Analysis>
              {t(
                'Traducción para decidir: si no podés verificarlo, no lo shippees. Lo crítico vive en hooks y CI (determinista), no en el prompt; y una suite verde de un agente es evidencia débil de corrección. Los guardrails ejecutables lograron 3,4x menos costo de feedback que la reflexión.',
                'Decision-ready translation: if you cannot verify it, do not ship it. Critical rules live in hooks and CI (deterministic), not in prompts; and a green suite from an agent is weak evidence of correctness. Executable guardrails achieved 3.4x lower feedback cost than reflection.'
              )}
            </Analysis>
          </Card>
        </Section>

        {/* S2 — What agentification is */}
        <Section num={2} title={t('Qué es agentificar un repositorio (y qué no)', 'What agentifying a repository is (and is not)')} subtitle={t('"Preparado para agentes" vs "operado por agentes": dos problemas, dos modelos de riesgo', '"Ready for agents" vs "operated by agents": two problems, two risk models')}>
          <Card title={t('Dos sentidos que conviene no mezclar', 'Two meanings best kept apart')} subtitle={t('No hay spec única: es una etiqueta comercial con autoridad normativa cero', 'There is no single spec: it is a commercial label with zero normative authority')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HighlightBox variant="green" title={t('Preparado para agentes (agent readiness)', 'Ready for agents (agent readiness)')}>
                <p>{t('Documentación operativa cerca del código, entorno determinista, verificación como contrato y límites explícitos. Es lo que estandarizaron AGENTS.md y Agent Skills, y lo que resuelve el grueso del trabajo diario.', 'Operational documentation next to the code, a deterministic environment, verification as a contract and explicit limits. This is what AGENTS.md and Agent Skills standardized, and where most day-to-day value sits.')}</p>
              </HighlightBox>
              <HighlightBox variant="red" title={t('Operado por agentes (agentic repository)', 'Operated by agents (agentic repository)')}>
                <p>{t('El repo pasa a ser un sistema activo que razona y decide: cambian permisos, throughput y gobierno, con modelo de amenaza propio (inyección, robo de tokens, exfiltración). Se resuelve en infraestructura —una VM efímera por tarea, una rama y un PR revisable—, no en el prompt.', 'The repo becomes an active system that reasons and decides: permissions, throughput and governance change, with its own threat model (injection, token theft, exfiltration). It is solved in infrastructure — an ephemeral VM per task, a branch and a reviewable PR — not in prompts.')}</p>
              </HighlightBox>
            </div>
            <Analysis>
              {t(
                'La etiqueta se comercializó rápido: Factory lanzó "Agent Readiness" el 21/01/2026 (8 ejes, 5 niveles) y GitLab, Harness y Cloudflare la usan con sentidos distintos. La distinción operativa que importa es la de arriba.',
                'The label went to market fast: Factory launched "Agent Readiness" on 01/21/2026 (8 axes, 5 levels) and GitLab, Harness and Cloudflare use it in different senses. The operational distinction above is the one that matters.'
              )}
            </Analysis>
          </Card>

          <Card title={t('Cómo se estandarizó la capa de contexto (2025–2026)', 'How the context layer standardized (2025–2026)')} subtitle={t('Los hitos verificables que llevaron al estado actual', 'The verifiable milestones that led to today')}>
            <div className="relative pl-8">
              <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-emerald-500 to-yellow-500" />
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative mb-7">
                  <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-900" style={{ background: item.color }} />
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: item.color }}>{pick(item.date, lang)}</div>
                  <div className="text-sm font-bold report-heading mb-1">{pick(item.title, lang)}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{pick(item.body, lang)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={t('Dónde corre un agente hoy', 'Where agents run today')} subtitle={t('Estados declarados al 17/10/2026 · GitHub es el único plano de control multi-agente', 'States as declared on 10/17/2026 · GitHub is the only multi-agent control plane')}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-4 font-semibold">{t('Agente', 'Agent')}</th>
                    <th className="py-2 pr-4 font-semibold">{t('Entorno', 'Environment')}</th>
                    <th className="py-2 font-semibold">{t('Límites declarados', 'Declared limits')}</th>
                  </tr>
                </thead>
                <tbody>
                  {AGENTS_TABLE.map((row, i) => (
                    <tr key={i} className="border-t border-white/5 text-gray-400">
                      <td className="py-2.5 pr-4 font-semibold report-heading">{pick(row.agent, lang)}</td>
                      <td className="py-2.5 pr-4">{pick(row.env, lang)}</td>
                      <td className="py-2.5">{pick(row.limits, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Analysis>
              {t(
                'Patrón universal: rama propia → commits → PR revisable, con el entorno configurado desde el repo. La paralelización escala, pero orquestar sigue siendo humano: ningún producto resuelve conflictos entre tareas paralelas automáticamente.',
                'Universal pattern: own branch → commits → reviewable PR, with the environment configured from the repo. Parallelization scales, but orchestration stays human: no product automatically resolves conflicts between parallel tasks.'
              )}
            </Analysis>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S3 — Evidence charts */}
        <Section num={3} title={t('La evidencia en gráficos', 'The evidence in charts')} subtitle={t('Qué funciona, qué no y en qué orden invertir · arXiv, Thoughtworks, revisión de código a escala', 'What works, what does not and in what order to invest · arXiv, Thoughtworks, code review at scale')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('El costo de hacerlo mal: antipatrones medidos', 'The cost of getting it wrong: measured antipatterns')} subtitle={t('Frecuencia en 100 repositorios populares (arXiv 2606.15828)', 'Frequency across 100 popular repositories (arXiv 2606.15828)')}>
              <div className="h-[300px]"><Bar data={charts.antipatterns} options={{ ...baseBarOpts((v) => `${v}%`), plugins: { legend: { display: false } } }} /></div>
              <p className="text-[11px] text-gray-600 italic mt-3">{t('* Lint leakage: reglas de lint que el agente ignora o esquiva. Context bloat: contexto inflado. Skill leakage: procedimientos que se filtran a donde no van.', '* Lint leakage: lint rules the agent ignores or dodges. Context bloat: inflated context. Skill leakage: procedures leaking where they do not belong.')}</p>
            </Card>
            <Card title={t('Qué mueve la aguja: enforcement determinista', 'What moves the needle: deterministic enforcement')} subtitle={t('Cumplimiento de reglas según mecanismo (arXiv 2603.00822)', 'Rule compliance by mechanism (arXiv 2603.00822)')}>
              <div className="h-[300px]"><Bar data={charts.guardrails} options={{ ...baseBarOpts((v) => `${v}%`), plugins: { legend: { display: false } } }} /></div>
              <p className="text-[11px] text-gray-600 italic mt-3">{t('* Guardrails ejecutables: AST, shims y validadores de arquitectura. 3,4x menos costo de feedback que la reflexión.', '* Executable guardrails: AST, shims and architecture validators. 3.4x lower feedback cost than reflection.')}</p>
            </Card>
          </div>
          <Card title={t('El estudio pareado: con y sin archivo de contexto', 'The paired study: with and without a context file')} subtitle={t('10 repos, 124 PRs, Codex · Variación mediana con AGENTS.md (arXiv 2601.20404)', '10 repos, 124 PRs, Codex · Median change with AGENTS.md (arXiv 2601.20404)')}>
            <div className="h-[280px]"><Bar data={charts.paired} options={{ ...baseBarOpts((v) => `${v}%`), plugins: { legend: { display: false } } }} /></div>
            <Analysis>
              {t(
                'Rinde en eficiencia cuando aporta convenciones no inferibles del código — y no midió correctitud. El punto de partida para cualquier proyecto serio: medir con corridas pareadas, no con entusiasmo.',
                'It pays off in efficiency when it contributes conventions that are not inferable from code — and it did not measure correctness. The starting point for any serious project: measure with paired runs, not enthusiasm.'
              )}
            </Analysis>
          </Card>
        </Section>

        {/* S4 — Security */}
        <Section num={4} title={t('La seguridad se decide en las capacidades', 'Security is decided in capabilities')} subtitle={t('No en el prompt: el modelo de amenaza es datos privados + contenido no confiable + capacidad de acción', 'Not in the prompt: the threat model is private data + untrusted content + ability to act')}>
          <Card title={t('El orden de eficacia (en este orden)', 'The order of effectiveness (in this order)')} subtitle={t('OWASP, CISA/NSA/ACSC, GitHub · lo que dicen los incidentes reales', 'OWASP, CISA/NSA/ACSC, GitHub · what real incidents show')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { n: '01', t: t('Quitar capacidades', 'Remove capabilities'), d: t('Tokens de mínimo privilegio, sin flags de bypass, secretos fuera del contexto (placeholder + proxy).', 'Least-privilege tokens, no bypass flags, secrets out of context (placeholder + proxy).') },
                { n: '02', t: t('Aislar', 'Isolate'), d: t('VM efímera por tarea, egress en allowlist, sandbox con política gestionada. El de Claude Code viene apagado por defecto.', 'Ephemeral VM per task, allowlisted egress, policy-managed sandbox. Claude Code ships it off by default.') },
                { n: '03', t: t('Aprobar', 'Approve'), d: t('Gate humano explícito: el agente nunca aprueba ni mergea su PR. Tiers por riesgo del cambio, no por autor.', 'Explicit human gate: agents never approve or merge their own PR. Tiers by change risk, not by author.') },
                { n: '04', t: t('Detectar', 'Detect'), d: t('Logs centralizados fuera del agente, atribución por PR, provenance/SBOM. Último, no primero.', 'Centralized logs outside the agent, per-PR attribution, provenance/SBOM. Last, not first.') },
              ].map((step) => (
                <div key={step.n} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="text-[10px] font-black tracking-widest text-emerald-400 mb-1">{step.n}</div>
                  <div className="text-sm font-bold report-heading mb-1">{step.t}</div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HighlightBox variant="red" title={t('Incidentes que marcaron el camino', 'Incidents that paved the way')}>
                <p><strong>s1ngularity (Nx, ago 2025):</strong> {t('~1.700 usuarios filtrados y 5.500 repos privados expuestos por un paquete npm malicioso que usó CLIs de IA.', '~1,700 users leaked and 5,500 private repos exposed by a malicious npm package that used AI CLIs.')}</p>
                <p className="mt-2"><strong>CamoLeak (CVSS 9,6):</strong> {t('comentarios HTML invisibles en PRs exfiltraban secretos; corregido el 14/08/2025.', 'invisible HTML comments in PRs exfiltrated secrets; patched on 08/14/2025.')}</p>
                <p className="mt-2"><strong>Comment and Control (15/04/2026):</strong> {t('un título de PR y un comentario oculto rompieron las tres capas de Copilot Agent.', 'a PR title and a hidden comment broke all three Copilot Agent layers.')}</p>
              </HighlightBox>
              <HighlightBox variant="green" title={t('Las reglas que ya son consenso', 'Rules that are already consensus')}>
                <p>• {t('Archivos de instrucciones bajo CODEOWNERS, revisados como código.', 'Instruction files under CODEOWNERS, reviewed as code.')}</p>
                <p className="mt-2">• {t('MCP curado: pin por versión o digest, stdio preferido, OAuth con scopes mínimos, nunca token passthrough.', 'Curated MCP: pin by version or digest, stdio preferred, OAuth with minimal scopes, never token passthrough.')}</p>
                <p className="mt-2">• {t('Ni .env, ni *.pem, ni credentials.json en el contexto. El EU AI Act aplica de forma general desde el 02/08/2026.', 'No .env, no *.pem, no credentials.json in context. The EU AI Act has applied generally since 08/02/2026.')}</p>
              </HighlightBox>
            </div>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S5 — Pilot case */}
        <Section num={5} title={t('Caso piloto: el ecosistema completo de MGATC', 'Pilot case: the full MGATC ecosystem')} subtitle={t('Qué pasa cuando se aplica a un ecosistema real: 31 repositorios y directorios en una jornada', 'What happens when you apply it to a real ecosystem: 31 repositories and directories in one day')}>
          <Card title={t('El resultado en números', 'The result in numbers')} subtitle={t('Datos internos verificados al 17/10/2026: revisados 26 repos git + 5 directorios; kit en 21 repos + 2 directorios; hook en 14 + 5; 22 sincronizados con sus remotos', 'Internally verified data as of 10/17/2026: 26 git repos + 5 directories assessed; kit in 21 repos + 2 directories; hook in 14 + 5; 22 synced with their remotes')}>
            <div className="h-[320px]"><Bar data={charts.pilot} options={{ ...baseBarOpts((v) => String(v)), plugins: { legend: { display: false } } }} /></div>
            <Analysis>
              {t(
                'Barrido completo, de los repositorios de cliente a las herramientas internas: auditoría de solo lectura, aplicación con solo agregados y verificación posterior. Cero credenciales versionadas; las claves existentes migraron a variables de entorno o quedaron documentadas en listas blancas revisadas.',
                'A full sweep, from client repositories to internal tools: read-only audit, additions-only application and post-verification. Zero committed credentials; existing keys were migrated to environment variables or documented in reviewed allowlists.'
              )}
            </Analysis>
          </Card>
          <Card title={t('Qué recibe cada repositorio', 'What every repository receives')} subtitle={t('6 Capas del kit de agentificación', '6 layers of the agentification kit')}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PILOT_KIT.map((item, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <div className="text-xs font-bold report-heading">{pick(item.title, lang)}</div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{pick(item.body, lang)}</p>
                </div>
              ))}
            </div>
            <Analysis>
              {t(
                'Efecto buscado y verificado: cualquier agente —Claude, Codex, Gemini, Copilot u OpenCode— retoma el trabajo leyendo el mismo contrato, sabe qué se hizo y por qué, y no pisa decisiones sin registrarlas. Menos retrabajo, menos fricción y guardas activas desde el primer commit.',
                'Intended and verified effect: any agent — Claude, Codex, Gemini, Copilot or OpenCode — resumes work reading the same contract, knows what was done and why, and does not overwrite decisions without logging them. Less rework, less friction and guardrails active from the first commit.'
              )}
            </Analysis>
          </Card>

          <Link href="/servicios/agentificacion/" className="block glass rounded-2xl p-6 border border-emerald-500/25 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                <Bot size={22} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold report-heading mb-1">
                  {t('¿Querés esto en tu ecosistema?', 'Want this in your ecosystem?')}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t(
                    'El servicio de Agentificación de Repositorios & Apps aplica este kit a tu código: punto de entrada para agentes, memoria de continuidad, puentes multi-agente y guardas de seguridad, con verificación. Alcance y presupuesto a medida.',
                    'The Repository & App Agentification service applies this kit to your code: agent entrypoint, continuity memory, multi-agent bridges and security guardrails, with verification. Scope and quote based on your case.'
                  )}
                </p>
              </div>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S6 — Method */}
        <Section num={6} title={t('Cómo trabajamos: contexto mínimo, permisos y verificación', 'How we work: minimum context, permissions and verification')} subtitle={t('La secuencia de valor real está invertida respecto del entusiasmo', 'The real value sequence is inverted relative to the hype')}>
          <Card title={t('4 pasos, 15 controles priorizados', '4 steps, 15 prioritized controls')} subtitle={t('P0 = sin esto no hay que dejar entrar agentes al ciclo de entrega', 'P0 = without this, agents should not enter the delivery cycle')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { n: '01', t: t('Relevar', 'Assess'), d: t('Mapa del ecosistema, riesgos, duplicación y deuda de contexto. Auditoría de solo lectura.', 'Ecosystem map, risks, duplication and context debt. Read-only audit.') },
                { n: '02', t: t('Aplicar el kit', 'Apply the kit'), d: t('AGENTS.md corto (mapa, no enciclopedia), puentes multi-agente, memoria y hooks de verificación.', 'Short AGENTS.md (a map, not an encyclopedia), multi-agent bridges, memory and verification hooks.') },
                { n: '03', t: t('Verificar', 'Verify'), d: t('Escaneo de secretos, builds, CI y lectura posterior. Si no se puede verificar, no se shippea.', 'Secret scanning, builds, CI and post-verification. If it cannot be verified, it does not ship.') },
                { n: '04', t: t('Operar', 'Operate'), d: t('Runbook, reglas anti-conflicto entre agentes y protocolo de arranque/cierre de sesión.', 'Runbook, anti-conflict rules between agents and a session start/close protocol.') },
              ].map((step) => (
                <div key={step.n} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[10px] font-black tracking-widest text-emerald-400 mb-1">{step.n}</div>
                  <div className="text-sm font-bold report-heading mb-1">{step.t}</div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HighlightBox variant="green" title={t('Los 7 controles P0 (resumen)', 'The 7 P0 controls (summary)')}>
                <p>1. {t('AGENTS.md raíz corto con build/test/estilo', 'Short root AGENTS.md with build/test/style')}</p>
                <p>2. {t('Setup determinista por proveedor', 'Deterministic per-vendor setup')}</p>
                <p>3. {t('Tests rápidos con valor discriminante', 'Fast tests with discriminative power')}</p>
                <p>4. {t('Secretos fuera del contexto y egress en allowlist', 'Secrets out of context and allowlisted egress')}</p>
                <p>5. {t('Archivos de instrucciones bajo CODEOWNERS', 'Instruction files under CODEOWNERS')}</p>
                <p>6. {t('Tokens de mínimo privilegio, pin por SHA, sin bypass', 'Least-privilege tokens, pin by SHA, no bypass')}</p>
                <p>7. {t('Gate humano: el agente nunca aprueba ni mergea su PR', 'Human gate: agents never approve or merge their own PR')}</p>
              </HighlightBox>
              <HighlightBox variant="red" title={t('La regla para retener', 'The rule to remember')}>
                <p>{t('Cada token de contexto, cada tool MCP y cada credencial son deuda de verificación y superficie de ataque a la vez: justificá cada una o quitala.', 'Every context token, every MCP tool and every credential is verification debt and attack surface at once: justify each one or remove it.')}</p>
                <p className="mt-3">{t('Y el orden importa: primero capacidades y enforcement, después el contrato de verificación, y recién al final optimizar el contexto — que es donde casi todos empiezan.', 'And order matters: capabilities and enforcement first, then the verification contract, and only last optimize context — which is where nearly everyone starts.')}</p>
              </HighlightBox>
            </div>
          </Card>
        </Section>

        {/* Conclusion */}
        <Card className="report-conclusion-card border-emerald-500/25">
          <h2 className="text-xl font-extrabold report-heading mb-4">{t('Qué significa esto para tu equipo', 'What this means for your team')}</h2>
          <div className="text-sm text-gray-400 leading-relaxed space-y-4">
            <p>{t(
              'Agentificar no es adoptar una herramienta: es invertir en verificabilidad. Los estándares que ganaron —AGENTS.md y Agent Skills— resolvieron la capa barata (contexto y procedimiento), y la evidencia muestra que rinde sobre todo en eficiencia, no en correctitud.',
              'Agentifying is not adopting a tool: it is investing in verifiability. The standards that won — AGENTS.md and Agent Skills — solved the cheap layer (context and procedure), and evidence shows it mostly pays off in efficiency, not correctness.'
            )}</p>
            <p><strong style={{ color: C.green }}>{t('La secuencia:', 'The sequence:')}</strong> {t('sacar capacidades (tokens, tools, egress) → hacer determinista el enforcement → construir el contrato de verificación → optimizar el contexto. Empezar por el contexto es empezar por el final.', 'remove capabilities (tokens, tools, egress) → make enforcement deterministic → build the verification contract → optimize context. Starting with context means starting at the end.')}</p>
            <p><strong style={{ color: C.yellow }}>{t('El dato que ordena todo:', 'The data point that orders everything:')}</strong> {t('un repo sin tests, sin CI y sin límites verá amplificados exactamente esos defectos. La IA no arregla sistemas: los amplifica.', 'a repo without tests, CI and limits will have exactly those defects amplified. AI does not fix systems: it amplifies them.')}</p>
            <p>{t('Un ecosistema agentificado en una jornada, con verificación y guardas activas, es una decisión de diseño — no una compra de licencias.', 'An ecosystem agentified in a single day, with verification and guardrails active, is a design decision — not a license purchase.')}</p>
          </div>
        </Card>

        {/* Sources */}
        <div className="glass rounded-2xl p-6 mt-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t('Fuentes verificables citadas', 'Verifiable cited sources')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
            {SOURCES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline truncate block">{s.label}</a>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-4 italic">
            {t(
              'Nota metodológica: las cifras de terceros citan su fuente original y se marcan como autoreportadas cuando corresponde (Anthropic, Factory). Las cifras del caso piloto son datos internos de MGATC verificados al 17/10/2026. Este informe no constituye una certificación ni promete resultados: la evidencia 2025–2026 es reciente y parcialmente contradictoria, y así se reporta.',
              'Methodological note: third-party figures cite their original source and are flagged as self-reported where applicable (Anthropic, Factory). Pilot figures are MGATC internal data verified as of 10/17/2026. This report is not a certification and promises no outcomes: 2025–2026 evidence is recent and partly contradictory, and is reported as such.'
            )}
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-medium transition-colors">
            <ArrowLeft size={16} />
            {t('Volver al Blog', 'Back to Blog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
