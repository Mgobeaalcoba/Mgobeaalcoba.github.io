// IMPORTS AND TRANSLATIONS
import logger from './logger.js';
import { translations } from './translations.js';
import { initializeConsultingMobileMenu } from './mobile-menu.js';
import { initializeImageOptimization } from './image-optimizer.js';

// =================================================================================
// Note: Modal functions are now defined in inline script in HTML
// This ensures they're globally available for onclick handlers
// =================================================================================
// --- FORCE SPANISH LANGUAGE BY DEFAULT
// =================================================================================

// SOLUCIÓN DEFINITIVA: Forzar idioma español INMEDIATAMENTE
localStorage.setItem('language', 'es');
document.documentElement.lang = 'es';

// Language buttons now use onclick inline and are managed by global function
// Initial state is set in inline script in HTML

// THEME TOGGLE - Now handled by global function in inline script
// Theme initialization happens in inline script for immediate effect

// LANGUAGE TOGGLE
function setLanguage(lang) {
    console.log('[Module] setLanguage called with:', lang);
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    console.log('[Module] Translating', elementsToTranslate.length, 'elements');
    
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            el.innerHTML = translations[key][lang];
        } else {
            console.warn('[Module] Translation key not found:', key);
        }
    });
    
    console.log('[Module] All elements translated');
    
    // Update typing phrases
    if (translations.consulting_typing_phrases && translations.consulting_typing_phrases[lang]) {
        window.typingPhrases = translations.consulting_typing_phrases[lang];
        console.log('[Module] Updated typing phrases:', window.typingPhrases);
        // Restart typing animation with new phrases
        const typingText = document.getElementById('typing-text');
        if (typingText) {
            restartTypingEffect();
            console.log('[Module] Typing effect restarted with new language');
        }
    } else {
        console.warn('[Module] No typing phrases found for language:', lang);
    }
    
    // Update pack data-attributes
    updatePackDataAttributes(lang);
    
    // Update example data-attributes  
    updateExampleDataAttributes(lang);
    
    // Update form placeholders
    updateFormPlaceholders(lang);
    updateDataPlaceholders(lang);
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Update active language button
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    if (langEsBtn) langEsBtn.classList.toggle('active', lang === 'es');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
    
    console.log('[Module] Language updated successfully to:', lang);
}

// Export setLanguage to global scope IMMEDIATELY for inline functions
window.setLanguageFromModule = function(lang) {
    console.log('[Module] setLanguageFromModule called with:', lang);
    setLanguage(lang);
};

console.log('[Module] ✅ setLanguageFromModule exposed globally');

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
        'sales_automation', 'hr_automation', 'operations_automation', 'social', 'reports', 'marketing_automation', 'chatbot', 'feedback', 'sales', 'inventory'
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
// Initialize with NEW phrases globally so they can be updated by language change
window.typingPhrases = [
    "Automatice procesos y libere tiempo valioso.",
    "Implemente IA para decisiones inteligentes.",
    "Visualice sus datos en tiempo real.",
    "Acelere su carrera tech con mentoría experta.",
    "Capacite equipos en tecnologías clave.",
    "Encuentre el talento tech perfecto en 3 semanas."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

console.log('[TypingEffect] Initial phrases loaded:', window.typingPhrases);

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

// EXAMPLE MODAL
function openExampleModal(card) {
    console.log('[ExampleModal] Opening example modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalStory = document.getElementById('modal-story');
    
    if (modalImg && modalTitle && modalStory) {
        modalImg.src = card.dataset.imgSrc;
        modalImg.alt = card.dataset.title;
        modalTitle.textContent = card.dataset.title;
        modalStory.textContent = card.dataset.story;
        window.openModal('example-modal');
    } else {
        console.error('[ExampleModal] Modal elements not found');
    }
}

// PACK MODAL
function openPackModal(card) {
    console.log('[PackModal] Opening pack modal');
    const packModalTitle = document.getElementById('pack-modal-title');
    const packModalServices = document.getElementById('pack-modal-services');
    const packModalTimeline = document.getElementById('pack-modal-timeline');
    const packModalInvestment = document.getElementById('pack-modal-investment');
    const packModalRoi = document.getElementById('pack-modal-roi');
    
    if (packModalTitle && packModalServices) {
        packModalTitle.textContent = card.dataset.title;
        packModalServices.innerHTML = card.dataset.services;
        packModalTimeline.innerHTML = `<i class="fas fa-clock w-5 mr-2"></i>${card.dataset.timeline}`;
        packModalInvestment.innerHTML = `<i class="fas fa-dollar-sign w-5 mr-2"></i>${card.dataset.investment}`;
        packModalRoi.innerHTML = card.dataset.roi;
        window.openModal('pack-modal');
    } else {
        console.error('[PackModal] Modal elements not found');
    }
}

// Make modal functions globally accessible
window.openExampleModal = openExampleModal;
window.openPackModal = openPackModal;

// Initialize all functionalities on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Consulting] DOM loaded, starting initialization...');
    
    // Load initial language from localStorage or default to ES
    const savedLang = localStorage.getItem('language') || 'es';
    console.log('[Consulting] Loaded language:', savedLang);
    
    // Apply initial translations (CRITICAL FIX)
    setLanguage(savedLang);
    
    // Initialize typing phrases from translations
    if (translations.consulting_typing_phrases && translations.consulting_typing_phrases[savedLang]) {
        window.typingPhrases = translations.consulting_typing_phrases[savedLang];
        console.log('[Consulting] Loaded typing phrases from translations:', window.typingPhrases);
    } else {
        console.warn('[Consulting] No typing phrases in translations, using defaults');
    }
    
    // Initialize typing effect - Start immediately, no delay
    console.log('[Consulting] Starting typing effect...');
    console.log('[Consulting] Current phrases:', window.typingPhrases);
    const typingTextElement = document.getElementById('typing-text');
    console.log('[Consulting] Typing text element found:', !!typingTextElement);
    
    if (typingTextElement) {
        // Start typing immediately
        type();
        console.log('[Consulting] Typing effect started successfully');
    } else {
        console.error('[Consulting] CRITICAL: typing-text element not found in DOM!');
        // Try again with delay as fallback
        setTimeout(() => {
            const retryElement = document.getElementById('typing-text');
            if (retryElement) {
                console.log('[Consulting] Retry successful, starting typing effect');
                type();
            }
        }, 1000);
    }
    
    // Initialize fade-in animations
    faders.forEach(fader => {
        fader.style.animationPlayState = 'paused';
        appearOnScroll.observe(fader);
    });

    // Initialize example cards
    const exampleCards = document.querySelectorAll('.example-card');
    console.log('[Examples] Found example cards:', exampleCards.length);
    exampleCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log('[Examples] Example card clicked:', index);
            openExampleModal(card);
        });
    });
    
    // Initialize pack cards
    const packCards = document.querySelectorAll('.pack-card');
    console.log('[Packs] Found pack cards:', packCards.length);
    packCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log('[Packs] Pack card clicked:', index);
            openPackModal(card);
        });
    });
    
    // Note: Escape key handler is now in inline script in HTML
    console.log('[Modal] Event listeners setup complete');
    
    // Set initial language (buttons now use onclick inline)
    setLanguage(savedLang);
    console.log('[Language] Initial language set to:', savedLang);
    
    // Initialize mobile menu with delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeMobileMenu();
    }, 100);
    
    // Initialize PDF proposal functionality
    initializeProposalGenerator();
    
    console.log('[Consulting] Initialization complete');
});

// ============== PDF PROPOSAL FUNCTIONALITY ==============

function initializeProposalGenerator() {
    const openModalBtn = document.getElementById('open-proposal-modal-btn');
    const proposalForm = document.getElementById('proposal-form');
    
    console.log('[ProposalGenerator] Initializing...');
    console.log('[ProposalGenerator] Button found:', !!openModalBtn);
    console.log('[ProposalGenerator] Form found:', !!proposalForm);
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            console.log('[ProposalGenerator] Button clicked, opening modal...');
            openModal('proposal-form-modal');
        });
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
    console.log('[Module] Updating form placeholders for language:', lang);
    
    const placeholderElements = [
        { id: 'user-name', key: 'consulting_form_name_placeholder' },
        { id: 'user-email', key: 'consulting_form_email_placeholder' },
        { id: 'company-name', key: 'consulting_form_company_placeholder' },
        { id: 'company-industry', key: 'consulting_form_industry_placeholder' },
        { id: 'user-problem', key: 'consulting_form_problem_placeholder' }
    ];

    let updated = 0;
    placeholderElements.forEach(({ id, key }) => {
        const element = document.getElementById(id);
        if (element && translations[key] && translations[key][lang]) {
            element.placeholder = translations[key][lang];
            updated++;
        } else {
            console.warn('[Module] Placeholder element or translation not found:', id, key);
        }
    });
    
    console.log('[Module] Updated', updated, 'of', placeholderElements.length, 'form placeholders');
}

// Also update elements with data-translate-placeholder attribute
function updateDataPlaceholders(lang) {
    const elementsWithPlaceholder = document.querySelectorAll('[data-translate-placeholder]');
    console.log('[Module] Updating', elementsWithPlaceholder.length, 'data-translate-placeholder elements');
    
    elementsWithPlaceholder.forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[key] && translations[key][lang]) {
            el.placeholder = translations[key][lang];
        }
    });
}

// Form placeholders are now updated within setLanguage function

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
    console.log('[Services] Initializing service modals...');
    
    const serviceCards = document.querySelectorAll('.service-card');
    console.log('[Services] Found service cards:', serviceCards.length);
    
    const serviceModals = {
        'automation': 'automation-service-modal',
        'ai': 'ai-service-modal',
        'bi': 'bi-service-modal',
        'mentoring': 'mentoring-service-modal',
        'courses': 'courses-service-modal',
        'recruiting': 'recruiting-service-modal'
    };
    
    // Verify modals exist
    Object.keys(serviceModals).forEach(key => {
        const modalElement = document.getElementById(serviceModals[key]);
        console.log(`[Services] Modal '${key}':`, modalElement ? '✅ Found' : '❌ NOT FOUND');
    });

    // Add click listeners to service cards
    serviceCards.forEach((card, index) => {
        const service = card.getAttribute('data-service');
        console.log(`[Services] Setting up card ${index} with service:`, service);
        
        card.addEventListener('click', () => {
            console.log(`[Services] 🖱️ Card clicked for service:`, service);
            const modalId = serviceModals[service];
            
            if (modalId) {
                console.log(`[Services] Opening modal ID:`, modalId);
                // Use global openModal function
                window.openModal(modalId);
            } else {
                console.error(`[Services] ❌ Modal ID not found for service:`, service);
            }
        });
    });

    console.log('[Services] ✅ Service modals initialized successfully');
}

// ============== IMAGE ERROR HANDLING ==============

function initializeImageErrorHandling() {
    const workflowImages = document.querySelectorAll('.workflow-image');
    
    workflowImages.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('[Images] Failed to load image:', this.src);
            
            // Replace with placeholder
            const parent = this.parentElement;
            if (parent) {
                // Create icon placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'example-placeholder bg-gradient-to-br from-gray-800/80 to-gray-900/60 flex items-center justify-center min-h-[200px] rounded-lg';
                placeholder.innerHTML = `
                    <div class="text-center p-4">
                        <i class="fas fa-image text-5xl text-gray-600 mb-2"></i>
                        <p class="text-xs text-gray-500">Imagen no disponible</p>
                    </div>
                `;
                
                parent.replaceChild(placeholder, this);
                console.log('[Images] Replaced failed image with placeholder');
            }
        });
        
        // Verify image loaded successfully
        img.addEventListener('load', function() {
            console.log('[Images] Image loaded successfully:', this.alt);
        });
    });
    
    console.log('[Images] Error handling initialized for', workflowImages.length, 'images');
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

// Track standard GA4 conversion events for consulting
function trackConversion(conversionType, eventData = {}) {
    let eventName = '';
    let standardData = {};
    
    switch(conversionType) {
        case 'lead_generation':
            eventName = 'generate_lead';
            standardData = {
                currency: 'USD',
                value: eventData.value || 100, // Higher value for consulting leads
                lead_source: 'consulting_page',
                ...eventData
            };
            break;
        case 'form_submit':
            eventName = 'form_submit';
            standardData = {
                form_id: eventData.form_id || 'proposal_form',
                form_destination: 'proposal_generation',
                value: eventData.value || 200, // High value for proposal generation
                currency: 'USD',
                ...eventData
            };
            break;
        case 'contact':
            eventName = 'contact';
            standardData = {
                contact_method: eventData.contact_method || 'unknown',
                value: eventData.value || 75,
                currency: 'USD',
                conversion_source: 'consulting_page',
                ...eventData
            };
            break;
        case 'file_download':
            eventName = 'file_download';
            standardData = {
                file_name: eventData.file_name || 'proposal.pdf',
                file_extension: eventData.file_extension || '.pdf',
                link_url: eventData.link_url || window.location.href,
                value: eventData.value || 150,
                currency: 'USD',
                ...eventData
            };
            break;
        case 'begin_checkout': // For service interest
            eventName = 'begin_checkout';
            standardData = {
                currency: 'USD',
                value: eventData.value || 50,
                items: eventData.items || [],
                ...eventData
            };
            break;
        default:
            trackEvent(conversionType, eventData);
            return;
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            custom_parameter_1: 'consulting_page',
            page_location: window.location.href,
            page_title: document.title,
            ...standardData
        });
        console.log(`[Analytics] Conversion tracked: ${eventName}`, standardData);
    }
}

function initializeAnalyticsTracking() {
    // Track page view
    trackEvent('page_view', {
        page_location: window.location.href,
        page_title: document.title
    });

    // Track CTA button clicks (lead generation)
    const proposalBtn = document.getElementById('open-proposal-modal-btn');
    if (proposalBtn) {
        proposalBtn.addEventListener('click', () => {
            trackConversion('lead_generation', {
                lead_source: 'hero_cta',
                button_text: 'Crear Pre-propuesta Instantánea',
                section: 'hero',
                value: 150
            });
        });
    }

    // Track service card clicks (begin checkout)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service') || `service_${index}`;
            
            // Define service-specific values
            const serviceValues = {
                'automation': { value: 75, price: 100 },
                'ai': { value: 100, price: 200 },
                'bi': { value: 100, price: 200 },
                'mentoring': { value: 80, price: 80 },
                'courses': { value: 500, price: 500 },
                'recruiting': { value: 1500, price: 1500 }
            };
            
            const serviceData = serviceValues[service] || { value: 75, price: 75 };
            const category = ['mentoring', 'courses', 'recruiting'].includes(service) 
                ? 'talent_development' 
                : 'consulting_service';
            
            trackConversion('begin_checkout', {
                service_type: service,
                section: service === 'mentoring' || service === 'courses' || service === 'recruiting' 
                    ? 'talent_services' 
                    : 'services',
                value: serviceData.value,
                items: [{
                    item_id: service,
                    item_name: service,
                    item_category: category,
                    quantity: 1,
                    price: serviceData.price
                }]
            });
        });
    });

    // Track pack card clicks (view item)
    const packCards = document.querySelectorAll('.pack-card');
    packCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const packType = ['starter', 'growth', 'bi'][index] || `pack_${index}`;
            const packValues = [850, 1500, 1200];
            
            // Track view_item event
            gtag('event', 'view_item', {
                currency: 'USD',
                value: packValues[index] || 850,
                items: [{
                    item_id: packType,
                    item_name: `Pack ${packType}`,
                    item_category: 'consulting_pack',
                    quantity: 1,
                    price: packValues[index] || 850
                }]
            });
        });
    });

    // Track PDF generation (conversion)
    const proposalForm = document.getElementById('proposal-form');
    if (proposalForm) {
        proposalForm.addEventListener('submit', () => {
            trackConversion('form_submit', {
                form_id: 'proposal_form',
                section: 'proposal_form',
                value: 300, // High value for proposal generation
                conversion_type: 'proposal_generated'
            });
        });
    }

    // Track WhatsApp contact (conversion)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#whatsapp-link')) {
            trackConversion('contact', {
                contact_method: 'whatsapp',
                value: 100,
                conversion_type: 'direct_contact'
            });
        }
    });

    // Track Email contact (conversion)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#email-link')) {
            trackConversion('contact', {
                contact_method: 'email',
                value: 75,
                conversion_type: 'direct_contact'
            });
        }
    });

    // Track Calendly scheduling (high-value conversion)
    const calendlyBtn = document.querySelector('[onclick*="Calendly"]');
    if (calendlyBtn) {
        calendlyBtn.addEventListener('click', () => {
            trackConversion('contact', {
                contact_method: 'calendly',
                section: 'footer',
                value: 200, // High value for direct scheduling
                conversion_type: 'appointment_booking'
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

    // Track example modal opens (engagement leading to interest)
    document.addEventListener('click', (e) => {
        const exampleCard = e.target.closest('.example-card');
        if (exampleCard) {
            trackEvent('example_view', {
                example_type: exampleCard.dataset.title || 'unknown',
                engagement_type: 'modal_open',
                section: 'examples'
            });
        }
    });

    // Track pack modal opens (high-intent)
    document.addEventListener('click', (e) => {
        const packCard = e.target.closest('.pack-card');
        if (packCard) {
            const packIndex = Array.from(document.querySelectorAll('.pack-card')).indexOf(packCard);
            const packType = ['starter', 'growth', 'bi'][packIndex] || 'unknown';
            
            trackEvent('pack_detail_view', {
                pack_type: packType,
                engagement_type: 'modal_open',
                section: 'packs'
            });
        }
    });

    // Language tracking is now handled within setLanguageGlobal() function

    // Theme tracking is now handled within toggleThemeGlobal() function

    // Track social media clicks
    document.addEventListener('click', (e) => {
        const socialLink = e.target.closest('[href*="linkedin"], [href*="github"], [href*="twitter"]');
        if (socialLink) {
            const platform = socialLink.href.includes('linkedin') ? 'linkedin' : 
                           socialLink.href.includes('github') ? 'github' : 'twitter';
            trackEvent('social_engagement', {
                social_platform: platform,
                link_url: socialLink.href,
                engagement_type: 'social_click'
            });
        }
    });

    // Track time on page milestones
    let timeOnPage = 0;
    const trackTimeOnPage = () => {
        timeOnPage += 30;
        if (timeOnPage % 60 === 0) { // Every minute
            trackEvent('time_on_page', {
                time_seconds: timeOnPage,
                engagement_type: 'session_duration',
                milestone: `${timeOnPage/60}min`
            });
        }
    };
    
    setInterval(trackTimeOnPage, 30000); // Track every 30 seconds

    // Track section visibility (engagement metric)
    const sections = ['services', 'packs', 'examples', 'process', 'about', 'contact'];
    const observedSections = new Set();
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !observedSections.has(entry.target.id)) {
                observedSections.add(entry.target.id);
                trackEvent('section_view', {
                    section_name: entry.target.id,
                    engagement_type: 'section_scroll',
                    view_order: observedSections.size,
                    page_type: 'consulting'
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) sectionObserver.observe(section);
    });

    console.log('[Analytics] Enhanced event tracking initialized');
}

// Initialize analytics immediately, other modules with delay
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize analytics immediately to capture early events
        initializeAnalyticsTracking();
        
        // Initialize other modules with minimal delay
        setTimeout(async () => {
            try {
                // Process timeline removed - no longer needed
                // initializeProcessTimeline();
                initializeMetricsCounters();
                initializeServiceModals();
                initializeImageErrorHandling();
                
                // Initialize image optimization
                await initializeImageOptimization();
                
                // Initialize secondary navigation
                initializeSecondaryNavigation();
                
                logger.success('Consulting', 'All consulting page modules initialized successfully');
            } catch (error) {
                logger.error('Failed to initialize consulting page modules:', error);
            }
        }, 100); // Reduced delay from 500ms to 100ms
        
    } catch (error) {
        logger.error('Failed to initialize analytics:', error);
    }
});

// ===============================================
// SECONDARY NAVIGATION FUNCTIONALITY
// ===============================================

function initializeSecondaryNavigation() {
    const secondaryNavLinks = document.querySelectorAll('.secondary-nav-link');
    const sections = ['packs', 'examples', 'process'];
    
    // Function to update active link based on scroll position
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const headerHeight = 120; // Account for sticky headers
                
                if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
                    current = sectionId;
                }
            }
        });
        
        // Update active states
        secondaryNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll for secondary navigation links
    secondaryNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = 120; // Account for both main and secondary nav
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Listen for scroll events to update active link
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Debounce scroll events for performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveLink, 10);
    });
    
    // Initial check
    updateActiveLink();
    
    logger.debug('SecondaryNav', 'Secondary navigation initialized successfully');
} 