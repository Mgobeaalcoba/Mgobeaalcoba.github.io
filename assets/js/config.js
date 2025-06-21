// config.js - Configuración del proyecto

// =================================================================================
// --- APP CONFIGURATION
// =================================================================================

export const APP_CONFIG = {
    name: 'Mariano Gobea Alcoba CV',
    version: '1.0.0',
    author: 'Mariano Gobea Alcoba',
    description: 'Interactive CV for Data & Analytics Technical Leader',
    
    // Default settings
    defaults: {
        language: 'es',
        theme: 'dark',
        introDuration: 12000, // 12 seconds
        typingSpeed: 50, // milliseconds per character
        deleteSpeed: 30, // milliseconds per character
    },
    
    // Animation settings
    animations: {
        scrollThreshold: 0.1,
        transitionDuration: 300,
        matrixFrameRate: 33, // ~30 FPS
    },
    
    // Terminal settings
    terminal: {
        welcomeDelay: 100,
        commandHistory: 50,
        maxOutputLines: 1000,
    },
    
    // PDF settings
    pdf: {
        format: 'a4',
        orientation: 'portrait',
        scale: 1,
        backgroundColor: '#f9fafb',
        filename: 'CV-MarianoGobeaAlcoba.pdf',
    },
    
    // Analytics settings
    analytics: {
        enabled: true,
        trackingId: 'G-DG0SLT5RY3',
        events: {
            socialClick: 'social_click',
            themeChange: 'theme_change',
            languageChange: 'language_change',
            pdfDownload: 'pdf_download',
            terminalCommand: 'terminal_command',
        }
    },
    
    // Social links
    social: {
        linkedin: 'https://www.linkedin.com/in/mariano-gobea-alcoba/',
        github: 'https://github.com/Mgobeaalcoba',
        twitter: 'https://x.com/MGobeaAlcoba',
        calendly: 'https://calendly.com/mariano-gobea-mercadolibre/30min',
    },
    
    // Contact information
    contact: {
        email: 'gobeamariano@gmail.com',
        phone: '+54 9 11 27475569',
        location: 'Buenos Aires, Argentina',
    },
    
    // Feature flags
    features: {
        intro: true,
        terminal: true,
        matrix: true,
        pdfExport: true,
        analytics: true,
        responsive: true,
        accessibility: true,
    }
};

// =================================================================================
// --- THEME CONFIGURATION
// =================================================================================

export const THEME_CONFIG = {
    dark: {
        name: 'dark',
        label: { es: 'Oscuro', en: 'Dark' },
        icon: 'fas fa-sun',
        colors: {
            bg: '#111827',
            text: '#d1d5db',
            primary: '#38bdf8',
            secondary: '#9ca3af',
            border: '#374151',
            card: 'rgba(31, 41, 55, 0.5)',
            cardBorder: 'rgba(255, 255, 255, 0.1)',
        }
    },
    light: {
        name: 'light',
        label: { es: 'Claro', en: 'Light' },
        icon: 'fas fa-moon',
        colors: {
            bg: '#f9fafb',
            text: '#1f2937',
            primary: '#0ea5e9',
            secondary: '#4b5563',
            border: '#e5e7eb',
            card: 'rgba(255, 255, 255, 0.7)',
            cardBorder: 'rgba(0, 0, 0, 0.1)',
        }
    },
    terminal: {
        name: 'cli',
        label: { es: 'Terminal', en: 'Terminal' },
        icon: 'fas fa-terminal',
        colors: {
            bg: '#000000',
            text: '#34d399',
            primary: '#34d399',
            secondary: '#34d399',
            border: 'rgba(52, 211, 153, 0.3)',
            card: 'rgba(0, 0, 0, 0.8)',
            cardBorder: 'rgba(52, 211, 153, 0.2)',
        }
    }
};

// =================================================================================
// --- LANGUAGE CONFIGURATION
// =================================================================================

export const LANGUAGE_CONFIG = {
    es: {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        direction: 'ltr',
    },
    en: {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        direction: 'ltr',
    }
};

// =================================================================================
// --- BREAKPOINTS
// =================================================================================

export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    wide: 1536,
};

// =================================================================================
// --- API ENDPOINTS
// =================================================================================

export const API_CONFIG = {
    baseUrl: 'https://api.github.com',
    endpoints: {
        repos: '/users/Mgobeaalcoba/repos',
        profile: '/users/Mgobeaalcoba',
    },
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'mgobeaalcoba-cv',
    }
};

// =================================================================================
// --- VALIDATION RULES
// =================================================================================

export const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: { es: 'Email inválido', en: 'Invalid email' }
    },
    phone: {
        pattern: /^\+?[\d\s\-\(\)]+$/,
        message: { es: 'Teléfono inválido', en: 'Invalid phone number' }
    },
    url: {
        pattern: /^https?:\/\/.+/,
        message: { es: 'URL inválida', en: 'Invalid URL' }
    }
};

// =================================================================================
// --- ERROR MESSAGES
// =================================================================================

export const ERROR_MESSAGES = {
    network: {
        es: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        en: 'Connection error. Please check your internet connection.'
    },
    pdf: {
        es: 'Error al generar el PDF. Por favor, intenta nuevamente.',
        en: 'Error generating PDF. Please try again.'
    },
    terminal: {
        es: 'Error en la terminal. Por favor, recarga la página.',
        en: 'Terminal error. Please reload the page.'
    },
    general: {
        es: 'Ha ocurrido un error inesperado. Por favor, recarga la página.',
        en: 'An unexpected error occurred. Please reload the page.'
    }
};

// =================================================================================
// --- UTILITY FUNCTIONS
// =================================================================================

export function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], APP_CONFIG);
}

export function isFeatureEnabled(feature) {
    return APP_CONFIG.features[feature] === true;
}

export function getThemeConfig(theme) {
    return THEME_CONFIG[theme] || THEME_CONFIG.dark;
}

export function getLanguageConfig(lang) {
    return LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.es;
}

export function isMobile() {
    return window.innerWidth <= BREAKPOINTS.mobile;
}

export function isTablet() {
    return window.innerWidth > BREAKPOINTS.mobile && window.innerWidth <= BREAKPOINTS.tablet;
}

export function isDesktop() {
    return window.innerWidth > BREAKPOINTS.tablet;
} 