'use client';

/**
 * RecursosDataContext
 *
 * Fetches calculator-specific data from Supabase only when the /recursos route
 * is mounted. Keeps this data out of the global SupabaseDataContext so pages
 * like the CV homepage don't load tax brackets, AI models, or plazo fijo rates
 * unnecessarily.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchTaxData, fetchAiModels, fetchPlazoFijoRates } from '@/lib/queries/calculatorQueries';
import type { TaxParams, TaxScenario, TaxTab, AiModel } from '@/lib/queries/calculatorQueries';

export type { TaxParams, TaxScenario, TaxTab, AiModel };

interface RecursosData {
  taxParams: TaxParams | null;
  taxScenarios: TaxScenario[];
  taxTabs: TaxTab[];
  aiModels: AiModel[];
  plazoFijoRates: Record<string, number>;
  loading: boolean;
  error: Error | null;
}

const EMPTY: RecursosData = {
  taxParams: null,
  taxScenarios: [],
  taxTabs: [],
  aiModels: [],
  plazoFijoRates: {},
  loading: true,
  error: null,
};

const RecursosDataContext = createContext<RecursosData>(EMPTY);

export function RecursosDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RecursosData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [taxData, aiModels, plazoFijoRates] = await Promise.all([
          fetchTaxData(),
          fetchAiModels(),
          fetchPlazoFijoRates(),
        ]);

        if (!cancelled) {
          setData({
            taxParams: taxData.params,
            taxScenarios: taxData.scenarios,
            taxTabs: taxData.tabs,
            aiModels,
            plazoFijoRates,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[RecursosData] fetch failed:', err);
          setData((prev) => ({ ...prev, loading: false, error: err as Error }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return <RecursosDataContext.Provider value={data}>{children}</RecursosDataContext.Provider>;
}

export function useRecursosData(): RecursosData {
  return useContext(RecursosDataContext);
}
