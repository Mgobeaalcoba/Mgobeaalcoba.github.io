// themes.js - Theme and terminal mode management

import { initTerminal, toggleTerminal } from './terminal.js';
import { DOM, Storage } from './utils.js';

let currentTheme;
const themeOrder = ['dark', 'light', 'cli'];

// =================================================================================
// THEME DOM ELEMENTS
// =================================================================================

function getThemeElements() {
    return {
        themeToggle: DOM.find('#theme-toggle'),
        darkIcon: DOM.find('#dark-icon'),
        lightIcon: DOM.find('#light-icon'),
        terminalIcon: DOM.find('#terminal-icon')
    };
}

// =================================================================================
// THEME APPLICATION LOGIC
// =================================================================================

export function applyTheme(theme) {
    // console.log(`[themes.js] Applying theme: ${theme}`);
    const { darkIcon, lightIcon, terminalIcon } = getThemeElements();
    
    document.documentElement.classList.remove('light-mode');
    DOM.hide(darkIcon, lightIcon, terminalIcon);
    
    toggleTerminal(false);

    if (theme === 'cli') {
        toggleTerminal(true);
        DOM.show(terminalIcon);
    } else if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        DOM.show(darkIcon);
    } else { // dark
        DOM.show(lightIcon);
    }
}

// =================================================================================
// THEME INITIALIZATION & CYCLING
// =================================================================================

function cycleTheme() {
    console.log(`[themes.js] cycleTheme called. Current theme: ${currentTheme}`);
    const currentThemeIndex = themeOrder.indexOf(currentTheme);
    const nextTheme = themeOrder[(currentThemeIndex + 1) % themeOrder.length];
    console.log(`[themes.js] Next theme will be: ${nextTheme}`);
    setTheme(nextTheme, true);
}

export function initializeThemes() {
    const { themeToggle } = getThemeElements();
    currentTheme = Storage.get('theme', 'dark');
    console.log(`[themes.js] Initializing. Theme from storage: ${currentTheme}`);
    applyTheme(currentTheme);
    
    if (themeToggle) {
        themeToggle.removeEventListener('click', cycleTheme); // Avoid duplicate listeners
        themeToggle.addEventListener('click', cycleTheme);
    }
}


// =================================================================================
// THEME GETTER & SETTER
// =================================================================================

export function getCurrentTheme() {
    return currentTheme;
}

export function setTheme(theme, fromCycle = false) {
    console.log(`[themes.js] setTheme called with: ${theme}. Current theme was: ${currentTheme}`);
    currentTheme = theme;
    Storage.set('theme', theme);
    applyTheme(theme);
    
    if (theme === 'cli' && fromCycle) {
        const lang = Storage.get('language', 'es');
        initTerminal(lang);
    }
} 