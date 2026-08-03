'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { events, pageview } from '@/lib/gtag';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;
    const track = () => {
      if (window.gtag) {
        pageview(`${pathname}${window.location.search}`);
        return;
      }
      attempts += 1;
      if (attempts < 12) timer = window.setTimeout(track, 250);
    };
    track();
    return () => { if (timer) window.clearTimeout(timer); };
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('mga_pwa_launch_tracked') === 'true') return;
    sessionStorage.setItem('mga_pwa_launch_tracked', 'true');
    events.pwaLaunch();
  }, []);

  return null;
}
