// terminal.js - Interactive terminal mode logic

import { projectsData, experienceData, educationData, mgaLogo2, certificationsData, techStackData } from './data.js';
import { translations } from './translations.js';
import { DOM, Storage } from './utils.js';

// =================================================================================
// INITIALIZATION
// =================================================================================

export function initTerminal(lang) {
    const terminalOutput = DOM.find('#terminal-output');
    const terminalInput = DOM.find('#terminal-input');

    if (terminalOutput) {
        terminalOutput.innerHTML = ''; // Clear previous output
        printToTerminal(translations.terminal.welcome[lang]);
    }
    
    if (terminalInput) {
        // Ensure the listener is active
        initializeTerminalInput(terminalInput);
    }
}

let isTerminalInputInitialized = false;

export function initializeTerminalInput(terminalInput) {
    if (isTerminalInputInitialized) return;

    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const command = terminalInput.value.trim().toLowerCase();
            if (command) {
                printToTerminal(`<span class="text-gray-500">> ${command}</span>`);
                handleCommand(command);
            }
            terminalInput.value = "";
            const terminalContainer = DOM.find('#terminal-container');
            if (terminalContainer) {
                terminalContainer.scrollTop = terminalContainer.scrollHeight;
            }
        }
    });

    isTerminalInputInitialized = true;
}

// =================================================================================
// TERMINAL OUTPUT
// =================================================================================

export function printToTerminal(text) {
    const terminalOutput = DOM.find('#terminal-output');
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.innerHTML = text.replace(/\n/g, '<br>'); // Replace newlines for HTML
    line.classList.add('terminal-line', 'text-green-400');
    terminalOutput.appendChild(line);
}

// =================================================================================
// MATRIX EFFECT
// =================================================================================

export function startMatrixEffect() {
    const canvas = DOM.find('#matrix-canvas');
    if (!canvas) return;

    DOM.show(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    let matrixInterval = null;

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    matrixInterval = setInterval(draw, 33);

    const stopMatrix = (event) => {
        if (event.key === 'Escape' || event.type === 'click') {
            clearInterval(matrixInterval);
            DOM.hide(canvas);
            document.removeEventListener('keydown', stopMatrix);
            document.removeEventListener('click', stopMatrix);
        }
    };

    document.addEventListener('keydown', stopMatrix);
    document.addEventListener('click', stopMatrix);
}

// =================================================================================
// COMMAND HANDLING
// =================================================================================

export function handleCommand(command) {
    const terminalOutput = DOM.find('#terminal-output'); 
    
    const lang = Storage.get('language', 'es');
    const parts = command.split(' ');
    const baseCommand = parts[0];
    const argument = parts.length > 1 ? parts.slice(1).join(' ') : null;

    switch (baseCommand) {
        case 'help':
            printToTerminal(translations.terminal.help[lang]);
            break;
        case 'about':
            printToTerminal(translations.about_text[lang]);
            break;
        case 'experience':
            let expOutput = `${translations.terminal.experience_header[lang]}\n\n`;
            experienceData.forEach(job => {
                expOutput += `[${job.date[lang]}]\n> ${job.title[lang]} @ ${job.company}\n\n`;
            });
            printToTerminal(expOutput);
            break;

        case 'education':
            let eduOutput = `${translations.terminal.education_header[lang]}\n\n`;
            educationData.forEach(edu => {
                const subtitleLine = edu.subtitle ? `  (${edu.subtitle[lang]})\n` : '';
                eduOutput += `[${edu.date}]\n> ${edu.title[lang]}\n${subtitleLine}  @ ${edu.school}\n\n`;
            });
            printToTerminal(eduOutput);
            break;

        case 'neofetch':
            const skills = [
                `<span class="text-secondary">OS:</span>       Web Browser`,
                `<span class="text-secondary">Host:</span>     GitHub Pages`,
                `<span class="text-secondary">Kernel:</span>   1.0.0-MGA`,
                `<span class="text-secondary">Shell:</span>    bash 5.2.15`,
                `<span class="text-secondary">Theme:</span>    ${Storage.get('theme', 'dark')}`,
                `<span class="text-secondary">Memory:</span>   16384MiB`,
                ``,
                `<span class="text-secondary">Skills:</span>`,
                ` - Python, Java, Go, Cloud`,
                ` - Data & Analytics`,
                ` - LLMs, RAG`,
                ` - Software Engineering`
            ];
        
            printToTerminal(''); 
        
            // Responsive logic for neofetch
            if (window.innerWidth <= 768) {
                // Mobile layout
                mgaLogo2.forEach(line => {
                    const logoLineElement = document.createElement('div');
                    logoLineElement.className = 'neofetch-logo terminal-line';
                    logoLineElement.style.fontSize = '0.7em';
                    logoLineElement.style.lineHeight = '1';
                    logoLineElement.style.whiteSpace = 'pre';
                    logoLineElement.textContent = line;
                    terminalOutput.appendChild(logoLineElement);
                });
        
                printToTerminal(''); // Spacing
        
                skills.forEach(line => {
                    const skillLineElement = document.createElement('div');
                    skillLineElement.className = 'neofetch-skills terminal-line';
                    skillLineElement.style.paddingLeft = '0';
                    skillLineElement.innerHTML = line;
                    terminalOutput.appendChild(skillLineElement);
                });
        
            } else {
                // Desktop layout
                const maxLines = Math.max(mgaLogo2.length, skills.length);
        
                for (let i = 0; i < maxLines; i++) {
                    const logoLine = mgaLogo2[i] || '';
                    const skillLine = skills[i] || '';
        
                    const lineContainer = document.createElement('div');
                    lineContainer.classList.add('neofetch-line');
        
                    const logoElement = document.createElement('span');
                    logoElement.classList.add('neofetch-logo');
                    logoElement.textContent = logoLine;
        
                    const skillElement = document.createElement('span');
                    skillElement.classList.add('neofetch-skills');
                    skillElement.innerHTML = skillLine; 
        
                    lineContainer.appendChild(logoElement);
                    lineContainer.appendChild(skillElement);
        
                    terminalOutput.appendChild(lineContainer);
                }
            }
        
            printToTerminal(''); 
            break;

        case 'matrix':
            startMatrixEffect();
            break;

        case 'projects':
            let filteredProjects = projectsData;
            let filteredExperience = experienceData;
            let filteredEducation = educationData;
            let filteredCerts = certificationsData;
            
            if (argument && argument.toLowerCase().startsWith('--tag')) {
                const tag = argument.split(' ')[1];
                if (tag) {
                    const tagLower = tag.toLowerCase();
                    // Check if tag is a category
                    if (techStackData[tag]) {
                        // Filter by category
                        const categoryTechnologies = techStackData[tag];
                        filteredProjects = projectsData.filter(p => 
                            p.tags.some(t => categoryTechnologies.map(x => x.toLowerCase()).includes(t.toLowerCase()))
                        );
                        filteredExperience = experienceData.filter(exp => 
                            exp.tags && exp.tags.some(t => categoryTechnologies.map(x => x.toLowerCase()).includes(t.toLowerCase()))
                        );
                        filteredEducation = educationData.filter(edu => 
                            edu.tags && edu.tags.some(t => categoryTechnologies.map(x => x.toLowerCase()).includes(t.toLowerCase()))
                        );
                        filteredCerts = certificationsData.filter(cert => 
                            cert.tags && cert.tags.some(t => categoryTechnologies.map(x => x.toLowerCase()).includes(t.toLowerCase()))
                        );
                        printToTerminal(translations.terminal.projects_with_tag[lang].replace('{tag}', tag) + ' (Category)');
                    } else {
                        // Filter by specific technology (case-insensitive)
                        filteredProjects = projectsData.filter(p => p.tags.map(t => t.toLowerCase()).includes(tagLower));
                        filteredExperience = experienceData.filter(exp => 
                            exp.tags && exp.tags.map(t => t.toLowerCase()).includes(tagLower)
                        );
                        filteredEducation = educationData.filter(edu => 
                            edu.tags && edu.tags.map(t => t.toLowerCase()).includes(tagLower)
                        );
                        filteredCerts = certificationsData.filter(cert => 
                            cert.tags && cert.tags.map(t => t.toLowerCase()).includes(tagLower)
                        );
                        printToTerminal(translations.terminal.projects_with_tag[lang].replace('{tag}', tag));
                    }
                } else {
                    printToTerminal(translations.terminal.tag_error[lang]);
                    return;
                }
            } else {
                printToTerminal(translations.terminal.projects_all[lang]);
            }
            
            // Show projects
            if (filteredProjects.length === 0) {
                printToTerminal('No projects found for this technology.');
            } else {
                let projOutput = `\n--- PROJECTS ---\n`;
                filteredProjects.forEach(proj => {
                    projOutput += `[${proj.tags.join(', ')}]\n> ${proj.title[lang]}\n\n`;
                });
                printToTerminal(projOutput);
            }
            
            // Show experience
            if (filteredExperience.length > 0) {
                let expOutput = `--- EXPERIENCE ---\n`;
                filteredExperience.forEach(job => {
                    expOutput += `[${job.tags.join(', ')}]\n> ${job.title[lang]} @ ${job.company}\n`;
                });
                printToTerminal(expOutput);
            }
            
            // Show education
            if (filteredEducation.length > 0) {
                let eduOutput = `\n--- EDUCATION ---\n`;
                filteredEducation.forEach(edu => {
                    const subtitleLine = edu.subtitle ? `  (${edu.subtitle[lang]})` : '';
                    eduOutput += `[${edu.tags.join(', ')}]\n> ${edu.title[lang]}${subtitleLine}\n  @ ${edu.school}\n`;
                });
                printToTerminal(eduOutput);
            }
            
            // Show certifications
            if (filteredCerts.length > 0) {
                let certOutput = `\n--- CERTIFICATIONS ---\n`;
                filteredCerts.forEach(cert => {
                    certOutput += `[${cert.tags.join(', ')}]\n> ${cert.name}\n`;
                });
                printToTerminal(certOutput);
            }
            break;

        case 'contact':
            const contactDetails = translations.terminal.contact_details[lang];
            contactDetails.split('\n').forEach(line => {
                printToTerminal(line);
            });
            break;

        case 'clear':
            const terminalOutputEl = DOM.find('#terminal-output');
            if (terminalOutputEl) terminalOutputEl.innerHTML = '';
            break;

        case 'gui':
            // Restaurar el tema anterior a cli, por defecto 'dark'
            import('./themes.js').then(({ setTheme }) => setTheme('dark'));
            break;

        default:
            printToTerminal(translations.terminal.command_not_found[lang].replace('{command}', command));
            break;
    }
}

// =================================================================================
// TERMINAL VISIBILITY
// =================================================================================

export function toggleTerminal(show) {
    const terminalContainer = DOM.find('#terminal-container');
    const mainContent = DOM.find('#page-content');
    const terminalInput = DOM.find('#terminal-input');
    
    // This class is crucial for other modules to know if the terminal is active.
    document.body.classList.toggle('terminal-mode-active', show);

    if (show) {
        DOM.show(terminalContainer);
        DOM.hide(mainContent);
        terminalInput?.focus();
    } else {
        DOM.hide(terminalContainer);
        DOM.show(mainContent);
    }
} 