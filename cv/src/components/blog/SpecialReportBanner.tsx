'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { TrendingDown, TrendingUp, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const KPI_DATA = [
  {
    value: '265K',
    labelEs: 'Pico layoffs tech 2023',
    labelEn: 'Peak tech layoffs 2023',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    icon: TrendingDown,
  },
  {
    value: '1.2M',
    labelEs: 'Anuncios despido 2025',
    labelEn: 'Layoff announcements 2025',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    icon: AlertTriangle,
  },
  {
    value: '55K+',
    labelEs: 'Layoffs atribuidos a IA',
    labelEn: 'Layoffs attributed to AI',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    icon: Bot,
  },
  {
    value: '+163%',
    labelEs: 'Roles AI/ML vs 2024',
    labelEn: 'AI/ML roles vs 2024',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    icon: TrendingUp,
  },
];

export default function SpecialReportBanner() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="special-report"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <Link
          href="/blog/special/layoffs-genai"
          className="block group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 special-report-bg">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-red-500/5 to-purple-500/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-8">
              {/* Badge + Title */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold tracking-wider uppercase">
                      <AlertTriangle size={12} />
                      Special Report
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {lang === 'es' ? 'Abril 2026 · Data-Driven' : 'April 2026 · Data-Driven'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3 special-report-title">
                    {lang === 'es'
                      ? 'Layoffs, Contratación & GenAI: El Gran Reajuste Laboral'
                      : 'Layoffs, Hiring & GenAI: The Great Labor Reset'}
                  </h2>

                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {lang === 'es'
                      ? 'Análisis 100% data-driven sobre despidos masivos en IT y sectores white collar, tendencias de contratación y su correlación con los hitos de la IA Generativa. Con datos verificables, gráficos interactivos y proyecciones a 1, 2, 5 y 10 años.'
                      : '100% data-driven analysis of massive IT and white collar layoffs, hiring trends, and their correlation with Generative AI milestones. With verifiable data, interactive charts, and 1, 2, 5, and 10-year projections.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold shrink-0 group-hover:text-amber-300 transition-colors">
                  <span>{lang === 'es' ? 'Ver informe completo' : 'View full report'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {KPI_DATA.map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`rounded-xl border p-4 ${kpi.bgColor} group-hover:border-opacity-50 transition-all`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className={kpi.color} />
                        <span className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</span>
                      </div>
                      <span className="text-xs text-gray-500 leading-tight block">
                        {lang === 'es' ? kpi.labelEs : kpi.labelEn}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom bar with sources */}
              <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                <span className="font-medium">
                  {lang === 'es' ? 'Fuentes:' : 'Sources:'}
                </span>
                <span>layoffs.fyi</span>
                <span>·</span>
                <span>Challenger, Gray & Christmas</span>
                <span>·</span>
                <span>Indeed Hiring Lab</span>
                <span>·</span>
                <span>WEF Future of Jobs 2025</span>
                <span>·</span>
                <span>Goldman Sachs</span>
                <span>·</span>
                <span>McKinsey</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
