'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import { trackCtaClick, trackScrollDepth } from '@/lib/gtag';

const hero = ContentRepository.getHero();

export default function Hero() {
  const { t } = useLanguage();
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIdx(prev => (prev + 1) % hero.backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 90, 100].forEach(p => { if (pct >= p) trackScrollDepth(p); });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const statLabels: Record<string, string> = {
    'hero.statYears': t.hero.statYears,
    'hero.statDealers': t.hero.statDealers,
    'hero.statCategories': t.hero.statCategories,
    'hero.statLanguages': t.hero.statLanguages,
  };

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 z-0" />

        {/* Rotating hero images (crossfade) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIdx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 z-10"
          >
            <img
              src={hero.backgroundImages[bgIdx]}
              alt=""
              className="w-full h-full object-cover object-center"
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 z-20 bg-navy-950/65" />

        {/* Grid decoration */}
        <div className="absolute inset-0 z-30 bg-[linear-gradient(rgba(12,193,193,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(12,193,193,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Side + bottom gradient overlays */}
        <div className="absolute inset-0 z-30 bg-gradient-to-r from-navy-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 z-30 bg-gradient-to-t from-navy-950 to-transparent" />

        {/* Cyan glow */}
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] z-10 bg-cyan-accent/5 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] z-10 bg-orange-neil/5 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-accent/30 bg-cyan-accent/10 text-cyan-accent text-sm font-medium mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
            Neil Climatizadores · Patente AR-031005B1
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight mb-6"
          >
            <span className="text-white block">{t.hero.headline}</span>
            <span className="block bg-gradient-to-r from-cyan-accent via-cyan-light to-blue-royal bg-clip-text text-transparent">
              {t.hero.highlight}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl"
          >
            {t.hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a
              href="#productos"
              onClick={() => trackCtaClick('hero_primary')}
              className="px-8 py-4 rounded-2xl bg-cyan-accent text-navy-950 font-bold text-base hover:bg-cyan-light transition-all duration-200 shadow-[0_0_30px_rgba(12,193,193,0.4)] hover:shadow-[0_0_50px_rgba(12,193,193,0.6)] transform hover:-translate-y-0.5"
            >
              {t.hero.cta}
            </a>
            <a
              href="#contacto"
              onClick={() => trackCtaClick('hero_secondary')}
              className="px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold text-base hover:bg-white/5 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {hero.stats.map((stat) => (
              <div
                key={stat.labelKey}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-accent/20 transition-colors group"
              >
                <div className="text-3xl font-black text-cyan-accent mb-1 group-hover:drop-shadow-[0_0_12px_rgba(12,193,193,0.8)] transition-all">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 leading-tight">
                  {statLabels[stat.labelKey] ?? stat.labelKey}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
