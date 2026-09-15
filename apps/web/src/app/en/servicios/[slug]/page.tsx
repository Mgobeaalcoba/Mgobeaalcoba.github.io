import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import OfferDetailClient from '@/components/commerce/OfferDetailClient';
import { getOffer, OFFERS } from '@/lib/offers';

const SITE_URL = 'https://www.mgatc.com';

export function generateStaticParams() { return OFFERS.map(({ slug }) => ({ slug })); }

type OfferPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  const pageUrl = `${SITE_URL}/en/servicios/${offer.slug}/`;
  const esPageUrl = `${SITE_URL}/servicios/${offer.slug}/`;
  return {
    title: offer.name.en,
    description: offer.description.en,
    alternates: { canonical: pageUrl, languages: { 'es-AR': esPageUrl, en: pageUrl, 'x-default': esPageUrl } },
    openGraph: { locale: 'en_US', title: `${offer.name.en} | MGA Tech Consulting`, description: offer.promise.en, url: pageUrl },
  };
}

export default async function EnglishOfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: offer.name.en, description: offer.description.en,
    provider: { '@type': 'Person', name: 'Mariano Gobea Alcoba' }, areaServed: 'Worldwide',
    offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: `${SITE_URL}/en/servicios/${offer.slug}/` },
  };

  return (
    <main id="main-content" className="signal-offer-page">
      <JsonLd data={schema} /><Navbar />
      <OfferDetailClient offer={offer} />
      <Footer />
    </main>
  );
}
