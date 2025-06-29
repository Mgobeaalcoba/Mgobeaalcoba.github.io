// mobile-menu.js - Centralized mobile menu functionality

import logger from './logger.js';

/**
 * Initialize mobile menu functionality
 * @param {Object} config - Configuration object
 * @param {string} config.menuButtonId - ID of the menu button element  
 * @param {string} config.menuId - ID of the menu container element
 * @param {string} config.context - Context name for logging (e.g., 'Index', 'Consulting')
 * @returns {boolean} - Success status
 */
export function initializeMobileMenu({
    menuButtonId = 'mobile-menu-btn',
    menuId = 'mobile-nav', 
    context = 'MobileMenu'
} = {}) {
    logger.debug(context, 'Initializing mobile menu...', { menuButtonId, menuId });
    
    const mobileMenuBtn = document.getElementById(menuButtonId);
    const mobileNav = document.getElementById(menuId);
    
    logger.debug(context, 'Mobile menu elements found', {
        hasButton: !!mobileMenuBtn,
        hasNav: !!mobileNav
    });
    
    if (!mobileMenuBtn || !mobileNav) {
        logger.error(`[${context}] Mobile menu elements not found!`, {
            menuButtonId,
            menuId,
            buttonExists: !!mobileMenuBtn,
            navExists: !!mobileNav
        });
        return false;
    }
    
    logger.debug(context, 'Setting up event listeners...');
    
    // Main menu toggle functionality
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        logger.debug(context, 'Menu button clicked');
        
        mobileNav.classList.toggle('hidden');
        
        // Update ARIA attributes for accessibility
        const isExpanded = !mobileNav.classList.contains('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded.toString());
    });
    
    // Close menu when clicking on navigation links
    const mobileLinks = mobileNav.querySelectorAll('a');
    logger.debug(context, 'Found mobile links', { count: mobileLinks.length });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            logger.debug(context, 'Mobile link clicked, closing menu');
            closeMobileMenu(mobileNav, mobileMenuBtn);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu(mobileNav, mobileMenuBtn);
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu(mobileNav, mobileMenuBtn);
        }
    });
    
    // Initialize ARIA attributes
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', menuId);
    mobileNav.setAttribute('aria-labelledby', menuButtonId);
    
    logger.success(context, 'Mobile menu initialization complete');
    return true;
}

/**
 * Close mobile menu helper function
 * @param {HTMLElement} mobileNav - Mobile navigation element
 * @param {HTMLElement} mobileMenuBtn - Mobile menu button element
 */
function closeMobileMenu(mobileNav, mobileMenuBtn) {
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

/**
 * Open mobile menu programmatically
 * @param {string} menuId - ID of the menu container
 * @param {string} menuButtonId - ID of the menu button
 */
export function openMobileMenu(menuId = 'mobile-nav', menuButtonId = 'mobile-menu-btn') {
    const mobileNav = document.getElementById(menuId);
    const mobileMenuBtn = document.getElementById(menuButtonId);
    
    if (mobileNav && mobileMenuBtn) {
        mobileNav.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        logger.debug('MobileMenu', 'Menu opened programmatically');
    }
}

/**
 * Close mobile menu programmatically
 * @param {string} menuId - ID of the menu container
 * @param {string} menuButtonId - ID of the menu button
 */
export function closeMobileMenuById(menuId = 'mobile-nav', menuButtonId = 'mobile-menu-btn') {
    const mobileNav = document.getElementById(menuId);
    const mobileMenuBtn = document.getElementById(menuButtonId);
    
    if (mobileNav && mobileMenuBtn) {
        closeMobileMenu(mobileNav, mobileMenuBtn);
        logger.debug('MobileMenu', 'Menu closed programmatically');
    }
}

/**
 * Toggle mobile menu programmatically
 * @param {string} menuId - ID of the menu container
 * @param {string} menuButtonId - ID of the menu button
 */
export function toggleMobileMenu(menuId = 'mobile-nav', menuButtonId = 'mobile-menu-btn') {
    const mobileNav = document.getElementById(menuId);
    
    if (mobileNav) {
        const isHidden = mobileNav.classList.contains('hidden');
        if (isHidden) {
            openMobileMenu(menuId, menuButtonId);
        } else {
            closeMobileMenuById(menuId, menuButtonId);
        }
    }
}

/**
 * Check if mobile menu is open
 * @param {string} menuId - ID of the menu container
 * @returns {boolean} - True if menu is open
 */
export function isMobileMenuOpen(menuId = 'mobile-nav') {
    const mobileNav = document.getElementById(menuId);
    return mobileNav ? !mobileNav.classList.contains('hidden') : false;
}

/**
 * Initialize mobile menu with specific configuration for index page
 * @returns {boolean} - Success status
 */
export function initializeIndexMobileMenu() {
    return initializeMobileMenu({
        menuButtonId: 'mobile-menu-btn-index',
        menuId: 'mobile-nav-index',
        context: 'Index'
    });
}

/**
 * Initialize mobile menu with specific configuration for consulting page
 * @returns {boolean} - Success status
 */
export function initializeConsultingMobileMenu() {
    return initializeMobileMenu({
        menuButtonId: 'mobile-menu-btn',
        menuId: 'mobile-nav',
        context: 'Consulting'
    });
}

// Log module initialization
logger.debug('MobileMenu', 'Mobile menu module initialized'); 