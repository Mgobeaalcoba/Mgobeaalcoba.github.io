'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { lang } = useLanguage();
  const profileSummary = lang === 'es'
    ? 'Líder técnico de Data & Analytics en Mercado Libre, con más de 7 años convirtiendo problemas complejos de negocio en sistemas escalables y productos medibles.'
    : 'Data & Analytics technical leader at Mercado Libre, with 7+ years turning complex business problems into scalable systems and measurable products.';
  const principles = lang === 'es'
    ? [
        ['01', 'Pensamiento sistémico', 'Conecto arquitectura, producto, operación y personas antes de elegir una tecnología.'],
        ['02', 'Impacto observable', 'Defino métricas y señales de adopción para que el valor no quede en una presentación.'],
        ['03', 'Equipos autónomos', 'Construyo contexto, estándares y herramientas para que las decisiones escalen.'],
      ]
    : [
        ['01', 'Systems thinking', 'I connect architecture, product, operations and people before choosing a technology.'],
        ['02', 'Observable impact', 'I define metrics and adoption signals so value does not remain in a presentation.'],
        ['03', 'Autonomous teams', 'I build context, standards and tools so decision-making can scale.'],
      ];

  return (
    <section id="about" data-section="about" className="signal-portfolio-chapter signal-about-v2">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
        <div className="signal-chapter-heading">
          <span className="signal-eyebrow">01 / {lang === 'es' ? 'Perfil' : 'Profile'}</span>
          <h2>{lang === 'es' ? 'Liderazgo técnico con mirada de producto.' : 'Technical leadership with a product mindset.'}</h2>
          <ArrowDownRight size={28} aria-hidden="true" />
        </div>

        <div className="signal-about-v2__grid">
          <div className="signal-about-v2__statement">
            <p>{profileSummary}</p>
          </div>
          <div className="signal-principles">
            {principles.map(([number, title, body]) => (
              <article key={number}>
                <span>{number}</span><div><h3>{title}</h3><p>{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
