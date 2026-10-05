import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import JsonLd from '@/components/shared/JsonLd';
import IaRouterPage, { IAR_FAQ } from '@/components/recursos/IaRouterPage';

const PAGE_URL = 'https://www.mgatc.com/recursos/ia-router/';

export const metadata: Metadata = {
  title: 'ia-router | Ruteá tus suscripciones de IA con métricas objetivas',
  description:
    'ia-router reparte cada tarea entre Claude, Codex y Gemini según métricas objetivas de Arena y Artificial Analysis. Open source, sin dependencias, sobre tus propios CLIs y suscripciones.',
  keywords: [
    'ia-router',
    'router de modelos de IA',
    'claude codex gemini cli',
    'métricas arena artificial analysis',
    'elegir modelo de IA por tarea',
    'cli inteligencia artificial',
    'ahorrar cuota suscripciones IA',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'ia-router — tus suscripciones de IA, ruteadas con datos',
    description: 'Cada tarea al modelo que mejor rinde, según métricas objetivas. Open source.',
    url: PAGE_URL,
    images: [{ url: 'https://www.mgatc.com/images/ia-router/ia-router-header.png', width: 2000, height: 926, alt: 'Encabezado de ia-router en la terminal' }],
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ia-router',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS',
  url: PAGE_URL,
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
  codeRepository: 'https://github.com/Mgobeaalcoba/ia-suscription-router',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'Mgobeaalcoba', url: 'https://github.com/Mgobeaalcoba' },
  description:
    'Router que reparte tareas entre los CLIs oficiales de IA (Claude, Codex, Antigravity) con métricas objetivas de Arena y Artificial Analysis.',
  image: 'https://www.mgatc.com/images/ia-router/ia-router-header.png',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: IAR_FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function IaRouterRoute() {
  return (
    <main id="main-content" className="min-h-screen signal-tools-page signal-iar-page">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <ScrollTracker />
      <Navbar />
      <IaRouterPage />
      <Footer />
    </main>
  );
}
