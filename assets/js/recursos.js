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

// Economic indicators data cache for language switching
let widgetDataCache = {
    inflation: null,
    annualInflation: null,
    uva: null,
    risk: null,
    fixedTerm: null,
    fci: null
};

// =================================================================================
// --- INITIALIZATION
// =================================================================================

// SOLUCIÓN DEFINITIVA: Forzar idioma español INMEDIATAMENTE
localStorage.setItem('language', 'es');
document.documentElement.lang = 'es';

// Refuerzo: función para actualizar visualmente los botones de idioma
function updateLanguageButtons(lang) {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    if (langEs && langEn) {
        langEs.classList.remove('active');
        langEn.classList.remove('active');
        if (lang === 'es') {
            langEs.classList.add('active');
        } else {
            langEn.classList.add('active');
        }
    }
}

// Forzar botones de idioma apenas el DOM esté disponible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateLanguageButtons('es');
    });
} else {
    // Si el DOM ya está listo, ejecutar inmediatamente
    updateLanguageButtons('es');
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Recursos Útiles page...');
    try {
        // 1. El idioma ya está forzado a español arriba
        const lang = 'es';
        // 2. Inicializa módulos que NO dependen del idioma primero
        await loadResourcesConfig();
        initializeThemes();
        initializeMobileMenu();
        initializeTaxCalculator();
        await initializeCurrencyWidget();
        // 3. CLAVE: Cargar datos de widgets ANTES de setear idioma
        await initializeEconomicIndicators();
        // 4. AHORA sí, setear idioma (con datos en cache)
        await setLanguage(lang);
        await initializeLanguage();
        refreshHolidays();
        console.log('✅ Recursos page initialized successfully');
        // 5. Refuerzo final
        setTimeout(() => {
            refreshAllWidgetsLanguage();
            updateLanguageButtons(lang);
        }, 100);
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
    
    // Setup all event listeners and initial calculation
    initializeTaxCalculatorEvents();
}

function calculateTax() {
    // Parámetros fiscales actualizados para 2025 (valores hipotéticos)
    const TAX_PARAMS = {
        gni: 3588000,
        deduccion_especial: 13634400,
        conyuge: 3352000,
        hijo: 1687000,
        hijo_incapacitado: 3374000,
        alquiler_tope: 3588000,
        domestico_tope: 3588000,
        hipotecario_tope: 20000,
        aportes_porcentaje: 0.17,
        medicos_facturado_porcentaje: 0.40,
        ganancia_neta_tope_porcentaje: 0.05,
        educacion_tope: 1566507,
        seguro_vida_tope: 250000,
        sepelio_tope: 150000,
        escala: [
            { limite: 0, fijo: 0, porcentaje: 0.05 },
            { limite: 2990000, fijo: 149500, porcentaje: 0.09 },
            { limite: 5980000, fijo: 418750, porcentaje: 0.12 },
            { limite: 8970000, fijo: 777550, porcentaje: 0.15 },
            { limite: 11960000, fijo: 1226050, porcentaje: 0.19 },
            { limite: 17940000, fijo: 2362250, porcentaje: 0.23 },
            { limite: 23920000, fijo: 3737650, porcentaje: 0.27 },
            { limite: 35880000, fijo: 6966850, porcentaje: 0.31 },
            { limite: 47840000, fijo: 10674450, porcentaje: 0.35 }
        ]
    };

    // Obtener valores de los inputs
    const salarioBrutoInput = document.getElementById('salario-bruto');
    const incluirSACInput = document.getElementById('incluir-sac');
    const deduccionConyugeInput = document.getElementById('deduccion-conyuge');
    const deduccionHijosInput = document.getElementById('deduccion-hijos');
    const deduccionHijosIncapInput = document.getElementById('deduccion-hijos-incap');
    const deduccionAlquilerInput = document.getElementById('deduccion-alquiler');
    const deduccionDomesticoInput = document.getElementById('deduccion-domestico');
    const deduccionHipotecarioInput = document.getElementById('deduccion-hipotecario');
    const deduccionMedicosInput = document.getElementById('deduccion-medicos');
    const deduccionEducacionInput = document.getElementById('deduccion-educacion');
    const deduccionDonacionesInput = document.getElementById('deduccion-donaciones');
    const deduccionSeguroVidaInput = document.getElementById('deduccion-seguro-vida');
    const deduccionSepelioInput = document.getElementById('deduccion-sepelio');
    
    if (!salarioBrutoInput) {
        console.error('Tax calculator inputs not found');
        return;
    }

    const salarioBrutoMensual = parseFloat(salarioBrutoInput.value) || 0;
    const incluirSAC = incluirSACInput?.checked || false;
    
    if (salarioBrutoMensual <= 0) {
        updateTaxResults(0, salarioBrutoMensual, 0, 0);
        return;
    }

    // 1. Ganancia Bruta Anual
    const meses = incluirSAC ? 13 : 12;
    const sueldoAnualBruto = incluirSAC ? salarioBrutoMensual * 13 : salarioBrutoMensual * 12;

    // 2. Aportes obligatorios (17%)
    const aportesAnuales = sueldoAnualBruto * TAX_PARAMS.aportes_porcentaje;

    // 3. Deducciones personales
    let deduccionesPersonales = TAX_PARAMS.gni + TAX_PARAMS.deduccion_especial;
    
    if (deduccionConyugeInput?.checked) {
        deduccionesPersonales += TAX_PARAMS.conyuge;
    }
    
    deduccionesPersonales += (parseInt(deduccionHijosInput?.value) || 0) * TAX_PARAMS.hijo;
    deduccionesPersonales += (parseInt(deduccionHijosIncapInput?.value) || 0) * TAX_PARAMS.hijo_incapacitado;

    // 4. Ganancia neta antes de otras deducciones
    const gananciaNetaAntesOtrasDeducciones = sueldoAnualBruto - aportesAnuales;
    const topeGananciaNeta = gananciaNetaAntesOtrasDeducciones * TAX_PARAMS.ganancia_neta_tope_porcentaje;

    // 5. Otras deducciones con topes
    let otrasDeducciones = 0;
    otrasDeducciones += Math.min(parseFloat(deduccionAlquilerInput?.value) || 0, TAX_PARAMS.alquiler_tope);
    otrasDeducciones += Math.min(parseFloat(deduccionDomesticoInput?.value) || 0, TAX_PARAMS.domestico_tope);
    otrasDeducciones += Math.min(parseFloat(deduccionHipotecarioInput?.value) || 0, TAX_PARAMS.hipotecario_tope);
    
    // Gastos médicos: 40% de lo facturado, con tope del 5% de ganancia neta
    const gastosMedicosFacturados = parseFloat(deduccionMedicosInput?.value) || 0;
    const deduccionMedicosCalculada = gastosMedicosFacturados * TAX_PARAMS.medicos_facturado_porcentaje;
    otrasDeducciones += Math.min(deduccionMedicosCalculada, topeGananciaNeta);

    otrasDeducciones += Math.min(parseFloat(deduccionEducacionInput?.value) || 0, TAX_PARAMS.educacion_tope);
    otrasDeducciones += Math.min(parseFloat(deduccionDonacionesInput?.value) || 0, topeGananciaNeta);
    otrasDeducciones += Math.min(parseFloat(deduccionSeguroVidaInput?.value) || 0, TAX_PARAMS.seguro_vida_tope);
    otrasDeducciones += Math.min(parseFloat(deduccionSepelioInput?.value) || 0, TAX_PARAMS.sepelio_tope);
    
    // 6. Total deducciones
    const totalDeducciones = aportesAnuales + deduccionesPersonales + otrasDeducciones;
    
    // 7. Ganancia Neta Imponible
    const gananciaNetaImponible = Math.max(0, sueldoAnualBruto - totalDeducciones);

    // 8. Aplicar escala progresiva
    let impuestoAnual = 0;
    for (let i = TAX_PARAMS.escala.length - 1; i >= 0; i--) {
        const tramo = TAX_PARAMS.escala[i];
        if (gananciaNetaImponible > tramo.limite) {
            const excedente = gananciaNetaImponible - tramo.limite;
            impuestoAnual = tramo.fijo + (excedente * tramo.porcentaje);
            break;
        }
    }

    // 9. Retención mensual
    const retencionMensual = impuestoAnual / meses;
    
    // 10. Sueldo neto y de bolsillo
    const aportesMensuales = salarioBrutoMensual * TAX_PARAMS.aportes_porcentaje;
    const sueldoNeto = salarioBrutoMensual - aportesMensuales;
    const sueldoDeBolsillo = sueldoNeto - retencionMensual;

    updateTaxResults(retencionMensual, sueldoDeBolsillo, impuestoAnual, gananciaNetaImponible);
}

function updateTaxResults(retencionMensual, sueldoDeBolsillo, impuestoAnual, gananciaNetaImponible) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', { 
            style: 'currency', 
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Actualizar elementos de resultado
    const retencionEl = document.getElementById('resultado-retencion-mensual');
    const bolsilloEl = document.getElementById('resultado-sueldo-bolsillo');
    const anualEl = document.getElementById('resultado-impuesto-anual');
    const imponibleEl = document.getElementById('resultado-ganancia-imponible');

    if (retencionEl) retencionEl.textContent = formatCurrency(retencionMensual);
    if (bolsilloEl) bolsilloEl.textContent = formatCurrency(sueldoDeBolsillo);
    if (anualEl) anualEl.textContent = formatCurrency(impuestoAnual);
    if (imponibleEl) imponibleEl.textContent = formatCurrency(gananciaNetaImponible);
}

// Función para sincronizar salario con slider
function initializeTaxCalculatorEvents() {
    const salarioBrutoInput = document.getElementById('salario-bruto');
    const salarioSlider = document.getElementById('salario-slider');

    if (salarioBrutoInput && salarioSlider) {
        // Sincronizar input con slider
        salarioBrutoInput.addEventListener('input', () => {
            salarioSlider.value = salarioBrutoInput.value;
            calculateTax();
        });
        
        salarioSlider.addEventListener('input', () => {
            salarioBrutoInput.value = salarioSlider.value;
            calculateTax();
        });

        // Agregar eventos a todos los inputs
        const allTaxInputs = [
            'incluir-sac', 'deduccion-conyuge', 'deduccion-hijos', 'deduccion-hijos-incap',
            'deduccion-alquiler', 'deduccion-domestico', 'deduccion-hipotecario', 
            'deduccion-medicos', 'deduccion-educacion', 'deduccion-donaciones',
            'deduccion-seguro-vida', 'deduccion-sepelio'
        ];

        allTaxInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', calculateTax);
                input.addEventListener('keyup', calculateTax);
            }
        });

        // Calcular al cargar
        calculateTax();
    }
}

// =================================================================================
// --- CURRENCY MANAGEMENT WITH DOLARAPI INTEGRATION  
// =================================================================================

// Cache for previous day rates to calculate variations
let previousDayRates = null;

// Function to get previous day rate for comparison
async function getPreviousDayRate(casa, type) {
    try {
        // Try to get yesterday's data (2 days to ensure we get data)
        const historicalData = await loadHistoricalData(casa, 2);
        if (historicalData && historicalData.length >= 2) {
            // Get the second-to-last entry (previous day)
            const previousDay = historicalData[historicalData.length - 2];
            return type === 'sell' ? previousDay.venta : previousDay.compra;
        }
        return null;
    } catch (error) {
        console.log(`Could not load previous day data for ${casa}:`, error);
        return null;
    }
}

// Function to get variation emoji based on percentage
function getVariationEmoji(percentage) {
    if (percentage > 5) {
        return ' 🔥'; // Fire for > 5%
    } else if (percentage < -5) {
        return ' 📉'; // Falling chart for < -5%
    }
    return '';
}

// Function to get variation emoji for percentage points (economic indicators)
function getPercentagePointEmoji(percentagePoints) {
    if (percentagePoints > 1) {
        return ' 🔥'; // Fire for > +1pp
    } else if (percentagePoints < -1) {
        return ' 📉'; // Falling chart for < -1pp
    }
    return '';
}

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
    
    // EUR and BRL Rates - Group them in desktop for better space utilization
    if (currencyRates.EUR || currencyRates.BRL) {
        const eurBrlContainer = document.createElement('div');
        eurBrlContainer.className = 'eur-brl-container';
        
        if (currencyRates.EUR) {
            eurBrlContainer.appendChild(createCurrencyRateItem('EUR', 'Euro', '€', currencyRates.EUR));
        }
        
        if (currencyRates.BRL) {
            eurBrlContainer.appendChild(createCurrencyRateItem('BRL', 'Real Brasileño', 'R$', currencyRates.BRL));
        }
        
        container.appendChild(eurBrlContainer);
    }
    
    // Add last update info
    const updateInfo = document.createElement('div');
    updateInfo.className = 'text-sm text-gray-400 mt-4 text-center';
    updateInfo.textContent = `${getTranslation('currency.last_update')}: ${currencyRates.lastUpdate}`;
    container.appendChild(updateInfo);
}

function createCurrencyRateItem(code, name, symbol, rates, forceType = null) {
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
    let sortedRates = Object.entries(rates).sort(([a], [b]) => {
        const orderA = preferredOrder.indexOf(a);
        const orderB = preferredOrder.indexOf(b);
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
    });
    if (forceType) {
        sortedRates = sortedRates.filter(([type]) => type === forceType);
    }
    sortedRates.forEach(([type, values]) => {
        if (values && typeof values === 'object' && (values.buy || values.sell)) {
            const rateType = document.createElement('div');
            rateType.className = 'rate-type';
            // Calculate spread percentage for USD types
            const spread = values.buy && values.sell ? 
                (((values.sell - values.buy) / values.buy) * 100).toFixed(1) : null;
            // Variación porcentual SIEMPRE visible
            const variationSpan = document.createElement('span');
            variationSpan.className = 'rate-variation';
            variationSpan.textContent = '...'; // loading
            // Header con nombre y variación
            rateType.innerHTML = `
                <div class="rate-label">
                    <span class="rate-type-name">${typeNames[type] || type.toUpperCase()}</span>
                </div>
                <div class="rate-values">
                    ${values.buy ? `<div class="rate-buy">${getTranslation('currency.buy')}: $${values.buy.toFixed(2)}</div>` : ''}
                    ${values.sell ? `<div class="rate-sell">${getTranslation('currency.sell')}: $${values.sell.toFixed(2)}</div>` : ''}
                    ${spread ? `<div class="rate-spread text-xs">${getTranslation('currency.spread')}: ${spread}%</div>` : ''}
                </div>
            `;
            // Insertar el span de variación al lado del nombre
            const labelDiv = rateType.querySelector('.rate-label');
            labelDiv.appendChild(variationSpan);
            // Cargar variación asíncrona
            (async () => {
                let historicalData = null;
                if (code === 'USD') {
                    const apiTypeMap = {
                        'oficial': 'oficial',
                        'blue': 'blue', 
                        'mep': 'bolsa',
                        'ccl': 'contadoconliqui',
                        'mayorista': 'mayorista',
                        'tarjeta': 'tarjeta',
                        'cripto': 'cripto'
                    };
                    const apiType = apiTypeMap[type];
                    if (apiType) {
                        historicalData = await loadHistoricalData(apiType, 7); // Pedimos más días para asegurar datos
                    }
                } else if (code === 'EUR' || code === 'BRL') {
                    historicalData = await loadHistoricalData(code, 7);
                }
                let display = '';
                if (historicalData && historicalData.length >= 2 && values.sell) {
                    // Ordenar por fecha descendente
                    const sorted = historicalData.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    const mostRecent = sorted[0];
                    // Buscar el primer registro con fecha distinta a la más reciente
                    const prev = sorted.find(item => item.fecha !== mostRecent.fecha);
                    const previousSell = prev ? (prev.venta || prev.sell) : null;
                    // DEBUG: Mostrar valores en consola
                    console.log(`[VARIACION] ${code} ${type} - Actual: ${values.sell} | Anterior: ${previousSell} | Fecha actual: ${mostRecent?.fecha} | Fecha anterior: ${prev?.fecha}`);
                    if (previousSell && previousSell > 0) {
                        const variationPerc = (((values.sell - previousSell) / previousSell) * 100);
                        const formattedPerc = variationPerc.toFixed(1);
                        let emoji = '';
                        if (variationPerc > 5) emoji = '🔥';
                        else if (variationPerc < -5) emoji = '📉';
                        display = `<span class="text-xs ${variationPerc > 0 ? 'text-red-500' : variationPerc < 0 ? 'text-green-500' : 'text-gray-500'}">${variationPerc > 0 ? '+' : ''}${formattedPerc}%</span>${emoji}`;
                    } else {
                        display = `<span class="text-xs text-gray-500">0.0%</span>`;
                    }
                } else {
                    // DEBUG: Mostrar si no hay suficientes datos
                    console.warn(`[VARIACION] No hay suficientes datos históricos para ${code} ${type}.`);
                    display = `<span class="text-xs text-gray-500">0.0%</span>`;
                }
                variationSpan.innerHTML = display;
            })();
            // Clickable para histórico
            const clickableTypes = {
                'USD': ['oficial', 'blue', 'mep', 'ccl', 'mayorista', 'tarjeta', 'cripto'],
                'EUR': ['oficial'],
                'BRL': ['oficial']
            };
            if (clickableTypes[code] && clickableTypes[code].includes(type)) {
                rateType.classList.add('clickable');
                rateType.onclick = null;
                rateType.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rateDisplayName = typeNames[type] || type.toUpperCase();
                    const currencyName = code === 'USD' ? 'Dólar' : code === 'EUR' ? 'Euro' : 'Real';
                    // Para el histórico, si es MEP, usar 'bolsa' como parámetro
                    let chartParameter;
                    if (code === 'USD' && type === 'mep') chartParameter = 'bolsa';
                    else if (code === 'USD' && type === 'ccl') chartParameter = 'contadoconliqui';
                    else chartParameter = (code === 'EUR' || code === 'BRL') ? code : type;
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

// Function to refresh all economic widgets with current language
function refreshAllWidgetsLanguage() {
    console.log('🔄 Refreshing all widgets with current language...');
    
    // Only refresh if we have cached data
    if (widgetDataCache.inflation) {
        updateWidgetContent('inflation-widget', widgetDataCache.inflation, 'inflation');
    }
    if (widgetDataCache.annualInflation) {
        updateWidgetContent('annual-inflation-widget', widgetDataCache.annualInflation, 'annual-inflation');
    }
    if (widgetDataCache.uva) {
        updateWidgetContent('uva-widget', widgetDataCache.uva, 'uva');
    }
    if (widgetDataCache.risk) {
        updateWidgetContent('risk-widget', widgetDataCache.risk, 'risk');
    }
    if (widgetDataCache.fixedTerm) {
        updateWidgetContent('fixed-term-widget', widgetDataCache.fixedTerm, 'fixed-term');
    }
    if (widgetDataCache.fci) {
        updateWidgetContent('fci-widget', widgetDataCache.fci, 'fci');
    }
}

// LANGUAGE SYSTEM - Following consulting.js pattern
async function setLanguage(lang) {
    document.documentElement.lang = lang;
    window.currentLanguage = lang; // Set global language reference
    
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
    

    
    // Update button text if it's in "Updated" state
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn && refreshBtn.disabled && (refreshBtn.textContent.includes('Actualizado') || refreshBtn.textContent.includes('Updated'))) {
        refreshBtn.innerHTML = `<i class="fas fa-check mr-2"></i>${getTranslation('recursos_updated')}`;
    }
    
    // Refresh economic indicators widgets with new language
    refreshAllWidgetsLanguage();
    
    // Refresh holidays cards with new language (only if data exists)
    const holidaysData = document.getElementById('holidays-data');
    if (holidaysData && !holidaysData.innerHTML.includes('loading-spinner')) {
        refreshHolidays();
    }
    
    // Refuerzo: actualizar botones de idioma
    updateLanguageButtons(lang);
    console.log(`Language changed to: ${lang}`);
}

// En initializeLanguage, elimino duplicados y uso updateLanguageButtons
async function initializeLanguage() {
    const langEs = document.getElementById('lang-es');
    const langEn = document.getElementById('lang-en');
    let savedLang = localStorage.getItem('language') || 'es';
    await setLanguage(savedLang);
    updateLanguageButtons(savedLang);
    // Language toggle handlers
    if (langEs) {
        langEs.addEventListener('click', async () => {
            await setLanguage('es');
            localStorage.setItem('language', 'es');
            updateLanguageButtons('es');
        });
    }
    if (langEn) {
        langEn.addEventListener('click', async () => {
            await setLanguage('en');
            localStorage.setItem('language', 'en');
            updateLanguageButtons('en');
        });
    }
}

// =================================================================================
// --- EXPORT FOR GLOBAL ACCESS
// =================================================================================

// Make functions available globally for onclick handlers
window.calculateTax = calculateTax;
window.refreshRates = refreshRates;

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
            let filteredData = data
                .filter(item => new Date(item.fecha) >= cutoffDate)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            // --- Corrección: agrupar por fecha y tomar el último registro de cada día ---
            if (casa === 'bolsa' || casa === 'contadoconliqui') {
                const grouped = {};
                const registrosPorDia = {};
                filteredData.forEach(item => {
                    // Agrupar por fecha (ignorando hora)
                    const fecha = item.fecha.split('T')[0];
                    if (!registrosPorDia[fecha]) registrosPorDia[fecha] = [];
                    registrosPorDia[fecha].push(item);
                    // Siempre guardar el de mayor hora (más reciente)
                    if (!grouped[fecha] || new Date(item.fecha) > new Date(grouped[fecha].fecha)) {
                        grouped[fecha] = item;
                    }
                });
                // Logging detallado
                Object.entries(registrosPorDia).forEach(([fecha, arr]) => {
                    const horas = arr.map(i => i.fecha);
                    const elegido = grouped[fecha].fecha;
                    console.log(`[AGRUPA] ${casa} ${fecha}: ${arr.length} registros. Horas: [${horas.join(', ')}]. Seleccionado: ${elegido}`);
                });
                filteredData = Object.values(grouped)
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                    .map(item => {
                        // Validar/corregir: venta >= compra
                        let compra = parseFloat(item.compra);
                        let venta = parseFloat(item.venta);
                        if (venta < compra) venta = compra;
                        return {
                            ...item,
                            compra,
                            venta
                        };
                    });
            } else {
                // Para otros tipos, solo validar/corregir venta >= compra
                filteredData = filteredData.map(item => {
                    let compra = parseFloat(item.compra);
                    let venta = parseFloat(item.venta);
                    if (venta < compra) venta = compra;
                    return {
                        ...item,
                        compra,
                        venta
                    };
                });
            }
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
                    borderColor: isDark ? '#10b981' : '#059669',
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.8)' : 'rgba(5, 150, 105, 0.6)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: isDark ? '#10b981' : '#059669',
                    pointBorderColor: isDark ? '#ffffff' : '#000000',
                    pointBorderWidth: 2
                },
                {
                    label: 'Venta',
                    data: sellData,
                    borderColor: isDark ? '#ef4444' : '#dc2626',
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.6)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: isDark ? '#ef4444' : '#dc2626',
                    pointBorderColor: isDark ? '#ffffff' : '#000000',
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
                <button class="time-filter" data-period="max">${getTranslation('time.max')}</button>
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
                case 'max':
                    days = 3650; // ~10 years to get all available data
                    rangeText = getTranslation('time_range.max_period');
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
                variation: previous ? (latest.valor - previous.valor).toFixed(2) : null,
                isPercentagePoints: true // Flag to indicate this uses percentage points
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
                variation: previous ? (latest.valor - previous.valor).toFixed(2) : null,
                isPercentagePoints: true // Flag to indicate this uses percentage points
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
                const inflationEmoji = data.variation && data.isPercentagePoints ? getPercentagePointEmoji(parseFloat(data.variation)) : '';
                const inflationUnit = data.isPercentagePoints ? 'pp' : '%';
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.current}%</div>
                    <div class="indicator-label">${getTranslation('indicator.monthly_inflation')}</div>
                    ${data.variation ? `<div class="indicator-change ${data.variation > 0 ? 'positive' : 'negative'}">${data.variation > 0 ? '+' : ''}${data.variation}${inflationUnit}${inflationEmoji}</div>` : ''}
                    <div class="indicator-date">${formatDate(data.date)}</div>
                `;
                break;
                
            case 'annual-inflation':
                const annualInflationEmoji = data.variation && data.isPercentagePoints ? getPercentagePointEmoji(parseFloat(data.variation)) : '';
                const annualInflationUnit = data.isPercentagePoints ? 'pp' : '%';
                contentDiv.innerHTML = `
                    <div class="indicator-value">${data.current}%</div>
                    <div class="indicator-label">${getTranslation('indicator.annual_inflation')}</div>
                    ${data.variation ? `<div class="indicator-change ${data.variation > 0 ? 'positive' : 'negative'}">${data.variation > 0 ? '+' : ''}${data.variation}${annualInflationUnit}${annualInflationEmoji}</div>` : ''}
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
    // Check multiple sources for current language
    if (window.currentLanguage) {
        return window.currentLanguage;
    }
    
    // Check localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
        return storedLang;
    }
    
    // Check document lang attribute
    const docLang = document.documentElement.lang;
    if (docLang && docLang !== '') {
        return docLang;
    }
    
    // Default to Spanish
    return 'es';
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
    
    // Cache data for language switching
    widgetDataCache.inflation = inflationData;
    widgetDataCache.annualInflation = annualInflationData;
    widgetDataCache.uva = uvaData;
    widgetDataCache.risk = riskData;
    widgetDataCache.fixedTerm = fixedTermData;
    widgetDataCache.fci = fciData;
    
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
                    
                    // Formatear fecha completa
                    const formattedDate = date.toLocaleDateString(locale, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Formatear día del mes
                    const dayNumber = date.getDate();
                    
                    // Formatear mes
                    const monthName = date.toLocaleDateString(locale, {
                        month: 'short'
                    });
                    
                    // Calcular días hasta el feriado
                    const diffTime = date.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const daysText = diffDays === 0 ? getTranslation('holidays.today') : 
                                   diffDays === 1 ? getTranslation('holidays.tomorrow') : 
                                   getTranslation('holidays.in_days').replace('{days}', diffDays);
                    
                    return `<div class="holiday-card">
                        <div class="holiday-card-header">
                            <div class="holiday-date-number">${dayNumber}</div>
                            <div class="holiday-date-month">${monthName}</div>
                        </div>
                        <div class="holiday-card-body">
                            <div class="holiday-card-name">${holiday.nombre}</div>
                            <div class="holiday-card-date">${formattedDate}</div>
                            <div class="holiday-card-countdown">${daysText}</div>
                        </div>
                    </div>`;
                })
                .join('');
            
            holidaysData.className = 'holidays-cards-container';
            holidaysData.innerHTML = holidaysList;
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
                    <button class="time-filter" data-period="max">${getTranslation('time.max')}</button>
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
        case 'max':
            return data; // Return all data for max period
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
        '1y': getTranslation('time_range.last_1_year'),
        'max': getTranslation('time_range.max_period')
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