import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import ContextBackLink from '@/components/shared/ContextBackLink';
import CheckoutButton from '@/components/commerce/CheckoutButton';
import { Check, ShieldCheck } from 'lucide-react';
import { getOffer, OFFERS } from '@/lib/offers';

export function generateStaticParams() { return OFFERS.map(({ slug }) => ({ slug })); }

type OfferPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  return { title: offer.name, description: offer.description, alternates: { canonical: `https://www.mgatc.com/servicios/${offer.slug}/` }, openGraph: { title: `${offer.name} | MGA Tech Consulting`, description: offer.promise, url: `https://www.mgatc.com/servicios/${offer.slug}/` } };
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: offer.name, description: offer.description, provider: { '@type': 'Person', name: 'Mariano Gobea Alcoba' }, areaServed: 'Worldwide', offers: { '@type': 'Offer', price: offer.priceUsd, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: `https://www.mgatc.com/servicios/${offer.slug}/` } };

  return (
    <main id="main-content" className="signal-offer-page">
      <JsonLd data={schema} /><Navbar />
      <section className="signal-offer-hero">
        <div><ContextBackLink href="/servicios/" label="Volver a servicios" /><span className="signal-eyebrow">{offer.category} / Servicio a demanda</span><h1>{offer.name}</h1><p>{offer.promise}</p><div className="signal-offer-price"><strong>USD {offer.priceUsd}</strong><span>Pago único · {offer.duration} · {offer.delivery}</span></div><CheckoutButton offer={offer} /><small><ShieldCheck size={15} /> Si avanzamos con una implementación, descontamos el diagnóstico aplicable.</small></div>
        <aside><span>Resultado</span><h2>{offer.description}</h2>{offer.outcome.map((item) => <p key={item}><Check size={16} />{item}</p>)}</aside>
      </section>
      <section className="signal-offer-detail">
        <div><span className="signal-eyebrow">Para quién es</span><h2>Una inversión pequeña para tomar una decisión grande.</h2></div>
        <div className="signal-offer-detail__lists"><article><h3>Es para vos si…</h3><ul>{offer.audience.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article><article><h3>Qué recibís</h3><ul>{offer.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article></div>
      </section>
      <section className="signal-offer-final"><span>¿Listo para empezar?</span><h2>Reservá ahora y trabajamos directamente sobre tu caso.</h2><CheckoutButton offer={offer} /></section>
      <Footer />
    </main>
  );
}
