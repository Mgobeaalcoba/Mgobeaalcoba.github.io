'use client';

import { ClipboardCheck } from 'lucide-react';
import { events } from '@/lib/gtag';
import { openContactModal } from '@/components/shared/ContactModal';

export default function OnboardingCTA() {
  const start = () => {
    events.serviceOnboardingStart('post_payment');
    openContactModal('post_payment_onboarding', 'Ya realicé el pago y quiero coordinar mi servicio.');
  };
  return <button type="button" className="signal-offer-button" onClick={start}>Completar onboarding <ClipboardCheck size={17} /></button>;
}
