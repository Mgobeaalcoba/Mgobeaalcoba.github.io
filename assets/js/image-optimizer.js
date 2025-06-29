// image-optimizer.js - Image optimization and lazy loading system

import logger from './logger.js';

/**
 * Image configuration for optimization
 */
const IMAGE_CONFIG = {
    // Base GitHub raw URL
    baseUrl: 'https://raw.githubusercontent.com/Mgobeaalcoba/Mgobeaalcoba.github.io/main/assets/images/',
    
    // Image presets for different screen sizes
    presets: {
        thumbnail: { width: 150, height: 150, quality: 80 },
        small: { width: 300, height: 300, quality: 85 },
        medium: { width: 600, height: 600, quality: 90 },
        large: { width: 1200, height: 1200, quality: 95 },
        profile: { width: 400, height: 400, quality: 95 }
    },
    
    // Lazy loading settings
    lazyLoading: {
        rootMargin: '50px',
        threshold: 0.1
    },
    
    // WebP support detection
    webpSupport: null
};

/**
 * Detect WebP support in the browser
 * @returns {Promise<boolean>} - True if WebP is supported
 */
async function detectWebPSupport() {
    if (IMAGE_CONFIG.webpSupport !== null) {
        return IMAGE_CONFIG.webpSupport;
    }
    
    return new Promise(resolve => {
        const webp = new Image();
        webp.onload = webp.onerror = () => {
            IMAGE_CONFIG.webpSupport = webp.height === 2;
            logger.debug('ImageOptimizer', 'WebP support detected', { 
                supported: IMAGE_CONFIG.webpSupport 
            });
            resolve(IMAGE_CONFIG.webpSupport);
        };
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

/**
 * Generate optimized image URL using GitHub's image transformation
 * @param {string} imageName - Name of the image file
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
function generateOptimizedUrl(imageName, options = {}) {
    const {
        width = 600,
        height = 400,
        quality = 85,
        format = 'auto'
    } = options;
    
    // For GitHub, we can use URL parameters for some optimizations
    // Note: GitHub has limited image transformation capabilities
    const baseUrl = IMAGE_CONFIG.baseUrl + imageName;
    
    // Return base URL for now - GitHub doesn't support extensive transforms
    // In a real production environment, you'd use a service like Cloudinary
    return baseUrl;
}

/**
 * Create responsive image element with lazy loading
 * @param {Object} config - Image configuration
 * @returns {HTMLImageElement} - Optimized image element
 */
function createResponsiveImage({
    src,
    alt,
    className = '',
    loadingPriority = 'lazy',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) {
    const img = document.createElement('img');
    
    // Set basic attributes
    img.alt = alt;
    img.className = className;
    
    // Set loading strategy
    if (loadingPriority === 'eager') {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.src = src;
    } else {
        img.loading = 'lazy';
        img.setAttribute('data-src', src);
        img.src = generatePlaceholder();
    }
    
    // Add responsive attributes
    img.sizes = sizes;
    
    return img;
}

/**
 * Generate a lightweight placeholder image
 * @returns {string} - Data URL for placeholder
 */
function generatePlaceholder() {
    // Simple 1x1 transparent pixel
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="18"%3ELoading...%3C/text%3E%3C/svg%3E';
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        logger.warn('IntersectionObserver not supported, loading all images eagerly');
        loadAllImages();
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, IMAGE_CONFIG.lazyLoading);
    
    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    logger.success('ImageOptimizer', 'Lazy loading initialized', { 
        imageCount: lazyImages.length 
    });
}

/**
 * Load individual image
 * @param {HTMLImageElement} img - Image element to load
 */
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Create a new image to preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        logger.debug('ImageOptimizer', 'Image loaded', { src });
    };
    
    imageLoader.onerror = () => {
        logger.error('Failed to load image:', src);
        img.classList.add('error');
    };
    
    imageLoader.src = src;
}

/**
 * Fallback: Load all images immediately
 */
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(loadImage);
}

/**
 * Optimize profile image specifically (critical for LCP)
 */
function optimizeProfileImage() {
    const profileImages = document.querySelectorAll('img[src*="profile.png"]');
    
    profileImages.forEach(img => {
        // Ensure profile images are loaded eagerly
        img.loading = 'eager';
        img.fetchPriority = 'high';
        
        // Add specific optimizations for profile
        img.setAttribute('importance', 'high');
        
        logger.debug('ImageOptimizer', 'Profile image optimized', { 
            src: img.src 
        });
    });
}

/**
 * Convert workflow images to lazy loading
 */
function optimizeWorkflowImages() {
    const workflowImages = document.querySelectorAll('.workflow-image');
    
    workflowImages.forEach(img => {
        // Convert to lazy loading if not already
        if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = generatePlaceholder();
            img.loading = 'lazy';
            
            logger.debug('ImageOptimizer', 'Workflow image converted to lazy loading', { 
                originalSrc: img.getAttribute('data-src')
            });
        }
    });
}

/**
 * Apply progressive image loading
 * @param {HTMLImageElement} img - Image element
 * @param {Array<string>} sources - Array of image sources (small to large)
 */
function applyProgressiveLoading(img, sources) {
    if (sources.length === 0) return;
    
    let currentIndex = 0;
    
    function loadNext() {
        if (currentIndex >= sources.length) return;
        
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = sources[currentIndex];
            currentIndex++;
            if (currentIndex < sources.length) {
                setTimeout(loadNext, 100); // Small delay between loads
            }
        };
        imageLoader.src = sources[currentIndex];
    }
    
    loadNext();
}

/**
 * Add CSS for smooth image transitions
 */
function addImageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        img[data-src] {
            transition: opacity 0.3s ease-in-out;
            opacity: 0.7;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        img.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
        
        .workflow-image {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .workflow-image:hover {
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize the image optimization system
 */
export async function initializeImageOptimization() {
    logger.debug('ImageOptimizer', 'Initializing image optimization system...');
    
    try {
        // Detect WebP support
        await detectWebPSupport();
        
        // Add CSS styles
        addImageStyles();
        
        // Optimize critical images immediately
        optimizeProfileImage();
        
        // Convert workflow images to lazy loading
        optimizeWorkflowImages();
        
        // Initialize lazy loading system
        initializeLazyLoading();
        
        logger.success('ImageOptimizer', 'Image optimization system initialized');
        
    } catch (error) {
        logger.error('Failed to initialize image optimization:', error);
    }
}

/**
 * Preload critical images
 * @param {Array<string>} imagePaths - Array of critical image paths
 */
export function preloadCriticalImages(imagePaths = []) {
    imagePaths.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = path;
        document.head.appendChild(link);
        
        logger.debug('ImageOptimizer', 'Critical image preloaded', { path });
    });
}

/**
 * Get optimization statistics
 * @returns {Object} - Optimization stats
 */
export function getOptimizationStats() {
    const allImages = document.querySelectorAll('img');
    const lazyImages = document.querySelectorAll('img[data-src]');
    const loadedImages = document.querySelectorAll('img.loaded');
    const errorImages = document.querySelectorAll('img.error');
    
    return {
        totalImages: allImages.length,
        lazyImages: lazyImages.length,
        loadedImages: loadedImages.length,
        errorImages: errorImages.length,
        webpSupport: IMAGE_CONFIG.webpSupport
    };
}

// Export utilities
export {
    generateOptimizedUrl,
    createResponsiveImage,
    detectWebPSupport,
    IMAGE_CONFIG
};

// Log module initialization
logger.debug('ImageOptimizer', 'Image optimization module loaded'); 