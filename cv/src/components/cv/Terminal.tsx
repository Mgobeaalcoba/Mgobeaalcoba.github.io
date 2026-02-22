'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ContentRepository } from '@/services/contentService';

interface HistoryEntry {
  type: 'input' | 'output';
  text: string;
}

export default function Terminal() {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: t('terminal_welcome') },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const experience = ContentRepository.getExperience();
  const projects = ContentRepository.getProjects();
  const education = ContentRepository.getEducation();
  const meta = ContentRepository.getMeta();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (theme !== 'terminal') return null;

  function processCommand(cmd: string): string {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();

    switch (command) {
      case 'help':
        return `Available commands:
  about          - Personal summary
  experience     - Professional experience
  education      - Education & certifications
  projects       - All projects
  projects --tag <tech>  - Filter projects by technology
  contact        - Contact information
  neofetch       - System information
  clear          - Clear terminal
  gui            - Switch to GUI mode`;

      case 'about':
        return ContentRepository.getAbout().text[lang];

      case 'experience':
        return `--- ${lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience'} ---\n` +
          experience.map((e) => `${e.date[lang]}\n  ${e.title[lang]} @ ${e.company}`).join('\n\n');

      case 'education':
        return `--- ${lang === 'es' ? 'Educación' : 'Education'} ---\n` +
          education.map((e) => `${e.date}\n  ${e.title[lang]} - ${e.school}`).join('\n\n');

      case 'projects': {
        const tagFlag = parts.indexOf('--tag');
        if (tagFlag !== -1 && parts[tagFlag + 1]) {
          const tag = parts[tagFlag + 1];
          const filtered = projects.filter((p) => p.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
          if (!filtered.length) return `No projects found for tag: ${tag}`;
          return `--- Projects with tag: ${tag} ---\n` +
            filtered.map((p) => `• ${p.title[lang]}\n  ${p.link}`).join('\n\n');
        }
        return `--- ${lang === 'es' ? 'Proyectos' : 'Projects'} ---\n` +
          projects.slice(0, 8).map((p) => `• ${p.title[lang]}\n  ${p.link}`).join('\n\n');
      }

      case 'contact':
        return `Email: ${meta.email}\nPhone: ${meta.phone}\nLocation: ${meta.location}\nLinkedIn: ${meta.linkedin}\nGitHub: ${meta.github}`;

      case 'neofetch':
        return `
   ██████╗  ██████╗     Mariano Gobea Alcoba
  ██╔════╝ ██╔═══██╗    ────────────────────
  ██║  ███╗███████║      OS: Buenos Aires, Argentina
  ██║   ██║██╔══██║      Role: Data & Analytics Tech Lead
  ╚██████╔╝██║  ██║      Company: MercadoLibre
   ╚═════╝ ╚═╝  ╚═╝      Shell: Python / SQL / n8n
                          Uptime: 6+ years at MeLi`;

      case 'matrix':
        return 'Matrix mode is not available in static export. Try the GUI mode!';

      case 'clear':
        setHistory([{ type: 'output', text: t('terminal_welcome') }]);
        return '';

      case 'gui':
        return `${lang === 'es' ? 'Cambiando a modo GUI...' : 'Switching to GUI mode...'} [use the theme toggle in the navbar]`;

      case '':
        return '';

      default:
        return t('terminal_not_found').replace('{cmd}', command);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && input !== 'clear') return;

    const newHistory: HistoryEntry[] = [
      ...history,
      { type: 'input', text: `mga@portfolio:~$ ${input}` },
    ];

    if (input.trim().toLowerCase() !== 'clear') {
      const output = processCommand(input);
      if (output) newHistory.push({ type: 'output', text: output });
    } else {
      setHistory([{ type: 'output', text: t('terminal_welcome') }]);
      setCmdHistory([input, ...cmdHistory]);
      setCmdIndex(-1);
      setInput('');
      return;
    }

    setHistory(newHistory);
    setCmdHistory([input, ...cmdHistory]);
    setCmdIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(cmdIndex + 1, cmdHistory.length - 1);
      setCmdIndex(idx);
      setInput(cmdHistory[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(cmdIndex - 1, -1);
      setCmdIndex(idx);
      setInput(idx === -1 ? '' : cmdHistory[idx]);
    }
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="rounded-xl overflow-hidden border border-green-500/30"
        style={{ background: '#0a0a0a' }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/20" style={{ background: '#111' }}>
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-green-600 terminal-font">mga@portfolio ~ zsh</span>
        </div>

        {/* Terminal body */}
        <div className="p-4 h-80 overflow-y-auto custom-scrollbar terminal-font text-xs text-green-400 space-y-1">
          {history.map((entry, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap leading-relaxed ${
                entry.type === 'input' ? 'text-green-300' : 'text-green-400'
              }`}
            >
              {entry.text}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-2 border-t border-green-500/20">
          <span className="text-green-500 text-xs terminal-font mr-2">mga@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-green-400 text-xs terminal-font focus:outline-none caret-green-400"
          />
        </form>
      </div>
    </section>
  );
}
