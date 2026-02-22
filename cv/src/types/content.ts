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

export interface ConsultingSection {
  headline: Bilingual;
  subheadline: Bilingual;
  stats: { value: string; label: Bilingual }[];
  packs: ConsultingPack[];
  caseStudies: CaseStudy[];
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

export interface ContentData {
  meta: CVMeta;
  about: AboutSection;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  techStack: TechStack;
  consulting: ConsultingSection;
}
