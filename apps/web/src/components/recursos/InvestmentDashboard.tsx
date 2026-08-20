'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart2, RefreshCw, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRecursosData } from '@/contexts/RecursosDataContext';
import { events } from '@/lib/gtag';

type Period = '3m' | '6m' | '12m';

interface MonthData {
  fecha: string;
  valor: number;
}

interface ChartData {
  labels: string[];
  plazoFijo: (number | null)[];
  inflacion: (number | null)[];
  uvaMonthly: (number | null)[];
}

interface LiveData {
  mepNow: number | null;
  inflacionNow: number | null;
  plazoFijoNow: number;
  uvaMonthlyNow: number | null;
  lastUpdated: string;
}


function getMonthLabel(fecha: string): string {
  const [y, m] = fecha.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
}

function normalizeMonthData(data: unknown): MonthData[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((entry): entry is MonthData => {
      if (!entry || typeof entry !== 'object') return false;
      const candidate = entry as Partial<MonthData>;
      return typeof candidate.fecha === 'string'
        && !Number.isNaN(Date.parse(candidate.fecha))
        && typeof candidate.valor === 'number'
        && Number.isFinite(candidate.valor);
    })
    .sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha));
}

function getUvaMonthlyChanges(data: MonthData[]): Map<string, number> {
  const monthEndValues = new Map<string, number>();
  data.forEach(({ fecha, valor }) => monthEndValues.set(fecha.slice(0, 7), valor));

  const changes = new Map<string, number>();
  const monthKeys = Array.from(monthEndValues.keys()).sort();
  monthKeys.forEach((month, index) => {
    if (index === 0) return;
    const previousValue = monthEndValues.get(monthKeys[index - 1]);
    const currentValue = monthEndValues.get(month);
    if (previousValue == null || currentValue == null || previousValue === 0) return;
    changes.set(month, ((currentValue - previousValue) / previousValue) * 100);
  });

  return changes;
}

function getDynamicAxis(values: number[]) {
  if (values.length === 0) {
    return { min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], decimals: 2 };
  }

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const dataRange = dataMax - dataMin;
  const padding = dataRange === 0
    ? Math.max(Math.abs(dataMax) * 0.1, 0.5)
    : dataRange * 0.15;
  const paddedMin = dataMin - padding;
  const paddedMax = dataMax + padding;
  const roughStep = (paddedMax - paddedMin) / 5;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalizedStep = roughStep / magnitude;
  const multiplier = normalizedStep <= 1
    ? 1
    : normalizedStep <= 2
      ? 2
      : normalizedStep <= 2.5
        ? 2.5
        : normalizedStep <= 5
          ? 5
          : 10;
  const step = multiplier * magnitude;
  const min = Math.floor(paddedMin / step) * step;
  const max = Math.ceil(paddedMax / step) * step;
  const tickCount = Math.round((max - min) / step);
  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, index) => Number((min + index * step).toFixed(10)),
  );
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;

  return { min, max, ticks, decimals };
}

// Simple SVG line chart
function LineChart({ data }: { data: ChartData }) {
  if (!data.labels.length) return null;

  const width = 560;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allVals = [
    ...data.plazoFijo,
    ...data.inflacion,
    ...data.uvaMonthly,
  ].filter((value): value is number => value != null && Number.isFinite(value));
  const { min: minVal, max: maxVal, ticks, decimals } = getDynamicAxis(allVals);
  const valRange = maxVal - minVal;

  const toX = (i: number) => data.labels.length === 1
    ? padding.left + chartW / 2
    : padding.left + (i / (data.labels.length - 1)) * chartW;
  const toY = (v: number) => padding.top + chartH - ((v - minVal) / valRange) * chartH;

  const buildPath = (vals: (number | null)[]) => {
    const pts = vals.map((v, i) => v != null ? `${toX(i)},${toY(v)}` : null).filter(Boolean);
    if (pts.length < 2) return '';
    return `M ${pts.join(' L ')}`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 220 }}>
      {/* Grid */}
      {ticks.map((val) => (
        <g key={val}>
          <line
            x1={padding.left}
            y1={toY(val)}
            x2={width - padding.right}
            y2={toY(val)}
            stroke={val === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}
            strokeDasharray={val === 0 ? undefined : '4'}
          />
          <text x={padding.left - 5} y={toY(val)} textAnchor="end" fill="#9ca3af" fontSize="9" dominantBaseline="middle">
            {`${Math.abs(val) < 1e-10 ? (0).toFixed(decimals) : val.toFixed(decimals)}%`}
          </text>
        </g>
      ))}

      {/* Lines */}
      <path d={buildPath(data.plazoFijo)} fill="none" stroke="#38bdf8" strokeWidth="2" />
      <path d={buildPath(data.inflacion)} fill="none" stroke="#f87171" strokeWidth="2" />
      <path d={buildPath(data.uvaMonthly)} fill="none" stroke="#c084fc" strokeWidth="2" />

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
  const { plazoFijoRates } = useRecursosData();
  const [period, setPeriod] = useState<Period>('12m');
  const [chartData, setChartData] = useState<ChartData>({ labels: [], plazoFijo: [], inflacion: [], uvaMonthly: [] });
  const [liveData, setLiveData] = useState<LiveData>({ mepNow: null, inflacionNow: null, plazoFijoNow: 2.75, uvaMonthlyNow: null, lastUpdated: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;

      const [inflRes, mepRes, uvaRes] = await Promise.allSettled([
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion'),
        fetch('https://dolarapi.com/v1/dolares/bolsa'),
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/uva'),
      ]);

      let inflArray: MonthData[] = [];
      let uvaArray: MonthData[] = [];
      let mepNow: number | null = null;

      if (inflRes.status === 'fulfilled' && inflRes.value.ok) {
        inflArray = normalizeMonthData(await inflRes.value.json());
      }
      if (mepRes.status === 'fulfilled' && mepRes.value.ok) {
        const d: unknown = await mepRes.value.json();
        if (d && typeof d === 'object') {
          const venta = (d as { venta?: unknown }).venta;
          mepNow = typeof venta === 'number' && Number.isFinite(venta) ? venta : null;
        }
      }
      if (uvaRes.status === 'fulfilled' && uvaRes.value.ok) {
        uvaArray = normalizeMonthData(await uvaRes.value.json());
      }

      const lastInflData = inflArray.slice(-months);
      const labels = lastInflData.map((d) => getMonthLabel(d.fecha));
      const inflacion = lastInflData.map((d) => d.valor);
      const inflacionNow = inflArray.length > 0 ? inflArray[inflArray.length - 1]?.valor : null;

      const plazoFijo = lastInflData.map((d) => plazoFijoRates[d.fecha] ?? 2.75);
      const uvaChangesByMonth = getUvaMonthlyChanges(uvaArray);
      const uvaMonthly = lastInflData.map((d) => uvaChangesByMonth.get(d.fecha.slice(0, 7)) ?? null);
      const uvaMonthlyNow = [...uvaMonthly].reverse().find((value) => value != null) ?? null;

      setChartData({ labels, plazoFijo, inflacion, uvaMonthly });
      setLiveData({ mepNow, inflacionNow, plazoFijoNow: 2.75, uvaMonthlyNow, lastUpdated: new Date().toLocaleTimeString('es-AR') });
      events.toolResult('investments', labels.length ? 'success' : 'fallback', labels.length ? period : 'no_history');
    } catch {
      // keep previous
      events.toolError('investments', 'market_data_load_failed', true);
    } finally {
      setLoading(false);
    }
  }, [period, plazoFijoRates]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const METRICS = [
    { label: { es: 'Plazo Fijo 30d', en: 'Fixed Term 30d' }, value: `${liveData.plazoFijoNow.toFixed(2)}%`, sub: { es: 'mensual (est.)', en: 'monthly (est.)' }, color: 'text-sky-400', icon: '🏦' },
    { label: { es: 'Inflación mensual', en: 'Monthly inflation' }, value: liveData.inflacionNow != null ? `${liveData.inflacionNow.toFixed(1)}%` : '—', sub: { es: 'IPC (INDEC)', en: 'CPI (INDEC)' }, color: 'text-red-400', icon: '📈' },
    { label: { es: 'Dólar MEP', en: 'MEP Dollar' }, value: liveData.mepNow != null ? `$${liveData.mepNow.toLocaleString('es-AR')}` : '—', sub: { es: 'precio de venta', en: 'selling price' }, color: 'text-green-400', icon: '💵' },
    { label: { es: 'Variación UVA', en: 'UVA change' }, value: liveData.uvaMonthlyNow != null ? `${liveData.uvaMonthlyNow.toFixed(2)}%` : '—', sub: { es: 'mensual (BCRA)', en: 'monthly (BCRA)' }, color: 'text-purple-400', icon: '🏠' },
  ];

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-sky-400" />
          <div>
            <h3 className="font-bold text-gray-100">{lang === 'es' ? 'Dashboard de Inversiones' : 'Investment Dashboard'}</h3>
            <p className="text-xs text-gray-500">{lang === 'es' ? 'Plazo Fijo vs Inflación vs UVA mensual' : 'Fixed Term vs Inflation vs Monthly UVA'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              const canNativeShare = 'share' in navigator;
              events.toolAction('investments', 'share', canNativeShare ? 'native_share' : 'clipboard');
              const method = canNativeShare ? 'native_share' : 'clipboard';
              try {
                if (canNativeShare) {
                  await navigator.share({ title: 'Dashboard Inversiones Argentina', url: window.location.href });
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                }
                events.share(method, 'tool_result', 'investments');
              } catch {
                events.toolAction('investments', 'share_result', 'cancelled_or_unavailable');
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
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
          <LineChart data={chartData} />
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sky-400 inline-block" />{lang === 'es' ? 'Plazo Fijo' : 'Fixed Term'}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block" />{lang === 'es' ? 'Inflación' : 'Inflation'}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 inline-block" />{lang === 'es' ? 'Variación UVA' : 'UVA change'}</span>
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
