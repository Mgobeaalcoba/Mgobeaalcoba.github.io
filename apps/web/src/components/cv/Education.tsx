'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, GraduationCap, LibraryBig } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import Timeline3D from '@/components/shared/Timeline3D';

export default function Education() {
  const { lang } = useLanguage();
  const { education, certifications, loading } = useSupabaseData();
  const [show3D, setShow3D] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visibleCertifications = showAll ? certifications : certifications.slice(0, 10);

  return (
    <section id="education" data-section="education" className="signal-portfolio-chapter signal-learning-v2">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
        <div className="signal-chapter-heading signal-chapter-heading--action">
          <div><span className="signal-eyebrow">04 / {lang === 'es' ? 'Aprendizaje' : 'Learning'}</span><h2>{lang === 'es' ? 'Aprender es parte del sistema.' : 'Learning is part of the system.'}</h2></div>
          <button onClick={() => setShow3D(!show3D)} className="signal-inline-action"><Box size={15} />{show3D ? (lang === 'es' ? 'Vista editorial' : 'Editorial view') : (lang === 'es' ? 'Explorar timeline 3D' : 'Explore 3D timeline')}</button>
        </div>

        {loading ? <div className="signal-loading-block" /> : show3D ? (
          <Timeline3D items={education.map((edu) => ({ date: edu.date, title: edu.title[lang], subtitle: edu.school, description: edu.subtitle?.[lang] ?? '' }))} lang={lang} />
        ) : (
          <div className="signal-learning-grid">
            <div className="signal-learning-column">
              <div className="signal-learning-column__title"><GraduationCap size={20} /><div><span>{lang === 'es' ? 'Fundamentos' : 'Foundations'}</span><strong>{education.length} {lang === 'es' ? 'instancias formativas' : 'learning milestones'}</strong></div></div>
              <div className="signal-education-list">
                {education.map((edu) => <article key={`${edu.school}-${edu.date}`}><time>{edu.date}</time><div><h3>{edu.title[lang]}</h3><p>{edu.school}</p>{edu.subtitle && <small>{edu.subtitle[lang]}</small>}</div></article>)}
              </div>
            </div>
            <div className="signal-learning-column">
              <div className="signal-learning-column__title"><LibraryBig size={20} /><div><span>{lang === 'es' ? 'Actualización continua' : 'Continuous learning'}</span><strong>{certifications.length}+ {lang === 'es' ? 'certificaciones registradas' : 'certifications recorded'}</strong></div></div>
              <div className="signal-cert-list">
                {visibleCertifications.map((cert, i) => <article key={`${cert.name}-${i}`}><span>{String(i + 1).padStart(2, '0')}</span><p>{cert.name}</p></article>)}
              </div>
              {certifications.length > 10 && <button className="signal-inline-action signal-inline-action--full" onClick={() => setShowAll(!showAll)}>{showAll ? (lang === 'es' ? 'Ver selección' : 'Show selection') : `${lang === 'es' ? 'Ver historial completo' : 'Show full history'} (+${certifications.length - 10})`}</button>}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
