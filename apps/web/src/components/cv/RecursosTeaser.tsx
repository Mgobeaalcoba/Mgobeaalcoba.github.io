'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Percent } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RecursosTeaser() {
  const { lang } = useLanguage();

  const cards = [
    {
      icon: <Calculator className="text-yellow-400" size={24} />,
      title: lang === 'es' ? 'Calculadora Ganancias' : 'Income Tax Calculator',
      sub: lang === 'es' ? 'Cuarta Categoría' : '4th Category',
    },
    {
      icon: <TrendingUp className="text-green-400" size={24} />,
      title: lang === 'es' ? 'Cotizaciones Dólar' : 'Dollar Exchange Rates',
      sub: 'Blue, MEP, Oficial',
    },
    {
      icon: <Percent className="text-red-400" size={24} />,
      title: lang === 'es' ? 'Indicadores' : 'Indicators',
      sub: lang === 'es' ? 'Inflación & Más' : 'Inflation & More',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-white/10">
          {lang === 'es' ? 'Recursos Útiles Gratuitos' : 'Free Useful Resources'}
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          {lang === 'es' ? (
            <>
              Accedé a{' '}
              <Link href="/recursos/" className="text-purple-400 hover:text-purple-300 font-medium underline decoration-dotted">
                herramientas financieras especializadas para Argentina
              </Link>
              : calculadora de impuesto a las ganancias, cotizaciones del dólar blue y oficial en tiempo real, indicadores de inflación y más.
            </>
          ) : (
            <>
              Access{' '}
              <Link href="/recursos/" className="text-purple-400 hover:text-purple-300 font-medium underline decoration-dotted">
                specialized financial tools for Argentina
              </Link>
              : income tax calculator, real-time USD exchange rates (blue, official), inflation indicators and more.
            </>
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {cards.map((card, i) => (
            <div key={i} className="text-center p-3 bg-gray-800/30 rounded-lg">
              <div className="flex justify-center mb-2">{card.icon}</div>
              <div className="text-sm font-medium">{card.title}</div>
              <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
            </div>
          ))}
        </div>
        <Link
          href="/recursos/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
          title={lang === 'es' ? 'Recursos financieros gratuitos: calculadoras, cotizaciones y herramientas para Argentina' : 'Free financial resources: calculators, quotes and tools for Argentina'}
        >
          {lang === 'es' ? 'Explorar Recursos Gratuitos' : 'Explore Free Resources'}
        </Link>
      </div>
    </motion.section>
  );
}
