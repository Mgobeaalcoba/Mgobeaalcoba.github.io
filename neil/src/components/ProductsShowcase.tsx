'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Snowflake, Flame, Zap, Settings, ExternalLink, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import { trackProductView, trackCtaClick } from '@/lib/gtag';

const iconMap: Record<string, LucideIcon> = {
  Wind: Wind as LucideIcon,
  Snowflake: Snowflake as LucideIcon,
  Flame: Flame as LucideIcon,
  Zap: Zap as LucideIcon,
  Settings: Settings as LucideIcon,
};

const categories = ContentRepository.getProductCategories();

export default function ProductsShowcase() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const activeCat = categories.find(c => c.id === activeCategory) ?? categories[0];
  const catTranslation = t.products.categories[activeCategory];

  return (
    <section id="productos" className="py-20 lg:py-28 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cyan-accent text-sm font-semibold tracking-widest uppercase mb-3 block">
            {t.products.sectionLabel}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">{t.products.title}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.products.subtitle}</p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Settings as LucideIcon;
            const catT = t.products.categories[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  trackProductView(catT?.title ?? cat.id, cat.id);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-cyan-accent text-navy-950 shadow-[0_0_20px_rgba(12,193,193,0.4)]'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:border-cyan-accent/30 hover:text-cyan-accent'
                }`}
              >
                <Icon size={16} />
                {catT?.title ?? cat.id}
              </button>
            );
          })}
        </motion.div>

        {/* Category content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Info panel */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  {catTranslation?.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-neil/15 text-orange-neil border border-orange-neil/30">
                      {catTranslation.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-2">
                  {catTranslation?.title}
                </h3>
                <p className="text-cyan-accent font-semibold mb-4">
                  {catTranslation?.subtitle}
                </p>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  {catTranslation?.description}
                </p>
                <a
                  href={activeCat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCtaClick(`view_product_${activeCategory}`)}
                  className="inline-flex items-center gap-2 text-cyan-accent hover:text-cyan-light font-semibold transition-colors group w-fit"
                >
                  {t.products.viewMore}
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Category main image */}
              <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
                <img
                  src={activeCat.image}
                  alt={catTranslation?.title ?? activeCategory}
                  className="w-full h-full object-contain p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
              </div>
            </div>

            {/* Models grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {activeCat.models.map((model, i) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-accent/30 p-4 cursor-pointer transition-all duration-200 hover:bg-white/8 hover:shadow-[0_0_20px_rgba(12,193,193,0.08)]"
                  onClick={() => trackProductView(model.name, activeCategory)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-navy-800 mb-3 flex items-center justify-center">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-white text-sm font-semibold leading-tight">{model.name}</p>
                    {model.badge === 'new' && (
                      <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-neil/20 text-orange-neil border border-orange-neil/30">
                        {t.products.newBadge}
                      </span>
                    )}
                  </div>
                  {model.specs.voltage && (
                    <p className="text-slate-500 text-xs mt-1">{model.specs.voltage}</p>
                  )}
                  <ChevronRight size={14} className="text-cyan-accent mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
