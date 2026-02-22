'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';

export default function Education() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const education = ContentRepository.getEducation();
  const certifications = ContentRepository.getCertifications();

  return (
    <section id="education" data-section="education" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('education_title')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <div className="space-y-4">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5 glow-border"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap size={16} className="text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-100 text-sm leading-snug">
                      {edu.title[lang]}
                    </h3>
                    <p className="text-sky-400 text-sm mt-0.5">{edu.school}</p>
                    {edu.subtitle && (
                      <p className="text-gray-500 text-xs mt-0.5">{edu.subtitle[lang]}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">{edu.date}</p>
                    {edu.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {edu.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-white/5 text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('certifications_title')}</h3>
            <div className="glass rounded-xl p-4 max-h-96 overflow-y-auto custom-scrollbar space-y-2">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.015 }}
                  className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-sky-500 text-xs mt-0.5 shrink-0">▸</span>
                  <span className="text-gray-300 text-xs leading-snug">{cert.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
