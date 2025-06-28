// pdf.js - PDF generation logic for the CV

import { experienceData, educationData, certifications, projectsData, translations } from './data.js';
import { DOM, Storage } from './utils.js';

// =================================================================================
// PDF GENERATION CONSTANTS
// =================================================================================
const FONT_SIZES = {
    H1: 22,
    H2: 16,
    H3: 12,
    Body: 10,
    Small: 9,
};

const COLORS = {
    Primary: '#0ea5e9',
    Heading: '#1f2937',
    Body: '#374151',
    Muted: '#6b7280',
};

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

class PdfBuilder {
    constructor(lang) {
        // Force A4 format regardless of device - consistent PDF generation
        this.doc = new window.jspdf.jsPDF({ 
            orientation: 'portrait', 
            unit: 'mm', 
            format: 'a4',
            compress: true
        });
        this.yPos = MARGIN;
        this.lang = lang;
        this.doc.setFont('helvetica', 'normal');
        
        // Ensure consistent content width calculation
        this.contentWidth = PAGE_WIDTH - (MARGIN * 2); // Always 174mm regardless of screen
    }

    // Helper to get line height in mm for a given font size in pt
    getLineHeight(fontSize) {
        // The 1.15 factor is a standard line-height for good readability
        return this.doc.getTextDimensions('T', { fontSize }).h * 1.15;
    }

    checkPageBreak(requiredHeight) {
        if (this.yPos + requiredHeight > PAGE_HEIGHT - MARGIN) {
            this.doc.addPage();
            this.yPos = MARGIN;
        }
    }

    addSectionTitle(title) {
        const titleHeight = this.getLineHeight(FONT_SIZES.H2);
        this.checkPageBreak(titleHeight + 8); // title + gap + line + gap
        this.doc.setFont('helvetica', 'bold').setFontSize(FONT_SIZES.H2).setTextColor(COLORS.Heading);
        this.doc.text(title, MARGIN, this.yPos + titleHeight / 2); // Center vertically
        this.yPos += titleHeight;
        this.yPos += 1;
        this.doc.setDrawColor(COLORS.Primary).setLineWidth(0.5).line(MARGIN, this.yPos, MARGIN + this.contentWidth, this.yPos);
        this.yPos += 5;
    }

    addBodyText(text, options = {}) {
        const fontSize = options.fontSize || FONT_SIZES.Body;
        const color = options.color || COLORS.Body;
        const fontStyle = options.fontStyle || 'normal';
        const indent = options.indent || 0;

        this.doc.setFont('helvetica', fontStyle).setFontSize(fontSize).setTextColor(color);
        
        const lines = this.doc.splitTextToSize(text, this.contentWidth - indent);
        const lineHeight = this.getLineHeight(fontSize);
        const totalHeight = lines.length * lineHeight;

        this.checkPageBreak(totalHeight);
        this.doc.text(lines, MARGIN + indent, this.yPos);
        this.yPos += totalHeight;
    }
}

// =================================================================================
// MAIN PDF GENERATION FUNCTION
// =================================================================================

async function generatePdf() {
    const downloadBtn = DOM.find('#download-btn');
    const downloadText = DOM.find('#download-text');
    const downloadIcon = DOM.find('#download-icon');
    
    if (!downloadBtn || !downloadText || !downloadIcon) return;
    
    downloadText.textContent = 'Generating...';
    downloadIcon.className = 'fas fa-spinner fa-spin w-5 mr-2';
    downloadBtn.disabled = true;
    
    try {
        // Force desktop-like environment for PDF generation
        // This ensures consistent formatting regardless of device
        const originalInnerWidth = window.innerWidth;
        const originalInnerHeight = window.innerHeight;
        const originalUserAgent = navigator.userAgent;
        
        // Temporarily override window dimensions to desktop size for PDF consistency
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1280 // Desktop width
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 720 // Desktop height
        });
        
        const lang = Storage.get('language', 'es');
        const builder = new PdfBuilder(lang);
        await drawPdf(builder);
        builder.doc.save('CV-MarianoGobeaAlcoba.pdf');
        
        // Restore original dimensions
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: originalInnerHeight
        });
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showPdfError();
    } finally {
        downloadText.textContent = translations.download_btn[Storage.get('language', 'es')];
        downloadIcon.className = 'fas fa-download w-5 mr-2';
        downloadBtn.disabled = false;
    }
}

// =================================================================================
// PDF DRAWING LOGIC
// =================================================================================

/**
 * Loads an image from a given path and returns it as a Base64 string.
 * @param {string} path - The path to the image file.
 * @returns {Promise<string>} A promise that resolves with the Base64 image data.
 */
function loadImageAsBase64(path) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status === 200) {
                const blob = this.response;
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            } else {
                reject(new Error(`Failed to load image at ${path}: ${this.statusText}`));
            }
        };
        xhr.onerror = reject;
        xhr.send();
    });
}

async function drawPdf(builder) {
    const { doc, lang } = builder;

    // --- Header ---
    const profileImgBase64 = await loadImageAsBase64('assets/images/profile.png');
    const imgSize = 35;
    const headerHeight = imgSize + 10;
    builder.checkPageBreak(headerHeight);
    doc.addImage(profileImgBase64, 'PNG', MARGIN, builder.yPos, imgSize, imgSize, 'profile', 'FAST');

    const textX = MARGIN + imgSize + 10;
    
    doc.setFont('helvetica', 'bold').setFontSize(FONT_SIZES.H1).setTextColor(COLORS.Heading);
    doc.text('Mariano Gobea Alcoba', textX, builder.yPos + (imgSize / 2) - 2);

    doc.setFont('helvetica', 'normal').setFontSize(FONT_SIZES.H2).setTextColor(COLORS.Primary);
    doc.text(translations.job_title[lang], textX, builder.yPos + (imgSize / 2) + 6);
    
    builder.yPos += headerHeight;

    // --- About Me ---
    builder.addSectionTitle(translations.about_title[lang]);
    builder.addBodyText(translations.about_text[lang]);
    builder.yPos += 5;

    // --- Contact ---
    builder.addSectionTitle(translations.contact_title[lang]);
    builder.addBodyText('Buenos Aires, Argentina  •  +54 9 11 27475569  •  gobeamariano@gmail.com');
    builder.yPos += 5;

    // --- Professional Experience ---
    builder.addSectionTitle(translations.experience_title[lang]);
    experienceData.forEach(job => {
        const plainDescription = job.description[lang].replace(/<li>/g, '• ').replace(/<\/li>|<ul>|<\/ul>/g, '').split('\n').map(l => l.trim()).filter(l => l).join('\n');
        
        const titleHeight = builder.getLineHeight(FONT_SIZES.H3);
        const subtitleHeight = builder.getLineHeight(FONT_SIZES.Body);
        const descriptionLines = doc.setFontSize(FONT_SIZES.Body).splitTextToSize(plainDescription, builder.contentWidth - 5);
        const descriptionHeight = descriptionLines.length * builder.getLineHeight(FONT_SIZES.Body);
        
        builder.checkPageBreak(titleHeight + subtitleHeight + descriptionHeight + 8);

        builder.addBodyText(job.title[lang], { fontSize: FONT_SIZES.H3, fontStyle: 'bold', color: COLORS.Body });
        builder.yPos += 0.5;
        builder.addBodyText(`${job.company}  |  ${job.date[lang]}`, { color: COLORS.Muted });
        builder.yPos += 2;
        builder.addBodyText(plainDescription, { indent: 5 });
        builder.yPos += 6;
    });

    // --- Education ---
    builder.addSectionTitle(translations.education_title[lang]);
    educationData.forEach(edu => {
        const subtitleText = edu.subtitle ? `${edu.school} | ${edu.subtitle[lang]}` : edu.school;
        builder.checkPageBreak(20);
        builder.addBodyText(edu.title[lang], { fontSize: FONT_SIZES.H3, fontStyle: 'bold', color: COLORS.Body });
        builder.yPos += 0.5;
        builder.addBodyText(subtitleText, { color: COLORS.Muted });
        builder.yPos += 0.5;
        builder.addBodyText(edu.date, { fontSize: FONT_SIZES.Small, fontStyle: 'italic', color: COLORS.Muted });
        builder.yPos += 6;
    });

    // --- Certifications ---
    builder.addSectionTitle(translations.cert_title[lang]);
    const certText = certifications.join('  •  ');
    builder.addBodyText(certText, {fontSize: FONT_SIZES.Small, color: COLORS.Muted});
    builder.yPos += 5;

    // --- Featured Projects ---
    builder.addSectionTitle(translations.projects_title[lang]);
    projectsData.forEach(proj => {
        builder.checkPageBreak(25);
        builder.addBodyText(proj.title[lang], { fontSize: FONT_SIZES.H3, fontStyle: 'bold', color: COLORS.Body });
        builder.yPos += 1;
        builder.addBodyText(proj.description[lang]);
        builder.yPos += 1;
        doc.setFont('helvetica', 'normal').setFontSize(FONT_SIZES.Small).setTextColor(COLORS.Primary);
        doc.textWithLink('Ver Repositorio', MARGIN, builder.yPos, { url: proj.link });
        builder.yPos += builder.getLineHeight(FONT_SIZES.Small) + 6;
    });
}

export function setupPdfGeneration() {
    const downloadBtn = DOM.find('#download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePdf);
    }
}

function showPdfError() {
    const downloadBtn = DOM.find('#download-btn');
    const downloadText = DOM.find('#download-text');
    const downloadIcon = DOM.find('#download-icon');
    
    if (downloadBtn && downloadText && downloadIcon) {
        downloadText.textContent = 'Error - Reload page';
        downloadIcon.className = 'fas fa-exclamation-triangle w-5 mr-2';
        downloadBtn.disabled = true;
        
        setTimeout(() => {
            downloadText.textContent = 'Download CV';
            downloadIcon.className = 'fas fa-download w-5 mr-2';
            downloadBtn.disabled = false;
        }, 3000);
    }
}

function getStyles() {
    return {
        primaryColor: '#38bdf8',
        textColor: '#333333',
        secondaryColor: '#555555'
    };
}

function addHeader(doc, styles, lang) {
    // Implementation of addHeader function
}

function addSection(doc, title, content, styles) {
    // Implementation of addSection function
}

function addExperience(doc, styles, lang) {
    // Implementation of addExperience function
}

function addEducation(doc, styles, lang) {
    // Implementation of addEducation function
}

function addSkills(doc, styles, lang) {
    // Implementation of addSkills function
}

function addCertsAndLanguages(doc, styles, lang) {
    // Implementation of addCertsAndLanguages function
} 