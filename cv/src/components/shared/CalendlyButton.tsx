'use client';

import { useCallback } from 'react';
import { events } from '@/lib/gtag';

const CALENDLY_URL = 'https://calendly.com/mariano-gobea-mercadolibre/30min';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

interface CalendlyButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function CalendlyButton({ className, children, onClick }: CalendlyButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      events.calendlyClick();
      onClick?.();

      if (typeof window !== 'undefined' && window.Calendly) {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        // Fallback: open in new tab if widget not loaded
        window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
      }
    },
    [onClick]
  );

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
