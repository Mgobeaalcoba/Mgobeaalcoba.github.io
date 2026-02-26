import type { Metadata } from 'next';
import ConsultingPageClient from './consulting/ConsultingPageClient';
import JsonLd from '@/components/shared/JsonLd';

const SITE_URL = 'https://www.mgatc.com';
const PAGE_URL = `${SITE_URL}/`;

export const metadata: Metadata = {
  title: 'MGA Tech Consulting | Automatización IA & BI para PyMEs',
  description:
    'Consultoría tecnológica especializada: Automatización de procesos, IA aplicada y Business Intelligence. Reducción de costos hasta 80%. Primera automatización 100% gratis.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'MGA Tech Consulting - Automatización & IA para Pymes',
    description:
      'Reduzca costos operativos hasta 80% con automatización, chatbots IA y dashboards en tiempo real. Primera automatización gratis.',
    url: PAGE_URL,
  },
};

const consultingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'MGA Tech Consulting',
  url: PAGE_URL,
  description:
    'Consultoría tecnológica especializada en automatización de procesos, Inteligencia Artificial aplicada y Business Intelligence para PyMEs argentinas. Reducción de costos operativos hasta 80%.',
  provider: {
    '@type': 'Person',
    name: 'Mariano Gobea Alcoba',
    url: SITE_URL,
    jobTitle: 'Data & Analytics Technical Leader',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Argentina',
  },
  priceRange: 'USD 300 – USD 2500',
  inLanguage: ['es', 'en'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Consultoría Tecnológica',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatización de Procesos',
          description:
            'Automatización RPA y workflows con n8n, Python e IA para eliminar tareas manuales repetitivas.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Inteligencia Artificial Aplicada',
          description: 'Chatbots IA, asistentes virtuales y modelos de ML adaptados al negocio.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Business Intelligence & Datos',
          description:
            'Dashboards en tiempo real, pipelines de datos y reportes automatizados con BigQuery y Looker Studio.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mentorías Tech Personalizadas',
          description:
            'Mentorías individuales para profesionales de datos, ingenieros y líderes técnicos.',
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={consultingSchema} />
      <ConsultingPageClient />
    </>
  );
}
