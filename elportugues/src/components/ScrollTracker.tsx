'use client';

import { useEffect } from 'react';
import { trackScrollDepth } from '@/lib/gtag';

export default function ScrollTracker() {
  useEffect(() => {
    const tracked = new Set<number>();
    const thresholds = [25, 50, 75, 90, 100];

    const onScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      for (const threshold of thresholds) {
        if (scrolled >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
