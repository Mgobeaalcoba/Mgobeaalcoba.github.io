/**
 * TypeScript interfaces for content.json
 * Designed to allow future migration to a database or CMS.
 */

export interface Meta {
  siteName: string;
  siteUrl: string;
  description: string;
  keywords: string;
  language: string;
}

export interface Brand {
  name: string;
  legalName: string;
  tagline: string;
  subTagline: string;
  founded: number;
  yearsOfExperience: string;
  logo: string;
  logoFooter: string;
  primaryColor: string;
  accentColor: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCTA {
  text: string;
  anchor: string;
}

export interface Hero {
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  cta: { primary: HeroCTA; secondary: HeroCTA };
  stats: HeroStat[];
  backgroundImages: string[];
}

export interface AboutPillar {
  number: string;
  title: string;
  description: string;
}

export interface About {
  sectionLabel: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  pillars: AboutPillar[];
}

export interface TransportService {
  number: string;
  title: string;
  description: string;
}

export interface TransportCategory {
  id: string;
  title: string;
  icon: string;
  services: TransportService[];
  image: string;
}

export interface WarehouseCategory {
  id: string;
  title: string;
  icon: string;
  highlight: string;
  highlightLabel: string;
  description: string;
  types: string[];
  features: string[];
  security: string;
  images: string[];
}

export type ServiceCategory = TransportCategory | WarehouseCategory;

export interface Coverage {
  title: string;
  description: string;
  regions: string[];
}

export interface Services {
  sectionLabel: string;
  title: string;
  description: string;
  heroImage: string;
  categories: ServiceCategory[];
  coverage: Coverage;
}

export interface Founder {
  name: string;
  birthYear: number;
  birthplace: string;
  arrivalYear: number;
  arrivalCity: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface History {
  sectionLabel: string;
  title: string;
  description: string;
  heroImage: string;
  image: string;
  founder: Founder;
  timeline: TimelineEntry[];
  galleryImages: string[];
}

export interface Quality {
  sectionLabel: string;
  title: string;
  certImage: string;
  certImages: string[];
  systemImage: string;
  commitments: string[];
}

export interface ValueItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface Values {
  sectionLabel: string;
  title: string;
  description: string;
  items: ValueItem[];
}

export interface LocationInfo {
  address: string;
  city: string;
  province: string;
  country: string;
  fullAddress: string;
  accessInfo: string;
  googleMapsUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface EmailEntry {
  address: string;
  label: string;
}

export interface PhoneEntry {
  number: string;
  label: string;
}

export interface Contact {
  sectionLabel: string;
  title: string;
  description: string;
  location: LocationInfo;
  emails: EmailEntry[];
  phones: PhoneEntry[];
  formTypes: string[];
  formFields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
  }>;
}

export interface FooterLink {
  label: string;
  anchor: string;
}

export interface Footer {
  copyright: string;
  links: FooterLink[];
}

export interface TechStackItem {
  name: string;
  role: string;
}

export interface AutomationEntry {
  id: string;
  title: string;
  triggerLabel: string;
  description: string;
  steps: string[];
  techStack: TechStackItem[];
  benefits: string[];
}

export interface Automations {
  contactLead: AutomationEntry;
  quoteRequest: AutomationEntry;
}

export interface ImpactItem {
  stat: string;
  label: string;
  detail: string;
}

export interface Department {
  name: string;
  icon: string;
  color: string;
  automations: string[];
}

export interface ComparisonData {
  legacyLabel: string;
  newLabel: string;
  legacyItems: string[];
  newItems: string[];
}

export interface SalesProposal {
  badge: string;
  disclaimer: string;
  headline: string;
  subheadline: string;
  comparison: ComparisonData;
  impactTitle: string;
  impactItems: ImpactItem[];
  departments: Department[];
  consultingUrl: string;
  consultingCta: string;
  signature: string;
  signatureUrl: string;
}

export interface SiteContent {
  meta: Meta;
  brand: Brand;
  hero: Hero;
  about: About;
  services: Services;
  history: History;
  quality: Quality;
  values: Values;
  contact: Contact;
  footer: Footer;
  automations: Automations;
  salesProposal: SalesProposal;
}
