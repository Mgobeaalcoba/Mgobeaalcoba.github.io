'use client';

import { AIAssistant } from '@/components/ui/AIAssistant';
import MobileAppNav from '@/components/shared/MobileAppNav';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt';
import AnalyticsTracker from '@/components/shared/AnalyticsTracker';
import ConsentBanner from '@/components/shared/ConsentBanner';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIAssistant />
      <MobileAppNav />
      <ServiceWorkerRegistration />
      <PWAInstallPrompt />
      <AnalyticsTracker />
      <ConsentBanner />
    </>
  );
}
