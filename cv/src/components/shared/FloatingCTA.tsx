'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { events } from '@/lib/gtag';

const CALENDLY_URL = 'https://calendly.com/mariano-gobea-mercadolibre/30min';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

interface FloatingCTAProps {
  label: string;
  site_section: string;
}

export default function FloatingCTA({ label, site_section }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);

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
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          className="fixed bottom-6 left-4 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm text-white shadow-lg shadow-sky-500/30 bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all"
          aria-label={label}
        >
          <Calendar size={16} className="shrink-0" />
          <span>{label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
