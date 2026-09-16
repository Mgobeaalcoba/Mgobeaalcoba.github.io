'use client';

import ContextBackLink from '@/components/shared/ContextBackLink';
import CheckoutButton from './CheckoutButton';
import { Check, ShieldCheck } from 'lucide-react';
import type { Offer } from '@/lib/offers';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizePath } from '@/lib/i18n-routes';

export default function OfferDetailClient({ offer }: { offer: Offer }) {
  const { lang, t } = useLanguage();

  return (
    <>
      <section className="signal-offer-hero">
        <div>
          <ContextBackLink href={localizePath('/servicios/', lang)} label={t('services_back_services')} />
          <span className="signal-eyebrow">{offer.category[lang]} / {t('services_detail_eyebrow')}</span>
          <h1>{offer.name[lang]}</h1>
          <p>{offer.promise[lang]}</p>
          <div className="signal-offer-price">
            <strong>USD {offer.priceUsd}</strong>
            <span>{t('services_single_payment')} · {offer.duration[lang]} · {offer.delivery[lang]}</span>
          </div>
          <CheckoutButton offer={offer} />
          <small><ShieldCheck size={15} /> {t('services_detail_guarantee')}</small>
        </div>
        <aside>
          <span>{t('services_detail_outcome')}</span>
          <h2>{offer.description[lang]}</h2>
          {offer.outcome[lang].map((item) => <p key={item}><Check size={16} />{item}</p>)}
        </aside>
      </section>
      <section className="signal-offer-detail">
        <div>
          <span className="signal-eyebrow">{lang === 'es' ? 'Para quién es' : 'Who it is for'}</span>
          <h2>{lang === 'es' ? 'Una inversión pequeña para tomar una decisión grande.' : 'A small investment to make a big decision.'}</h2>
        </div>
        <div className="signal-offer-detail__lists">
          <article>
            <h3>{t('services_detail_for_you')}</h3>
            <ul>{offer.audience[lang].map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
          </article>
          <article>
            <h3>{t('services_detail_you_get')}</h3>
            <ul>{offer.includes[lang].map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
          </article>
        </div>
      </section>
      <section className="signal-offer-final">
        <span>{t('services_detail_final_eyebrow')}</span>
        <h2>{t('services_detail_final_title')}</h2>
        <CheckoutButton offer={offer} />
      </section>
    </>
  );
}
