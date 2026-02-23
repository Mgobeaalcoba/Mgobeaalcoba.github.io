/**
 * Neil Supabase query functions — typed, read-only.
 * neil_config stores main config as JSONB.
 * neil_product_categories / neil_product_models store structured product data.
 * neil_translations stores all i18n key-value pairs.
 */
import { supabase } from '@/lib/supabase';
import contentData from '@/data/content.json';

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
  image: string;
  sortOrder: number;
  models: NeilProductModel[];
}

// Category images from local content.json (neil_product_categories table lacks image column)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_IMAGES: Map<string, string> = new Map(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((contentData as any).products?.categories ?? []).map((c: any) => [c.id, c.image ?? ''])
);

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
    image: c.image ?? CATEGORY_IMAGES.get(c.id) ?? '',
    sortOrder: c.sort_order,
    models: modelsByCategory.get(c.id) ?? [],
  }));
}

/**
 * Converts flat dot-notation keys to a nested object.
 * e.g. { 'nav.products': 'Productos' } → { nav: { products: 'Productos' } }
 */
function unflatten(flatMap: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flatMap)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof current[parts[i]] !== 'object' || current[parts[i]] === null) {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

export async function fetchNeilTranslations(): Promise<NeilTranslations> {
  const { data, error } = await supabase
    .from('neil_translations')
    .select('lang, key, value')
    .order('id');
  if (error) throw error;

  // Build flat maps per language first, then unflatten to nested objects
  const flat: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) {
    if (!flat[row.lang]) flat[row.lang] = {};
    flat[row.lang][row.key] = row.value;
  }

  const result: NeilTranslations = {};
  for (const [lang, flatMap] of Object.entries(flat)) {
    result[lang] = unflatten(flatMap) as Record<string, string>;
  }
  return result;
}
