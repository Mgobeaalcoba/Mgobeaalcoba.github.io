import { supabase } from '@/lib/supabase';
import type { ConsultingPack, CaseStudy } from '@/types/content';
import { groupBy } from './_helpers';

export interface ConsultingMeta {
  headlineEs: string;
  headlineEn: string;
  subheadlineEs: string;
  subheadlineEn: string;
  calendlyUrl: string;
  stats: { value: string; labelEs: string; labelEn: string }[];
  processSteps: {
    number: string;
    titleEs: string;
    titleEn: string;
    descriptionEs: string;
    descriptionEn: string;
  }[];
}

export async function fetchConsultingPacks(): Promise<ConsultingPack[]> {
  const [
    { data: packs, error: e1 },
    { data: features, error: e2 },
    { data: automations, error: e3 },
  ] = await Promise.all([
    supabase.from('consulting_packs').select('*').order('sort_order'),
    supabase.from('consulting_pack_features').select('*').order('sort_order'),
    supabase.from('consulting_pack_automations').select('*').order('sort_order'),
  ]);

  if (e1 || e2 || e3) throw e1 ?? e2 ?? e3;

  const featMap = groupBy(features ?? [], (r) => r.pack_id as string);
  const autoMap = groupBy(automations ?? [], (r) => r.pack_id as string);

  return (packs ?? []).map((p) => ({
    id: p.id,
    name: { es: p.name_es, en: p.name_en },
    subtitle: { es: p.subtitle_es, en: p.subtitle_en },
    description: { es: p.description_es, en: p.description_en },
    price: { es: p.price_es, en: p.price_en },
    highlighted: p.highlighted ?? false,
    badge: p.badge_es ? { es: p.badge_es, en: p.badge_en } : undefined,
    features: (featMap.get(p.id) ?? []).map((f) => ({ es: f.text_es, en: f.text_en })),
    automations: (autoMap.get(p.id) ?? []).map((a) => ({ es: a.text_es, en: a.text_en })),
  }));
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const [{ data: rows, error: e1 }, { data: tagRows, error: e2 }] = await Promise.all([
    supabase.from('consulting_case_studies').select('*').order('sort_order'),
    supabase.from('consulting_case_study_tags').select('case_study_id, tag').order('id'),
  ]);

  if (e1 || e2) throw e1 ?? e2;

  const tagMap = groupBy(tagRows ?? [], (r) => r.case_study_id as string);

  return (rows ?? []).map((r) => ({
    id: r.id,
    title: { es: r.title_es, en: r.title_en },
    description: { es: r.description_es, en: r.description_en },
    result: { es: r.result_es, en: r.result_en },
    image: r.image,
    tags: (tagMap.get(r.id) ?? []).map((t) => t.tag),
  }));
}

export async function fetchConsultingMeta(): Promise<ConsultingMeta> {
  const [{ data: meta, error: e1 }, { data: stats, error: e2 }, { data: steps, error: e3 }] =
    await Promise.all([
      supabase.from('cv_consulting_meta').select('*').single(),
      supabase.from('cv_consulting_stats').select('*').order('sort_order'),
      supabase.from('cv_consulting_process_steps').select('*').order('sort_order'),
    ]);
  if (e1 || e2 || e3) throw e1 ?? e2 ?? e3;
  return {
    headlineEs: meta.headline_es,
    headlineEn: meta.headline_en,
    subheadlineEs: meta.subheadline_es,
    subheadlineEn: meta.subheadline_en,
    calendlyUrl: meta.calendly_url,
    stats: (stats ?? []).map((s) => ({ value: s.value, labelEs: s.label_es, labelEn: s.label_en })),
    processSteps: (steps ?? []).map((s) => ({
      number: s.number,
      titleEs: s.title_es,
      titleEn: s.title_en,
      descriptionEs: s.description_es,
      descriptionEn: s.description_en,
    })),
  };
}
