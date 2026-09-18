'use client';

import { useEffect, useRef } from 'react';
import { events } from '@/lib/gtag';

/**
 * Waits, attention and technical health.
 *
 * Answers the questions the funnel events cannot: how long did people wait, did
 * the page feel slow, how much of the visit was real attention, and did the
 * runtime break. Everything is banded so cardinality stays low and no personal
 * data is involved.
 */

const VITALS_THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  FCP: [1800, 3000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TTFB: [800, 1800],
};

function rate(metric: string, value: number): 'good' | 'needs_improvement' | 'poor' {
  const [good, needsImprovement] = VITALS_THRESHOLDS[metric] ?? [0, 0];
  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs_improvement';
  return 'poor';
}

export function durationBand(ms: number): string {
  if (ms < 250) return 'under_250ms';
  if (ms < 1000) return '250ms_1s';
  if (ms < 3000) return '1s_3s';
  if (ms < 6000) return '3s_6s';
  if (ms < 15000) return '6s_15s';
  return 'over_15s';
}

export function secondsBand(seconds: number): string {
  if (seconds < 10) return 'under_10s';
  if (seconds < 30) return '10s_30s';
  if (seconds < 60) return '30s_60s';
  if (seconds < 180) return '1m_3m';
  if (seconds < 600) return '3m_10m';
  return 'over_10m';
}

export default function PerformanceTracker() {
  const visibleMs = useRef(0);
  const visibleSince = useRef<number | null>(null);
  const hiddenCount = useRef(0);
  const longTasks = useRef({ count: 0, total: 0 });
  const metrics = useRef(new Map<string, number>());
  const reported = useRef(new Set<string>());
  const blockedTimeReported = useRef(false);

  useEffect(() => {
    visibleSince.current = Date.now();

    const report = (name: string, value: number) => {
      if (reported.current.has(name)) return;
      reported.current.add(name);
      events.webVitals(name, Math.round(value), rate(name, value));
    };

    // ── Core Web Vitals ──────────────────────────────────────────
    const observers: PerformanceObserver[] = [];
    const observe = (type: string, handler: (entry: PerformanceEntry) => void) => {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(handler);
        });
        observer.observe({ type, buffered: true } as PerformanceObserverInit);
        observers.push(observer);
      } catch {
        // Unsupported entry type in this browser: coverage degrades, nothing breaks.
      }
    };

    let cls = 0;
    let lcp = 0;
    let inp = 0;

    observe('largest-contentful-paint', (entry) => {
      lcp = entry.startTime;
      metrics.current.set('LCP', lcp);
    });

    observe('layout-shift', (entry) => {
      const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
      if (shift.hadRecentInput) return;
      cls += shift.value ?? 0;
      metrics.current.set('CLS', cls);
    });

    observe('event', (entry) => {
      const interaction = entry as PerformanceEntry & { duration?: number; interactionId?: number };
      if (!interaction.interactionId) return;
      inp = Math.max(inp, interaction.duration ?? 0);
      metrics.current.set('INP', inp);
    });

    observe('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') report('FCP', entry.startTime);
    });

    observe('longtask', (entry) => {
      longTasks.current.count += 1;
      longTasks.current.total += entry.duration;
    });

    observe('navigation', (entry) => {
      const navigation = entry as PerformanceNavigationTiming;
      report('TTFB', navigation.responseStart);
      events.pageLoadTiming(
        document.readyState,
        durationBand(navigation.domContentLoadedEventEnd),
        durationBand(navigation.loadEventEnd || navigation.duration),
      );
    });

    // ── Attention: visible time vs background time ───────────────
    const flushVisibility = (state: 'visible' | 'hidden') => {
      if (visibleSince.current !== null) {
        visibleMs.current += Date.now() - visibleSince.current;
      }
      visibleSince.current = state === 'visible' ? Date.now() : null;
      events.pageVisibility(state, secondsBand(visibleMs.current / 1000), hiddenCount.current);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenCount.current += 1;
        flushVisibility('hidden');
        // Final values are only meaningful once the page is leaving.
        ['LCP', 'CLS', 'INP'].forEach((name) => {
          const value = metrics.current.get(name);
          if (value !== undefined) report(name, value);
        });
        if (!blockedTimeReported.current) {
          blockedTimeReported.current = true;
          events.mainThreadBlocking(longTasks.current.count, durationBand(longTasks.current.total));
        }
        return;
      }
      flushVisibility('visible');
    };

    // ── Runtime health ───────────────────────────────────────────
    const onError = (rawEvent: Event) => {
      const errorEvent = rawEvent as ErrorEvent;
      const target = rawEvent.target;
      if (target instanceof Element && target !== (window as unknown as Element)) {
        const tag = target.tagName.toLowerCase();
        const resourceType = tag === 'img'
          ? 'image'
          : tag === 'script'
            ? 'script'
            : tag === 'link'
              ? 'stylesheet'
              : tag === 'video' || tag === 'audio'
                ? 'media'
                : 'other';
        events.resourceError(resourceType, tag);
        return;
      }
      // Only the error class is sent, never its message or stack.
      events.scriptError(errorEvent.error?.name ?? 'Error', 'window', 'cv');
    };

    const onUnhandledRejection = (rawEvent: PromiseRejectionEvent) => {
      const reason = rawEvent.reason as { name?: string } | undefined;
      events.scriptError(reason?.name ?? 'UnhandledRejection', 'promise', 'cv');
    };

    // ── Network ──────────────────────────────────────────────────
    const onOnline = () => events.networkStatus('online');
    const onOffline = () => events.networkStatus('offline');

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
