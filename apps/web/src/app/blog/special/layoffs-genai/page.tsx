import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import ReportContent from './ReportContent';

const REPORT_URL = 'https://www.mgatc.com/blog/special/layoffs-genai/';

export const metadata: Metadata = {
  title: 'Layoffs, Hiring & GenAI: The Great Labor Readjustment | MGA Tech',
  description:
    '100% data-driven analysis on mass layoffs in IT and white-collar sectors, hiring trends and their correlation with Generative AI milestones. Interactive charts, verified sources and 1-10 year projections.',
  keywords: [
    'layoffs',
    'tech layoffs 2024 2025',
    'GenAI impact jobs',
    'AI job market',
    'hiring trends',
    'white collar automation',
    'generative AI employment',
    'data-driven labor analysis',
    'IT workforce trends',
    'AI labor market report',
  ],
  alternates: {
    canonical: REPORT_URL,
  },
  openGraph: {
    type: 'article',
    title: 'Layoffs, Hiring & GenAI — The Great Labor Readjustment',
    description:
      'Global analysis with verifiable data, interactive charts and 1, 2, 5 and 10-year projections on AI impact on employment.',
    url: REPORT_URL,
    siteName: 'MGA Tech',
    locale: 'en_US',
    alternateLocale: 'es_AR',
    publishedTime: '2026-04-03T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
    images: [
      {
        url: 'https://www.mgatc.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Layoffs, Hiring & GenAI — Data-Driven Report',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'Layoffs, Hiring & GenAI — The Great Labor Readjustment',
    description:
      '100% data-driven analysis on AI impact on jobs. Interactive charts and multi-year projections.',
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
  headline: 'Layoffs, Hiring & GenAI: The Great Labor Readjustment',
  description:
    '100% data-driven analysis on mass layoffs in IT and white-collar sectors, hiring trends and their correlation with Generative AI milestones.',
  url: REPORT_URL,
  datePublished: '2026-04-03T00:00:00Z',
  dateModified: '2026-04-03T00:00:00Z',
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
    'layoffs, GenAI, AI impact, tech jobs, hiring trends, white collar, labor market, data analysis',
  articleSection: 'Special Report',
  about: [
    { '@type': 'Thing', name: 'Generative AI' },
    { '@type': 'Thing', name: 'Labor Market' },
    { '@type': 'Thing', name: 'Technology Layoffs' },
  ],
};

export default function LayoffsGenAIReportPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={articleSchema} />
      <ScrollTracker />
      <Navbar />
      <ReportContent />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="special_report" />
    </main>
  );
}
