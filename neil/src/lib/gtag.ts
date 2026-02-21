export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-DG0SLT5RY3';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const COMMON_DIMS = {
  site_section: 'neil',
  client_name: 'Neil Climatizadores',
};

function safeGtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export const pageview = (url: string) => {
  safeGtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    ...COMMON_DIMS,
  });
};

export const event = (action: string, params: Record<string, unknown> = {}) => {
  safeGtag('event', action, { ...COMMON_DIMS, ...params });
};

// Language & navigation
export const trackLanguageSwitch = (fromLang: string, toLang: string) => {
  event('language_switch', {
    from_language: fromLang,
    to_language: toLang,
    event_category: 'engagement',
  });
};

// Products
export const trackProductView = (productName: string, categoryId: string) => {
  event('product_view', {
    product_name: productName,
    category_id: categoryId,
    event_category: 'product',
  });
};

export const trackServiceView = (serviceName: string) => {
  event('service_view', {
    service_name: serviceName,
    event_category: 'engagement',
  });
};

// Sections
export const trackSectionView = (sectionId: string) => {
  event('section_view', {
    section_id: sectionId,
    event_category: 'engagement',
  });
};

export const trackEuropeSectionView = () => {
  event('europe_section_view', {
    event_category: 'engagement',
  });
};

export const trackProposalView = () => {
  event('proposal_view', {
    event_category: 'engagement',
  });
};

// CTAs
export const trackCtaClick = (ctaName: string) => {
  event('cta_click', {
    cta_name: ctaName,
    event_category: 'engagement',
  });
};

export const trackProposalCtaClick = () => {
  event('proposal_cta_click', {
    event_category: 'engagement',
  });
};

export const trackConsultingClick = () => {
  event('consulting_click', {
    event_category: 'conversion',
  });
};

// Forms
export const trackLeadFormSent = (formType: string, lang: string) => {
  event('lead_form_sent', {
    form_type: formType,
    language: lang,
    event_category: 'conversion',
    event_label: 'neil_lead',
  });
  event('generate_lead', {
    currency: 'USD',
    value: 1,
    form_type: formType,
    ...COMMON_DIMS,
  });
};

export const trackQuoteRequested = (productName: string, lang: string) => {
  event('quote_requested', {
    product_name: productName,
    language: lang,
    event_category: 'conversion',
  });
};

export const trackContactAttempted = (formType: string) => {
  event('contact_attempted', {
    form_type: formType,
    event_category: 'engagement',
  });
};

// Scroll depth
export const trackScrollDepth = (percent: number) => {
  event('scroll_depth', {
    percent_scrolled: percent,
    event_category: 'engagement',
  });
};

// WhatsApp
export const trackWhatsAppClick = (type: 'sales' | 'support') => {
  event('whatsapp_click', {
    contact_type: type,
    event_category: 'conversion',
  });
};
