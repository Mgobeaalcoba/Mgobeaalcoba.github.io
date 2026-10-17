'use client';

import { ArrowRight, CalendarCheck, MessageSquare } from 'lucide-react';
import { events } from '@/lib/gtag';
import { isAllowedPaymentUrl, type Offer } from '@/lib/offers';
import { useLanguage } from '@/contexts/LanguageContext';
import { openContactModal } from '@/components/shared/ContactModal';

export default function CheckoutButton({ offer, compact = false }: { offer: Offer; compact?: boolean }) {
  const { lang, t } = useLanguage();
  const offerName = offer.name[lang];
  const price = offer.priceUsd;
  const isCustom = offer.customQuote === true || price == null;
  const canPay = !isCustom && isAllowedPaymentUrl(offer.paymentUrl);

  const handleClick = () => {
    events.viewItem(offer.slug, offerName, price ?? 0);

    if (!isCustom && isAllowedPaymentUrl(offer.paymentUrl)) {
      events.beginCheckout(offer.slug, offerName, price ?? 0, 'mercado_pago');
      window.location.assign(offer.paymentUrl);
      return;
    }

    if (!isCustom) events.checkoutUnavailable(offer.slug);
    openContactModal(
      `service_${offer.slug}`,
      isCustom
        ? t('checkout_contact_request').replace('{offer}', offerName)
        : t('checkout_request').replace('{offer}', offerName).replace('{price}', String(price)),
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
      {canPay
        ? <><span>{t('checkout_buy_now')}</span><ArrowRight size={17} /></>
        : isCustom
          ? <><span>{t('checkout_contact')}</span><MessageSquare size={17} /></>
          : <><span>{t('checkout_reserve')}</span><CalendarCheck size={17} /></>}
    </button>
  );
}
