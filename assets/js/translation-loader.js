// translation-loader.js - Lazy loading system for translations

import logger from './logger.js';

/**
 * Translation Cache - stores loaded translations in memory
 */
const translationCache = new Map();

/**
 * Currently loaded language
 */
let currentLanguage = null;

/**
 * Translation promises cache to avoid multiple simultaneous requests
 */
const loadingPromises = new Map();

/**
 * Default language fallback
 */
const DEFAULT_LANGUAGE = 'es';

/**
 * Available languages
 */
const AVAILABLE_LANGUAGES = ['es', 'en'];

/**
 * Loads translation file for a specific language
 * @param {string} lang - Language code ('es' or 'en')
 * @returns {Promise<Object>} - Translation object
 */
async function loadLanguageTranslations(lang) {
    // Validate language
    if (!AVAILABLE_LANGUAGES.includes(lang)) {
        logger.warn(`Invalid language: ${lang}, falling back to ${DEFAULT_LANGUAGE}`);
        lang = DEFAULT_LANGUAGE;
    }

    // Check cache first
    if (translationCache.has(lang)) {
        logger.debug('TranslationLoader', 'Loading translations from cache', { lang });
        return translationCache.get(lang);
    }

    // Check if already loading to avoid duplicate requests
    if (loadingPromises.has(lang)) {
        logger.debug('TranslationLoader', 'Translation already loading, waiting...', { lang });
        return loadingPromises.get(lang);
    }

    // Create loading promise
    const loadingPromise = createTranslationsFromOriginal(lang);
    loadingPromises.set(lang, loadingPromise);

    try {
        const translations = await loadingPromise;
        
        // Cache the result
        translationCache.set(lang, translations);
        logger.success('TranslationLoader', 'Translations loaded and cached', { 
            lang, 
            keys: Object.keys(translations).length 
        });
        
        return translations;
    } finally {
        // Remove from loading promises
        loadingPromises.delete(lang);
    }
}

/**
 * Creates language-specific translations from the original format
 * This function extracts only the required language from the full translations object
 * @param {string} lang - Language code
 * @returns {Promise<Object>} - Language-specific translations
 */
async function createTranslationsFromOriginal(lang) {
    logger.time(`Load translations ${lang}`);
    
    try {
        // Import the full translations module
        const { translations: fullTranslations } = await import('./translations.js');
        
        // Extract only the required language
        const langTranslations = {};
        
        for (const [key, value] of Object.entries(fullTranslations)) {
            if (value && typeof value === 'object' && value[lang]) {
                langTranslations[key] = value[lang];
            } else if (typeof value === 'string') {
                // For string values, keep as is
                langTranslations[key] = value;
            } else {
                // Fallback to default language or original value
                if (value && value[DEFAULT_LANGUAGE]) {
                    langTranslations[key] = value[DEFAULT_LANGUAGE];
                } else {
                    langTranslations[key] = value;
                }
            }
        }
        
        logger.timeEnd(`Load translations ${lang}`);
        return langTranslations;
        
    } catch (error) {
        logger.error('Failed to load translations:', error);
        throw error;
    }
}

/**
 * Gets translation for a specific key in the current language
 * @param {string} key - Translation key
 * @param {string} [defaultValue] - Default value if key not found
 * @returns {string} - Translated text
 */
function getTranslation(key, defaultValue = key) {
    if (!currentLanguage || !translationCache.has(currentLanguage)) {
        logger.warn('No language loaded, using default value');
        return defaultValue;
    }
    
    const translations = translationCache.get(currentLanguage);
    return translations[key] || defaultValue;
}

/**
 * Sets the current language and loads translations if needed
 * @param {string} lang - Language code
 * @returns {Promise<Object>} - Loaded translations
 */
async function setLanguage(lang) {
    logger.debug('TranslationLoader', 'Setting language', { from: currentLanguage, to: lang });
    
    currentLanguage = lang;
    return await loadLanguageTranslations(lang);
}

/**
 * Gets current language
 * @returns {string|null} - Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Preloads translations for better performance
 * @param {string[]} languages - Array of language codes to preload
 * @returns {Promise<void>}
 */
async function preloadLanguages(languages = AVAILABLE_LANGUAGES) {
    logger.debug('TranslationLoader', 'Preloading languages', { languages });
    
    const promises = languages.map(lang => loadLanguageTranslations(lang));
    await Promise.all(promises);
    
    logger.success('TranslationLoader', 'Languages preloaded successfully');
}

/**
 * Clears translation cache (useful for testing or memory management)
 */
function clearCache() {
    translationCache.clear();
    loadingPromises.clear();
    logger.debug('TranslationLoader', 'Translation cache cleared');
}

/**
 * Gets cache statistics
 * @returns {Object} - Cache stats
 */
function getCacheStats() {
    return {
        cachedLanguages: Array.from(translationCache.keys()),
        cacheSize: translationCache.size,
        loadingLanguages: Array.from(loadingPromises.keys())
    };
}

/**
 * Legacy compatibility: Creates a translations object similar to the original format
 * This maintains backward compatibility with existing code
 * @param {string} lang - Language code
 * @returns {Promise<Object>} - Translations in original format for compatibility
 */
async function getLegacyTranslations(lang) {
    await setLanguage(lang);
    const langTranslations = translationCache.get(lang);
    
    // Convert back to original format for backward compatibility
    const legacyFormat = {};
    for (const [key, value] of Object.entries(langTranslations)) {
        legacyFormat[key] = {
            [lang]: value,
            // Also include the other language if available
            [lang === 'es' ? 'en' : 'es']: await getCrossLanguageValue(key, lang === 'es' ? 'en' : 'es')
        };
    }
    
    return legacyFormat;
}

/**
 * Helper to get translation value in another language for legacy compatibility
 * @param {string} key - Translation key
 * @param {string} lang - Target language
 * @returns {Promise<string>} - Translation value
 */
async function getCrossLanguageValue(key, lang) {
    try {
        await loadLanguageTranslations(lang);
        const translations = translationCache.get(lang);
        return translations[key] || key;
    } catch (error) {
        logger.warn('Failed to get cross-language value', { key, lang, error });
        return key;
    }
}

// Export the API
export {
    loadLanguageTranslations,
    setLanguage,
    getCurrentLanguage,
    getTranslation,
    preloadLanguages,
    clearCache,
    getCacheStats,
    getLegacyTranslations,
    AVAILABLE_LANGUAGES,
    DEFAULT_LANGUAGE
};

// Attach to window for global access (backward compatibility)
window.TranslationLoader = {
    setLanguage,
    getCurrentLanguage,
    getTranslation,
    preloadLanguages,
    clearCache,
    getCacheStats
};

// Log initialization
logger.debug('TranslationLoader', 'Translation loader initialized', {
    availableLanguages: AVAILABLE_LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE
}); 