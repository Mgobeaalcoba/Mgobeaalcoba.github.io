'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import { trackEuropeSectionView, trackCtaClick } from '@/lib/gtag';

const europe = ContentRepository.getEurope();
const flags = ContentRepository.getFlags();

const europeFlagMap: Record<string, string> = {
  es: flags.es,
  en: flags.en,
  it: flags.it,
  fr: flags.fr,
  pt: flags.pt,
  de: flags.de,
};

export default function EuropeSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg] = useState(0);
  const tracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          trackEuropeSectionView();
          tracked.current = true;
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImg(prev => (prev + 1) % europe.galleryImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const countryFlagKeys = ['es', 'en', 'it', 'fr', 'pt', 'de'] as const;

  return (
    <section id="europa" ref={ref} className="py-20 lg:py-28 bg-navy-900">
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
            {t.europe.sectionLabel}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">{t.europe.title}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.europe.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Gallery — takes 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {/* Main active image */}
            <div className="relative rounded-3xl overflow-hidden aspect-video mb-3 bg-navy-800">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src={europe.galleryImages[activeImg]}
                alt="Neil en Europa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Globe className="text-cyan-accent" size={18} />
                <span className="text-white font-semibold text-sm">Neil Europe</span>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-5 gap-2">
              {europe.galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg ? 'border-cyan-accent shadow-[0_0_10px_rgba(12,193,193,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info panel — takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-slate-300 leading-relaxed">{t.europe.description2}</p>

            {/* Countries with flags */}
            <div>
              <p className="text-cyan-accent font-semibold text-sm mb-4 uppercase tracking-wide">
                {t.europe.dealersTitle}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {t.europe.countries.map((country, i) => (
                  <div
                    key={country}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <img
                      src={europeFlagMap[countryFlagKeys[i]] ?? ''}
                      alt={country}
                      className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className="text-slate-300 text-sm font-medium">{country}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={europe.dealerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick('europe_dealers')}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl border border-cyan-accent/40 text-cyan-accent hover:bg-cyan-accent/10 transition-all font-semibold text-sm"
            >
              {t.europe.cta}
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
