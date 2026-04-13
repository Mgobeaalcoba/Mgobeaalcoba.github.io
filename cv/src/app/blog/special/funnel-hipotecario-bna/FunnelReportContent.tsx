'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Bi = { es: string; en: string };
const bi = (es: string, en: string): Bi => ({ es, en });
const pick = (b: Bi, l: Language) => b[l];

const C = {
  blue: '#38bdf8', cyan: '#22d3ee', indigo: '#6366f1', purple: '#a78bfa',
  green: '#22c55e', red: '#ef4444', orange: '#f59e0b', yellow: '#eab308',
  blueA: 'rgba(56,189,248,0.15)', cyanA: 'rgba(34,211,238,0.15)',
  indigoA: 'rgba(99,102,241,0.15)', purpleA: 'rgba(167,139,250,0.15)',
  greenA: 'rgba(34,197,94,0.15)', redA: 'rgba(239,68,68,0.15)',
  orangeA: 'rgba(245,158,11,0.15)', yellowA: 'rgba(234,179,8,0.15)',
};

const GRID_COLOR = 'rgba(48,54,61,0.7)';
const AXIS_COLOR = '#8b949e';
const LEGEND_OPTS = { labels: { font: { size: 11 }, boxWidth: 12, color: AXIS_COLOR } };

/* ================================================================
   REUSABLE LAYOUT COMPONENTS
   ================================================================ */

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

function HighlightBox({ variant, title, children }: { variant: 'red' | 'green' | 'blue'; title: string; children: React.ReactNode }) {
  const styles = {
    red: 'bg-red-500/5 border-red-500/20 text-red-400',
    green: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400',
    blue: 'bg-sky-500/5 border-sky-500/20 text-sky-400',
  }[variant];
  return (
    <div className={`rounded-xl border p-5 ${styles}`}>
      <h4 className="text-sm font-bold mb-2">{title}</h4>
      <div className="text-xs text-gray-400 leading-relaxed report-hl-body">{children}</div>
    </div>
  );
}

/* ================================================================
   FUNNEL DATA
   ================================================================ */

interface FunnelStage {
  label: Bi;
  value: number;
  display: string;
  widthPct: number;
  color: string;
  type: 'dato' | 'estimado';
  dropLabel: Bi;
  dropValue: string;
  details: { title: Bi; desc: Bi; tags: string[]; tagVariant: 'red' | 'green' | 'orange' };
}

const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: bi('Familias con necesidad habitacional', 'Families with housing needs'),
    value: 3200000, display: '3.200.000', widthPct: 100, color: C.indigo, type: 'dato',
    dropLabel: bi('', ''), dropValue: '',
    details: {
      title: bi('Déficit Habitacional Estructural', 'Structural Housing Deficit'),
      desc: bi(
        'Argentina tiene un déficit de más de 3.2 millones de viviendas. El 31% de la población no accede a vivienda propia. El 17.4% (~8M personas) alquila. El 40% de jóvenes de 25-35 años vive con padres o abuelos.',
        'Argentina has a deficit of over 3.2 million homes. 31% of the population lacks homeownership. 17.4% (~8M people) rent. 40% of 25-35 year-olds live with parents or grandparents.'
      ),
      tags: ['INDEC', 'Hábitat', 'Dato oficial'], tagVariant: 'green',
    },
  },
  {
    label: bi('Podrían acceder (empleo formal)', 'Could access (formal employment)'),
    value: 1824000, display: '~1.824.000', widthPct: 82, color: '#7c3aed', type: 'estimado',
    dropLabel: bi('43% informales excluidos', '43% informal workers excluded'), dropValue: '-1.376.000',
    details: {
      title: bi('Barrera: Informalidad Laboral (43%)', 'Barrier: Labor Informality (43%)'),
      desc: bi(
        'Con el 43% de informalidad laboral (INDEC Q4 2025), ~1.37M de familias con necesidad habitacional quedan automáticamente fuera del sistema. Los bancos exigen relación de dependencia formal (85% de los créditos se otorgan a empleados registrados), o monotributista/autónomo con facturación demostrable.',
        'With 43% labor informality (INDEC Q4 2025), ~1.37M families with housing needs are automatically excluded. Banks require formal employment (85% of loans go to registered employees), or self-employment with provable billing.'
      ),
      tags: ['INDEC Q4 2025', '43% informalidad', '5.8M informales'], tagVariant: 'red',
    },
  },
  {
    label: bi('Con ingreso suficiente', 'With sufficient income'),
    value: 550000, display: '~550.000', widthPct: 62, color: '#8b5cf6', type: 'estimado',
    dropLabel: bi('Ingreso < $2M/mes', 'Income < $2M/month'), dropValue: '-1.274.000',
    details: {
      title: bi('Barrera: Ingreso Insuficiente', 'Barrier: Insufficient Income'),
      desc: bi(
        'Para un crédito de ~USD 75.000 en BNA se necesitan ingresos familiares de ~$2M/mes. El salario mediano de Argentina ronda los $800K-$1M mensuales, excluyendo a la mayoría. La cuota no puede superar el 25% del ingreso neto.',
        'For a ~USD 75,000 loan at BNA, household income of ~$2M/month is needed. Argentina\'s median salary is ~$800K-$1M/month, excluding most. Monthly payment cannot exceed 25% of net income.'
      ),
      tags: ['Cuota/Ingreso 25%', 'Salario mediano ~$900K', 'Estimación cruzada'], tagVariant: 'orange',
    },
  },
  {
    label: bi('Interesados activos (consultan/simulan)', 'Active prospects (inquire/simulate)'),
    value: 350000, display: '~350.000', widthPct: 50, color: '#a855f7', type: 'estimado',
    dropLabel: bi('No buscan activamente', 'Not actively searching'), dropValue: '-200.000',
    details: {
      title: bi('Interesados que Consultan Activamente', 'Actively Inquiring Prospects'),
      desc: bi(
        'De quienes podrían calificar por ingresos, no todos buscan activamente. Muchos no tienen el 25% de ahorro previo para el anticipo, o priorizan alquiler. BNA reportó 3.500 turnos solicitados solo el primer día de lanzamiento (mayo 2024). Estimamos ~350K personas que realizaron alguna consulta activa durante 2025.',
        'Of those who could qualify by income, not all actively search. Many lack the 25% down payment savings, or prioritize renting. BNA reported 3,500 appointments requested on launch day alone (May 2024). We estimate ~350K people made active inquiries during 2025.'
      ),
      tags: ['3.500 turnos día 1', 'Estimación', 'Todos los bancos'], tagVariant: 'orange',
    },
  },
  {
    label: bi('Solicitudes formales (BNA)', 'Formal applications (BNA)'),
    value: 192600, display: '192.600', widthPct: 40, color: C.blue, type: 'dato',
    dropLabel: bi('No formalizan / otro banco', "Don't formalize / other bank"), dropValue: '-157.400',
    details: {
      title: bi('Solicitudes Formales en Banco Nación', 'Formal Applications at Banco Nación'),
      desc: bi(
        'El BNA reportó 192.600 solicitudes de crédito hipotecario recibidas hasta julio de 2025. Este es el dato más concreto del funnel sobre demanda real. Nótese que es solo hasta julio — el acumulado anual sería mayor. BNA concentra solicitudes por tener la tasa más baja (4.5% → 6% UVA).',
        'BNA reported 192,600 mortgage applications received through July 2025. This is the funnel\'s most concrete demand data point. Note this is only through July — the annual total would be higher. BNA concentrates applications due to the lowest rate (4.5% → 6% UVA).'
      ),
      tags: ['BNA oficial', 'Julio 2025', 'Dato duro'], tagVariant: 'green',
    },
  },
  {
    label: bi('Pre-aprobados (scoring + ingresos)', 'Pre-approved (scoring + income)'),
    value: 65000, display: '~65.000', widthPct: 30, color: '#2563eb', type: 'estimado',
    dropLabel: bi('Score < 909 / ratio cuota-ingreso', 'Score < 909 / payment-to-income ratio'), dropValue: '-127.600',
    details: {
      title: bi('Barrera: Evaluación Crediticia', 'Barrier: Credit Assessment'),
      desc: bi(
        'El BNA subió el score requerido de 400-700 a 909 puntos en el segundo semestre 2025. Esto, sumado a ratio cuota-ingreso (25%), historial BCRA limpio (12 meses), y análisis de sobreendeudamiento, genera una caída masiva. Los bancos revisan tarjetas al límite, créditos activos, juicios. Estimamos ~66% de solicitudes rechazadas en esta etapa.',
        'BNA raised the required score from 400-700 to 909 points in H2 2025. Combined with payment-to-income ratio (25%), clean BCRA history (12 months), and over-indebtedness analysis, this causes massive drop-off. Banks check maxed cards, active loans, lawsuits. We estimate ~66% rejection at this stage.'
      ),
      tags: ['Score 909+', 'Ratio 25%', '12 meses limpios BCRA'], tagVariant: 'red',
    },
  },
  {
    label: bi('Encuentran propiedad apta', 'Find eligible property'),
    value: 45000, display: '~45.000', widthPct: 24, color: C.cyan, type: 'estimado',
    dropLabel: bi('Propiedad no apta / desisten', 'Property not eligible / give up'), dropValue: '-20.000',
    details: {
      title: bi('Barrera: Propiedad Apta Crédito', 'Barrier: Loan-Eligible Property'),
      desc: bi(
        'El 90% de los rechazos en esta etapa son por problemas documentales: títulos observados, planos desactualizados, herencias sin declarar, ampliaciones irregulares. El banco exige cadena de titularidad perfecta, planos que reflejen la realidad, y tasación bancaria (que suele ser menor al precio de venta).',
        '90% of rejections at this stage are due to documentation issues: contested titles, outdated blueprints, undeclared inheritances, irregular expansions. Banks require perfect title chain, blueprints matching reality, and bank appraisal (usually below asking price).'
      ),
      tags: ['90% problemas documentales', 'Planos desactualizados', 'Tasación bancaria'], tagVariant: 'red',
    },
  },
  {
    label: bi('Crédito aprobado + escriturado (BNA)', 'Approved + executed mortgage (BNA)'),
    value: 33700, display: '~33.700', widthPct: 19, color: C.green, type: 'estimado',
    dropLabel: bi('Tasación baja / demoras / desistimiento', 'Low appraisal / delays / withdrawal'), dropValue: '-11.300',
    details: {
      title: bi('Créditos Efectivamente Otorgados (BNA)', 'Effectively Granted Mortgages (BNA)'),
      desc: bi(
        'Del total de 44.305 créditos hipotecarios otorgados en el sistema financiero durante 2025, el BNA concentró el 76% del mercado. Esto implica ~33.700 créditos para BNA. El flujo total fue de USD 3.679 millones con ticket promedio de USD 102.000 (en PBA). Tasa de mora: ~1%.',
        'Of the 44,305 total mortgage loans granted by the financial system in 2025, BNA held 76% market share. This implies ~33,700 loans for BNA. Total flow was USD 3.679 billion with average ticket of USD 102,000 (in PBA). Default rate: ~1%.'
      ),
      tags: ['76% market share', '44.305 total mercado', '~1% mora'], tagVariant: 'green',
    },
  },
];

/* ================================================================
   BARRIERS DATA
   ================================================================ */

const BARRIERS = [
  { icon: '👷', label: bi('Informalidad laboral', 'Labor informality'), pct: 43, color: C.red, desc: bi('43% de trabajadores sin empleo registrado', '43% of workers without formal employment') },
  { icon: '💰', label: bi('Ingreso insuficiente', 'Insufficient income'), pct: 70, color: C.orange, desc: bi('~70% de formales no llega al mínimo requerido', '~70% of formal workers don\'t reach the minimum') },
  { icon: '📊', label: bi('Score crediticio < 909', 'Credit score < 909'), pct: 66, color: C.red, desc: bi('~66% de solicitantes no pasan el filtro crediticio', '~66% of applicants don\'t pass credit check') },
  { icon: '🏠', label: bi('Propiedad no apta crédito', 'Property not loan-eligible'), pct: 30, color: C.orange, desc: bi('~30% de propiedades tienen problemas documentales', '~30% of properties have documentation issues') },
  { icon: '💵', label: bi('Sin ahorro previo (25%)', 'No prior savings (25%)'), pct: 55, color: C.red, desc: bi('~55% no tiene el anticipo mínimo del 25%', '~55% lack the 25% minimum down payment') },
  { icon: '📋', label: bi('Tasación bancaria baja', 'Low bank appraisal'), pct: 20, color: C.orange, desc: bi('~20% se caen por diferencia precio/tasación', '~20% fall through due to price/appraisal gap') },
  { icon: '⏳', label: bi('Demora / desistimiento', 'Delay / withdrawal'), pct: 15, color: C.indigo, desc: bi('~15% desisten durante el proceso de ~60 días', '~15% withdraw during the ~60 day process') },
];

/* ================================================================
   CHART BUILDERS
   ================================================================ */

function buildChartData(lang: Language) {
  const w = (es: string, en: string) => lang === 'es' ? es : en;

  const distribution = {
    labels: [
      'Banco Nación (76%)', 'BBVA (4%)', 'Santander (4%)',
      'Banco Ciudad (3%)', 'Macro (2%)', w('Otros (11%)', 'Others (11%)'),
    ],
    datasets: [{
      data: [76, 4, 4, 3, 2, 11],
      backgroundColor: [C.blueA, C.indigoA, C.redA, C.greenA, C.orangeA, 'rgba(48,54,61,0.5)'],
      borderColor: [C.blue, C.indigo, C.red, C.green, C.orange, '#30363d'],
      borderWidth: 2, hoverOffset: 8,
    }],
  };

  const timeline = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', w('Dic', 'Dec')],
    datasets: [
      {
        label: w('Escrituras con hipoteca (CABA)', 'Mortgaged deeds (CABA)'),
        data: [945, 965, 1050, 1192, 1250, 1320, 1393, 1350, 1450, 1400, 1350, 1238],
        backgroundColor: C.blueA, borderColor: C.blue, borderWidth: 2, borderRadius: 6,
      },
      {
        label: w('Escrituras totales (CABA)', 'Total deeds (CABA)'),
        data: [3645, 4293, 4747, 5471, 5762, 6200, 6651, 6370, 6998, 5250, 6100, 7646],
        backgroundColor: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.4)', borderWidth: 1, borderRadius: 4,
      },
    ],
  };

  const historical = {
    labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: w('Créditos hipotecarios totales (miles)', 'Total mortgages (thousands)'),
      data: [25.2, 52.8, 56.9, 8.1, 3.2, 2.1, 1.8, 2.5, 18.3, 44.3],
      backgroundColor: [
        C.blueA, C.greenA, C.greenA, C.redA, C.redA,
        C.redA, C.redA, C.yellowA, C.orangeA, C.blueA,
      ],
      borderColor: [
        C.blue, C.green, C.green, C.red, C.red,
        C.red, C.red, C.yellow, C.orange, C.blue,
      ],
      borderWidth: 2, borderRadius: 6,
    }],
  };

  return { distribution, timeline, historical };
}

/* ================================================================
   SOURCES
   ================================================================ */

const SOURCES = [
  { label: 'BCRA — Préstamos hipotecarios para vivienda (Dataset CSV)', url: 'https://www.bcra.gob.ar/archivos/Pdfs/BCRAyVos/HIPOTECA.CSV' },
  { label: 'Infobae — Boom de créditos hipotecarios: 2025 cerró como el cuarto mejor año (Feb 2026)', url: 'https://www.infobae.com/economia/2026/02/13/boom-de-creditos-hipotecarios-2025-cerro-como-el-cuarto-mejor-ano-desde-que-hay-registros-y-que-se-proyecta-para-2026/' },
  { label: 'Infobae — Un solo banco concentró el 76% de los créditos hipotecarios (Feb 2026)', url: 'https://www.infobae.com/economia/2026/02/25/un-solo-banco-concentro-el-76-de-los-creditos-hipotecarios-como-se-distribuye-el-mercado-y-que-pasa-con-las-tasas/' },
  { label: 'BNA — Fuerte expansión del crédito: USD 11.300M en 2025', url: 'https://prensa.bna.com.ar/CreditosBNA2025' },
  { label: 'BNA — El Banco Nación digitaliza el crédito hipotecario (+Hogares con BNA)', url: 'https://prensa.bna.com.ar/Hogaresconunclic' },
  { label: 'Ámbito — Uno de cada siete compradores accedió a un préstamo en 2025', url: 'https://www.ambito.com/real-estate/creditos-hipotecarios-uno-cada-siete-compradores-accedio-un-prestamo-2025-n6247696' },
  { label: 'INDEC — Indicadores de informalidad laboral EPH Q4 2025', url: 'https://www.indec.gob.ar/uploads/informesdeprensa/informalidad_laboral_eph_04_2529DEBE4DBB.pdf' },
  { label: 'Cronista — BNA: cuánto score necesito para el crédito hipotecario', url: 'https://www.cronista.com/finanzas-mercados/creditos-hipotecarios-del-banco-nacion-cuanto-score-necesito-para-pedirlo/' },
  { label: 'iProfesional — Motivos de rechazo de crédito hipotecario', url: 'https://www.iprofesional.com/finanzas/422111-cuales-son-motivos-por-los-que-pueden-rechazar-credito-hipotecario-como-evitarlo' },
  { label: 'Colegio de Escribanos — Estadísticas de escrituras CABA 2025', url: 'https://www.colegio-escribanos.org.ar/category/estadisticas-de-escrituras/' },
  { label: 'Diario Río Negro — 44.000 préstamos en 2025', url: 'https://www.rionegro.com.ar/economia/creditos-hipotecarios-el-2025-cerro-con-44-000-prestamos-y-se-ubico-entre-los-registros-mas-altos-hay-expectativa-para-2026/' },
  { label: 'INDEC/Hábitat — Déficit Habitacional Argentina', url: 'https://www.argentina.gob.ar/habitat/plan-nacional-de-suelo-urbano/observatorio-nacional-de-acceso-al-suelo/deficit-habitacional' },
  { label: 'Chequeado — Créditos hipotecarios otorgados a funcionarios (Abr 2026)', url: 'https://chequeado.com/el-explicador/que-se-sabe-sobre-los-creditos-hipotecarios-que-fueron-otorgados-a-funcionarios-del-gabinete-de-milei-y-a-diputados-de-lla/' },
];

/* ================================================================
   KPIS
   ================================================================ */

const KPIS = [
  { value: '3.2M', label: bi('Déficit Habitacional', 'Housing Deficit'), sub: bi('familias con problemas de vivienda', 'families with housing problems'), color: C.indigo },
  { value: '192.6K', label: bi('Solicitudes BNA', 'BNA Applications'), sub: bi('recibidas a julio 2025', 'received through July 2025'), color: C.blue },
  { value: '44.305', label: bi('Créditos Otorgados', 'Loans Granted'), sub: bi('total sistema 2025', 'total system 2025'), color: C.green },
  { value: '76%', label: bi('Share BNA', 'BNA Share'), sub: bi('del mercado hipotecario', 'of the mortgage market'), color: C.cyan },
  { value: '~17%', label: bi('Conversión Solicitud→Crédito', 'Application→Loan Conversion'), sub: bi('estimada BNA', 'estimated BNA'), color: C.orange },
];

/* ================================================================
   FUNNEL VISUAL COMPONENT
   ================================================================ */

function FunnelVisualization({ lang }: { lang: Language }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const t = useCallback((es: string, en: string) => lang === 'es' ? es : en, [lang]);

  return (
    <div className="space-y-1">
      {FUNNEL_STAGES.map((stage, i) => (
        <div key={i}>
          <div
            role="button"
            tabIndex={0}
            className="w-full flex items-center gap-2 sm:gap-4 group cursor-pointer py-1"
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIdx(activeIdx === i ? null : i); } }}
          >
            <div className="hidden sm:block w-[180px] lg:w-[220px] text-right shrink-0">
              <span className="text-xs text-gray-500 leading-tight">{pick(stage.label, lang)}</span>
              <span className={`inline-block ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${stage.type === 'dato' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                {stage.type === 'dato' ? t('DATO', 'DATA') : t('EST.', 'EST.')}
              </span>
            </div>

            <div className="flex-1 flex justify-center">
              <div
                className="h-12 sm:h-14 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110 min-w-[100px]"
                style={{ width: `${stage.widthPct}%`, background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)` }}
              >
                <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md px-2 text-center">
                  <span className="sm:hidden block text-[10px] leading-tight mb-0.5">{pick(stage.label, lang)}</span>
                  {stage.display}
                </span>
              </div>
            </div>

            <div className="w-[100px] sm:w-[140px] text-left shrink-0 pl-2">
              {stage.dropValue && (
                <>
                  <span className="text-xs sm:text-sm font-bold text-red-400">{stage.dropValue}</span>
                  <br />
                  <span className="text-[10px] text-gray-500 hidden sm:inline">{pick(stage.dropLabel, lang)}</span>
                </>
              )}
            </div>
          </div>

          {activeIdx === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 sm:mx-12 mb-2 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4"
            >
              <h4 className="text-sm font-bold text-sky-400 mb-2">{pick(stage.details.title, lang)}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{pick(stage.details.desc, lang)}</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.details.tags.map((tag, ti) => {
                  const cls = { red: 'bg-red-500/15 text-red-400 border-red-500/30', green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', orange: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }[stage.details.tagVariant];
                  return <span key={ti} className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>{tag}</span>;
                })}
              </div>
            </motion.div>
          )}

          {i < FUNNEL_STAGES.length - 1 && (
            <div className="text-center text-gray-600 text-sm py-0.5">▼</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function FunnelReportContent() {
  const { lang } = useLanguage();
  const t = (es: string, en: string) => lang === 'es' ? es : en;
  const charts = buildChartData(lang);

  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', {
        page_title: 'Special Report: Funnel Hipotecario BNA',
        page_location: window.location.href,
        content_group: 'Special Report',
        content_type: 'data-analysis',
      });
    }
  }, []);

  return (
    <div className="pt-28 pb-12">
      {/* Hero */}
      <section className="report-hero border-b border-white/10 px-4 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-indigo-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-sky-500/15 border border-sky-500/30 text-sky-400 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-5">
            {t('Investigación Argentina · Abril 2026', 'Argentina Research · April 2026')}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 special-report-title">
            {t('Funnel de Acceso al Crédito Hipotecario', 'Mortgage Access Funnel')}
            <br />
            <span className="text-2xl sm:text-3xl opacity-80">{t('Banco Nación Argentina — 2025', 'Banco Nación Argentina — 2025')}</span>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10">
            {t(
              'Del sueño de la casa propia a la escritura: cuántos argentinos pretenden acceder a un crédito hipotecario, cuántos lo logran, y en qué parte del camino se pierden.',
              'From homeownership dream to signed deed: how many Argentines seek a mortgage, how many succeed, and where they drop off along the way.'
            )}
          </p>

          <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto">
            {KPIS.map((kpi, i) => (
              <div key={i} className="glass rounded-xl px-5 py-4 min-w-[150px] text-center glow-border">
                <div className="text-3xl font-extrabold leading-none mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{pick(kpi.label, lang)}</div>
                <div className="text-[11px] text-gray-600 mt-1">{pick(kpi.sub, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        {/* S1 — Full Funnel */}
        <Section num={1} title={t('Funnel Completo: Del Sueño a la Escritura', 'Full Funnel: From Dream to Deed')} subtitle={t('Hacé click en cada etapa para ver detalles · Fuentes: BCRA, BNA, INDEC, Colegio de Escribanos', 'Click each stage for details · Sources: BCRA, BNA, INDEC, Notary Association')}>
          <Card>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
                {t('Dato duro (fuente oficial)', 'Hard data (official source)')}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/60" />
                {t('Estimación (cruce de datos)', 'Estimate (cross-referenced data)')}
              </div>
            </div>
            <FunnelVisualization lang={lang} />
            <Analysis>
              <strong className="report-heading">{t('Conversión total:', 'Total conversion:')}</strong>{' '}
              {t(
                'De 3.2M de familias con necesidad habitacional, solo ~33.700 accedieron a un crédito hipotecario vía BNA en 2025. Eso es el ~1.05% del universo de necesidad, o ~17.5% de las solicitudes formales.',
                'Of 3.2M families with housing needs, only ~33,700 accessed a BNA mortgage in 2025. That\'s ~1.05% of the need universe, or ~17.5% of formal applications.'
              )}
            </Analysis>
          </Card>
        </Section>

        {/* S2 — Barriers */}
        <Section num={2} title={t('Principales Barreras del Funnel', 'Main Funnel Barriers')} subtitle={t('Factores que impiden el avance en cada etapa', 'Factors preventing progress at each stage')}>
          <Card title={t('Impacto relativo de cada barrera', 'Relative impact of each barrier')} subtitle={t('Porcentaje de candidatos afectados por cada factor', 'Percentage of candidates affected by each factor')}>
            <div className="space-y-3">
              {BARRIERS.map((b, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{b.icon}</span>
                    <span className="text-xs sm:text-sm min-w-[160px] sm:min-w-[200px] shrink-0">{pick(b.label, lang)}</span>
                    <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: b.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12 text-right shrink-0" style={{ color: b.color }}>{b.pct}%</span>
                  </div>
                  <p className="text-[11px] text-gray-600 ml-9 sm:ml-[calc(1.25rem+200px+0.75rem)] mt-0.5">{pick(b.desc, lang)}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* S3 — Market Distribution */}
        <Section num={3} title={t('Distribución del Mercado Hipotecario', 'Mortgage Market Distribution')} subtitle={t('Market share por banco · Fuente: BCRA, Infobae (Oct 2025)', 'Market share by bank · Source: BCRA, Infobae (Oct 2025)')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('Market Share Hipotecario (Octubre 2025)', 'Mortgage Market Share (October 2025)')}>
              <div className="h-[300px]">
                <Doughnut data={charts.distribution} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' as const, ...LEGEND_OPTS },
                    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}% ${t('del mercado', 'of market')}` } },
                  },
                }} />
              </div>
            </Card>
            <Card title={t('¿Por qué domina el BNA?', 'Why does BNA dominate?')}>
              <div className="space-y-4 text-sm text-gray-400">
                <p><strong className="report-heading text-sky-400">{t('Tasa más baja del mercado', 'Lowest market rate')}</strong><br />{t('4.5% inicial → 6% UVA. Otros bancos privados: 5.5%-8.5% UVA.', '4.5% initial → 6% UVA. Other private banks: 5.5%-8.5% UVA.')}</p>
                <p><strong className="report-heading text-sky-400">{t('Mayor plazo', 'Longest term')}</strong><br />{t('Hasta 30 años vs. 20-25 de la competencia.', 'Up to 30 years vs. 20-25 from competitors.')}</p>
                <p><strong className="report-heading text-sky-400">{t('Financiamiento al 75%', '75% financing')}</strong><br />{t('Financia hasta el 75% del valor de tasación. Algunos privados limitan al 60-70%.', 'Finances up to 75% of appraisal value. Some private banks limit to 60-70%.')}</p>
                <p><strong className="report-heading text-sky-400">{t('Digitalización 2026', '2026 Digitalization')}</strong><br />{t('+Hogares con BNA: proceso 100% digital desde enero 2026, promete reducir de 60 a 30 días.', '+Hogares con BNA: 100% digital process since January 2026, promises to cut from 60 to 30 days.')}</p>
              </div>
            </Card>
          </div>
        </Section>

        {/* S4 — Monthly Evolution */}
        <Section num={4} title={t('Evolución Mensual 2025', 'Monthly Evolution 2025')} subtitle={t('Escrituras con hipoteca en CABA · Fuente: Colegio de Escribanos', 'Mortgaged deeds in CABA · Source: Notary Association')}>
          <Card title={t('Escrituras con Hipoteca vs. Totales — CABA 2025', 'Mortgaged vs. Total Deeds — CABA 2025')} subtitle={t('Solo 1 de cada 7 compradores accedió a un préstamo hipotecario', 'Only 1 in 7 buyers accessed a mortgage loan')}>
            <div className="h-[360px]">
              <Bar data={charts.timeline} options={{
                responsive: true, maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' as const },
                plugins: { legend: LEGEND_OPTS },
                scales: {
                  y: { beginAtZero: true, ticks: { color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
                  x: { grid: { display: false }, ticks: { color: AXIS_COLOR } },
                },
              }} />
            </div>
            <Analysis>
              {t(
                'El pico de escrituras con hipoteca en CABA fue en septiembre (1.450), representando ~21% de las escrituras totales del mes. El 85% de las compras se realizó sin financiamiento hipotecario: cash, ahorro previo o financiación propia.',
                'The peak of mortgaged deeds in CABA was September (1,450), representing ~21% of the month\'s total deeds. 85% of purchases were made without mortgage financing: cash, prior savings, or self-financing.'
              )}
            </Analysis>
          </Card>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S5 — Historical */}
        <Section num={5} title={t('Contexto Histórico: Créditos Hipotecarios (2016-2025)', 'Historical Context: Mortgages (2016-2025)')} subtitle={t('Evolución del mercado hipotecario argentino · Fuente: BCRA', 'Argentine mortgage market evolution · Source: BCRA')}>
          <Card title={t('Créditos hipotecarios totales por año (miles)', 'Total mortgages by year (thousands)')} subtitle={t('2025 fue el 4° mejor año histórico', '2025 was the 4th best year on record')}>
            <div className="h-[360px]">
              <Bar data={charts.historical} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { callback: (v) => `${v}K`, color: AXIS_COLOR }, grid: { color: GRID_COLOR } },
                  x: { grid: { display: false }, ticks: { color: AXIS_COLOR } },
                },
              }} />
            </div>
            <Analysis>
              <strong className="report-heading">{t('Ciclos claros:', 'Clear cycles:')}</strong>{' '}
              {t(
                'El boom de créditos UVA 2017-2018 (pico de 56.9K) colapsó con la crisis cambiaria. El mercado estuvo virtualmente congelado entre 2019-2023. La reactivación comenzó en 2024 con el regreso de las tasas UVA competitivas, y 2025 cerró como el 4° mejor año con 44.305 créditos — aún 22% debajo del pico 2018.',
                'The 2017-2018 UVA loan boom (56.9K peak) collapsed with the currency crisis. The market was virtually frozen between 2019-2023. Reactivation began in 2024 with competitive UVA rates returning, and 2025 closed as the 4th best year with 44,305 loans — still 22% below the 2018 peak.'
              )}
            </Analysis>
          </Card>
        </Section>

        {/* S6 — Macro Context */}
        <Section num={6} title={t('Contexto Macroeconómico', 'Macroeconomic Context')} subtitle={t('Factores estructurales que condicionan el acceso al crédito', 'Structural factors conditioning credit access')}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HighlightBox variant="red" title={t('Factores de Exclusión', 'Exclusion Factors')}>
              <p><strong className="report-heading">{t('Informalidad: 43%', 'Informality: 43%')}</strong> — {t('~5.8M trabajadores sin empleo registrado (INDEC Q4 2025). Los excluye automáticamente del crédito formal.', '~5.8M workers without formal employment (INDEC Q4 2025). Automatically excluded from formal credit.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Jóvenes 16-24: 67.4% informales', 'Youth 16-24: 67.4% informal')}</strong> — {t('El segmento con mayor necesidad de primer hogar es el más excluido del sistema crediticio.', 'The segment with the greatest first-home need is the most excluded from the credit system.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Ingreso mínimo: ~$2M/mes', 'Minimum income: ~$2M/month')}</strong> — {t('Para un crédito de ~USD 75.000, excluyendo a la mayoría de la población.', 'For a ~USD 75,000 loan, excluding most of the population.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Score: 909+ puntos', 'Score: 909+ points')}</strong> — {t('BNA elevó el requisito de 400-700 a 909 en H2 2025, reduciendo drásticamente la elegibilidad.', 'BNA raised the requirement from 400-700 to 909 in H2 2025, drastically reducing eligibility.')}</p>
            </HighlightBox>
            <HighlightBox variant="green" title={t('Señales Positivas', 'Positive Signals')}>
              <p><strong className="report-heading">{t('4° mejor año histórico', '4th best year on record')}</strong> — {t('44.305 créditos otorgados en 2025, con tendencia alcista.', '44,305 loans granted in 2025, with upward trend.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Tasa de mora: ~1%', 'Default rate: ~1%')}</strong> — {t('Los créditos otorgados presentan excelente calidad de cartera.', 'Granted loans show excellent portfolio quality.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Digitalización BNA 2026', 'BNA Digitalization 2026')}</strong> — {t('Proceso 100% digital promete reducir tiempos de 60 a 30 días.', '100% digital process promises to cut times from 60 to 30 days.')}</p>
              <p className="mt-3"><strong className="report-heading">{t('Proyección 2026', '2026 Projection')}</strong> — {t('Se estima superar los 50K créditos si se mantienen las condiciones macroeconómicas.', 'Expected to exceed 50K loans if macroeconomic conditions hold.')}</p>
            </HighlightBox>
          </div>
        </Section>

        <hr className="border-white/10 my-12" />

        {/* S7 — Key Findings */}
        <Section num={7} title={t('Hallazgos Clave', 'Key Findings')} subtitle={t('Conclusiones de la investigación sobre el funnel', 'Research conclusions on the funnel')}>
          <Card className="report-conclusion-card border-sky-500/25">
            <div className="text-sm text-gray-400 leading-relaxed space-y-4">
              <p>{t(
                'El acceso al crédito hipotecario en Argentina enfrenta un cuello de botella estructural que va mucho más allá de las tasas de interés:',
                'Mortgage access in Argentina faces a structural bottleneck that goes far beyond interest rates:'
              )}</p>
              <p><strong style={{ color: C.red }}>{t('1. El filtro de la informalidad es el más devastador:', '1. The informality filter is the most devastating:')}</strong> {t('El 43% de informalidad laboral elimina a casi la mitad del universo antes de que siquiera puedan entrar al sistema. Los jóvenes (67.4% informales) — quienes más necesitan primer hogar — son los más excluidos.', '43% labor informality eliminates nearly half the universe before they can even enter the system. Youth (67.4% informal) — who most need a first home — are the most excluded.')}</p>
              <p><strong style={{ color: C.orange }}>{t('2. El scoring es una barrera silenciosa:', '2. Credit scoring is a silent barrier:')}</strong> {t('La suba del score de 400-700 a 909 puntos eliminó a la mayoría de los solicitantes en H2 2025. Este endurecimiento contrasta con la narrativa de "boom hipotecario".', 'Raising the score from 400-700 to 909 points eliminated most applicants in H2 2025. This tightening contrasts with the "mortgage boom" narrative.')}</p>
              <p><strong style={{ color: C.blue }}>{t('3. Las propiedades son el cuello de botella oculto:', '3. Properties are the hidden bottleneck:')}</strong> {t('El 90% de rechazos por propiedad son documentales: títulos observados, planos desactualizados, herencias sin declarar. Es un problema del ecosistema inmobiliario, no del sistema bancario.', '90% of property rejections are documentary: contested titles, outdated blueprints, undeclared inheritances. This is a real estate ecosystem problem, not a banking system one.')}</p>
              <p><strong style={{ color: C.green }}>{t('4. Solo 1 de cada 7 compradores usa crédito:', '4. Only 1 in 7 buyers uses a mortgage:')}</strong> {t('El 85% de las compras de inmuebles en 2025 se realizó sin financiamiento hipotecario. Argentina sigue siendo un mercado predominantemente cash.', '85% of property purchases in 2025 were made without mortgage financing. Argentina remains a predominantly cash market.')}</p>
              <p><strong style={{ color: C.purple }}>{t('5. El BNA es el mercado:', '5. BNA IS the market:')}</strong> {t('Con el 76% del market share, las decisiones del Banco Nación definen el acceso al crédito hipotecario para todo el país. Esto genera una concentración de riesgo y dependencia sistémica.', 'With 76% market share, Banco Nación\'s decisions define mortgage access for the entire country. This creates risk concentration and systemic dependency.')}</p>
            </div>
          </Card>
        </Section>

        {/* Methodology CTA */}
        <Link href="/blog/special/funnel-hipotecario-bna/methodology" className="block glass rounded-2xl p-6 mt-10 border border-sky-500/20 hover:border-sky-500/40 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/25 shrink-0 group-hover:bg-sky-500/20 transition-colors">
              <span className="text-xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold report-heading mb-1">
                {t('Documento de Metodología y Fuentes', 'Methodology & Sources Document')}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t(
                  'Trazabilidad completa: cada dato → fuente original. Incluye dato crudo, estimaciones, supuestos y limitaciones del análisis.',
                  'Full traceability: each data point → original source. Includes raw data, estimates, assumptions and analysis limitations.'
                )}
              </p>
            </div>
            <span className="text-sky-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Sources */}
        <div className="glass rounded-2xl p-6 mt-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t('Fuentes verificables citadas', 'Verifiable cited sources')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
            {SOURCES.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline truncate block">{s.label}</a>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-4 italic">
            {t(
              'Nota: Este funnel combina datos duros de fuentes oficiales (BCRA, BNA, INDEC, Colegio de Escribanos) con estimaciones calculadas por cruce de datos. Las etapas marcadas como "Estimado" se basan en ratios de conversión y datos parciales.',
              'Note: This funnel combines hard data from official sources (BCRA, BNA, INDEC, Notary Association) with estimates calculated by cross-referencing data. Stages marked as "Estimate" are based on conversion ratios and partial data.'
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
