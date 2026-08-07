/**
 * El Portugués Supabase query functions — typed, read-only.
 * ep_config stores all site configuration as JSONB columns.
 * ep_history_timeline stores bilingual timeline entries.
 */
import { supabase } from '@/lib/supabase';
import type { SiteContent, EpTimelineEntry } from '@/types/content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EpConfig = Record<string, any>;

export async function fetchEpConfig(): Promise<EpConfig | null> {
  const { data, error } = await supabase
    .from('ep_config')
    .select('*')
    .single();

  if (error) {
    console.error('[EP] fetchEpConfig error:', error.message);
    return null;
  }

  // Merge all JSONB columns into a single config object (excluding internal id)
  const { id: _, ...rest } = data;
  return rest as EpConfig;
}

/**
 * Convert Supabase ep_config columns to the SiteContent shape.
 * Falls back to null if any field is missing.
 */
export function mapEpConfigToSiteContent(cfg: EpConfig | null): Partial<SiteContent> | null {
  if (!cfg) return null;
  return cfg as Partial<SiteContent>;
}

/**
 * Fetch the history timeline from the ep_history_timeline table.
 * Returns bilingual entries ordered by sort_order.
 */
export async function fetchEpHistoryTimeline(): Promise<EpTimelineEntry[]> {
  const { data, error } = await supabase
    .from('ep_history_timeline')
    .select('id, year, title_es, title_en, description_es, description_en, sort_order')
    .order('sort_order');

  if (error) {
    console.error('[EP] fetchEpHistoryTimeline error:', error.message);
    return [];
  }

  return (data ?? []).map((r) => ({
    id: r.id as number,
    year: r.year as string,
    title: {
      es: (r.title_es as string) ?? '',
      en: (r.title_en as string) ?? '',
    },
    description: {
      es: (r.description_es as string) ?? '',
      en: (r.description_en as string) ?? '',
    },
    sortOrder: r.sort_order as number,
  }));
}
