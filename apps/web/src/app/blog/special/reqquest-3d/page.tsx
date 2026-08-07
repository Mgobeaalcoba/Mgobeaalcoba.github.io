import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import ReqQuestContent from './ReqQuestContent';

const PAGE_URL = 'https://www.mgatc.com/blog/special/reqquest-3d/';

export const metadata: Metadata = {
  title: 'ReqQuest 3D — Gamification: The Future of Learning | MGA Tech',
  description:
    'Interactive 3D educational game for Requirements Engineering. Learn by playing: explore a virtual office, solve challenges with stakeholders, and master software requirements concepts.',
  keywords: [
    'gamification',
    'educational game',
    'requirements engineering',
    'learning by playing',
    '3D game education',
    'AI education',
    'interactive learning',
    'ReqQuest',
    'software engineering education',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'article',
    title: 'ReqQuest 3D — Gamification: The Future of Learning',
    description:
      'A 3D interactive game where you practice Requirements Engineering while exploring a virtual office. No slides, no memorization — just practice and natural learning.',
    url: PAGE_URL,
    siteName: 'MGA Tech',
    locale: 'en_US',
    alternateLocale: 'es_AR',
    publishedTime: '2026-04-03T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'ReqQuest 3D — Gamification: The Future of Learning',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ReqQuest 3D — Gamification: The Future of Learning',
  description:
    'Interactive 3D educational game for Requirements Engineering. Learn by playing in a virtual office environment.',
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
  articleSection: 'Special Report',
};

export default function ReqQuestPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={articleSchema} />
      <ScrollTracker />
      <Navbar />
      <ReqQuestContent />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="special_report_reqquest" />
    </main>
  );
}
