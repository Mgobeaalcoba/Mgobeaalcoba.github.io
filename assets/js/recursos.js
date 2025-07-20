// recursos.js - JavaScript functionality for recursos útiles page

// =================================================================================
// --- IMPORTS
// =================================================================================

import { translations } from './translations.js';

// =================================================================================
// --- TRANSLATION HELPER
// =================================================================================

function getTranslation(key) {
    const currentLang = document.documentElement.lang || 'es';
    return translations[key] && translations[key][currentLang] ? 
        translations[key][currentLang] : key;
}

// =================================================================================
// --- GLOBAL VARIABLES AND CONFIG
// =================================================================================

let resourcesConfig = null;
let currencyRates = null;
let lastUpdateTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let historicalChart = null;
let currentChartData = null;

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
        
        // Initialize economic indicators
        initializeEconomicIndicators();
        
        // Initialize holidays widget
        refreshHolidays();
        
        console.log('✅ Recursos page initialized successfully');
        
        // Force language application after all content is loaded
        setTimeout(() => {
            const currentLang = localStorage.getItem('language') || 'es';
            setLanguage(currentLang);
            console.log('🔄 Forced language application:', currentLang);
        }, 500);
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
// --- CURRENCY MANAGEMENT WITH DOLARAPI INTEGRATION
// =================================================================================

async function loadCurrencyRates() {
    try {
        // Check cache validity
        if (currencyRates && (Date.now() - lastUpdateTime) < CACHE_DURATION) {
            console.log('📊 Using cached currency rates');
            return;
        }
        
        console.log('🔄 Fetching fresh currency rates from DolarApi...');
        
        // Fetch from DolarApi and other sources
        const [dolarApiData, cotizacionesData, exchangeData] = await Promise.allSettled([
            fetch('https://dolarapi.com/v1/dolares').then(r => r.json()),
            fetch('https://dolarapi.com/v1/cotizaciones').then(r => r.json()),
            fetch('https://api.exchangerate-api.com/v4/latest/USD').then(r => r.json())
        ]);
        
        // Process and combine data
        currencyRates = processDolarApiData(dolarApiData, cotizacionesData, exchangeData);
        lastUpdateTime = Date.now();
        
        console.log('✅ Currency rates updated with DolarApi');
    } catch (error) {
        console.error('❌ Error loading currency rates:', error);
        // Use fallback or cached data if available
        if (!currencyRates) {
            currencyRates = getFallbackRates();
        }
    }
}

function processDolarApiData(dolarApiResult, cotizacionesResult, exchangeResult) {
    const rates = {
        USD: {},
        EUR: {},
        BRL: {},
        lastUpdate: new Date().toLocaleString('es-AR'),
        source: 'DolarApi.com'
    };
    
    // Process DolarApi dollar data
    if (dolarApiResult.status === 'fulfilled' && dolarApiResult.value) {
        const dolares = dolarApiResult.value;
        
        // Map different dollar types
        const dolarTypes = {
            'oficial': 'oficial',
            'blue': 'blue', 
            'bolsa': 'mep',
            'contadoconliqui': 'ccl',
            'mayorista': 'mayorista',
            'tarjeta': 'tarjeta',
            'cripto': 'cripto'
        };
        
        dolares.forEach(dolar => {
            const type = dolarTypes[dolar.casa];
            if (type) {
                rates.USD[type] = {
                    buy: dolar.compra || 0,
                    sell: dolar.venta || 0,
                    name: dolar.nombre,
                    lastUpdate: dolar.fechaActualizacion
                };
            }
        });
        
        // Calculate credit card dollar if official rate is available
        if (rates.USD.oficial && rates.USD.oficial.sell) {
            const officialRate = rates.USD.oficial.sell;
            const creditCardRate = calculateCreditCardRate(officialRate);
            rates.USD.tarjeta = {
                buy: creditCardRate,
                sell: creditCardRate,
                name: 'Tarjeta (Calculado)',
                lastUpdate: rates.USD.oficial.lastUpdate
            };
        }
    }
    
    // Process DolarApi other currencies (EUR, BRL)
    if (cotizacionesResult.status === 'fulfilled' && cotizacionesResult.value) {
        const cotizaciones = cotizacionesResult.value;
        
        cotizaciones.forEach(moneda => {
            if (moneda.moneda === 'EUR') {
                rates.EUR.oficial = {
                    buy: moneda.compra || 0,
                    sell: moneda.venta || 0,
                    name: moneda.nombre,
                    lastUpdate: moneda.fechaActualizacion
                };
            } else if (moneda.moneda === 'BRL') {
                rates.BRL.oficial = {
                    buy: moneda.compra || 0,
                    sell: moneda.venta || 0,
                    name: moneda.nombre,
                    lastUpdate: moneda.fechaActualizacion
                };
            }
        });
    }
    
    // Fallback with Exchange Rate API if DolarApi fails
    if (exchangeResult.status === 'fulfilled' && exchangeResult.value?.rates) {
        const exchangeRates = exchangeResult.value.rates;
        
        // Only use as fallback if DolarApi data is missing
        if (!rates.USD.oficial && exchangeRates.ARS) {
            const usdToArs = exchangeRates.ARS;
            rates.USD.oficial = {
                buy: usdToArs * 0.98,
                sell: usdToArs * 1.02,
                name: 'Oficial (Fallback)',
                lastUpdate: new Date().toISOString()
            };
        }
        
        if (!rates.EUR.oficial && exchangeRates.EUR && exchangeRates.ARS) {
            const eurToArs = exchangeRates.ARS / exchangeRates.EUR;
            rates.EUR.oficial = {
                buy: eurToArs * 0.98,
                sell: eurToArs * 1.02,
                name: 'Euro (Fallback)',
                lastUpdate: new Date().toISOString()
            };
        }
        
        if (!rates.BRL.oficial && exchangeRates.BRL && exchangeRates.ARS) {
            const brlToArs = exchangeRates.ARS / exchangeRates.BRL;
            rates.BRL.oficial = {
                buy: brlToArs * 0.98,
                sell: brlToArs * 1.02,
                name: 'Real (Fallback)',
                lastUpdate: new Date().toISOString()
            };
        }
    }
    
    return rates;
}

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

function displayCurrencyRates() {
    const container = document.getElementById('currency-rates');
    if (!container || !currencyRates) return;
    
    // Create header with source and last update
    const header = document.createElement('div');
    header.className = 'mb-4 text-center';
    header.innerHTML = `
        <div class="text-sm text-gray-600 dark:text-gray-400">
            ${getTranslation('quotes.source')}: ${currencyRates.source || 'DolarApi.com'} | 
            ${getTranslation('quotes.last_update')}: ${currencyRates.lastUpdate}
        </div>
    `;
    
    container.innerHTML = '';
    container.appendChild(header);
    
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
    updateInfo.textContent = `${getTranslation('currency.last_update')}: ${currencyRates.lastUpdate}`;
    container.appendChild(updateInfo);
}

function createCurrencyRateItem(code, name, symbol, rates) {
    const item = document.createElement('div');
    item.className = 'currency-rate-item';
    
    // Create header with currency info
    const header = document.createElement('div');
    header.className = 'currency-header';
    header.innerHTML = `
        <h4 class="currency-title">
            <span class="currency-symbol">${symbol}</span>
            <span class="currency-name">${code} - ${getTranslation(`currency.${code.toLowerCase()}_title`) || name}</span>
        </h4>
    `;
    
    const ratesGrid = document.createElement('div');
    ratesGrid.className = 'currency-rates-grid';
    
    // Define display names for dollar types
    const typeNames = {
        'oficial': getTranslation('currency.official'),
        'blue': getTranslation('currency.blue'),
        'mep': getTranslation('currency.mep'),
        'ccl': getTranslation('currency.ccl'),
        'mayorista': getTranslation('currency.wholesale'),
        'tarjeta': getTranslation('currency.card'),
        'cripto': getTranslation('currency.crypto')
    };
    
    // Sort rates to show in preferred order
    const preferredOrder = ['oficial', 'blue', 'mep', 'ccl', 'mayorista', 'tarjeta', 'cripto'];
    const sortedRates = Object.entries(rates).sort(([a], [b]) => {
        const orderA = preferredOrder.indexOf(a);
        const orderB = preferredOrder.indexOf(b);
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
    });
    
    // Add rate types with enhanced display
    sortedRates.forEach(([type, values]) => {
        if (values && typeof values === 'object' && (values.buy || values.sell)) {
            const rateType = document.createElement('div');
            rateType.className = 'rate-type';
            
            // Calculate spread percentage for USD types
            const spread = values.buy && values.sell ? 
                (((values.sell - values.buy) / values.buy) * 100).toFixed(1) : null;
                
            // Get premium vs official for non-official USD rates
            const isUSD = code === 'USD';
            const isOfficial = type === 'oficial';
            let premium = '';
            if (isUSD && !isOfficial && rates.oficial?.sell && values.sell) {
                const premiumPerc = (((values.sell - rates.oficial.sell) / rates.oficial.sell) * 100).toFixed(1);
                premium = `<span class="text-xs ${premiumPerc > 0 ? 'text-red-500' : 'text-green-500'}">
                    ${premiumPerc > 0 ? '+' : ''}${premiumPerc}%
                </span>`;
            }
            
            rateType.innerHTML = `
                <div class="rate-label">
                    ${typeNames[type] || type.toUpperCase()}
                    ${premium}
                </div>
                <div class="rate-values">
                    ${values.buy ? `<div class="rate-buy">${getTranslation('currency.buy')}: $${values.buy.toFixed(2)}</div>` : ''}
                    ${values.sell ? `<div class="rate-sell">${getTranslation('currency.sell')}: $${values.sell.toFixed(2)}</div>` : ''}
                    ${spread ? `<div class="rate-spread text-xs">${getTranslation('currency.spread')}: ${spread}%</div>` : ''}
                </div>
            `;
            
            // Make rate type clickable for historical charts
            const clickableTypes = {
                'USD': ['oficial', 'blue', 'mep', 'ccl', 'mayorista', 'tarjeta', 'cripto'],
                'EUR': ['oficial'],
                'BRL': ['oficial']
            };
            
            if (clickableTypes[code] && clickableTypes[code].includes(type)) {
                rateType.classList.add('clickable');
                
                // Remove any existing click handlers
                rateType.onclick = null;
                
                rateType.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const rateDisplayName = typeNames[type] || type.toUpperCase();
                    const currencyName = code === 'USD' ? 'Dólar' : code === 'EUR' ? 'Euro' : 'Real';
                    
                    console.log(`💱 Opening chart for ${code} ${type}: ${currencyName} ${rateDisplayName}`);
                    
                    // For EUR and BRL, pass the currency code instead of the rate type
                    const chartParameter = (code === 'EUR' || code === 'BRL') ? code : type;
                    showHistoricalChart(chartParameter, `${currencyName} ${rateDisplayName}`);
                });
            }
            ratesGrid.appendChild(rateType);
        }
    });
    
    item.appendChild(header);
    item.appendChild(ratesGrid);
    
    return item;
}

// Calculate credit card dollar rate based on official rate and date
function calculateCreditCardRate(officialRate, date = new Date()) {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // January is 0
    
    let totalPercentage = 0;
    
    if (year === 2023) {
        if (month <= 9) {
            // Until September 2023: 30% PAIS + 35% Ganancias = 65%
            totalPercentage = 0.65;
        } else if (month === 10) {
            // October 2023: 30% PAIS + 35% Ganancias + 25% Bienes Personales = 90%
            totalPercentage = 0.90;
        } else {
            // November-December 2023: 30% PAIS + 100% Ganancias + 25% Bienes Personales = 155%
            totalPercentage = 1.55;
        }
    } else if (year === 2024) {
        if (month === 12) {
            // December 2024: 30% Ganancias (PAIS eliminated)
            totalPercentage = 0.30;
        } else {
            // January-November 2024: 30% PAIS + 30% Ganancias = 60%
            totalPercentage = 0.60;
        }
    } else if (year >= 2025) {
        // 2025 onwards: 30% Ganancias
        totalPercentage = 0.30;
    }
    
    const creditCardRate = officialRate * (1 + totalPercentage);
    return Math.round(creditCardRate * 100) / 100;
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
    const exchangeRateText = document.getElementById('exchange-rate-text');
    
    if (!toAmountInput || !fromCurrency || !toCurrency) {
        if (toAmountInput) toAmountInput.value = '';
        updateExchangeRateInfo('', '');
        return;
    }
    
    const rate = getConversionRate(fromCurrency, toCurrency);
    
    if (fromAmount <= 0) {
        toAmountInput.value = '';
        updateExchangeRateInfo(fromCurrency, toCurrency, rate);
        return;
    }
    
    const convertedAmount = fromAmount * rate;
    toAmountInput.value = convertedAmount.toFixed(2);
    updateExchangeRateInfo(fromCurrency, toCurrency, rate);
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

function updateExchangeRateInfo(fromCurrency, toCurrency, rate) {
    const exchangeRateText = document.getElementById('exchange-rate-text');
    if (!exchangeRateText) return;
    
    if (!fromCurrency || !toCurrency || !rate) {
        exchangeRateText.textContent = getTranslation('recursos_converter_rate_info');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        exchangeRateText.textContent = getTranslation('recursos_converter_same_currency');
        return;
    }
    
    // Currency symbols
    const symbols = {
        'ARS': '$',
        'USD': '$',
        'EUR': '€',
        'BRL': 'R$'
    };
    
    // Currency names with translations
    const names = {
        'ARS': getTranslation('currency.ars_name') || 'Peso Argentino',
        'USD': getTranslation('currency.usd_name') || 'Dólar',
        'EUR': getTranslation('currency.eur_name') || 'Euro',
        'BRL': getTranslation('currency.brl_name') || 'Real'
    };
    
    const fromSymbol = symbols[fromCurrency] || '';
    const toSymbol = symbols[toCurrency] || '';
    const fromName = names[fromCurrency] || fromCurrency;
    const toName = names[toCurrency] || toCurrency;
    
    // Get rate type info for USD with translation
    let rateInfo = '';
    if ((fromCurrency === 'USD' || toCurrency === 'USD') && currencyRates?.USD?.blue) {
        rateInfo = getTranslation('recursos_converter_blue_rate');
    }
    
    // Create exchange rate info text
    exchangeRateText.innerHTML = `
        1 ${fromName} = ${toSymbol}${rate.toFixed(4)} ${toName}${rateInfo}
        <span style="margin-left: 0.5rem; opacity: 0.7;">•</span>
        <span style="margin-left: 0.5rem;">1 ${toName} = ${fromSymbol}${(1/rate).toFixed(4)} ${fromName}</span>
    `;
}

// =================================================================================
// --- REFRESH FUNCTIONALITY
// =================================================================================

async function refreshRates() {
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn?.innerHTML;
    
    if (refreshBtn) {
        refreshBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${getTranslation('recursos_loading_quotes')}`;
        refreshBtn.disabled = true;
    }
    
    try {
        // Force refresh by clearing cache
        lastUpdateTime = 0;
        await loadCurrencyRates();
        displayCurrencyRates();
        convertCurrency(); // Update converter with new rates
        
        if (refreshBtn) {
            refreshBtn.innerHTML = `<i class="fas fa-check mr-2"></i>${getTranslation('recursos_updated')}`;
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 2000);
        }
    } catch (error) {
        console.error('❌ Error refreshing rates:', error);
        if (refreshBtn) {
            refreshBtn.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>${getTranslation('recursos_error')}`;
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
        } else {
            console.warn(`Translation not found for key: ${key} in language: ${lang}`);
        }
    });
    
    // Force update currency display with translations
    if (currencyRates) {
        setTimeout(() => {
            displayCurrencyRates();
        }, 100);
    }
    
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
    
    // Refresh dynamic content
    if (currencyRates) {
        displayCurrencyRates();
    }
    
    // Update converter info
    convertCurrency();
    
    // Update button text if it's in "Updated" state
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn && refreshBtn.disabled && (refreshBtn.textContent.includes('Actualizado') || refreshBtn.textContent.includes('Updated'))) {
        refreshBtn.innerHTML = `<i class="fas fa-check mr-2"></i>${getTranslation('recursos_updated')}`;
    }
    
    console.log(`Language changed to: ${lang}`);
}

function initializeLanguage() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    
    // ALWAYS default to Spanish on recursos page to fix translation issues
    let savedLang = 'es';
    localStorage.setItem('language', 'es');
    
    // Set initial language to Spanish
    setLanguage(savedLang);
    
    // Update button states - ensure Spanish is always active initially
    if (langEs && langEn) {
        langEs.classList.remove('active');
        langEn.classList.remove('active');
        langEs.classList.add('active');
    }
    
    // Force update button states after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (langEs && langEn) {
            langEs.classList.remove('active');
            langEn.classList.remove('active');
            langEs.classList.add('active');
        }
    }, 100);
    
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

// =================================================================================
// --- HISTORICAL CHART SYSTEM
// =================================================================================

async function loadHistoricalData(casa, days = 7) {
    try {
        console.log(`📊 Loading historical data for ${casa} (${days} days)`);
        
        let url;
        let data;
        
        // Handle different currency types
        if (casa === 'EUR' || casa === 'BRL') {
            // For EUR and BRL, use Banco Central API with date parameters
            const codMoneda = casa === 'EUR' ? 'EUR' : 'BRL';
            
            // Calculate date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            
            const fechaDesde = startDate.toISOString().split('T')[0];
            const fechaHasta = endDate.toISOString().split('T')[0];
            
            url = `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/${codMoneda}?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
            
            const response = await fetch(url, {
                redirect: 'follow'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            data = await response.json();
            console.log(`📈 Received ${data.results?.length || 0} historical records for ${casa} from BCRA`);
            
            // Process BCRA data format
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            const filteredData = data.results
                .filter(item => new Date(item.fecha) >= cutoffDate)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map(item => {
                    const detalle = item.detalle[0]; // Get first detail item
                    return {
                        fecha: item.fecha,
                        compra: parseFloat(detalle.tipoCotizacion),
                        venta: parseFloat(detalle.tipoCotizacion), // BCRA only provides one rate
                        casa: casa
                    };
                });
            
            return filteredData;
        } else {
            // For USD types, use ArgentinaDatos API
            const baseUrl = 'https://api.argentinadatos.com/v1';
            url = `${baseUrl}/cotizaciones/dolares/${casa}`;
            
            const response = await fetch(url, {
                redirect: 'follow'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            data = await response.json();
            console.log(`📈 Received ${data.length} historical records for ${casa} from ArgentinaDatos`);
            
            // Filter USD data
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            const filteredData = data
                .filter(item => new Date(item.fecha) >= cutoffDate)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            
            return filteredData;
        }
    } catch (error) {
        console.error(`❌ Error loading historical data for ${casa}:`, error);
        // Fallback to sample data if API fails
        console.log(`🔄 Using sample data as fallback for ${casa}`);
        return generateSampleHistoricalData(casa, days);
    }
}

function generateSampleHistoricalData(casa, days) {
    const data = [];
    const baseRates = {
        'oficial': { buy: 1250, sell: 1300 },
        'blue': { buy: 1285, sell: 1305 },
        'mep': { buy: 1289, sell: 1294 },
        'ccl': { buy: 1300, sell: 1269 },
        'mayorista': { buy: 1277, sell: 1286 },
        'tarjeta': { buy: 1950, sell: 1950 }, // Calculated rate
        'cripto': { buy: 1290, sell: 1300 },
        'EUR': { buy: 1350, sell: 1400 },
        'BRL': { buy: 250, sell: 260 }
    };
    
    const baseRate = baseRates[casa] || baseRates['blue'];
    const volatility = 0.02; // 2% daily volatility
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Add some realistic variation
        const variation = (Math.random() - 0.5) * volatility;
        const buyRate = Math.round(baseRate.buy * (1 + variation) * 100) / 100;
        const sellRate = Math.round(baseRate.sell * (1 + variation) * 100) / 100;
        
        data.push({
            fecha: date.toISOString().split('T')[0],
            compra: buyRate,
            venta: sellRate,
            casa: casa
        });
    }
    
    return data;
}

function createHistoricalChart(data, casa, period) {
    console.log(`📈 Creating historical chart for ${casa} with ${data.length} data points`);
    
    const ctx = document.getElementById('historical-chart');
    if (!ctx) {
        console.error('❌ Chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (historicalChart) {
        console.log('🔨 Destroying existing historical chart');
        historicalChart.destroy();
        historicalChart = null;
    }
    
    // Also destroy window charts
    if (window.historicalChart) {
        window.historicalChart.destroy();
        window.historicalChart = null;
    }
    
    // Prepare chart data
    const labels = data.map(item => {
        const date = new Date(item.fecha);
        return date.toLocaleDateString('es-AR', { 
            month: 'short', 
            day: 'numeric' 
        });
    });
    
    const buyData = data.map(item => item.compra);
    const sellData = data.map(item => item.venta);
    
    // Determine theme colors
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#ffffff' : '#000000';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const backgroundColor = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.99)';
    
    // Chart configuration
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Compra',
                    data: buyData,
                    borderColor: '#10b981',
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.3)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: textColor,
                    pointBorderWidth: 2
                },
                {
                    label: 'Venta',
                    data: sellData,
                    borderColor: '#ef4444',
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.3)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: textColor,
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: backgroundColor,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            weight: '600',
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('es-AR')}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-AR');
                        }
                    }
                }
            }
        }
    };
    
    // Create new chart
    historicalChart = new Chart(ctx, config);
    currentChartData = { data, casa, period };
    
    console.log('✅ Historical chart created successfully');
}

function showHistoricalChart(casa, rateName) {
    console.log(`📊 Opening historical chart for ${casa}: ${rateName}`);
    
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    const dateRange = document.getElementById('chart-date-range');
    
    if (!modal || !chartTitle) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    // Clear any existing modal content first
    clearModalContent();
    
    // Update modal title and subtitle based on currency type
    chartTitle.textContent = `${rateName} - Evolución Histórica`;
    
    // Set subtitle based on currency type
    if (casa === 'EUR' || casa === 'BRL') {
        chartSubtitle.textContent = `Datos de Banco Central de Argentina`;
    } else {
        chartSubtitle.textContent = `Datos de ArgentinaDatos API`;
    }
    
    if (dateRange) {
        dateRange.textContent = getTranslation('time_range.last_7_days');
    }
    
    // Create modal body content with chart container and time filters
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <!-- Filtros de Tiempo -->
            <div class="time-filters">
                <button class="time-filter active" data-period="7d">${getTranslation('time.7_days')}</button>
                <button class="time-filter" data-period="30d">${getTranslation('time.30_days')}</button>
                <button class="time-filter" data-period="90d">${getTranslation('time.90_days')}</button>
                <button class="time-filter" data-period="1y">${getTranslation('time.1_year')}</button>
            </div>
            
            <!-- Contenedor del Gráfico -->
            <div class="chart-container">
                <canvas id="historical-chart"></canvas>
            </div>
            
            <!-- Información del Gráfico -->
            <div class="chart-info">
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span id="chart-date-range">${getTranslation('time_range.last_7_days')}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-database"></i>
                    <span id="chart-data-source">${casa === 'EUR' || casa === 'BRL' ? 'Banco Central' : 'ArgentinaDatos'}</span>
                </div>
            </div>
        `;
    }
    
    // Setup close functionality
    setupModalCloseHandlers(modal, modalBody);
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Load initial data (7 days)
    loadHistoricalData(casa, 7).then(data => {
        if (data && data.length > 0) {
            createHistoricalChart(data, casa, '7d');
            // Initialize time filter handlers after chart is created
            initializeTimeFilters(casa);
        } else {
            console.error('❌ No data received for chart');
            showErrorMessage('No se encontraron datos históricos para este indicador');
        }
    }).catch(error => {
        console.error('❌ Error loading initial chart data:', error);
        showErrorMessage('Error al cargar los datos históricos');
    });
}

function initializeTimeFilters(casa) {
    console.log(`🔧 Setting up time filters for ${casa}`);
    
    const timeFilters = document.querySelectorAll('.time-filter');
    const dateRange = document.getElementById('chart-date-range');
    
    if (timeFilters.length === 0) {
        console.warn('⚠️ No time filters found');
        return;
    }
    
    timeFilters.forEach(filter => {
        // Remove any existing onclick handlers
        filter.onclick = null;
        
        filter.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`🕒 Time filter clicked: ${filter.getAttribute('data-period')}`);
            
            // Update active state
            timeFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const period = filter.getAttribute('data-period');
            let days, rangeText;
            
            switch (period) {
                case '7d':
                    days = 7;
                    rangeText = getTranslation('time_range.last_7_days');
                    break;
                case '30d':
                    days = 30;
                    rangeText = getTranslation('time_range.last_30_days');
                    break;
                case '90d':
                    days = 90;
                    rangeText = getTranslation('time_range.last_90_days');
                    break;
                case '1y':
                    days = 365;
                    rangeText = getTranslation('time_range.last_1_year');
                    break;
                default:
                    days = 7;
                    rangeText = getTranslation('time_range.last_7_days');
            }
            
            // Update date range text
            if (dateRange) {
                dateRange.textContent = rangeText;
            }
            
            try {
                console.log(`📊 Loading ${days} days of data for ${casa}`);
                const data = await loadHistoricalData(casa, days);
                if (data && data.length > 0) {
                    createHistoricalChart(data, casa, period);
                } else {
                    console.error('❌ No data received for time filter');
                    showErrorMessage('No se encontraron datos para este período');
                }
            } catch (error) {
                console.error('❌ Error loading chart data for period:', error);
                showErrorMessage('Error al cargar los datos para este período');
            }
        };
    });
    
    console.log(`✅ Time filters configured for ${casa}`);
}

// Make chart functions available globally
window.showHistoricalChart = showHistoricalChart;

// =================================================================================
// --- ECONOMIC INDICATORS SYSTEM
// =================================================================================

// Inflation Widget
async function loadInflationData() {
    try {
        console.log('📊 Loading inflation data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📈 Inflation data loaded:', data);
        
        if (data && data.length > 0) {
            const latest = data[data.length - 1];
            const previous = data[data.length - 2];
            
            return {
                current: latest.valor,
                previous: previous ? previous.valor : null,
                date: latest.fecha,
                variation: previous ? ((latest.valor - previous.valor) / previous.valor * 100).toFixed(2) : null
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading inflation data:', error);
        return null;
    }
}

// Annual Inflation Widget
async function loadAnnualInflationData() {
    try {
        console.log('📊 Loading annual inflation data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📈 Annual inflation data loaded:', data);
        
        if (data && data.length > 0) {
            const latest = data[data.length - 1];
            const previous = data[data.length - 2];
            
            return {
                current: latest.valor,
                previous: previous ? previous.valor : null,
                date: latest.fecha,
                variation: previous ? ((latest.valor - previous.valor) / previous.valor * 100).toFixed(2) : null
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading annual inflation data:', error);
        return null;
    }
}

// UVA Index Widget
async function loadUVAData() {
    try {
        console.log('📊 Loading UVA data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/uva', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📈 UVA data loaded:', data);
        
        if (data && data.length > 0) {
            const latest = data[data.length - 1];
            const previous = data[data.length - 2];
            
            return {
                current: latest.valor,
                previous: previous ? previous.valor : null,
                date: latest.fecha,
                variation: previous ? ((latest.valor - previous.valor) / previous.valor * 100).toFixed(2) : null
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading UVA data:', error);
        return null;
    }
}

// Country Risk Widget
async function loadCountryRiskData() {
    try {
        console.log('⚠️ Loading country risk data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('⚠️ Country risk data loaded:', data);
        
        if (data) {
            return {
                current: data.valor,
                date: data.fecha,
                level: getRiskLevel(data.valor)
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading country risk data:', error);
        return null;
    }
}

// Fixed Term Deposits Widget
async function loadFixedTermData() {
    try {
        console.log('💰 Loading fixed term deposits data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('💰 Fixed term deposits data loaded:', data);
        
        if (data && data.length > 0) {
            // Filter valid rates and calculate average
            const validRates = data.filter(bank => bank.tnaClientes && bank.tnaClientes > 0);
            const averageRate = validRates.reduce((sum, bank) => sum + bank.tnaClientes, 0) / validRates.length;
            const maxRate = Math.max(...validRates.map(bank => bank.tnaClientes));
            const minRate = Math.min(...validRates.map(bank => bank.tnaClientes));
            
            return {
                average: averageRate,
                max: maxRate,
                min: minRate,
                banks: validRates.length,
                topBanks: validRates
                    .sort((a, b) => b.tnaClientes - a.tnaClientes)
                    .slice(0, 5)
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading fixed term deposits data:', error);
        return null;
    }
}

// FCI Widget
async function loadFCIData() {
    try {
        console.log('📊 Loading FCI data...');
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 FCI data loaded:', data);
        
        if (data && data.length > 0) {
            // Filter valid funds and calculate average
            const validFunds = data.filter(fund => fund.vcp && fund.vcp > 0);
            const averageVCP = validFunds.reduce((sum, fund) => sum + fund.vcp, 0) / validFunds.length;
            const maxVCP = Math.max(...validFunds.map(fund => fund.vcp));
            const minVCP = Math.min(...validFunds.map(fund => fund.vcp));
            
            return {
                average: averageVCP,
                max: maxVCP,
                min: minVCP,
                funds: validFunds.length,
                topFunds: validFunds
                    .sort((a, b) => b.vcp - a.vcp)
                    .slice(0, 5)
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading FCI data:', error);
        return null;
    }
}

// Helper function to get risk level
function getRiskLevel(value) {
    if (value < 300) return 'low';
    if (value < 600) return 'medium';
    if (value < 1000) return 'high';
    return 'very-high';
}

// Update widget content
function updateWidgetContent(widgetId, data, type) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;
    
    const contentDiv = widget.querySelector('.widget-content');
    const loadingDiv = widget.querySelector('.widget-loading');
    const errorDiv = widget.querySelector('.widget-error');
    
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    
    if (!data) {
        if (errorDiv) errorDiv.style.display = 'block';
        return;
    }
    
    if (contentDiv) {
        contentDiv.style.display = 'block';
        
        switch (type) {
            case 'inflation':
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.current}%</div>
                    <div class="indicator-label">${getTranslation('indicator.monthly_inflation')}</div>
                    ${data.variation ? `<div class="indicator-change ${data.variation > 0 ? 'positive' : 'negative'}">${data.variation > 0 ? '+' : ''}${data.variation}%</div>` : ''}
                    <div class="indicator-date">${formatDate(data.date)}</div>
                `;
                break;
                
            case 'annual-inflation':
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.current}%</div>
                    <div class="indicator-label">${getTranslation('indicator.annual_inflation')}</div>
                    ${data.variation ? `<div class="indicator-change ${data.variation > 0 ? 'positive' : 'negative'}">${data.variation > 0 ? '+' : ''}${data.variation}%</div>` : ''}
                    <div class="indicator-date">${formatDate(data.date)}</div>
                `;
                break;
                
            case 'uva':
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.current.toLocaleString()}</div>
                    <div class="indicator-label">${getTranslation('indicator.uva_index')}</div>
                    ${data.variation ? `<div class="indicator-change ${data.variation > 0 ? 'positive' : 'negative'}">${data.variation > 0 ? '+' : ''}${data.variation}%</div>` : ''}
                    <div class="indicator-date">${formatDate(data.date)}</div>
                `;
                break;
                
            case 'risk':
                contentDiv.innerHTML = `
                    <div class="indicator-value risk-${data.level}">${data.current}</div>
                    <div class="indicator-label">${getTranslation('indicator.country_risk')}</div>
                    <div class="indicator-level">${getRiskLevelText(data.level)}</div>
                    <div class="indicator-date">${formatDate(data.date)}</div>
                `;
                break;
                
            case 'fixed-term':
                contentDiv.innerHTML = `
                    <div class="indicator-value">${(data.average * 100).toFixed(2)}%</div>
                    <div class="indicator-label">${getTranslation('indicator.fixed_term')}</div>
                    <div class="indicator-range">${(data.min * 100).toFixed(1)}% - ${(data.max * 100).toFixed(1)}%</div>
                    <div class="indicator-banks">${data.banks} ${getTranslation('recursos_banks_label')}</div>
                `;
                break;
                
            case 'fci':
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.average.toFixed(2)}</div>
                    <div class="indicator-label">${getTranslation('indicator.fci')}</div>
                    <div class="indicator-range">${data.min.toFixed(2)} - ${data.max.toFixed(2)}</div>
                    <div class="indicator-funds">${data.funds} ${getTranslation('recursos_funds_label')}</div>
                `;
                break;
        }
    }
}

// Helper functions
function getCurrentLanguage() {
    return window.currentLanguage || 'es';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'en' ? 'en-US' : 'es-AR';
    
    return date.toLocaleDateString(locale, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getRiskLevelText(level) {
    const levelMap = {
        'low': 'risk.low',
        'medium': 'risk.medium',
        'high': 'risk.high',
        'very-high': 'risk.very_high'
    };
    
    const translationKey = levelMap[level];
    return translationKey ? getTranslation(translationKey) : 'N/A';
}

// Initialize economic indicators
async function initializeEconomicIndicators() {
    console.log('🚀 Initializing economic indicators...');
    
    // Load all indicators in parallel
    const [
        inflationData,
        annualInflationData,
        uvaData,
        riskData,
        fixedTermData,
        fciData
    ] = await Promise.all([
        loadInflationData(),
        loadAnnualInflationData(),
        loadUVAData(),
        loadCountryRiskData(),
        loadFixedTermData(),
        loadFCIData()
    ]);
    
    // Update widgets
    updateWidgetContent('inflation-widget', inflationData, 'inflation');
    updateWidgetContent('annual-inflation-widget', annualInflationData, 'annual-inflation');
    updateWidgetContent('uva-widget', uvaData, 'uva');
    updateWidgetContent('risk-widget', riskData, 'risk');
    updateWidgetContent('fixed-term-widget', fixedTermData, 'fixed-term');
    updateWidgetContent('fci-widget', fciData, 'fci');
    
    console.log('✅ Economic indicators initialized');
}

// Refresh widget function
async function refreshWidget(widgetId) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;
    
    const loadingDiv = widget.querySelector('.widget-loading');
    const errorDiv = widget.querySelector('.widget-error');
    const contentDiv = widget.querySelector('.widget-content');
    
    // Show loading
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
    if (contentDiv) contentDiv.style.display = 'none';
    
    try {
        let data = null;
        let type = '';
        
        switch (widgetId) {
            case 'inflation-widget':
                data = await loadInflationData();
                type = 'inflation';
                break;
            case 'annual-inflation-widget':
                data = await loadAnnualInflationData();
                type = 'annual-inflation';
                break;
            case 'uva-widget':
                data = await loadUVAData();
                type = 'uva';
                break;
            case 'risk-widget':
                data = await loadCountryRiskData();
                type = 'risk';
                break;
            case 'fixed-term-widget':
                data = await loadFixedTermData();
                type = 'fixed-term';
                break;
            case 'fci-widget':
                data = await loadFCIData();
                type = 'fci';
                break;
        }
        
        updateWidgetContent(widgetId, data, type);
        
    } catch (error) {
        console.error(`❌ Error refreshing widget ${widgetId}:`, error);
        if (errorDiv) errorDiv.style.display = 'block';
    }
}

// =================================================================================
// --- REFRESH FUNCTIONS FOR GLOBAL ACCESS
// =================================================================================

// Refresh functions for individual widgets
async function refreshInflation() {
    await refreshWidget('inflation-widget');
}

async function refreshAnnualInflation() {
    await refreshWidget('annual-inflation-widget');
}

async function refreshUVA() {
    await refreshWidget('uva-widget');
}

async function refreshRisk() {
    await refreshWidget('risk-widget');
}

async function refreshFixedTerm() {
    await refreshWidget('fixed-term-widget');
}

async function refreshFCI() {
    await refreshWidget('fci-widget');
}

// =================================================================================
// --- HOLIDAYS WIDGET
// =================================================================================

// Helper function to parse holiday dates correctly (avoiding timezone issues)
function parseHolidayDate(dateString) {
    const dateParts = dateString.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
}

async function loadHolidaysData() {
    try {
        console.log('📅 Loading holidays data...');
        const currentYear = new Date().getFullYear();
        const response = await fetch(`https://api.argentinadatos.com/v1/feriados/${currentYear}`, {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📅 Holidays data loaded:', data);
        
        if (data && data.length > 0) {
            return {
                holidays: data,
                total: data.length,
                year: currentYear
            };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error loading holidays data:', error);
        return null;
    }
}

async function refreshHolidays() {
    const holidaysData = document.getElementById('holidays-data');
    if (!holidaysData) return;
    
    // Show loading
    holidaysData.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin text-2xl text-sky-400"></i>
            <p class="mt-2 text-gray-400" data-translate="recursos_loading_holidays">Cargando feriados...</p>
        </div>
    `;
    
    try {
        const data = await loadHolidaysData();
        
        if (data && data.holidays) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Filtrar solo feriados futuros y ordenar por fecha
            const futureHolidays = data.holidays
                .filter(holiday => {
                    const holidayDate = parseHolidayDate(holiday.fecha);
                    holidayDate.setHours(0, 0, 0, 0);
                    return holidayDate >= today;
                })
                .sort((a, b) => parseHolidayDate(a.fecha) - parseHolidayDate(b.fecha))
                .slice(0, 3); // Solo los próximos 3
            
            const holidaysList = futureHolidays
                .map(holiday => {
                    const date = parseHolidayDate(holiday.fecha);
                    const currentLang = getCurrentLanguage();
                    const locale = currentLang === 'en' ? 'en-US' : 'es-AR';
                    const formattedDate = date.toLocaleDateString(locale, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    });
                    return `<div class="holiday-item">
                        <div class="holiday-date">${formattedDate}</div>
                        <div class="holiday-name">${holiday.nombre}</div>
                    </div>`;
                })
                .join('');
            
            holidaysData.innerHTML = `
                <div class="holidays-summary">
                    <div class="holidays-count">${getTranslation('holidays.next_3')}</div>
                </div>
                <div class="holidays-list">
                    ${holidaysList}
                </div>
            `;
        } else {
            holidaysData.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle text-red-400"></i>
                    <p class="mt-2 text-gray-400">No se pudieron cargar los feriados</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error refreshing holidays:', error);
        holidaysData.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle text-red-400"></i>
                <p class="mt-2 text-gray-400">Error al cargar los feriados</p>
            </div>
        `;
    }
}

// =================================================================================
// --- MODAL MANAGEMENT SYSTEM
// =================================================================================

function clearModalContent() {
    console.log('🧹 Clearing modal content...');
    
    // Clear modal body content but preserve chart canvas
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        // Save the chart canvas before clearing
        const chartCanvas = document.getElementById('historical-chart');
        let canvasParent = null;
        
        if (chartCanvas) {
            canvasParent = chartCanvas.parentNode;
            canvasParent.removeChild(chartCanvas);
            console.log('📊 Chart canvas temporarily removed');
        }
        
        // Clear all content
        modalBody.innerHTML = '';
        
        // Restore the chart canvas
        if (chartCanvas) {
            modalBody.appendChild(chartCanvas);
            console.log('📊 Chart canvas restored');
        } else {
            // Create chart canvas if it doesn't exist
            const canvas = document.createElement('canvas');
            canvas.id = 'historical-chart';
            canvas.width = 800;
            canvas.height = 400;
            modalBody.appendChild(canvas);
            console.log('📊 Chart canvas created');
        }
        
        // Ensure we have the time filters structure
        if (!document.querySelector('.time-filters')) {
            const filtersHTML = `
                <div class="time-filters">
                    <button class="time-filter active" data-period="7d">${getTranslation('time.7_days')}</button>
                    <button class="time-filter" data-period="30d">${getTranslation('time.30_days')}</button>
                    <button class="time-filter" data-period="90d">${getTranslation('time.90_days')}</button>
                    <button class="time-filter" data-period="1y">${getTranslation('time.1_year')}</button>
                </div>
            `;
            modalBody.insertAdjacentHTML('beforeend', filtersHTML);
            console.log('⏱️ Time filters created');
        }
    }
    
    // Destroy any existing charts
    if (window.economicChart) {
        console.log('🔨 Destroying economic chart');
        window.economicChart.destroy();
        window.economicChart = null;
    }
    if (window.historicalChart) {
        console.log('🔨 Destroying historical chart');
        window.historicalChart.destroy();
        window.historicalChart = null;
    }
    if (historicalChart) {
        console.log('🔨 Destroying local historical chart');
        historicalChart.destroy();
        historicalChart = null;
    }
    
    // Clear any chart references
    currentChartData = null;
    
    // Reset modal title and subtitle
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    if (chartTitle) chartTitle.textContent = 'Evolución Histórica';
    if (chartSubtitle) chartSubtitle.textContent = 'Datos actualizados';
    
    // Reset time filters
    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(filter => {
        filter.classList.remove('active');
        filter.onclick = null; // Remove old event handlers
    });
    
    // Activate first filter by default
    if (timeFilters.length > 0) {
        timeFilters[0].classList.add('active');
    }
    
    console.log('✅ Modal content cleared');
}

function setupModalCloseHandlers(modal, modalBody) {
    console.log('🔧 Setting up modal close handlers');
    
    // Remove existing event listeners first
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        // Remove existing onclick handler
        closeBtn.onclick = null;
        
        // Add new handler
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Closing modal via close button');
            modal.classList.add('hidden');
            clearModalContent();
        };
    }
    
    // Remove existing modal click handler
    modal.onclick = null;
    
    // Add new backdrop click handler
    modal.onclick = (e) => {
        if (e.target === modal) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Closing modal via backdrop click');
            modal.classList.add('hidden');
            clearModalContent();
        }
    };
    
    // Add ESC key handler
    const handleEscKey = (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            console.log('❌ Closing modal via ESC key');
            modal.classList.add('hidden');
            clearModalContent();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    console.log('✅ Modal close handlers configured');
}

// =================================================================================
// --- HISTORICAL DATA SYSTEM FOR ECONOMIC INDICATORS
// =================================================================================

async function showHistoricalData(indicatorType) {
    try {
        console.log(`📊 Loading historical data for ${indicatorType}...`);
        
        let data = null;
        let title = '';
        let subtitle = '';
        
        switch (indicatorType) {
            case 'inflation':
                data = await loadInflationHistoricalData();
                title = getTranslation('modal.evolution_monthly_inflation');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'annual-inflation':
                data = await loadAnnualInflationHistoricalData();
                title = getTranslation('modal.evolution_annual_inflation');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'uva':
                data = await loadUVAHistoricalData();
                title = getTranslation('modal.evolution_uva');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'risk':
                data = await loadRiskHistoricalData();
                title = getTranslation('modal.evolution_risk');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'fixed-term':
                data = await loadFixedTermHistoricalData();
                // Fixed term doesn't have historical data, it shows current data in modal
                if (data === null) {
                    return; // Exit early, modal already shown by loadFixedTermHistoricalData
                }
                title = getTranslation('modal.evolution_fixed_term');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'fci':
                data = await loadFCIHistoricalData();
                // FCI doesn't have historical data, it shows current data in modal
                if (data === null) {
                    return; // Exit early, modal already shown by loadFCIHistoricalData
                }
                title = getTranslation('modal.evolution_fci');
                subtitle = getTranslation('modal.data_source');
                break;
            case 'holidays':
                data = await loadHolidaysData();
                if (data && data.holidays) {
                    showHolidaysModal(data);
                    return; // Exit early, modal already shown
                }
                title = 'Feriados Nacionales';
                subtitle = 'Calendario oficial 2025';
                break;
            default:
                console.error(`❌ Unknown indicator type: ${indicatorType}`);
                return;
        }
        
        if (data && data.length > 0) {
            showHistoricalChartModal(data, title, subtitle, indicatorType);
        } else {
            showErrorMessage('No se encontraron datos históricos para este indicador');
        }
        
    } catch (error) {
        console.error(`❌ Error loading historical data for ${indicatorType}:`, error);
        showErrorMessage('Error al cargar datos históricos');
    }
}

// Historical data loading functions
async function loadInflationHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.slice(-30); // Last 30 data points
    } catch (error) {
        console.error('❌ Error loading inflation historical data:', error);
        return null;
    }
}

async function loadAnnualInflationHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.slice(-30); // Last 30 data points
    } catch (error) {
        console.error('❌ Error loading annual inflation historical data:', error);
        return null;
    }
}

async function loadUVAHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/uva', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.slice(-30); // Last 30 data points
    } catch (error) {
        console.error('❌ Error loading UVA historical data:', error);
        return null;
    }
}

async function loadRiskHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.slice(-30); // Last 30 data points
    } catch (error) {
        console.error('❌ Error loading risk historical data:', error);
        return null;
    }
}

async function loadFixedTermHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Mostrar datos actuales organizados por banco
            showFixedTermModal(data);
            return null; // No retornar datos para evitar crear gráfico
        } else {
            throw new Error('No se encontraron datos de plazos fijos');
        }
    } catch (error) {
        console.error('❌ Error loading fixed term data:', error);
        alert('Error al cargar datos de plazos fijos');
        return null;
    }
}

async function loadFCIHistoricalData() {
    try {
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo', {
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Mostrar datos actuales organizados por entidad
            showFCIModal(data);
            return null; // No retornar datos para evitar crear gráfico
        } else {
            throw new Error('No se encontraron datos de FCI');
        }
    } catch (error) {
        console.error('❌ Error loading FCI data:', error);
        alert('Error al cargar datos de FCI');
        return null;
    }
}

function showFixedTermModal(data) {
    console.log('🏦 Opening fixed term modal with data:', data.length, 'banks');
    
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !chartTitle || !chartSubtitle || !modalBody) {
        console.error('❌ Modal elements not found for fixed term modal');
        return;
    }
    
    // Clear any existing content and reset modal state
    clearModalContent();
    
    // Set translated titles
    chartTitle.textContent = getTranslation('modal.fixed_term_title') || 'Tasas de Plazo Fijo por Banco';
    chartSubtitle.textContent = getTranslation('modal.fixed_term_subtitle') || 'Tasas Nominales Anuales (TNA) - Clientes';
    
    // Filtrar solo bancos con tasas válidas
    const validBanks = data.filter(item => item.tnaClientes !== null && item.tnaClientes > 0);
    
    console.log(`💰 Showing ${validBanks.length} banks with valid rates`);
    
    // Crear contenido HTML para mostrar los datos
    const contentHTML = `
        <div class="fixed-term-content">
            <div class="banks-grid">
                ${validBanks.map(bank => `
                    <div class="bank-card">
                        <div class="bank-header">
                            <img src="${bank.logo || ''}" alt="${bank.entidad}" class="bank-logo" onerror="this.style.display='none'">
                            <h4 class="bank-name">${bank.entidad}</h4>
                        </div>
                        <div class="bank-rate">
                            <span class="rate-value">${(bank.tnaClientes * 100).toFixed(2)}%</span>
                            <span class="rate-label">${getTranslation('modal.tna_label') || 'TNA'}</span>
                        </div>
                        ${bank.enlace ? `<a href="${bank.enlace}" target="_blank" class="bank-link">${getTranslation('modal.see_more') || 'Ver más'}</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Reemplazar el contenido del modal
    modalBody.innerHTML = contentHTML;
    
    // Setup close functionality
    setupModalCloseHandlers(modal, modalBody);
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    console.log('✅ Fixed term modal opened successfully');
}

function showFCIModal(data) {
    console.log('📊 Opening FCI modal with data:', data.length, 'funds');
    console.log('FCI Data:', data); // Debug log
    
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !chartTitle || !chartSubtitle || !modalBody) {
        console.error('❌ Modal elements not found for FCI modal');
        return;
    }
    
    // Clear any existing content and reset modal state
    clearModalContent();
    
    // Set translated titles
    chartTitle.textContent = getTranslation('modal.fci_title') || 'Fondos Comunes de Inversión';
    chartSubtitle.textContent = getTranslation('modal.fci_subtitle') || 'Patrimonio por Categoría - Mercado de Dinero';
    
    // Crear contenido HTML para mostrar los datos
    const contentHTML = `
        <div class="fci-content">
            <div class="fci-grid">
                ${data.map(fci => {
                    console.log('Processing FCI item:', fci); // Debug log
                    return `
                        <div class="fci-card">
                            <div class="fci-header">
                                <h4 class="fci-name">${fci.fondo || getTranslation('modal.category_not_available') || 'Categoría no disponible'}</h4>
                            </div>
                            <div class="fci-data">
                                <div class="fci-rate">
                                    <span class="rate-value">${fci.patrimonio ? `$${(fci.patrimonio / 1000000).toFixed(1)}M` : 'N/A'}</span>
                                    <span class="rate-label">${getTranslation('modal.patrimony') || 'Patrimonio'}</span>
                                </div>
                                <div class="fci-details">
                                    <span class="detail-item">VCP: ${fci.vcp ? fci.vcp.toLocaleString() : 'N/A'}</span>
                                    <span class="detail-item">CCP: ${fci.ccp ? fci.ccp.toLocaleString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    // Reemplazar el contenido del modal
    modalBody.innerHTML = contentHTML;
    
    // Setup close functionality
    setupModalCloseHandlers(modal, modalBody);
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    console.log('✅ FCI modal opened successfully');
}

function showHistoricalChartModal(data, title, subtitle, indicatorType) {
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    
    if (modal && chartTitle && chartSubtitle) {
        chartTitle.textContent = title;
        chartSubtitle.textContent = subtitle;
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Store data globally for filtering
        window.currentHistoricalData = data;
        window.currentIndicatorType = indicatorType;
        
        // Create chart with the data
        createEconomicIndicatorChart(data, indicatorType);
        
        // Setup time filter functionality
        setupTimeFilters(data, indicatorType);
        
        // Setup close functionality
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.add('hidden');
            };
        }
        
        // Close on backdrop click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        };
    }
}

function setupTimeFilters(data, indicatorType) {
    const timeFilters = document.querySelectorAll('.time-filter');
    const dateRangeSpan = document.getElementById('chart-date-range');
    
    timeFilters.forEach(filter => {
        filter.onclick = () => {
            // Remove active class from all filters
            timeFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            filter.classList.add('active');
            
            const period = filter.getAttribute('data-period');
            const filteredData = filterDataByPeriod(data, period);
            
            // Update chart with filtered data
            createEconomicIndicatorChart(filteredData, indicatorType);
            
            // Update date range display
            if (dateRangeSpan) {
                dateRangeSpan.textContent = getPeriodDisplayText(period);
            }
        };
    });
}

function filterDataByPeriod(data, period) {
    if (!data || data.length === 0) return data;
    
    const now = new Date();
    let cutoffDate;
    
    switch (period) {
        case '7d':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '1y':
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            return data;
    }
    
    return data.filter(item => {
        const itemDate = new Date(item.fecha);
        return itemDate >= cutoffDate;
    });
}

function getPeriodDisplayText(period) {
    const texts = {
        '7d': getTranslation('time_range.last_7_days'),
        '30d': getTranslation('time_range.last_30_days'),
        '90d': getTranslation('time_range.last_90_days'),
        '1y': getTranslation('time_range.last_1_year')
    };
    return texts[period] || getTranslation('time_range.all_data') || 'All data';
}

function createEconomicIndicatorChart(data, indicatorType) {
    console.log(`📊 Creating economic indicator chart for ${indicatorType} with ${data.length} data points`);
    
    const ctx = document.getElementById('historical-chart');
    if (!ctx) {
        console.error('❌ Chart canvas not found for economic indicator');
        return;
    }
    
    // Destroy existing charts
    if (window.economicChart) {
        console.log('🔨 Destroying existing economic chart');
        window.economicChart.destroy();
        window.economicChart = null;
    }
    if (historicalChart) {
        console.log('🔨 Destroying existing historical chart');
        historicalChart.destroy();
        historicalChart = null;
    }
    
    // Prepare chart data
    const labels = data.map(item => {
        const date = new Date(item.fecha);
        return date.toLocaleDateString('es-AR', { 
            month: 'short', 
            day: 'numeric' 
        });
    });
    
    const values = data.map(item => item.valor);
    
    // Determine theme colors
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#ffffff' : '#000000';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const backgroundColor = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    
    // Chart configuration
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: getIndicatorLabel(indicatorType),
                data: values,
                borderColor: getIndicatorColor(indicatorType),
                backgroundColor: getIndicatorColor(indicatorType, isDark ? 0.6 : 0.3),
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: getIndicatorColor(indicatorType),
                pointBorderColor: textColor,
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: backgroundColor,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: backgroundColor,
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: getIndicatorColor(indicatorType),
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const suffix = indicatorType.includes('inflation') || indicatorType === 'risk' ? '%' : '';
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('es-AR')}${suffix}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        borderColor: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            const suffix = indicatorType.includes('inflation') || indicatorType === 'risk' ? '%' : '';
                            return value.toLocaleString('es-AR') + suffix;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };
    
    window.economicChart = new Chart(ctx, config);
    
    console.log('✅ Economic indicator chart created successfully');
}

function getIndicatorLabel(indicatorType) {
    const labels = {
        'inflation': 'Inflación Mensual (%)',
        'annual-inflation': 'Inflación Interanual (%)',
        'uva': 'Índice UVA',
        'risk': 'Riesgo País',
        'fixed-term': 'Tasa Promedio (%)',
        'fci': 'Rendimiento Promedio'
    };
    return labels[indicatorType] || 'Valor';
}

function getIndicatorColor(indicatorType, alpha = 1) {
    const colors = {
        'inflation': `rgba(59, 130, 246, ${alpha})`,
        'annual-inflation': `rgba(16, 185, 129, ${alpha})`,
        'uva': `rgba(245, 158, 11, ${alpha})`,
        'risk': `rgba(239, 68, 68, ${alpha})`,
        'fixed-term': `rgba(139, 92, 246, ${alpha})`,
        'fci': `rgba(236, 72, 153, ${alpha})`
    };
    return colors[indicatorType] || `rgba(59, 130, 246, ${alpha})`;
}

// Make functions available globally
window.refreshInflation = refreshInflation;
window.refreshAnnualInflation = refreshAnnualInflation;
window.refreshRisk = refreshRisk;
window.refreshFixedTerm = refreshFixedTerm;
window.refreshFCI = refreshFCI;
window.refreshUVA = refreshUVA;
window.refreshHolidays = refreshHolidays;
window.showHistoricalData = showHistoricalData;

// =================================================================================
// --- WIDGET CLICK HANDLERS
// =================================================================================

// Function to handle widget clicks and prevent event bubbling
function handleWidgetClick(event, indicatorType) {
    console.log(`🖱️ Widget clicked: ${indicatorType}`);
    
    // Don't trigger if clicking on refresh button or its children
    if (event.target.closest('.refresh-btn')) {
        console.log('🔄 Refresh button clicked, preventing widget modal');
        event.stopPropagation();
        return;
    }
    
    // Prevent default behavior and bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Show historical data
    console.log(`📊 Opening historical data for ${indicatorType}`);
    showHistoricalData(indicatorType);
}

// Make function available globally
window.handleWidgetClick = handleWidgetClick;

function showHolidaysModal(data) {
    console.log('📅 Opening holidays modal with data:', data.total, 'holidays for', data.year);
    
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    const modalBody = document.querySelector('.modal-body');
    
    if (!modal || !chartTitle || !chartSubtitle || !modalBody) {
        console.error('❌ Modal elements not found for holidays modal');
        return;
    }
    
    // Clear any existing content and reset modal state
    clearModalContent();
    
    // Set translated titles
    chartTitle.textContent = getTranslation('modal.holidays_title') || `Feriados Nacionales ${data.year}`;
    chartSubtitle.textContent = getTranslation('modal.holidays_subtitle') || 'Calendario oficial completo';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Ordenar feriados por fecha
    const sortedHolidays = data.holidays.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    const holidaysList = sortedHolidays
        .map(holiday => {
            // Parse date correctly to avoid timezone issues
            const date = parseHolidayDate(holiday.fecha);
            const isPast = date < today;
            const currentLang = getCurrentLanguage();
            const locale = currentLang === 'en' ? 'en-US' : 'es-AR';
            const formattedDate = date.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Determine icon and status text based on whether holiday is past or future
            const statusIcon = isPast ? '✅' : '📅';
            const statusText = isPast ? 
                (getTranslation('modal.holiday_past') || 'Pasado') : 
                (getTranslation('modal.holiday_upcoming') || 'Próximo');
            
            return `<div class="holiday-item ${isPast ? 'holiday-past' : 'holiday-upcoming'}">
                <div class="holiday-status">
                    <span class="holiday-icon">${statusIcon}</span>
                    <span class="holiday-status-text">${statusText}</span>
                </div>
                <div class="holiday-date">${formattedDate}</div>
                <div class="holiday-name">${holiday.nombre}</div>
            </div>`;
        })
        .join('');
    
    const contentHTML = `
        <div class="holidays-modal-content">
            <div class="holidays-summary">
                <div class="holidays-count">${data.total} ${getTranslation('modal.holidays_in') || 'feriados en'} ${data.year}</div>
            </div>
            <div class="holidays-list">
                ${holidaysList}
            </div>
        </div>
    `;
    
    // Reemplazar el contenido del modal
    modalBody.innerHTML = contentHTML;
    
    // Setup close functionality
    setupModalCloseHandlers(modal, modalBody);
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    console.log('✅ Holidays modal opened successfully');
}

// Make function available globally
window.showHolidaysModal = showHolidaysModal; 
window.showHolidaysModal = showHolidaysModal; 