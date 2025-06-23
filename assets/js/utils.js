// utils.js - Shared utility functions 

// =================================================================================
// --- DOM UTILITIES
// =================================================================================

/**
 * A simple DOM manipulation utility object.
 */
export const DOM = {
    /**
     * Finds a single DOM element.
     * @param {string} selector - The CSS selector.
     * @returns {HTMLElement|null}
     */
    find: (selector) => document.querySelector(selector),

    /**
     * Finds all DOM elements matching a selector.
     * @param {string} selector - The CSS selector.
     * @returns {NodeListOf<HTMLElement>}
     */
    findAll: (selector) => document.querySelectorAll(selector),

    /**
     * Hides one or more DOM elements.
     * @param {...HTMLElement} elements - The elements to hide.
     */
    hide: (...elements) => {
        elements.forEach(el => el && el.classList.add('hidden'));
    },

    /**
     * Shows one or more DOM elements.
     * @param {...HTMLElement} elements - The elements to show.
     */
    show: (...elements) => {
        elements.forEach(el => el && el.classList.remove('hidden'));
    }
};

// =================================================================================
// --- STORAGE UTILITIES
// =================================================================================

/**
 * A utility object for interacting with localStorage.
 */
export const Storage = {
    /**
     * Gets an item from localStorage, gracefully handling JSON parsing.
     * @param {string} key - The key of the item.
     * @param {*} [defaultValue=null] - The default value if the item doesn't exist.
     * @returns {*}
     */
    get: (key, defaultValue = null) => {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        try {
            // Attempt to parse it as JSON (new format)
            return JSON.parse(item);
        } catch (e) {
            // If it fails, return it as a plain string (legacy format)
            return item;
        }
    },

    /**
     * Sets an item in localStorage.
     * @param {string} key - The key of the item.
     * @param {*} value - The value to store.
     */
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// =================================================================================
// --- ANIMATION UTILITIES
// =================================================================================

/**
 * Sets up an IntersectionObserver to add a 'is-visible' class
 * to elements when they enter the viewport.
 */
export function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    DOM.findAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

export function debounce(func, wait) {
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

export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// =================================================================================
// --- STRING UTILITIES
// =================================================================================

export function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function truncate(str, length = 100, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
}

// =================================================================================
// --- VALIDATION UTILITIES
// =================================================================================

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

// =================================================================================
// --- ERROR HANDLING
// =================================================================================

/**
 * A simple error handler for the application.
 * @param {Error} error - The error object.
 * @param {string} [context='Unknown'] - The context where the error occurred.
 */
export function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    // In a real-world application, this could be expanded to log errors
    // to a service like Sentry, LogRocket, etc.
}

export function safeExecute(func, fallback = null, context = '') {
    try {
        return func();
    } catch (error) {
        handleError(error, context);
        return fallback;
    }
}

// =================================================================================
// --- PERFORMANCE UTILITIES
// =================================================================================

export function measurePerformance(name, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

export function asyncMeasurePerformance(name, asyncFunc) {
    const start = performance.now();
    return asyncFunc().then(result => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    });
}

// =================================================================================
// --- BROWSER UTILITIES
// =================================================================================

export function isMobile() {
    return window.innerWidth <= 768;
}

export function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

export function isDesktop() {
    return window.innerWidth > 1024;
}

export function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const browserInfo = {
        userAgent,
        isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
        isFirefox: /Firefox/.test(userAgent),
        isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
        isEdge: /Edge/.test(userAgent),
        isIE: /MSIE|Trident/.test(userAgent)
    };
    
    return browserInfo;
}

// =================================================================================
// --- DATE UTILITIES
// =================================================================================

export function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    
    return new Date(date).toLocaleDateString(undefined, defaultOptions);
}

export function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

export function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
}

export function getRandomColor() {
    const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry(fn, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                if (retries > 0) {
                    setTimeout(() => {
                        retry(fn, retries - 1, delay)
                            .then(resolve)
                            .catch(reject);
                    }, delay);
                } else {
                    reject(error);
                }
            });
    });
} 