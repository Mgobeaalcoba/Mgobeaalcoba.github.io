'use client';

import { AIAssistant } from '@/components/ui/AIAssistant';
import MobileAppNav from '@/components/shared/MobileAppNav';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIAssistant />
      <MobileAppNav />
      <ServiceWorkerRegistration />
      <PWAInstallPrompt />
    </>
  );
}
