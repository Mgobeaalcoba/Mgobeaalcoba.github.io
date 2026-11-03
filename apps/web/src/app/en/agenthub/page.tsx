import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import AgentHubPageClient from '@/components/agenthub/AgentHubPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/agenthub/',
  locale: 'en',
  title: 'MGA AgentHub | AI agents connected to your data',
  description: 'A platform to create, connect and embed AI agents with controlled inference costs. Try the MGA assistant rebuilt on the platform, live.',
  openGraphDescription: 'Try a live AI agent with knowledge, tools and rules, and see how it is built.',
});

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MGA AgentHub',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Agent-as-a-Service platform to create, connect to data and embed AI agents in a website.',
  url: 'https://www.mgatc.com/en/agenthub/',
  publisher: { '@type': 'Organization', name: 'MGA Tech Consulting', url: 'https://www.mgatc.com' },
};

export default function AgentHubPageEn() {
  return (
    <main id="main-content" className="signal-services-page">
      <JsonLd data={softwareSchema} />
      <Navbar />
      <AgentHubPageClient />
      <Footer />
    </main>
  );
}
