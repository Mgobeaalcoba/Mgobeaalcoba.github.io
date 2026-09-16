'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '@/lib/gtag';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;
    const track = () => {
      if (window.gtag && window.mgaAnalyticsReady) pageview(pathname);
      else if (++attempts < 12) timer = window.setTimeout(track, 250);
    };
    track();
    return () => { if (timer) window.clearTimeout(timer); };
  }, [pathname]);
  return null;
}
