'use client';

import { useState, useEffect } from 'react';
import IntroLoader from './IntroLoader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Show intro once per session (not on every page navigation)
    const seen = sessionStorage.getItem('intro-seen');
    if (!seen) {
      setShowIntro(true);
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
    </>
  );
}
