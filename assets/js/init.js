// init.js - Main initialization script

// =================================================================================
// IMPORTS
// =================================================================================

import { experienceData } from './data.js';
import { setLanguage } from './main.js';
import { initTerminal, startMatrixEffect } from './terminal.js';
import { startIntro } from './intro.js';
import { setupPdfGeneration } from './pdf.js';
import { DOM, Storage, setupScrollAnimations, handleError } from './utils.js';

// =================================================================================
// GLOBAL VARIABLES
// =================================================================================

let currentFilter = null;

// =================================================================================
// PROJECT FILTERING
// =================================================================================

async function filterProjects(tag) {
    const alreadyActive = currentFilter === tag;
    const newFilter = alreadyActive ? null : tag;
    
    currentFilter = newFilter;

    DOM.findAll('#tech-stack-container .tag').forEach(t => {
        t.classList.toggle('active', t.textContent === tag && !alreadyActive);
    });

    // Update all sections with the new filter
    const { updateFilter } = await import('./main.js');
    updateFilter(currentFilter);
}

async function filterProjectsByCategory(category) {
    const alreadyActive = currentFilter === category;
    const newFilter = alreadyActive ? null : category;
    
    currentFilter = newFilter;

    // Clear all active states
    DOM.findAll('#tech-stack-container .tag').forEach(t => {
        t.classList.remove('active');
    });

    // Update all sections with the new filter
    const { updateFilter } = await import('./main.js');
    updateFilter(currentFilter);
}

// =================================================================================
// EXPERIENCE MODAL
// =================================================================================

function openExperienceModal(jobId) {
    const lang = Storage.get('language', 'es');
    const job = experienceData.find(j => j.id === jobId);
    if (!job) return;
    
    DOM.find('#modal-date').textContent = job.date[lang];
    DOM.find('#modal-title').textContent = job.title[lang];
    DOM.find('#modal-company').textContent = job.company;
    DOM.find('#modal-description').innerHTML = job.description[lang];
    DOM.find('#experience-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeExperienceModal() {
    DOM.find('#experience-modal').classList.remove('show');
    document.body.style.overflow = '';
}

// =================================================================================
// MAIN APP INITIALIZATION
// =================================================================================

async function initializeMainApp() {
    console.log('[init.js] Initializing main application after intro...');
    
    // Dynamically import theme functions to ensure they are ready
    const themeModule = await import('./themes.js');
    
    // Initialize themes (reads localStorage and applies theme)
    themeModule.initializeThemes();
    
    // Setup PDF generation
    setupPdfGeneration();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Set initial language
    const savedLang = Storage.get('language', 'es');
    setLanguage(savedLang);
    
    // Ensure main content is visible after setup
    const pageContent = DOM.find('#page-content');
    const topControls = DOM.find('.top-controls');
    
    if (themeModule.getCurrentTheme() !== 'cli') {
        DOM.show(pageContent, topControls);
    }
    
    console.log('✅ Main CV App components initialized');
}

// =================================================================================
// EVENT LISTENERS
// =================================================================================

function setupEventListeners() {
    console.log('[init.js] Setting up event listeners');
    // Theme toggle is handled by initializeThemes in themes.js
    
    // Language toggles
    DOM.find('#lang-es')?.addEventListener('click', () => setLanguage('es'));
    DOM.find('#lang-en')?.addEventListener('click', () => setLanguage('en'));

    // Terminal input (moves from here, initialized with the theme)
    
    // Intro controls
    DOM.find('#intro-lang-es')?.addEventListener('click', async () => {
        const { updateLangToggle } = await import('./intro.js');
        updateLangToggle('es');
    });
    DOM.find('#intro-lang-en')?.addEventListener('click', async () => {
        const { updateLangToggle } = await import('./intro.js');
        updateLangToggle('en');
    });
    
    const introThemeBtn = DOM.find('#intro-theme-btn');
    if (introThemeBtn) {
        introThemeBtn.addEventListener('click', async () => {
            const { cycleIntroTheme } = await import('./intro.js');
            cycleIntroTheme();
        });
    }
}

// =================================================================================
// INITIALIZATION
// =================================================================================

function initializeApp() {
    try {
        console.log('[init.js] initializeApp START');
        
        // Setup event listeners that are safe to run before intro
        setupEventListeners();
        
        // Listen for the intro to complete, then initialize the main app
        document.addEventListener('introCompleted', initializeMainApp, { once: true });
        
        // Start intro animation
        startIntro();
        
        console.log('✅ CV App initialization sequence started.');
        
    } catch (error) {
        handleError(error, 'App initialization');
        console.error('❌ Failed to initialize CV App:', error);
    }
}

// =================================================================================
// GLOBAL EXPORTS (for inline HTML onclick handlers)
// =================================================================================

window.openExperienceModal = openExperienceModal;
window.closeExperienceModal = closeExperienceModal;
window.filterProjects = filterProjects;
window.filterProjectsByCategory = filterProjectsByCategory;
window.trackSocialClick = async (event, platform) => {
    const { trackSocialClick } = await import('./main.js');
    trackSocialClick(event, platform);
};
window.startMatrixEffect = startMatrixEffect;

// =================================================================================
// DOM-READY EXECUTION
// =================================================================================

document.addEventListener('DOMContentLoaded', initializeApp); 