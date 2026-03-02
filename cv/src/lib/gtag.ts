// Rebuild trigger: removing [skip ci] functionality from workflow
export const GA_ID = 'G-DG0SLT5RY3';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, { page_path: url });
  }
}

function getUserLang(): string {
  if (typeof window === 'undefined') return 'es';
  return (localStorage.getItem('language') as string) || document.documentElement.lang || 'es';
}

export function event(action: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, { user_lang: getUserLang(), ...params });
  }
}

// Key events always include send_to to guarantee attribution to the correct GA4 property
function keyEvent(action: string, params: Record<string, unknown> = {}) {
  event(action, { send_to: GA_ID, ...params });
}

export const events = {
  scrollDepth: (percent: number, site_section = 'cv') =>
    event('scroll_depth', { percent, site_section }),

  sectionView: (section: string, site_section = 'cv') =>
    event('section_view', { section_name: section, site_section }),

  projectView: (projectTitle: string) =>
    event('project_view', { project_title: projectTitle }),

  experienceOpen: (company: string, role: string) =>
    event('experience_modal_open', { company, role }),

  // KEY EVENT — GA4 recommended name for file/CV downloads
  downloadCV: () =>
    keyEvent('cv_download', { site_section: 'cv' }),

  socialClick: (platform: string) =>
    event('social_click', { platform, site_section: 'cv' }),

  consultingClick: () =>
    event('consulting_click', { site_section: 'cv' }),

  blogClick: (source = 'nav') =>
    event('blog_click', { source, site_section: 'cv' }),

  // Conversion funnel — step 1: user starts filling a form
  contactFormStart: (site_section: string) =>
    event('contact_form_start', { site_section }),

  // Conversion funnel — step 1: user focuses newsletter input
  newsletterFormFocus: (page: string) =>
    event('newsletter_form_focus', { page, site_section: page }),

  // Conversion funnel — proposal modal opened (step 1 before submit)
  proposalModalOpen: () =>
    event('proposal_modal_open', { site_section: 'consulting' }),

  // KEY EVENT — GA4 recommended name: sign_up (replaces newsletter_subscribe)
  newsletterSubscribe: (page: string) =>
    keyEvent('sign_up', { page, site_section: page, form_type: 'newsletter', method: 'newsletter_form' }),

  // KEY EVENT — GA4 recommended name: generate_lead (replaces lead_form_sent)
  leadFormSent: (page: string, form_type = 'contact') =>
    keyEvent('generate_lead', { page, site_section: page, form_type }),

  // KEY EVENT — Calendly intent
  calendlyClick: (site_section = 'consulting') =>
    keyEvent('calendly_click', { site_section }),

  serviceView: (packId: string) =>
    event('service_view', { pack_id: packId, site_section: 'consulting' }),

  floatingCtaClick: (site_section: string) =>
    event('floating_cta_click', { site_section }),

  // AI Assistant Events
  aiAssistantOpen: () =>
    event('ai_assistant_open', { site_section: 'cv' }),

  aiAssistantMessageSent: (message_length: number) =>
    event('ai_assistant_message_sent', { message_length, site_section: 'cv' }),

  aiAssistantCalendlyClick: () =>
    keyEvent('ai_assistant_calendly_click', { site_section: 'cv' }),

  aiAssistantUserIdentified: () =>
    event('ai_assistant_user_identified', { site_section: 'cv' }),

  aiAssistantFormView: () =>
    event('ai_assistant_form_view', { site_section: 'cv' }),

  // Resource Tools Events
  archVisualizerAddNode: (nodeId: string) =>
    event('arch_visualizer_add_node', { node_id: nodeId, site_section: 'recursos' }),
  
  archVisualizerClear: () =>
    event('arch_visualizer_clear', { site_section: 'recursos' }),

  roiCalculatorSimulate: (monthlySavings: number) =>
    keyEvent('roi_simulate', { 
      monthly_savings: monthlySavings, 
      site_section: 'recursos',
      currency: 'USD'
    }),
  
  // Agent Dashboard Events
  agentDashboardFilterUsed: (filter: string) =>
    event('agent_dashboard_filter_used', { filter, site_section: 'recursos' }),
  
  agentDashboardCtaClicked: (cta_type: string) =>
    keyEvent('agent_dashboard_cta_click', { cta_type, site_section: 'recursos' }),
};
