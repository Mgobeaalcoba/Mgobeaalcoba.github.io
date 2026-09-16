'use client';

import { ClipboardCheck } from 'lucide-react';
import { events } from '@/lib/gtag';
import { useLanguage } from '@/contexts/LanguageContext';
import { openContactModal } from '@/components/shared/ContactModal';

export default function OnboardingCTA() {
  const { t } = useLanguage();

  const start = () => {
    events.serviceOnboardingStart('post_payment');
    openContactModal('post_payment_onboarding', t('onboarding_request'));
  };
  return <button type="button" className="signal-offer-button" onClick={start}>{t('onboarding_cta')} <ClipboardCheck size={17} /></button>;
}
