'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, RefreshCw, ExternalLink, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Indicator = {
  id: string;
  label: { es: string; en: string };
  description: { es: string; en: string };
  color: string;
  source: string;
  historyApi?: string;
  staticFallback: string;
};

const INDICATORS: Indicator[] = [
  { id: 'inflation-monthly', label: { es: 'Inflación Mensual', en: 'Monthly Inflation' }, description: { es: 'IPC variación mensual (INDEC)', en: 'CPI monthly variation (INDEC)' }, color: 'text-red-400', source: 'INDEC', historyApi: 'inflacion', staticFallback: '~2.4%' },
  { id: 'inflation-yearly', label: { es: 'Inflación Interanual', en: 'Annual Inflation' }, description: { es: 'IPC acumulado 12 meses', en: 'CPI accumulated 12 months' }, color: 'text-orange-400', source: 'INDEC', historyApi: 'inflacionInteranual', staticFallback: '~32%' },
  { id: 'country-risk', label: { es: 'Riesgo País', en: 'Country Risk' }, description: { es: 'Spread EMBI+ vs Bonos EE.UU.', en: 'EMBI+ spread vs US Bonds' }, color: 'text-yellow-400', source: 'BCRA', historyApi: 'riesgo-pais', staticFallback: '~650 pb' },
  { id: 'plazo-fijo', label: { es: 'Plazos Fijos', en: 'Fixed Term Deposits' }, description: { es: 'TNA promedio bancos privados', en: 'Average TNA private banks' }, color: 'text-green-400', source: 'BCRA', staticFallback: '~33% TNA' },
  { id: 'fci', label: { es: 'FCI Money Market', en: 'FCI Money Market' }, description: { es: 'Rendimiento fondos de dinero', en: 'Money market fund returns' }, color: 'text-sky-400', source: 'CNV', staticFallback: '~32% TNA' },
  { id: 'uva', label: { es: 'Índice UVA', en: 'UVA Index' }, description: { es: 'Unidad de Valor Adquisitivo', en: 'Purchasing Value Unit' }, color: 'text-purple-400', source: 'BCRA', historyApi: 'uva', staticFallback: '~2.850 ARS' },
];

type HistoryEntry = { fecha: string; valor: number };

type HistoryRange = '7d' | '30d' | '90d' | '1y' | 'max';

function MiniSparkline({ data }: { data: HistoryEntry[] }) {
  if (data.length < 2) return null;
  const vals = data.map((d) => d.valor);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const w = 300, h = 60;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  });
  const isUp = vals[vals.length - 1] >= vals[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 60 }}>
      <polyline points={pts.join(' ')} fill="none" stroke={isUp ? '#4ade80' : '#f87171'} strokeWidth="2" />
    </svg>
  );
}

function HistoryModal({ indicator, onClose }: { indicator: Indicator; onClose: () => void }) {
  const { lang } = useLanguage();
  const [range, setRange] = useState<HistoryRange>('30d');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!indicator.historyApi) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.argentinadatos.com/v1/finanzas/indices/${indicator.historyApi}`);
      if (!res.ok) throw new Error();
      const all: HistoryEntry[] = await res.json();
      const now = new Date();
      const cutoff = new Date();
      if (range === '7d') cutoff.setDate(now.getDate() - 7);
      else if (range === '30d') cutoff.setDate(now.getDate() - 30);
      else if (range === '90d') cutoff.setDate(now.getDate() - 90);
      else if (range === '1y') cutoff.setFullYear(now.getFullYear() - 1);
      else cutoff.setFullYear(2020);

      setHistory(range === 'max' ? all : all.filter((d) => new Date(d.fecha) >= cutoff));
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [indicator.historyApi, range]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const RANGES: HistoryRange[] = ['7d', '30d', '90d', '1y', 'max'];

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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={18} /></button>
        <h3 className="font-bold text-gray-100 mb-1">{indicator.label[lang]}</h3>
        <p className="text-xs text-gray-500 mb-4">{lang === 'es' ? 'Fuente:' : 'Source:'} {indicator.source}</p>

        <div className="flex gap-2 mb-4">
          {RANGES.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${range === r ? 'bg-sky-500 text-white' : 'glass text-gray-400 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-20 flex items-center justify-center"><RefreshCw size={20} className="text-sky-400 animate-spin" /></div>
        ) : history.length > 0 ? (
          <>
            <MiniSparkline data={history} />
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500">{lang === 'es' ? 'Último' : 'Latest'}</p>
                <p className={`font-bold ${indicator.color}`}>{history[history.length - 1]?.valor.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500">{lang === 'es' ? 'Máximo' : 'Max'}</p>
                <p className="font-bold text-gray-200">{Math.max(...history.map((d) => d.valor)).toFixed(2)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500">{lang === 'es' ? 'Mínimo' : 'Min'}</p>
                <p className="font-bold text-gray-200">{Math.min(...history.map((d) => d.valor)).toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-gray-500 py-6">{lang === 'es' ? 'Sin datos disponibles' : 'No data available'}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function EconomicIndicators() {
  const { lang } = useLanguage();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [inflRes, inflIntRes, riesgoPaisRes, uvaRes] = await Promise.allSettled([
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion'),
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'),
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais'),
        fetch('https://api.argentinadatos.com/v1/finanzas/indices/uva'),
      ]);

      const newVals: Record<string, string> = {};

      const readLast = async (res: PromiseSettledResult<Response>): Promise<HistoryEntry | null> => {
        if (res.status !== 'fulfilled' || !res.value.ok) return null;
        const arr: HistoryEntry[] = await res.value.json();
        return arr.length > 0 ? arr[arr.length - 1] : null;
      };

      const [infl, inflInt, riesgoPais, uva] = await Promise.all([
        readLast(inflRes), readLast(inflIntRes), readLast(riesgoPaisRes), readLast(uvaRes),
      ]);

      if (infl) newVals['inflation-monthly'] = `${infl.valor.toFixed(1)}%`;
      if (inflInt) newVals['inflation-yearly'] = `${inflInt.valor.toFixed(1)}%`;
      if (riesgoPais) newVals['country-risk'] = `${Math.round(riesgoPais.valor)} pb`;
      if (uva) newVals['uva'] = `${uva.valor.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

      setValues(newVals);
      setLastUpdated(new Date().toLocaleTimeString('es-AR'));
    } catch {
      // use static fallbacks
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-purple-400" />
          <div>
            <h3 className="text-lg font-bold">{lang === 'es' ? 'Indicadores Económicos' : 'Economic Indicators'}</h3>
            <p className="text-xs text-gray-400">
              {lang === 'es' ? 'Argentina · Datos en tiempo real' : 'Argentina · Real-time data'}
              {lastUpdated && ` · ${lang === 'es' ? 'Act.' : 'Upd.'} ${lastUpdated}`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-50"
          title={lang === 'es' ? 'Actualizar' : 'Refresh'}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDICATORS.map((ind, i) => {
          const liveVal = values[ind.id];
          const displayVal = loading ? '...' : (liveVal ?? ind.staticFallback);
          const hasHistory = !!ind.historyApi;

          return (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-2xl p-5 ${hasHistory ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''}`}
              onClick={() => hasHistory && setSelectedIndicator(ind)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-200">{ind.label[lang]}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{ind.description[lang]}</p>
                </div>
                {hasHistory && <ChevronRight size={14} className="text-gray-500 mt-0.5 shrink-0" />}
              </div>
              <div className={`text-2xl font-black ${ind.color} mb-2`}>
                {displayVal}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{lang === 'es' ? 'Fuente:' : 'Source:'} {ind.source}</span>
                {hasHistory && (
                  <span className="text-xs text-sky-400">{lang === 'es' ? 'Ver historial' : 'View history'}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <ExternalLink size={16} className="text-sky-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400">
          {lang === 'es'
            ? 'Datos provenientes de APIs públicas (argentinadatos.com). Para información oficial consulte:'
            : 'Data from public APIs (argentinadatos.com). For official information consult:'}
          {' '}
          <a href="https://www.bcra.gob.ar" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">BCRA</a>
          {' · '}
          <a href="https://www.indec.gob.ar" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">INDEC</a>
        </p>
      </div>

      <AnimatePresence>
        {selectedIndicator && (
          <HistoryModal indicator={selectedIndicator} onClose={() => setSelectedIndicator(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
