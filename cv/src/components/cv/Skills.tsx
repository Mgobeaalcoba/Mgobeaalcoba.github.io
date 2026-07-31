'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, ChartNoAxesCombined, CloudCog, Code2, Network } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { useFilter } from '@/contexts/FilterContext';

const ICONS = [Network, ChartNoAxesCombined, BrainCircuit, CloudCog, Code2];

export default function Skills() {
  const { lang } = useLanguage();
  const { techStack } = useSupabaseData();
  const { activeTag, setActiveTag } = useFilter();
  const entries = Object.entries(techStack);

  const selectSkill = (skill: string) => {
    setActiveTag(activeTag === skill ? 'all' : skill);
    requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <section id="skills" data-section="skills" className="signal-portfolio-chapter signal-capability-v2">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
        <div className="signal-chapter-heading">
          <span className="signal-eyebrow">05 / {lang === 'es' ? 'Capacidades' : 'Capabilities'}</span>
          <h2>{lang === 'es' ? 'Profundidad técnica, amplitud de negocio.' : 'Technical depth, business breadth.'}</h2>
          <p>{lang === 'es' ? 'Seleccioná una tecnología para ver inmediatamente el trabajo que la demuestra.' : 'Select a technology to immediately see the work that demonstrates it.'}</p>
        </div>

        <div className="signal-capability-matrix">
          {entries.map(([category, skills], index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <article key={category}>
                <div className="signal-capability-matrix__head"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={20} /></div>
                <h3>{category}</h3>
                <p>{lang === 'es' ? `${skills.length} herramientas y prácticas aplicadas en productos reales.` : `${skills.length} tools and practices applied in real products.`}</p>
                <div className="signal-capability-matrix__skills">
                  {(skills as string[]).map((skill) => <button key={skill} onClick={() => selectSkill(skill)} className={activeTag === skill ? 'is-active' : ''}>{skill}</button>)}
                </div>
              </article>
            );
          })}
        </div>

        <div className="signal-language-strip"><span>ES</span><strong>{lang === 'es' ? 'Español nativo' : 'Native Spanish'}</strong><span>EN</span><strong>English C1 · Advanced</strong></div>
      </motion.div>
    </section>
  );
}
