/**
 * Token Calculator for GenAI Cost Estimation
 * Compares costs across OpenAI, Anthropic (Claude), Google (Gemini), and xAI (Grok)
 * Prices updated: January 2026
 */

// GenAI Model Pricing (per 1M tokens in USD)
const TOKEN_PRICING = {
    // OpenAI
    'GPT-4o': { provider: 'openai', input: 2.50, output: 10.00 },
    'GPT-4o mini': { provider: 'openai', input: 0.15, output: 0.60 },
    
    // Anthropic Claude
    'Claude Sonnet 4.5': { provider: 'anthropic', input: 3.00, output: 15.00 },
    'Claude Haiku 4.5': { provider: 'anthropic', input: 1.00, output: 5.00 },
    'Claude Opus 4.5': { provider: 'anthropic', input: 5.00, output: 25.00 },
    
    // Google Gemini
    'Gemini 2.5 Pro': { provider: 'google', input: 1.25, output: 10.00 },
    'Gemini 2.5 Flash': { provider: 'google', input: 0.30, output: 2.50 },
    
    // xAI Grok
    'Grok 4': { provider: 'xai', input: 3.00, output: 15.00 },
    'Grok 4.1 Fast': { provider: 'xai', input: 0.20, output: 0.50 }
};

// Characters per token approximation (industry standard)
const CHARS_PER_TOKEN = 4;

/**
 * Estimates token count from text using character-based approximation
 * @param {string} text - Input text to tokenize
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Counts words in text
 * @param {string} text - Input text
 * @returns {number} Word count
 */
function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculates cost for a specific model
 * @param {number} inputTokens - Number of input tokens
 * @param {number} outputTokens - Number of output tokens
 * @param {object} pricing - Model pricing object
 * @returns {object} Cost breakdown
 */
function calculateModelCost(inputTokens, outputTokens, pricing) {
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    return {
        input: inputCost,
        output: outputCost,
        total: inputCost + outputCost
    };
}

/**
 * Formats a number as USD currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    if (amount < 0.0001) return '$0.0000';
    if (amount < 0.01) return `$${amount.toFixed(6)}`;
    if (amount < 1) return `$${amount.toFixed(4)}`;
    return `$${amount.toFixed(2)}`;
}

/**
 * Formats a large number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return num.toLocaleString('es-AR');
}

/**
 * Main calculation function - calculates costs for all models
 */
function calculateTokenCosts() {
    const textInput = document.getElementById('token-text-input');
    const ratioSlider = document.getElementById('token-output-ratio');
    
    if (!textInput) return;
    
    const text = textInput.value;
    const outputRatio = parseFloat(ratioSlider?.value || 1);
    
    // Calculate text statistics
    const charCount = text.length;
    const wordCount = countWords(text);
    const inputTokens = estimateTokens(text);
    const outputTokens = Math.ceil(inputTokens * outputRatio);
    
    // Update statistics display
    updateStatDisplay('token-char-count', formatNumber(charCount));
    updateStatDisplay('token-word-count', formatNumber(wordCount));
    updateStatDisplay('token-token-count', formatNumber(inputTokens));
    
    if (inputTokens === 0) {
        // Hide results, show placeholder
        hideElement('token-results-container');
        hideElement('token-best-option');
        showElement('token-placeholder');
        return;
    }
    
    // Calculate costs for all models
    const results = [];
    for (const [modelName, pricing] of Object.entries(TOKEN_PRICING)) {
        const costs = calculateModelCost(inputTokens, outputTokens, pricing);
        results.push({
            model: modelName,
            provider: pricing.provider,
            inputCost: costs.input,
            outputCost: costs.output,
            totalCost: costs.total
        });
    }
    
    // Sort by total cost (ascending)
    results.sort((a, b) => a.totalCost - b.totalCost);
    
    // Find minimum cost for comparison
    const minCost = results[0].totalCost;
    
    // Update best option display
    const bestModel = results[0];
    updateStatDisplay('token-best-model', bestModel.model);
    updateStatDisplay('token-best-price', `- ${formatCurrency(bestModel.totalCost)} USD`);
    
    // Render results table
    renderResultsTable(results, minCost);
    
    // Show results, hide placeholder
    showElement('token-results-container');
    showElement('token-best-option');
    hideElement('token-placeholder');
}

/**
 * Renders the results table with all model costs
 * @param {Array} results - Sorted array of model results
 * @param {number} minCost - Minimum cost for comparison
 */
function renderResultsTable(results, minCost) {
    const tbody = document.getElementById('token-results-body');
    if (!tbody) return;
    
    tbody.innerHTML = results.map(result => {
        const ratio = minCost > 0 ? result.totalCost / minCost : 1;
        const compareClass = getCompareClass(ratio);
        const compareText = ratio === 1 ? '1x' : `${ratio.toFixed(1)}x`;
        
        return `
            <tr>
                <td>
                    <span class="model-name">${result.model}</span>
                    <span class="provider-badge ${result.provider}">${getProviderLabel(result.provider)}</span>
                </td>
                <td class="cost-cell">${formatCurrency(result.inputCost)}</td>
                <td class="cost-cell">${formatCurrency(result.outputCost)}</td>
                <td class="cost-cell total-cell">${formatCurrency(result.totalCost)}</td>
                <td class="compare-cell ${compareClass}">${compareText}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Gets provider display label
 * @param {string} provider - Provider key
 * @returns {string} Display label
 */
function getProviderLabel(provider) {
    const labels = {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        google: 'Google',
        xai: 'xAI'
    };
    return labels[provider] || provider;
}

/**
 * Gets CSS class for comparison ratio
 * @param {number} ratio - Cost ratio vs minimum
 * @returns {string} CSS class
 */
function getCompareClass(ratio) {
    if (ratio === 1) return 'best';
    if (ratio < 5) return 'normal';
    if (ratio < 20) return 'expensive';
    return 'very-expensive';
}

/**
 * Updates a stat display element
 * @param {string} elementId - Element ID
 * @param {string} value - Value to display
 */
function updateStatDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

/**
 * Shows an element
 * @param {string} elementId - Element ID
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.classList.remove('hidden');
}

/**
 * Hides an element
 * @param {string} elementId - Element ID
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.classList.add('hidden');
}

/**
 * Changes active tab in token info section
 * @param {Event} event - Click event
 * @param {string} tabId - Target tab ID
 */
function changeTokenTab(event, tabId) {
    // Hide all tab panes
    document.querySelectorAll('#token-tab-content .tax-tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('#token-calculator .tax-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show target tab and activate button
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.remove('hidden');
    if (event.target) event.target.classList.add('active');
}

/**
 * Initializes the token calculator
 */
function initializeTokenCalculator() {
    // Output ratio slider
    const ratioSlider = document.getElementById('token-output-ratio');
    const ratioDisplay = document.getElementById('token-ratio-display');
    
    if (ratioSlider && ratioDisplay) {
        ratioSlider.addEventListener('input', () => {
            ratioDisplay.textContent = `${ratioSlider.value}x`;
        });
    }
    
    // File upload handling
    const fileInput = document.getElementById('token-file-input');
    const dropzone = document.getElementById('token-dropzone');
    const fileNameDisplay = document.getElementById('token-file-name');
    const textInput = document.getElementById('token-text-input');
    
    if (dropzone && fileInput) {
        // Click to select file
        dropzone.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFileUpload(fileInput.files[0]);
            }
        });
    }
    
    // Real-time calculation on text input
    if (textInput) {
        textInput.addEventListener('input', debounce(() => {
            // Update stats in real-time
            const charCount = textInput.value.length;
            const wordCount = countWords(textInput.value);
            const tokenCount = estimateTokens(textInput.value);
            
            updateStatDisplay('token-char-count', formatNumber(charCount));
            updateStatDisplay('token-word-count', formatNumber(wordCount));
            updateStatDisplay('token-token-count', formatNumber(tokenCount));
        }, 200));
    }
}

/**
 * Handles file upload and text extraction
 * @param {File} file - Uploaded file
 */
async function handleFileUpload(file) {
    const textInput = document.getElementById('token-text-input');
    const fileNameDisplay = document.getElementById('token-file-name');
    
    if (!file || !textInput) return;
    
    const extension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['txt', 'csv', 'doc', 'docx', 'pdf'];
    
    if (!allowedExtensions.includes(extension)) {
        alert('Formato de archivo no soportado. Use: .txt, .csv, .doc, .docx, .pdf');
        return;
    }
    
    try {
        let text = '';
        
        if (extension === 'txt' || extension === 'csv') {
            text = await readTextFile(file);
        } else if (extension === 'pdf') {
            text = await readPDFFile(file);
        } else if (extension === 'doc' || extension === 'docx') {
            text = await readDocFile(file);
        }
        
        textInput.value = text;
        
        if (fileNameDisplay) {
            fileNameDisplay.textContent = `Archivo cargado: ${file.name}`;
            fileNameDisplay.classList.remove('hidden');
        }
        
        // Update stats
        const charCount = text.length;
        const wordCount = countWords(text);
        const tokenCount = estimateTokens(text);
        
        updateStatDisplay('token-char-count', formatNumber(charCount));
        updateStatDisplay('token-word-count', formatNumber(wordCount));
        updateStatDisplay('token-token-count', formatNumber(tokenCount));
        
    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error al leer el archivo. Por favor, intente con otro formato.');
    }
}

/**
 * Reads a text file
 * @param {File} file - Text file
 * @returns {Promise<string>} File contents
 */
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * Reads a PDF file using PDF.js
 * @param {File} file - PDF file
 * @returns {Promise<string>} Extracted text
 */
async function readPDFFile(file) {
    // Check if PDF.js is available
    if (typeof pdfjsLib === 'undefined') {
        // Fallback: read as text (won't work well but provides feedback)
        console.warn('PDF.js not loaded, attempting basic read');
        return readTextFile(file);
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + '\n';
    }
    
    return text.trim();
}

/**
 * Reads a DOC/DOCX file (basic implementation)
 * @param {File} file - Word document
 * @returns {Promise<string>} Extracted text
 */
async function readDocFile(file) {
    // For DOCX, we can attempt to extract text from the XML
    // This is a simplified approach - for production, consider using mammoth.js
    
    if (file.name.endsWith('.docx')) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            const docXml = await zip.file('word/document.xml').async('text');
            
            // Extract text from XML (basic extraction)
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(docXml, 'text/xml');
            const textNodes = xmlDoc.getElementsByTagName('w:t');
            
            let text = '';
            for (let node of textNodes) {
                text += node.textContent + ' ';
            }
            
            return text.trim();
        } catch (error) {
            console.error('Error parsing DOCX:', error);
            // Fallback to basic read
            return 'Error: No se pudo leer el archivo DOCX. Por favor, copie y pegue el contenido manualmente.';
        }
    }
    
    // For .doc files (older format), we can't easily parse them in browser
    return 'Nota: Los archivos .doc antiguos no son compatibles. Por favor, guarde como .docx o copie el contenido manualmente.';
}

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.calculateTokenCosts = calculateTokenCosts;
window.changeTokenTab = changeTokenTab;
window.initializeTokenCalculator = initializeTokenCalculator;
