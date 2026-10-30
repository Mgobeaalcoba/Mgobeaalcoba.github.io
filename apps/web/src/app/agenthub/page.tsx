import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import AgentHubPageClient from '@/components/agenthub/AgentHubPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/agenthub/',
  locale: 'es',
  title: 'MGA AgentHub | Agentes de IA conectados a tus datos',
  description: 'Plataforma para crear, conectar e incrustar agentes de IA con costos de inferencia controlados. Probá en vivo el asistente de MGA reconstruido sobre la plataforma.',
  openGraphDescription: 'Probá en vivo un agente de IA con conocimiento, herramientas y reglas, y mirá cómo está armado.',
});

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MGA AgentHub',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Plataforma Agent-as-a-Service para crear, conectar a datos e incrustar agentes de IA en un sitio web.',
  url: 'https://www.mgatc.com/agenthub/',
  publisher: { '@type': 'Organization', name: 'MGA Tech Consulting', url: 'https://www.mgatc.com' },
};

export default function AgentHubPage() {
  return (
    <main id="main-content" className="signal-services-page">
      <JsonLd data={softwareSchema} />
      <Navbar />
      <AgentHubPageClient />
      <Footer />
    </main>
  );
}
