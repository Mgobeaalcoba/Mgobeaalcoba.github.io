import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import MethodologyContent from './MethodologyContent';

const PAGE_URL =
  'https://www.mgatc.com/blog/special/layoffs-genai/methodology/';

export const metadata: Metadata = {
  title:
    'Methodology & Sources — Layoffs, Hiring & GenAI Report | MGA Tech',
  description:
    'Full traceability: claim → dataset → primary source. Methodology document for the data-driven report on AI impact on the labor market.',
  keywords: [
    'methodology',
    'data sources',
    'layoffs data',
    'labor market research',
    'GenAI employment data',
    'BLS JOLTS',
    'layoffs.fyi',
    'Challenger Gray Christmas',
    'Indeed Hiring Lab',
    'CompTIA workforce',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'article',
    title: 'Methodology & Sources — Layoffs, Hiring & GenAI Report',
    description:
      'Complete traceability between every claim in the report and the raw data that supports it.',
    url: PAGE_URL,
    siteName: 'MGA Tech',
    locale: 'en_US',
    alternateLocale: 'es_AR',
    publishedTime: '2026-04-03T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
  },
  twitter: {
    card: 'summary',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'Methodology & Sources — Layoffs, Hiring & GenAI',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Methodology & Sources — Layoffs, Hiring & GenAI Report',
  description:
    'Full traceability document: claim → dataset → primary source for the data-driven report on AI impact on the labor market.',
  url: PAGE_URL,
  datePublished: '2026-04-03T00:00:00Z',
  dateModified: '2026-04-03T00:00:00Z',
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
