'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';
import { events } from '@/lib/gtag';

const INITIAL_SHOW = 6;

export default function Projects() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTag, setActiveTag] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const allProjects = ContentRepository.getProjects();

  // Collect unique tags
  const tags = ['all', ...Array.from(new Set(allProjects.flatMap((p) => p.tags))).slice(0, 12)];

  const filtered =
    activeTag === 'all'
      ? allProjects
      : allProjects.filter((p) => p.tags.includes(activeTag));

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);

  return (
    <section id="projects" data-section="projects" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('projects_title')}</h2>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setShowAll(false); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeTag === tag
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'glass border-white/10 text-gray-400 hover:text-sky-400 hover:border-sky-500/30'
              }`}
            >
              {tag === 'all' ? t('filter_all') : tag}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-5 flex flex-col gap-3 glow-border hover:scale-[1.01] transition-transform group"
            >
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
                )}
              </div>

              <h3 className="font-semibold text-gray-100 text-sm leading-snug group-hover:text-sky-400 transition-colors">
                {project.title[lang]}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                {project.description[lang]}
              </p>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => events.projectView(project.title[lang])}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors mt-auto"
              >
                <Github size={13} />
                {t('view_repo')}
                <ExternalLink size={11} />
              </a>
            </motion.div>
          ))}
        </div>

        {filtered.length > INITIAL_SHOW && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 glass border border-sky-500/30 text-sky-400 rounded-xl hover:bg-sky-500/10 transition-all text-sm font-medium"
            >
              {t('load_more')} ({filtered.length - INITIAL_SHOW} más)
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
