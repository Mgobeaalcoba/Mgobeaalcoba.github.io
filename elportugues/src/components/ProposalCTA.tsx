'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { trackProposalCtaClick } from '@/lib/gtag';

export default function ProposalCTA() {
  const [visible, setVisible] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // Show after 4 seconds, hide once user passes the proposal section
    const timer = setTimeout(() => setVisible(true), 4000);

    const onScroll = () => {
      const el = document.getElementById('propuesta');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Hide once the section is visible on screen
      if (rect.top < window.innerHeight * 0.5) {
        setPassed(true);
      } else {
        setPassed(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleClick = () => {
    trackProposalCtaClick();
    document.getElementById('propuesta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && !passed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={handleClick}
            className="proposal-cta-btn relative flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl font-black text-sm text-white shadow-2xl overflow-hidden"
            aria-label="Ver propuesta de valor"
          >
            {/* Animated gradient background */}
            <span className="proposal-cta-bg absolute inset-0 rounded-2xl" aria-hidden="true" />

            {/* Outer glow ring */}
            <span className="proposal-cta-ring absolute inset-[-3px] rounded-[18px]" aria-hidden="true" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              <TrendingUp size={16} className="flex-shrink-0" />
              <span className="leading-tight text-left">
                Ver<br />Propuesta
              </span>
            </span>
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <span className="text-white/70 text-xs font-normal">de valor</span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown size={14} className="text-white/80" />
              </motion.div>
            </span>

            {/* Pulse rings */}
            <span className="proposal-pulse absolute inset-0 rounded-2xl" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
