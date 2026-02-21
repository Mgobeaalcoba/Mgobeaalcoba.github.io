'use client';

import { motion } from 'framer-motion';
import { Thermometer, Volume2, Battery, Droplets, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import { trackCtaClick } from '@/lib/gtag';

const preCooling = ContentRepository.getPreCooling();

const featureIcons: LucideIcon[] = [Thermometer, Volume2, Battery, Droplets];

export default function PreCoolingFeature() {
  const { t } = useLanguage();

  return (
    <section id="pre-enfriado" className="py-20 lg:py-28 bg-navy-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-accent text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t.preCooling.sectionLabel}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-3">{t.preCooling.title}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-neil/10 border border-orange-neil/30 text-orange-neil text-sm font-bold">
            🏆 {t.preCooling.highlight}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto">
              {/* Glow border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-accent/20 via-transparent to-blue-royal/20 p-[1px]">
                <div className="w-full h-full rounded-3xl bg-navy-800 flex items-center justify-center p-8">
                  <img
                    src={preCooling.image}
                    alt="Pre-Cooling System"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="absolute inset-[1px] rounded-3xl bg-navy-800 flex items-center justify-center p-8">
                <img
                  src={preCooling.image}
                  alt="Pre-Cooling System"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Floating patent badge */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-4 -right-4 lg:right-0 p-4 rounded-2xl bg-navy-900 border border-cyan-accent/30 shadow-xl shadow-black/50"
            >
              <p className="text-xs text-slate-400 mb-1">Patente oficial</p>
              <p className="text-cyan-accent font-black text-sm">AR-031005B1</p>
              <p className="text-xs text-slate-500">© Neil Climatizadores</p>
            </motion.div>
          </motion.div>

          {/* Right: features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-slate-300 text-lg leading-relaxed mb-4">{t.preCooling.description}</p>
            <p className="text-slate-400 leading-relaxed mb-10">{t.preCooling.description2}</p>

            <div className="space-y-4 mb-8">
              {t.preCooling.features.map((feature, i) => {
                const Icon = featureIcons[i] ?? Thermometer as LucideIcon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-accent/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-cyan-accent" size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-0.5">{feature.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <a
              href="#productos"
              onClick={() => trackCtaClick('precooling_cta')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-accent text-navy-950 font-bold hover:bg-cyan-light transition-all duration-200 shadow-[0_0_20px_rgba(12,193,193,0.3)]"
            >
              {t.preCooling.cta}
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
