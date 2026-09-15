import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import OfferDetailClient from '@/components/commerce/OfferDetailClient';
import { getOffer, OFFERS } from '@/lib/offers';
import { absoluteUrl, buildLocalizedMetadata } from '@/lib/localizedMetadata';

export function generateStaticParams() { return OFFERS.map(({ slug }) => ({ slug })); }

type OfferPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  return buildLocalizedMetadata({
    path: `/servicios/${offer.slug}/`,
    locale: 'en',
    title: offer.name.en,
    description: offer.description.en,
    openGraphTitle: `${offer.name.en} | MGA Tech Consulting`,
    openGraphDescription: offer.promise.en,
  });
}

export default async function EnglishOfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: offer.name.en, description: offer.description.en,
    provider: { '@type': 'Person', name: 'Mariano Gobea Alcoba' }, areaServed: 'Worldwide',
    offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: absoluteUrl(`/servicios/${offer.slug}/`, 'en') },
  };

  return (
    <main id="main-content" className="signal-offer-page">
      <JsonLd data={schema} /><Navbar />
      <OfferDetailClient offer={offer} />
      <Footer />
    </main>
  );
}
