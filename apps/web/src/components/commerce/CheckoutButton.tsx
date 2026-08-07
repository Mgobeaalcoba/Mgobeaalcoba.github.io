'use client';

import { ArrowRight, CalendarCheck } from 'lucide-react';
import { events } from '@/lib/gtag';
import { isAllowedPaymentUrl, type Offer } from '@/lib/offers';
import { openContactModal } from '@/components/shared/ContactModal';

export default function CheckoutButton({ offer, compact = false }: { offer: Offer; compact?: boolean }) {
  const handleClick = () => {
    events.viewItem(offer.slug, offer.name, offer.priceUsd);

    if (isAllowedPaymentUrl(offer.paymentUrl)) {
      events.beginCheckout(offer.slug, offer.name, offer.priceUsd, 'mercado_pago');
      window.location.assign(offer.paymentUrl);
      return;
    }

    events.checkoutUnavailable(offer.slug);
    openContactModal(
      `service_${offer.slug}`,
      `Quiero reservar ${offer.name} (USD ${offer.priceUsd}). ¿Cómo continúo con el pago?`,
    );
  };

  return (
    <button type="button" className={compact ? 'signal-offer-button signal-offer-button--compact' : 'signal-offer-button'} onClick={handleClick}>
      {isAllowedPaymentUrl(offer.paymentUrl) ? <><span>Comprar ahora</span><ArrowRight size={17} /></> : <><span>Reservar servicio</span><CalendarCheck size={17} /></>}
    </button>
  );
}
