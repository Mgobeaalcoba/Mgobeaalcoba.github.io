'use client';

import { useEffect } from 'react';
import { trackScrollDepth, trackSectionView, trackProposalView } from '@/lib/gtag';

const SECTIONS = [
  { id: 'nosotros', label: 'About' },
  { id: 'servicios', label: 'Services' },
  { id: 'historia', label: 'History' },
  { id: 'contacto', label: 'Contact' },
  { id: 'propuesta', label: 'SalesProposal' },
];

export default function ScrollTracker() {
  useEffect(() => {
    // Scroll depth tracking
    const depthTracked = new Set<number>();
    const thresholds = [25, 50, 75, 90, 100];

    const onScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      for (const t of thresholds) {
        if (scrolled >= t && !depthTracked.has(t)) {
          depthTracked.add(t);
          trackScrollDepth(t);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Section view tracking via IntersectionObserver
    const sectionObserved = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !sectionObserved.has(entry.target.id)) {
            sectionObserved.add(entry.target.id);
            const section = SECTIONS.find((s) => s.id === entry.target.id);
            if (section) {
              if (section.id === 'propuesta') {
                trackProposalView();
              } else {
                trackSectionView(section.label);
              }
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
