'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Testimonial = {
  quote: { es: string; en: string };
  author: string;
  role: { es: string; en: string };
  accentColor: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      es: 'Mariano transformó completamente nuestra forma de trabajar. Automatizó la conciliación bancaria y los informes mensuales que nos tomaban 2 días. Ahora tardamos 15 minutos.',
      en: 'Mariano completely transformed the way we work. He automated bank reconciliation and monthly reports that used to take us 2 days. Now we do it in 15 minutes.',
    },
    author: 'Laura González',
    role: { es: 'Dueña, Consultora Contable', en: 'Owner, Accounting Consultancy' },
    accentColor: 'sky',
  },
  {
    quote: {
      es: 'El dashboard que implementó nos permite ver en tiempo real qué productos rotan, dónde perdemos margen y cuándo reponer stock. El ROI fue evidente en el primer mes.',
      en: 'The dashboard he implemented lets us see in real time which products are moving, where we lose margin, and when to restock. The ROI was evident in the first month.',
    },
    author: 'Roberto Martínez',
    role: { es: 'CEO, Distribuidora (120 empleados)', en: 'CEO, Distributor (120 employees)' },
    accentColor: 'purple',
  },
];

const ACCENT_TEXT: Record<string, string> = {
  sky: 'text-sky-400',
  purple: 'text-purple-400',
};

export default function Testimonials() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title text-center mb-12">
          {lang === 'es' ? 'Lo que dicen mis clientes' : 'What My Clients Say'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              <Quote size={32} className={`${ACCENT_TEXT[t.accentColor]} mb-4 opacity-60`} />
              <blockquote className="text-gray-200 font-medium mb-4 text-sm leading-relaxed italic">
                &ldquo;{t.quote[lang]}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                <div className={`w-10 h-10 rounded-full ${t.accentColor === 'sky' ? 'bg-sky-500/20' : 'bg-purple-500/20'} flex items-center justify-center text-lg font-bold ${ACCENT_TEXT[t.accentColor]}`}>
                  {t.author[0]}
                </div>
                <div>
                  <strong className={ACCENT_TEXT[t.accentColor]}>{t.author}</strong>
                  <p className="text-xs text-gray-400">{t.role[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
