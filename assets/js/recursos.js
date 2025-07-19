// recursos.js - JavaScript functionality for recursos útiles page

// =================================================================================
// --- IMPORTS
// =================================================================================

import { translations } from './translations.js';

// =================================================================================
// --- GLOBAL VARIABLES AND CONFIG
// =================================================================================

let resourcesConfig = null;
let currencyRates = null;
let lastUpdateTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// =================================================================================
// --- INITIALIZATION
// =================================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Recursos Útiles page...');
    
    try {
        // Load configuration
        await loadResourcesConfig();
        
        // Initialize all modules
        initializeThemes();
        initializeLanguage();
        initializeMobileMenu();
        initializeTaxCalculator();
        await initializeCurrencyWidget();
        initializeCurrencyConverter();
        
        console.log('✅ Recursos page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing recursos page:', error);
        showErrorMessage('Error al cargar la página. Por favor, recarga la página.');
    }
});

// =================================================================================
// --- CONFIGURATION LOADER
// =================================================================================

async function loadResourcesConfig() {
    try {
        const response = await fetch('assets/js/resources-config.json');
        if (!response.ok) throw new Error('Failed to load resources config');
        resourcesConfig = await response.json();
        console.log('📋 Resources configuration loaded');
    } catch (error) {
        console.error('❌ Error loading resources config:', error);
        // Fallback configuration
        resourcesConfig = getDefaultConfig();
    }
}

function getDefaultConfig() {
    return {
        resources: {
            calculators: [
                {
                    id: "tax-calculator",
                    name: "Calculadora de Impuesto a las Ganancias",
                    active: true
                }
            ],
            currencies: [
                {
                    id: "currency-rates",
                    name: "Cotizaciones Argentina",
                    active: true
                }
            ]
        },
        settings: {
            refreshInterval: 1800000,
            apis: {
                bluelytics: {
                    baseUrl: "https://api.bluelytics.com.ar/v2"
                }
            }
        }
    };
}

// =================================================================================
// --- THEME MANAGEMENT
// =================================================================================

function initializeThemes() {
    const themeToggle = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('dark-icon');
    const lightIcon = document.getElementById('light-icon');
    const docHtml = document.documentElement;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    // Theme toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    function toggleTheme() {
        const currentTheme = docHtml.classList.contains('light') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    function applyTheme(theme) {
        if (theme === 'light') {
            docHtml.classList.add('light');
            docHtml.classList.remove('dark');
            if (darkIcon && lightIcon) {
                darkIcon.classList.remove('hidden');
                lightIcon.classList.add('hidden');
            }
        } else {
            docHtml.classList.remove('light');
            docHtml.classList.add('dark');
            if (darkIcon && lightIcon) {
                darkIcon.classList.add('hidden');
                lightIcon.classList.remove('hidden');
            }
        }
    }
}

// =================================================================================
// --- MOBILE MENU
// =================================================================================

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.add('hidden');
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('hidden');
            });
        });
    }
}

// =================================================================================
// --- TAX CALCULATOR
// =================================================================================

function initializeTaxCalculator() {
    console.log('💰 Initializing tax calculator...');
    
    // Add input event listeners for real-time calculation
    const salaryInput = document.getElementById('annual-salary');
    const deductionsInput = document.getElementById('deductions');
    
    if (salaryInput) {
        salaryInput.addEventListener('input', () => {
            if (salaryInput.value) {
                calculateTax();
            }
        });
    }
    
    if (deductionsInput) {
        deductionsInput.addEventListener('input', () => {
            if (salaryInput && salaryInput.value) {
                calculateTax();
            }
        });
    }
}

function calculateTax() {
    const salaryInput = document.getElementById('annual-salary');
    const deductionsInput = document.getElementById('deductions');
    const resultDiv = document.getElementById('tax-result');
    const annualTaxSpan = document.getElementById('annual-tax');
    const monthlyTaxSpan = document.getElementById('monthly-tax');
    
    if (!salaryInput || !resultDiv) return;
    
    const annualSalary = parseFloat(salaryInput.value) || 0;
    const deductions = parseFloat(deductionsInput?.value) || 0;
    
    if (annualSalary <= 0) {
        resultDiv.classList.add('hidden');
        return;
    }
    
    // Get tax brackets from config or use defaults
    const taxBrackets = resourcesConfig?.resources?.calculators?.find(c => c.id === 'tax-calculator')?.calculations?.taxBrackets || getDefaultTaxBrackets();
    const nonTaxableMinimum = resourcesConfig?.resources?.calculators?.find(c => c.id === 'tax-calculator')?.calculations?.nonTaxableMinimum || 2260473;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, annualSalary - deductions - nonTaxableMinimum);
    
    // Calculate tax using brackets
    let totalTax = 0;
    let remainingIncome = taxableIncome;
    
    for (const bracket of taxBrackets) {
        if (remainingIncome <= 0) break;
        
        const bracketMin = Math.max(0, bracket.min - nonTaxableMinimum - deductions);
        const bracketMax = bracket.max ? Math.max(0, bracket.max - nonTaxableMinimum - deductions) : Infinity;
        
        if (taxableIncome > bracketMin) {
            const taxableInThisBracket = Math.min(remainingIncome, bracketMax - bracketMin);
            if (taxableInThisBracket > 0) {
                totalTax += taxableInThisBracket * bracket.rate;
                remainingIncome -= taxableInThisBracket;
            }
        }
    }
    
    // Display results
    const monthlyTax = totalTax / 12;
    
    if (annualTaxSpan) {
        annualTaxSpan.textContent = formatCurrency(totalTax);
    }
    if (monthlyTaxSpan) {
        monthlyTaxSpan.textContent = formatCurrency(monthlyTax);
    }
    
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('fade-in');
    
    // Add visual feedback
    setTimeout(() => {
        resultDiv.classList.remove('fade-in');
    }, 500);
}

function getDefaultTaxBrackets() {
    return [
        { min: 0, max: 2260473, rate: 0 },
        { min: 2260473, max: 3390710, rate: 0.05 },
        { min: 3390710, max: 4521000, rate: 0.09 },
        { min: 4521000, max: 6781400, rate: 0.12 },
        { min: 6781400, max: 9041800, rate: 0.15 },
        { min: 9041800, max: 13562700, rate: 0.19 },
        { min: 13562700, max: 18083600, rate: 0.23 },
        { min: 18083600, max: 27125400, rate: 0.27 },
        { min: 27125400, max: 36167200, rate: 0.31 },
        { min: 36167200, max: null, rate: 0.35 }
    ];
}

// =================================================================================
// --- CURRENCY WIDGET
// =================================================================================

async function initializeCurrencyWidget() {
    console.log('💱 Initializing currency widget...');
    await loadCurrencyRates();
    displayCurrencyRates();
    
    // Set up auto-refresh
    setInterval(async () => {
        await loadCurrencyRates();
        displayCurrencyRates();
    }, resourcesConfig?.settings?.refreshInterval || 1800000);
}

async function loadCurrencyRates() {
    try {
        // Check cache first
        if (currencyRates && lastUpdateTime && (Date.now() - lastUpdateTime) < CACHE_DURATION) {
            console.log('📊 Using cached currency rates');
            return;
        }
        
        console.log('🔄 Fetching fresh currency rates...');
        
        // Fetch from multiple sources
        const [bluelyticsData, exchangeData] = await Promise.allSettled([
            fetch('https://api.bluelytics.com.ar/v2/latest').then(r => r.json()),
            fetch('https://api.exchangerate-api.com/v4/latest/USD').then(r => r.json())
        ]);
        
        // Process and combine data
        currencyRates = processCurrencyData(bluelyticsData, exchangeData);
        lastUpdateTime = Date.now();
        
        console.log('✅ Currency rates updated');
    } catch (error) {
        console.error('❌ Error loading currency rates:', error);
        // Use fallback or cached data if available
        if (!currencyRates) {
            currencyRates = getFallbackRates();
        }
    }
}

function processCurrencyData(bluelyticsResult, exchangeResult) {
    const rates = {
        USD: {},
        EUR: {},
        BRL: {},
        lastUpdate: new Date().toLocaleString('es-AR')
    };
    
    // Process Bluelytics data (Argentine specific)
    if (bluelyticsResult.status === 'fulfilled' && bluelyticsResult.value) {
        const data = bluelyticsResult.value;
        
        rates.USD = {
            oficial: {
                buy: data.oficial?.value_buy || 0,
                sell: data.oficial?.value_sell || 0
            },
            blue: {
                buy: data.blue?.value_buy || 0,
                sell: data.blue?.value_sell || 0
            },
            mep: {
                buy: data.oficial_euro?.value_buy || 0,
                sell: data.oficial_euro?.value_sell || 0
            }
        };
    }
    
    // Process Exchange Rate API data
    if (exchangeResult.status === 'fulfilled' && exchangeResult.value?.rates) {
        const exchangeRates = exchangeResult.value.rates;
        
        if (exchangeRates.ARS) {
            const usdToArs = exchangeRates.ARS;
            rates.USD.oficial = rates.USD.oficial || {
                buy: usdToArs * 0.98,
                sell: usdToArs * 1.02
            };
        }
        
        if (exchangeRates.EUR && exchangeRates.ARS) {
            const eurToArs = exchangeRates.ARS / exchangeRates.EUR;
            rates.EUR.oficial = {
                buy: eurToArs * 0.98,
                sell: eurToArs * 1.02
            };
        }
        
        if (exchangeRates.BRL && exchangeRates.ARS) {
            const brlToArs = exchangeRates.ARS / exchangeRates.BRL;
            rates.BRL.oficial = {
                buy: brlToArs * 0.98,
                sell: brlToArs * 1.02
            };
        }
    }
    
    return rates;
}

function displayCurrencyRates() {
    const container = document.getElementById('currency-rates');
    if (!container || !currencyRates) return;
    
    container.innerHTML = '';
    
    // USD Rates
    if (currencyRates.USD) {
        container.appendChild(createCurrencyRateItem('USD', 'Dólar Estadounidense', '$', currencyRates.USD));
    }
    
    // EUR Rates
    if (currencyRates.EUR) {
        container.appendChild(createCurrencyRateItem('EUR', 'Euro', '€', currencyRates.EUR));
    }
    
    // BRL Rates
    if (currencyRates.BRL) {
        container.appendChild(createCurrencyRateItem('BRL', 'Real Brasileño', 'R$', currencyRates.BRL));
    }
    
    // Add last update info
    const updateInfo = document.createElement('div');
    updateInfo.className = 'text-sm text-gray-400 mt-4 text-center';
    updateInfo.textContent = `Última actualización: ${currencyRates.lastUpdate}`;
    container.appendChild(updateInfo);
}

function createCurrencyRateItem(code, name, symbol, rates) {
    const item = document.createElement('div');
    item.className = 'currency-rate-item';
    
    const info = document.createElement('div');
    info.className = 'currency-info';
    
    const details = document.createElement('div');
    details.className = 'currency-details';
    details.innerHTML = `
        <h4>${code} - ${name}</h4>
        <p>${symbol}</p>
    `;
    
    info.appendChild(details);
    
    const ratesGrid = document.createElement('div');
    ratesGrid.className = 'currency-rates-grid';
    
    // Add rate types
    Object.entries(rates).forEach(([type, values]) => {
        if (values && typeof values === 'object' && values.buy) {
            const rateType = document.createElement('div');
            rateType.className = 'rate-type';
            rateType.innerHTML = `
                <div class="rate-label">${type.toUpperCase()}</div>
                <div class="rate-value">$${values.sell.toFixed(2)}</div>
            `;
            ratesGrid.appendChild(rateType);
        }
    });
    
    item.appendChild(info);
    item.appendChild(ratesGrid);
    
    return item;
}

function getFallbackRates() {
    return {
        USD: {
            oficial: { buy: 950, sell: 970 },
            blue: { buy: 1100, sell: 1120 }
        },
        EUR: {
            oficial: { buy: 1050, sell: 1070 }
        },
        BRL: {
            oficial: { buy: 190, sell: 195 }
        },
        lastUpdate: new Date().toLocaleString('es-AR')
    };
}

// =================================================================================
// --- CURRENCY CONVERTER
// =================================================================================

function initializeCurrencyConverter() {
    console.log('🔄 Initializing currency converter...');
    
    const fromAmountInput = document.getElementById('from-amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toAmountInput = document.getElementById('to-amount');
    const toCurrencySelect = document.getElementById('to-currency');
    
    // Add event listeners
    [fromAmountInput, fromCurrencySelect, toCurrencySelect].forEach(element => {
        if (element) {
            element.addEventListener('input', convertCurrency);
            element.addEventListener('change', convertCurrency);
        }
    });
    
    // Initial conversion
    setTimeout(convertCurrency, 1000);
}

function convertCurrency() {
    const fromAmount = parseFloat(document.getElementById('from-amount')?.value) || 0;
    const fromCurrency = document.getElementById('from-currency')?.value;
    const toCurrency = document.getElementById('to-currency')?.value;
    const toAmountInput = document.getElementById('to-amount');
    
    if (!toAmountInput || fromAmount <= 0 || !fromCurrency || !toCurrency) {
        if (toAmountInput) toAmountInput.value = '';
        return;
    }
    
    const rate = getConversionRate(fromCurrency, toCurrency);
    const convertedAmount = fromAmount * rate;
    
    toAmountInput.value = convertedAmount.toFixed(2);
}

function getConversionRate(from, to) {
    if (from === to) return 1;
    
    // Base rates to ARS
    const toARS = {
        'USD': currencyRates?.USD?.blue?.sell || currencyRates?.USD?.oficial?.sell || 970,
        'EUR': currencyRates?.EUR?.oficial?.sell || 1070,
        'BRL': currencyRates?.BRL?.oficial?.sell || 195,
        'ARS': 1
    };
    
    // Convert through ARS
    if (from === 'ARS') {
        return 1 / toARS[to];
    } else if (to === 'ARS') {
        return toARS[from];
    } else {
        // Convert from -> ARS -> to
        return toARS[from] / toARS[to];
    }
}

// =================================================================================
// --- REFRESH FUNCTIONALITY
// =================================================================================

async function refreshRates() {
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn?.innerHTML;
    
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Actualizando...';
        refreshBtn.disabled = true;
    }
    
    try {
        // Force refresh by clearing cache
        lastUpdateTime = 0;
        await loadCurrencyRates();
        displayCurrencyRates();
        convertCurrency(); // Update converter with new rates
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Actualizado';
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);
        }
    } catch (error) {
        console.error('❌ Error refreshing rates:', error);
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Error';
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);
        }
    }
}

// =================================================================================
// --- UTILITY FUNCTIONS
// =================================================================================

function formatCurrency(amount, currency = 'ARS') {
    if (isNaN(amount)) return '$0';
    
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency === 'ARS' ? 'ARS' : 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return formatter.format(amount);
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 3000);
}

// =================================================================================
// --- EXPORT FOR GLOBAL ACCESS
// =================================================================================

// =================================================================================
// --- LANGUAGE MANAGEMENT
// =================================================================================

// LANGUAGE SYSTEM - Following consulting.js pattern
function setLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[key] && translations[key][lang]) {
            el.innerHTML = translations[key][lang];
        }
    });
    
    // Update placeholders
    const salaryInput = document.getElementById('annual-salary');
    if (salaryInput) {
        salaryInput.placeholder = lang === 'es' ? '3000000' : '3000000';
    }
    
    const deductionsInput = document.getElementById('deductions');
    if (deductionsInput) {
        deductionsInput.placeholder = lang === 'es' ? '500000' : '500000';
    }
    
    // Update converter placeholder
    const fromAmountInput = document.getElementById('from-amount');
    if (fromAmountInput) {
        fromAmountInput.placeholder = lang === 'es' ? '100' : '100';
    }
    
    console.log(`Language changed to: ${lang}`);
}

function initializeLanguage() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    
    // Get saved language or default to Spanish
    const savedLang = localStorage.getItem('language') || 'es';
    
    // Set initial language
    setLanguage(savedLang);
    
    // Update button states
    if (langEs && langEn) {
        langEs.classList.toggle('active', savedLang === 'es');
        langEn.classList.toggle('active', savedLang === 'en');
    }
    
    // Language toggle handlers
    if (langEs) {
        langEs.addEventListener('click', () => {
            setLanguage('es');
            localStorage.setItem('language', 'es');
            langEs.classList.add('active');
            langEn.classList.remove('active');
        });
    }
    
    if (langEn) {
        langEn.addEventListener('click', () => {
            setLanguage('en');
            localStorage.setItem('language', 'en');
            langEn.classList.add('active');
            langEs.classList.remove('active');
        });
    }
}

// =================================================================================
// --- EXPORT FOR GLOBAL ACCESS
// =================================================================================

// Make functions available globally for onclick handlers
window.calculateTax = calculateTax;
window.refreshRates = refreshRates;
window.convertCurrency = convertCurrency; 