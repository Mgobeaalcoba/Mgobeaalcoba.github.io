import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import MethodologyContent from './MethodologyContent';

const PAGE_URL =
  'https://www.mgatc.com/blog/special/funnel-hipotecario-bna/methodology/';

export const metadata: Metadata = {
  title:
    'Metodología y Fuentes — Funnel Hipotecario BNA Argentina 2025 | MGA Tech',
  description:
    'Trazabilidad completa: cada dato → fuente original. Documento de metodología del informe sobre acceso al crédito hipotecario del Banco Nación.',
  keywords: [
    'metodología',
    'fuentes',
    'crédito hipotecario datos',
    'BCRA hipotecarios',
    'BNA datos',
    'INDEC informalidad',
    'déficit habitacional argentina',
    'mortgage data argentina',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'article',
    title: 'Metodología y Fuentes — Funnel Hipotecario BNA 2025',
    description:
      'Trazabilidad completa entre cada afirmación del informe y los datos crudos que la respaldan.',
    url: PAGE_URL,
    siteName: 'MGA Tech',
    locale: 'es_AR',
    alternateLocale: 'en_US',
    publishedTime: '2026-04-13T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
  },
  twitter: {
    card: 'summary',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'Metodología — Funnel Hipotecario BNA 2025',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Metodología y Fuentes — Funnel Hipotecario BNA Argentina 2025',
  description:
    'Documento de trazabilidad: dato → fuente para el informe del funnel de acceso al crédito hipotecario del Banco Nación.',
  url: PAGE_URL,
  datePublished: '2026-04-13T00:00:00Z',
  dateModified: '2026-04-13T00:00:00Z',
  author: {
    '@type': 'Person',
    name: 'Mariano Gobea Alcoba',
    url: 'https://www.mgatc.com',
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  inLanguage: ['es', 'en'],
  articleSection: 'Methodology',
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={schema} />
      <ScrollTracker />
      <Navbar />
      <MethodologyContent />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="methodology" />
    </main>
  );
}
