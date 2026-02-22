'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { events } from '@/lib/gtag';
import { useLanguage } from '@/contexts/LanguageContext';

const CALENDLY_URL = 'https://calendly.com/mariano-gobea-mercadolibre/30min';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

interface FloatingCTAProps {
  labelKey: string;
  site_section: string;
}

export default function FloatingCTA({ labelKey, site_section }: FloatingCTAProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Show button after user scrolls 200px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    events.calendlyClick(site_section);
    events.floatingCtaClick(site_section);
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-6 right-4 z-40"
        >
          {/* Outer pulsing glow ring */}
          <span className="absolute inset-0 rounded-2xl bg-sky-400/30 blur-md animate-pulse pointer-events-none" />

          <button
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={t(labelKey)}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl font-semibold text-sm text-white
              bg-gradient-to-br from-sky-500 via-blue-500 to-violet-600
              shadow-[0_0_24px_rgba(14,165,233,0.55)]
              hover:shadow-[0_0_40px_rgba(14,165,233,0.75)]
              active:scale-95 transition-all duration-200 border border-white/20"
          >
            {/* Animated icon */}
            <motion.span
              animate={hovered
                ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1.15, 1.1, 1.05, 1] }
                : { y: [0, -3, 0], scale: [1, 1.05, 1] }
              }
              transition={hovered
                ? { duration: 0.5, ease: 'easeInOut' }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="flex items-center justify-center"
            >
              <Calendar size={16} className="shrink-0" />
            </motion.span>

            <span>{t(labelKey)}</span>

            {/* Sparkle badge */}
            <motion.span
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-yellow-300"
            >
              <Sparkles size={12} />
            </motion.span>

            {/* Inner shimmer sweep */}
            <motion.span
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none overflow-hidden"
              style={{ transform: 'skewX(-15deg)' }}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
