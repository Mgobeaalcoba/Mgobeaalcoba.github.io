'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';
import { events } from '@/lib/gtag';
import type { ExperienceItem } from '@/types/content';

function ExperienceModal({
  job,
  onClose,
}: {
  job: ExperienceItem;
  onClose: () => void;
}) {
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-4">
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-full">
              {job.date[lang]}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-1">{job.title[lang]}</h3>
          <p className="text-sky-400 font-medium mb-4">{job.company}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <ul
            className="space-y-2 text-gray-300 text-sm leading-relaxed list-none"
            dangerouslySetInnerHTML={{ __html: job.description[lang] }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Experience() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedJob, setSelectedJob] = useState<ExperienceItem | null>(null);
  const experience = ContentRepository.getExperience();

  const openModal = (job: ExperienceItem) => {
    setSelectedJob(job);
    events.experienceOpen(job.company, job.title[lang]);
  };

  return (
    <section id="experience" data-section="experience" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('experience_title')}</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-sky-500/10" />

          <div className="space-y-4 ml-12">
            {experience.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onClick={() => openModal(job)}
                className="relative cursor-pointer glass rounded-xl p-5 hover:glow-border transition-all duration-200 group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[2.65rem] top-6 w-3.5 h-3.5 rounded-full border-2 border-sky-500 bg-gray-900 group-hover:bg-sky-500 transition-colors" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                        {job.date[lang]}
                      </span>
                      <span className="text-xs text-gray-500">{job.company}</span>
                    </div>
                    <h3 className="font-semibold text-gray-100 group-hover:text-sky-400 transition-colors">
                      {job.title[lang]}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {job.tags.length > 4 && (
                        <span className="text-xs px-2 py-0.5 text-gray-500">+{job.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-500 group-hover:text-sky-400 transition-all group-hover:translate-x-1 shrink-0 mt-1"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {selectedJob && <ExperienceModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </section>
  );
}
