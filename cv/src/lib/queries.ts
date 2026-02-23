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
// Shared types for new tables
// ---------------------------------------------------------------------------

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

export interface BlogPostMeta {
  slug: string;
  file: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  date: string;
  category: string;
  featured: boolean;
  readTime: string;
  author: string;
  tags: string[];
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: string;
  duration: string;
  date: string;
  channel: string;
  featured: boolean;
  tags: string[];
}

export interface TaxBracket {
  limite: number;
  fijo: number;
  pct: number;
}

export interface TaxParams {
  period: string;
  gni: number;
  deduccion_especial: number;
  conyuge: number;
  hijo: number;
  hijo_incapacitado: number;
  aportes_pct: number;
  aportes_base_min: number;
  aportes_base_max: number;
  alquiler_pct: number;
  alquiler_tope: number;
  hipotecario_tope: number;
  medicos_pct: number;
  gn_tope_pct: number;
  educacion_tope: number;
  seguro_vida_tope: number;
  sepelio_tope: number;
  escala: TaxBracket[];
}

export interface TaxScenario {
  labelEs: string;
  labelEn: string;
  salaryLabelEs: string;
  salaryLabelEn: string;
  grossSalary: number;
  conyuge: boolean;
  hijos: number;
  hijosIncap: number;
  alquiler: number;
  alquilerAnual: boolean;
  extraIncome: number;
  includeSac: boolean;
  colorClass: string;
}

export interface TaxTab {
  tabId: string;
  labelEs: string;
  labelEn: string;
  titleEs: string;
  titleEn: string;
  contentEs: string;
  contentEn: string;
  formulaEs: string;
  formulaEn: string;
}

export interface AiModel {
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  color: string;
}

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

// ---------------------------------------------------------------------------
// CV Meta & About
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tech Stack
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Consulting Meta (static fields, stats, process steps)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export async function fetchBlogPosts(): Promise<BlogPostMeta[]> {
  const [{ data: posts, error: e1 }, { data: tags, error: e2 }] = await Promise.all([
    supabase.from('blog_posts').select('*').order('sort_order'),
    supabase.from('blog_post_tags').select('post_id, tag').order('id'),
  ]);
  if (e1 || e2) throw e1 ?? e2;
  const tagMap = groupBy(tags ?? [], (r) => r.post_id as number);
  return (posts ?? []).map((p) => ({
    slug: p.slug,
    file: p.file,
    titleEs: p.title_es,
    titleEn: p.title_en,
    excerptEs: p.excerpt_es,
    excerptEn: p.excerpt_en,
    date: p.date,
    category: p.category,
    featured: p.featured,
    readTime: p.read_time,
    author: p.author,
    tags: (tagMap.get(p.id) ?? []).map((t) => t.tag),
  }));
}

export async function fetchBlogCategories(): Promise<string[]> {
  const { data, error } = await supabase.from('blog_categories').select('name').order('sort_order');
  if (error) throw error;
  return (data ?? []).map((c) => c.name);
}

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------

export async function fetchVideos(): Promise<VideoItem[]> {
  const [{ data: videos, error: e1 }, { data: tags, error: e2 }] = await Promise.all([
    supabase.from('videos').select('*').order('sort_order'),
    supabase.from('video_tags').select('video_id, tag').order('id'),
  ]);
  if (e1 || e2) throw e1 ?? e2;
  const tagMap = groupBy(tags ?? [], (r) => r.video_id as string);
  return (videos ?? []).map((v) => ({
    id: v.id,
    youtubeId: v.youtube_id,
    titleEs: v.title_es,
    titleEn: v.title_en,
    descriptionEs: v.description_es,
    descriptionEn: v.description_en,
    category: v.category,
    duration: v.duration,
    date: v.date,
    channel: v.channel,
    featured: v.featured,
    tags: (tagMap.get(v.id) ?? []).map((t) => t.tag),
  }));
}

// ---------------------------------------------------------------------------
// Tax Calculator (params + brackets + scenarios + educational tabs)
// ---------------------------------------------------------------------------

export async function fetchTaxData(): Promise<{
  params: TaxParams;
  scenarios: TaxScenario[];
  tabs: TaxTab[];
}> {
  const [
    { data: paramsRows, error: e1 },
    { data: brackets, error: e2 },
    { data: scenarios, error: e3 },
    { data: tabs, error: e4 },
  ] = await Promise.all([
    supabase.from('tax_calculator_params').select('*').order('id').limit(1),
    supabase.from('tax_scale_brackets').select('*').order('bracket_order'),
    supabase.from('tax_scenarios').select('*').order('sort_order'),
    supabase.from('tax_tabs').select('*').order('sort_order'),
  ]);
  if (e1 || e2 || e3 || e4) throw e1 ?? e2 ?? e3 ?? e4;

  const p = (paramsRows ?? [])[0];
  const params: TaxParams = {
    period: p.period,
    gni: Number(p.gni),
    deduccion_especial: Number(p.deduccion_especial),
    conyuge: Number(p.conyuge),
    hijo: Number(p.hijo),
    hijo_incapacitado: Number(p.hijo_incapacitado),
    aportes_pct: Number(p.aportes_pct),
    aportes_base_min: Number(p.aportes_base_min),
    aportes_base_max: Number(p.aportes_base_max),
    alquiler_pct: Number(p.alquiler_pct),
    alquiler_tope: Number(p.alquiler_tope),
    hipotecario_tope: Number(p.hipotecario_tope),
    medicos_pct: Number(p.medicos_pct),
    gn_tope_pct: Number(p.gn_tope_pct),
    educacion_tope: Number(p.educacion_tope),
    seguro_vida_tope: Number(p.seguro_vida_tope),
    sepelio_tope: Number(p.sepelio_tope),
    escala: (brackets ?? [])
      .filter((b) => b.params_id === p.id)
      .map((b) => ({ limite: Number(b.limit_amount), fijo: Number(b.fixed_amount), pct: Number(b.pct) })),
  };

  const parsedScenarios: TaxScenario[] = (scenarios ?? []).map((s) => ({
    labelEs: s.label_es,
    labelEn: s.label_en,
    salaryLabelEs: s.salary_label_es,
    salaryLabelEn: s.salary_label_en,
    grossSalary: Number(s.gross_salary),
    conyuge: s.conyuge,
    hijos: s.hijos,
    hijosIncap: s.hijos_incap,
    alquiler: Number(s.alquiler),
    alquilerAnual: s.alquiler_anual,
    extraIncome: Number(s.extra_income),
    includeSac: s.include_sac,
    colorClass: s.color_class,
  }));

  const parsedTabs: TaxTab[] = (tabs ?? []).map((t) => ({
    tabId: t.tab_id,
    labelEs: t.label_es,
    labelEn: t.label_en,
    titleEs: t.title_es,
    titleEn: t.title_en,
    contentEs: t.content_es,
    contentEn: t.content_en,
    formulaEs: t.formula_es,
    formulaEn: t.formula_en,
  }));

  return { params, scenarios: parsedScenarios, tabs: parsedTabs };
}

// ---------------------------------------------------------------------------
// AI Models (Token Calculator)
// ---------------------------------------------------------------------------

export async function fetchAiModels(): Promise<AiModel[]> {
  const { data, error } = await supabase.from('ai_models').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []).map((m) => ({
    name: m.name,
    provider: m.provider,
    inputPer1M: Number(m.input_per_1m),
    outputPer1M: Number(m.output_per_1m),
    color: m.color_class,
  }));
}

// ---------------------------------------------------------------------------
// Plazo Fijo Rates (Investment Dashboard)
// ---------------------------------------------------------------------------

export async function fetchPlazoFijoRates(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('plazo_fijo_rates').select('period, monthly_rate').order('period');
  if (error) throw error;
  const result: Record<string, number> = {};
  for (const row of data ?? []) {
    result[row.period] = Number(row.monthly_rate);
  }
  return result;
}
