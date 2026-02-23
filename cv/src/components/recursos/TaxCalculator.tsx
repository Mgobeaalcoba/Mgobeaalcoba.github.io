'use client';

import { useState, useEffect, useCallback } from 'react';
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
  alquiler: number; alquilerAnual: boolean;
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
  const meses = includeSAC ? 13 : 12;
  const MNI_ANUAL = params.gni + params.deduccion_especial;

  // 1. Ganancia bruta anual (ANTES de aportes)
  const annualGross = grossSalary * meses + extraIncome;

  // 2. Aportes con topes de base imponible mensual
  const baseMensual = Math.min(
    Math.max(grossSalary, params.aportes_base_min),
    params.aportes_base_max
  );
  const aportesMensuales = baseMensual * params.aportes_pct;
  const aportesAnuales = aportesMensuales * meses;

  // 3. Deducciones personales
  const dedPersonales =
    MNI_ANUAL +
    (inputs.conyuge ? params.conyuge : 0) +
    inputs.hijos * params.hijo +
    inputs.hijosIncap * params.hijo_incapacitado;

  // 4. Ganancia neta previa a otras deducciones (para calcular topes de médicos/donaciones)
  const gananciaNetaPrevia = Math.max(0, annualGross - aportesAnuales - dedPersonales);
  const topeGananciaNeta = gananciaNetaPrevia * params.gn_tope_pct;

  // 5. Otras deducciones con topes exactos AFIP
  const alquilerAnual = toAnnual(inputs.alquiler, inputs.alquilerAnual);
  const dedAlquiler = Math.min(alquilerAnual * params.alquiler_pct, params.alquiler_tope);

  const dedDomestico = toAnnual(inputs.domestico, inputs.domesticoAnual); // sin tope RG 5531/2024

  const dedHipotecario = Math.min(
    toAnnual(inputs.hipotecario, inputs.hipotecarioAnual),
    params.hipotecario_tope
  );

  const medicosAnual = toAnnual(inputs.medicos, inputs.medicosAnual);
  const dedMedicos = Math.min(medicosAnual * params.medicos_pct, topeGananciaNeta);

  const dedEducacion = Math.min(
    toAnnual(inputs.educacion, inputs.educacionAnual),
    params.educacion_tope
  );

  const dedDonaciones = Math.min(
    toAnnual(inputs.donaciones, inputs.donacionesAnual),
    topeGananciaNeta
  );

  const dedSeguroVida = Math.min(
    toAnnual(inputs.seguroVida, inputs.seguroVidaAnual),
    params.seguro_vida_tope
  );

  const dedSepelio = Math.min(
    toAnnual(inputs.sepelio, inputs.sepelioAnual),
    params.sepelio_tope
  );

  const dedInsumos = toAnnual(inputs.insumos, inputs.insumosAnual); // sin tope

  const dedOtras =
    dedAlquiler + dedDomestico + dedHipotecario + dedMedicos +
    dedEducacion + dedDonaciones + dedSeguroVida + dedSepelio + dedInsumos;

  // 6. Ganancia neta imponible
  const totalDeductions = aportesAnuales + dedPersonales + dedOtras;
  const taxableIncome = Math.max(0, annualGross - totalDeductions);

  // 7. Impuesto anual y retención mensual
  const annualTax = applyScale(taxableIncome, params);
  const monthlyTax = annualTax / meses;
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
  alquiler: 0, alquilerAnual: true,
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

function DeductionRow({ label, value, onChange, isAnnual, onToggleAnnual, annualLabel = 'Anual' }: {
  label: string; value: string; onChange: (v: string) => void;
  isAnnual: boolean; onToggleAnnual: () => void; annualLabel?: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
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
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS);
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    grossSalary: formatInput(DEFAULT_INPUTS.grossSalary),
    extraIncome: '',
    alquiler: '', domestico: '', hipotecario: '', medicos: '',
    educacion: '', donaciones: '', seguroVida: '', sepelio: '', insumos: '',
  });
  const [result, setResult] = useState<TaxResult | null>(null);
  const [activeTab, setActiveTab] = useState('paso1');
  const [showDeductions, setShowDeductions] = useState(false);

  const set = useCallback((field: keyof TaxInputs, value: TaxInputs[keyof TaxInputs]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setRaw = useCallback((field: string, raw: string, numField: keyof TaxInputs) => {
    setRawInputs((prev) => ({ ...prev, [field]: raw }));
    setInputs((prev) => ({ ...prev, [numField]: parseNum(raw) }));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!taxParams) return;
    setResult(calculateTax(inputs, taxParams));
  }, [inputs, taxParams]);

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
    if (taxParams) setResult(calculateTax(newInputs, taxParams));
  };

  // Recalculate whenever any input changes or params load so result is always in sync.
  useEffect(() => {
    if (!taxParams) return;
    setResult(calculateTax(inputs, taxParams));
  }, [inputs, taxParams]);

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
                ? 'Período Enero-Junio 2026 · Art. 94 LIG · Res. Gral. 4.003 AFIP'
                : 'Period January-June 2026 · Art. 94 LIG · AFIP Res. Gen. 4.003'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <Info size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-300">
            {lang === 'es'
              ? 'Simulación con proyección de ingresos constantes. No constituye asesoramiento fiscal.'
              : 'Simulation with projected constant income. Does not constitute tax advice.'}
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
              <p className="text-xs text-gray-500">{lang === 'es' ? 'Considera la doceava parte del SAC.' : 'Considers one twelfth of the SAC.'}</p>
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
                <DeductionRow
                  label={lang === 'es' ? 'Alquiler (40% ded., tope GNI)' : 'Rent (40% ded., MNI cap)'}
                  value={rawInputs.alquiler}
                  onChange={(v) => setRaw('alquiler', v, 'alquiler')}
                  isAnnual={inputs.alquilerAnual}
                  onToggleAnnual={() => set('alquilerAnual', !inputs.alquilerAnual)}
                  annualLabel={lang === 'es' ? 'Anual' : 'Annual'}
                />
                <DeductionRow
                  label={lang === 'es' ? 'Servicio doméstico (sin tope)' : 'Domestic service (no cap)'}
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
                  label={lang === 'es' ? 'Educación (tope $2.060.721)' : 'Education (cap $2,060,721)'}
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
                  label={lang === 'es' ? 'Seguros vida/retiro (tope $655.000)' : 'Life insurance (cap $655,000)'}
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
                    label={lang === 'es' ? 'Insumos de trabajo (sin tope)' : 'Work supplies (no cap)'}
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
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-red-300 mb-1">
                    {lang === 'es' ? 'Retención Mensual Estimada' : 'Estimated Monthly Withholding'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-200 truncate">{fmt(result.monthlyTax)}</p>
                  <p className="text-xs text-gray-500">{result.effectiveRate.toFixed(1)}% {lang === 'es' ? 'efectivo' : 'effective'}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-green-300 mb-1">
                    {lang === 'es' ? 'Sueldo Neto de Bolsillo' : 'Net Take-Home Salary'}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-200 truncate">{fmt(result.netMonthly)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === 'es' ? 'Impuesto Anual Proyectado' : 'Projected Annual Tax'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-gray-200 truncate">{fmt(result.annualTax)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === 'es' ? 'Ganancia Neta sujeta a Impuesto' : 'Taxable Net Income'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-gray-200 truncate">{fmt(result.taxableIncome)}</p>
                </div>
                <div className="col-span-2 bg-yellow-500/10 rounded-xl p-4 min-w-0">
                  <p className="text-xs text-yellow-300 mb-1">
                    {lang === 'es' ? 'Aportes Previsionales Mensuales (17%)' : 'Monthly Social Security Contributions (17%)'}
                  </p>
                  <p className="text-base sm:text-xl font-semibold text-yellow-200 truncate">{fmt(result.aportesMensuales)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'es' ? 'Base imponible con topes AFIP aplicados' : 'Taxable base with AFIP caps applied'}
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
        {taxTabs.filter((t) => t.tabId === activeTab).map((tab) => (
          <div key={tab.tabId} className="space-y-3">
            <h5 className="font-semibold text-gray-200">{lang === 'es' ? tab.titleEs : tab.titleEn}</h5>
            <p className="text-sm text-gray-400">{lang === 'es' ? tab.contentEs : tab.contentEn}</p>
            {tab.tabId === 'paso3' && taxParams && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-gray-300 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 pr-4 text-gray-400">
                        {lang === 'es' ? 'Ganancia Neta Imponible Anual' : 'Annual Taxable Net Income'}
                      </th>
                      <th className="text-right py-2 pr-4 text-gray-400">
                        {lang === 'es' ? 'Monto Fijo (ARS)' : 'Fixed Amount (ARS)'}
                      </th>
                      <th className="text-right py-2 text-gray-400">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxParams.escala.map((tramo, i) => {
                      const next = taxParams.escala[i + 1];
                      const rangeLabel = next
                        ? `${tramo.limite.toLocaleString('es-AR')} – ${next.limite.toLocaleString('es-AR')}`
                        : `> ${tramo.limite.toLocaleString('es-AR')}`;
                      return (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-1.5 pr-4">{rangeLabel}</td>
                          <td className="py-1.5 pr-4 text-right">{tramo.fijo.toLocaleString('es-AR')}</td>
                          <td className="py-1.5 text-right text-sky-400">{(tramo.pct * 100).toFixed(0)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {tab.formulaEs && (
              <div className="bg-gray-800/50 p-3 rounded-xl">
                <code className="text-xs text-gray-300">{lang === 'es' ? tab.formulaEs : tab.formulaEn}</code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
