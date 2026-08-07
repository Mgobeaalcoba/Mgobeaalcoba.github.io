'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Brain, BarChart2, GraduationCap, Users, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Story = {
  icon: React.ElementType;
  category: { es: string; en: string };
  client: { es: string; en: string };
  service: { es: string; en: string };
  metrics: { value: string; label: { es: string; en: string } }[];
  accentColor: string;
  bgColor: string;
};

const STORIES: Story[] = [
  {
    icon: Bot,
    category: { es: 'AUTOMATIZACIÓN', en: 'AUTOMATION' },
    client: { es: 'Pyme de Servicios', en: 'Services SMB' },
    service: { es: 'Automatización de facturación y cobranzas', en: 'Billing and collections automation' },
    metrics: [
      { value: '18hrs', label: { es: 'Ahorro semanal', en: 'Weekly savings' } },
      { value: '$12K', label: { es: 'Ahorro anual', en: 'Annual savings' } },
    ],
    accentColor: 'text-sky-400',
    bgColor: 'bg-sky-500/20',
  },
  {
    icon: Brain,
    category: { es: 'IA APLICADA', en: 'APPLIED AI' },
    client: { es: 'E-commerce', en: 'E-commerce' },
    service: { es: 'Chatbot WhatsApp con IA para atención 24/7', en: 'WhatsApp AI chatbot for 24/7 support' },
    metrics: [
      { value: '60%', label: { es: 'Consultas resueltas', en: 'Queries resolved' } },
      { value: '24/7', label: { es: 'Disponibilidad', en: 'Availability' } },
    ],
    accentColor: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  {
    icon: BarChart2,
    category: { es: 'BUSINESS INTELLIGENCE', en: 'BUSINESS INTELLIGENCE' },
    client: { es: 'Distribuidora', en: 'Distributor' },
    service: { es: 'Dashboard de ventas y rentabilidad en tiempo real', en: 'Real-time sales and profitability dashboard' },
    metrics: [
      { value: '18%', label: { es: 'Aumento rentabilidad', en: 'Profitability increase' } },
      { value: '3 meses', label: { es: 'ROI', en: 'ROI' } },
    ],
    accentColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
  {
    icon: GraduationCap,
    category: { es: 'MENTORÍA', en: 'MENTORING' },
    client: { es: 'Data Analyst Jr', en: 'Junior Data Analyst' },
    service: { es: 'Transición a Sr Data Engineer en 8 meses', en: 'Transition to Sr Data Engineer in 8 months' },
    metrics: [
      { value: '45%', label: { es: 'Aumento salarial', en: 'Salary increase' } },
      { value: 'Remote', label: { es: 'Oferta internacional', en: 'International offer' } },
    ],
    accentColor: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  {
    icon: Users,
    category: { es: 'CURSOS', en: 'COURSES' },
    client: { es: 'Equipo Analytics (3p)', en: 'Analytics Team (3p)' },
    service: { es: 'Curso SQL intensivo → Autonomía completa en queries', en: 'Intensive SQL course → Full query autonomy' },
    metrics: [
      { value: '100%', label: { es: 'Proyectos aprobados', en: 'Projects approved' } },
      { value: '5 sem', label: { es: 'Autonomía lograda', en: 'Autonomy achieved' } },
    ],
    accentColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
  },
  {
    icon: UserCheck,
    category: { es: 'RECRUITING', en: 'RECRUITING' },
    client: { es: 'Startup Fintech', en: 'Fintech Startup' },
    service: { es: 'Sr Data Engineer colocado en 3 semanas', en: 'Sr Data Engineer placed in 3 weeks' },
    metrics: [
      { value: '3 sem', label: { es: 'Proceso total', en: 'Total process' } },
      { value: '18m+', label: { es: 'Retención', en: 'Retention' } },
    ],
    accentColor: 'text-teal-400',
    bgColor: 'bg-teal-500/20',
  },
];

export default function SuccessStories() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="success-stories" ref={ref} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-title">
            {lang === 'es' ? 'Resultados Reales de Clientes Reales' : 'Real Results from Real Clients'}
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            {lang === 'es'
              ? 'Casos de éxito medibles en cada uno de nuestros servicios'
              : 'Measurable success cases across all our services'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 glow-border"
            >
              <div className="flex items-center mb-4 gap-3">
                <story.icon size={28} className={story.accentColor} />
                <span className={`text-xs font-bold px-3 py-1 ${story.bgColor} rounded-full ${story.accentColor}`}>
                  {story.category[lang]}
                </span>
              </div>
              <h4 className="font-bold text-lg text-gray-100 mb-1">{story.client[lang]}</h4>
              <p className="text-gray-400 text-sm mb-4">{story.service[lang]}</p>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {story.metrics.map((m) => (
                    <div key={m.value}>
                      <p className={`text-2xl font-bold ${story.accentColor}`}>{m.value}</p>
                      <p className="text-xs text-gray-500">{m.label[lang]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
