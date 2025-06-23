// main.js - Core application logic and content population

import { techStackData, projectsData, experienceData, educationData, certificationsData } from './data.js';
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

export function trackSocialClick(event, platform) {
    event.preventDefault();
    const url = event.currentTarget.href;
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