'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart2, RefreshCw, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

type Period = '3m' | '6m' | '12m';

interface MonthData {
  fecha: string;
  valor: number;
}

interface ChartData {
  labels: string[];
  plazoFijo: (number | null)[];
  dolarMep: (number | null)[];
  inflacion: (number | null)[];
}

interface LiveData {
  mepNow: number | null;
  inflacionNow: number | null;
  plazoFijoNow: number;
  lastUpdated: string;
}


function getMonthLabel(fecha: string): string {
  const [y, m] = fecha.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
}

function getMepMonthly(mepPrice: number, prevMepPrice: number): number {
  if (prevMepPrice === 0) return 0;
  return ((mepPrice - prevMepPrice) / prevMepPrice) * 100;
}

// Simple SVG line chart
function LineChart({ data, period }: { data: ChartData; period: Period }) {
  if (!data.labels.length) return null;

  const width = 560;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allVals = [
    ...data.plazoFijo.filter(Boolean) as number[],
    ...data.dolarMep.filter(Boolean) as number[],
    ...data.inflacion.filter(Boolean) as number[],
  ];
  const minVal = Math.min(-1, ...allVals);
  const maxVal = Math.max(15, ...allVals);
  const valRange = maxVal - minVal;

  const toX = (i: number) => padding.left + (i / (data.labels.length - 1)) * chartW;
  const toY = (v: number) => padding.top + chartH - ((v - minVal) / valRange) * chartH;

  const buildPath = (vals: (number | null)[]) => {
    const pts = vals.map((v, i) => v != null ? `${toX(i)},${toY(v)}` : null).filter(Boolean);
    if (pts.length < 2) return '';
    return `M ${pts.join(' L ')}`;
  };

  const zeroY = toY(0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 220 }}>
      {/* Grid */}
      {[-0, 5, 10, 15].map((val) => (
        <g key={val}>
          <line x1={padding.left} y1={toY(val)} x2={width - padding.right} y2={toY(val)} stroke="rgba(255,255,255,0.07)" strokeDasharray="4" />
          <text x={padding.left - 5} y={toY(val)} textAnchor="end" fill="#9ca3af" fontSize="9" dominantBaseline="middle">{val}%</text>
        </g>
      ))}
      {/* Zero line */}
      <line x1={padding.left} y1={zeroY} x2={width - padding.right} y2={zeroY} stroke="rgba(255,255,255,0.2)" />

      {/* Lines */}
      <path d={buildPath(data.plazoFijo)} fill="none" stroke="#38bdf8" strokeWidth="2" />
      <path d={buildPath(data.dolarMep)} fill="none" stroke="#4ade80" strokeWidth="2" />
      <path d={buildPath(data.inflacion)} fill="none" stroke="#f87171" strokeWidth="2" />

      {/* X labels */}
      {data.labels.map((label, i) => {
        if (data.labels.length > 6 && i % 2 !== 0) return null;
        return (
          <text key={i} x={toX(i)} y={height - 8} textAnchor="middle" fill="#6b7280" fontSize="9">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function InvestmentDashboard() {
  const { lang } = useLanguage();
  const { plazoFijoRates } = useSupabaseData();
  const [period, setPeriod] = useState<Period>('12m');
  const [chartData, setChartData] = useState<ChartData>({ labels: [], plazoFijo: [], dolarMep: [], inflacion: [] });
  const [liveData, setLiveData] = useState<LiveData>({ mepNow: null, inflacionNow: null, plazoFijoNow: 2.75, lastUpdated: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;

      const [inflRes, mepRes] = await Promise.allSettled([
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion'),
        fetch('https://dolarapi.com/v1/dolares/bolsa'),
      ]);

      let inflArray: MonthData[] = [];
      let mepNow: number | null = null;

      if (inflRes.status === 'fulfilled' && inflRes.value.ok) {
        inflArray = await inflRes.value.json();
      }
      if (mepRes.status === 'fulfilled' && mepRes.value.ok) {
        const d = await mepRes.value.json();
        mepNow = d.venta ?? null;
      }

      const lastInflData = inflArray.slice(-months);
      const labels = lastInflData.map((d) => getMonthLabel(d.fecha));
      const inflacion = lastInflData.map((d) => d.valor);
      const inflacionNow = inflArray.length > 0 ? inflArray[inflArray.length - 1]?.valor : null;

      const plazoFijo = lastInflData.map((d) => plazoFijoRates[d.fecha] ?? 2.75);
      const dolarMep = lastInflData.map((_) => null as number | null); // no historical MEP available

      setChartData({ labels, plazoFijo, dolarMep, inflacion });
      setLiveData({ mepNow, inflacionNow, plazoFijoNow: 2.75, lastUpdated: new Date().toLocaleTimeString('es-AR') });
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const METRICS = [
    { label: { es: 'Plazo Fijo 30d', en: 'Fixed Term 30d' }, value: `${liveData.plazoFijoNow.toFixed(2)}%`, sub: { es: 'mensual (est.)', en: 'monthly (est.)' }, color: 'text-sky-400', icon: '🏦' },
    { label: { es: 'Inflación mensual', en: 'Monthly inflation' }, value: liveData.inflacionNow != null ? `${liveData.inflacionNow.toFixed(1)}%` : '—', sub: { es: 'IPC (INDEC)', en: 'CPI (INDEC)' }, color: 'text-red-400', icon: '📈' },
    { label: { es: 'Dólar MEP', en: 'MEP Dollar' }, value: liveData.mepNow != null ? `$${liveData.mepNow.toLocaleString('es-AR')}` : '—', sub: { es: 'precio de venta', en: 'selling price' }, color: 'text-green-400', icon: '💵' },
  ];

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-sky-400" />
          <div>
            <h3 className="font-bold text-gray-100">{lang === 'es' ? 'Dashboard de Inversiones' : 'Investment Dashboard'}</h3>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Plazo Fijo vs Inflación mensual' : 'Fixed Term vs Monthly Inflation'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.share) {
                navigator.share({ title: 'Dashboard Inversiones Argentina', url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors"
            title={lang === 'es' ? 'Compartir' : 'Share'}
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Live metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {METRICS.map((m) => (
          <div key={m.label.es} className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">{m.icon}</div>
            <p className={`text-lg font-bold ${m.color}`}>{loading ? '...' : m.value}</p>
            <p className="text-xs text-gray-500">{m.label[lang]}</p>
            <p className="text-xs text-gray-600">{m.sub[lang]}</p>
          </div>
        ))}
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-4">
        {(['3m', '6m', '12m'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              period === p ? 'bg-sky-500 text-white' : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : '12 meses'}
          </button>
        ))}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <RefreshCw size={24} className="text-sky-400 animate-spin" />
        </div>
      ) : (
        <div className="mb-3">
          <LineChart data={chartData} period={period} />
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sky-400 inline-block" />{lang === 'es' ? 'Plazo Fijo' : 'Fixed Term'}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block" />{lang === 'es' ? 'Inflación' : 'Inflation'}</span>
      </div>

      {liveData.lastUpdated && (
        <p className="text-xs text-gray-600">{lang === 'es' ? 'Actualizado:' : 'Updated:'} {liveData.lastUpdated}</p>
      )}

      {/* Comparison note */}
      {liveData.inflacionNow != null && (
        <div className={`mt-3 p-3 rounded-xl text-xs ${
          liveData.plazoFijoNow >= liveData.inflacionNow
            ? 'bg-green-500/10 border border-green-500/20 text-green-300'
            : 'bg-red-500/10 border border-red-500/20 text-red-300'
        }`}>
          {liveData.plazoFijoNow >= liveData.inflacionNow
            ? `✅ ${lang === 'es' ? 'Plazo Fijo' : 'Fixed Term'} (${liveData.plazoFijoNow}%) ${lang === 'es' ? 'supera inflación' : 'beats inflation'} (${liveData.inflacionNow}%)`
            : `⚠️ ${lang === 'es' ? 'Inflación' : 'Inflation'} (${liveData.inflacionNow}%) ${lang === 'es' ? 'supera Plazo Fijo' : 'beats Fixed Term'} (${liveData.plazoFijoNow}%)`}
        </div>
      )}
    </div>
  );
}
