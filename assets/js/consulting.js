// IMPORTS AND TRANSLATIONS
import { translations } from './translations.js';

// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('dark-icon');
const lightIcon = document.getElementById('light-icon');
const docHtml = document.documentElement;

if (localStorage.getItem('theme') === 'light') {
    docHtml.classList.remove('dark');
    docHtml.classList.add('light');
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
}

themeToggle.addEventListener('click', () => {
    docHtml.classList.toggle('dark');
    docHtml.classList.toggle('light');
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');
    localStorage.setItem('theme', docHtml.classList.contains('dark') ? 'dark' : 'light');
});

// LANGUAGE TOGGLE
function setLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            el.innerHTML = translations[key][lang];
        }
    });
    
    // Update typing phrases
    if (window.typingPhrases) {
        window.typingPhrases = translations.consulting_typing_phrases[lang];
        // Restart typing animation with new phrases
        const typingText = document.getElementById('typing-text');
        if (typingText) {
            restartTypingEffect();
        }
    }
    
    // Update pack data-attributes
    updatePackDataAttributes(lang);
    
    // Update example data-attributes  
    updateExampleDataAttributes(lang);
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Update active language button
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    if (langEsBtn) langEsBtn.classList.toggle('active', lang === 'es');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
}

// Update pack data-attributes with translations
function updatePackDataAttributes(lang) {
    const packCards = document.querySelectorAll('.pack-card');
    
    packCards.forEach((card, index) => {
        let packType = '';
        if (index === 0) packType = 'starter';
        else if (index === 1) packType = 'growth';
        else if (index === 2) packType = 'bi';
        
        if (packType) {
            const titleKey = `consulting_pack_${packType}_title`;
            const servicesKey = `consulting_pack_${packType}_services`;
            const timelineKey = `consulting_pack_${packType}_timeline`;
            const investmentKey = `consulting_pack_${packType}_investment`;
            const roiKey = `consulting_pack_${packType}_roi`;
            
            if (translations[titleKey] && translations[titleKey][lang]) {
                card.setAttribute('data-title', translations[titleKey][lang]);
            }
            if (translations[servicesKey] && translations[servicesKey][lang]) {
                card.setAttribute('data-services', translations[servicesKey][lang]);
            }
            if (translations[timelineKey] && translations[timelineKey][lang]) {
                card.setAttribute('data-timeline', translations[timelineKey][lang]);
            }
            if (translations[investmentKey] && translations[investmentKey][lang]) {
                card.setAttribute('data-investment', translations[investmentKey][lang]);
            }
            if (translations[roiKey] && translations[roiKey][lang]) {
                card.setAttribute('data-roi', translations[roiKey][lang]);
            }
        }
    });
}

// Update example data-attributes with translations
function updateExampleDataAttributes(lang) {
    const exampleCards = document.querySelectorAll('.example-card');
    
    const exampleTypes = [
        'social', 'reports', 'chatbot', 'feedback', 'sales', 'inventory'
    ];
    
    exampleCards.forEach((card, index) => {
        if (index < exampleTypes.length) {
            const exampleType = exampleTypes[index];
            const titleKey = `consulting_example_${exampleType}_title`;
            const storyKey = `consulting_example_${exampleType}_story`;
            
            if (translations[titleKey] && translations[titleKey][lang]) {
                card.setAttribute('data-title', translations[titleKey][lang]);
            }
            if (translations[storyKey] && translations[storyKey][lang]) {
                card.setAttribute('data-story', translations[storyKey][lang]);
            }
        }
    });
}

// TYPING EFFECT
const typingText = document.getElementById('typing-text');
// Initialize phrases globally so they can be updated by language change
window.typingPhrases = [
    "Reduzca costos operativos.",
    "Automatice tareas repetitivas.",
    "Tome decisiones basadas en datos.",
    "Libere a su equipo para crear valor.",
    "Mejore la atención al cliente."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function type() {
    if(!typingText) return;
    const currentPhrase = window.typingPhrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % window.typingPhrases.length;
        typeSpeed = 500; // Pause before new phrase
    }

    typingTimeout = setTimeout(type, typeSpeed);
}

function restartTypingEffect() {
    // Clear any existing typing animation
    clearTimeout(typingTimeout);
    
    // Reset variables
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
    
    // Clear current text and restart
    if (typingText) {
        typingText.textContent = '';
        type();
    }
}

// FADE-IN ON SCROLL
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
    });
}, appearOptions);

// MODAL LOGIC (Generic)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// EXAMPLE MODAL
const exampleModal = document.getElementById('example-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalStory = document.getElementById('modal-story');
const exampleCards = document.querySelectorAll('.example-card');

function openExampleModal(card) {
    modalImg.src = card.dataset.imgSrc;
    modalImg.alt = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalStory.textContent = card.dataset.story;
    openModal('example-modal');
}

// PACK MODAL
const packModal = document.getElementById('pack-modal');
const packModalTitle = document.getElementById('pack-modal-title');
const packModalServices = document.getElementById('pack-modal-services');
const packModalTimeline = document.getElementById('pack-modal-timeline');
const packModalInvestment = document.getElementById('pack-modal-investment');
const packModalRoi = document.getElementById('pack-modal-roi');
const packCards = document.querySelectorAll('.pack-card');

function openPackModal(card) {
    packModalTitle.textContent = card.dataset.title;
    packModalServices.innerHTML = card.dataset.services;
    packModalTimeline.innerHTML = `<i class="fas fa-clock w-5 mr-2"></i>${card.dataset.timeline}`;
    packModalInvestment.innerHTML = `<i class="fas fa-dollar-sign w-5 mr-2"></i>${card.dataset.investment}`;
    packModalRoi.innerHTML = card.dataset.roi;
    openModal('pack-modal');
}

// Initialize all functionalities on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing effect
    type();
    
    // Initialize fade-in animations
    faders.forEach(fader => {
        fader.style.animationPlayState = 'paused';
        appearOnScroll.observe(fader);
    });

    // Initialize example cards
    exampleCards.forEach(card => {
        card.addEventListener('click', () => openExampleModal(card));
    });
    
    // Initialize pack cards
    packCards.forEach(card => {
        card.addEventListener('click', () => openPackModal(card));
    });
    
    // Initialize modal close functionality
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Prevent modal from closing when clicking inside modal content
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
    
    // Initialize language buttons
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    
    if (langEsBtn) {
        langEsBtn.addEventListener('click', () => setLanguage('es'));
    }
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => setLanguage('en'));
    }
    
    // Set initial language based on localStorage or default to Spanish
    const savedLang = localStorage.getItem('language') || 'es';
    setLanguage(savedLang);
}); 