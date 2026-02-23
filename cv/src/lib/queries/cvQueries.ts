import { supabase } from '@/lib/supabase';
import type { ExperienceItem, ProjectItem, EducationItem, CertificationItem } from '@/types/content';
import { groupBy } from './_helpers';

export interface CvMeta {
  name: string;
  titleEs: string;
  titleEn: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
  calendly: string;
  ga4Id: string;
}

export interface CvAbout {
  titleEs: string;
  titleEn: string;
  textEs: string;
  textEn: string;
}

export type TechStack = Record<string, string[]>;

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

export async function fetchCvMeta(): Promise<CvMeta> {
  const { data, error } = await supabase.from('cv_meta').select('*').single();
  if (error) throw error;
  return {
    name: data.name,
    titleEs: data.title_es,
    titleEn: data.title_en,
    email: data.email,
    phone: data.phone,
    location: data.location,
    linkedin: data.linkedin,
    github: data.github,
    twitter: data.twitter,
    calendly: data.calendly,
    ga4Id: data.ga4_id,
  };
}

export async function fetchCvAbout(): Promise<CvAbout> {
  const { data, error } = await supabase.from('cv_about').select('*').single();
  if (error) throw error;
  return {
    titleEs: data.title_es,
    titleEn: data.title_en,
    textEs: data.text_es,
    textEn: data.text_en,
  };
}

export async function fetchTechStack(): Promise<TechStack> {
  const [{ data: cats, error: e1 }, { data: items, error: e2 }] = await Promise.all([
    supabase.from('cv_tech_stack_categories').select('*').order('sort_order'),
    supabase.from('cv_tech_stack_items').select('*').order('sort_order'),
  ]);
  if (e1 || e2) throw e1 ?? e2;

  const itemsByCategory = groupBy(items ?? [], (r) => r.category_id as string);
  const result: TechStack = {};
  for (const cat of cats ?? []) {
    result[cat.name] = (itemsByCategory.get(cat.id) ?? []).map((i) => i.item);
  }
  return result;
}
