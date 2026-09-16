import type { Language } from '@/contexts/LanguageContext';
import type { Bilingual } from '@/types/content';
import { absoluteUrl } from './localizedMetadata';
import { SITE_AUTHOR, SITE_NAME } from './site';

const SERVICES: { name: Bilingual; description: Bilingual }[] = [
  {
    name: { es: 'Automatización de Procesos', en: 'Process Automation' },
    description: {
      es: 'Automatización RPA y workflows con n8n, Python e IA para eliminar tareas manuales repetitivas.',
      en: 'RPA and workflow automation with n8n, Python and AI to remove repetitive manual tasks.',
    },
  },
  {
    name: { es: 'Inteligencia Artificial Aplicada', en: 'Applied Artificial Intelligence' },
    description: {
      es: 'Chatbots IA, asistentes virtuales y modelos de ML adaptados al negocio.',
      en: 'AI chatbots, virtual assistants and ML models tailored to the business.',
    },
  },
  {
    name: { es: 'Business Intelligence & Datos', en: 'Business Intelligence & Data' },
    description: {
      es: 'Dashboards en tiempo real, pipelines de datos y reportes automatizados con BigQuery y Looker Studio.',
      en: 'Real-time dashboards, data pipelines and automated reporting with BigQuery and Looker Studio.',
    },
  },
  {
    name: { es: 'Mentorías Tech Personalizadas', en: 'Custom Tech Mentoring' },
    description: {
      es: 'Mentorías individuales para profesionales de datos, ingenieros y líderes técnicos.',
      en: 'One-on-one mentoring for data professionals, engineers and technical leaders.',
    },
  },
];

const COPY: {
  description: Bilingual;
  catalogName: Bilingual;
  inLanguage: Record<Language, string[]>;
} = {
  description: {
    es: 'Consultoría tecnológica especializada en automatización de procesos, Inteligencia Artificial aplicada y Business Intelligence para PyMEs argentinas. Reducción de costos operativos hasta 80%.',
    en: 'Technology consulting specialized in process automation, applied Artificial Intelligence and Business Intelligence for growing companies. Up to 80% lower operating costs.',
  },
  catalogName: {
    es: 'Servicios de Consultoría Tecnológica',
    en: 'Technology Consulting Services',
  },
  inLanguage: { es: ['es', 'en'], en: ['en', 'es'] },
};

/** ProfessionalService structured data for the consulting landing, per locale. */
export function getConsultingSchema(locale: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: absoluteUrl('/', locale),
    description: COPY.description[locale],
    provider: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: absoluteUrl('/', locale),
      jobTitle: 'Data & Analytics Technical Leader',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Argentina',
    },
    priceRange: 'USD 300 – USD 2500',
    inLanguage: COPY.inLanguage[locale],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: COPY.catalogName[locale],
      itemListElement: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name[locale],
          description: service.description[locale],
        },
      })),
    },
  };
}
