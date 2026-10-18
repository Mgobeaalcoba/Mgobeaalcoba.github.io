import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ServicesPageClient from '@/components/commerce/ServicesPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { OFFERS } from '@/lib/offers';
import { SERVICES_FAQ } from '@/lib/servicesCopy';
import { absoluteUrl, buildLocalizedMetadata } from '@/lib/localizedMetadata';

export const metadata: Metadata = buildLocalizedMetadata({
  path: '/servicios/',
  locale: 'en',
  title: 'On-demand services | Automation, Data and AI',
  description: 'Diagnostics, mentoring, audits, agentification and custom AI agents with a defined scope and delivery. Automation, Data Engineering and applied AI for growing teams.',
  openGraphDescription: 'Diagnostics, mentoring, audits and applied AI services with a defined scope and delivery.',
});

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MGA Tech Consulting on-demand services',
  itemListElement: OFFERS.map((offer, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': 'Service', name: offer.name.en, description: offer.description.en, url: absoluteUrl(`/servicios/${offer.slug}/`, 'en'), ...(offer.priceUsd != null ? { offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } } : {}) },
  })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SERVICES_FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question.en,
    acceptedAnswer: { '@type': 'Answer', text: answer.en },
  })),
};

export default function EnglishServicesPage() {
  return (
    <main id="main-content" className="signal-services-page">
      <JsonLd data={catalogSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />
      <ServicesPageClient />
      <Footer />
    </main>
  );
}
