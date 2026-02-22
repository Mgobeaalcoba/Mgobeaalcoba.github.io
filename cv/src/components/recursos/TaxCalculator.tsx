'use client';

import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Scale: Ganancias 2026 - Arts 94 LIG - Enero-Junio 2026
// Simplified progressive scale
const SCALE_2026 = [
  { from: 0, to: 419026, rate: 0.05, fixed: 0 },
  { from: 419026, to: 838051, rate: 0.09, fixed: 20951 },
  { from: 838051, to: 1257077, rate: 0.12, fixed: 58663 },
  { from: 1257077, to: 1676102, rate: 0.15, fixed: 108946 },
  { from: 1676102, to: 2514153, rate: 0.19, fixed: 171768 },
  { from: 2514153, to: 3352204, rate: 0.23, fixed: 331228 },
  { from: 3352204, to: 5028306, rate: 0.27, fixed: 523979 },
  { from: 5028306, to: 6704408, rate: 0.31, fixed: 976706 },
  { from: 6704408, to: Infinity, rate: 0.35, fixed: 1497046 },
];

// MFI (Mínimo No Imponible) approximate for 2026
const MFI_MENSUAL = 2419184; // monthly

interface TaxResult {
  gross: number;
  taxableIncome: number;
  annualTaxableIncome: number;
  monthlyTax: number;
  effectiveRate: number;
  netMonthly: number;
}

function calculateTax(grossSalary: number): TaxResult {
  const aportes = grossSalary * 0.17; // SIPA 11% + salud 3% + obra social 3%
  const netAfterAportes = grossSalary - aportes;

  const annualGross = netAfterAportes * 13; // 12 months + SAC
  const taxableIncome = Math.max(0, annualGross - MFI_MENSUAL * 12);

  let annualTax = 0;
  for (const bracket of SCALE_2026) {
    if (taxableIncome > bracket.from) {
      const taxable = Math.min(taxableIncome, bracket.to) - bracket.from;
      annualTax = bracket.fixed + taxable * bracket.rate;
    }
  }

  const monthlyTax = annualTax / 12;
  const effectiveRate = grossSalary > 0 ? (monthlyTax / grossSalary) * 100 : 0;
  const netMonthly = grossSalary - aportes - monthlyTax;

  return {
    gross: grossSalary,
    taxableIncome,
    annualTaxableIncome: taxableIncome,
    monthlyTax,
    effectiveRate,
    netMonthly,
  };
}

export default function TaxCalculator() {
  const { t } = useLanguage();
  const [grossInput, setGrossInput] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(grossInput.replace(/\./g, '').replace(',', '.'));
    if (isNaN(gross) || gross <= 0) return;
    setResult(calculateTax(gross));
  };

  const fmt = (n: number) =>
    `$${Math.round(n).toLocaleString('es-AR')}`;

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center gap-2 mb-5">
        <Calculator size={20} className="text-sky-400" />
        <h3 className="font-bold text-gray-100">Calculadora Impuesto a las Ganancias</h3>
      </div>

      <div className="flex items-start gap-2 mb-5 p-3 bg-sky-500/10 rounded-xl border border-sky-500/20">
        <Info size={14} className="text-sky-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-300">
          Estimación mensual basada en la escala LIG Art. 94. Período Ene-Jun 2026. 
          Incluye aportes previsionales (17%). Para declaración oficial, consultá a un contador.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Sueldo bruto mensual (ARS)</label>
          <input
            type="text"
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            placeholder="Ej: 2.000.000"
            className="w-full glass px-4 py-3 rounded-xl text-gray-200 border border-white/10 focus:border-sky-500 focus:outline-none text-lg font-mono"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          {t('recursos_calc_btn')}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Aportes previsionales</p>
              <p className="text-lg font-bold text-yellow-400">{fmt(result.gross * 0.17)}</p>
              <p className="text-xs text-gray-500">17%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Impuesto Ganancias</p>
              <p className="text-lg font-bold text-red-400">{fmt(result.monthlyTax)}</p>
              <p className="text-xs text-gray-500">{result.effectiveRate.toFixed(1)}% efectivo</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">💰 Sueldo neto estimado</p>
            <p className="text-2xl font-black text-green-400">{fmt(result.netMonthly)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Retención Ganancias + Aportes: {fmt(result.monthlyTax + result.gross * 0.17)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
