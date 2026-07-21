'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRecursosData } from '@/contexts/RecursosDataContext';
import type { TaxParams } from '@/lib/queries';


interface TaxInputs {
  grossSalary: number;
  extraIncome: number;
  includeSAC: boolean;
  conyuge: boolean;
  hijos: number;
  hijosIncap: number;
  alquiler: number; alquilerAnual: boolean; alquilerAdicional10: boolean;
  domestico: number; domesticoAnual: boolean;
  hipotecario: number; hipotecarioAnual: boolean;
  medicos: number; medicosAnual: boolean;
  educacion: number; educacionAnual: boolean;
  donaciones: number; donacionesAnual: boolean;
  seguroVida: number; seguroVidaAnual: boolean;
  sepelio: number; sepelioAnual: boolean;
  insumos: number; insumosAnual: boolean;
}

interface TaxResult {
  aportesMensuales: number;
  aportesAnuales: number;
  annualGross: number;
  dedPersonales: number;
  dedOtras: number;
  totalDeductions: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  netMonthly: number;
  effectiveRate: number;
}

const OFFICIAL_ANNUAL_2026 = {
  gni: 6019671.36,
  deduccion_especial: 28894422.56,
  conyuge: 5669323.06,
  hijo: 2859060.31,
  hijo_incapacitado: 5718120.60,
  escala: [
    { limite: 0, fijo: 0, pct: 0.05 },
    { limite: 2336953.69, fijo: 116847.68, pct: 0.09 },
    { limite: 4673907.36, fijo: 327173.52, pct: 0.12 },
    { limite: 7010861.05, fijo: 607607.96, pct: 0.15 },
    { limite: 10516291.59, fijo: 1133422.54, pct: 0.19 },
    { limite: 21032583.18, fijo: 3131517.94, pct: 0.23 },
    { limite: 31548874.77, fijo: 5550265.01, pct: 0.27 },
    { limite: 47323312.16, fijo: 9809363.10, pct: 0.31 },
    { limite: 70984968.25, fijo: 17144476.49, pct: 0.35 },
  ],
} as const;

const OFFICIAL_JUL_DEC_2026 = {
  gni: 5585736.93,
  deduccion_especial: 26811537.29,
  conyuge: 5260643.86,
  hijo: 2652961.90,
  hijo_incapacitado: 5305923.78,
  escala: [
    { limite: 0, fijo: 0, pct: 0.05 },
    { limite: 2168491.89, fijo: 108424.59, pct: 0.09 },
    { limite: 4336983.77, fijo: 303588.86, pct: 0.12 },
    { limite: 6505475.65, fijo: 563807.89, pct: 0.15 },
    { limite: 9758213.49, fijo: 1051718.57, pct: 0.19 },
    { limite: 19516426.99, fijo: 2905779.13, pct: 0.23 },
    { limite: 29274640.48, fijo: 5150168.23, pct: 0.27 },
    { limite: 43911960.73, fijo: 9102244.70, pct: 0.31 },
    { limite: 65867941.10, fijo: 15908598.62, pct: 0.35 },
  ],
} as const;

const OFFICIAL_CONTRIBUTION_BASES_JULY_2026 = {
  min: 138757.90,
  max: 4509567.41,
} as const;

const OFFICIAL_GENERAL_DEDUCTION_CAPS_2026 = {
  seguroVida: 753472.14,
  hipotecario: 20000,
  sepelio: 996.23,
} as const;

type OfficialArticle30And94Params = typeof OFFICIAL_ANNUAL_2026 | typeof OFFICIAL_JUL_DEC_2026;

function applyCurrentGeneralParameters(params: TaxParams): TaxParams {
  return {
    ...params,
    aportes_base_min: OFFICIAL_CONTRIBUTION_BASES_JULY_2026.min,
    aportes_base_max: OFFICIAL_CONTRIBUTION_BASES_JULY_2026.max,
    alquiler_tope: params.gni,
    educacion_tope: params.gni * 0.40,
    seguro_vida_tope: OFFICIAL_GENERAL_DEDUCTION_CAPS_2026.seguroVida,
    hipotecario_tope: OFFICIAL_GENERAL_DEDUCTION_CAPS_2026.hipotecario,
    sepelio_tope: OFFICIAL_GENERAL_DEDUCTION_CAPS_2026.sepelio,
  };
}

function buildOfficialParams(
  params: TaxParams,
  official: OfficialArticle30And94Params,
  period: string
): TaxParams {
  return {
    ...applyCurrentGeneralParameters(params),
    period,
    gni: official.gni,
    deduccion_especial: official.deduccion_especial,
    conyuge: official.conyuge,
    hijo: official.hijo,
    hijo_incapacitado: official.hijo_incapacitado,
    alquiler_tope: official.gni,
    educacion_tope: official.gni * 0.40,
    escala: official.escala.map((tramo) => ({ ...tramo })),
  };
}

/**
 * Official parameters for the 2026 annual/final liquidation published by ARCA.
 *
 * The calculator intentionally keeps an annualized average-monthly estimate.
 * The separate Jul-Dec payroll tables are cumulative by month and require the
 * employee's year-to-date remuneration, deductions and prior withholdings.
 */
function buildOfficialAnnualParams(params: TaxParams): TaxParams {
  return buildOfficialParams(params, OFFICIAL_ANNUAL_2026, 'Liquidación anual 2026 (oficial)');
}

function buildOfficialSecondSemesterParams(params: TaxParams): TaxParams {
  return buildOfficialParams(params, OFFICIAL_JUL_DEC_2026, 'Retenciones Jul-Dic 2026 (oficial)');
}

const SCALE_MONTHS = [
  { value: '1', es: 'Enero', en: 'January' },
  { value: '2', es: 'Febrero', en: 'February' },
  { value: '3', es: 'Marzo', en: 'March' },
  { value: '4', es: 'Abril', en: 'April' },
  { value: '5', es: 'Mayo', en: 'May' },
  { value: '6', es: 'Junio', en: 'June' },
  { value: '7', es: 'Julio', en: 'July' },
  { value: '8', es: 'Agosto', en: 'August' },
  { value: '9', es: 'Septiembre', en: 'September' },
  { value: '10', es: 'Octubre', en: 'October' },
  { value: '11', es: 'Noviembre', en: 'November' },
  { value: '12', es: 'Diciembre', en: 'December' },
] as const;

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Builds the official cumulative Art. 94 scale for a selected payroll month.
 * January-June accrue the original 2026 values. From July onward, the first
 * semester remains fixed and each month adds 1/12 of the updated annual scale.
 */
function buildOfficialMonthlyScale(params: TaxParams, month: number): TaxParams['escala'] {
  // Use the published cumulative December table verbatim. Rebuilding it from
  // annual inputs can move a handful of values by one cent due to rounding.
  if (month === 12) {
    return OFFICIAL_JUL_DEC_2026.escala.map((tramo) => ({ ...tramo }));
  }

  const previousWeight = Math.min(month, 6) / 12;
  const updatedWeight = Math.max(month - 6, 0) / 12;

  return params.escala.map((tramo, index) => {
    const updatedTramo = OFFICIAL_ANNUAL_2026.escala[index];
    return {
      limite: roundCurrency(
        tramo.limite * previousWeight + updatedTramo.limite * updatedWeight
      ),
      fijo: roundCurrency(
        tramo.fijo * previousWeight + updatedTramo.fijo * updatedWeight
      ),
      pct: tramo.pct,
    };
  });
}

function applyScale(taxable: number, params: TaxParams): number {
  if (taxable <= 0) return 0;
  for (let i = params.escala.length - 1; i >= 0; i--) {
    if (taxable > params.escala[i].limite) {
      const excedente = taxable - params.escala[i].limite;
      return params.escala[i].fijo + excedente * params.escala[i].pct;
    }
  }
  return 0;
}

function toAnnual(val: number, isAnnual: boolean): number {
  return isAnnual ? val : val * 12;
}

function calculateTax(inputs: TaxInputs, params: TaxParams): TaxResult {
  const { grossSalary, extraIncome, includeSAC } = inputs;
  const salaryPayments = includeSAC ? 13 : 12;
  const MNI_ANUAL = params.gni + params.deduccion_especial;

  // 1. Ganancia bruta anual (ANTES de aportes)
  const annualGross = grossSalary * salaryPayments + extraIncome;

  // 2. Aportes con topes de base imponible mensual
  const baseMensual = Math.min(
    Math.max(grossSalary, params.aportes_base_min),
    params.aportes_base_max
  );
  const aportesMensuales = baseMensual * params.aportes_pct;
  const aportesAnuales = aportesMensuales * salaryPayments;

  // 3. Deducciones personales
  const dedPersonalesBase =
    MNI_ANUAL +
    (inputs.conyuge ? params.conyuge : 0) +
    inputs.hijos * params.hijo +
    inputs.hijosIncap * params.hijo_incapacitado;
  // ARCA allows an additional twelfth of the applicable personal deductions
  // when the annual projection includes the complementary annual salary (SAC).
  const deduccionAdicionalSAC = includeSAC ? dedPersonalesBase / 12 : 0;
  const dedPersonales = dedPersonalesBase + deduccionAdicionalSAC;

  // 4. Otras deducciones con topes oficiales
  const alquilerAnual = toAnnual(inputs.alquiler, inputs.alquilerAnual);
  const dedAlquiler40 = Math.min(alquilerAnual * params.alquiler_pct, params.alquiler_tope);
  const dedAlquiler10 = inputs.alquilerAdicional10 ? alquilerAnual * 0.10 : 0;
  const dedAlquiler = dedAlquiler40 + dedAlquiler10;

  const dedDomestico = Math.min(
    toAnnual(inputs.domestico, inputs.domesticoAnual),
    params.gni
  );

  const dedHipotecario = Math.min(
    toAnnual(inputs.hipotecario, inputs.hipotecarioAnual),
    params.hipotecario_tope
  );

  const dedEducacion = Math.min(
    toAnnual(inputs.educacion, inputs.educacionAnual),
    params.educacion_tope
  );

  const dedSeguroVida = Math.min(
    toAnnual(inputs.seguroVida, inputs.seguroVidaAnual),
    params.seguro_vida_tope
  );

  const dedSepelio = Math.min(
    toAnnual(inputs.sepelio, inputs.sepelioAnual),
    params.sepelio_tope
  );

  const dedInsumos = toAnnual(inputs.insumos, inputs.insumosAnual);

  // Los topes del 5% se calculan antes de deducir médicos, donaciones y
  // deducciones personales del artículo 30, pero después de las demás
  // deducciones generales computables.
  const deduccionesGeneralesPrevias =
    dedAlquiler + dedDomestico + dedHipotecario + dedEducacion +
    dedSeguroVida + dedSepelio + dedInsumos;
  const gananciaNetaParaTopes = Math.max(
    0,
    annualGross - aportesAnuales - deduccionesGeneralesPrevias
  );
  const topeGananciaNeta = gananciaNetaParaTopes * params.gn_tope_pct;

  const medicosAnual = toAnnual(inputs.medicos, inputs.medicosAnual);
  const dedMedicos = Math.min(medicosAnual * params.medicos_pct, topeGananciaNeta);
  const dedDonaciones = Math.min(
    toAnnual(inputs.donaciones, inputs.donacionesAnual),
    topeGananciaNeta
  );

  const dedOtras =
    dedAlquiler + dedDomestico + dedHipotecario + dedMedicos +
    dedEducacion + dedDonaciones + dedSeguroVida + dedSepelio + dedInsumos;

  // 6. Ganancia neta imponible
  const totalDeductions = aportesAnuales + dedPersonales + dedOtras;
  const taxableIncome = Math.max(0, annualGross - totalDeductions);

  // 7. Impuesto acumulado y promedio mensual. El SAC se incorpora a la
  // proyección anual, pero su efecto se distribuye entre los 12 meses, como
  // establece la metodología de doceavas partes de la RG 4003.
  const annualTax = applyScale(taxableIncome, params);
  const monthlyTax = annualTax / 12;
  const netMonthly = grossSalary - aportesMensuales - monthlyTax;
  const effectiveRate = grossSalary > 0 ? (monthlyTax / grossSalary) * 100 : 0;

  return {
    aportesMensuales,
    aportesAnuales,
    annualGross,
    dedPersonales,
    dedOtras,
    totalDeductions,
    taxableIncome,
    annualTax,
    monthlyTax,
    netMonthly,
    effectiveRate,
  };
}

const DEFAULT_INPUTS: TaxInputs = {
  grossSalary: 2500000, extraIncome: 0, includeSAC: true,
  conyuge: false, hijos: 0, hijosIncap: 0,
  alquiler: 0, alquilerAnual: true, alquilerAdicional10: false,
  domestico: 0, domesticoAnual: true,
  hipotecario: 0, hipotecarioAnual: true,
  medicos: 0, medicosAnual: true,
  educacion: 0, educacionAnual: true,
  donaciones: 0, donacionesAnual: true,
  seguroVida: 0, seguroVidaAnual: true,
  sepelio: 0, sepelioAnual: true,
  insumos: 0, insumosAnual: true,
};


function fmt(n: number) {
  return `$${Math.round(n).toLocaleString('es-AR')}`;
}

function fmtExact(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const EDUCATIONAL_TABS_2026: Record<string, {
  titleEs: string;
  titleEn: string;
  contentEs: string;
  contentEn: string;
  formulaEs: string;
  formulaEn: string;
}> = {
  paso1: {
    titleEs: 'Proyectar los Ingresos y el SAC',
    titleEn: 'Project Income and SAC',
    contentEs: 'Se proyectan los 12 sueldos del año y los ingresos extra. Si se incluye el SAC, se suma el aguinaldo anual y su efecto se incorpora mediante una doceava parte en cada uno de los 12 meses, junto con las deducciones correspondientes.',
    contentEn: 'The projection includes 12 monthly salaries and any extra income. When SAC is included, the annual bonus is added and its effect is incorporated as one twelfth in each of the 12 months, together with the applicable deductions.',
    formulaEs: 'Ganancia Bruta Proyectada = (Sueldo × 12) + SAC + Ingresos Extra',
    formulaEn: 'Projected Gross Income = (Salary × 12) + SAC + Extra Income',
  },
  paso2: {
    titleEs: 'Restar Aportes y Deducciones',
    titleEn: 'Subtract Contributions and Deductions',
    contentEs: `Para estimar las retenciones de julio-diciembre se restan los aportes obligatorios con los topes de julio 2026, las deducciones generales y las personales acumuladas: GNI ${fmtExact(OFFICIAL_JUL_DEC_2026.gni)} y Deducción Especial ${fmtExact(OFFICIAL_JUL_DEC_2026.deduccion_especial)}, más cargas de familia. Con SAC se agrega la doceava parte de las deducciones personales. La liquidación anual/final usa GNI ${fmtExact(OFFICIAL_ANNUAL_2026.gni)} y Deducción Especial ${fmtExact(OFFICIAL_ANNUAL_2026.deduccion_especial)}.`,
    contentEn: `For July-December withholding, the calculation subtracts mandatory contributions using the July 2026 caps, general deductions and cumulative personal deductions: GNI ARS ${OFFICIAL_JUL_DEC_2026.gni.toLocaleString('en-US')} and Special Deduction ARS ${OFFICIAL_JUL_DEC_2026.deduccion_especial.toLocaleString('en-US')}, plus family allowances. When SAC is included, an additional twelfth of personal deductions is applied. The annual/final calculation uses GNI ARS ${OFFICIAL_ANNUAL_2026.gni.toLocaleString('en-US')} and Special Deduction ARS ${OFFICIAL_ANNUAL_2026.deduccion_especial.toLocaleString('en-US')}.`,
    formulaEs: 'Ganancia Sujeta = Bruta − Aportes − Deducciones Art. 30 − Doceava SAC − Otras Deducciones',
    formulaEn: 'Taxable Income = Gross − Contributions − Art. 30 Deductions − SAC Twelfth − Other Deductions',
  },
  paso3: {
    titleEs: 'Aplicar la Escala Progresiva (Art. 94 LIG)',
    titleEn: 'Apply the Progressive Brackets (LIG Art. 94)',
    contentEs: 'La ganancia neta sujeta a impuesto se ubica en la escala correspondiente. La vista final compara los tramos anteriores con los acumulados oficiales a diciembre; también podés seleccionar cada mes para consultar su escala acumulada oficial. Cada tramo paga un importe fijo más una alícuota sobre el excedente de su límite inferior.',
    contentEn: 'Taxable net income is placed in the applicable bracket. The final view compares the previous brackets with the official December cumulative amounts; you can also select any month to see its official cumulative scale. Each bracket pays a fixed amount plus a rate on the excess over its lower limit.',
    formulaEs: 'Impuesto Acumulado = Fijo del Tramo + (Ganancia Sujeta − Límite Inferior) × Alícuota',
    formulaEn: 'Cumulative Tax = Bracket Fixed Amount + (Taxable Income − Lower Limit) × Rate',
  },
  paso4: {
    titleEs: 'Estimar la Retención Mensual y el Ajuste Anual',
    titleEn: 'Estimate Monthly Withholding and Annual Adjustment',
    contentEs: 'El impuesto obtenido con la tabla julio-diciembre representa la retención total proyectada. Se divide siempre por 12 para mostrar un promedio mensual con el SAC prorrateado. En el recibo real, el empleador calcula de forma acumulativa y descuenta las retenciones previas. La liquidación anual/final vuelve a calcular el impuesto con su tabla oficial y puede generar un reintegro o una retención adicional.',
    contentEn: 'The tax calculated with the July-December table represents projected total withholding. It is always divided by 12 to show a monthly average with prorated SAC. On an actual payslip, the employer calculates cumulatively and subtracts prior withholding. The annual/final calculation uses its official table and may produce a refund or additional withholding.',
    formulaEs: 'Retención Mensual Promedio = Impuesto Acumulado Proyectado ÷ 12',
    formulaEn: 'Average Monthly Withholding = Projected Cumulative Tax ÷ 12',
  },
};

function NumberInput({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-sm font-mono"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function DeductionRow({ label, value, onChange, isAnnual, onToggleAnnual, annualLabel = 'Anual', bare = false }: {
  label: string; value: string; onChange: (v: string) => void;
  isAnnual: boolean; onToggleAnnual: () => void; annualLabel?: string; bare?: boolean;
}) {
  return (
    <div className={bare ? '' : 'bg-white/5 rounded-xl p-3'}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-400 leading-tight">{label}</label>
        <label className="flex items-center gap-1 cursor-pointer ml-2 shrink-0">
          <input type="checkbox" checked={isAnnual} onChange={onToggleAnnual} className="w-3 h-3 accent-sky-500" />
          <span className="text-xs text-gray-500">{annualLabel}</span>
        </label>
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full glass px-2 py-1.5 rounded-lg text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-xs font-mono"
      />
    </div>
  );
}

function parseNum(s: string): number {
  const cleaned = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function formatInput(n: number): string {
  if (n === 0) return '';
  return Math.round(n).toLocaleString('es-AR');
}

function DoughnutChart({ netMonthly, aportes, tax }: {
  netMonthly: number; aportes: number; tax: number;
}) {
  // Always derive the total from the actual components so the chart is always 100%.
  const gross = netMonthly + aportes + tax;
  if (gross <= 0) return null;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const netPct = netMonthly / gross;
  const aportesPct = aportes / gross;
  const taxPct = tax / gross;

  const netLen = netPct * circ;
  const aportesLen = aportesPct * circ;
  const taxLen = taxPct * circ;

  const netRot = -90;
  const aportesRot = netRot + netPct * 360;
  const taxRot = aportesRot + aportesPct * 360;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-44 h-44">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1f2937" strokeWidth="14" />
        {netLen > 0.5 && (
          <circle cx="50" cy="50" r={r} fill="none" stroke="#22c55e" strokeWidth="14"
            strokeDasharray={`${netLen} ${circ}`}
            strokeLinecap="butt"
            transform={`rotate(${netRot} 50 50)`} />
        )}
        {aportesLen > 0.5 && (
          <circle cx="50" cy="50" r={r} fill="none" stroke="#eab308" strokeWidth="14"
            strokeDasharray={`${aportesLen} ${circ}`}
            strokeLinecap="butt"
            transform={`rotate(${aportesRot} 50 50)`} />
        )}
        {taxLen > 0.5 && (
          <circle cx="50" cy="50" r={r} fill="none" stroke="#ef4444" strokeWidth="14"
            strokeDasharray={`${taxLen} ${circ}`}
            strokeLinecap="butt"
            transform={`rotate(${taxRot} 50 50)`} />
        )}
        <text x="50" y="46" textAnchor="middle" fill="#e5e7eb" fontSize="7.5" fontWeight="600">Neto</text>
        <text x="50" y="57" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">
          {Math.round(netPct * 100)}%
        </text>
      </svg>
      <div className="flex gap-4 text-xs text-gray-400 mt-1">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
          {Math.round(netPct * 100)}% Neto
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 inline-block" />
          {Math.round(aportesPct * 100)}% Aportes
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
          {Math.round(taxPct * 100)}% Gcias.
        </span>
      </div>
    </div>
  );
}

export default function TaxCalculator() {
  const { lang } = useLanguage();
  const { taxParams, taxScenarios, taxTabs, loading } = useRecursosData();
  const previousTaxParams = useMemo(
    () => taxParams ? applyCurrentGeneralParameters(taxParams) : null,
    [taxParams]
  );
  const secondSemesterTaxParams = useMemo(
    () => taxParams ? buildOfficialSecondSemesterParams(taxParams) : null,
    [taxParams]
  );
  const officialAnnualTaxParams = useMemo(
    () => taxParams ? buildOfficialAnnualParams(taxParams) : null,
    [taxParams]
  );
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS);
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    grossSalary: formatInput(DEFAULT_INPUTS.grossSalary),
    extraIncome: '',
    alquiler: '', domestico: '', hipotecario: '', medicos: '',
    educacion: '', donaciones: '', seguroVida: '', sepelio: '', insumos: '',
  });
  const [result, setResult] = useState<TaxResult | null>(null);
  const [previousResult, setPreviousResult] = useState<TaxResult | null>(null);
  const [annualFinalResult, setAnnualFinalResult] = useState<TaxResult | null>(null);
  const [activeTab, setActiveTab] = useState('paso1');
  const [scaleView, setScaleView] = useState('final');
  const [showDeductions, setShowDeductions] = useState(false);

  const selectedScaleMonth = scaleView === 'final' ? null : Number(scaleView);
  const selectedScaleMonthLabel = selectedScaleMonth
    ? SCALE_MONTHS.find((month) => month.value === scaleView)
    : null;
  const monthlyOfficialScale = useMemo(
    () => taxParams && selectedScaleMonth
      ? buildOfficialMonthlyScale(taxParams, selectedScaleMonth)
      : null,
    [taxParams, selectedScaleMonth]
  );

  const set = useCallback((field: keyof TaxInputs, value: TaxInputs[keyof TaxInputs]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setRaw = useCallback((field: string, raw: string, numField: keyof TaxInputs) => {
    setRawInputs((prev) => ({ ...prev, [field]: raw }));
    setInputs((prev) => ({ ...prev, [numField]: parseNum(raw) }));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!previousTaxParams || !secondSemesterTaxParams || !officialAnnualTaxParams) return;
    setResult(calculateTax(inputs, secondSemesterTaxParams));
    setPreviousResult(calculateTax(inputs, previousTaxParams));
    setAnnualFinalResult(calculateTax(inputs, officialAnnualTaxParams));
  }, [inputs, previousTaxParams, secondSemesterTaxParams, officialAnnualTaxParams]);

  const loadScenario = (grossSalary: number, conyuge: boolean, hijos: number, hijosIncap: number, alquiler: number, alquilerAnual: boolean, extraIncome: number, includeSAC: boolean) => {
    const newInputs = { ...DEFAULT_INPUTS, grossSalary, conyuge, hijos, hijosIncap, alquiler, alquilerAnual, extraIncome, includeSAC };
    setInputs(newInputs);
    setRawInputs({
      grossSalary: formatInput(grossSalary),
      extraIncome: extraIncome > 0 ? formatInput(extraIncome) : '',
      alquiler: alquiler > 0 ? formatInput(alquiler) : '',
      domestico: '', hipotecario: '', medicos: '', educacion: '', donaciones: '',
      seguroVida: '', sepelio: '', insumos: '',
    });
    if (previousTaxParams && secondSemesterTaxParams && officialAnnualTaxParams) {
      setResult(calculateTax(newInputs, secondSemesterTaxParams));
      setPreviousResult(calculateTax(newInputs, previousTaxParams));
      setAnnualFinalResult(calculateTax(newInputs, officialAnnualTaxParams));
    }
  };

  // Recalculate whenever any input changes or params load so result is always in sync.
  useEffect(() => {
    if (!previousTaxParams || !secondSemesterTaxParams || !officialAnnualTaxParams) return;
    setResult(calculateTax(inputs, secondSemesterTaxParams));
    setPreviousResult(calculateTax(inputs, previousTaxParams));
    setAnnualFinalResult(calculateTax(inputs, officialAnnualTaxParams));
  }, [inputs, previousTaxParams, secondSemesterTaxParams, officialAnnualTaxParams]);

  const monthlyPocketImpact = result && previousResult
    ? previousResult.monthlyTax - result.monthlyTax
    : 0;
  const rescuedWithholdingPct = previousResult && previousResult.monthlyTax > 0
    ? Math.min(100, Math.max(0, (monthlyPocketImpact / previousResult.monthlyTax) * 100))
    : 0;
  const estimatedAnnualSettlement = result && annualFinalResult
    ? result.annualTax - annualFinalResult.annualTax
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <Calculator size={20} className="text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100">
              {lang === 'es' ? 'Calculadora de Impuesto a los Ingresos Personales' : 'Personal Income Tax Calculator'}
            </h3>
            <p className="text-xs text-gray-400">
              {lang === 'es'
                ? 'Retención mensual promedio con SAC prorrateado · Arts. 30 y 94 LIG'
                : 'Average monthly withholding with prorated SAC · LIG Arts. 30 and 94'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20">
            {lang === 'es' ? 'Tabla oficial Jul-Dic 2026' : 'Official Jul-Dec 2026 table'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
            {lang === 'es' ? 'Actualización efectiva: +16,8459%' : 'Effective update: +16.8459%'}
          </span>
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-300">
            {lang === 'es'
              ? 'Estimación sobre 12 meses con ingresos constantes. El SAC se incorpora como 1/12 cada mes, junto con sus aportes y la deducción personal adicional. Usa los parámetros acumulados oficiales de julio-diciembre; el recibo real puede variar por remuneraciones y retenciones previas.'
              : 'Twelve-month estimate with constant income. SAC is incorporated as 1/12 each month, together with its contributions and additional personal deduction. It uses the official cumulative July-December parameters; actual payroll may vary based on prior income and withholding.'}
          </p>
        </div>
      </div>

      {/* Scenarios */}
      <div className="glass rounded-2xl p-5">
        <h4 className="font-semibold text-gray-200 text-sm mb-3">
          1. {lang === 'es' ? 'Explorar Escenarios' : 'Explore Scenarios'}
        </h4>
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-3 animate-pulse h-16" />
            ))}
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {taxScenarios.map((s, i) => (
              <button
                key={i}
                onClick={() => loadScenario(s.grossSalary, s.conyuge, s.hijos, s.hijosIncap, s.alquiler, s.alquilerAnual, s.extraIncome, s.includeSac)}
                className={`border rounded-xl p-3 text-left hover:bg-white/5 transition-all ${s.colorClass}`}
              >
                <p className="font-semibold text-xs leading-tight">{lang === 'es' ? s.labelEs : s.labelEn}</p>
                <p className="text-xs mt-1 opacity-75">{lang === 'es' ? s.salaryLabelEs : s.salaryLabelEn}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main form + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 space-y-5">
          <h4 className="font-semibold text-gray-200 text-sm">
            2. {lang === 'es' ? 'Ingrese sus datos' : 'Enter your data'}
          </h4>

          {/* Salary + Slider */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              {lang === 'es' ? 'Salario Bruto Mensual (ARS)' : 'Monthly Gross Salary (ARS)'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={rawInputs.grossSalary}
              onChange={(e) => setRaw('grossSalary', e.target.value, 'grossSalary')}
              placeholder="Ej: 2.500.000"
              className="w-full glass px-3 py-2.5 rounded-xl text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-sm font-mono mb-2"
            />
            <input
              type="range"
              min="500000" max="10000000" step="100000"
              value={inputs.grossSalary}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setInputs((p) => ({ ...p, grossSalary: v }));
                setRawInputs((p) => ({ ...p, grossSalary: v.toLocaleString('es-AR') }));
              }}
              className="w-full accent-sky-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'es' ? 'Deslice para ajustar rápidamente' : 'Slide to adjust quickly'}
            </p>
          </div>

          {/* Extra income */}
          <NumberInput
            label={lang === 'es' ? 'Ingresos Extra Anuales (Bono, etc.)' : 'Annual Extra Income (Bonus, etc.)'}
            value={rawInputs.extraIncome}
            onChange={(v) => setRaw('extraIncome', v, 'extraIncome')}
            placeholder="0"
            hint={lang === 'es' ? 'Bonos, gratificaciones u otros ingresos anuales.' : 'Annual bonuses, gratuities or other income.'}
          />

          {/* SAC */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.includeSAC}
              onChange={(e) => set('includeSAC', e.target.checked)}
              className="mt-0.5 accent-sky-500"
            />
            <div>
              <span className="text-sm text-gray-300">{lang === 'es' ? 'Incluir SAC/Aguinaldo' : 'Include SAC/Bonus'}</span>
              <p className="text-xs text-gray-500">
                {lang === 'es'
                  ? 'Prorratea 1/12 del sueldo y sus deducciones en cada uno de los 12 meses.'
                  : 'Prorates 1/12 of salary and its deductions across each of the 12 months.'}
              </p>
            </div>
          </label>

          {/* Personal deductions */}
          <div>
            <h5 className="text-sm font-semibold text-gray-300 mb-2">
              {lang === 'es' ? 'Deducciones Personales' : 'Personal Deductions'}
            </h5>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.conyuge}
                  onChange={(e) => set('conyuge', e.target.checked)}
                  className="accent-sky-500"
                />
                <span className="text-sm text-gray-400">
                  {lang === 'es' ? 'Cónyuge o unión convivencial a cargo' : 'Spouse or cohabiting partner'}
                </span>
              </label>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  {lang === 'es' ? 'Hijos menores de 18 años' : 'Children under 18'}
                </label>
                <input
                  type="number" min="0" max="10"
                  value={inputs.hijos}
                  onChange={(e) => set('hijos', parseInt(e.target.value) || 0)}
                  className="w-20 glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  {lang === 'es' ? 'Hijos incapacitados para el trabajo' : 'Disabled children'}
                </label>
                <input
                  type="number" min="0" max="10"
                  value={inputs.hijosIncap}
                  onChange={(e) => set('hijosIncap', parseInt(e.target.value) || 0)}
                  className="w-20 glass px-3 py-2 rounded-xl text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Other deductions - collapsible */}
          <div>
            <button
              onClick={() => setShowDeductions(!showDeductions)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              {showDeductions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {lang === 'es' ? 'Otras Deducciones (ARS)' : 'Other Deductions (ARS)'}
            </button>
            {showDeductions && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <DeductionRow
                    label={lang === 'es' ? 'Alquiler (40% ded., tope GNI)' : 'Rent (40% ded., MNI cap)'}
                    value={rawInputs.alquiler}
                    onChange={(v) => setRaw('alquiler', v, 'alquiler')}
                    isAnnual={inputs.alquilerAnual}
                    onToggleAnnual={() => set('alquilerAnual', !inputs.alquilerAnual)}
                    annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                    bare
                  />
                  <label className="flex items-start gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.alquilerAdicional10}
                      onChange={(e) => set('alquilerAdicional10', e.target.checked)}
                      className="mt-0.5 accent-sky-500"
                    />
                    <span className="text-[11px] leading-tight text-gray-500">
                      {lang === 'es'
                        ? 'Sumar 10% adicional (contrato registrado y factura)'
                        : 'Add extra 10% (registered contract and invoice)'}
                    </span>
                  </label>
                </div>
                <DeductionRow
                  label={lang === 'es' ? 'Servicio doméstico (tope GNI)' : 'Domestic service (MNI cap)'}
                  value={rawInputs.domestico}
                  onChange={(v) => setRaw('domestico', v, 'domestico')}
                  isAnnual={inputs.domesticoAnual}
                  onToggleAnnual={() => set('domesticoAnual', !inputs.domesticoAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Hipotecario (tope $20.000)' : 'Mortgage (cap $20,000)'}
                  value={rawInputs.hipotecario}
                  onChange={(v) => setRaw('hipotecario', v, 'hipotecario')}
                  isAnnual={inputs.hipotecarioAnual}
                  onToggleAnnual={() => set('hipotecarioAnual', !inputs.hipotecarioAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Médicos (40%, tope 5% gcia. neta)' : 'Medical (40%, cap 5% net)'}
                  value={rawInputs.medicos}
                  onChange={(v) => setRaw('medicos', v, 'medicos')}
                  isAnnual={inputs.medicosAnual}
                  onToggleAnnual={() => set('medicosAnual', !inputs.medicosAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Educación (tope 40% GNI)' : 'Education (cap 40% MNI)'}
                  value={rawInputs.educacion}
                  onChange={(v) => setRaw('educacion', v, 'educacion')}
                  isAnnual={inputs.educacionAnual}
                  onToggleAnnual={() => set('educacionAnual', !inputs.educacionAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Donaciones (tope 5% gcia. neta)' : 'Donations (cap 5% net)'}
                  value={rawInputs.donaciones}
                  onChange={(v) => setRaw('donaciones', v, 'donaciones')}
                  isAnnual={inputs.donacionesAnual}
                  onToggleAnnual={() => set('donacionesAnual', !inputs.donacionesAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Seguros vida/retiro (tope $753.472)' : 'Life insurance (cap $753,472)'}
                  value={rawInputs.seguroVida}
                  onChange={(v) => setRaw('seguroVida', v, 'seguroVida')}
                  isAnnual={inputs.seguroVidaAnual}
                  onToggleAnnual={() => set('seguroVidaAnual', !inputs.seguroVidaAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Gastos de sepelio' : 'Funeral expenses'}
                  value={rawInputs.sepelio}
                  onChange={(v) => setRaw('sepelio', v, 'sepelio')}
                  isAnnual={inputs.sepelioAnual}
                  onToggleAnnual={() => set('sepelioAnual', !inputs.sepelioAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <div className="sm:col-span-2">
                  <DeductionRow
                    label={lang === 'es' ? 'Equipamiento obligatorio no reintegrado' : 'Mandatory unreimbursed equipment'}
                    value={rawInputs.insumos}
                    onChange={(v) => setRaw('insumos', v, 'insumos')}
                    isAnnual={inputs.insumosAnual}
                    onToggleAnnual={() => set('insumosAnual', !inputs.insumosAnual)}
                    annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
          >
            {lang === 'es' ? 'Calcular' : 'Calculate'}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 glass rounded-2xl p-5">
          <h4 className="font-semibold text-gray-200 text-sm mb-4">
            3. {lang === 'es' ? 'Resultados' : 'Results'}
          </h4>

          {result ? (
            <>
              {/* Before/after comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-red-300 mb-1">
                    {lang === 'es' ? 'Retención Mensual Promedio Estimada' : 'Estimated Average Monthly Withholding'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-200 truncate">{fmt(result.monthlyTax)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'es' ? 'Promedio de 12 meses · SAC prorrateado' : '12-month average · prorated SAC'}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === 'es' ? 'Antes de la Actualización' : 'Before the Update'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-200 truncate">
                    {fmt(previousResult?.monthlyTax ?? 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'es' ? 'Misma fórmula · escala sin actualizar' : 'Same formula · pre-update brackets'}
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-green-300 mb-1">
                    {lang === 'es' ? 'Impacto Mensual en Bolsillo' : 'Monthly Take-Home Impact'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-200 truncate">
                    +{fmt(Math.max(0, monthlyPocketImpact))}
                  </p>
                  <p className="text-sm font-semibold text-green-300 mt-1">
                    {rescuedWithholdingPct.toLocaleString(lang === 'es' ? 'es-AR' : 'en-US', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}%
                    {' '}
                    <span className="text-xs font-normal text-gray-400">
                      {lang === 'es' ? 'de la retención anterior recuperada' : 'of previous withholding recovered'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <Info size={14} className="text-sky-300 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-300">
                  {lang === 'es'
                    ? 'El promedio distribuye la retención total proyectada entre 12 meses. Por eso el efecto de Ganancias sobre el aguinaldo ya se va reteniendo durante el año y normalmente queda poco ajuste al cobrar cada cuota del SAC.'
                    : 'The average spreads projected total withholding over 12 months. This means income tax on the annual bonus is withheld throughout the year, usually leaving only a small adjustment when each SAC installment is paid.'}
                </p>
              </div>

              {/* SVG Doughnut Chart */}
              <div className="flex justify-center mb-5">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-3">
                    {lang === 'es' ? 'Composición del Salario Bruto Mensual' : 'Monthly Gross Salary Breakdown'}
                  </p>
                  <DoughnutChart
                    netMonthly={Math.max(0, result.netMonthly)}
                    aportes={result.aportesMensuales}
                    tax={Math.max(0, result.monthlyTax)}
                  />
                </div>
              </div>

              {/* Result cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-green-300 mb-1">
                    {lang === 'es' ? 'Sueldo Neto de Bolsillo' : 'Net Take-Home Salary'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-200 truncate">{fmt(result.netMonthly)}</p>
                  <p className="text-xs text-gray-500">{result.effectiveRate.toFixed(1)}% {lang === 'es' ? 'tasa efectiva de Ganancias' : 'effective income tax rate'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === 'es' ? 'Retención Total 2026 Proyectada' : 'Projected Total 2026 Withholding'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-gray-200 truncate">{fmt(result.annualTax)}</p>
                </div>
                <div className="col-span-2 bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-sky-300 mb-1">
                    {lang === 'es' ? 'Liquidación Anual/Final Estimada' : 'Estimated Annual/Final Liquidation'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-sky-200 truncate">
                    {fmt(annualFinalResult?.annualTax ?? 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {estimatedAnnualSettlement > 0
                      ? (lang === 'es'
                        ? `Posible reintegro posterior: ${fmt(estimatedAnnualSettlement)}`
                        : `Potential later refund: ${fmt(estimatedAnnualSettlement)}`)
                      : estimatedAnnualSettlement < 0
                        ? (lang === 'es'
                          ? `Posible retención adicional: ${fmt(Math.abs(estimatedAnnualSettlement))}`
                          : `Potential additional withholding: ${fmt(Math.abs(estimatedAnnualSettlement))}`)
                        : (lang === 'es' ? 'Sin ajuste adicional estimado' : 'No additional adjustment estimated')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'es'
                      ? 'Referencia con la tabla anual oficial y la doceava de deducciones del SAC prevista por ARCA.'
                      : 'Reference using the official annual table and ARCA’s additional twelfth of SAC deductions.'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === 'es' ? 'Ganancia Neta sujeta a Impuesto' : 'Taxable Net Income'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-gray-200 truncate">{fmt(result.taxableIncome)}</p>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-yellow-300 mb-1">
                    {lang === 'es' ? 'Aportes Previsionales Mensuales (17%)' : 'Monthly Social Security Contributions (17%)'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-yellow-200 truncate">{fmt(result.aportesMensuales)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'es'
                      ? 'Tope ANSES julio 2026 aplicado a la proyección'
                      : 'July 2026 ANSES cap applied to the projection'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <p className="text-sm">{lang === 'es' ? 'Ingrese sus datos y calcule' : 'Enter your data and calculate'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Educational tabs */}
      <div className="glass rounded-2xl p-5">
        <h4 className="font-semibold text-gray-200 text-sm mb-3">
          4. {lang === 'es' ? '¿Cómo se Calcula el Impuesto?' : 'How Is the Tax Calculated?'}
        </h4>
        <div className="flex flex-wrap gap-2 mb-4 border-b border-white/10 pb-3">
          {taxTabs.map((tab) => (
            <button
              key={tab.tabId}
              onClick={() => setActiveTab(tab.tabId)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                activeTab === tab.tabId ? 'bg-sky-500 text-white' : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {lang === 'es' ? tab.labelEs : tab.labelEn}
            </button>
          ))}
        </div>
        {taxTabs.filter((t) => t.tabId === activeTab).map((tab) => {
          const currentCopy = EDUCATIONAL_TABS_2026[tab.tabId];
          const title = lang === 'es'
            ? (currentCopy?.titleEs ?? tab.titleEs)
            : (currentCopy?.titleEn ?? tab.titleEn);
          const content = lang === 'es'
            ? (currentCopy?.contentEs ?? tab.contentEs)
            : (currentCopy?.contentEn ?? tab.contentEn);
          const formula = lang === 'es'
            ? (currentCopy?.formulaEs ?? tab.formulaEs)
            : (currentCopy?.formulaEn ?? tab.formulaEn);

          return (
          <div key={tab.tabId} className="space-y-3">
            <h5 className="font-semibold text-gray-200">{title}</h5>
            <p className="text-sm text-gray-400">{content}</p>
            {tab.tabId === 'paso3' && taxParams && (
              <div className="overflow-x-auto">
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label htmlFor="tax-scale-view" className="text-xs font-medium text-gray-300">
                    {lang === 'es' ? 'Período de la escala' : 'Scale period'}
                  </label>
                  <select
                    id="tax-scale-view"
                    value={scaleView}
                    onChange={(event) => setScaleView(event.target.value)}
                    className="glass rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-200 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="final" className="bg-gray-900">
                      {lang === 'es' ? 'Final · Comparativa a diciembre' : 'Final · December comparison'}
                    </option>
                    {SCALE_MONTHS.map((month) => (
                      <option key={month.value} value={month.value} className="bg-gray-900">
                        {lang === 'es' ? month.es : month.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-gray-300">
                  {scaleView === 'final'
                    ? (lang === 'es'
                      ? 'Vista predeterminada: compara la escala anterior completa con la escala acumulada oficial a diciembre 2026. La liquidación anual/final se informa por separado.'
                      : 'Default view: compares the complete previous scale with the official cumulative December 2026 scale. The annual/final calculation is shown separately.')
                    : (lang === 'es'
                      ? selectedScaleMonth && selectedScaleMonth <= 6
                        ? `Escala oficial acumulada a ${selectedScaleMonthLabel?.es} 2026: ${selectedScaleMonth}/12 de los valores vigentes durante el primer semestre.`
                        : `Escala oficial acumulada a ${selectedScaleMonthLabel?.es} 2026: conserva 6/12 de los valores del primer semestre y suma ${(selectedScaleMonth ?? 6) - 6}/12 de los valores actualizados.`
                      : selectedScaleMonth && selectedScaleMonth <= 6
                        ? `Official cumulative scale through ${selectedScaleMonthLabel?.en} 2026: ${selectedScaleMonth}/12 of the first-semester values.`
                        : `Official cumulative scale through ${selectedScaleMonthLabel?.en} 2026: keeps 6/12 of the first-semester values and adds ${(selectedScaleMonth ?? 6) - 6}/12 of the updated values.`)}
                </div>
                {scaleView === 'final' ? (
                  <table className="w-full text-xs text-gray-300 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 pr-4 text-gray-400">
                        {lang === 'es' ? 'Escala Ene-Jun 2026' : 'Jan-Jun 2026 Bracket'}
                      </th>
                      <th className="text-left py-2 pr-4 text-sky-300">
                        {lang === 'es' ? 'Escala Jul-Dic 2026 Oficial' : 'Official Jul-Dec 2026 Bracket'}
                      </th>
                      <th className="text-right py-2 pr-4 text-gray-400">
                        {lang === 'es' ? 'Fijo Anterior' : 'Previous Fixed'}
                      </th>
                      <th className="text-right py-2 pr-4 text-sky-300">
                        {lang === 'es' ? 'Fijo Oficial' : 'Official Fixed'}
                      </th>
                      <th className="text-right py-2 text-gray-400">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxParams.escala.map((tramo, i) => {
                      const next = taxParams.escala[i + 1];
                      const officialTramo = secondSemesterTaxParams?.escala[i];
                      const officialNext = secondSemesterTaxParams?.escala[i + 1];
                      const rangeLabel = next
                        ? `${tramo.limite.toLocaleString('es-AR')} – ${next.limite.toLocaleString('es-AR')}`
                        : `> ${tramo.limite.toLocaleString('es-AR')}`;
                      const officialRangeLabel = officialTramo && officialNext
                        ? `${officialTramo.limite.toLocaleString('es-AR', { maximumFractionDigits: 2 })} – ${officialNext.limite.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                        : `> ${(officialTramo?.limite ?? 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-1.5 pr-4">{rangeLabel}</td>
                          <td className="py-1.5 pr-4 text-sky-200">{officialRangeLabel}</td>
                          <td className="py-1.5 pr-4 text-right">{tramo.fijo.toLocaleString('es-AR')}</td>
                          <td className="py-1.5 pr-4 text-right text-sky-200">
                            {(officialTramo?.fijo ?? 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-1.5 text-right text-sky-400">{(tramo.pct * 100).toFixed(0)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  </table>
                ) : (
                  <table className="w-full text-xs text-gray-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 pr-4 text-sky-300">
                          {lang === 'es' ? 'Ganancia neta imponible acumulada' : 'Cumulative taxable net income'}
                        </th>
                        <th className="text-right py-2 pr-4 text-sky-300">
                          {lang === 'es' ? 'Importe fijo' : 'Fixed amount'}
                        </th>
                        <th className="text-right py-2 pr-4 text-sky-300">%</th>
                        <th className="text-right py-2 text-gray-400">
                          {lang === 'es' ? 'Sobre excedente de' : 'On excess over'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(monthlyOfficialScale ?? []).map((tramo, index) => {
                        const next = monthlyOfficialScale?.[index + 1];
                        const rangeLabel = next
                          ? `${tramo.limite.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} – ${next.limite.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `> ${tramo.limite.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        return (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-1.5 pr-4 text-sky-200">{rangeLabel}</td>
                            <td className="py-1.5 pr-4 text-right">
                              {tramo.fijo.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-1.5 pr-4 text-right text-sky-400">
                              {(tramo.pct * 100).toFixed(0)}%
                            </td>
                            <td className="py-1.5 text-right text-gray-400">
                              {tramo.limite.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {formula && (
              <div className="bg-gray-800/50 p-3 rounded-xl">
                <code className="text-xs text-gray-300">{formula}</code>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
