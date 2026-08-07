'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Users, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PROPS = [
  {
    icon: Building2,
    color: 'sky',
    title: { es: 'Para su Negocio', en: 'For Your Business' },
    desc: {
      es: 'Automatización, IA y dashboards para optimizar operaciones, reducir costos y tomar mejores decisiones.',
      en: 'Automation, AI and dashboards to optimize operations, reduce costs and make better decisions.',
    },
    tags: ['Automatización', 'IA', 'BI'],
  },
  {
    icon: Users,
    color: 'indigo',
    title: { es: 'Para su Equipo', en: 'For Your Team' },
    desc: {
      es: 'Capacitación intensiva en grupos reducidos para upskilling en SQL, Python, Data Science, GenAI y Power BI.',
      en: 'Intensive training in small groups for upskilling in SQL, Python, Data Science, GenAI and Power BI.',
    },
    tags: ['Cursos', '4 personas max'],
  },
  {
    icon: User,
    color: 'amber',
    title: { es: 'Para Usted', en: 'For You' },
    desc: {
      es: 'Mentoría 1-a-1 para acelerar su carrera tech y encontrar el talento especializado que su empresa necesita.',
      en: '1-on-1 mentoring to accelerate your tech career and find the specialized talent your company needs.',
    },
    tags: ['Mentorías', 'Recruiting'],
  },
];

const COLOR_MAP: Record<string, string> = {
  sky: 'text-sky-400 bg-sky-500/10',
  indigo: 'text-indigo-400 bg-indigo-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
};

const TAG_MAP: Record<string, string> = {
  sky: 'bg-sky-500/10 text-sky-400',
  indigo: 'bg-indigo-500/10 text-indigo-400',
  amber: 'bg-amber-500/10 text-amber-400',
};

export default function ValuePropositions() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        {PROPS.map((prop, i) => (
          <motion.div
            key={prop.color}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15 }}
            className="text-center p-8 glass rounded-2xl hover:scale-105 transition-transform duration-300 glow-border"
          >
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${COLOR_MAP[prop.color].split(' ')[1]}`}>
              <prop.icon size={36} className={COLOR_MAP[prop.color].split(' ')[0]} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-100">{prop.title[lang]}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{prop.desc[lang]}</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {prop.tags.map((tag) => (
                <span key={tag} className={`px-3 py-1 rounded-full ${TAG_MAP[prop.color]}`}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
