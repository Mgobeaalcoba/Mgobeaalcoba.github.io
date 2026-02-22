'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Indicator = {
  id: string;
  label: { es: string; en: string };
  description: { es: string; en: string };
  color: string;
  unit: string;
  apiUrl?: string;
  staticValue?: string;
  source: string;
};

const INDICATORS: Indicator[] = [
  {
    id: 'inflation-monthly',
    label: { es: 'Inflación Mensual', en: 'Monthly Inflation' },
    description: { es: 'IPC variación mensual (INDEC)', en: 'CPI monthly variation (INDEC)' },
    color: 'text-red-400',
    unit: '%',
    source: 'INDEC',
    staticValue: '~2.4%',
  },
  {
    id: 'inflation-yearly',
    label: { es: 'Inflación Interanual', en: 'Annual Inflation' },
    description: { es: 'IPC acumulado 12 meses', en: 'CPI accumulated 12 months' },
    color: 'text-orange-400',
    unit: '%',
    source: 'INDEC',
    staticValue: '~32%',
  },
  {
    id: 'country-risk',
    label: { es: 'Riesgo País', en: 'Country Risk' },
    description: { es: 'Spread EMBI+ Argentina vs Bonos EE.UU.', en: 'EMBI+ spread Argentina vs US Bonds' },
    color: 'text-yellow-400',
    unit: 'pb',
    source: 'JP Morgan',
    staticValue: '~650 pb',
  },
  {
    id: 'plazo-fijo',
    label: { es: 'Plazos Fijos', en: 'Fixed Term Deposits' },
    description: { es: 'TNA promedio bancos privados', en: 'Average TNA private banks' },
    color: 'text-green-400',
    unit: '% TNA',
    source: 'BCRA',
    staticValue: '~36% TNA',
  },
  {
    id: 'fci',
    label: { es: 'FCI Money Market', en: 'FCI Money Market' },
    description: { es: 'Rendimiento fondos de dinero', en: 'Money market fund returns' },
    color: 'text-sky-400',
    unit: '% TNA',
    source: 'CNV',
    staticValue: '~35% TNA',
  },
  {
    id: 'uva',
    label: { es: 'Índice UVA', en: 'UVA Index' },
    description: { es: 'Unidad de Valor Adquisitivo', en: 'Purchasing Value Unit' },
    color: 'text-purple-400',
    unit: 'ARS',
    source: 'BCRA',
    staticValue: '~2.850 ARS',
  },
];

export default function EconomicIndicators() {
  const { lang } = useLanguage();
  const [refreshed, setRefreshed] = useState(false);

  const handleRefresh = () => {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-purple-400" />
          <div>
            <h3 className="text-lg font-bold">
              {lang === 'es' ? 'Indicadores Económicos' : 'Economic Indicators'}
            </h3>
            <p className="text-xs text-gray-400">
              {lang === 'es' ? 'Argentina · Datos orientativos' : 'Argentina · Reference data'}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors"
          title={lang === 'es' ? 'Actualizar' : 'Refresh'}
        >
          <RefreshCw size={16} className={refreshed ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDICATORS.map((ind, i) => (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-gray-200">{ind.label[lang]}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{ind.description[lang]}</p>
              </div>
            </div>
            <div className={`text-2xl font-black ${ind.color} mb-2`}>
              {ind.staticValue}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {lang === 'es' ? 'Fuente:' : 'Source:'} {ind.source}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <ExternalLink size={16} className="text-sky-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400">
          {lang === 'es'
            ? 'Los valores mostrados son estimaciones de referencia actualizadas periódicamente. Para datos en tiempo real, consulte las fuentes oficiales: INDEC, BCRA, CNV.'
            : 'Values shown are reference estimates updated periodically. For real-time data, consult official sources: INDEC, BCRA, CNV.'}
          {' '}
          <a href="https://www.bcra.gob.ar" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">BCRA</a>
          {' · '}
          <a href="https://www.indec.gob.ar" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">INDEC</a>
        </p>
      </div>
    </div>
  );
}
