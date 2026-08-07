'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardWidgetMini() {
  const { lang } = useLanguage();

  const stats = [
    {
      icon: '🏦',
      label: lang === 'es' ? 'Plazo Fijo' : 'Fixed Term',
      value: '~36%',
      color: 'text-green-400',
      sub: lang === 'es' ? 'TNA actual' : 'Current TNA',
    },
    {
      icon: '💵',
      label: 'Dólar MEP',
      value: '~18%',
      color: 'text-blue-400',
      sub: lang === 'es' ? 'Devaluación anual' : 'Annual devaluation',
    },
    {
      icon: '📈',
      label: lang === 'es' ? 'Inflación' : 'Inflation',
      value: '~32%',
      color: 'text-red-400',
      sub: lang === 'es' ? 'IPC (bajando)' : 'CPI (declining)',
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {lang === 'es' ? '¿Dónde conviene tu dinero hoy?' : 'Where Should Your Money Go Today?'}
          </h2>
          <TrendingUp className="text-sky-400" size={24} />
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {lang === 'es'
            ? 'Comparador de inversiones en Argentina (últimos 12 meses)'
            : 'Investment comparison in Argentina (last 12 months)'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-default"
            >
              <span className="block text-xs text-gray-400 mb-1">
                {stat.icon} {stat.label}
              </span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
        <Link
          href="/recursos/"
          className="flex items-center justify-center gap-2 text-sky-400 text-sm hover:underline font-semibold"
        >
          {lang === 'es'
            ? 'Ver Dashboard Completo con Gráficos Interactivos →'
            : 'View Full Dashboard with Interactive Charts →'}
        </Link>
      </div>
    </motion.section>
  );
}
