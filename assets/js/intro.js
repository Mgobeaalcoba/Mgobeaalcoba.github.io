// intro.js - Intro animation logic

import { translations } from './translations.js';
import { DOM, Storage } from './utils.js';

let currentIntroTheme = 'dark';
const themeOrder = ['dark', 'light', 'cli'];

// =================================================================================
// INTRO DOM ELEMENTS
// =================================================================================

function getIntroElements() {
    return {
        overlay: DOM.find('#intro-overlay'),
        typingText: DOM.find('#typing-text'),
        progressBar: DOM.find('#progress-bar'),
        enterButton: DOM.find('#enter-button'),
        introIconSun: DOM.find('#intro-icon-sun'),
        introIconMoon: DOM.find('#intro-icon-moon'),
        introIconTerminal: DOM.find('#intro-icon-terminal')
    };
}

// =================================================================================
// INTRO THEME MANAGEMENT
// =================================================================================

export function applyIntroTheme(theme) {
    console.log(`[intro.js] applyIntroTheme: ${theme}`);
    const { overlay } = getIntroElements();
    if (!overlay) return;
    
    currentIntroTheme = theme;
    overlay.classList.remove('light-mode', 'terminal-mode');
    if (theme === 'light') {
        overlay.classList.add('light-mode');
    } else if (theme === 'terminal') {
        overlay.classList.add('terminal-mode');
    }
}

export function cycleIntroTheme() {
    const currentThemeIndex = themeOrder.indexOf(currentIntroTheme);
    const nextTheme = themeOrder[(currentThemeIndex + 1) % themeOrder.length];
    applyIntroTheme(nextTheme);
    updateThemeToggle(nextTheme);
}

export function updateThemeToggle(theme) {
    const { introIconSun, introIconMoon, introIconTerminal } = getIntroElements();
    
    DOM.hide(introIconSun, introIconMoon, introIconTerminal);
    
    if (theme === 'cli') {
        DOM.show(introIconTerminal);
    } else if (theme === 'light') {
        DOM.show(introIconSun);
    } else { // dark
        DOM.show(introIconMoon);
    }
}

export function updateLangToggle(lang) {
    const introLangEsBtn = DOM.find('#intro-lang-es');
    const introLangEnBtn = DOM.find('#intro-lang-en');
    
    if (introLangEsBtn) introLangEsBtn.classList.toggle('active', lang === 'es');
    if (introLangEnBtn) introLangEnBtn.classList.toggle('active', lang === 'en');
}

// =================================================================================
// TYPING ANIMATION
// =================================================================================

let introFinished = false;

export async function typeWords() {
    const { typingText } = getIntroElements();
    if (!typingText) return;
    
    const introWords = ["Data & Analytics", "Technical Leadership", "Python", "Cloud Computing", "Business Intelligence", "Software Engineering"];
    const introThemes = ['dark', 'light', 'terminal', 'dark', 'light', 'terminal'];
    const introLanguages = ['es', 'en', 'es', 'en', 'es', 'en'];
    
    for (let i = 0; i < introWords.length; i++) {
        if (introFinished) break;
        applyIntroTheme(introThemes[i]);
        updateThemeToggle(introThemes[i]);
        updateLangToggle(introLanguages[i]);
        await typeSentence(introWords[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
        if (i < introWords.length - 1) {
            if (introFinished) break;
            await deleteSentence();
        }
    }
}

async function typeSentence(sentence) {
    const { typingText } = getIntroElements();
    if (!typingText || introFinished) return;
    
    for (let i = 0; i < sentence.length; i++) {
        if (introFinished) return;
        typingText.innerText += sentence[i];
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function deleteSentence() {
    const { typingText } = getIntroElements();
    if (!typingText || introFinished) return;
    
    const sentence = typingText.innerText;
    for (let i = sentence.length; i > 0; i--) {
        if (introFinished) return;
        typingText.innerText = sentence.substring(0, i - 1);
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

// =================================================================================
// INTRO EXIT
// =================================================================================

export function exitIntro() {
    if (introFinished) return;
    introFinished = true;

    // The intro's only job is to save the user's last chosen theme for the NEXT session.
    // It should not apply the theme to the current session, as that's the main app's job.
    Storage.set('theme', currentIntroTheme);
    console.log(`[intro.js] Exiting. Saved theme for next session: ${currentIntroTheme}`);

    const { overlay } = getIntroElements();
    if (!overlay) return;
    
    DOM.hide(overlay);
    document.body.classList.remove('intro-active');
    
    // Show main content
    const pageContent = DOM.find('#page-content');
    const topControls = DOM.find('.top-controls');
    DOM.show(pageContent, topControls);
    
    // Trigger a custom event to notify other parts of the app
    const event = new CustomEvent('introCompleted');
    document.dispatchEvent(event);
}

// =================================================================================
// INTRO START
// =================================================================================

let progressInterval;

export function startIntro() {
    introFinished = false; 

    const { enterButton, progressBar } = getIntroElements();
    
    // Make button visible and setup click handler
    if (enterButton) {
        enterButton.classList.add('visible');
        enterButton.onclick = exitIntro;
    }
    
    // Start typing animation
    typeWords();
    
    // Start progress bar
    const introTotalDuration = 12000;
    let introElapsed = 0;
    
    progressInterval = setInterval(() => {
        if (introFinished) {
            clearInterval(progressInterval);
            return;
        }
        introElapsed += 100;
        const progress = (introElapsed / introTotalDuration) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (introElapsed >= introTotalDuration) {
            clearInterval(progressInterval);
            exitIntro();
        }
    }, 100);
}

// =================================================================================
// INTRO RESET
// =================================================================================

export function resetIntro() {
    introFinished = true;
    if (progressInterval) clearInterval(progressInterval);

    const { overlay, typingText, progressBar, enterButton } = getIntroElements();
    
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.remove('light-mode', 'terminal-mode');
    }
    
    if (typingText) typingText.innerText = '';
    if (progressBar) progressBar.style.width = '0%';
    if (enterButton) enterButton.classList.remove('visible');
    
    document.body.classList.add('intro-active');
} 