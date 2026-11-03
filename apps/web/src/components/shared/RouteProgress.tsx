'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Thin progress bar that starts when an internal link is clicked and finishes when the route changes. */
export default function RouteProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    const start = () => {
      window.clearTimeout(timer.current);
      el.className = 'signal-route-progress is-running';
      // Safety net: never leave the bar hanging if the navigation is cancelled.
      timer.current = window.setTimeout(() => (el.className = 'signal-route-progress'), 8000);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    window.clearTimeout(timer.current);
    if (el.classList.contains('is-running')) {
      el.className = 'signal-route-progress is-done';
      timer.current = window.setTimeout(() => (el.className = 'signal-route-progress'), 500);
    }
  }, [pathname]);

  return <div ref={bar} className="signal-route-progress" aria-hidden="true" />;
}
