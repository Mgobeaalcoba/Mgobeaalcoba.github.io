'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ExternalLink, Database, BarChart3, AlertTriangle, Target, GitCompare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type L = 'es' | 'en';
const t2 = (es: string, en: string, l: L) => (l === 'es' ? es : en);

function Section({ icon: Icon, num, title, subtitle, children }: { icon: React.ElementType; num: number; title: string; subtitle: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/25 shrink-0">
          <Icon size={16} className="text-sky-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold report-heading">
            <span className="text-sky-400 mr-1.5">{num}.</span>{title}
          </h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 mb-6 ${className}`}>
      {title && <h3 className="text-base font-bold report-heading mb-4">{title}</h3>}
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-r-lg border-l-[3px] border-amber-500 bg-amber-500/5 px-5 py-4 text-sm leading-relaxed text-gray-400 report-analysis">
      {children}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 border-b border-white/10 text-sky-400 font-semibold bg-sky-500/5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-400">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceLink({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs underline underline-offset-2 transition-colors">
      {label} <ExternalLink size={10} />
    </a>
  );
}

export default function MethodologyContent() {
  const { lang } = useLanguage();
  const l = lang as L;
  const t = (es: string, en: string) => t2(es, en, l);

  return (
    <div className="pt-28 pb-12">
      {/* Hero */}
      <section className="report-hero border-b border-white/10 px-4 py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-amber-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-5">
            {t('Documento Metodológico', 'Methodology Document')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 report-heading">
            {t('Metodología y Fuentes', 'Methodology & Sources')}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            {t(
              'Trazabilidad completa: afirmación → dataset → fuente original. Este documento acompaña al informe interactivo y garantiza la reproducibilidad independiente de cada dato presentado.',
              'Full traceability: claim → dataset → primary source. This document accompanies the interactive report and ensures independent reproducibility of every data point presented.'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {t('Autor: Mariano Gobea Alcoba', 'Author: Mariano Gobea Alcoba')}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {t('Abril 2026', 'April 2026')}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {t('Cobertura: 2020–2035', 'Coverage: 2020–2035')}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        {/* Back link */}
        <Link href="/blog/special/layoffs-genai" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm mb-10 transition-colors">
          <ArrowLeft size={14} />
          {t('Volver al Informe', 'Back to Report')}
        </Link>

        {/* ——— 1. Propósito ——— */}
        <Section icon={Target} num={1} title={t('Propósito y alcance', 'Purpose & scope')} subtitle={t('Qué cubre este documento', 'What this document covers')}>
          <Card>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t(
                'Este documento acompaña al informe interactivo "Layoffs, Contratación & GenAI: El Gran Reajuste Laboral" y responde a la necesidad de trazabilidad completa entre cada afirmación del reporte y los datos crudos que la sustentan.',
                'This document accompanies the interactive report "Layoffs, Hiring & GenAI: The Great Labor Readjustment" and addresses the need for full traceability between every claim in the report and the raw data that supports it.'
              )}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t('Para cada claim relevante se documenta:', 'For each relevant claim we document:')}
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                t('La afirmación exacta tal como aparece en el reporte', 'The exact claim as it appears in the report'),
                t('La fuente primaria (dataset, reporte institucional o estudio académico)', 'The primary source (dataset, institutional report or academic study)'),
                t('El dato crudo original y cómo se procesó o agregó', 'The original raw data and how it was processed or aggregated'),
                t('Las limitaciones, márgenes de error y alternativas consideradas', 'Limitations, margins of error and alternatives considered'),
                t('El enlace verificable para reproducción independiente', 'The verifiable link for independent reproduction'),
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Note>
              <strong>{t('Alcance temporal:', 'Temporal scope:')}</strong>{' '}
              {t(
                'El informe cubre el período 2020–2026 (con proyecciones hasta 2035). Los datos históricos tienen como última actualización disponible marzo de 2026.',
                'The report covers the period 2020–2026 (with projections to 2035). Historical data has last available update as of March 2026.'
              )}
            </Note>
          </Card>
        </Section>

        {/* ——— 2. Datasets ——— */}
        <Section icon={Database} num={2} title={t('Datasets primarios', 'Primary datasets')} subtitle={t('(A) Trackers · (B) Institucionales · (C) Gubernamentales · (D) Proyecciones', '(A) Trackers · (B) Institutional · (C) Government · (D) Projections')}>

          {/* 2.1 layoffs.fyi */}
          <Card title="2.1 layoffs.fyi">
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Fuente principal para datos de despidos en el sector tecnológico. Tracker público crowdsourceado creado por Roger Lee en 2020.',
                'Primary source for tech sector layoff data. Public crowdsourced tracker created by Roger Lee in 2020.'
              )}
            </p>
            <DataTable
              headers={[t('Atributo', 'Attribute'), t('Detalle', 'Detail')]}
              rows={[
                ['URL', 'https://layoffs.fyi/'],
                [t('Cobertura', 'Coverage'), t('Empresas de tecnología (global)', 'Technology companies (global)')],
                [t('Método', 'Method'), 'Crowdsourcing + verified news + corporate filings'],
                [t('Actualización', 'Update'), t('Tiempo real (diaria)', 'Real-time (daily)')],
                [t('Limitación', 'Limitation'), t('Posible subregistro de empresas pequeñas; ±15% vs otros trackers', 'Possible under-reporting of small companies; ±15% vs other trackers')],
              ]}
            />
            <h4 className="text-sm font-semibold report-heading mt-6 mb-3">
              {t('Valores extraídos para el informe', 'Values extracted for the report')}
            </h4>
            <DataTable
              headers={[t('Año', 'Year'), t('Trabajadores', 'Workers'), t('Nota', 'Note')]}
              rows={[
                ['2020', '80,998', t('Inicio pandemia; startups y medianas', 'Pandemic start; startups and mid-size')],
                ['2021', '10,536', t('Mínimo histórico; boom de hiring', 'Historic low; hiring boom')],
                ['2022', '165,269', t('Corrección post-pandemia + tasas Fed', 'Post-pandemic correction + Fed rates')],
                ['2023', '264,220', t('Pico histórico; Meta, Amazon, Google, Microsoft', 'Historic peak; Meta, Amazon, Google, Microsoft')],
                ['2024', '152,922', t('IA empieza como driver explícito', 'AI begins as explicit driver')],
                ['2025', '245,953', t('Nuevo pico; IA atribuida en 55K+ despidos', 'New peak; AI attributed in 55K+ layoffs')],
                ['2026 (Q1)', '90,474', t('Solo ene–mar; anualizado ≈360K', 'Jan–Mar only; annualized ≈360K')],
              ]}
            />
            <Note>
              {t(
                'layoffs.fyi define "evento de layoff" como un anuncio público de recorte. No todos los anuncios se materializan en la cifra exacta declarada. El dato de 2026 Q1 tiene como ratio anualizado ≈360.000, usado como proyección indicativa.',
                'layoffs.fyi defines a "layoff event" as a public headcount reduction announcement. Not all announcements materialize at the exact declared figure. The Q1 2026 figure has an annualized ratio of ≈360K, used as an indicative projection.'
              )}
            </Note>
          </Card>

          {/* 2.2 Challenger */}
          <Card title={t('2.2 Challenger, Gray & Christmas', '2.2 Challenger, Gray & Christmas')}>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Firma de outplacement más antigua de EE.UU. (1961). Publica los "Job Cut Reports", estándar de la industria para medir anuncios de recortes en TODOS los sectores.',
                'Oldest US outplacement firm (1961). Publishes "Job Cut Reports," the industry standard for measuring layoff announcements across ALL sectors.'
              )}
            </p>
            <DataTable
              headers={[t('Año', 'Year'), t('Miles anunciados', 'Thousands announced'), t('Contexto', 'Context')]}
              rows={[
                ['2019', '592K', t('Línea base pre-COVID', 'Pre-COVID baseline')],
                ['2020', '2,304K', t('Pico COVID-19', 'COVID-19 peak')],
                ['2021', '267K', t('Mínimo histórico', 'Historic low')],
                ['2022', '363K', t('Inicio ciclo restrictivo Fed', 'Fed restrictive cycle begins')],
                ['2023', '721K', t('Pico post-pandemia en white collar', 'Post-pandemic white collar peak')],
                ['2024', '761K', t('IA aparece como razón', 'AI appears as a reason')],
                ['2025', '1,206K', t('Máximo desde 2020; incluye 293K DOGE', 'Highest since 2020; includes 293K DOGE')],
              ]}
            />
            <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <h4 className="text-sm font-bold text-red-400 mb-2">
                {t('55.000 layoffs atribuidos a IA en 2025', '55,000 layoffs attributed to AI in 2025')}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t(
                  'Challenger reporta 54.836 anuncios de recorte que citaron explícitamente a la IA como razón. Este dato es el único que cuantifica despidos con causalidad declarada en IA.',
                  'Challenger reports 54,836 layoff announcements that explicitly cited AI as the reason. This is the only data point that quantifies layoffs with declared AI causality.'
                )}
              </p>
              <div className="mt-2">
                <SourceLink url="https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/" label="Challenger Year-End 2025 Report" />
              </div>
            </div>
            <Note>
              <strong>{t('Anuncios vs. despidos efectivos:', 'Announcements vs. actual layoffs:')}</strong>{' '}
              {t(
                'Challenger mide ANUNCIOS de recorte, no despidos consumados. Esto explica por qué sus cifras (1.2M en 2025) difieren de layoffs.fyi (246K tech). La diferencia es también de alcance: Challenger cubre todos los sectores; layoffs.fyi solo tecnología.',
                'Challenger measures ANNOUNCEMENTS of cuts, not actual layoffs. This explains why their figures (1.2M in 2025) differ from layoffs.fyi (246K tech). The difference is also in scope: Challenger covers all sectors; layoffs.fyi covers tech only.'
              )}
            </Note>
          </Card>

          {/* 2.3 Indeed */}
          <Card title="2.3 Indeed Hiring Lab">
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Unidad de investigación de Indeed.com. Análisis basados en 250M+ postings/mes. Dataset más grande de oferta laboral disponible públicamente.',
                'Indeed.com research unit. Analysis based on 250M+ postings/month. Largest publicly available job posting dataset.'
              )}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div className="text-2xl font-black text-red-400 mb-1">−36%</div>
                <p className="text-xs text-gray-400">{t('Job postings tech vs pre-pandemia (jul. 2025)', 'Tech job postings vs pre-pandemic (Jul 2025)')}</p>
                <div className="mt-2"><SourceLink url="https://www.hiringlab.org/2025/07/30/the-us-tech-hiring-freeze-continues/" label="Hiring Lab Jul 2025" /></div>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="text-2xl font-black text-emerald-400 mb-1">+45%</div>
                <p className="text-xs text-gray-400">{t('Postings con mención de IA vs pre-pandemia', 'Postings mentioning AI vs pre-pandemic')}</p>
                <div className="mt-2"><SourceLink url="https://www.hiringlab.org/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/" label="Hiring Lab Jan 2026" /></div>
              </div>
            </div>
            <h4 className="text-sm font-semibold report-heading mt-6 mb-3">
              {t('Índice de Hiring Trends (datos tabulados)', 'Hiring Trends Index (tabulated data)')}
            </h4>
            <DataTable
              headers={[t('Fecha', 'Date'), t('Índice Total Tech', 'Total Tech Index'), t('Índice Postings IA', 'AI Postings Index'), t('Fuente', 'Source')]}
              rows={[
                ['Feb 2020', '100', '100', t('Base (referencia)', 'Baseline')],
                ['Jun 2020', '78', '102', t('Pandemia inicial', 'Early pandemic')],
                ['Dic 2021', '155', '122', t('Pico boom', 'Boom peak')],
                ['Dic 2022', '120', '145', t('Post-ChatGPT', 'Post-ChatGPT')],
                ['Dic 2023', '90', '175', t('Bifurcación', 'Bifurcation')],
                ['Dic 2024', '75', '195', t('Máximo relativo IA', 'AI relative peak')],
                ['Jul 2025', '64', '145', t('Dato exacto -36%', 'Exact datum -36%')],
                ['Mar 2026', '60', '130', t('Estimación', 'Estimate')],
              ]}
            />
            <Note>
              {t(
                'Los valores intermedios son interpolaciones basadas en releases sucesivos de Hiring Lab. El valor verificable independientemente es julio 2025 (64, equivalente a -36%).',
                'Intermediate values are interpolations based on successive Hiring Lab releases. The independently verifiable value is July 2025 (64, equivalent to -36%).'
              )}
            </Note>
          </Card>

          {/* 2.4 BLS */}
          <Card title={t('2.4 BLS/JOLTS — Bureau of Labor Statistics', '2.4 BLS/JOLTS — Bureau of Labor Statistics')}>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Encuesta mensual del gobierno federal de EE.UU. que mide aperturas de empleo, contrataciones y separaciones por sector. >21.000 establecimientos encuestados.',
                'Monthly US federal government survey measuring job openings, hires and separations by sector. >21,000 establishments surveyed.'
              )}
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs font-semibold text-sky-400 mb-1">{t('3,7M separaciones en Servicios Profesionales (ene–sep 2024)', '3.7M separations in Professional Services (Jan–Sep 2024)')}</p>
                <p className="text-xs text-gray-500">{t('Suma mensual de separations (quits + layoffs + discharges) para NAICS 54–56', 'Monthly sum of separations (quits + layoffs + discharges) for NAICS 54–56')}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs font-semibold text-sky-400 mb-1">{t('Vacantes en mínimo desde 2014', 'Openings at lowest since 2014')}</p>
                <p className="text-xs text-gray-500">{t('Ago 2024: nivel más bajo de job openings en Professional & Business Services desde jun 2014', 'Aug 2024: lowest job openings in Professional & Business Services since Jun 2014')}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs font-semibold text-sky-400 mb-1">{t('22,7M → 22,6M trabajadores white collar (2024–2025)', '22.7M → 22.6M white collar workers (2024–2025)')}</p>
                <p className="text-xs text-gray-500">{t('Contracción neta ~100K posiciones según BLS CES', 'Net contraction ~100K positions per BLS CES')}</p>
              </div>
            </div>
            <div className="mt-2">
              <SourceLink url="https://www.spglobal.com/market-intelligence/en/news-insights/articles/2024/11/layoffs-surge-in-us-white-collar-jobs-as-rates-ai-alter-office-work-85986794" label="S&P Global — White collar layoffs surge" />
            </div>
          </Card>

          {/* 2.5 CompTIA */}
          <Card title={t('2.5 CompTIA — State of the Tech Workforce', '2.5 CompTIA — State of the Tech Workforce')}>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Informe de referencia sobre el empleo tecnológico en EE.UU., publicado anualmente.',
                'Annual benchmark report on US tech employment.'
              )}
            </p>
            <DataTable
              headers={[t('Afirmación', 'Claim'), t('Dato original', 'Original data'), t('Cálculo', 'Calculation')]}
              rows={[
                [t('Roles AI/ML/Data Science: +163%', 'AI/ML/Data Science roles: +163%'), t('49.200 postings 2025 vs 18.700 en 2024', '49,200 postings 2025 vs 18,700 in 2024'), '(49,200-18,700)/18,700'],
                [t('Roles ciberseguridad: +124%', 'Cybersecurity roles: +124%'), t('66.800 postings 2025 vs 29.800 en 2024', '66,800 postings 2025 vs 29,800 in 2024'), '(66,800-29,800)/29,800'],
                [t('9,8M empleos tech con IA para 2026', '9.8M AI tech jobs by 2026'), t('Proyección CompTIA', 'CompTIA projection'), t('Directo', 'Direct')],
              ]}
            />
            <div className="mt-2">
              <SourceLink url="https://www.comptia.org/en-us/blog/state-of-the-tech-workforce-2026-trends-job-growth-and-future-opportunities/" label="CompTIA State of the Tech Workforce 2026" />
            </div>
          </Card>
        </Section>

        {/* ——— 3. KPIs ——— */}
        <Section icon={BarChart3} num={3} title={t('Trazabilidad de KPIs del hero', 'Hero KPI traceability')} subtitle={t('Los 5 indicadores destacados del informe', 'The 5 featured indicators of the report')}>
          <Card>
            <DataTable
              headers={['KPI', t('Valor', 'Value'), t('Fuente', 'Source'), t('Dato crudo', 'Raw data'), t('Proceso', 'Processing')]}
              rows={[
                [t('Pico Layoffs Tech 2023', 'Peak Tech Layoffs 2023'), '265K', 'layoffs.fyi', '264,220', t('Redondeado', 'Rounded')],
                [t('Anuncios despido 2025', 'Layoff announcements 2025'), '1.2M', 'Challenger Yr-End 2025', '1,206,000', t('Redondeado', 'Rounded')],
                [t('Caída job postings', 'Job postings drop'), '−36%', 'Indeed Hiring Lab', t('Índice 64 (base 100)', 'Index 64 (base 100)'), '100 − 64'],
                [t('Layoffs por IA', 'AI layoffs'), '55K+', 'Challenger Yr-End 2025', '54,836', t('Redondeado', 'Rounded')],
                [t('Empleos en riesgo', 'Jobs at risk'), '300M', 'Goldman Sachs 2023', '300M FTE', t('Directo', 'Direct')],
              ]}
            />
            <Note>
              <strong>Goldman Sachs (300M):</strong>{' '}
              {t(
                '"Expose" no significa desplazamiento total sino que >50% de las tareas del puesto pueden ser automatizadas por IA. El dato se reporta con el calificador "proyección".',
                '"Expose" does not mean total displacement but that >50% of the role\'s tasks can be automated by AI. The data is reported with the "projection" qualifier.'
              )}
            </Note>
          </Card>
        </Section>

        {/* ——— 4. Afirmaciones ——— */}
        <Section icon={BookOpen} num={4} title={t('Trazabilidad de afirmaciones', 'Claim traceability')} subtitle={t('Datos cualitativos del sector white collar', 'White collar sector qualitative data')}>
          <Card title={t('Big 4: +9.000 recortes combinados', 'Big 4: +9,000 combined cuts')}>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="text-sky-400 font-semibold">Deloitte:</span> 3,500 {t('recortes en EE.UU. (mayo 2024)', 'US cuts (May 2024)')}</li>
              <li><span className="text-sky-400 font-semibold">EY:</span> ~3,000 {t('recortes globales (2024)', 'global cuts (2024)')}</li>
              <li><span className="text-sky-400 font-semibold">KPMG:</span> ~1,700 {t('recortes en EE.UU. (2024)', 'US cuts (2024)')}</li>
              <li><span className="text-sky-400 font-semibold">PwC:</span> {t('Restructuraciones en advisory', 'Advisory restructuring')}</li>
            </ul>
            <div className="mt-3">
              <SourceLink url="https://www.cnbc.com/2025/11/04/white-collar-layoffs-ai-cost-cutting-tariffs.html" label="CNBC — White collar layoffs (Nov 2025)" />
            </div>
          </Card>
          <Card title={t('Accenture: 19.000 recortes', 'Accenture: 19,000 cuts')}>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                'Anunciado en marzo 2023 (~2,5% de 738.000 empleados). Comunicado oficial: SEC Filing 8-K, cubierto por Reuters, Bloomberg, FT y WSJ.',
                'Announced March 2023 (~2.5% of 738,000 employees). Official filing: SEC 8-K, covered by Reuters, Bloomberg, FT and WSJ.'
              )}
            </p>
          </Card>
          <Card title={t('Klarna: IA reemplaza 700 agentes', 'Klarna: AI replaces 700 agents')}>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                'CEO Sebastian Siemiatkowski confirmó (LinkedIn + Bloomberg, feb. 2024) que los agentes de IA procesaron tantas conversaciones como 700 representantes humanos en el primer mes.',
                'CEO Sebastian Siemiatkowski confirmed (LinkedIn + Bloomberg, Feb 2024) that AI agents processed as many conversations as 700 human representatives in the first month.'
              )}
            </p>
          </Card>
        </Section>

        {/* ——— 5. Proyecciones ——— */}
        <Section icon={GitCompare} num={5} title={t('Fuentes de proyecciones', 'Projection sources')} subtitle={t('WEF, McKinsey, Goldman Sachs', 'WEF, McKinsey, Goldman Sachs')}>
          <Card title={t('World Economic Forum — Future of Jobs 2025', 'World Economic Forum — Future of Jobs 2025')}>
            <DataTable
              headers={[t('Proyección', 'Projection'), t('Valor', 'Value')]}
              rows={[
                [t('Empleos desplazados', 'Jobs displaced'), '92M'],
                [t('Empleos creados', 'Jobs created'), '170M'],
                [t('Neto hacia 2030', 'Net by 2030'), '+78M'],
                [t('Trabajadores que cambian carrera', 'Workers changing careers'), '14%'],
              ]}
            />
            <div className="mt-2">
              <SourceLink url="https://reports.weforum.org/docs/WEF_Four_Futures_for_Jobs_in_the_New_Economy_AI_and_Talent_in_2030_2025.pdf" label="WEF Future of Jobs 2025 (PDF)" />
            </div>
          </Card>
          <Card title="McKinsey Global Institute">
            <DataTable
              headers={[t('Dato', 'Data point'), t('Valor', 'Value'), t('Fuente McKinsey', 'McKinsey source')]}
              rows={[
                [t('Horas automatizables para 2030', 'Automatable hours by 2030'), '30%', '"The Future of Work After COVID-19"'],
                [t('Cambio de carrera requerido', 'Career change required'), '14%', '"Jobs Lost, Jobs Gained"'],
                [t('Horas automatizables hoy', 'Hours automatable today'), '57%', '"Generative AI and the Future of Work" 2023'],
                [t('Ventaja productividad adopters IA', 'AI adopter productivity edge'), '15–40%', 'Global Survey on AI 2024-2025'],
              ]}
            />
          </Card>
          <Card title={t('Escenarios del gráfico de proyecciones', 'Projection chart scenarios')}>
            <div className="space-y-3">
              {[
                { color: 'border-sky-500/30 bg-sky-500/5', label: t('Escenario Base', 'Base Scenario'), desc: t('Adopción IA moderada; regulación parcial; re-skilling efectivo ~50%', 'Moderate AI adoption; partial regulation; ~50% effective re-skilling') },
                { color: 'border-emerald-500/30 bg-emerald-500/5', label: t('Escenario Optimista', 'Optimistic Scenario'), desc: t('Regulación activa, re-skilling masivo exitoso, nuevas categorías laborales', 'Active regulation, successful mass re-skilling, new job categories') },
                { color: 'border-red-500/30 bg-red-500/5', label: t('Escenario Pesimista', 'Pessimistic Scenario'), desc: t('AGI narrow 2028-2030, adopción acelerada, re-skilling fracasa', 'Narrow AGI 2028-2030, accelerated adoption, re-skilling fails') },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-lg border ${s.color}`}>
                  <p className="text-xs font-bold text-gray-300 mb-1">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
            <Note>
              <strong>{t('Las proyecciones no son predicciones.', 'Projections are not predictions.')}</strong>{' '}
              {t(
                'Los números son escenarios ilustrativos. Ningún modelo económico puede predecir con precisión el impacto laboral de la IA a 10 años. La incertidumbre crece exponencialmente después de 2028.',
                'The numbers are illustrative scenarios. No economic model can precisely predict the labor impact of AI over 10 years. Uncertainty grows exponentially after 2028.'
              )}
            </Note>
          </Card>
        </Section>

        {/* ——— 6. Limitaciones ——— */}
        <Section icon={AlertTriangle} num={6} title={t('Limitaciones y notas', 'Limitations & notes')} subtitle={t('Transparencia metodológica', 'Methodological transparency')}>
          <Card title={t('Gráficos cualitativos', 'Qualitative charts')}>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                'El gráfico de "Razones declaradas para layoffs" es una estimación cualitativa construida a partir del análisis de comunicados corporativos y cobertura periodística. Los porcentajes deben interpretarse como órdenes de magnitud, no como mediciones exactas.',
                'The "Declared reasons for layoffs" chart is a qualitative estimate built from corporate press releases and media coverage analysis. Percentages should be interpreted as orders of magnitude, not exact measurements.'
              )}
            </p>
          </Card>
          <Card title={t('Sobre REZI (entry-level −73%)', 'On REZI (entry-level −73%)')}>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                'REZI es una empresa de software de CV, no una institución académica. Sus datos son propietarios y difícilmente replicables. Se cita porque no existe alternativa institucional que mida el colapso de roles entry-level con ese detalle. BLS y CompTIA confirman la dirección pero no la magnitud exacta.',
                'REZI is a CV software company, not an academic institution. Their data is proprietary and hard to replicate. Cited because no institutional alternative measures the entry-level role collapse with that detail. BLS and CompTIA confirm the direction but not the exact magnitude.'
              )}
            </p>
          </Card>
          <Card title={t('Comparativa de trackers', 'Tracker comparison')}>
            <DataTable
              headers={['Tracker', t('Qué mide', 'What it measures'), t('Cobertura', 'Coverage'), t('Cifra 2025', '2025 figure')]}
              rows={[
                ['layoffs.fyi', t('Despidos tech (global)', 'Tech layoffs (global)'), 'Tech only', '~246K'],
                ['Challenger G&C', t('Anuncios recorte (EE.UU.)', 'Cut announcements (US)'), t('Todos los sectores', 'All sectors'), '1,206K'],
                ['TrueUp.io', t('Despidos tech confirmados', 'Confirmed tech layoffs'), 'Tech only', '~230K'],
                ['Crunchbase', t('Startups con funding', 'Funded startups'), 'Tech + startups', t('Variable', 'Variable')],
                ['BLS Mass Layoff', t('Despidos efectivos >50', 'Actual layoffs >50'), t('Todos, EE.UU.', 'All, US'), 'N/A'],
              ]}
            />
          </Card>
        </Section>

        {/* Bottom nav */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/blog/special/layoffs-genai" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 hover:bg-sky-500/20 transition-colors text-sm font-medium">
            <ArrowLeft size={14} />
            {t('Volver al Informe Interactivo', 'Back to Interactive Report')}
          </Link>
        </div>
      </div>
    </div>
  );
}
