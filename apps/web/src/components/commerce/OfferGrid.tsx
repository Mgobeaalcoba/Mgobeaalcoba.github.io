'use client';

import { useEffect } from 'react';
import Link from '@/components/shared/TransitionLink';
import CheckoutButton from './CheckoutButton';
import { OFFERS } from '@/lib/offers';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizePath } from '@/lib/i18n-routes';
import { events } from '@/lib/gtag';

export default function OfferGrid({ heading = true }: { heading?: boolean }) {
  const { lang, t } = useLanguage();
  useEffect(() => { events.viewItemList('services'); }, []);

  return (
    <section id="servicios" className="signal-section signal-offers" aria-labelledby="offers-title">
      {heading && (
        <div className="signal-section__heading">
          <div><span className="signal-eyebrow">{t('services_grid_eyebrow')}</span><h2 id="offers-title">{t('services_grid_title')}</h2></div>
          <p>{t('services_grid_sub')}</p>
        </div>
      )}
      <div className="signal-offer-grid">
        {OFFERS.map((offer, index) => (
          <article className={`signal-offer-card ${offer.featured ? 'is-featured' : ''}`} key={offer.slug}>
            <div className="signal-offer-card__top"><span>0{index + 1} / {offer.category[lang]}</span>{offer.featured && <strong>{t('services_best_first_step')}</strong>}</div>
            <h3>{offer.name[lang]}</h3>
            <p>{offer.promise[lang]}</p>
            <div className="signal-offer-card__price"><strong>USD {offer.priceUsd}</strong><span>{t('services_single_payment')}</span></div>
            <div className="signal-offer-card__meta"><span>{offer.duration[lang]}</span><span>{offer.delivery[lang]}</span></div>
            <ul>{offer.includes[lang].slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="signal-offer-card__actions">
              <CheckoutButton offer={offer} compact />
              <Link href={localizePath(`/servicios/${offer.slug}/`, lang)} onClick={() => events.selectItem(offer.slug, offer.name[lang], offer.priceUsd)}>{t('services_see_detail')}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
