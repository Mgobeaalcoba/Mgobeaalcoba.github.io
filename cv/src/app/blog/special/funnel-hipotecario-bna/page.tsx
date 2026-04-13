import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import FunnelReportContent from './FunnelReportContent';

const REPORT_URL = 'https://www.mgatc.com/blog/special/funnel-hipotecario-bna/';

export const metadata: Metadata = {
  title: 'Funnel de Acceso al Crédito Hipotecario — Banco Nación Argentina 2025 | MGA Tech',
  description:
    'Análisis data-driven del funnel de acceso al crédito hipotecario del Banco Nación Argentina. De 3.2M de familias con necesidad habitacional a ~33.700 créditos otorgados. Barreras, conversión y datos verificables.',
  keywords: [
    'crédito hipotecario',
    'banco nación',
    'BNA',
    'hipotecario argentina',
    'funnel hipotecario',
    'déficit habitacional',
    'acceso vivienda argentina',
    'créditos UVA',
    'mercado inmobiliario argentina 2025',
    'mortgage funnel argentina',
  ],
  alternates: {
    canonical: REPORT_URL,
  },
  openGraph: {
    type: 'article',
    title: 'Funnel de Acceso al Crédito Hipotecario — BNA Argentina 2025',
    description:
      'De 3.2M de familias con déficit habitacional a ~33.700 créditos otorgados. Análisis completo del funnel, barreras y datos verificables del Banco Nación.',
    url: REPORT_URL,
    siteName: 'MGA Tech',
    locale: 'es_AR',
    alternateLocale: 'en_US',
    publishedTime: '2026-04-13T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
    images: [
      {
        url: 'https://www.mgatc.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Funnel Hipotecario BNA — Data-Driven Report',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'Funnel Hipotecario BNA — Argentina 2025',
    description:
      'De 3.2M de familias a ~33.700 créditos. Análisis data-driven del acceso al crédito hipotecario en Argentina.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Funnel de Acceso al Crédito Hipotecario — Banco Nación Argentina 2025',
  description:
    'Análisis data-driven del funnel completo de acceso al crédito hipotecario del Banco Nación. Informalidad, ingresos, scoring, propiedades aptas y conversión real.',
  url: REPORT_URL,
  datePublished: '2026-04-13T00:00:00Z',
  dateModified: '2026-04-13T00:00:00Z',
  author: {
    '@type': 'Person',
    name: 'Mariano Gobea Alcoba',
    url: 'https://www.mgatc.com',
  },
  publisher: {
    '@type': 'Person',
    name: 'Mariano Gobea Alcoba',
    url: 'https://www.mgatc.com',
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': REPORT_URL },
  inLanguage: ['es', 'en'],
  keywords:
    'crédito hipotecario, banco nación, BNA, funnel, déficit habitacional, argentina, mortgage, housing deficit',
  articleSection: 'Special Report',
  about: [
    { '@type': 'Thing', name: 'Crédito Hipotecario' },
    { '@type': 'Thing', name: 'Banco Nación Argentina' },
    { '@type': 'Thing', name: 'Mercado Inmobiliario' },
  ],
};

export default function FunnelHipotecarioBNAPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={articleSchema} />
      <ScrollTracker />
      <Navbar />
      <FunnelReportContent />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="special_report" />
    </main>
  );
}
