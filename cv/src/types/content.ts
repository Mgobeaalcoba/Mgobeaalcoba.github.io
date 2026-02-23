export interface Bilingual {
  es: string;
  en: string;
}

export interface CVMeta {
  name: string;
  title: Bilingual;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  twitter: string;
  calendly: string;
  ga4Id: string;
}

export interface AboutSection {
  title: Bilingual;
  text: Bilingual;
}

export interface ExperienceItem {
  id: number;
  date: Bilingual;
  title: Bilingual;
  company: string;
  tags: string[];
  description: Bilingual;
}

export interface ProjectItem {
  id: number;
  tags: string[];
  title: Bilingual;
  description: Bilingual;
  link: string;
}

export interface EducationItem {
  title: Bilingual;
  school: string;
  subtitle?: Bilingual;
  date: string;
  tags: string[];
}

export interface CertificationItem {
  name: string;
  tags: string[];
}

export interface TechStack {
  [category: string]: string[];
}

export interface ConsultingPack {
  id: string;
  name: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  price: Bilingual;
  features: Bilingual[];
  automations: Bilingual[];
  badge?: Bilingual;
  highlighted?: boolean;
}

export interface CaseStudy {
  id: string;
  title: Bilingual;
  description: Bilingual;
  result: Bilingual;
  image: string;
  tags: string[];
}

export interface ProcessStep {
  number: string;
  title: Bilingual;
  description: Bilingual;
}

/**
 * Slim version of ConsultingSection stored in content.json.
 * packs and caseStudies are now served from Supabase (see queries.ts).
 */
export interface ConsultingSection {
  headline: Bilingual;
  subheadline: Bilingual;
  stats: { value: string; label: Bilingual }[];
  processSteps: ProcessStep[];
  calendlyUrl: string;
}

export interface BlogPost {
  slug: string;
  file: string;
  title: Bilingual;
  excerpt: Bilingual;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  author: string;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: Bilingual;
  description: Bilingual;
  category: string;
  duration: string;
  date: string;
  channel: string;
  featured: boolean;
  tags: string[];
}

/**
 * Shape of content.json — only holds static/config data.
 * Dynamic content (experience, projects, education, certifications,
 * consulting packs and case studies) is served from Supabase.
 */
export interface ContentData {
  meta: CVMeta;
  about: AboutSection;
  techStack: TechStack;
  consulting: ConsultingSection;
}
