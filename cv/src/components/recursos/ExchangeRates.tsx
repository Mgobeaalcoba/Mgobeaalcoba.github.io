'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DollarRates {
  oficial: number | null;
  blue: number | null;
  mep: number | null;
  ccl: number | null;
  lastUpdated: string;
}

export default function ExchangeRates() {
  const { t } = useLanguage();
  const [rates, setRates] = useState<DollarRates>({
    oficial: null, blue: null, mep: null, ccl: null, lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchRates() {
    setLoading(true);
    setError(false);
    try {
      const [bluelyticsRes, dolarApiRes] = await Promise.allSettled([
        fetch('https://api.bluelytics.com.ar/v2/latest'),
        fetch('https://dolarapi.com/v1/dolares'),
      ]);

      let blue: number | null = null;
      let oficial: number | null = null;
      let mep: number | null = null;
      let ccl: number | null = null;

      if (bluelyticsRes.status === 'fulfilled' && bluelyticsRes.value.ok) {
        const data = await bluelyticsRes.value.json();
        blue = data.blue?.value_sell ?? null;
        oficial = data.oficial?.value_sell ?? null;
      }

      if (dolarApiRes.status === 'fulfilled' && dolarApiRes.value.ok) {
        const data = await dolarApiRes.value.json();
        const mepEntry = Array.isArray(data) ? data.find((d: { casa: string }) => d.casa === 'bolsa') : null;
        const cclEntry = Array.isArray(data) ? data.find((d: { casa: string }) => d.casa === 'contadoconliqui') : null;
        mep = mepEntry?.venta ?? null;
        ccl = cclEntry?.venta ?? null;
        if (!oficial) {
          const oficialEntry = Array.isArray(data) ? data.find((d: { casa: string }) => d.casa === 'oficial') : null;
          oficial = oficialEntry?.venta ?? null;
        }
      }

      setRates({
        oficial, blue, mep, ccl,
        lastUpdated: new Date().toLocaleTimeString('es-AR'),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRates();
  }, []);

  const displayRates = [
    { key: 'oficial', label: t('recursos_rates_official'), value: rates.oficial, color: 'text-sky-400' },
    { key: 'blue', label: t('recursos_rates_blue'), value: rates.blue, color: 'text-green-400' },
    { key: 'mep', label: t('recursos_rates_mep'), value: rates.mep, color: 'text-yellow-400' },
    { key: 'ccl', label: t('recursos_rates_ccl'), value: rates.ccl, color: 'text-purple-400' },
  ];

  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-sky-400" />
          <h3 className="font-bold text-gray-100">Cotizaciones del Dólar</h3>
        </div>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-50"
          title="Actualizar"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <p className="text-red-400 text-sm">{t('recursos_error')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayRates.map(({ key, label, value, color }) => (
            <div key={key} className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              {loading ? (
                <div className="h-6 bg-gray-700 rounded animate-pulse w-24" />
              ) : (
                <p className={`text-xl font-bold ${color}`}>
                  {value != null ? `$${value.toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {rates.lastUpdated && !loading && (
        <p className="text-gray-600 text-xs mt-3">Última actualización: {rates.lastUpdated}</p>
      )}
    </div>
  );
}
