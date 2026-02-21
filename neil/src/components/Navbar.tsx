'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import type { LangCode } from '@/types/content';
import { trackLanguageSwitch, trackCtaClick } from '@/lib/gtag';

const brand = ContentRepository.getBrand();
const flagsData = ContentRepository.getFlags();
const availableLangs = ContentRepository.getAvailableLangs();

const langLabels: Record<LangCode, string> = {
  es: 'ES', en: 'EN', it: 'IT', fr: 'FR', pt: 'PT', de: 'DE',
};

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLangChange = (newLang: LangCode) => {
    trackLanguageSwitch(lang, newLang);
    setLang(newLang);
    setLangOpen(false);
  };

  const navLinks = [
    { href: '#productos', label: t.nav.products },
    { href: '#nosotros', label: t.nav.about },
    { href: '#pre-enfriado', label: t.nav.preCooling },
    { href: '#europa', label: t.nav.europe },
    { href: '#contacto', label: t.nav.contact },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md border-b border-cyan-accent/10 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <img
              src={brand.logo}
              alt="Neil Climatizadores"
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-cyan-accent text-sm font-medium transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(12,193,193,0.6)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side: Language switcher + CTA + store */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-accent/30 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
                aria-label="Switch language"
              >
                <img
                  src={flagsData[lang]}
                  alt={lang}
                  className="w-5 h-4 object-cover rounded-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span>{langLabels[lang]}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-navy-800 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden"
                  >
                    {availableLangs.map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLangChange(l)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          l === lang
                            ? 'bg-cyan-accent/10 text-cyan-accent'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <img
                          src={flagsData[l]}
                          alt={l}
                          className="w-5 h-4 object-cover rounded-sm"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-medium">{langLabels[l]}</span>
                        <span className="text-slate-500 text-xs ml-auto">
                          {ContentRepository.getTranslation(l).lang}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Store link */}
            <a
              href={ContentRepository.getContact().store}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick('store_nav')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-neil/40 text-orange-neil hover:bg-orange-neil/10 transition-all duration-200 text-sm font-medium"
            >
              <ShoppingBag size={15} />
              {t.nav.store}
            </a>

            {/* CTA */}
            <a
              href="#contacto"
              onClick={() => trackCtaClick('cta_nav')}
              className="px-5 py-2.5 rounded-xl bg-cyan-accent text-navy-950 font-bold text-sm hover:bg-cyan-light transition-all duration-200 shadow-[0_0_15px_rgba(12,193,193,0.3)]"
            >
              {t.nav.cta}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-900/98 backdrop-blur-md border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 text-slate-300 hover:text-cyan-accent hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 space-y-3">
                {/* Mobile language switcher */}
                <div className="flex flex-wrap gap-2 px-2">
                  {availableLangs.map((l) => (
                    <button
                      key={l}
                      onClick={() => { handleLangChange(l); setMobileOpen(false); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        l === lang
                          ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/30'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:border-cyan-accent/30'
                      }`}
                    >
                      <img src={flagsData[l]} alt={l} className="w-4 h-3 object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
                <a
                  href="#contacto"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-3 px-4 bg-cyan-accent text-navy-950 font-bold rounded-xl text-sm"
                >
                  {t.nav.cta}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for lang dropdown */}
      {langOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setLangOpen(false)} />
      )}
    </motion.nav>
  );
}
