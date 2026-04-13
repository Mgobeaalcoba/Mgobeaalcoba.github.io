'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ExternalLink, Database, BarChart3, AlertTriangle, Target, BookOpen } from 'lucide-react';
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
      <section className="report-hero border-b border-white/10 px-4 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/blog/special/funnel-hipotecario-bna" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium mb-6 transition-colors">
            <ArrowLeft size={14} /> {t('Volver al informe', 'Back to report')}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4 special-report-title">
            {t('Metodología y Fuentes', 'Methodology & Sources')}
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            {t(
              'Trazabilidad completa: cada dato → fuente original. Incluye dato crudo, estimaciones, supuestos, y limitaciones del análisis.',
              'Full traceability: each data point → original source. Includes raw data, estimates, assumptions, and analysis limitations.'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        {/* S1 — Data Sources */}
        <Section icon={Database} num={1} title={t('Fuentes de Datos Primarias', 'Primary Data Sources')} subtitle={t('Organismos y publicaciones oficiales consultados', 'Official bodies and publications consulted')}>
          <Card title={t('Fuentes oficiales (datos duros)', 'Official sources (hard data)')}>
            <DataTable
              headers={[t('Fuente', 'Source'), t('Dato', 'Data Point'), t('Periodo', 'Period'), t('Tipo', 'Type')]}
              rows={[
                ['BCRA', t('Préstamos hipotecarios para vivienda', 'Mortgage loans for housing'), '2016–2025', t('Dataset CSV público', 'Public CSV dataset')],
                ['BNA (prensa oficial)', t('192.600 solicitudes recibidas', '192,600 applications received'), t('Hasta julio 2025', 'Through July 2025'), t('Comunicado', 'Press release')],
                ['BNA (prensa oficial)', t('USD 11.300M en créditos 2025', 'USD 11.3B in loans 2025'), '2025', t('Comunicado', 'Press release')],
                ['INDEC', t('Informalidad laboral 43%', 'Labor informality 43%'), 'Q4 2025', t('Informe EPH', 'EPH Report')],
                ['INDEC/Hábitat', t('Déficit habitacional 3.2M', 'Housing deficit 3.2M'), t('Último censo', 'Last census'), t('Dato oficial', 'Official data')],
                [t('Col. Escribanos CABA', 'CABA Notary Association'), t('Escrituras con hipoteca mensual', 'Monthly mortgaged deeds'), '2025', t('Estadísticas mensuales', 'Monthly statistics')],
              ]}
            />
            <SourceLink url="https://www.bcra.gob.ar/archivos/Pdfs/BCRAyVos/HIPOTECA.CSV" label={t('Dataset BCRA hipotecarios', 'BCRA mortgage dataset')} />
            <span className="mx-2 text-gray-600">·</span>
            <SourceLink url="https://www.indec.gob.ar/uploads/informesdeprensa/informalidad_laboral_eph_04_2529DEBE4DBB.pdf" label={t('INDEC informalidad', 'INDEC informality')} />
          </Card>

          <Card title={t('Fuentes periodísticas verificadas', 'Verified journalistic sources')}>
            <DataTable
              headers={[t('Medio', 'Outlet'), t('Dato extraído', 'Extracted data'), t('Fecha', 'Date')]}
              rows={[
                ['Infobae', t('44.305 créditos totales 2025 (4° mejor año)', '44,305 total loans 2025 (4th best year)'), 'Feb 2026'],
                ['Infobae', t('76% market share BNA (octubre 2025)', '76% BNA market share (October 2025)'), 'Feb 2026'],
                ['Ámbito', t('1 de cada 7 compradores usó hipotecario', '1 in 7 buyers used a mortgage'), '2025'],
                ['Cronista', t('Score requerido BNA: 909 puntos', 'BNA required score: 909 points'), '2025'],
                ['iProfesional', t('90% rechazos por problemas documentales', '90% rejections due to documentation'), '2025'],
                ['Chequeado', t('Créditos a funcionarios — auditoría', 'Loans to officials — audit'), 'Abr 2026'],
                ['Diario Río Negro', t('44.000 préstamos, expectativa 2026', '44,000 loans, 2026 outlook'), '2025'],
              ]}
            />
          </Card>
        </Section>

        {/* S2 — Funnel construction */}
        <Section icon={BarChart3} num={2} title={t('Construcción del Funnel', 'Funnel Construction')} subtitle={t('Cómo se estimaron las etapas intermedias', 'How intermediate stages were estimated')}>
          <Card title={t('Datos duros vs. estimaciones', 'Hard data vs. estimates')}>
            <DataTable
              headers={[t('Etapa', 'Stage'), t('Valor', 'Value'), t('Clasificación', 'Classification'), t('Método', 'Method')]}
              rows={[
                [t('Déficit habitacional', 'Housing deficit'), '3.200.000', t('DATO DURO', 'HARD DATA'), t('INDEC/Hábitat — dato oficial del déficit', 'INDEC/Hábitat — official deficit data')],
                [t('Empleo formal', 'Formal employment'), '~1.824.000', t('ESTIMADO', 'ESTIMATE'), t('3.2M × (1 - 0.43 informalidad)', '3.2M × (1 - 0.43 informality)')],
                [t('Ingreso suficiente', 'Sufficient income'), '~550.000', t('ESTIMADO', 'ESTIMATE'), t('~30% de formales superan $2M/mes (cruce salarios INDEC)', '~30% of formal workers earn >$2M/mo (INDEC salary cross-ref)')],
                [t('Interesados activos', 'Active prospects'), '~350.000', t('ESTIMADO', 'ESTIMATE'), t('~64% de elegibles hacen alguna consulta (benchmarks bancarios)', '~64% of eligible make some inquiry (banking benchmarks)')],
                [t('Solicitudes BNA', 'BNA applications'), '192.600', t('DATO DURO', 'HARD DATA'), t('BNA comunicado oficial (hasta julio 2025)', 'BNA official press release (through July 2025)')],
                [t('Pre-aprobados', 'Pre-approved'), '~65.000', t('ESTIMADO', 'ESTIMATE'), t('~34% aprobación crediticia (ratio típico bancario arg.)', '~34% credit approval (typical Argentine banking ratio)')],
                [t('Propiedad apta', 'Eligible property'), '~45.000', t('ESTIMADO', 'ESTIMATE'), t('~69% encuentran propiedad apta (cruce escribanos/rechazos)', '~69% find eligible property (notary/rejection cross-ref)')],
                [t('Créditos otorgados BNA', 'BNA loans granted'), '~33.700', t('ESTIMADO', 'ESTIMATE'), t('44.305 total × 76% share BNA', '44,305 total × 76% BNA share')],
              ]}
            />
            <Note>
              <strong className="report-heading">{t('Sobre la tasa de conversión del 17%:', 'On the 17% conversion rate:')}</strong>{' '}
              {t(
                'Se calcula sobre 192.600 solicitudes (julio 2025) vs. ~33.700 créditos estimados BNA (año completo). Este ratio puede subestimar la caída real: las solicitudes del segundo semestre aún no se habrían materializado al cierre del año.',
                'Calculated on 192,600 applications (July 2025) vs. ~33,700 estimated BNA loans (full year). This ratio may underestimate actual drop-off: second-half applications would not have materialized by year-end.'
              )}
            </Note>
          </Card>
        </Section>

        {/* S3 — Key Assumptions */}
        <Section icon={Target} num={3} title={t('Supuestos Clave', 'Key Assumptions')} subtitle={t('Hipótesis utilizadas en las estimaciones', 'Hypotheses used in estimates')}>
          <Card>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <p><strong className="report-heading">1. {t('Ingreso mínimo ~$2M/mes', 'Minimum income ~$2M/month')}:</strong> {t('Basado en un crédito de ~USD 75.000 (ticket promedio BNA) con cuota/ingreso del 25%. El salario mediano argentino ronda $800K-$1M según INDEC, por lo que estimamos ~30% de trabajadores formales superan el umbral.', 'Based on a ~USD 75,000 loan (BNA average ticket) with 25% payment-to-income ratio. Argentine median salary is ~$800K-$1M per INDEC, so we estimate ~30% of formal workers exceed the threshold.')}</p>
              <p><strong className="report-heading">2. {t('Score crediticio 909', 'Credit score 909')}:</strong> {t('Dato reportado por Cronista para BNA en H2 2025. El cambio desde 400-700 a 909 es verificable. La distribución de scores de la población no es pública, por lo que el 66% de rechazo es una estimación basada en benchmarks del sector.', 'Reported by Cronista for BNA in H2 2025. The change from 400-700 to 909 is verifiable. Population score distribution is not public, so the 66% rejection is an estimate based on sector benchmarks.')}</p>
              <p><strong className="report-heading">3. {t('90% rechazos documentales', '90% documentary rejections')}:</strong> {t('Dato de iProfesional/REMAX sobre rechazos en la etapa de propiedad. Incluye títulos observados, planos desactualizados, herencias sin declarar y ampliaciones irregulares.', 'Data from iProfesional/REMAX on property-stage rejections. Includes contested titles, outdated blueprints, undeclared inheritances, and irregular expansions.')}</p>
              <p><strong className="report-heading">4. {t('Market share BNA 76%', 'BNA market share 76%')}:</strong> {t('Dato de Infobae basado en cifras de BCRA para octubre 2025. Se asume constante para el cálculo anual, aunque el share real puede variar mensualmente.', 'Infobae data based on BCRA figures for October 2025. Assumed constant for the annual calculation, though actual share may vary monthly.')}</p>
              <p><strong className="report-heading">5. {t('Ahorro previo 25%', 'Prior savings 25%')}:</strong> {t('BNA financia hasta 75% del valor de tasación. El 25% restante debe provenir de ahorro propio. Estimamos que ~55% de los candidatos no cuenta con este capital, basado en datos de ahorro de hogares argentinos.', 'BNA finances up to 75% of appraisal value. The remaining 25% must come from savings. We estimate ~55% of candidates lack this capital, based on Argentine household savings data.')}</p>
            </div>
          </Card>
        </Section>

        {/* S4 — Limitations */}
        <Section icon={AlertTriangle} num={4} title={t('Limitaciones del Análisis', 'Analysis Limitations')} subtitle={t('Factores que podrían afectar la precisión', 'Factors that could affect accuracy')}>
          <Card>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <p><strong className="report-heading text-amber-400">{t('Temporalidad asimétrica:', 'Asymmetric timing:')}</strong> {t('Las 192.600 solicitudes BNA son hasta julio 2025, pero los créditos otorgados (44.305 total) son del año completo. Esto puede sesgar la tasa de conversión.', 'The 192,600 BNA applications are through July 2025, but granted loans (44,305 total) are full-year. This may bias the conversion rate.')}</p>
              <p><strong className="report-heading text-amber-400">{t('Datos CABA-céntricos:', 'CABA-centric data:')}</strong> {t('Las estadísticas de escrituras provienen del Colegio de Escribanos de CABA. La dinámica en PBA, interior y NOA/NEA puede ser significativamente diferente.', 'Deed statistics come from the CABA Notary Association. Dynamics in Buenos Aires Province, interior, and NOA/NEA may differ significantly.')}</p>
              <p><strong className="report-heading text-amber-400">{t('Distribución de scores no pública:', 'Score distribution not public:')}</strong> {t('No existe dato público sobre qué porcentaje de la población argentina tiene score >= 909. La estimación del 66% de rechazo es extrapolada de benchmarks del sector financiero.', 'There is no public data on what percentage of the Argentine population has a score >= 909. The 66% rejection estimate is extrapolated from financial sector benchmarks.')}</p>
              <p><strong className="report-heading text-amber-400">{t('Etapas intermedias son estimaciones:', 'Intermediate stages are estimates:')}</strong> {t('"Interesados activos", "Pre-aprobados" y "Propiedad apta" no tienen datos duros disponibles. Son cálculos de razonabilidad basados en fuentes cruzadas.', '"Active prospects", "Pre-approved" and "Eligible property" lack hard data. These are reasonability calculations based on cross-referenced sources.')}</p>
              <p><strong className="report-heading text-amber-400">{t('Polémica funcionarios:', 'Officials controversy:')}</strong> {t('En abril 2026, Chequeado reportó créditos hipotecarios otorgados a funcionarios del gabinete, generando una auditoría interna del BNA. Esto podría afectar las políticas de otorgamiento futuras.', 'In April 2026, Chequeado reported mortgage loans granted to cabinet officials, triggering an internal BNA audit. This could affect future lending policies.')}</p>
            </div>
          </Card>
        </Section>

        {/* S5 — Reproducibility */}
        <Section icon={BookOpen} num={5} title={t('Reproducibilidad', 'Reproducibility')} subtitle={t('Cómo verificar los datos de este informe', 'How to verify this report\'s data')}>
          <Card>
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <p>{t(
                'Todos los datos duros de este informe pueden verificarse accediendo a las fuentes originales listadas abajo. Para las estimaciones, se detalla el cálculo utilizado para que pueda ser replicado o ajustado con datos más precisos.',
                'All hard data in this report can be verified by accessing the original sources listed below. For estimates, the calculation used is detailed so it can be replicated or adjusted with more precise data.'
              )}</p>
              <DataTable
                headers={[t('Afirmación', 'Claim'), t('Fuente verificable', 'Verifiable source'), 'URL']}
                rows={[
                  [t('3.2M déficit habitacional', '3.2M housing deficit'), 'INDEC/Hábitat', 'argentina.gob.ar/habitat/...'],
                  [t('192.600 solicitudes BNA', '192,600 BNA applications'), t('BNA prensa oficial', 'BNA official press'), 'prensa.bna.com.ar/...'],
                  [t('44.305 créditos 2025', '44,305 loans 2025'), 'Infobae / BCRA', 'infobae.com/economia/...'],
                  [t('76% market share BNA', '76% BNA market share'), 'Infobae / BCRA', 'infobae.com/economia/...'],
                  [t('43% informalidad', '43% informality'), 'INDEC EPH Q4 2025', 'indec.gob.ar/...'],
                  [t('Score 909 BNA', 'BNA score 909'), 'Cronista', 'cronista.com/...'],
                  [t('1 de 7 compradores', '1 in 7 buyers'), 'Ámbito', 'ambito.com/...'],
                ]}
              />
            </div>
          </Card>
        </Section>

        {/* Back */}
        <div className="text-center mt-12 space-y-4">
          <Link href="/blog/special/funnel-hipotecario-bna" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-medium transition-colors">
            <ArrowLeft size={16} />
            {t('Volver al informe completo', 'Back to full report')}
          </Link>
          <br />
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-400 text-sm transition-colors">
            <ArrowLeft size={14} />
            {t('Volver al Blog', 'Back to Blog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
