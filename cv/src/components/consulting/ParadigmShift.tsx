'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { X, Check, Hourglass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BEFORE = {
  es: [
    'Desarrollo a medida: meses de espera y presupuestos fuera del alcance PyME',
    'Techo de cristal: las grandes empresas tenían ventaja estructural permanente',
    'Ciertos problemas operativos se aceptaban como "el costo de hacer negocios"',
    'Tu competencia tardaba semanas en resolver lo que vos tardabas semanas también',
  ],
  en: [
    'Custom development: months of waiting and budgets out of SMB reach',
    'Glass ceiling: large companies had a permanent structural advantage',
    'Certain operational problems were accepted as "the cost of doing business"',
    'Your competition took weeks to solve what you also took weeks to solve',
  ],
};

const AFTER = {
  es: [
    'MVPs funcionales operativos en horas, no en meses ni con grandes presupuestos',
    'Empresas ágiles superan en ejecución a estructuras mucho más grandes y burocráticas',
    'La eficiencia dejó de ser una ventaja competitiva: es el requisito mínimo para existir',
    'Tu competencia ya puede resolver en una tarde lo que antes llevaba semanas',
  ],
  en: [
    'Functional operational MVPs in hours, not months or large budgets',
    'Agile companies outperform much larger and more bureaucratic structures',
    'Efficiency is no longer a competitive advantage: it is the minimum requirement to exist',
    'Your competition can now solve in an afternoon what used to take weeks',
  ],
};

export default function ParadigmShift() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">
            {lang === 'es' ? 'El Cambio de Paradigma' : 'The Paradigm Shift'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100">
            {lang === 'es'
              ? 'Durante años, el desarrollo a medida era lento y prohibitivo.'
              : 'For years, custom development was slow and prohibitively expensive.'}
            <span className="block gradient-text mt-1">
              {lang === 'es' ? 'Ese techo se rompió.' : 'That ceiling is gone.'}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-base leading-relaxed">
            {lang === 'es'
              ? 'La combinación de GenAI con flujos de automatización avanzada permite resolver problemas estructurales con MVPs operativos en horas. No prototipos para mostrar en una reunión: soluciones funcionales que eliminan fricciones históricas en la operación diaria.'
              : 'The combination of GenAI with advanced automation flows allows solving structural problems with operational MVPs in hours. Not prototypes to show in a meeting: functional solutions that eliminate historical friction in daily operations.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ANTES */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={16} className="text-red-400" />
              </div>
              <span className="font-bold text-red-400 text-sm uppercase tracking-wide">
                {lang === 'es' ? 'Antes de GenAI' : 'Before GenAI'}
              </span>
            </div>
            <ul className="space-y-3">
              {BEFORE[lang].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                  <X size={14} className="text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* AHORA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check size={16} className="text-green-400" />
              </div>
              <span className="font-bold text-green-400 text-sm uppercase tracking-wide">
                {lang === 'es' ? 'Hoy con GenAI + Automatización' : 'Today with GenAI + Automation'}
              </span>
            </div>
            <ul className="space-y-3">
              {AFTER[lang].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                  <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Ventana de Oportunidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-3 bg-amber-500/10 border border-amber-400/30 rounded-2xl p-5"
        >
          <Hourglass size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-amber-400">
              {lang === 'es'
                ? 'La brecha con las grandes empresas se cerró'
                : 'The gap with large companies has closed'},
            </strong>
            {lang === 'es'
              ? ' pero la ventana de oportunidad para tomar ventaja también es corta. No subirse a esta ola ahora no es una decisión conservadora: es una garantía de quedar fuera del mercado en el corto o mediano plazo. '
              : ' but the window of opportunity to gain an advantage is also short. Not jumping on this wave now is not a conservative decision: it is a guarantee of falling out of the market in the short or medium term. '}
            <strong className="text-white">
              {lang === 'es' ? 'Nuestro foco es precisamente ese ramp-up.' : 'Our focus is precisely that ramp-up.'}
            </strong>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
