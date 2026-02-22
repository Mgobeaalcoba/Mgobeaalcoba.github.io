'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';

export default function CaseStudies() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const consulting = ContentRepository.getConsulting();

  return (
    <section id="casos" data-section="case-studies" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('consulting_examples_title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consulting.caseStudies.map((cs, i) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden glow-border group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={`/cv-site${cs.image}`}
                  alt={cs.title[lang]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-sky-500/80 text-white rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-100 mb-2">{cs.title[lang]}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{cs.description[lang]}</p>
                <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
                  <span>📈</span>
                  {cs.result[lang]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
