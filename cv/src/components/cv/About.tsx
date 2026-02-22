'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';

export default function About() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const about = ContentRepository.getAbout();

  return (
    <section id="about" data-section="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('about_title')}</h2>
        <div className="glass rounded-2xl p-8 glow-border max-w-4xl">
          <p className="text-gray-300 leading-relaxed text-lg">{about.text[lang]}</p>

          {/* Key highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: '🎯', label: { es: 'Liderazgo', en: 'Leadership' } },
              { icon: '🤖', label: { es: 'IA & ML', en: 'AI & ML' } },
              { icon: '📊', label: { es: 'Data Eng.', en: 'Data Eng.' } },
              { icon: '🚀', label: { es: 'Automatización', en: 'Automation' } },
            ].map((item) => (
              <div key={item.label.es} className="glass rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-gray-400 font-medium">{item.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
