'use client';

/**
 * EpDataContext — fetches El Portugués site data from Supabase once on mount.
 * Local content.json is used as the default for SSR/static prerendering.
 * Supabase data overrides it on the client once fetched.
 * Components use useEpData() to access site content.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchEpConfig } from '@/lib/queries';
import type { SiteContent } from '@/types/content';
import localContent from '@/data/content.json';

interface EpData {
  content: SiteContent;
  loading: boolean;
  error: Error | null;
}

const INITIAL: EpData = {
  content: localContent as unknown as SiteContent,
  loading: false,
  error: null,
};

const EpDataContext = createContext<EpData>(INITIAL);

export function EpDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EpData>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const cfg = await fetchEpConfig();
        if (!cancelled && cfg) {
          // Merge Supabase config over local content
          const merged = { ...INITIAL.content, ...cfg } as SiteContent;
          setData({ content: merged, loading: false, error: null });
        } else if (!cancelled) {
          setData((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[EP] context fetch failed:', err);
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
