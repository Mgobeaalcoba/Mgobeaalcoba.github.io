// Rebuild trigger: removing [skip ci] functionality from workflow
export const GA_ID = 'G-DG0SLT5RY3';
export const CONSENT_STORAGE_KEY = 'mga_consent_v1';
export type ConsentChoice = 'essential' | 'analytics' | 'all';

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsPrimitive[] | Record<string, unknown>[];
let previousPageLocation = '';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    mgaAnalyticsReady?: boolean;
  }
}

function safePath(url: string): string {
  if (typeof window === 'undefined') return '/';
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname || '/';
  } catch {
    return (url.split('?')[0].split('#')[0] || '/').startsWith('/')
      ? url.split('?')[0].split('#')[0] || '/'
      : '/';
  }
}

function safeLocation(url: string): string {
  const path = safePath(url);
  return typeof window === 'undefined' ? path : `${window.location.origin}${path}`;
}

function safeReferrer(url: string): string {
  if (typeof window === 'undefined' || !url) return 'not_apply';
  try {
    const parsed = new URL(url, window.location.origin);
    return `${parsed.origin}${parsed.pathname || '/'}`;
  } catch {
    return 'not_apply';
  }
}

function getPageContext(pathname: string): { site_section: string; page_type: string } {
  if (pathname.startsWith('/blog/special/')) {
    return { site_section: 'blog', page_type: pathname.includes('/methodology') ? 'methodology' : 'special_report' };
  }
  if (pathname.startsWith('/blog/videos')) return { site_section: 'blog', page_type: 'video_library' };
  if (pathname.startsWith('/blog/')) return { site_section: 'blog', page_type: 'article' };
  if (pathname === '/blog' || pathname === '/blog/') return { site_section: 'blog', page_type: 'content_hub' };
  if (pathname.startsWith('/recursos/hipotecarios')) return { site_section: 'recursos', page_type: 'mortgage_tool' };
  if (pathname.startsWith('/recursos')) return { site_section: 'recursos', page_type: 'tool_hub' };
  if (pathname.startsWith('/servicios/gracias')) return { site_section: 'services', page_type: 'checkout_return' };
  if (pathname.startsWith('/servicios/')) return { site_section: 'services', page_type: 'service_detail' };
  if (pathname === '/servicios' || pathname === '/servicios/') return { site_section: 'services', page_type: 'service_list' };
  if (pathname.startsWith('/consulting')) return { site_section: 'consulting', page_type: 'landing' };
  if (pathname.startsWith('/portfolio')) return { site_section: 'portfolio', page_type: 'portfolio' };
  if (pathname.startsWith('/privacidad')) return { site_section: 'privacy', page_type: 'policy' };
  if (pathname.startsWith('/offline')) return { site_section: 'system', page_type: 'offline' };
  return { site_section: 'cv', page_type: pathname === '/' ? 'home' : 'page' };
}

function sanitizeValue(value: unknown): AnalyticsValue | undefined {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized ? normalized.slice(0, 100) : undefined;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    const objectItems = value
      .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
      .map((item) => sanitizeParams(item as Record<string, unknown>));
    if (objectItems.length) return objectItems;
    const primitiveItems: AnalyticsPrimitive[] = [];
    value.forEach((item) => {
      const sanitized = sanitizeValue(item);
      if (typeof sanitized === 'string' || typeof sanitized === 'number' || typeof sanitized === 'boolean') {
        primitiveItems.push(sanitized);
      }
    });
    return primitiveItems;
  }
  return undefined;
}

function sanitizeParams(params: Record<string, unknown>): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [key, sanitizeValue(value)] as const)
      .filter((entry): entry is readonly [string, AnalyticsValue] => entry[1] !== undefined),
  );
}

function linkContext(url: string): { link_type: string; link_domain: string; link_path: string } {
  const raw = url.trim();
  if (raw.startsWith('mailto:')) return { link_type: 'email', link_domain: 'email', link_path: 'not_apply' };
  if (raw.startsWith('tel:')) return { link_type: 'phone', link_domain: 'phone', link_path: 'not_apply' };
  try {
    const parsed = new URL(raw, window.location.origin);
    const internal = parsed.origin === window.location.origin;
    return {
      link_type: internal ? 'internal' : 'external',
      link_domain: internal ? 'internal' : parsed.hostname.toLowerCase(),
      link_path: parsed.pathname || '/',
    };
  } catch {
    return { link_type: 'unknown', link_domain: 'unknown', link_path: 'not_apply' };
  }
}

function numericBand(value: number, limits: [number, number], labels: [string, string, string]): string {
  if (value < limits[0]) return labels[0];
  if (value < limits[1]) return labels[1];
  return labels[2];
}

export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    const path = safePath(url);
    const location = safeLocation(path);
    const referrer = previousPageLocation || safeReferrer(document.referrer);
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: location,
      page_referrer: referrer,
      page_title: document.title,
      user_lang: getUserLang(),
      app_display_mode: getDisplayMode(),
      ...getPageContext(path),
      send_to: GA_ID,
    });
    previousPageLocation = location;
  }
}

function getUserLang(): string {
  if (typeof window === 'undefined') return 'es';
  return (localStorage.getItem('language') as string) || document.documentElement.lang || 'es';
}

function getDisplayMode(): string {
  if (typeof window === 'undefined') return 'browser';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  return 'browser';
}

function event(action: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    const context = getPageContext(window.location.pathname);
    window.gtag('event', action, {
      user_lang: getUserLang(),
      app_display_mode: getDisplayMode(),
      ...context,
      ...sanitizeParams(params),
    });
  }
}

export function updateConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return;
  const analytics = choice === 'analytics' || choice === 'all' ? 'granted' : 'denied';
  const ads = choice === 'all' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
  window.gtag?.('set', 'ads_data_redaction', choice !== 'all');
  if (analytics === 'granted') {
    event('consent_update', { consent_choice: choice, site_section: 'privacy' });
  }
}

// Candidate key events still need to be marked as key events in GA4 Admin.
function keyEvent(action: string, params: Record<string, unknown> = {}) {
  event(action, { send_to: GA_ID, ...params });
}

export const events = {
  viewItemList: (list_id: string) =>
    event('view_item_list', { item_list_id: list_id, site_section: 'services' }),

  selectItem: (item_id: string, item_name: string, price: number) =>
    event('select_item', { item_list_id: 'services', currency: 'USD', value: price, items: [{ item_id, item_name, price, quantity: 1 }] }),

  viewItem: (item_id: string, item_name: string, price: number) =>
    event('view_item', { currency: 'USD', value: price, site_section: 'services', items: [{ item_id, item_name, price, quantity: 1 }] }),

  beginCheckout: (item_id: string, item_name: string, price: number, payment_type: string) =>
    keyEvent('begin_checkout', { currency: 'USD', value: price, payment_type, site_section: 'services', items: [{ item_id, item_name, price, quantity: 1 }] }),

  checkoutReturn: (status: 'approved' | 'pending' | 'rejected' | 'unknown', offer_id = 'unknown') =>
    event('checkout_return', { status, offer_id, site_section: 'services' }),

  purchase: (transaction_id: string, item_id: string, item_name: string, price: number) =>
    keyEvent('purchase', { transaction_id, currency: 'USD', value: price, site_section: 'services', items: [{ item_id, item_name, price, quantity: 1 }] }),

  checkoutUnavailable: (item_id: string) =>
    event('checkout_unavailable', { item_id, site_section: 'services' }),

  serviceOnboardingStart: (item_id: string) =>
    event('service_onboarding_start', { item_id, site_section: 'services' }),

  serviceOnboardingComplete: (item_id: string) =>
    event('service_onboarding_complete', { item_id, site_section: 'services' }),

  pwaInstallEligible: () => event('pwa_install_eligible'),
  pwaInstallPromptView: () => event('pwa_install_prompt_view'),
  pwaInstallClick: () => event('pwa_install_click'),
  pwaInstallResult: (outcome: 'accepted' | 'dismissed') =>
    event(`pwa_install_${outcome}`),
  pwaInstalled: () => keyEvent('pwa_installed'),
  pwaLaunch: () => event('pwa_launch'),

  uiLayerClose: (layer: 'contact' | 'assistant' | 'video', method: string, site_section: string) =>
    event('ui_layer_close', { layer, close_method: method, site_section }),

  contentAction: (action: 'save' | 'unsave' | 'share', content_type: string, content_id: string, method?: string) =>
    event('content_action', { action, content_type, content_id, method, site_section: 'blog' }),

  share: (method: string, content_type: string, item_id: string) =>
    event('share', { method, content_type, item_id }),

  contentEngaged: (content_type: string, content_id: string, engagement_seconds: number, scroll_percent: number) =>
    event('content_engaged', { content_type, content_id, engagement_seconds, scroll_percent, site_section: 'blog' }),

  contentComplete: (content_type: string, content_id: string, scroll_percent: number) =>
    event('content_complete', { content_type, content_id, scroll_percent, site_section: 'blog' }),

  contentFilter: (content_type: string, filter_type: string, filter_value: string) =>
    event('content_filter', { content_type, filter_type, filter_value }),

  contentLoadMore: (content_type: string, visible_count: number) =>
    event('content_load_more', { content_type, visible_count }),

  contentSearch: (content_type: string, query_length: number, results_count: number) =>
    event('content_search', { content_type, query_length, results_count }),

  videoSelect: (video_id: string, source: string) =>
    event('video_select', { video_id, source, site_section: 'blog' }),

  videoStart: (video_id: string, source: string) =>
    event('video_start', { video_id, source, site_section: 'blog' }),

  videoProgress: (video_id: string, progress_percent: 25 | 50 | 75, source: string) =>
    event('video_progress', { video_id, progress_percent, source, site_section: 'blog' }),

  videoComplete: (video_id: string, source: string) =>
    event('video_complete', { video_id, source, site_section: 'blog' }),

  toolSelect: (tool_id: string, category: string) =>
    event('tool_select', { tool_id, category, site_section: 'recursos' }),

  toolView: (tool_id: string, source: 'initial' | 'tab' | 'direct') =>
    event('tool_view', { tool_id, source, site_section: 'recursos' }),

  toolStart: (tool_id: string) =>
    event('tool_start', { tool_id, site_section: 'recursos' }),

  toolResult: (tool_id: string, result_status: 'success' | 'empty' | 'fallback', result_band = 'not_apply') =>
    event('tool_result', { tool_id, result_status, result_band, site_section: 'recursos' }),

  toolError: (tool_id: string, error_code: string, recoverable: boolean) =>
    event('tool_error', { tool_id, error_code, recoverable, site_section: 'recursos' }),

  toolAction: (tool_id: string, action: string, detail?: string) =>
    event('tool_action', { tool_id, action, detail, site_section: 'recursos' }),

  mortgageDataLoad: (status: 'success' | 'error', load_source: 'initial' | 'retry', product_count = 0) =>
    event('mortgage_data_load', { status, load_source, product_count, site_section: 'recursos' }),

  mortgageToolView: (product_count: number, compatible_bank_count: number, market_signal: string) =>
    event('mortgage_tool_view', {
      product_count,
      compatible_bank_count,
      market_signal,
      site_section: 'recursos',
    }),

  mortgageSectionView: (section_name: string) =>
    event('mortgage_section_view', { section_name, site_section: 'recursos' }),

  mortgageSectionNavigation: (destination_section: string) =>
    event('mortgage_section_navigation', { destination_section, site_section: 'recursos' }),

  mortgageConfigurationUpdate: (parameters: {
    changed_parameters: string;
    changed_parameter_count: number;
    currency: string;
    property_value_status: string;
    exchange_rate_edited: boolean;
    down_payment_band: string;
    commission_enabled: boolean;
    commission_percent: number;
    deed_cost_percent: number;
    purpose: string;
    applicant_profile: string;
    term_years: number;
    income_provided: boolean;
    compatible_bank_count: number;
    has_result: boolean;
  }) => {
    const safeParameters: Record<string, unknown> = { ...parameters };
    delete safeParameters.applicant_profile;
    delete safeParameters.income_provided;
    event('mortgage_configuration_update', { ...safeParameters, site_section: 'recursos' });
  },

  mortgageBankSelect: (bank_name: string, selection_source: 'calculator' | 'ranking') =>
    event('mortgage_bank_select', { bank_name, selection_source, site_section: 'recursos' }),

  mortgageComparisonUpdate: (operation: 'add' | 'remove', bank_name: string, selected_count: number) =>
    event('mortgage_comparison_update', { operation, bank_name, selected_count, site_section: 'recursos' }),

  mortgageBankListToggle: (list_state: 'expanded' | 'collapsed', bank_count: number) =>
    event('mortgage_bank_list_toggle', { list_state, bank_count, site_section: 'recursos' }),

  mortgageAdditionalDataToggle: (panel_state: 'expanded' | 'collapsed') =>
    event('mortgage_additional_data_toggle', { panel_state, device_layout: 'mobile', site_section: 'recursos' }),

  mortgageResultNavigation: (compatible_bank_count: number) =>
    event('mortgage_result_navigation', {
      navigation_source: 'mobile_summary',
      compatible_bank_count,
      device_layout: 'mobile',
      site_section: 'recursos',
    }),

  mortgageScenarioUpdate: (parameters: {
    scenario_mode: string;
    monthly_uva_change: number;
    monthly_income_change: number;
    horizon_years: number;
  }) => event('mortgage_scenario_update', {
    scenario_mode: parameters.scenario_mode,
    monthly_uva_change_band: numericBand(parameters.monthly_uva_change, [1, 3], ['low', 'medium', 'high']),
    monthly_income_change_band: numericBand(parameters.monthly_income_change, [1, 3], ['low', 'medium', 'high']),
    horizon_years: parameters.horizon_years,
    site_section: 'recursos',
  }),

  mortgageMarketRangeSelect: (market_range: string, market_signal: string) =>
    event('mortgage_market_range_select', { market_range, market_signal, site_section: 'recursos' }),

  mortgageShareResult: (
    outcome: 'shared' | 'copied' | 'cancelled' | 'unavailable',
    share_method: 'native_share' | 'clipboard',
  ) => {
    event('mortgage_share_result', { outcome, share_method, site_section: 'recursos' });
    if (outcome === 'shared' || outcome === 'copied') {
      event('share', { method: share_method, content_type: 'mortgage_result', item_id: 'uva_mortgage_calculator' });
    }
  },

  mortgageMethodologyOpen: (methodology_section: 'scenario' | 'market_context') =>
    event('mortgage_methodology_open', { methodology_section, site_section: 'recursos' }),

  mortgageSourceClick: (source_name: string, source_section: 'closing_costs' | 'market_context' | 'mortgage_products') =>
    event('mortgage_source_click', { source_name, source_section, site_section: 'recursos' }),

  leadDelivery: (status: 'success' | 'error', source: string, form_type: string) =>
    event(`lead_webhook_${status}`, { source, form_type }),

  formView: (form_type: string, site_section: string) =>
    event('form_view', { form_type, site_section }),

  formStart: (form_type: string, site_section: string) =>
    event('form_start', { form_type, site_section }),

  formValidationError: (form_type: string, field_id: string, error_code: string, site_section: string) =>
    event('form_validation_error', { form_type, field_id, error_code, site_section }),

  formSubmitAttempt: (form_type: string, site_section: string) =>
    event('form_submit_attempt', { form_type, site_section }),

  scrollDepth: (percent: number, site_section = 'cv') =>
    event('scroll_depth', { percent, site_section }),

  sectionView: (section: string, site_section = 'cv') =>
    event('section_view', { section_name: section, site_section }),

  projectView: (projectTitle: string) =>
    event('project_view', { project_title: projectTitle }),

  experienceOpen: (company: string, role: string) =>
    event('experience_modal_open', { company, role }),

  // Enhanced-measurement-compatible download event for a generated CV.
  downloadCV: () =>
    keyEvent('file_download', { file_name: 'mariano_gobea_alcoba_cv.pdf', file_extension: 'pdf', content_type: 'cv', site_section: 'cv' }),

  socialClick: (platform: string) =>
    event('social_click', { platform, site_section: 'cv' }),

  consultingClick: () =>
    event('consulting_click', { site_section: 'cv' }),

  blogClick: (source = 'nav') =>
    event('blog_click', { source, site_section: 'cv' }),

  // Conversion funnel — step 1: user starts filling a form
  contactFormStart: (site_section: string) =>
    event('form_start', { form_type: 'contact', site_section }),

  // Conversion funnel — step 1: user focuses newsletter input
  newsletterFormFocus: (page: string) =>
    event('newsletter_form_focus', { page }),

  // Conversion funnel — proposal modal opened (step 1 before submit)
  proposalModalOpen: () =>
    event('proposal_modal_open', { site_section: 'consulting' }),

  // Newsletter subscription is not an account sign-up, so it remains custom.
  newsletterSubscribe: (page: string) =>
    keyEvent('newsletter_subscribe', { page, form_type: 'newsletter', method: 'newsletter_form' }),

  // KEY EVENT — GA4 recommended name: generate_lead (replaces lead_form_sent)
  leadFormSent: (page: string, form_type = 'contact') =>
    keyEvent('generate_lead', { page, form_type }),

  // KEY EVENT — Contact intent (opens contact modal)
  contactClick: (site_section = 'cv') =>
    keyEvent('contact_click', { site_section }),

  // Modal opened (not always preceded by contactClick if triggered programmatically)
  contactModalOpen: (site_section = 'cv') =>
    event('contact_modal_open', { site_section }),

  // User picked a channel inside the contact modal
  contactChannelSelect: (channel: 'whatsapp' | 'email', site_section = 'cv') =>
    keyEvent('contact_channel_select', { channel, site_section }),

  // KEY EVENT — direct WhatsApp contact (outside modal, e.g. ConsultingContact quick link)
  whatsappClick: (site_section = 'consulting') =>
    keyEvent('whatsapp_click', { site_section }),

  serviceView: (packId: string) =>
    event('service_view', { pack_id: packId, site_section: 'consulting' }),

  floatingCtaClick: (site_section: string) =>
    event('floating_cta_click', { site_section }),

  // Navigation Events
  navClick: (href: string, label: string, site_section = 'cv') =>
    event('nav_click', { ...linkContext(href), link_text: label, site_section }),

  languageSwitch: (from_language: string, to_language: string) =>
    event('language_switch', { from_language, to_language, site_section: 'cv' }),

  // Sound toggle on hero video
  soundToggle: (action: 'mute' | 'unmute') =>
    event('video_sound_toggle', { action, site_section: 'cv' }),

  // Blog Events
  blogCategoryFilter: (category: string) =>
    event('blog_category_filter', { category, site_section: 'blog' }),

  blogPostCardClick: (slug: string, title: string, category: string) =>
    event('blog_post_card_click', { slug, post_title: title, category, site_section: 'blog' }),

  blogPostRead: (slug: string, title: string) =>
    event('blog_post_read', { slug, post_title: title, site_section: 'blog' }),

  // Video selection is engagement; video completion can be promoted in GA4 if needed.
  youtubeVideoClick: (video_title: string, video_id: string) =>
    event('video_select', { video_title, video_id, source: 'video_card', site_section: 'blog' }),

  // Outbound link tracking (social/external links in footer)
  outboundClick: (url: string, label: string, site_section = 'cv') =>
    event('outbound_click', { ...linkContext(url), link_text: label, site_section }),

  // AI Assistant Events
  aiAssistantOpen: () =>
    event('ai_assistant_open', { site_section: 'cv' }),

  aiAssistantMessageSent: (message_length: number) =>
    event('ai_assistant_message_sent', {
      message_length_band: numericBand(message_length, [80, 300], ['short', 'medium', 'long']),
      site_section: 'cv',
    }),

  aiAssistantContactClick: () =>
    keyEvent('ai_assistant_contact_click', { site_section: 'cv' }),

  aiAssistantUserIdentified: () =>
    event('ai_assistant_user_identified', { site_section: 'cv' }),

  aiAssistantFormView: () =>
    event('ai_assistant_form_view', { site_section: 'cv' }),

  aiAssistantResponseResult: (status: 'success' | 'error', latency_band: string) =>
    event('ai_assistant_response_result', { status, latency_band, site_section: 'cv' }),

  // Resource Tools Events
  archVisualizerAddNode: (nodeId: string) =>
    event('arch_visualizer_add_node', { node_id: nodeId, site_section: 'recursos' }),
  
  archVisualizerClear: () =>
    event('arch_visualizer_clear', { site_section: 'recursos' }),

  roiCalculatorSimulate: (monthlySavings: number) =>
    keyEvent('roi_simulate', { 
      monthly_savings_band: numericBand(monthlySavings, [1000, 5000], ['low', 'medium', 'high']),
      site_section: 'recursos',
    }),

  appError: (component: string, operation: string, error_code: string, recoverable: boolean, site_section?: string) =>
    event('app_error', { component, operation, error_code, recoverable, site_section }),

  errorRecovery: (component: string, site_section?: string) =>
    event('error_recovery', { component, site_section }),
  
  // Agent Dashboard Events
  agentDashboardFilterUsed: (filter: string) =>
    event('agent_dashboard_filter_used', { filter, site_section: 'recursos' }),
  
  agentDashboardCtaClicked: (cta_type: string) =>
    keyEvent('agent_dashboard_cta_click', { cta_type, site_section: 'recursos' }),
};
