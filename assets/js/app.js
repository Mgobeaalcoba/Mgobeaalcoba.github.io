// app.js - Main file that orchestrates all modules

import logger from './logger.js';
import { initializeApp, setLanguage } from './main.js';
import { initializeThemes, applyTheme } from './themes.js';
// Terminal will be loaded dynamically when needed
import { startIntro } from './intro.js';
import { setupPdfGeneration } from './pdf.js';
import { setupScrollAnimations } from './utils.js';

// =================================================================================
// --- APPLICATION INITIALIZATION
// =================================================================================

class CVApp {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.currentLang = localStorage.getItem('language') || 'es';
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            logger.debug('CVApp', 'Initializing CV Application...');
            
            // Start intro animation
            startIntro();
            
            // Wait for intro to complete or user interaction
            await this.waitForIntroCompletion();
            
            // Initialize all modules
            this.initializeModules();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Apply initial state
            this.applyInitialState();
            
            this.isInitialized = true;
            logger.success('CVApp', 'CV Application initialized successfully');
            
        } catch (error) {
            logger.error('❌ Error initializing CV Application:', error);
            this.handleInitializationError(error);
        }
    }

    async waitForIntroCompletion() {
        return new Promise((resolve) => {
            const checkIntro = () => {
                const introOverlay = document.getElementById('intro-overlay');
                if (introOverlay && introOverlay.classList.contains('hidden')) {
                    resolve();
                } else {
                    setTimeout(checkIntro, 100);
                }
            };
            checkIntro();
        });
    }

    initializeModules() {
        // Initialize main app functionality
        initializeApp();
        
        // Initialize themes
        initializeThemes();
        
        // Terminal will be initialized dynamically when CLI theme is selected
        
        // Setup PDF generation
        setupPdfGeneration();
        
        // Setup scroll animations
        setupScrollAnimations();
    }

    setupEventListeners() {
        // Language change listeners
        const langEsBtn = document.getElementById('lang-es');
        const langEnBtn = document.getElementById('lang-en');
        
        if (langEsBtn) {
            langEsBtn.addEventListener('click', async () => {
                await this.setLanguage('es');
            });
        }
        
        if (langEnBtn) {
            langEnBtn.addEventListener('click', async () => {
                await this.setLanguage('en');
            });
        }

        // Theme change listener
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', async () => {
                await this.cycleTheme();
            });
        }

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    async applyInitialState() {
        // Apply saved theme
        applyTheme(this.currentTheme);
        
        // Apply saved language
        setLanguage(this.currentLang);
        
        // Initialize terminal if in CLI mode (dynamic import)
        if (this.currentTheme === 'cli') {
            await this.initializeTerminal(this.currentLang);
        }
    }

    async setLanguage(lang) {
        this.currentLang = lang;
        setLanguage(lang);
        
        // Reinitialize terminal if in CLI mode (dynamic)
        if (this.currentTheme === 'cli') {
            await this.initializeTerminal(lang);
        }
    }

    async cycleTheme() {
        const themes = ['dark', 'light', 'cli'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.currentTheme = themes[nextIndex];
        
        localStorage.setItem('theme', this.currentTheme);
        applyTheme(this.currentTheme);
        
        if (this.currentTheme === 'cli') {
            await this.initializeTerminal(this.currentLang);
        }
    }

    async initializeTerminal(lang) {
        try {
            logger.debug('CVApp', 'Loading terminal module dynamically...');
            
            // Dynamic import of terminal module
            const terminalModule = await import('./terminal.js');
            
            // Initialize terminal with current language
            terminalModule.initTerminal(lang);
            terminalModule.initializeTerminalInput();
            
            logger.success('CVApp', 'Terminal module loaded and initialized');
        } catch (error) {
            logger.error('Failed to load terminal module:', error);
        }
    }

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth <= 768;
        
        // Update any mobile-specific behaviors here
        if (isMobile) {
            // Mobile-specific adjustments
        } else {
            // Desktop-specific adjustments
        }
    }

    handleInitializationError(error) {
        logger.error('Application initialization failed:', error);
        
        // Fallback: try to show basic content
        const pageContent = document.getElementById('page-content');
        const topControls = document.querySelector('.top-controls');
        
        if (pageContent) pageContent.classList.remove('content-hidden');
        if (topControls) topControls.classList.remove('content-hidden');
        
        // Remove intro overlay
        const introOverlay = document.getElementById('intro-overlay');
        if (introOverlay) introOverlay.classList.add('hidden');
        document.body.classList.remove('intro-active');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// =================================================================================
// --- GLOBAL EXPORTS
// =================================================================================

// Create global app instance
window.cvApp = new CVApp();

// Export functions to global scope for HTML compatibility
window.openExperienceModal = function(jobId) {
    // This would be implemented in main.js or a separate modal module
    logger.debug('ExperienceModal', 'Opening experience modal for job', { jobId });
};

window.closeExperienceModal = function() {
    // This would be implemented in main.js or a separate modal module
    logger.debug('ExperienceModal', 'Closing experience modal');
};

window.filterProjects = function(tag) {
    // This is already exported from main.js
    logger.debug('ProjectFilter', 'Filtering projects by tag', { tag });
};

window.trackSocialClick = function(event, platform) {
    // This is already exported from main.js
    logger.debug('Analytics', 'Tracking social click for platform', { platform });
};

// =================================================================================
// --- DOM READY INITIALIZATION
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    logger.debug('CVApp', 'DOM loaded, starting CV application...');
    window.cvApp.initialize();
});

// =================================================================================
// --- ERROR HANDLING
// =================================================================================

window.addEventListener('error', (event) => {
    logger.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason);
}); 