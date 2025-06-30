// IMPORTS AND TRANSLATIONS
import logger from './logger.js';
import { translations } from './translations.js';
import { initializeConsultingMobileMenu } from './mobile-menu.js';
import { initializeImageOptimization } from './image-optimizer.js';

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
    if (translations.consulting_typing_phrases && translations.consulting_typing_phrases[lang]) {
        window.typingPhrases = translations.consulting_typing_phrases[lang];
        logger.debug('Language', 'Updated typing phrases for language', { lang, phrases: window.typingPhrases });
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

// MOBILE MENU
const initializeMobileMenu = initializeConsultingMobileMenu;

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
    const typingText = document.getElementById('typing-text');
    if(!typingText) {
        logger.debug('TypingEffect', 'typing-text element not found!');
        return;
    }
    
    if (!window.typingPhrases || window.typingPhrases.length === 0) {
        logger.debug('TypingEffect', 'No typing phrases available!');
        return;
    }
    
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
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        typingText.textContent = '';
        console.log('[Consulting] Restarting typing effect with phrases:', window.typingPhrases);
        type();
    } else {
        console.log('[Consulting] Cannot restart typing effect - element not found!');
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

// MODAL LOGIC (Generic) - GLOBAL FUNCTIONS
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// FUNCTION TO TRANSITION FROM SERVICE MODAL TO PROPOSAL MODAL
window.openProposalFromService = function(serviceModalId) {
    // Close the service modal first
    const serviceModal = document.getElementById(serviceModalId);
    if (serviceModal) {
        serviceModal.classList.remove('active');
        setTimeout(() => {
            serviceModal.style.display = 'none';
        }, 300);
    }
    
    // Then open the proposal modal after a short delay
    setTimeout(() => {
        openModal('proposal-form-modal');
    }, 350);
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
    console.log('[Consulting] DOM loaded, starting initialization...');
    
    // Load initial language from localStorage or default to ES
    const savedLang = localStorage.getItem('language') || 'es';
    console.log('[Consulting] Loaded language:', savedLang);
    
    // Initialize typing phrases from translations
    if (translations.consulting_typing_phrases && translations.consulting_typing_phrases[savedLang]) {
        window.typingPhrases = translations.consulting_typing_phrases[savedLang];
        console.log('[Consulting] Loaded typing phrases:', window.typingPhrases);
    }
    
    // Initialize typing effect
    setTimeout(() => {
        console.log('[Consulting] Starting typing effect...');
        type();
    }, 500); // Small delay to ensure DOM is fully ready
    
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
    
    // Set initial language
    setLanguage(savedLang);
    
    // Initialize mobile menu with delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeMobileMenu();
    }, 100);
    
    console.log('[Consulting] Initialization complete');
    
    // Initialize PDF proposal functionality
    initializeProposalGenerator();
    
    // Initialize service modals
    initializeServiceModals();
    
    // Timeline will be initialized after all functions are defined
    
    
});

// ============== PDF PROPOSAL FUNCTIONALITY ==============

function initializeProposalGenerator() {
    const openModalBtn = document.getElementById('open-proposal-modal-btn');
    const proposalForm = document.getElementById('proposal-form');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openModal('proposal-form-modal'));
    }

    if (proposalForm) {
        proposalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnText = document.getElementById('btn-text');
            const btnSpinner = document.getElementById('btn-spinner');
            const generatePdfBtn = document.getElementById('generate-pdf-btn');

            generatePdfBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';

            const userData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                company: document.getElementById('company-name').value,
                industry: document.getElementById('company-industry').value,
                problem: document.getElementById('user-problem').value,
            };

            try {
                await generatePDF(userData);
                setupContactLinks(userData);
                closeModal('proposal-form-modal');
                openModal('contact-options-modal');
            } catch (error) {
                console.error('Error generating proposal:', error);
                alert('Hubo un error al generar la propuesta. Por favor, intente de nuevo.');
            } finally {
                generatePdfBtn.disabled = false;
                btnText.style.display = 'inline';
                btnSpinner.style.display = 'none';
                proposalForm.reset();
            }
        });
    }
}

async function generatePDF(data) {
    const { company, industry, problem } = data;

    // Fill PDF template with user data
    document.getElementById('pdf-company-name').textContent = company;
    document.getElementById('pdf-date').textContent = new Date().toLocaleDateString('es-AR');
    document.getElementById('pdf-user-problem').textContent = problem;
    document.getElementById('pdf-company-industry').textContent = industry;

    const pdfContent = document.getElementById('pdf-content');
    pdfContent.classList.remove('hidden');

    // Wait for content to be visible
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(pdfContent, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        doc.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        doc.save(`Propuesta-MGA-Tech-Consulting-${company.replace(/\s+/g, '-')}.pdf`);

    } catch(error) {
        console.error("Error generating PDF:", error);
        throw error;
    } finally {
        pdfContent.classList.add('hidden');
    }
}

function setupContactLinks(data) {
    const { name, company, industry, problem } = data;
    
    // WhatsApp link
    const whatsappText = `Hola Mariano, soy ${name} de la empresa ${company}. Acabo de generar una pre-propuesta desde tu web. Nos dedicamos al rubro ${industry} y nuestro principal desafío es: "${problem}". Me gustaría conversar sobre la propuesta.`;
    const whatsappLink = document.getElementById('whatsapp-link');
    whatsappLink.href = `https://wa.me/5491127475569?text=${encodeURIComponent(whatsappText)}`;
    
    // Email link
    const emailLink = document.getElementById('email-link');
    const emailSubject = `Contacto desde la web - Propuesta para ${company}`;
    const emailBody = `Hola Mariano,\n\nMi nombre es ${name} y te escribo desde ${company} (rubro: ${industry}).\n\nGeneré una pre-propuesta en tu sitio web sobre nuestro desafío: "${problem}".\n\nMe gustaría coordinar una llamada para conversar más en detalle.\n\nSaludos.`;
    const mailtoHref = `mailto:gobeamariano@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    emailLink.href = mailtoHref;
    emailLink.onclick = null; // Remove any previous onclick handlers
}

// Function to update form placeholders when language changes
function updateFormPlaceholders(lang) {
    const placeholderElements = [
        { id: 'user-name', key: 'consulting_form_name_placeholder' },
        { id: 'user-email', key: 'consulting_form_email_placeholder' },
        { id: 'company-name', key: 'consulting_form_company_placeholder' },
        { id: 'company-industry', key: 'consulting_form_industry_placeholder' },
        { id: 'user-problem', key: 'consulting_form_problem_placeholder' }
    ];

    placeholderElements.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element && translations[key] && translations[key][lang]) {
            element.placeholder = translations[key][lang];
        }
    });
}

// Override the setLanguage function to include form placeholders
const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
    originalSetLanguage(lang);
    updateFormPlaceholders(lang);
};

// ============== ANIMATED PROCESS TIMELINE ==============
// (Moved before DOMContentLoaded to be available when called)

function initializeProcessTimeline() {
    const processSection = document.getElementById('process');
    const processSteps = document.querySelectorAll('.process-step');
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const progressBar = document.getElementById('process-progress');
    const animatedLine = document.getElementById('animated-line');
    
    if (!processSection || !processSteps.length) return;
    
    let activeSteps = new Set();
    
    function updateProgressBar(activeStepCount) {
        const progressPercent = (activeStepCount / processSteps.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function updateAnimatedLine(highestStep) {
        if (animatedLine && highestStep > 0) {
            // Calculate line height based on step progress, extending beyond the step
            const baseHeight = (highestStep / processSteps.length) * 85; // 85% to account for step positioning
            const extendedHeight = Math.min(baseHeight + 15, 100); // Add 15% extension, max 100%
            animatedLine.style.height = `${extendedHeight}%`;
        }
    }
    
    function activateStep(step, stepNumber) {
        if (activeSteps.has(stepNumber)) return;
        
        activeSteps.add(stepNumber);
        step.classList.add('active');
        
        // Activate corresponding timeline node
        const correspondingNode = document.querySelector(`.timeline-node[data-step="${stepNumber}"]`);
        if (correspondingNode) {
            correspondingNode.classList.add('active');
            
            // Trigger glow animation
            const glow = correspondingNode.querySelector('.step-glow');
            if (glow) {
                setTimeout(() => {
                    glow.style.transform = 'scale(1.4)';
                    glow.style.opacity = '0.7';
                }, 100);
            }
        }
        
        // Animate step counter in both places
        const counter = step.querySelector('.step-counter');
        const timelineNumber = correspondingNode?.querySelector('.timeline-number');
        
        if (counter) {
            setTimeout(() => {
                animateCounter(counter, stepNumber);
            }, 300);
        }
        
        if (timelineNumber) {
            setTimeout(() => {
                animateCounter(timelineNumber, stepNumber);
            }, 400);
        }
        
        console.log(`[Timeline] Step ${stepNumber} activated`);
    }
    
    function animateCounter(element, targetNumber) {
        let current = 0;
        const increment = targetNumber / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 50);
    }
    
    function checkStepVisibility() {
        const triggerHeight = window.innerHeight * 0.7;
        let highestActiveStep = 0;
        
        processSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            const rect = step.getBoundingClientRect();
            const isVisible = rect.top < triggerHeight && rect.bottom > 0;
            
            if (isVisible) {
                activateStep(step, stepNumber);
                highestActiveStep = Math.max(highestActiveStep, stepNumber);
            }
        });
        
        updateProgressBar(activeSteps.size);
        updateAnimatedLine(highestActiveStep);
    }
    
    // Create intersection observer for better performance
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-10% 0px -30% 0px'
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = parseInt(entry.target.dataset.step);
                activateStep(entry.target, stepNumber);
                
                // Update progress bar and line
                const currentActiveSteps = document.querySelectorAll('.process-step.active').length;
                updateProgressBar(currentActiveSteps);
                updateAnimatedLine(currentActiveSteps);
            }
        });
    }, observerOptions);
    
    // Observe all process steps
    processSteps.forEach(step => {
        stepObserver.observe(step);
    });
    
    // Also listen to scroll for real-time updates
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkStepVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Initial check
    setTimeout(checkStepVisibility, 100);
    
    console.log('[Timeline] Animated process timeline initialized');
}

// ============== SERVICE MODALS FUNCTIONALITY ==============

function initializeServiceModals() {
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceModals = {
        'automation': document.getElementById('automation-service-modal'),
        'ai': document.getElementById('ai-service-modal'),
        'bi': document.getElementById('bi-service-modal')
    };

    // Add click listeners to service cards
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            const modal = serviceModals[service];
            
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                
                console.log(`[Services] ${service} modal opened`);
            }
        });
    });

    // Add close functionality to all service modals
    Object.values(serviceModals).forEach(modal => {
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.modal-close-btn');
        
        // Close on button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeServiceModal(modal);
            });
        }
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeServiceModal(modal);
            }
        });
    });

    function closeServiceModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    console.log('[Services] Service modals initialized');
}

// ============== ANIMATED METRICS COUNTERS ==============

function initializeMetricsCounters() {
    const metrics = document.querySelectorAll('.metric-counter');
    if (!metrics.length) return;
    
    let metricsAnimated = false;
    
    function animateMetric(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const stepTime = 50; // Update every 50ms
        const steps = duration / stepTime;
        const stepValue = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += stepValue;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current);
        }, stepTime);
    }
    
    function checkMetricsVisibility() {
        if (metricsAnimated) return;
        
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;
        
        const rect = aboutSection.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.7;
        
        if (rect.top < triggerPoint && rect.bottom > 0) {
            metricsAnimated = true;
            
            // Animate each metric with a small delay between them
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    animateMetric(metric);
                }, index * 200); // 200ms delay between each counter
            });
            
            console.log('[Metrics] Animated counters started');
        }
    }
    
    // Create intersection observer for performance
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -20% 0px'
    };
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !metricsAnimated) {
                    metricsAnimated = true;
                    
                    // Animate each metric with a small delay
                    metrics.forEach((metric, index) => {
                        setTimeout(() => {
                            animateMetric(metric);
                        }, index * 200);
                    });
                    
                    console.log('[Metrics] Animated counters triggered by observer');
                }
            });
        }, observerOptions);
        
        metricsObserver.observe(aboutSection);
    }
    
    // Fallback scroll listener
    window.addEventListener('scroll', checkMetricsVisibility);
    
    console.log('[Metrics] Metrics counters initialized');
}

// ============== GOOGLE ANALYTICS TRACKING ==============

function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            custom_parameter_1: 'consulting_page',
            page_location: window.location.href,
            page_title: document.title,
            ...eventData
        });
        console.log(`[Analytics] Event tracked: ${eventName}`, eventData);
    } else {
        console.warn('[Analytics] gtag not available');
    }
}

function initializeAnalyticsTracking() {
    // Track page view
    trackEvent('page_view', {
        page_location: window.location.href,
        page_title: document.title
    });

    // Track CTA button clicks
    const proposalBtn = document.getElementById('open-proposal-modal-btn');
    if (proposalBtn) {
        proposalBtn.addEventListener('click', () => {
            trackEvent('cta_click', {
                button_text: 'Crear Pre-propuesta Instantánea',
                section: 'hero'
            });
        });
    }

    // Track service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            trackEvent('service_interest', {
                service_type: service,
                section: 'services'
            });
        });
    });

    // Track pack card clicks
    const packCards = document.querySelectorAll('.pack-card');
    packCards.forEach(card => {
        card.addEventListener('click', () => {
            trackEvent('pack_interest', {
                pack_type: 'pack_click',
                section: 'packs'
            });
        });
    });

    // Track PDF generation (conversion)
    const proposalForm = document.getElementById('proposal-form');
    if (proposalForm) {
        proposalForm.addEventListener('submit', () => {
            trackEvent('proposal_generated', {
                conversion_type: 'pdf_download',
                section: 'proposal_form',
                value: 1
            });
        });
    }

    // Track WhatsApp contact (conversion)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#whatsapp-link')) {
            trackEvent('contact_conversion', {
                contact_method: 'whatsapp',
                conversion_type: 'contact_click',
                value: 1
            });
        }
    });

    // Track Email contact (conversion)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#email-link')) {
            trackEvent('contact_conversion', {
                contact_method: 'email',
                conversion_type: 'contact_click',
                value: 1
            });
        }
    });

    // Track Calendly scheduling
    const calendlyBtn = document.querySelector('[onclick*="Calendly"]');
    if (calendlyBtn) {
        calendlyBtn.addEventListener('click', () => {
            trackEvent('scheduling_interest', {
                calendar_type: 'calendly',
                section: 'footer'
            });
        });
    }

    // Track scroll depth (engagement)
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
            maxScrollDepth = scrollPercent;
            trackEvent('scroll_depth', {
                scroll_percent: scrollPercent,
                engagement_type: 'page_scroll'
            });
        }
    };

    window.addEventListener('scroll', trackScrollDepth);

    console.log('[Analytics] Event tracking initialized');
}

// Initialize the timeline when DOM is ready and function is defined
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for all other initialization to complete
    setTimeout(async () => {
        try {
            initializeProcessTimeline();
            initializeMetricsCounters();
            initializeAnalyticsTracking();
            
            // Initialize image optimization
            await initializeImageOptimization();
            
            logger.success('Consulting', 'All consulting page modules initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize consulting page modules:', error);
        }
    }, 500);
}); 