'use client';

import { useState } from 'react';
import { Briefcase, Info } from 'lucide-react';

// Newton-Raphson iteration to find gross salary from desired net
function grossFromNet(targetNet: number, maxIterations = 50): number {
  const APORTES_RATE = 0.17;
  const MFI_ANUAL = 2419184 * 12;
  const SCALE = [
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

  function netFor(gross: number): number {
    const aportes = gross * APORTES_RATE;
    const annual = (gross - aportes) * 13;
    const taxable = Math.max(0, annual - MFI_ANUAL);
    let tax = 0;
    for (const b of SCALE) {
      if (taxable > b.from) {
        tax = b.fixed + (Math.min(taxable, b.to) - b.from) * b.rate;
      }
    }
    return gross - aportes - tax / 12;
  }

  let gross = targetNet * 1.35; // initial guess
  for (let i = 0; i < maxIterations; i++) {
    const net = netFor(gross);
    const diff = net - targetNet;
    if (Math.abs(diff) < 10) break;
    gross = gross - diff * 0.8;
  }
  return Math.max(gross, 0);
}

export default function SalarySimulator() {
  const [targetNet, setTargetNet] = useState('');
  const [result, setResult] = useState<{
    gross: number;
    aportes: number;
    tax: number;
    net: number;
    rangeLow: number;
    rangeHigh: number;
  } | null>(null);

  const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

  const handleSimulate = () => {
    const net = parseFloat(targetNet.replace(/\./g, '').replace(',', '.'));
    if (isNaN(net) || net <= 0) return;

    const gross = grossFromNet(net);
    const aportes = gross * 0.17;

    // Recalculate tax at the found gross
    const MFI = 2419184 * 12;
    const annual = (gross - aportes) * 13;
    const taxable = Math.max(0, annual - MFI);
    const SCALE = [
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
    let annualTax = 0;
    for (const b of SCALE) {
      if (taxable > b.from) annualTax = b.fixed + (Math.min(taxable, b.to) - b.from) * b.rate;
    }
    const monthlyTax = annualTax / 12;

    setResult({
      gross,
      aportes,
      tax: monthlyTax,
      net: gross - aportes - monthlyTax,
      rangeLow: gross * 0.95,
      rangeHigh: gross * 1.05,
    });
  };

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase size={20} className="text-sky-400" />
        <h3 className="font-bold text-gray-100">Simulador Sueldo Neto → Bruto</h3>
      </div>

      <div className="flex items-start gap-2 mb-5 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <Info size={14} className="text-purple-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-300">
          ¿Cuánto bruto necesitás para llevarte X neto? Usando Newton-Raphson para calcular iterativamente.
          Útil para negociar salario en entrevistas.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Neto deseado mensual (ARS)</label>
          <input
            type="text"
            value={targetNet}
            onChange={(e) => setTargetNet(e.target.value)}
            placeholder="Ej: 1.500.000"
            className="w-full glass px-4 py-3 rounded-xl text-gray-200 border border-white/10 focus:border-purple-500 focus:outline-none text-lg font-mono"
          />
        </div>
        <button
          onClick={handleSimulate}
          className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-semibold transition-all"
        >
          Calcular Bruto Necesario
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">🎯 Bruto necesario</p>
            <p className="text-2xl font-black text-purple-400">{fmt(result.gross)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Rango de negociación: {fmt(result.rangeLow)} – {fmt(result.rangeHigh)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Bruto</p>
              <p className="font-bold text-gray-200 text-sm">{fmt(result.gross)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Aportes</p>
              <p className="font-bold text-yellow-400 text-sm">−{fmt(result.aportes)}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Ganancias</p>
              <p className="font-bold text-red-400 text-sm">−{fmt(result.tax)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
