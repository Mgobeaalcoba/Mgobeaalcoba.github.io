/**
 * Supabase query functions — typed, read-only (anon key + RLS).
 * Each function returns the same shape used by the existing types in @/types/content.
 */
import { supabase } from '@/lib/supabase';
import type {
  ExperienceItem,
  ProjectItem,
  EducationItem,
  CertificationItem,
  ConsultingPack,
  CaseStudy,
} from '@/types/content';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const k = key(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(item);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export async function fetchExperience(): Promise<ExperienceItem[]> {
  const [{ data: rows, error: e1 }, { data: tagRows, error: e2 }] = await Promise.all([
    supabase.from('experience').select('*').order('sort_order'),
    supabase.from('experience_tags').select('experience_id, tag').order('id'),
  ]);

  if (e1 || e2) throw e1 ?? e2;

  const tagMap = groupBy(tagRows ?? [], (r) => r.experience_id as number);

  return (rows ?? []).map((r) => ({
    id: r.id,
    date: { es: r.date_es, en: r.date_en },
    title: { es: r.title_es, en: r.title_en },
    company: r.company,
    description: { es: r.description_es, en: r.description_en },
    tags: (tagMap.get(r.id) ?? []).map((t) => t.tag),
  }));
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function fetchProjects(): Promise<ProjectItem[]> {
  const [{ data: rows, error: e1 }, { data: tagRows, error: e2 }] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('project_tags').select('project_id, tag').order('id'),
  ]);

  if (e1 || e2) throw e1 ?? e2;

  const tagMap = groupBy(tagRows ?? [], (r) => r.project_id as number);

  return (rows ?? []).map((r) => ({
    id: r.id,
    title: { es: r.title_es, en: r.title_en },
    description: { es: r.description_es, en: r.description_en },
    link: r.link,
    tags: (tagMap.get(r.id) ?? []).map((t) => t.tag),
  }));
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export async function fetchEducation(): Promise<EducationItem[]> {
  const [{ data: rows, error: e1 }, { data: tagRows, error: e2 }] = await Promise.all([
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('education_tags').select('education_id, tag').order('id'),
  ]);

  if (e1 || e2) throw e1 ?? e2;

  const tagMap = groupBy(tagRows ?? [], (r) => r.education_id as number);

  return (rows ?? []).map((r) => ({
    title: { es: r.title_es, en: r.title_en },
    school: r.school,
    date: r.date,
    subtitle: r.subtitle_es ? { es: r.subtitle_es, en: r.subtitle_en } : undefined,
    tags: (tagMap.get(r.id) ?? []).map((t) => t.tag),
  }));
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export async function fetchCertifications(): Promise<CertificationItem[]> {
  const [{ data: rows, error: e1 }, { data: tagRows, error: e2 }] = await Promise.all([
    supabase.from('certifications').select('*').order('sort_order'),
    supabase.from('certification_tags').select('certification_id, tag').order('id'),
  ]);

  if (e1 || e2) throw e1 ?? e2;

  const tagMap = groupBy(tagRows ?? [], (r) => r.certification_id as number);

  return (rows ?? []).map((r) => ({
    name: r.name,
    tags: (tagMap.get(r.id) ?? []).map((t) => t.tag),
  }));
}

// ---------------------------------------------------------------------------
// Consulting packs (with nested features and automations)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Case Studies
// ---------------------------------------------------------------------------

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
