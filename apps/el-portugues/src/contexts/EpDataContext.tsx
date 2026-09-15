'use client';

/**
 * EpDataContext — fetches El Portugués site data from Supabase once on mount.
 * Local content.json is used as the default for SSR/static prerendering.
 * Supabase data overrides it on the client once fetched.
 * Components use useEpData() to access site content.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchEpConfig, fetchEpHistoryTimeline } from '@/lib/queries';
import type { SiteContent, EpTimelineEntry } from '@/types/content';
import { trackAppError, events } from '@/lib/gtag';
import { durationBand } from '@/components/PerformanceTracker';
import localContent from '@/data/content.json';

interface EpData {
  content: SiteContent;
  timeline: EpTimelineEntry[];
  loading: boolean;
  error: Error | null;
}

const INITIAL: EpData = {
  content: localContent as unknown as SiteContent,
  timeline: [],
  loading: false,
  error: null,
};

const EpDataContext = createContext<EpData>(INITIAL);

export function EpDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EpData>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const startedAt = Date.now();
      try {
        const [cfg, timeline] = await Promise.all([
          fetchEpConfig(),
          fetchEpHistoryTimeline(),
        ]);

        if (!cancelled) {
          events.dataWait('ep_content', 'success', durationBand(Date.now() - startedAt), 1);
          const merged = cfg
            ? ({ ...INITIAL.content, ...cfg } as SiteContent)
            : INITIAL.content;

          setData({
            content: merged,
            timeline,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          events.dataWait('ep_content', 'error', durationBand(Date.now() - startedAt), 1);
          trackAppError('ep_data', 'load', 'data_load_failed', true);
          setData((prev) => ({ ...prev, loading: false, error: err as Error }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return <EpDataContext.Provider value={data}>{children}</EpDataContext.Provider>;
}

export function useEpData(): EpData {
  return useContext(EpDataContext);
}
