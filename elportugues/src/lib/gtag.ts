export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
};

export const event = ({ action, category, label, value, ...rest }: GTagEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
};

export const trackLeadFormSent = (formType: string) => {
  event({ action: 'lead_form_sent', category: 'engagement', label: formType });
};

export const trackServiceView = (serviceName: string) => {
  event({ action: 'service_view', category: 'engagement', label: serviceName });
};

export const trackScrollDepth = (depth: number) => {
  event({ action: 'scroll_depth', category: 'engagement', value: depth, label: `${depth}%` });
};
