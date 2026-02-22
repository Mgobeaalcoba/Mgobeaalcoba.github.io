'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ContentRepository } from '@/services/contentService';

interface HistoryEntry {
  type: 'input' | 'output';
  text: string;
}

const MGA_LOGO = [
  '███╗   ███╗ ██████╗  █████╗ ',
  '████╗ ████║██╔════╝ ██╔══██╗',
  '██╔████╔██║██║  ███╗███████║',
  '██║╚██╔╝██║██║   ██║██╔══██║',
  '██║ ╚═╝ ██║╚██████╔╝██║  ██║',
  '╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝',
];

const MATRIX_CHARS =
  'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function Terminal() {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: t('terminal_welcome') },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const experience = ContentRepository.getExperience();
  const projects = ContentRepository.getProjects();
  const education = ContentRepository.getEducation();
  const meta = ContentRepository.getMeta();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const stopMatrix = useCallback(() => {
    if (matrixIntervalRef.current) {
      clearInterval(matrixIntervalRef.current);
      matrixIntervalRef.current = null;
    }
    setMatrixActive(false);
  }, []);

  useEffect(() => {
    if (!matrixActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array.from({ length: columns }, () => 1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < rainDrops.length; i++) {
        const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    matrixIntervalRef.current = setInterval(draw, 33);

    const handleStop = (e: KeyboardEvent | MouseEvent) => {
      if ((e as KeyboardEvent).key === undefined || (e as KeyboardEvent).key === 'Escape') {
        stopMatrix();
      }
    };

    const handleClick = () => stopMatrix();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') stopMatrix(); };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [matrixActive, stopMatrix]);

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
  matrix         - Enter the Matrix (click or Esc to exit)
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
          const filtered = projects.filter((p) =>
            p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
          );
          if (!filtered.length) return `No projects found for tag: ${tag}`;
          return `--- Projects with tag: ${tag} ---\n` +
            filtered.map((p) => `• ${p.title[lang]}\n  ${p.link}`).join('\n\n');
        }
        return `--- ${lang === 'es' ? 'Proyectos' : 'Projects'} ---\n` +
          projects.slice(0, 8).map((p) => `• ${p.title[lang]}\n  ${p.link}`).join('\n\n');
      }

      case 'contact':
        return `Email: ${meta.email}\nPhone: ${meta.phone}\nLocation: ${meta.location}\nLinkedIn: ${meta.linkedin}\nGitHub: ${meta.github}`;

      case 'neofetch': {
        const info = [
          'Mariano Gobea Alcoba',
          '─────────────────────────',
          `OS:       Buenos Aires, Argentina`,
          `Role:     Data & Analytics Tech Lead`,
          `Company:  MercadoLibre`,
          `Shell:    Python / SQL / n8n`,
          `Uptime:   6+ years at MeLi`,
          ``,
          `Skills:`,
          ` - Python, Java, Go, Cloud`,
          ` - Data & Analytics, LLMs, RAG`,
          ` - Software Engineering`,
        ];
        const maxLen = Math.max(MGA_LOGO.length, info.length);
        const lines: string[] = [];
        for (let i = 0; i < maxLen; i++) {
          const logo = (MGA_LOGO[i] ?? '').padEnd(30, ' ');
          const inf = info[i] ?? '';
          lines.push(`${logo}  ${inf}`);
        }
        return '\n' + lines.join('\n') + '\n';
      }

      case 'matrix':
        setMatrixActive(true);
        return lang === 'es'
          ? 'Entrando a la Matrix... (click o Esc para salir)'
          : 'Entering the Matrix... (click or Esc to exit)';

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
    <>
      {/* Matrix canvas overlay */}
      {matrixActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-[9999] cursor-pointer"
          style={{ background: '#000' }}
          title="Click or press Esc to exit Matrix"
        />
      )}

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
    </>
  );
}
