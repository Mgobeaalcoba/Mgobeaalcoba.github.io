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
  locale: 'es',
  title: 'Servicios a demanda | Automatización, Data e IA',
  description: 'Diagnósticos, mentorías y auditorías con alcance, precio y entrega definidos. Automatización, Data Engineering e IA aplicada.',
  openGraphDescription: 'Diagnósticos, mentorías y auditorías con alcance, precio y entrega definidos.',
});

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Servicios a demanda de MGA Tech Consulting',
  itemListElement: OFFERS.map((offer, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': 'Service', name: offer.name.es, description: offer.description.es, url: absoluteUrl(`/servicios/${offer.slug}/`), offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } },
  })),
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SERVICES_FAQ.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question.es,
    acceptedAnswer: { '@type': 'Answer', text: answer.es },
  })),
};

export default function ServicesPage() {
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
