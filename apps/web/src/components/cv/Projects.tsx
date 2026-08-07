'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { events } from '@/lib/gtag';
import { useFilter } from '@/contexts/FilterContext';

const INITIAL_SHOW = 6;

const FILTERS = [
  { id: 'all', es: 'Todos', en: 'All', terms: [] },
  { id: 'ai', es: 'IA', en: 'AI', terms: ['ai', 'llm', 'rag', 'machine learning', 'openai', 'genai'] },
  { id: 'automation', es: 'Automatización', en: 'Automation', terms: ['n8n', 'automation', 'automatización', 'workflow'] },
  { id: 'data', es: 'Data', en: 'Data', terms: ['python', 'pandas', 'sql', 'sqlite', 'data', 'bi', 'etl'] },
  { id: 'products', es: 'Productos', en: 'Products', terms: ['javascript', 'typescript', 'next', 'react', 'html', 'css', 'product'] },
  { id: 'education', es: 'Educación', en: 'Education', terms: ['education', 'educación', 'learning', 'masterclass', 'course'] },
];

function matchesCategory(project: { tags: string[]; title: { es: string; en: string }; description: { es: string; en: string } }, category: string) {
  if (category === 'all') return true;
  const filter = FILTERS.find((item) => item.id === category);
  if (!filter) return project.tags.includes(category);
  const searchable = [...project.tags, project.title.es, project.title.en, project.description.es, project.description.en].join(' ').toLowerCase();
  return filter.terms.some((term) => searchable.includes(term));
}

export default function Projects() {
  const { lang, t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const { projects: allProjects, loading } = useSupabaseData();
  const { activeTag: globalTag } = useFilter();

  // Use global filter if set (from Skills section), otherwise use local filter
  const effectiveTag = globalTag !== 'all' ? globalTag : activeTag;

  const filtered =
    effectiveTag === 'all'
      ? allProjects
      : allProjects.filter((p) => matchesCategory(p, effectiveTag));

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const { setActiveTag: setGlobalTag } = useFilter();

  return (
    <section id="projects" data-section="projects" className="signal-portfolio-chapter signal-projects-v2">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="signal-chapter-heading">
          <span className="signal-eyebrow">03 / {lang === 'es' ? 'Trabajo' : 'Work'}</span>
          <h2>{lang === 'es' ? 'Productos, sistemas y experimentos.' : 'Products, systems and experiments.'}</h2>
          <p>{lang === 'es' ? 'Casos seleccionados donde la tecnología se traduce en una capacidad concreta.' : 'Selected work where technology becomes a concrete capability.'}</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 animate-pulse h-40">
                <div className="h-3 bg-white/10 rounded w-20 mb-3" />
                <div className="h-4 bg-white/10 rounded w-36 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Global filter indicator */}
        {globalTag !== 'all' && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
            <span className="text-xs text-sky-400">
              🔍 {lang === 'es' ? 'Filtro activo desde Skills:' : 'Filter active from Skills:'}{' '}
              <strong className="text-sky-300">{globalTag}</strong>
            </span>
            <button
              onClick={() => { setGlobalTag('all'); setActiveTag('all'); setShowAll(false); }}
              className="ml-auto text-xs text-gray-400 hover:text-white glass px-2 py-0.5 rounded-full"
            >
              ✕ {lang === 'es' ? 'Limpiar' : 'Clear'}
            </button>
          </div>
        )}

        {/* Tag filters */}
        <div className="signal-project-filters" aria-label={lang === 'es' ? 'Filtrar proyectos' : 'Filter projects'}>
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => { events.contentFilter('project', 'category', filter.id); setActiveTag(filter.id); setGlobalTag('all'); setShowAll(false); }}
              className={`signal-project-filter ${
                effectiveTag === filter.id && globalTag === 'all'
                  ? 'is-active'
                  : ''
              }`}
            >
              {filter[lang]}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="signal-project-grid">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`signal-project-card group ${i < 2 && effectiveTag === 'all' ? `signal-project-card--featured ${i === 1 ? 'signal-project-card--reverse' : ''}` : ''}`}
            >
              <div className="signal-project-card__rail">
                <div className="signal-project-card__index">{String(i + 1).padStart(2, '0')} / {i < 2 && effectiveTag === 'all' ? (lang === 'es' ? 'Destacado' : 'Featured') : 'Lab'}</div>
                <span>{lang === 'es' ? 'Caso seleccionado' : 'Selected case'}</span>
              </div>
              <div className="signal-project-card__main">
                <div className="signal-project-card__tags">
                  {project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                  {project.tags.length > 3 && <span>+{project.tags.length - 3}</span>}
                </div>
                <h3>{project.title[lang]}</h3>
              </div>
              <div className="signal-project-card__aside">
                <p>{project.description[lang]}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={() => events.projectView(project.title[lang])} className="signal-project-card__link">
                  <Github size={13} />{t('view_repo')}<ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length > INITIAL_SHOW && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => { events.contentLoadMore('project', filtered.length); setShowAll(true); }}
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
