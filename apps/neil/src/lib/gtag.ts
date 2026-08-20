export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-DG0SLT5RY3';
export const CONSENT_STORAGE_KEY = 'mga_consent_v1';
export type ConsentChoice = 'essential' | 'analytics' | 'all';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; mgaAnalyticsReady?: boolean; }
}

const COMMON_DIMS = { site_section: 'neil', client_name: 'Neil Climatizadores' };
let previousPageLocation = '';

function sanitize(params: Record<string, unknown>) {
  const result: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) result[key] = value.trim().slice(0, 100);
    else if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
    else if (typeof value === 'boolean') result[key] = value;
  });
  return result;
}

function safePath(url: string) {
  try { return new URL(url, window.location.origin).pathname || '/neil-site/'; }
  catch { return '/neil-site/'; }
}

function sendEvent(action: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, { ...COMMON_DIMS, ...sanitize(params) });
}

export function pageview(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const pagePath = safePath(url);
  const pageLocation = `${window.location.origin}${pagePath}`;
  let initialReferrer = 'not_apply';
  try {
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      initialReferrer = `${referrer.origin}${referrer.pathname}`;
    }
  } catch { /* Keep a non-identifying fallback. */ }
  window.gtag('event', 'page_view', {
    ...COMMON_DIMS,
    page_path: pagePath,
    page_location: pageLocation,
    page_referrer: previousPageLocation || initialReferrer,
    page_title: document.title,
    page_type: pagePath.includes('/tienda') ? 'store' : 'landing',
    user_lang: document.documentElement.lang || 'es',
    send_to: GA_MEASUREMENT_ID,
  });
  previousPageLocation = pageLocation;
}

export function updateConsent(choice: ConsentChoice) {
  const analytics = choice === 'analytics' || choice === 'all' ? 'granted' : 'denied';
  const ads = choice === 'all' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', { analytics_storage: analytics, ad_storage: ads, ad_user_data: ads, ad_personalization: ads });
  window.gtag?.('set', 'ads_data_redaction', choice !== 'all');
}

export const trackLanguageSwitch = (fromLang: string, toLang: string) => sendEvent('language_switch', { from_language: fromLang, to_language: toLang });
export const trackProductView = (productName: string, categoryId: string) => sendEvent('view_item', { item_name: productName, item_category: categoryId });
export const trackServiceView = (serviceName: string) => sendEvent('service_view', { service_name: serviceName });
export const trackSectionView = (sectionId: string) => sendEvent('section_view', { section_name: sectionId });
export const trackEuropeSectionView = () => sendEvent('section_view', { section_name: 'europe' });
export const trackProposalView = () => sendEvent('proposal_view');
export const trackCtaClick = (ctaName: string) => sendEvent('cta_click', { cta_name: ctaName });
export const trackProposalCtaClick = () => sendEvent('proposal_cta_click');
export const trackConsultingClick = () => sendEvent('consulting_click');
export const trackFormView = (formType: string) => sendEvent('form_view', { form_type: formType });
export const trackFormStart = (formType: string) => sendEvent('form_start', { form_type: formType });
export const trackFormValidationError = (formType: string, fieldId: string) => sendEvent('form_validation_error', { form_type: formType, field_id: fieldId, error_code: 'invalid' });
export const trackContactAttempted = (formType: string) => sendEvent('form_submit_attempt', { form_type: formType });
export const trackLeadDelivery = (status: 'success' | 'error', formType: string) => sendEvent(`lead_webhook_${status}`, { form_type: formType });
export const trackLeadFormSent = (formType: string, lang: string) => sendEvent('generate_lead', { form_type: formType, language: lang });
export const trackQuoteRequested = (productName: string, lang: string) => sendEvent('quote_requested', { product_name: productName || 'not_specified', language: lang });
export const trackScrollDepth = (percent: number) => sendEvent('scroll_depth', { percent });
export const trackWhatsAppClick = (type: 'sales' | 'support') => sendEvent('whatsapp_click', { contact_type: type });
export const trackAppError = (component: string, operation: string, errorCode: string, recoverable: boolean) => sendEvent('app_error', { component, operation, error_code: errorCode, recoverable });
export const trackErrorRecovery = (component: string) => sendEvent('error_recovery', { component });
