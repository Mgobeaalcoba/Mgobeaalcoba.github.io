'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface RateEntry {
  casa: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
}

interface HistoryPoint {
  fecha: string;
  compra: number;
  venta: number;
}

type Period = '7d' | '30d' | '90d' | '1y';

const RATE_CONFIG: {
  casa: string;
  label: { es: string; en: string };
  color: string;
  icon: string;
  hasHistory: boolean;
}[] = [
  { casa: 'oficial',        label: { es: 'Oficial',              en: 'Official'       }, color: 'text-sky-400',    icon: '🏛️', hasHistory: true  },
  { casa: 'blue',           label: { es: 'Blue (Paralelo)',      en: 'Blue (Parallel)' }, color: 'text-green-400',  icon: '💵', hasHistory: true  },
  { casa: 'bolsa',          label: { es: 'MEP (Bolsa)',          en: 'MEP (Stock)'    }, color: 'text-yellow-400', icon: '📈', hasHistory: true  },
  { casa: 'contadoconliqui',label: { es: 'Contado c/Liqui',     en: 'Cash w/ Liqui'  }, color: 'text-purple-400', icon: '💹', hasHistory: true  },
  { casa: 'mayorista',      label: { es: 'Mayorista',           en: 'Wholesale'      }, color: 'text-teal-400',   icon: '🏢', hasHistory: true  },
  { casa: 'solidario',      label: { es: 'Solidario (+55%)',     en: 'Solidarity (+55%)' }, color: 'text-orange-400', icon: '🤝', hasHistory: false },
  { casa: 'tarjeta',        label: { es: 'Tarjeta / Turista',   en: 'Card / Tourist' }, color: 'text-pink-400',   icon: '💳', hasHistory: false },
  { casa: 'cripto',         label: { es: 'Cripto (USDT)',        en: 'Crypto (USDT)'  }, color: 'text-indigo-400', icon: '₿',  hasHistory: false },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: '7d',  label: '7d'  },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: '1y',  label: '1y'  },
];

function filterByPeriod(data: HistoryPoint[], period: Period): HistoryPoint[] {
  const now = new Date();
  const cutoff = new Date();
  if (period === '7d')  cutoff.setDate(now.getDate() - 7);
  if (period === '30d') cutoff.setDate(now.getDate() - 30);
  if (period === '90d') cutoff.setDate(now.getDate() - 90);
  if (period === '1y')  cutoff.setFullYear(now.getFullYear() - 1);
  return data.filter((d) => new Date(d.fecha) >= cutoff);
}

function LineChart({ data, color }: { data: HistoryPoint[]; color: string }) {
  if (data.length < 2) return null;
  const w = 400, h = 100;
  const ventas = data.map((d) => d.venta);
  const compras = data.map((d) => d.compra);
  const allVals = [...ventas, ...compras].filter(Boolean);
  const minV = Math.min(...allVals) * 0.995;
  const maxV = Math.max(...allVals) * 1.005;
  const range = maxV - minV || 1;

  const toX = (i: number) => (i / (data.length - 1)) * w;
  const toY = (v: number) => h - ((v - minV) / range) * (h - 10) - 5;

  const ventaPts = data.map((d, i) => `${toX(i)},${toY(d.venta)}`).join(' ');
  const compraPts = data.map((d, i) => `${toX(i)},${toY(d.compra)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 100 }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
        <line key={frac} x1="0" x2={w} y1={h * (1 - frac)} y2={h * (1 - frac)}
          stroke="#374151" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {/* Compra (dashed) */}
      <polyline points={compraPts} fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5 3" />
      {/* Venta (solid) */}
      <polyline points={ventaPts} fill="none" stroke={color} strokeWidth="2" />
      {/* Last point dot */}
      {data.length > 0 && (
        <circle
          cx={toX(data.length - 1)}
          cy={toY(data[data.length - 1].venta)}
          r="3" fill={color}
        />
      )}
    </svg>
  );
}

function DollarHistoryModal({
  casa,
  config,
  onClose,
}: {
  casa: string;
  config: typeof RATE_CONFIG[0];
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const [period, setPeriod] = useState<Period>('30d');
  const [allData, setAllData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!config.hasHistory) { setLoading(false); return; }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.argentinadatos.com/v1/cotizaciones/dolares/${casa}`);
      if (!res.ok) throw new Error();
      const raw: HistoryPoint[] = await res.json();
      setAllData(Array.isArray(raw) ? raw : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [casa, config.hasHistory]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filtered = filterByPeriod(allData, period);
  const lastEntry = filtered[filtered.length - 1];
  const firstEntry = filtered[0];
  const ventaChange = lastEntry && firstEntry
    ? ((lastEntry.venta - firstEntry.venta) / firstEntry.venta) * 100
    : null;

  const colorHex: Record<string, string> = {
    'text-sky-400':    '#38bdf8',
    'text-green-400':  '#4ade80',
    'text-yellow-400': '#facc15',
    'text-purple-400': '#c084fc',
    'text-teal-400':   '#2dd4bf',
    'text-orange-400': '#fb923c',
    'text-pink-400':   '#f472b6',
    'text-indigo-400': '#818cf8',
  };
  const lineColor = colorHex[config.color] ?? '#38bdf8';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative glass rounded-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{config.icon}</span>
          <h3 className={`font-bold text-lg ${config.color}`}>{config.label[lang]}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {lang === 'es' ? 'Fuente: ArgentinaDatos · dolarapi.com' : 'Source: ArgentinaDatos · dolarapi.com'}
        </p>

        {!config.hasHistory ? (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-sm">
              {lang === 'es'
                ? 'Sin historial disponible para este tipo de cambio.'
                : 'No historical data available for this exchange rate type.'}
            </p>
          </div>
        ) : (
          <>
            {/* Period selector */}
            <div className="flex gap-2 mb-4">
              {PERIODS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPeriod(id)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                    period === id ? 'bg-sky-500 text-white' : 'glass text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="h-24 flex items-center justify-center">
                <RefreshCw size={20} className="text-sky-400 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-center text-sm text-red-400 py-6">
                {lang === 'es' ? 'Error cargando datos históricos.' : 'Error loading historical data.'}
              </p>
            ) : filtered.length < 2 ? (
              <p className="text-center text-sm text-gray-500 py-6">
                {lang === 'es' ? 'Sin datos suficientes para el período.' : 'Not enough data for this period.'}
              </p>
            ) : (
              <>
                <LineChart data={filtered} color={lineColor} />

                {/* Legend */}
                <div className="flex gap-4 justify-center mt-2 mb-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-6 h-0.5 border-t-2" style={{ borderColor: lineColor }} />
                    {lang === 'es' ? 'Venta' : 'Sell'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-6 h-0.5 border-t border-dashed border-gray-500" />
                    {lang === 'es' ? 'Compra' : 'Buy'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{lang === 'es' ? 'Último' : 'Latest'}</p>
                    <p className={`font-bold ${config.color}`}>
                      ${lastEntry?.venta?.toLocaleString('es-AR', { maximumFractionDigits: 2 }) ?? '—'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{lang === 'es' ? 'Variación' : 'Change'}</p>
                    <p className={`font-bold ${ventaChange != null && ventaChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {ventaChange != null ? `${ventaChange >= 0 ? '+' : ''}${ventaChange.toFixed(1)}%` : '—'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{lang === 'es' ? 'Puntos' : 'Points'}</p>
                    <p className="font-bold text-gray-200">{filtered.length}</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ExchangeRates() {
  const { lang } = useLanguage();
  const [rates, setRates] = useState<RateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedCasa, setSelectedCasa] = useState<string | null>(null);

  async function fetchRates() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('https://dolarapi.com/v1/dolares');
      if (!res.ok) throw new Error();
      const data: RateEntry[] = await res.json();
      setRates(Array.isArray(data) ? data : []);
      setLastUpdated(new Date().toLocaleTimeString('es-AR'));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRates(); }, []);

  const getRateValue = (casa: string): RateEntry | undefined =>
    rates.find((r) => r.casa === casa);

  const selectedConfig = RATE_CONFIG.find((c) => c.casa === selectedCasa);

  return (
    <>
      <AnimatePresence>
        {selectedCasa && selectedConfig && (
          <DollarHistoryModal
            casa={selectedCasa}
            config={selectedConfig}
            onClose={() => setSelectedCasa(null)}
          />
        )}
      </AnimatePresence>

      <div className="glass rounded-2xl p-6 glow-border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-sky-400" />
            <div>
              <h3 className="font-bold text-gray-100">
                {lang === 'es' ? 'Cotizaciones del Dólar' : 'Dollar Exchange Rates'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'es'
                  ? 'Clic en cada tipo para ver evolución histórica · dolarapi.com'
                  : 'Click each type to see historical chart · dolarapi.com'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-50"
            title={lang === 'es' ? 'Actualizar' : 'Refresh'}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {error ? (
          <p className="text-red-400 text-sm">
            {lang === 'es' ? 'Error cargando datos. Intente nuevamente.' : 'Error loading data. Try again.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {RATE_CONFIG.map(({ casa, label, color, icon, hasHistory }) => {
              const entry = getRateValue(casa);
              const venta = entry?.venta;
              const compra = entry?.compra;
              return (
                <button
                  key={casa}
                  onClick={() => setSelectedCasa(casa)}
                  className={`bg-white/5 rounded-xl p-3 text-left transition-all hover:bg-white/10 hover:scale-[1.02] ${
                    hasHistory ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  title={hasHistory
                    ? (lang === 'es' ? 'Ver evolución histórica' : 'View historical chart')
                    : undefined}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs text-gray-400 font-medium">{label[lang]}</span>
                    {hasHistory && (
                      <span className="ml-auto text-gray-600 text-xs">📊</span>
                    )}
                  </div>
                  {loading ? (
                    <div className="h-6 bg-gray-700 rounded animate-pulse w-20" />
                  ) : (
                    <>
                      <p className={`text-lg font-bold ${color}`}>
                        {venta != null
                          ? `$${venta.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                          : '—'}
                      </p>
                      {compra != null && venta != null && (
                        <p className="text-xs text-gray-500">
                          {lang === 'es' ? 'Compra' : 'Buy'}: ${compra.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Spread info */}
        {!loading && !error && (() => {
          const oficial = getRateValue('oficial')?.venta;
          const blue = getRateValue('blue')?.venta;
          if (!oficial || !blue) return null;
          const spread = ((blue / oficial - 1) * 100).toFixed(1);
          return (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-amber-300">
                📊 {lang === 'es' ? 'Brecha Oficial/Blue:' : 'Official/Blue Gap:'}{' '}
                <strong>{spread}%</strong>
              </p>
            </div>
          );
        })()}

        {lastUpdated && !loading && (
          <p className="text-xs text-gray-600 mt-3">
            {lang === 'es' ? 'Última actualización:' : 'Last updated:'} {lastUpdated}
          </p>
        )}
      </div>
    </>
  );
}
