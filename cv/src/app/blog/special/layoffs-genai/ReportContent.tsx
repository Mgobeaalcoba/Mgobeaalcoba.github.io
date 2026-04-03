'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  purpleA: 'rgba(188,140,255,0.15)',
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

const LEGEND_OPTS = { labels: { font: { size: 11 }, boxWidth: 12, color: AXIS_COLOR } };

function Section({ num, title, subtitle, children }: { num: number; title: string; subtitle: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sm font-extrabold text-sky-400 shrink-0">{num}</div>
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
  return <div className="mt-5 rounded-r-lg border-l-[3px] border-sky-500 bg-sky-500/5 px-5 py-4 text-sm leading-relaxed text-gray-400 report-analysis">{children}</div>;
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

const TIMELINE_DATA = [
  { date: bi('2020–2021', '2020–2021'), title: bi('El Boom Pandémico', 'The Pandemic Boom'), body: bi('Las Big Tech contratan masivamente para la digitalización acelerada. Amazon añade 800K empleados en 2020. Meta, Google y Microsoft casi duplican plantillas. Se estima ~1M de trabajadores en exceso.', 'Big Tech hired massively for accelerated digitalization. Amazon added 800K employees in 2020. Meta, Google and Microsoft nearly doubled headcounts. An estimated ~1M excess workers vs historical trends.'), color: C.yellow, badges: [{ label: bi('Económico', 'Economic'), cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' }, { label: 'Hiring', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }] },
  { date: bi('Noviembre 2022', 'November 2022'), title: bi('ChatGPT lanza GPT-3.5', 'ChatGPT launches GPT-3.5'), body: bi('OpenAI lanza ChatGPT. Alcanza 1M de usuarios en 5 días, 100M en 2 meses. El producto de consumo de más rápida adopción en la historia. Los C-suites comienzan a replantear headcount.', 'OpenAI launches ChatGPT. Reaches 1M users in 5 days, 100M in 2 months. The fastest-adopted consumer product ever. C-suites begin rethinking headcount.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
  { date: bi('Nov 2022 – Feb 2023', 'Nov 2022 – Feb 2023'), title: bi('Primera ola masiva de layoffs tech', 'First massive tech layoff wave'), body: bi('Twitter/X: −50% plantilla. Meta: −11K. Amazon: −18K. Salesforce: −10%. Microsoft: −10K. Google: −12K. Driver principal: sobrecontratación pandémica + alza de tasas de la Fed.', 'Twitter/X: −50% workforce. Meta: −11K. Amazon: −18K. Salesforce: −10%. Microsoft: −10K. Google: −12K. Main driver: pandemic over-hiring + Fed rate hikes.'), color: C.red, badges: [{ label: bi('Ola de Layoffs 1', 'Layoff Wave 1'), cls: 'bg-red-500/15 text-red-400 border-red-500/30' }] },
  { date: bi('Marzo 2023', 'March 2023'), title: bi('GPT-4 y la carrera multimodal', 'GPT-4 and the multimodal race'), body: bi('OpenAI lanza GPT-4 con capacidades multimodales. Google responde con Bard. Anthropic lanza Claude. Las corporaciones mapean qué roles pueden ser automatizados.', 'OpenAI launches GPT-4 with multimodal capabilities. Google responds with Bard. Anthropic launches Claude. Corporations start mapping which roles can be automated.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
  { date: bi('2023 (todo el año)', '2023 (full year)'), title: bi('Pico histórico: ~265K trabajadores despedidos', 'Historic peak: ~265K workers laid off'), body: bi('El peor año registrado. IBM congela 7.800 roles "reemplazables por IA". Razones: corrección post-pandemia + macro adverso + reorganización hacia IA.', 'The worst year on record. IBM freezes 7,800 "AI-replaceable" roles. Reasons: post-pandemic correction + adverse macro + AI reorganization.'), color: C.red, badges: [{ label: bi('Pico Histórico', 'Historic Peak'), cls: 'bg-red-500/15 text-red-400 border-red-500/30' }] },
  { date: bi('Noviembre 2023', 'November 2023'), title: bi('GPTs customizados, agentic workflows', 'Custom GPTs, agentic workflows'), body: bi('OpenAI introduce Custom GPTs y "agentes de IA". Sam Altman: "un mundo donde cada empresa tendrá un equipo de agentes de IA". Esto acelera decisiones de no reponer vacantes.', 'OpenAI introduces Custom GPTs and "AI agents." Sam Altman: "a world where every company will have a team of AI agents." This accelerates decisions not to refill vacancies.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
  { date: bi('Mayo 2024', 'May 2024'), title: bi('GPT-4o: IA en tiempo real, voz y visión', 'GPT-4o: real-time AI, voice and vision'), body: bi('GPT-4o multimodal gratuito. Gemini 1.5 Pro, Claude 3, Llama 3 democratizan el acceso. Deployments masivos de IA en flujos de trabajo.', 'Free multimodal GPT-4o. Gemini 1.5 Pro, Claude 3, Llama 3 democratize access. Massive AI deployments in workflows.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
  { date: '2024', title: bi('Layoffs tech: ~153K — Primeros despidos por IA', 'Tech layoffs: ~153K — First explicit AI-driven cuts'), body: bi('Klarna, Duolingo, IBM citan la IA como razón. Klarna: sus agentes de IA reemplazan 700 agentes humanos. El sector white collar acelera recortes.', 'Klarna, Duolingo, IBM explicitly cite AI as the reason. Klarna: AI agents replace 700 human agents. White collar sector accelerates cuts.'), color: C.red, badges: [{ label: bi('IA como Driver', 'AI as Driver'), cls: 'bg-red-500/15 text-red-400 border-red-500/30' }] },
  { date: bi('Septiembre 2024', 'September 2024'), title: bi('GPT o1: Razonamiento avanzado', 'GPT o1: Advanced reasoning'), body: bi('OpenAI presenta o1 con razonamiento paso a paso. La IA demuestra capacidad para tareas cognitivas complejas: matemáticas, código, análisis jurídico.', 'OpenAI presents o1 with step-by-step reasoning. AI demonstrates capability for complex cognitive tasks: math, code, legal analysis.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
  { date: '2025', title: bi('1.2M anuncios de layoffs — "Forever Layoffs"', '1.2M layoff announcements — "Forever Layoffs"'), body: bi('Fortune acuña "Forever Layoffs". AI citado en 54.836 anuncios. DOGE agrega 293K empleos federales. Crisis golpea Big 4, banca, media simultáneamente.', 'Fortune coins "Forever Layoffs." AI cited in 54,836 announcements. DOGE adds 293K federal jobs. Crisis hits Big 4, banking, media simultaneously.'), color: C.red, badges: [{ label: bi('Recesión WC', 'WC Recession'), cls: 'bg-red-500/15 text-red-400 border-red-500/30' }] },
  { date: bi('Enero–Marzo 2026', 'January–March 2026'), title: bi('Agentes de IA autónomos a escala', 'Autonomous AI agents at scale'), body: bi('Claude 3.7, GPT-4.5, Gemini 2.0, DeepSeek R2 compiten en el espacio agentic. 62% de organizaciones experimenta con AI agents (McKinsey). Q1 2026: 90K+, ritmo anualizado ~360K.', 'Claude 3.7, GPT-4.5, Gemini 2.0, DeepSeek R2 compete in agentic space. 62% of organizations experiment with AI agents (McKinsey). Q1 2026: 90K+, annualized ~360K.'), color: C.purple, badges: [{ label: bi('Hito GenAI', 'GenAI Milestone'), cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }] },
];

const PROJ_DATA = [
  { year: bi('1 año', '1 year'), label: bi('2027: La Aceleración', '2027: The Acceleration'), color: 'text-red-400 border-red-500/35', stat: bi('~15-25% de roles en riesgo', '~15-25% of roles at risk'), statBg: 'bg-red-500/10 text-red-400', text: bi('Sistemas agénticos escalan masivamente. Layoffs tech ~200-350K/año. Roles entry-level en software, análisis y marketing colapsan.', 'Agentic systems scale massively. Tech layoffs ~200-350K/year. Entry-level roles in software, analysis and marketing collapse.') },
  { year: bi('2 años', '2 years'), label: bi('2028: El Punto de Inflexión', '2028: The Inflection Point'), color: 'text-yellow-400 border-yellow-500/35', stat: bi('5-10% desplazamiento neto', '5-10% net displacement'), statBg: 'bg-yellow-500/10 text-yellow-400', text: bi('McKinsey: 30% de horas automatizables para 2030. Empresas con IA: +15-20% productividad. Nuevos roles creados en menor número.', 'McKinsey: 30% of hours automatable by 2030. AI-adopting companies: +15-20% productivity. New roles created in smaller numbers.') },
  { year: bi('5 años', '5 years'), label: bi('2031: Nuevo Equilibrio (Disruptivo)', '2031: New Equilibrium (Disruptive)'), color: 'text-sky-400 border-sky-500/35', stat: bi('Neto +78M empleos (WEF 2025)', 'Net +78M jobs (WEF 2025)'), statBg: 'bg-sky-500/10 text-sky-400', text: bi('WEF: 92M desplazados pero 170M creados. 14% debe cambiar de carrera. Educación universitaria en crisis de relevancia.', 'WEF: 92M displaced but 170M created. 14% must switch careers entirely. University education faces relevance crisis.') },
  { year: bi('10 años', '10 years'), label: bi('2036: Transformación Estructural', '2036: Structural Transformation'), color: 'text-emerald-400 border-emerald-500/35', stat: bi('57% horas automatizables', '57% of work hours automatable'), statBg: 'bg-emerald-500/10 text-emerald-400', text: bi('Goldman Sachs: 300M empleos FTE en riesgo global. Human-AI collaboration domina. Ventajas de productividad 15-40%.', 'Goldman Sachs: 300M FTE jobs at risk globally. Human-AI collaboration dominates. Productivity advantages 15-40%.') },
];

const KPIS = [
  { value: '265K', label: bi('Pico: Layoffs Tech 2023', 'Peak: Tech Layoffs 2023'), sub: bi('El peor año para el sector', 'The worst year for the sector'), color: C.red },
  { value: '1.2M', label: bi('Anuncios despido 2025', 'Layoff announcements 2025'), sub: '+58% vs 2024 (Challenger)', color: C.red },
  { value: '−36%', label: bi('Caída en job postings tech', 'Drop in tech job postings'), sub: bi('vs nivel pre-pandemia', 'vs pre-pandemic level'), color: C.yellow },
  { value: '55K+', label: bi('Layoffs atribuidos a IA', 'Layoffs attributed to AI'), sub: bi('Solo en 2025', 'In 2025 alone'), color: C.purple },
  { value: '300M', label: bi('Empleos en riesgo global', 'Jobs at risk globally'), sub: bi('Proyección Goldman Sachs', 'Goldman Sachs projection'), color: C.blue },
];

/* ================================================================
   CHART DATA (labels are language-dependent, built inside component)
   ================================================================ */

function buildChartData(lang: Language) {
  const w = (es: string, en: string) => lang === 'es' ? es : en;

  const techLayoffs = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026 (Q1)'],
    datasets: [{ label: w('Trabajadores despedidos', 'Workers laid off'), data: [80998, 10536, 165269, 264220, 152922, 245953, 90474], backgroundColor: [C.yellowA, C.greenA, C.redA, C.redA, C.yellowA, C.redA, C.purpleA], borderColor: [C.yellow, C.green, C.red, C.red, C.yellow, C.red, C.purple], borderWidth: 2, borderRadius: 8 }],
  };

  const challenger = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{ label: w('Anuncios de layoff (K)', 'Layoff announcements (K)'), data: [592, 2304, 267, 363, 721, 761, 1206], backgroundColor: [C.blueA, C.redA, C.greenA, C.yellowA, C.redA, C.redA, C.redA], borderColor: [C.blue, C.red, C.green, C.yellow, C.red, C.red, C.red], borderWidth: 2, borderRadius: 6 }],
  };

  const sectors = {
    labels: [w('Gobierno/DOGE', 'Government/DOGE'), w('Tecnología', 'Technology'), 'Industrial', w('Finanzas', 'Finance'), 'Telecom', 'Media', w('Otros', 'Others')],
    datasets: [{ data: [293753, 153536, 120000, 95000, 38035, 17163, 208887], backgroundColor: [C.redA, C.purpleA, C.yellowA, C.blueA, 'rgba(255,166,87,0.15)', C.greenA, 'rgba(48,54,61,0.5)'], borderColor: [C.red, C.purple, C.yellow, C.blue, C.orange, C.green, '#30363d'], borderWidth: 2 }],
  };

  const hiring = {
    labels: ['Feb 2020', 'Jun 2020', w('Dic 2020', 'Dec 2020'), 'Jun 2021', w('Dic 2021', 'Dec 2021'), 'Jun 2022', w('Dic 2022', 'Dec 2022'), 'Jun 2023', w('Dic 2023', 'Dec 2023'), 'Jun 2024', w('Dic 2024', 'Dec 2024'), 'Jul 2025', 'Mar 2026'],
    datasets: [
      { label: w('Total postings tech (índice)', 'Total tech postings (index)'), data: [100, 78, 95, 130, 155, 148, 120, 98, 90, 82, 75, 64, 60], borderColor: C.blue, backgroundColor: C.blueA, tension: 0.4, fill: true, pointRadius: 4 },
      { label: w('Postings con mención IA', 'Postings mentioning AI'), data: [100, 102, 108, 115, 122, 130, 145, 158, 175, 190, 195, 145, 130], borderColor: C.purple, backgroundColor: C.purpleA, tension: 0.4, fill: false, pointRadius: 4, borderDash: [5, 5] },
    ],
  };

  const aiJobs = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025', w('2026 (proy.)', '2026 (proj.)')],
    datasets: [
      { label: w('Roles tech tradicionales (K)', 'Traditional tech roles (K)'), data: [980, 1150, 1100, 890, 720, 650, 580], backgroundColor: C.blueA, borderColor: C.blue, borderWidth: 2, borderRadius: 4 },
      { label: w('Roles orientados a IA (K)', 'AI-oriented roles (K)'), data: [25, 35, 55, 90, 150, 220, 310], backgroundColor: C.purpleA, borderColor: C.purple, borderWidth: 2, borderRadius: 4 },
    ],
  };

  const reasons = {
    labels: ['2022', '2023', '2024', '2025', w('2026 (est.)', '2026 (est.)')],
    datasets: [
      { label: w('Corrección post-pandemia', 'Post-pandemic correction'), data: [65, 45, 25, 15, 8], backgroundColor: C.yellowA, borderColor: C.yellow, borderWidth: 2, borderRadius: 4 },
      { label: w('Macro / tasas / recesión', 'Macro / rates / recession'), data: [25, 35, 30, 25, 20], backgroundColor: C.blueA, borderColor: C.blue, borderWidth: 2, borderRadius: 4 },
      { label: w('Automatización / IA', 'Automation / AI'), data: [5, 12, 28, 45, 58], backgroundColor: C.purpleA, borderColor: C.purple, borderWidth: 2, borderRadius: 4 },
      { label: w('Otros (M&A, DOGE, etc.)', 'Others (M&A, DOGE, etc.)'), data: [5, 8, 17, 15, 14], backgroundColor: 'rgba(48,54,61,0.5)', borderColor: '#30363d', borderWidth: 2, borderRadius: 4 },
    ],
  };

  const projection = {
    labels: ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2035'],
    datasets: [
      { label: w('Histórico real (Tech)', 'Actual history (Tech)'), data: [165, 265, 153, 246, 360, null, null, null, null, null, null, null, null], borderColor: C.red, backgroundColor: 'transparent', tension: 0.3, pointRadius: 5, borderWidth: 2.5 },
      { label: w('Escenario base', 'Base scenario'), data: [null, null, null, 246, 360, 280, 220, 190, 160, 140, 120, 110, 90], borderColor: C.blue, backgroundColor: C.blueA, tension: 0.4, fill: false, pointRadius: 4, borderWidth: 2, borderDash: [8, 4] },
      { label: w('Pesimista (AGI acelerado)', 'Pessimistic (accelerated AGI)'), data: [null, null, null, 246, 360, 380, 420, 500, 580, 620, 700, 650, 500], borderColor: C.red, backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderWidth: 1.5, borderDash: [4, 4] },
      { label: w('Optimista (re-skilling)', 'Optimistic (re-skilling)'), data: [null, null, null, 246, 300, 200, 160, 130, 110, 95, 80, 75, 65], borderColor: C.green, backgroundColor: 'transparent', tension: 0.4, pointRadius: 3, borderWidth: 1.5, borderDash: [4, 4] },
    ],
  };

  return { techLayoffs, challenger, sectors, hiring, aiJobs, reasons, projection };
}

const SOURCES = [
  { label: 'layoffs.fyi — Tech Layoff Tracker', url: 'https://layoffs.fyi/' },
  { label: 'Crunchbase News — Tech Layoffs 2024-2026', url: 'https://news.crunchbase.com/startups/tech-layoffs/' },
  { label: 'TechCrunch — Tech layoffs 2025 list', url: 'https://techcrunch.com/2025/12/22/tech-layoffs-2025-list/' },
  { label: 'Challenger, Gray & Christmas — 2025 Report', url: 'https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/' },
  { label: 'S&P Global — White collar layoffs surge', url: 'https://www.spglobal.com/market-intelligence/en/news-insights/articles/2024/11/layoffs-surge-in-us-white-collar-jobs-as-rates-ai-alter-office-work-85986794' },
  { label: 'Fortune — "Forever Layoffs" era', url: 'https://fortune.com/2025/12/09/forever-layoffs-job-security-k-shaped-economy-white-collar-recession-challenger-glassdoor/' },
  { label: 'Indeed Hiring Lab — Tech Hiring Freeze', url: 'https://www.hiringlab.org/2025/07/30/the-us-tech-hiring-freeze-continues/' },
  { label: 'Indeed Hiring Lab — Jobs mentioning AI', url: 'https://www.hiringlab.org/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/' },
  { label: 'BLS/JOLTS — Job Openings Survey', url: 'https://www.bls.gov/news.release/jolts.htm' },
  { label: 'WEF — Future of Jobs Report 2025', url: 'https://reports.weforum.org/docs/WEF_Four_Futures_for_Jobs_in_the_New_Economy_AI_and_Talent_in_2030_2025.pdf' },
  { label: 'AI Multiple — AI Job Loss Predictions', url: 'https://research.aimultiple.com/ai-job-loss/' },
  { label: 'CompTIA — Tech Workforce 2026', url: 'https://www.comptia.org/en-us/blog/state-of-the-tech-workforce-2026-trends-job-growth-and-future-opportunities/' },
  { label: 'TechTarget — Tech Job Market 2026', url: 'https://www.techtarget.com/whatis/feature/Tech-job-market-statistics-and-outlook' },
  { label: 'REZI — Entry-Level Jobs & AI Report', url: 'https://www.rezi.ai/posts/entry-level-jobs-and-ai-2026-report' },
  { label: 'Computerworld — Tech Layoffs 2026', url: 'https://www.computerworld.com/article/3816579/tech-layoffs-this-year-a-timeline.html' },
  { label: 'CNBC — White collar layoffs, AI', url: 'https://www.cnbc.com/2025/11/04/white-collar-layoffs-ai-cost-cutting-tariffs.html' },
  { label: 'Newsweek — White-Collar Jobs Disappearing', url: 'https://www.newsweek.com/white-collar-jobs-disappearing-2031221' },
  { label: 'CIO Dive — Rise of Generative AI', url: 'https://www.ciodive.com/news/generative-ai-one-year-chatgpt-openai-timeline/698110/' },
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
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-red-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-5">
            {t('Análisis Global · Abril 2026', 'Global Analysis · April 2026')}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 special-report-title">
            {t('Layoffs, Contratación & GenAI', 'Layoffs, Hiring & GenAI')}
            <br />
            <span className="text-2xl sm:text-3xl opacity-80">{t('El Gran Reajuste Laboral', 'The Great Labor Reset')}</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10">
            {t(
              'Un análisis de datos sobre despidos masivos en IT y sectores white collar, tendencias de contratación y su correlación con los hitos de la Inteligencia Artificial Generativa.',
              'A data analysis of massive IT and white collar layoffs, hiring trends, and their correlation with Generative AI milestones.'
            )}
          </p>

          <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto">
            {KPIS.map((kpi, i) => (
              <div key={i} className="glass rounded-xl px-6 py-4 min-w-[160px] text-center glow-border">
                <div className="text-3xl font-extrabold leading-none mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{pick(kpi.label, lang)}</div>
                <div className="text-[11px] text-gray-600 mt-1">{typeof kpi.sub === 'string' ? kpi.sub : pick(kpi.sub, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* S1 — Tech Layoffs */}
        <Section num={1} title={t('Layoffs en la Industria Tech (2020–2026)', 'Tech Industry Layoffs (2020–2026)')} subtitle={t('Trabajadores despedidos en empresas de tecnología a nivel global · Fuentes: layoffs.fyi, TechCrunch, Crunchbase', 'Workers laid off in global tech companies · Sources: layoffs.fyi, TechCrunch, Crunchbase')}>
          <Card title={t('Despidos anuales en el sector tecnológico', 'Annual tech sector layoffs')} subtitle={t('2026 incluye solo Q1. Múltiples trackers difieren ±15%; promedios ponderados.', '2026 includes Q1 only. Multiple trackers differ ±15%; weighted averages used.')}>
            <div className="h-[360px]"><Bar data={charts.techLayoffs} options={{ ...baseBarOpts((v) => (Number(v) >= 1000 ? `${Number(v) / 1000}K` : String(v))), plugins: { legend: { display: false } } }} /></div>
            <p className="text-[11px] text-gray-600 italic mt-3">{t('* 2026: datos hasta marzo (~90,474). Ratio anualizado ~360K.', '* 2026: data through March (~90,474). Annualized rate ~360K.')}</p>
            <Analysis>
              <strong className="report-heading">{t('¿Qué está pasando?', 'What\'s happening?')}</strong> {t(
                'Después del boom pandémico (2020-2021), el sector tech vivió una masiva corrección. 2023 fue el año récord con ~265K despidos. 2025 repuntó a ~246K, con la IA como driver explícito en al menos 55,000 despidos.',
                'After the pandemic boom (2020-2021), tech underwent a massive correction. 2023 was the record year with ~265K layoffs. 2025 rebounded to ~246K, with AI as the explicit driver in at least 55,000 layoffs.'
              )}
            </Analysis>
          </Card>
        </Section>

        {/* S2 — White Collar */}
        <Section num={2} title={t('Layoffs en Sectores White Collar', 'White Collar Sector Layoffs')} subtitle={t('Anuncios de recortes en EE.UU. · Fuente: Challenger, Gray & Christmas', 'U.S. layoff announcements · Source: Challenger, Gray & Christmas')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('Anuncios anuales de layoffs (todas las industrias)', 'Annual layoff announcements (all industries)')} subtitle={t('Miles de empleos anunciados para recorte', 'Thousands of jobs announced for cuts')}>
              <div className="h-[300px]"><Bar data={charts.challenger} options={{ ...baseBarOpts((v) => `${v}K`), plugins: { legend: { display: false } } }} /></div>
              <p className="text-[11px] text-gray-600 italic mt-3">{t('* 2025 incluye recortes DOGE (293K empleos federales).', '* 2025 includes DOGE cuts (293K federal jobs).')}</p>
            </Card>
            <Card title={t('Desglose por sector — 2025', 'Sector breakdown — 2025')} subtitle={t('Principales industrias afectadas', 'Main affected industries')}>
              <div className="h-[300px]"><Doughnut data={charts.sectors} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, ...LEGEND_OPTS }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()}` } } } }} /></div>
            </Card>
          </div>
          <Card title={t('Sectores white collar más afectados', 'Most affected white collar sectors')} subtitle="S&P Global, JOLTS/BLS, Fortune, Challenger">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HighlightBox variant="red" title={t('Sectores bajo mayor presión', 'Sectors under highest pressure')}>
                <p><strong className="report-heading">{t('Consultoría', 'Consulting')}:</strong> {t('Big 4 recortaron +9.000 empleos combinados. Accenture: 19.000 recortes administrativos.', 'Big 4 cut 9,000+ jobs combined. Accenture: 19,000 administrative cuts.')}</p>
                <p className="mt-2"><strong className="report-heading">{t('Finanzas', 'Finance')}:</strong> {t('Goldman Sachs, Citigroup, Wells Fargo — automatización de back-office.', 'Goldman Sachs, Citigroup, Wells Fargo — back-office automation.')}</p>
                <p className="mt-2"><strong className="report-heading">Media:</strong> {t('+17.163 anuncios en 2025, +15% vs 2024.', '+17,163 announcements in 2025, +15% vs 2024.')}</p>
                <p className="mt-2"><strong className="report-heading">Retail:</strong> {t('Marketing, analytics y soporte migran a herramientas GenAI.', 'Marketing, analytics and support migrate to GenAI tools.')}</p>
              </HighlightBox>
              <HighlightBox variant="green" title={t('El dato estructural más preocupante', 'The most concerning structural data')}>
                <p>{t('White collar en EE.UU.:', 'White collar in U.S.:')} <strong className="report-heading">22.7M → 22.6M</strong> {t('entre 2024-2025 (BLS).', 'between 2024-2025 (BLS).')}</p>
                <p className="mt-2">{t('Servicios Profesionales:', 'Professional Services:')} <strong className="report-heading">{t('3.7M de despidos/ceses', '3.7M layoffs/separations')}</strong> {t('en los primeros 9 meses de 2024. Niveles de apertura más bajos desde 2014.', 'in the first 9 months of 2024. Lowest job opening levels since 2014.')}</p>
                <p className="mt-2"><strong className="report-heading">{t('1 de cada 4', '1 in 4')}</strong> {t('trabajadores que perdió su empleo en 2024 venía de servicios profesionales.', 'workers who lost their job in 2024 came from professional services.')}</p>
              </HighlightBox>
            </div>
          </Card>
        </Section>

        {/* S3 — Hiring */}
        <Section num={3} title={t('Tendencias de Contratación', 'Hiring Trends')} subtitle={t('Job postings, contratación y empleo tech · Indeed Hiring Lab, CompTIA, BLS/JOLTS', 'Job postings, hiring and tech employment · Indeed Hiring Lab, CompTIA, BLS/JOLTS')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('Job postings tech vs pre-pandemia', 'Tech job postings vs pre-pandemic')} subtitle={t('Índice 100 = Feb 2020 · Indeed Hiring Lab', 'Index 100 = Feb 2020 · Indeed Hiring Lab')}>
              <div className="h-[300px]"><Line data={charts.hiring} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: LEGEND_OPTS }, scales: { y: { ticks: { color: AXIS_COLOR }, grid: { color: GRID_COLOR }, title: { display: true, text: t('Índice (Feb 2020 = 100)', 'Index (Feb 2020 = 100)'), font: { size: 11 }, color: AXIS_COLOR } }, x: { grid: { display: false }, ticks: { font: { size: 10 }, color: AXIS_COLOR } } } }} /></div>
            </Card>
            <Card title={t('Empleos tech: tradicionales vs IA', 'Tech jobs: traditional vs AI')} subtitle="Indeed Hiring Lab + CompTIA">
              <div className="h-[300px]"><Bar data={charts.aiJobs} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: LEGEND_OPTS }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${v}K`, color: AXIS_COLOR }, grid: { color: GRID_COLOR } }, x: { grid: { display: false }, ticks: { color: AXIS_COLOR } } } }} /></div>
            </Card>
          </div>
          <Card title={t('El desajuste estructural del mercado laboral', 'The structural labor market mismatch')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HighlightBox variant="red" title={t('Lo que está colapsando', 'What\'s collapsing')}>
                <p>• {t('Postings tech generales', 'General tech postings')}: <strong>−36%</strong> vs pre-{t('pandemia', 'pandemic')}</p>
                <p>• Entry-level ({t('EE.UU.', 'U.S.')}): <strong>−73%</strong> {t('en el último año', 'in the last year')}</p>
                <p>• Entry-level UK (tech): <strong>−46%</strong> {t('en 2024; −53% adicional en 2026', 'in 2024; projected −53% more in 2026')}</p>
                <p>• {t('Soporte, análisis rutinario: reemplazados por IA', 'Support, routine analysis: replaced by AI')}</p>
                <p>• Middle management: {t('restructuraciones masivas', 'massive restructurings')}</p>
              </HighlightBox>
              <HighlightBox variant="green" title={t('Lo que está creciendo', 'What\'s growing')}>
                <p>• {t('Postings con IA', 'AI-mentioning postings')}: <strong>+45%</strong> vs pre-{t('pandemia', 'pandemic')}</p>
                <p>• AI/ML/Data Science: <strong>+163%</strong> vs 2024 (49,200 postings)</p>
                <p>• {t('Ciberseguridad', 'Cybersecurity')}: <strong>+124%</strong> vs 2024 (66,800 postings)</p>
                <p>• {t('Ingenieros de IA/LLM/Agentes: demanda sin precedentes', 'AI/LLM/Agents engineers: unprecedented demand')}</p>
                <p>• {t('Empleos tech con IA en EE.UU.: ~9.8M proyectados 2026', 'AI-related tech jobs in U.S.: ~9.8M projected 2026')}</p>
              </HighlightBox>
            </div>
            <Analysis>
              {t(
                'El mercado tech no está "muriendo" — está bifurcándose. Hay escasez de talento en IA mientras colapsan los roles automatizables. Los roles de entrada que servían como escalón formativo están siendo eliminados.',
                'The tech market isn\'t "dying" — it\'s bifurcating. There\'s an AI talent shortage while automatable roles collapse. Entry-level roles that served as formative stepping stones are being eliminated.'
              )}
            </Analysis>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S4 — Timeline */}
        <Section num={4} title={t('Timeline: Hitos GenAI ↔ Layoffs', 'Timeline: GenAI Milestones ↔ Layoffs')} subtitle={t('Cómo cada salto en IA generativa aceleró los recortes de empleo', 'How each GenAI leap accelerated job cuts')}>
          <Card title={t('Correlación cronológica: Avances de IA ↔ Despidos', 'Chronological correlation: AI advances ↔ Layoffs')} subtitle={t('Los hitos actúan como catalizadores con lag de 3-12 meses', 'Milestones act as catalysts with a 3-12 month lag')}>
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { label: t('Hito GenAI', 'GenAI Milestone'), color: C.purple },
                { label: t('Layoff masivo', 'Massive layoff'), color: C.red },
                { label: t('Factor económico', 'Economic factor'), color: C.yellow },
                { label: t('Hiring / Expansión', 'Hiring / Expansion'), color: C.green },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-purple-500 to-red-500" />
              {TIMELINE_DATA.map((item, i) => (
                <div key={i} className="relative mb-7">
                  <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-900" style={{ background: item.color }} />
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: item.color }}>
                    {typeof item.date === 'string' ? item.date : pick(item.date, lang)}
                  </div>
                  <div className="text-sm font-bold report-heading mb-1">
                    {pick(item.title, lang)}
                    {item.badges.map((b, bi2) => (
                      <span key={bi2} className={`inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border align-middle ${b.cls}`}>
                        {typeof b.label === 'string' ? b.label : pick(b.label, lang)}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">{pick(item.body, lang)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* S5 — AI as Driver */}
        <Section num={5} title={t('IA como Driver de Layoffs', 'AI as the Layoff Driver')} subtitle={t('De la corrección post-pandemia al reemplazo estructural', 'From post-pandemic correction to structural replacement')}>
          <Card title={t('Razones declaradas para layoffs tech (2022–2026)', 'Stated reasons for tech layoffs (2022–2026)')} subtitle={t('Evolución del peso relativo de cada factor', 'Evolution of each factor\'s relative weight')}>
            <div className="h-[380px]"><Bar data={charts.reasons} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: LEGEND_OPTS, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ~${ctx.parsed.y}%` } } }, scales: { y: { beginAtZero: true, stacked: true, max: 110, ticks: { callback: (v) => `${v}%`, color: AXIS_COLOR }, grid: { color: GRID_COLOR } }, x: { grid: { display: false }, stacked: true, ticks: { color: AXIS_COLOR } } } }} /></div>
            <Analysis>
              {t(
                'Transición fundamental: de corrección cíclica (2022-2023) hacia reemplazo estructural por IA (2024+). Las correcciones cíclicas se revierten; el reemplazo estructural no.',
                'Fundamental transition: from cyclical correction (2022-2023) to structural AI replacement (2024+). Cyclical corrections reverse; structural replacement does not.'
              )}
            </Analysis>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S6 — Projections */}
        <Section num={6} title={t('Proyecciones: 1, 2, 5 y 10 años', 'Projections: 1, 2, 5 and 10 years')} subtitle="WEF Future of Jobs 2025, Goldman Sachs, McKinsey, OECD, MIT">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {PROJ_DATA.map((p, i) => (
              <div key={i} className={`glass rounded-xl p-5 border ${p.color}`}>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1">{t('Horizonte', 'Horizon')}</div>
                <div className="text-3xl font-extrabold mb-2">{pick(p.year, lang)}</div>
                <div className="text-sm font-bold report-heading mb-2">{pick(p.label, lang)}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{pick(p.text, lang)}</p>
                <span className={`inline-block mt-3 text-[11px] font-semibold px-3 py-1 rounded-lg ${p.statBg}`}>{pick(p.stat, lang)}</span>
              </div>
            ))}
          </div>
          <Card title={t('Proyección: Layoffs tech anuales (2026-2035)', 'Projection: Annual tech layoffs (2026-2035)')} subtitle={t('Bandas = escenario optimista / pesimista', 'Bands = optimistic / pessimistic scenario')}>
            <div className="h-[380px]"><Line data={charts.projection} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 16, color: AXIS_COLOR } }, tooltip: { callbacks: { label: (ctx) => ctx.parsed.y ? ` ${ctx.dataset.label}: ~${ctx.parsed.y}K` : '' } } }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${v}K`, color: AXIS_COLOR }, grid: { color: GRID_COLOR }, title: { display: true, text: t('Trabajadores despedidos (miles)', 'Workers laid off (thousands)'), font: { size: 11 }, color: AXIS_COLOR } }, x: { grid: { display: false }, ticks: { color: AXIS_COLOR } } } }} /></div>
            <Analysis>
              {t(
                'Escenario base: layoffs tech entre 150K-250K anuales hasta ~2028, luego recortes quirúrgicos pero permanentes. El pesimista incluye AGI acelerado. El optimista asume re-skilling masivo efectivo.',
                'Base scenario: tech layoffs between 150K-250K annually until ~2028, then surgical but permanent cuts. Pessimistic includes accelerated AGI. Optimistic assumes effective massive re-skilling.'
              )}
            </Analysis>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* Conclusion */}
        <Card className="report-conclusion-card border-sky-500/25">
          <h2 className="text-xl font-extrabold report-heading mb-4">{t('¿Qué está ocurriendo realmente?', 'What\'s really happening?')}</h2>
          <div className="text-sm text-gray-400 leading-relaxed space-y-4">
            <p>{t(
              'El mercado laboral global está atravesando la mayor transición estructural desde la Revolución Industrial, en tres fases superpuestas:',
              'The global labor market is undergoing the largest structural transition since the Industrial Revolution, in three overlapping phases:'
            )}</p>
            <p><strong style={{ color: C.yellow }}>{t('Fase 1 — Corrección cíclica (2022-2024):', 'Phase 1 — Cyclical correction (2022-2024):')}</strong> {t('El sector tech sobrecontratado se corrigió violentamente. ~500K+ trabajadores en 3 años. Predecible y no relacionado con IA en su origen.', 'The over-hired tech sector corrected violently. ~500K+ workers in 3 years. Predictable and not AI-related in origin.')}</p>
            <p><strong style={{ color: C.red }}>{t('Fase 2 — Reemplazo estructural por IA (2024-2027):', 'Phase 2 — Structural AI replacement (2024-2027):')}</strong> {t('Ya estamos aquí. La IA generativa destruye categorías enteras: redactores, analistas junior, soporte, QA básico, entry-level coding. No son correcciones temporales — son eliminaciones permanentes.', 'We\'re already here. Generative AI destroys entire categories: copywriters, junior analysts, support, basic QA, entry-level coding. These aren\'t temporary corrections — they\'re permanent eliminations.')}</p>
            <p><strong style={{ color: C.purple }}>{t('Fase 3 — Transformación radical (2027-2035):', 'Phase 3 — Radical transformation (2027-2035):')}</strong> {t('Con AGI narrow, 30-57% de horas de trabajo podrían ser automatizadas. No significa desempleo masivo necesariamente — significa que el tipo de trabajo cambiará profundamente.', 'With narrow AGI, 30-57% of work hours could be automated. This doesn\'t necessarily mean mass unemployment — it means the type of work will change profoundly.')}</p>
            <p><strong style={{ color: C.blue }}>{t('El mayor riesgo no es la tecnología en sí misma, sino la velocidad del cambio versus la capacidad de los sistemas educativos y de reentrenamiento de adaptarse.', 'The biggest risk isn\'t the technology itself, but the speed of change versus the capacity of education and retraining systems to adapt.')}</strong></p>
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
              'Nota metodológica: Los trackers de layoffs pueden diferir ±15-20% por criterios de inclusión. Este reporte usa promedios ponderados y cita la fuente específica por dato.',
              'Methodological note: Layoff trackers may differ ±15-20% due to inclusion criteria. This report uses weighted averages and cites specific sources per data point.'
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
