'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, GraduationCap, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CalendlyButton from '@/components/shared/CalendlyButton';

type PriceRow = { label: { es: string; en: string }; price: string };
type PricingColumn = {
  icon: React.ElementType;
  title: { es: string; en: string };
  accentColor: string;
  rows: PriceRow[];
  footer: { es: string; en: string };
};

const COLUMNS: PricingColumn[] = [
  {
    icon: Building2,
    title: { es: 'Para Empresas', en: 'For Businesses' },
    accentColor: 'text-sky-400',
    rows: [
      { label: { es: 'Automatización (proyecto)', en: 'Automation (project)' }, price: '$600' },
      { label: { es: 'Chatbot IA (proyecto)', en: 'AI Chatbot (project)' }, price: '$800' },
      { label: { es: 'Dashboard BI (proyecto)', en: 'BI Dashboard (project)' }, price: '$800' },
      { label: { es: 'Recurrente (soporte)', en: 'Recurring (support)' }, price: '$100-200/mes' },
    ],
    footer: { es: '🎁 Primera gratis', en: '🎁 First one free' },
  },
  {
    icon: GraduationCap,
    title: { es: 'Para Profesionales', en: 'For Professionals' },
    accentColor: 'text-amber-400',
    rows: [
      { label: { es: 'Mentoría (sesión)', en: 'Mentoring (session)' }, price: '$100' },
      { label: { es: 'Mentoría (pack 4)', en: 'Mentoring (pack of 4)' }, price: '$350' },
      { label: { es: 'Mentoría (mensual)', en: 'Mentoring (monthly)' }, price: '$280/mes' },
      { label: { es: 'Cursos intensivos', en: 'Intensive courses' }, price: '$600-850' },
    ],
    footer: { es: 'Máx 4 personas', en: 'Max 4 people' },
  },
  {
    icon: UserCheck,
    title: { es: 'Reclutamiento Tech', en: 'Tech Recruiting' },
    accentColor: 'text-teal-400',
    rows: [
      { label: { es: 'Success-based', en: 'Success-based' }, price: '$3,000' },
      { label: { es: 'Retainer (1 búsqueda)', en: 'Retainer (1 search)' }, price: '$1,500/mes' },
      { label: { es: 'Retainer (2 búsquedas)', en: 'Retainer (2 searches)' }, price: '$2,000/mes' },
    ],
    footer: { es: 'Garantía 3 meses', en: '3-month guarantee' },
  },
];

export default function PricingOverview() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" ref={ref} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="section-title">
            {lang === 'es' ? 'Precios Transparentes' : 'Transparent Pricing'}
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            {lang === 'es' ? 'Sin sorpresas. Estos son nuestros precios reales.' : 'No surprises. These are our real prices.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {COLUMNS.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${col.accentColor}`}>
                <col.icon size={20} />
                {col.title[lang]}
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {col.rows.map((row) => (
                  <li key={row.price} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>{row.label[lang]}</span>
                    <strong className="text-white ml-2 text-right">{row.price}</strong>
                  </li>
                ))}
              </ul>
              <div className={`mt-4 text-center pt-3 border-t border-white/5 text-xs font-bold ${col.accentColor}`}>
                {col.footer[lang]}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            {lang === 'es'
              ? 'Todos los precios en USD. Adaptables según la complejidad de su proyecto.'
              : 'All prices in USD. Adaptable to the complexity of your project.'}
          </p>
          <CalendlyButton className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-6 py-3 rounded-xl transition-all">
            {lang === 'es' ? '📊 Solicitar Cotización Personalizada' : '📊 Request Custom Quote'}
          </CalendlyButton>
        </div>
      </motion.div>
    </section>
  );
}
