'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

export default function Process() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { consultingMeta, loading } = useSupabaseData();

  return (
    <section id="proceso" data-section="process" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('consulting_process_title')}</h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse h-40">
                <div className="h-6 bg-white/10 rounded w-10 mb-4" />
                <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        )}
        {!loading && consultingMeta && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultingMeta.processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                {i < consultingMeta.processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-sky-500/30 to-transparent z-0" />
                )}
                <div className="glass rounded-2xl p-6 glow-border relative z-10">
                  <div className="text-3xl font-black gradient-text mb-4">{step.number}</div>
                  <h3 className="font-bold text-gray-100 mb-2">
                    {lang === 'es' ? step.titleEs : step.titleEn}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {lang === 'es' ? step.descriptionEs : step.descriptionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
