/**
 * El Portugués Supabase query functions — typed, read-only.
 * ep_config stores all site configuration as JSONB columns.
 */
import { supabase } from '@/lib/supabase';
import type { SiteContent } from '@/types/content';

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
