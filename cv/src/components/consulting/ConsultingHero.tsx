'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';
import { events } from '@/lib/gtag';
import CalendlyButton from '@/components/shared/CalendlyButton';

export default function ConsultingHero() {
  const { lang, t } = useLanguage();
  const consulting = ContentRepository.getConsulting();

  return (
    <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Zap size={14} className="text-sky-400" />
            <span className="text-xs text-sky-400 font-medium">MGA Tech Consulting</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black mb-6">
            <span className="text-gray-100">{consulting.headline[lang].split(' ').slice(0, 2).join(' ')}</span>
            <br />
            <span className="gradient-text">{consulting.headline[lang].split(' ').slice(2).join(' ')}</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            {consulting.subheadline[lang]}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {consulting.stats.map((stat) => (
              <div key={stat.value} className="glass rounded-xl px-6 py-4 text-center glow-border">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label[lang]}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <CalendlyButton className="flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:scale-105">
              <Calendar size={18} />
              {t('consulting_cta')}
            </CalendlyButton>
            <Link
              href="#servicios"
              className="flex items-center gap-2 px-8 py-4 glass border border-sky-500/30 text-sky-400 rounded-xl font-semibold hover:bg-sky-500/10 transition-all"
            >
              {t('consulting_services_title')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
