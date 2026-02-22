'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';
import { events } from '@/lib/gtag';

export default function ConsultingContact() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const consulting = ContentRepository.getConsulting();

  return (
    <section id="contacto" data-section="consulting-contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="section-title text-center">{t('consulting_contact_title')}</h2>

        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          {lang === 'es'
            ? 'Primera reunión 100% gratuita. Te cuento cómo podemos transformar tu negocio en 30 minutos.'
            : 'First meeting 100% free. I\'ll explain how we can transform your business in 30 minutes.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={consulting.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => events.calendlyClick()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:scale-105 text-lg"
          >
            <Calendar size={20} />
            Agendar reunión gratuita
          </a>
          <a
            href="https://wa.me/5491127475569?text=Hola%20Mariano%2C%20me%20interesa%20la%20consultor%C3%ADa"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => events.leadFormSent('consulting')}
            className="flex items-center justify-center gap-2 px-8 py-4 glass border border-green-500/30 text-green-400 rounded-xl font-semibold hover:bg-green-500/10 transition-all text-lg"
          >
            <MessageSquare size={20} />
            WhatsApp directo
          </a>
        </div>

        <p className="text-gray-600 text-sm mt-6">
          gobeamariano@gmail.com · +54 9 11 27475569
        </p>
      </motion.div>
    </section>
  );
}
