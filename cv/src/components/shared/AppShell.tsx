'use client';

import { useState, useEffect } from 'react';
import IntroLoader from './IntroLoader';
import { AIAssistant } from '@/components/ui/AIAssistant';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Show intro once per session (not on every page navigation)
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
      {children}
      <AIAssistant />
    </>
  );
}
