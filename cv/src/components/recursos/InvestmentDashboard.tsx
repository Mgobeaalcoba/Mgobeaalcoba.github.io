'use client';

import { useEffect, useState } from 'react';
import { BarChart2, RefreshCw } from 'lucide-react';

interface InvestmentData {
  plazoFijo30: number | null;
  inflacionMensual: number | null;
  mepRate: number | null;
  loading: boolean;
  error: boolean;
  lastUpdated: string;
}

export default function InvestmentDashboard() {
  const [data, setData] = useState<InvestmentData>({
    plazoFijo30: null,
    inflacionMensual: null,
    mepRate: null,
    loading: true,
    error: false,
    lastUpdated: '',
  });

  async function fetchData() {
    setData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      // Fetch MEP rate from dolarapi
      const [mepRes, argdatRes] = await Promise.allSettled([
        fetch('https://dolarapi.com/v1/dolares/bolsa'),
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion'),
      ]);

      let mepRate: number | null = null;
      let inflacionMensual: number | null = null;

      if (mepRes.status === 'fulfilled' && mepRes.value.ok) {
        const d = await mepRes.value.json();
        mepRate = d.venta ?? null;
      }

      if (argdatRes.status === 'fulfilled' && argdatRes.value.ok) {
        const d = await argdatRes.value.json();
        if (Array.isArray(d) && d.length > 0) {
          inflacionMensual = d[d.length - 1]?.valor ?? null;
        }
      }

      // Approximate TNA plazo fijo (BCRA data - static approximation)
      const plazoFijo30 = 2.75; // approximate monthly rate (%)

      setData({
        plazoFijo30,
        inflacionMensual,
        mepRate,
        loading: false,
        error: false,
        lastUpdated: new Date().toLocaleTimeString('es-AR'),
      });
    } catch {
      setData((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    {
      label: 'Plazo Fijo 30d',
      value: data.plazoFijo30,
      unit: '% mensual',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      icon: '🏦',
    },
    {
      label: 'Inflación mensual',
      value: data.inflacionMensual,
      unit: '%',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: '📈',
    },
    {
      label: 'Dólar MEP',
      value: data.mepRate,
      unit: 'ARS',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: '💵',
    },
  ];

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-sky-400" />
          <h3 className="font-bold text-gray-100">Dashboard de Inversiones</h3>
        </div>
        <button
          onClick={fetchData}
          disabled={data.loading}
          className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={data.loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-3">
        {metrics.map(({ label, value, unit, color, bg, border, icon }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <span className="text-sm text-gray-300">{label}</span>
            </div>
            {data.loading ? (
              <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
            ) : data.error ? (
              <span className="text-red-400 text-sm">Error</span>
            ) : (
              <span className={`font-bold text-lg ${color}`}>
                {value != null
                  ? unit === 'ARS'
                    ? `$${value.toLocaleString('es-AR')}`
                    : `${value.toFixed(2)}${unit}`
                  : '—'}
              </span>
            )}
          </div>
        ))}
      </div>

      {data.plazoFijo30 != null && data.inflacionMensual != null && (
        <div className={`mt-4 p-4 rounded-xl text-sm ${
          data.plazoFijo30 >= data.inflacionMensual
            ? 'bg-green-500/10 border border-green-500/20 text-green-300'
            : 'bg-red-500/10 border border-red-500/20 text-red-300'
        }`}>
          {data.plazoFijo30 >= data.inflacionMensual
            ? `✅ Plazo Fijo (${data.plazoFijo30}%) supera inflación (${data.inflacionMensual}%)`
            : `⚠️ Inflación (${data.inflacionMensual}%) supera Plazo Fijo (${data.plazoFijo30}%)`}
        </div>
      )}

      {data.lastUpdated && !data.loading && (
        <p className="text-gray-600 text-xs mt-3">Actualizado: {data.lastUpdated}</p>
      )}
    </div>
  );
}
