'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import IntroLoader from './IntroLoader';
import { AIAssistant } from '@/components/ui/AIAssistant';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const seen = sessionStorage.getItem('intro-seen');
    if (seen) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro-seen', '1');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <AIAssistant />
    </>
  );
}
