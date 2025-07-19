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
            <span data-translate="currency.source">Fuente</span>: ${currencyRates.source || 'DolarApi.com'} | 
            <span data-translate="currency.last_update">Última actualización</span>: ${currencyRates.lastUpdate}
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
                rateType.addEventListener('click', () => {
                    const rateDisplayName = typeNames[type] || type.toUpperCase();
                    const currencyName = code === 'USD' ? 'Dólar' : code === 'EUR' ? 'Euro' : 'Real';
                    
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
    const ctx = document.getElementById('historical-chart');
    if (!ctx) {
        console.error('❌ Chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (historicalChart) {
        historicalChart.destroy();
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
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.6)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Venta',
                    data: sellData,
                    borderColor: '#ef4444',
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.6)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.99)',
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-background'),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
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
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-AR');
                        }
                    }
                }
            }
        }
    };
    
    historicalChart = new Chart(ctx, config);
    currentChartData = { data, casa, period };
}

function showHistoricalChart(casa, rateName) {
    const modal = document.getElementById('historical-chart-modal');
    const chartTitle = document.getElementById('chart-title');
    const chartSubtitle = document.getElementById('chart-subtitle');
    const dateRange = document.getElementById('chart-date-range');
    
    if (!modal || !chartTitle) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    // Update modal title and subtitle based on currency type
    chartTitle.textContent = `${rateName} - Evolución Histórica`;
    
    // Set subtitle based on currency type
    if (casa === 'EUR' || casa === 'BRL') {
        chartSubtitle.textContent = `Datos de Banco Central de Argentina`;
    } else {
        chartSubtitle.textContent = `Datos de ArgentinaDatos API`;
    }
    
    dateRange.textContent = 'Últimos 7 días';
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Load initial data (7 days)
    loadHistoricalData(casa, 7).then(data => {
        createHistoricalChart(data, casa, '7d');
    }).catch(error => {
        console.error('❌ Error loading initial chart data:', error);
        showErrorMessage('Error al cargar los datos históricos');
    });
    
    // Initialize time filter handlers
    initializeTimeFilters(casa);
    
    // Initialize close button
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.add('hidden');
            if (historicalChart) {
                historicalChart.destroy();
                historicalChart = null;
            }
        };
    }
    
    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            if (historicalChart) {
                historicalChart.destroy();
                historicalChart = null;
            }
        }
    });
}

function initializeTimeFilters(casa) {
    const timeFilters = document.querySelectorAll('.time-filter');
    const dateRange = document.getElementById('chart-date-range');
    
    timeFilters.forEach(filter => {
        filter.onclick = async () => {
            // Update active state
            timeFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const period = filter.getAttribute('data-period');
            let days, rangeText;
            
            switch (period) {
                case '7d':
                    days = 7;
                    rangeText = 'Últimos 7 días';
                    break;
                case '30d':
                    days = 30;
                    rangeText = 'Últimos 30 días';
                    break;
                case '90d':
                    days = 90;
                    rangeText = 'Últimos 90 días';
                    break;
                case '1y':
                    days = 365;
                    rangeText = 'Último año';
                    break;
                default:
                    days = 7;
                    rangeText = 'Últimos 7 días';
            }
            
            // Update date range text
            if (dateRange) {
                dateRange.textContent = rangeText;
            }
            
            try {
                const data = await loadHistoricalData(casa, days);
                createHistoricalChart(data, casa, period);
            } catch (error) {
                console.error('❌ Error loading chart data for period:', error);
                showErrorMessage('Error al cargar los datos para este período');
            }
        };
    });
}

// Make chart functions available globally
window.showHistoricalChart = showHistoricalChart; 