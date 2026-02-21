'use client';

import { useEffect } from 'react';
import { trackSectionView } from '@/lib/gtag';

const SECTIONS = ['inicio', 'productos', 'nosotros', 'pre-enfriado', 'europa', 'contacto', 'propuesta'];

export default function ScrollTracker() {
  useEffect(() => {
    const tracked = new Set<string>();
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !tracked.has(id)) {
            tracked.add(id);
            trackSectionView(id);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return null;
}
