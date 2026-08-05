'use client';

import { useEffect } from 'react';
import Link from '@/components/shared/TransitionLink';
import CheckoutButton from './CheckoutButton';
import { OFFERS } from '@/lib/offers';
import { events } from '@/lib/gtag';

export default function OfferGrid({ heading = true }: { heading?: boolean }) {
  useEffect(() => { events.viewItemList('services'); }, []);

  return (
    <section id="servicios" className="signal-section signal-offers" aria-labelledby="offers-title">
      {heading && (
        <div className="signal-section__heading">
          <div><span className="signal-eyebrow">Servicios a demanda</span><h2 id="offers-title">Comprá claridad antes de comprar complejidad.</h2></div>
          <p>Alcance, precio y entrega definidos. Si después avanzamos con una implementación, descontamos el diagnóstico correspondiente.</p>
        </div>
      )}
      <div className="signal-offer-grid">
        {OFFERS.map((offer, index) => (
          <article className={`signal-offer-card ${offer.featured ? 'is-featured' : ''}`} key={offer.slug}>
            <div className="signal-offer-card__top"><span>0{index + 1} / {offer.category}</span>{offer.featured && <strong>Mejor primer paso</strong>}</div>
            <h3>{offer.name}</h3>
            <p>{offer.promise}</p>
            <div className="signal-offer-card__price"><strong>USD {offer.priceUsd}</strong><span>pago único</span></div>
            <div className="signal-offer-card__meta"><span>{offer.duration}</span><span>{offer.delivery}</span></div>
            <ul>{offer.includes.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="signal-offer-card__actions">
              <CheckoutButton offer={offer} compact />
              <Link href={`/servicios/${offer.slug}/`} onClick={() => events.selectItem(offer.slug, offer.name, offer.priceUsd)}>Ver detalle</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
