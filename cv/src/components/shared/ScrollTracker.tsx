'use client';

import { useEffect, useRef } from 'react';
import { events } from '@/lib/gtag';

export default function ScrollTracker() {
  const reported = useRef(new Set<number>());

  useEffect(() => {
    const THRESHOLDS = [25, 50, 75, 90, 100];

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      THRESHOLDS.forEach((threshold) => {
        if (percent >= threshold && !reported.current.has(threshold)) {
          reported.current.add(threshold);
          events.scrollDepth(threshold);
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section view tracking via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const name = entry.target.getAttribute('data-section') || '';
            events.sectionView(name);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return null;
}
