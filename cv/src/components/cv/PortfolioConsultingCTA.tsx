'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PortfolioConsultingCTA() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-8 sm:p-10 border border-sky-500/15 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none" />

        <div className="relative z-10 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div className="mb-5 sm:mb-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-2">
              {lang === 'es'
                ? '¿Buscás servicios de Data & Analytics para tu empresa?'
                : 'Looking for Data & Analytics services for your company?'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
              {lang === 'es'
                ? 'Ayudo a pymes a optimizar operaciones con automatización, IA y Business Intelligence.'
                : 'I help SMBs optimize operations with automation, AI and Business Intelligence.'}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white
              bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
              shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30
              transition-all duration-200 shrink-0"
          >
            {lang === 'es' ? 'Conocer Servicios' : 'Explore Services'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
