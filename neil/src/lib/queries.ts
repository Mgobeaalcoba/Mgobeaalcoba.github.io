/**
 * Neil Supabase query functions — typed, read-only.
 * neil_config stores main config as JSONB.
 * neil_product_categories / neil_product_models store structured product data.
 * neil_translations stores all i18n key-value pairs.
 */
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NeilConfig = Record<string, any>;
export type NeilTranslations = Record<string, Record<string, string>>;

export interface NeilProductModel {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  badge?: string;
  specs?: Record<string, string>;
  sortOrder: number;
}

export interface NeilProductCategory {
  id: string;
  icon: string;
  sortOrder: number;
  models: NeilProductModel[];
}

export async function fetchNeilConfig(): Promise<NeilConfig> {
  const { data, error } = await supabase.from('neil_config').select('*').single();
  if (error) throw error;
  // Merge all JSONB columns into a single config object
  const { id: _, ...rest } = data;
  return rest as NeilConfig;
}

export async function fetchNeilProducts(): Promise<NeilProductCategory[]> {
  const [{ data: cats, error: e1 }, { data: models, error: e2 }] = await Promise.all([
    supabase.from('neil_product_categories').select('*').order('sort_order'),
    supabase.from('neil_product_models').select('*').order('sort_order'),
  ]);
  if (e1 || e2) throw e1 ?? e2;

  const modelsByCategory = new Map<string, NeilProductModel[]>();
  for (const m of models ?? []) {
    if (!modelsByCategory.has(m.category_id)) modelsByCategory.set(m.category_id, []);
    modelsByCategory.get(m.category_id)!.push({
      id: m.id,
      categoryId: m.category_id,
      name: m.name,
      description: m.description,
      image: m.image,
      features: m.features ?? [],
      badge: m.badge ?? undefined,
      specs: m.specs ?? undefined,
      sortOrder: m.sort_order,
    });
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    icon: c.icon ?? '',
    sortOrder: c.sort_order,
    models: modelsByCategory.get(c.id) ?? [],
  }));
}

export async function fetchNeilTranslations(): Promise<NeilTranslations> {
  const { data, error } = await supabase
    .from('neil_translations')
    .select('lang, key, value')
    .order('id');
  if (error) throw error;

  const result: NeilTranslations = {};
  for (const row of data ?? []) {
    if (!result[row.lang]) result[row.lang] = {};
    result[row.lang][row.key] = row.value;
  }
  return result;
}
