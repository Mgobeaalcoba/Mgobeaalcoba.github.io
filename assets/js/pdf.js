// pdf.js - PDF generation logic for the CV

import { experienceData, educationData, certifications, techStackData } from './data.js';
import { translations } from './translations.js';
import { DOM } from './utils.js';

// =================================================================================
// MAIN PDF GENERATION FUNCTION
// =================================================================================

async function generatePdf() {
    const downloadBtn = DOM.find('#download-btn');
    const downloadText = DOM.find('#download-text');
    const downloadIcon = DOM.find('#download-icon');
    
    if (!downloadBtn || !downloadText || !downloadIcon) return;
    
    // Update button state
    downloadText.textContent = 'Generating...';
    downloadIcon.className = 'fas fa-spinner fa-spin w-5 mr-2';
    downloadBtn.disabled = true;
    
    // Store original theme and switch to light mode for PDF
    const originalTheme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    document.documentElement.classList.add('light-mode');
    
    try {
        await createPdf();
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        // Restore original state
        downloadText.textContent = 'Download CV';
        downloadIcon.className = 'fas fa-download w-5 mr-2';
        downloadBtn.disabled = false;
        
        if (originalTheme === 'dark') {
            document.documentElement.classList.remove('light-mode');
        }
    }
}

async function createPdf() {
    const element = document.getElementById('page-content');
    if (!element) throw new Error('Page content element not found');
    
    // Create temporary experience container for PDF
    const tempExperienceContainer = createTemporaryExperienceContainer();
    
    // Hide original timeline and add temporary container
    const experienceSection = document.getElementById('experience-timeline')?.parentElement;
    const rightColumn = experienceSection?.parentElement;
    
    if (experienceSection && rightColumn) {
        experienceSection.style.display = 'none';
        rightColumn.appendChild(tempExperienceContainer);
    }
    
    try {
        // Wait for DOM updates
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate canvas
        const canvas = await html2canvas(element, { 
            useCORS: true,
            scale: 1, 
            backgroundColor: '#f9fafb', 
            windowWidth: element.scrollWidth, 
            windowHeight: element.scrollHeight 
        });
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = canvas.width / canvas.height;
        let imgHeight = pdfWidth / ratio;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        // Save PDF
        pdf.save('CV-MarianoGobeaAlcoba.pdf');
        
    } finally {
        // Clean up temporary elements
        if (rightColumn && tempExperienceContainer) {
            rightColumn.removeChild(tempExperienceContainer);
        }
        if (experienceSection) {
            experienceSection.style.display = 'block';
        }
    }
}

// =================================================================================
// EVENT LISTENER SETUP
// =================================================================================

export function setupPdfGeneration() {
    const downloadBtn = DOM.find('#download-btn');
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', generatePdf);
}

// =================================================================================
// DOM & HTML HELPERS FOR PDF
// =================================================================================

/**
 * Creates and returns the main container for the PDF version of the experience section.
 * It programmatically creates DOM nodes instead of using a large HTML string.
 */
function createTemporaryExperienceContainer() {
    const tempContainer = document.createElement('div');
    
    const title = document.createElement('h3');
    title.className = 'text-2xl font-semibold mb-8 border-b pb-2';
    title.style.cssText = 'border-color: #e5e7eb; color: #0ea5e9; font-family: "Inter", sans-serif; padding-left: 1.5rem;';
    title.textContent = 'Professional Experience';
    tempContainer.appendChild(title);
    
    experienceData.forEach(job => {
        const jobContainer = document.createElement('div');
        jobContainer.className = 'avoid-break mb-6 px-6';

        const date = document.createElement('p');
        date.className = 'font-semibold';
        date.style.color = '#0ea5e9';
        date.textContent = job.date['es'];
        jobContainer.appendChild(date);

        const jobTitle = document.createElement('h4');
        jobTitle.className = 'text-xl font-bold mt-1';
        jobTitle.style.color = '#1f2937';
        jobTitle.textContent = job.title['es'];
        jobContainer.appendChild(jobTitle);

        const company = document.createElement('p');
        company.className = 'font-semibold text-lg';
        company.style.color = '#4b5563';
        company.textContent = job.company;
        jobContainer.appendChild(company);

        const descriptionList = document.createElement('ul');
        descriptionList.className = 'list-disc list-inside space-y-2 text-base mt-2';
        descriptionList.style.color = '#4b5563';
        descriptionList.innerHTML = job.description['es']; // innerHTML is suitable here for list items
        jobContainer.appendChild(descriptionList);

        tempContainer.appendChild(jobContainer);
    });
    
    return tempContainer;
}

// =================================================================================
// PDF ERROR HANDLING
// =================================================================================

export function isPdfGenerationSupported() {
    return typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined';
}

export function showPdfError() {
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