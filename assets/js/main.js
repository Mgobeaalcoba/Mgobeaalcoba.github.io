// main.js - Core application logic and content population

import { techStackData, projectsData, experienceData, educationData, certificationsData } from './data-index.js';
import { translations } from './translations.js';
import { DOM, Storage } from './utils.js';

// =================================================================================
// UI POPULATION FUNCTIONS
// =================================================================================

// Helper function to get all technologies from a category
function getTechnologiesFromCategory(category) {
    return techStackData[category] || [];
}

// Helper function to check if a project matches any technology in a category
function projectMatchesCategory(project, category) {
    const categoryTechnologies = getTechnologiesFromCategory(category);
    return project.tags.some(tag => categoryTechnologies.includes(tag));
}

// Helper function to check if an item (experience, education, certification) matches filter
function itemMatchesFilter(item, filterTag) {
    if (!filterTag) return true;
    
    // Check if filterTag is a category name
    if (techStackData[filterTag]) {
        const categoryTechnologies = getTechnologiesFromCategory(filterTag);
        return item.tags && item.tags.some(tag => categoryTechnologies.includes(tag));
    } else {
        // Filter by specific technology
        return item.tags && item.tags.includes(filterTag);
    }
}

export function populateTechStack(lang) {
    const container = DOM.find('#tech-stack-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (const category in techStackData) {
        const categoryKey = `stack_${category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`;
        const categoryDisplayName = translations[categoryKey] ? translations[categoryKey][lang] : category;
        
        // Create category header that acts as a filter
        const categoryHeader = `<h4 class="font-semibold text-sm uppercase tracking-wider text-secondary mb-2 cursor-pointer hover:text-primary transition-colors" onclick="filterProjectsByCategory('${category}')" data-translate="${categoryKey}">${categoryDisplayName}</h4>`;
        
        // Create individual technology tags
        const tagsHTML = techStackData[category].map(tag => 
            `<span class="tag" onclick="filterProjects('${tag}')">${tag}</span>`
        ).join('');
        
        container.innerHTML += `<div>${categoryHeader}<div class="flex flex-wrap gap-2">${tagsHTML}</div></div>`;
    }
}

export function populateProjects(lang, filterTag = null) {
    const container = DOM.find('#projects-container');
    if (!container) return;
    
    let filteredProjects;
    if (filterTag) {
        // Check if filterTag is a category name
        if (techStackData[filterTag]) {
            // Filter by category - show projects that use any technology from this category
            filteredProjects = projectsData.filter(project => projectMatchesCategory(project, filterTag));
        } else {
            // Filter by specific technology
            filteredProjects = projectsData.filter(p => p.tags.includes(filterTag));
        }
    } else {
        filteredProjects = projectsData;
    }
    
    if (filteredProjects.length === 0 && filterTag) {
        const filterDisplayName = techStackData[filterTag] ? 
            (translations[`stack_${filterTag.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`] ? 
             translations[`stack_${filterTag.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`][lang] : 
             filterTag) : 
            filterTag;
        
        container.innerHTML = `<p class="text-secondary">No projects for '${filterDisplayName}'. <a href="#" onclick="filterProjects(null); return false;" class="text-sky-400">Show all</a>.</p>`;
        return;
    }
    
    container.innerHTML = filteredProjects.map(project =>
        `<div class="project-item avoid-break p-4 rounded-lg glass-effect interactive">
            <h4 class="text-lg font-bold">${project.title[lang]}</h4>
            <p class="text-secondary text-sm mb-2">${project.description[lang]}</p>
            <a href="${project.link}" target="_blank" class="text-sm icon-link" style="color: var(--primary-color);" onclick="trackSocialClick(event, 'GitHub Project')"><i class="fab fa-github mr-1"></i> <span>${translations.view_repo[lang]}</span></a>
        </div>`
    ).join('');
}

export function populateExperience(lang, filterTag = null) {
    const container = DOM.find('#experience-timeline');
    if (!container) return;
    
    const filteredExperience = filterTag ? experienceData.filter(exp => itemMatchesFilter(exp, filterTag)) : experienceData;
    
    if (filteredExperience.length === 0 && filterTag) {
        container.innerHTML = `<p class="text-secondary">No experience found for this technology.</p>`;
        return;
    }
    
    container.innerHTML = filteredExperience.map((job, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        return `<div class="timeline-container ${side}">
                    <div class="timeline-item glass-effect" onclick="openExperienceModal(${job.id})">
                        <div class="see-more-indicator">
                            <span data-translate="see_more">${translations.see_more[lang]}</span>
                            <i class="fas fa-external-link-alt fa-xs"></i>
                        </div>
                        <div class="pr-12">
                            <p class="font-semibold text-sm" style="color: var(--primary-color);">${job.date[lang]}</p>
                            <h4 class="text-lg font-bold mt-1">${job.title[lang]}</h4>
                            <p class="font-semibold text-base text-secondary">${job.company}</p>
                        </div>
                    </div>
                </div>`;
    }).join('');
}

export function populateEducation(lang, filterTag = null) {
    const container = DOM.find('#education-list');
    if (!container) return;
    
    const filteredEducation = filterTag ? educationData.filter(edu => itemMatchesFilter(edu, filterTag)) : educationData;
    
    if (filteredEducation.length === 0 && filterTag) {
        container.innerHTML = `<p class="text-secondary">No education found for this technology.</p>`;
        return;
    }
    
    container.innerHTML = filteredEducation.map(edu => {
        const subtitleHTML = edu.subtitle ? `<p>${edu.subtitle[lang]}</p>` : '';
        return `<li>
                    <p class="font-semibold" style="color: var(--text-color);">${edu.title[lang]}</p>
                    ${subtitleHTML}
                    <p>${edu.school}</p>
                    <p class="text-sm">${edu.date}</p>
                </li>`;
    }).join('');
}

export function populateCerts(filterTag = null) {
    const container = DOM.find('#cert-list');
    if (!container) return;
    
    const filteredCerts = filterTag ? certificationsData.filter(cert => itemMatchesFilter(cert, filterTag)) : certificationsData;
    
    if (filteredCerts.length === 0 && filterTag) {
        container.innerHTML = `<p class="text-secondary">No certifications found for this technology.</p>`;
        return;
    }
    
    container.innerHTML = filteredCerts.map(cert => `<p>${cert.name}</p>`).join('');
}

// ============== GOOGLE ANALYTICS TRACKING FOR INDEX.HTML ==============

function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            custom_parameter_1: 'portfolio_page',
            page_location: window.location.href,
            page_title: document.title,
            ...eventData
        });
        console.log(`[Analytics] Event tracked: ${eventName}`, eventData);
    } else {
        console.warn('[Analytics] gtag not available');
    }
}

export function trackSocialClick(event, platform) {
    event.preventDefault();
    const url = event.currentTarget.href;
    
    // Track the social click event
    trackEvent('social_engagement', {
        social_platform: platform,
        link_url: url,
        engagement_type: 'social_click'
    });
    
    try {
        if (typeof gtag === 'function') {
            gtag('event', 'social_click', {
                'social_platform': platform,
                'link_url': url,
                'event_callback': function () { window.open(url, '_blank'); },
                'event_timeout': 500
            });
            setTimeout(() => window.open(url, '_blank'), 500);
        } else {
            window.open(url, '_blank');
        }
    } catch (err) {
        console.warn('Error in trackSocialClick:', err);
        window.open(url, '_blank');
    }
}

export function initializeIndexAnalytics() {
    console.log('[Analytics] Initializing index.html tracking...');
    
    // Track page view
    trackEvent('page_view', {
        page_location: window.location.href,
        page_title: document.title,
        page_type: 'portfolio'
    });

    // Track CV download (primary conversion)
    const downloadBtn = DOM.find('#download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            trackEvent('cv_download', {
                conversion_type: 'cv_download',
                file_type: 'pdf',
                value: 1,
                section: 'contact'
            });
        });
    }

    // Track consulting navigation (primary conversion)
    const consultingBtns = DOM.findAll('[href="consulting.html"]');
    consultingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isTeaser = btn.closest('[data-translate="consulting_teaser_btn"]');
            trackEvent('consulting_interest', {
                conversion_type: 'consulting_navigation',
                button_location: isTeaser ? 'teaser_section' : 'header',
                value: 1
            });
        });
    });

    // Track Calendly scheduling (primary conversion)
    const calendlyBtns = DOM.findAll('[onclick*="Calendly"]');
    calendlyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('scheduling_interest', {
                conversion_type: 'calendly_click',
                calendar_type: 'calendly',
                value: 1,
                section: 'header'
            });
        });
    });

    // Track project interactions
    document.addEventListener('click', (e) => {
        const projectLink = e.target.closest('[onclick*="GitHub Project"]');
        if (projectLink) {
            trackEvent('project_engagement', {
                engagement_type: 'project_link',
                project_url: projectLink.href,
                section: 'projects'
            });
        }
    });

    // Track experience modal opens
    window.originalOpenExperienceModal = window.openExperienceModal;
    window.openExperienceModal = function(jobId) {
        trackEvent('experience_detail', {
            engagement_type: 'modal_open',
            job_id: jobId,
            section: 'experience'
        });
        window.originalOpenExperienceModal(jobId);
    };

    // Track technology filter usage
    window.originalFilterProjects = window.filterProjects;
    window.filterProjects = function(tag) {
        if (tag) {
            trackEvent('tech_filter', {
                engagement_type: 'technology_filter',
                technology: tag,
                section: 'tech_stack'
            });
        }
        window.originalFilterProjects(tag);
    };

    // Track theme changes
    document.addEventListener('click', (e) => {
        if (e.target.closest('#theme-toggle, #intro-theme-btn, #theme-btn-terminal')) {
            trackEvent('theme_change', {
                engagement_type: 'theme_toggle',
                interaction_type: 'theme_switch'
            });
        }
    });

    // Track language changes
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('[data-lang]');
        if (langBtn) {
            const language = langBtn.getAttribute('data-lang');
            trackEvent('language_change', {
                engagement_type: 'language_switch',
                language: language,
                previous_language: document.documentElement.lang
            });
        }
    });

    // Track terminal mode activation
    document.addEventListener('click', (e) => {
        if (e.target.closest('[onclick*="terminal"]') || e.target.closest('#terminal-btn')) {
            trackEvent('terminal_activation', {
                engagement_type: 'terminal_mode',
                interaction_type: 'advanced_user'
            });
        }
    });

    // Track scroll depth (engagement metric)
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
            maxScrollDepth = scrollPercent;
            trackEvent('scroll_depth', {
                scroll_percent: scrollPercent,
                engagement_type: 'page_scroll',
                page_type: 'portfolio'
            });
        }
    };

    // Track time on page (engagement metric)
    let timeOnPage = 0;
    const trackTimeOnPage = () => {
        timeOnPage += 30;
        if (timeOnPage % 60 === 0) { // Every minute
            trackEvent('time_on_page', {
                time_seconds: timeOnPage,
                engagement_type: 'session_duration',
                milestone: `${timeOnPage/60}min`
            });
        }
    };

    // Track section visibility (engagement)
    const sections = ['about', 'projects', 'experience', 'contact'];
    const observedSections = new Set();
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !observedSections.has(entry.target.id)) {
                observedSections.add(entry.target.id);
                trackEvent('section_view', {
                    section_name: entry.target.id,
                    engagement_type: 'section_scroll',
                    view_order: observedSections.size
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(sectionId => {
        const section = DOM.find(`#${sectionId}`);
        if (section) sectionObserver.observe(section);
    });

    // Set up scroll and time tracking
    window.addEventListener('scroll', trackScrollDepth);
    setInterval(trackTimeOnPage, 30000); // Track every 30 seconds

    console.log('[Analytics] Index analytics tracking initialized');
}

// =================================================================================
// LANGUAGE & CONTENT MANAGEMENT
// =================================================================================

// Global variable to track current filter
let currentFilter = null;

export async function setLanguage(lang) {
    document.documentElement.lang = lang;
    DOM.findAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            el.innerHTML = translations[key][lang];
        }
    });
    
    // Pass current filter to all population functions
    populateProjects(lang, currentFilter); 
    populateExperience(lang, currentFilter);
    populateEducation(lang, currentFilter);
    populateCerts(currentFilter);
    populateTechStack(lang);
    Storage.set('language', lang);
    
    // Update active language button
    const langEsBtn = DOM.find('#lang-es');
    const langEnBtn = DOM.find('#lang-en');
    if (langEsBtn) langEsBtn.classList.toggle('active', lang === 'es');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
    
    // Re-initialize the terminal to apply the new language.
    // This is more robust than trying to partially update its content.
    const { initTerminal } = await import('./terminal.js');
    if (document.body.classList.contains('terminal-mode-active')) {
        initTerminal(lang);
    }
}

// Function to update current filter and repopulate all sections
export function updateFilter(filterTag) {
    currentFilter = filterTag;
    const lang = Storage.get('language', 'es');
    
    // Repopulate all sections with the new filter
    populateProjects(lang, currentFilter);
    populateExperience(lang, currentFilter);
    populateEducation(lang, currentFilter);
    populateCerts(currentFilter);
} 