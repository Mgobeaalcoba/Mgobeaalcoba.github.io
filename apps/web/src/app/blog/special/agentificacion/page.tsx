import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import FloatingCTA from '@/components/shared/FloatingCTA';
import ReportContent from './ReportContent';
import ContentEngagementTracker from '@/components/shared/ContentEngagementTracker';

const REPORT_URL = 'https://www.mgatc.com/blog/special/agentificacion/';

export const metadata: Metadata = {
  title: 'Agentificación: Cómo Preparar tu Código para Agentes de IA | MGA Tech',
  description:
    'Investigación 2025–2026 sobre contexto, verificación y seguridad de agentes de IA, con el caso piloto real: 31 repositorios y directorios agentificados en una jornada. Gráficos interactivos, fuentes verificables y método de trabajo.',
  keywords: [
    'agentificación',
    'agentes de IA',
    'AGENTS.md',
    'agent readiness',
    'contexto para agentes',
    'Claude Code',
    'Codex',
    'GitHub Copilot',
    'Gemini CLI',
    'seguridad de agentes',
    'IA aplicada',
    'repositorios',
    'MCP',
  ],
  alternates: {
    canonical: REPORT_URL,
  },
  openGraph: {
    type: 'article',
    title: 'Agentificación — Cómo Preparar tu Código para Agentes de IA',
    description:
      'Qué dice la evidencia 2025–2026 sobre contexto, verificación y seguridad de agentes, y el caso piloto: un ecosistema completo de 31 repositorios y directorios agentificado en una jornada.',
    url: REPORT_URL,
    siteName: 'MGA Tech',
    locale: 'es_AR',
    alternateLocale: 'en_US',
    publishedTime: '2026-10-17T00:00:00Z',
    authors: ['Mariano Gobea Alcoba'],
    images: [
      {
        url: 'https://www.mgatc.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Agentificación — Informe especial data-driven',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MGobeaAlcoba',
    creator: '@MGobeaAlcoba',
    title: 'Agentificación — Cómo Preparar tu Código para Agentes de IA',
    description:
      'Investigación con fuentes 2025–2026, gráficos interactivos y un caso piloto real: 31 repositorios agentificados en una jornada.',
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
  headline: 'Agentificación: Cómo Preparar tu Código para Agentes de IA',
  description:
    'Investigación 2025–2026 sobre contexto, verificación y seguridad de agentes de IA, con el caso piloto real de 31 repositorios y directorios agentificados en una jornada.',
  url: REPORT_URL,
  datePublished: '2026-10-17T00:00:00Z',
  dateModified: '2026-10-17T00:00:00Z',
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
    'agentificación, agentes de IA, AGENTS.md, contexto, verificación, seguridad, repositorios, MCP, Claude Code, Codex, Copilot, Gemini',
  articleSection: 'Special Report',
  about: [
    { '@type': 'Thing', name: 'AI Agents' },
    { '@type': 'Thing', name: 'Software Repositories' },
    { '@type': 'Thing', name: 'Developer Security' },
  ],
};

export default function AgentificacionReportPage() {
  return (
    <main className="min-h-screen">
      <JsonLd data={articleSchema} />
      <ContentEngagementTracker contentType="special_report" contentId="agentificacion" />
      <ScrollTracker />
      <Navbar />
      <ReportContent />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="special_report" />
    </main>
  );
}
