/**
 * GA4 Measurement Plan — El Portugués S.A. Landing
 * Property: G-DG0SLT5RY3 (compartido con mgobeaalcoba.github.io)
 *
 * Separación de tráfico: custom dimension "site_section" = "elportugues"
 * Filtrar en GA4: Explorations → Add filter → site_section contains "elportugues"
 *
 * Eventos implementados:
 * ─────────────────────────────────────────────────────────────────────
 * ACQUISITION
 *   page_view           → automático vía gtag config
 *
 * ENGAGEMENT
 *   scroll_depth        → 25 / 50 / 75 / 90 / 100%
 *   section_view        → cuando una sección entra al viewport
 *   service_view        → hover sobre card de servicio
 *   proposal_view       → cuando la sección #propuesta entra al viewport
 *
 * CONVERSION
 *   lead_form_sent      → formulario de contacto enviado con éxito
 *   cta_click           → cualquier CTA principal clickeado
 *   proposal_cta_click  → click en el botón flotante hacia #propuesta
 *   consulting_click    → click en el link al portfolio de consulting
 *
 * PIPELINE
 *   quote_requested     → formulario tipo "Cotización de servicios"
 *   contact_attempted   → formulario enviado (antes de saber si tuvo éxito)
 * ─────────────────────────────────────────────────────────────────────
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DG0SLT5RY3';

type GTagEventParams = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const safeGtag = (command: string, ...args: unknown[]) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag(command, ...args);
};

export const pageview = (url: string) => {
  safeGtag('config', GA_MEASUREMENT_ID, { page_path: url });
};

export const event = ({ action, category, label, value, ...rest }: GTagEventParams) => {
  safeGtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    site_section: 'elportugues',
    client_name: 'El Portugues SA',
    ...rest,
  });
};

// ── ENGAGEMENT ──────────────────────────────────────────────────────

export const trackScrollDepth = (depth: number) => {
  event({ action: 'scroll_depth', category: 'engagement', label: `${depth}%`, value: depth });
};

export const trackSectionView = (sectionName: string) => {
  event({ action: 'section_view', category: 'engagement', label: sectionName });
};

export const trackServiceView = (serviceName: string) => {
  event({ action: 'service_view', category: 'engagement', label: serviceName });
};

export const trackProposalView = () => {
  event({ action: 'proposal_view', category: 'engagement', label: 'sales_proposal_section' });
};

// ── CONVERSION ──────────────────────────────────────────────────────

export const trackLeadFormSent = (formType: string) => {
  event({ action: 'lead_form_sent', category: 'conversion', label: formType });
  // Also fire GA4 recommended event
  safeGtag('event', 'generate_lead', { currency: 'ARS', value: 1, form_type: formType });
};

export const trackQuoteRequested = (formType: string) => {
  event({ action: 'quote_requested', category: 'conversion', label: formType });
  safeGtag('event', 'generate_lead', { currency: 'ARS', value: 5, form_type: 'quote' });
};

export const trackContactAttempted = (formType: string) => {
  event({ action: 'contact_attempted', category: 'pipeline', label: formType });
};

export const trackCtaClick = (ctaLabel: string, destination: string) => {
  event({ action: 'cta_click', category: 'conversion', label: ctaLabel, destination });
};

export const trackProposalCtaClick = () => {
  event({ action: 'proposal_cta_click', category: 'conversion', label: 'floating_button' });
};

export const trackConsultingClick = () => {
  event({ action: 'consulting_click', category: 'conversion', label: 'mgobeaalcoba_consulting' });
};
