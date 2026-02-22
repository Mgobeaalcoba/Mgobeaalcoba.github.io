'use client';

import { motion } from 'framer-motion';
import { Gift, Check, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FreeOfferBannerProps {
  onOpenProposal?: () => void;
}

export default function FreeOfferBanner({ onOpenProposal }: FreeOfferBannerProps) {
  const { lang } = useLanguage();

  const BADGES = [
    { es: 'Sin tarjeta', en: 'No card required' },
    { es: 'Sin compromiso', en: 'No commitment' },
    { es: '2 semanas', en: '2 weeks' },
  ];

  return (
    <section id="how-it-works" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400/30 rounded-2xl p-6 md:p-10"
      >
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full mb-4">
            {lang === 'es' ? '🎁 OFERTA EXCLUSIVA PARA PYMES' : '🎁 EXCLUSIVE OFFER FOR SMBs'}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            {lang === 'es' ? 'Su Primera Automatización: 100% Gratis' : 'Your First Automation: 100% Free'}
          </h3>
          <p className="text-gray-400 mb-5 text-sm md:text-base max-w-xl mx-auto">
            {lang === 'es'
              ? 'Compruebe el valor antes de invertir. Automatización simple implementada en 1-2 semanas, 100% gratis.'
              : 'Prove the value before investing. Simple automation implemented in 1-2 weeks, 100% free.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-5 text-sm text-gray-400">
            {BADGES.map((b) => (
              <span key={b.es} className="flex items-center gap-1.5">
                <Check size={14} className="text-green-400" />
                {b[lang]}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 justify-center mb-6 text-xs text-amber-400 bg-amber-500/10 border border-amber-400/30 rounded-full px-4 py-2 max-w-sm mx-auto">
            <Clock size={14} />
            <span>
              {lang === 'es'
                ? 'La ventana de oportunidad es corta. Tu competencia ya lo está evaluando.'
                : 'The window of opportunity is short. Your competition is already evaluating it.'}
            </span>
          </div>

          <button
            onClick={onOpenProposal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Gift size={18} />
            {lang === 'es' ? 'Solicitar Mi Automatización Gratis Ahora' : 'Request My Free Automation Now'}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
