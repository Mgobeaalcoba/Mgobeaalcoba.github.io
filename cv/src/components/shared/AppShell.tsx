'use client';

import { AIAssistant } from '@/components/ui/AIAssistant';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}
