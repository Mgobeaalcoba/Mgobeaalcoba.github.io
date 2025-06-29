// logger.js - Conditional logging system for development/production environments

/**
 * Environment Detection
 * Determines if we're in development or production based on hostname
 */
function isProduction() {
    return window.location.hostname === 'mgobeaalcoba.github.io' || 
           window.location.hostname.includes('github.io') ||
           window.location.protocol === 'https:';
}

/**
 * Logger Class - Conditional logging based on environment
 */
class Logger {
    constructor() {
        this.isDev = !isProduction();
        this.enabled = this.isDev;
    }

    /**
     * Standard log - only in development
     */
    log(...args) {
        if (this.enabled) {
            console.log(...args);
        }
    }

    /**
     * Info log - only in development
     */
    info(...args) {
        if (this.enabled) {
            console.info(...args);
        }
    }

    /**
     * Warning log - always enabled (critical for debugging)
     */
    warn(...args) {
        console.warn(...args);
    }

    /**
     * Error log - always enabled (critical for debugging)
     */
    error(...args) {
        console.error(...args);
    }

    /**
     * Debug log - only in development, with context
     */
    debug(context, message, data = null) {
        if (this.enabled) {
            const timestamp = new Date().toISOString().substr(11, 8);
            if (data) {
                console.log(`🔧 [${timestamp}] ${context}: ${message}`, data);
            } else {
                console.log(`🔧 [${timestamp}] ${context}: ${message}`);
            }
        }
    }

    /**
     * Success log - only in development
     */
    success(context, message) {
        if (this.enabled) {
            const timestamp = new Date().toISOString().substr(11, 8);
            console.log(`✅ [${timestamp}] ${context}: ${message}`);
        }
    }

    /**
     * Performance measurement - only in development
     */
    time(label) {
        if (this.enabled) {
            console.time(label);
        }
    }

    timeEnd(label) {
        if (this.enabled) {
            console.timeEnd(label);
        }
    }

    /**
     * Group logging - only in development
     */
    group(label) {
        if (this.enabled) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    }

    /**
     * Force enable/disable (for testing)
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Get environment info
     */
    getEnvironment() {
        return {
            isDev: this.isDev,
            enabled: this.enabled,
            hostname: window.location.hostname,
            protocol: window.location.protocol
        };
    }
}

// Create singleton instance
const logger = new Logger();

// Export for ES6 modules
export default logger;

// Also attach to window for global access (backwards compatibility)
window.logger = logger;

// Development-only environment info
logger.debug('Logger', 'Logger initialized', logger.getEnvironment()); 