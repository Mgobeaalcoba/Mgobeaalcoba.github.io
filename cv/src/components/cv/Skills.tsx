'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';

const CATEGORY_ICONS: Record<string, string> = {
  'Fullstack & Data': '💻',
  'Machine Learning': '🤖',
  'AI & Automation': '⚡',
  'Cloud & DevOps': '☁️',
  'Business Intelligence': '📊',
  'Developer Tools': '🛠️',
  'Productivity & Management': '📋',
  'Cybersecurity': '🔒',
  'Soft Skills': '🧠',
  'Other': '🔗',
};

export default function Skills() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const techStack = ContentRepository.getTechStack();

  return (
    <section id="skills" data-section="skills" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('skills_title')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(techStack).map(([category, skills], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4 glow-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{CATEGORY_ICONS[category] ?? '⚙️'}</span>
                <h3 className="text-sm font-semibold text-gray-200 truncate">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(skills as string[]).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20 hover:bg-sky-500/20 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Languages section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-6 glass rounded-xl p-5 glow-border"
        >
          <h3 className="text-sm font-semibold text-gray-200 mb-3">🌍 Idiomas</h3>
          <div className="flex gap-6">
            <div>
              <p className="text-gray-300 text-sm font-medium">Español</p>
              <p className="text-gray-500 text-xs">Nativo</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">English</p>
              <p className="text-gray-500 text-xs">C1 - Advanced</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
