'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentRepository } from '@/services/contentService';
import { events } from '@/lib/gtag';
import type { ConsultingPack } from '@/types/content';

function PackModal({ pack, onClose }: { pack: ConsultingPack; onClose: () => void }) {
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={20} />
          </button>

          {pack.badge && (
            <div className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-full mb-3">
              <Star size={10} />
              {pack.badge[lang]}
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-100 mb-1">{pack.name[lang]}</h3>
          <p className="text-sky-400 text-sm mb-2">{pack.subtitle[lang]}</p>
          <p className="text-gray-400 text-sm mb-4">{pack.description[lang]}</p>
          <p className="text-2xl font-black gradient-text mb-5">{pack.price[lang]}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-200 mb-2">Incluye:</h4>
            <ul className="space-y-2">
              {pack.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                  {f[lang]}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1">
              <Zap size={14} className="text-sky-400" /> Automations incluidas:
            </h4>
            <ul className="space-y-2">
              {pack.automations.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Zap size={12} className="text-sky-400 mt-0.5 shrink-0" />
                  {a[lang]}
                </li>
              ))}
            </ul>
          </div>

          <a
            href="https://calendly.com/gobeamariano/mga-consulting"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium transition-all text-sm"
          >
            Agenda tu diagnóstico gratuito →
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Services() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedPack, setSelectedPack] = useState<ConsultingPack | null>(null);
  const consulting = ContentRepository.getConsulting();

  return (
    <section id="servicios" data-section="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">{t('consulting_services_title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {consulting.packs.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              onClick={() => {
                setSelectedPack(pack);
                events.serviceView(pack.id);
              }}
              className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                pack.highlighted ? 'glow-border border-sky-500/40' : 'border border-white/10'
              }`}
            >
              {pack.highlighted && pack.badge && (
                <div className="inline-flex items-center gap-1 bg-sky-500 text-white text-xs px-2 py-1 rounded-full mb-3">
                  <Star size={10} />
                  {pack.badge[lang]}
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-100 mb-1">{pack.name[lang]}</h3>
              <p className="text-sky-400 text-sm mb-3">{pack.subtitle[lang]}</p>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{pack.description[lang]}</p>
              <p className="text-2xl font-black gradient-text mb-5">{pack.price[lang]}</p>

              <ul className="space-y-2 mb-5">
                {pack.features.slice(0, 3).map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                    <Check size={12} className="text-green-400 mt-0.5 shrink-0" />
                    {f[lang]}
                  </li>
                ))}
                {pack.features.length > 3 && (
                  <li className="text-xs text-sky-400">+ {pack.features.length - 3} más incluidos →</li>
                )}
              </ul>

              <div className="text-xs text-sky-400 text-center mt-auto font-medium">
                Ver detalles →
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedPack && <PackModal pack={selectedPack} onClose={() => setSelectedPack(null)} />}
    </section>
  );
}
