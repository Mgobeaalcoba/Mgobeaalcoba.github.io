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

// ─────────────────────────────────────────────────────────────
// Generic interaction layer + attention/wait/health layer
//
// Mirrors apps/web/src/lib/gtag.ts (see docs/runbooks/analytics.md). These
// power InteractionTracker and PerformanceTracker so every clickable element
// and every wait on this site is measured, not just the hand-instrumented
// funnels above.
// ─────────────────────────────────────────────────────────────
export interface UiTarget {
  ui_element: string;
  ui_kind: string;
  ui_surface: string;
  site_section?: string;
  ui_index?: number;
  [key: string]: unknown;
}

/** Single-site app: section is constant, kept as a function for API parity with apps/web. */
export function currentSection(): string {
  return 'neil';
}

export const events = {
  uiClick: (params: UiTarget & { link_type?: string; link_domain?: string; link_path?: string }) =>
    sendEvent('ui_click', params),

  uiToggle: (params: UiTarget & { ui_state: string }) => sendEvent('ui_toggle', params),

  uiFocus: (params: UiTarget & { field_type: string }) => sendEvent('ui_focus', params),

  uiCopy: (params: UiTarget) => sendEvent('ui_copy', params),

  uiPrint: (site_section: string) => sendEvent('ui_print', { site_section }),

  /** Keyboard shortcuts. Only known combinations are emitted, never raw typing. */
  keyboardShortcut: (shortcut: string, site_section: string) =>
    sendEvent('ui_action', { ui_kind: 'keyboard', ui_surface: 'global', ui_element: shortcut, site_section }),

  /** Tab visibility and background time: measures real attention, not dwell time. */
  pageVisibility: (visibility_state: 'visible' | 'hidden', visible_seconds_band: string, hidden_count: number) =>
    sendEvent('page_visibility', { visibility_state, visible_seconds_band, hidden_count }),

  /** Aggregate long-task cost per pageview instead of one event per task. */
  mainThreadBlocking: (long_task_count: number, blocking_time_band: string) =>
    sendEvent('main_thread_blocking', { long_task_count, blocking_time_band }),

  /** Core Web Vitals and navigation timing, banded by rating. */
  webVitals: (metric_name: string, metric_value: number, metric_rating: 'good' | 'needs_improvement' | 'poor') =>
    sendEvent('web_vitals', { metric_name, metric_value, metric_rating }),

  pageLoadTiming: (ready_state: string, dom_ready_band: string, load_band: string) =>
    sendEvent('page_load_timing', { ready_state, dom_ready_band, load_band }),

  /** Async data the page is waiting for (Supabase reads). */
  dataWait: (source: string, outcome: 'success' | 'error' | 'timeout', wait_ms_band: string, attempt: number) =>
    sendEvent('data_wait', { source, outcome, wait_ms_band, attempt, site_section: currentSection() }),

  networkStatus: (network_state: 'online' | 'offline') => sendEvent('network_status', { network_state }),

  scriptError: (error_name: string, error_source: 'window' | 'promise') =>
    sendEvent('app_error', { component: 'runtime', operation: error_source, error_code: error_name, recoverable: false }),

  resourceError: (resource_type: string, element_tag: string) =>
    sendEvent('app_error', { component: 'resource', operation: element_tag, error_code: `${resource_type}_load_failed`, recoverable: true }),
};
