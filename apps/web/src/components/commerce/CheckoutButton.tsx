'use client';

import { ArrowRight, CalendarCheck } from 'lucide-react';
import { events } from '@/lib/gtag';
import { isAllowedPaymentUrl, type Offer } from '@/lib/offers';
import { useLanguage } from '@/contexts/LanguageContext';
import { openContactModal } from '@/components/shared/ContactModal';

export default function CheckoutButton({ offer, compact = false }: { offer: Offer; compact?: boolean }) {
  const { lang, t } = useLanguage();
  const offerName = offer.name[lang];

  const handleClick = () => {
    events.viewItem(offer.slug, offerName, offer.priceUsd);

    if (isAllowedPaymentUrl(offer.paymentUrl)) {
      events.beginCheckout(offer.slug, offerName, offer.priceUsd, 'mercado_pago');
      window.location.assign(offer.paymentUrl);
      return;
    }

    events.checkoutUnavailable(offer.slug);
    openContactModal(
      `service_${offer.slug}`,
      t('checkout_request').replace('{offer}', offerName).replace('{price}', String(offer.priceUsd)),
    );
  };

  return (
    <button
      type="button"
      data-analytics={`checkout_${offer.slug}`}
      data-analytics-kind="cta"
      data-analytics-surface="offer_grid"
      className={compact ? 'signal-offer-button signal-offer-button--compact' : 'signal-offer-button'}
      onClick={handleClick}
    >
      {isAllowedPaymentUrl(offer.paymentUrl) ? <><span>{t('checkout_buy_now')}</span><ArrowRight size={17} /></> : <><span>{t('checkout_reserve')}</span><CalendarCheck size={17} /></>}
    </button>
  );
}
