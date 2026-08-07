export type LangCode = 'es' | 'en' | 'it' | 'fr' | 'pt' | 'de';

export interface ProductSpec {
  height?: string;
  airflow?: string;
  voltage?: string;
  controlType?: string;
  application?: string;
  technology?: string;
  power?: string;
  fuel?: string;
  consumption?: string;
  electricConsumption?: string;
  weight?: string;
  housing?: string;
  recharge?: string;
  regulator?: string;
  type?: string;
  [key: string]: string | undefined;
}

export interface ProductModel {
  id: string;
  name: string;
  image: string;
  specs: ProductSpec;
  badge?: string;
}

export interface ProductCategory {
  id: string;
  icon: string;
  image: string;
  badge?: string;
  url: string;
  models: ProductModel[];
}

export interface HeroStat {
  value: string;
  labelKey: string;
}

export interface ContactLocation {
  address: string;
  city: string;
  province: string;
  country: string;
  fullAddress: string;
}

export interface ContactSocial {
  facebook: string;
  instagram: string;
  youtube: string;
}

export interface TechStackItem {
  name: string;
  role: string;
}

export interface AutomationEntry {
  title: string;
  steps: string[];
  techStack: TechStackItem[];
  benefits: string[];
}

export interface SalesProposalDepartment {
  name: string;
  icon: string;
  automations: string[];
}

export interface SalesProposalComparison {
  legacy: string[];
  new: string[];
}

export interface ImpactItem {
  value: string;
  label: string;
}

export interface ContentData {
  meta: {
    siteName: string;
    siteUrl: string;
    language: string;
    availableLangs: LangCode[];
    googleSiteVerification: string;
  };
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    founded: string;
    yearsOfExperience: string;
    logo: string;
    logo02: string;
    faviconN: string;
    patent: string;
    primaryColor: string;
    accentColor: string;
  };
  flags: Record<LangCode, string>;
  hero: {
    backgroundImages: string[];
    stats: HeroStat[];
  };
  products: {
    categories: ProductCategory[];
  };
  preCooling: {
    patent: string;
    image: string;
    diagramImage: string;
  };
  europe: {
    galleryImages: string[];
    dealerUrl: string;
  };
  contact: {
    location: ContactLocation;
    emails: string[];
    phones: string[];
    whatsapp: { sales: string; support: string };
    social: ContactSocial;
    store: string;
  };
  footer: {
    links: { key: string; url: string }[];
  };
  automations: {
    contactLead: AutomationEntry;
    quoteRequest: AutomationEntry;
  };
  salesProposal: {
    badge: string;
    disclaimer: string;
    headline: string;
    comparison: SalesProposalComparison;
    impactTitle: string;
    impactItems: ImpactItem[];
    departments: SalesProposalDepartment[];
    consultingUrl: string;
    consultingCta: string;
    signature: string;
    signatureUrl: string;
  };
}

export interface TranslationPillar {
  title: string;
  desc: string;
}

export interface TranslationFeature {
  title: string;
  desc: string;
}

export interface TranslationFormType {
  id: string;
  label: string;
}

export interface TranslationCategoryContent {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface Translation {
  lang: string;
  langCode: LangCode;
  nav: {
    products: string;
    about: string;
    preCooling: string;
    europe: string;
    contact: string;
    store: string;
    cta: string;
  };
  hero: {
    headline: string;
    highlight: string;
    subheadline: string;
    cta: string;
    ctaSecondary: string;
    statYears: string;
    statDealers: string;
    statCategories: string;
    statLanguages: string;
  };
  about: {
    sectionLabel: string;
    title: string;
    description: string;
    description2: string;
    pillars: TranslationPillar[];
    qualityPolicy: string;
    qualityDesc: string;
    mediaTitle: string;
    mediaSub: string;
  };
  products: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    categories: Record<string, TranslationCategoryContent>;
    specsTitle: string;
    viewMore: string;
    buyNow: string;
    newBadge: string;
    patentedBadge: string;
  };
  preCooling: {
    sectionLabel: string;
    title: string;
    highlight: string;
    description: string;
    description2: string;
    features: TranslationFeature[];
    cta: string;
  };
  europe: {
    sectionLabel: string;
    title: string;
    description: string;
    description2: string;
    cta: string;
    dealersTitle: string;
    countries: string[];
  };
  contact: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    formTypes: TranslationFormType[];
    fields: Record<string, string>;
    placeholders: Record<string, string>;
    cta: string;
    sending: string;
    success: string;
    error: string;
    whatsappSales: string;
    whatsappSupport: string;
    storeLink: string;
    addressTitle: string;
    schedule: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    linkPrivacy: string;
    linkTerms: string;
    linkDealers: string;
    linkSupport: string;
    contactTitle: string;
    followTitle: string;
  };
  salesProposal: {
    badge: string;
    disclaimer: string;
    headline: string;
    legacyTitle: string;
    newTitle: string;
    impactTitle: string;
    automationsTitle: string;
    consultingCta: string;
    signatureLabel: string;
  };
}
