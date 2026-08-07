'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { trackProposalCtaClick } from '@/lib/gtag';

export default function ProposalCTA() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sectionRef = useRef<Element | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const section = document.getElementById('propuesta');
    if (!section) return;
    sectionRef.current = section;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    trackProposalCtaClick();
    document.getElementById('propuesta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={handleClick}
            className="proposal-cta-btn relative flex items-center gap-2 px-5 py-4 rounded-2xl text-white font-bold text-sm shadow-2xl"
            aria-label="Ver propuesta de valor"
          >
            <div className="proposal-cta-bg absolute inset-0 rounded-2xl" />
            <div className="proposal-cta-ring absolute inset-0 rounded-2xl" />
            <div className="proposal-pulse absolute inset-0 rounded-2xl" />
            <Sparkles size={18} className="relative z-10 animate-bounce" />
            <span className="relative z-10">Ver Propuesta</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
