'use client';

import { motion } from 'framer-motion';
import { Award, Lightbulb, HeartHandshake, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const pillarIcons: LucideIcon[] = [Award, Lightbulb, HeartHandshake, Star];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-accent text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t.about.sectionLabel}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">{t.about.title}</h2>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{t.about.description}</p>
            <p className="text-slate-400 leading-relaxed mb-8">{t.about.description2}</p>

            {/* Patent badge */}
            <div className="inline-flex items-center gap-3 px-5 py-4 rounded-2xl border border-orange-neil/30 bg-orange-neil/10">
              <div className="w-10 h-10 rounded-xl bg-orange-neil/20 flex items-center justify-center flex-shrink-0">
                <Award className="text-orange-neil" size={20} />
              </div>
              <div>
                <p className="text-orange-neil font-bold text-sm">Patente AR-031005B1</p>
                <p className="text-slate-400 text-xs">Sistema de Pre-Enfriado — Tecnología exclusiva Neil</p>
              </div>
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/3] flex items-center justify-center relative">
              <img
                src="/neil-site/images/slim-full.png"
                alt="Neil Climatizadores"
                className="w-full h-full object-contain p-8"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-accent/5 to-transparent" />

              {/* Float badge */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-navy-950/90 border border-cyan-accent/30 backdrop-blur-sm"
              >
                <p className="text-cyan-accent font-black text-xl leading-none">30+</p>
                <p className="text-slate-400 text-xs">años</p>
              </motion.div>
            </div>

            {/* Quality policy card */}
            <div className="mt-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-cyan-accent font-semibold text-sm mb-1">{t.about.qualityPolicy}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{t.about.qualityDesc}</p>
            </div>
          </motion.div>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {t.about.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i] ?? Star as LucideIcon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-accent/20 hover:bg-white/8 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 flex items-center justify-center mb-4 group-hover:bg-cyan-accent/20 transition-colors">
                  <Icon className="text-cyan-accent" size={22} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{pillar.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
