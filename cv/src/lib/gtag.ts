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

export function event(action: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
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

  downloadCV: () =>
    event('cv_download', { site_section: 'cv' }),

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

  // Conversion funnel — submit with form_type for segmentation
  newsletterSubscribe: (page: string) =>
    event('newsletter_subscribe', { page, site_section: page, form_type: 'newsletter' }),

  leadFormSent: (page: string, form_type = 'contact') =>
    event('lead_form_sent', { page, site_section: page, form_type }),

  calendlyClick: (site_section = 'consulting') =>
    event('calendly_click', { site_section }),

  serviceView: (packId: string) =>
    event('service_view', { pack_id: packId, site_section: 'consulting' }),

  floatingCtaClick: (site_section: string) =>
    event('floating_cta_click', { site_section }),
};
