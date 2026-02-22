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
  scrollDepth: (percent: number) =>
    event('scroll_depth', { percent, site_section: 'cv' }),

  sectionView: (section: string) =>
    event('section_view', { section_name: section, site_section: 'cv' }),

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

  blogClick: () =>
    event('blog_click', { site_section: 'cv' }),

  leadFormSent: (page: string) =>
    event('lead_form_sent', { page, site_section: page }),

  calendlyClick: () =>
    event('calendly_click', { site_section: 'consulting' }),

  serviceView: (packId: string) =>
    event('service_view', { pack_id: packId, site_section: 'consulting' }),
};
