'use client';

/**
 * NeilDataContext — fetches all Neil site data from Supabase once on mount.
 * Local JSON files are used as defaults for SSR/static prerendering.
 * Supabase data overrides them on the client once fetched.
 * Components use useNeilData() to access config, products, and translations.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchNeilProducts } from '@/lib/queries';
import type { NeilConfig, NeilProductCategory, NeilTranslations } from '@/lib/queries';
import esTranslations from '@/data/translations/es.json';
import enTranslations from '@/data/translations/en.json';
import itTranslations from '@/data/translations/it.json';
import frTranslations from '@/data/translations/fr.json';
import ptTranslations from '@/data/translations/pt.json';
import deTranslations from '@/data/translations/de.json';
import contentData from '@/data/content.json';

interface NeilData {
  config: NeilConfig | null;
  products: NeilProductCategory[];
  translations: NeilTranslations;
  loading: boolean;
  error: Error | null;
}

const LOCAL_TRANSLATIONS: NeilTranslations = {
  es: esTranslations as unknown as Record<string, string>,
  en: enTranslations as unknown as Record<string, string>,
  it: itTranslations as unknown as Record<string, string>,
  fr: frTranslations as unknown as Record<string, string>,
  pt: ptTranslations as unknown as Record<string, string>,
  de: deTranslations as unknown as Record<string, string>,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LOCAL_CONFIG = (contentData as any) as NeilConfig;

const INITIAL: NeilData = {
  config: LOCAL_CONFIG,
  products: [],
  translations: LOCAL_TRANSLATIONS,
  loading: false,
  error: null,
};

const NeilDataContext = createContext<NeilData>(INITIAL);

export function NeilDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<NeilData>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Only fetch products from Supabase. Config and translations come from
        // local JSON files which have the correct camelCase structure with proper
        // arrays. The Supabase neil_config uses snake_case column names
        // (pre_cooling, sales_proposal) which would conflict with component
        // expectations built on the camelCase content.json format.
        const products = await fetchNeilProducts();
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            products,
            loading: false,
            error: null,
          }));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[NeilData] fetch failed:', err);
          setData((prev) => ({ ...prev, loading: false, error: err as Error }));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return <NeilDataContext.Provider value={data}>{children}</NeilDataContext.Provider>;
}

export function useNeilData(): NeilData {
  return useContext(NeilDataContext);
}
