import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ServicesPageClient from '@/components/commerce/ServicesPageClient';
import JsonLd from '@/components/shared/JsonLd';
import { OFFERS } from '@/lib/offers';
import { SERVICES_FAQ } from '@/lib/servicesCopy';

const SITE_URL = 'https://www.mgatc.com';
const PAGE_URL = `${SITE_URL}/en/servicios/`;
const ES_PAGE_URL = `${SITE_URL}/servicios/`;

export const metadata: Metadata = {
  title: 'On-demand services | Automation, Data and AI',
  description: 'Diagnostics, mentoring and audits with a defined scope, price and delivery. Automation, Data Engineering and applied AI for growing teams.',
  alternates: {
    canonical: PAGE_URL,
    languages: { 'es-AR': ES_PAGE_URL, en: PAGE_URL, 'x-default': ES_PAGE_URL },
  },
  openGraph: {
    locale: 'en_US',
    url: PAGE_URL,
    title: 'On-demand services | Automation, Data and AI',
    description: 'Diagnostics, mentoring and audits with a defined scope, price and delivery.',
  },
};

const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MGA Tech Consulting on-demand services',
  itemListElement: OFFERS.map((offer, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': 'Service', name: offer.name.en, description: offer.description.en, url: `${SITE_URL}/en/servicios/${offer.slug}/`, offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } },
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
