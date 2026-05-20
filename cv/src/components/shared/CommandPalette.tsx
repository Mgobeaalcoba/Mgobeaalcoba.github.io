'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  Terminal as TerminalIcon, 
  Globe, 
  Search, 
  MessageSquare, 
  Bot, 
  Calculator, 
  Landmark, 
  BookOpen, 
  User, 
  X,
  Sparkles
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { openContactModal } from './ContactModal';
import { events } from '@/lib/gtag';

interface CommandItem {
  id: string;
  category: 'navigation' | 'settings' | 'actions';
  labelEs: string;
  labelEn: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string[];
}

export default function CommandPalette() {
  const router = useRouter();
  const { theme, cycleTheme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigateTo = (path: string) => {
    setIsOpen(false);
    events.navClick(path, `Command Palette: ${path}`);
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.push(path);
      });
    } else {
      router.push(path);
    }
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-consulting',
      category: 'navigation',
      labelEs: 'Ir a Consultoría Tecnológica (Inicio)',
      labelEn: 'Go to Tech Consulting (Home)',
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      action: () => navigateTo('/'),
    },
    {
      id: 'nav-portfolio',
      category: 'navigation',
      labelEs: 'Ir a Portfolio / CV Profesional',
      labelEn: 'Go to Portfolio / Professional CV',
      icon: <User className="w-4 h-4 text-indigo-400" />,
      action: () => navigateTo('/portfolio/'),
    },
    {
      id: 'nav-blog',
      category: 'navigation',
      labelEs: 'Ir a Blog Técnico (Data Engineering)',
      labelEn: 'Go to Technical Blog (Data Engineering)',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      action: () => navigateTo('/blog/'),
    },
    {
      id: 'nav-recursos',
      category: 'navigation',
      labelEs: 'Ir a Recursos Financieros y Calculadoras',
      labelEn: 'Go to Financial Resources & Calculators',
      icon: <Landmark className="w-4 h-4 text-amber-400" />,
      action: () => navigateTo('/recursos/'),
    },
    {
      id: 'nav-recursos-calc',
      category: 'navigation',
      labelEs: 'Ir a Calculadora de Impuesto a las Ganancias',
      labelEn: 'Go to Income Tax Calculator',
      icon: <Calculator className="w-4 h-4 text-rose-400" />,
      action: () => navigateTo('/recursos/#calculator'),
    },

    // Actions
    {
      id: 'action-contact',
      category: 'actions',
      labelEs: 'Abrir Formulario de Contacto (WhatsApp / Email)',
      labelEn: 'Open Contact Form (WhatsApp / Email)',
      icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
      action: () => {
        setIsOpen(false);
        openContactModal('command_palette');
      },
    },
    {
      id: 'action-assistant',
      category: 'actions',
      labelEs: 'Chatear con el Asistente IA de Mariano',
      labelEn: "Chat with Mariano's AI Assistant",
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      action: () => {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('open-ai-assistant'));
      },
    },

    // Settings / Themes
    {
      id: 'theme-dark',
      category: 'settings',
      labelEs: 'Cambiar Tema a Modo Oscuro',
      labelEn: 'Switch Theme to Dark Mode',
      icon: <Moon className="w-4 h-4 text-gray-400" />,
      action: () => {
        setTheme('dark');
        setIsOpen(false);
      },
    },
    {
      id: 'theme-light',
      category: 'settings',
      labelEs: 'Cambiar Tema a Modo Claro',
      labelEn: 'Switch Theme to Light Mode',
      icon: <Sun className="w-4 h-4 text-yellow-400" />,
      action: () => {
        setTheme('light');
        setIsOpen(false);
      },
    },
    {
      id: 'theme-terminal',
      category: 'settings',
      labelEs: 'Cambiar Tema a Modo Terminal',
      labelEn: 'Switch Theme to Terminal Mode',
      icon: <TerminalIcon className="w-4 h-4 text-green-400" />,
      action: () => {
        setTheme('terminal');
        setIsOpen(false);
      },
    },
    {
      id: 'lang-es',
      category: 'settings',
      labelEs: 'Cambiar Idioma a Español',
      labelEn: 'Change Language to Spanish',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      action: () => {
        setLang('es');
        setIsOpen(false);
      },
    },
    {
      id: 'lang-en',
      category: 'settings',
      labelEs: 'Cambiar Idioma a Inglés',
      labelEn: 'Change Language to English',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      action: () => {
        setLang('en');
        setIsOpen(false);
      },
    },
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const term = search.toLowerCase();
    const label = (lang === 'es' ? cmd.labelEs : cmd.labelEn).toLowerCase();
    const cat = cmd.category.toLowerCase();
    return label.includes(term) || cat.includes(term);
  });

  // Handle arrow keys and navigation
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, activeIndex, filteredCommands]);

  // Scroll active element into view
  useEffect(() => {
    const activeEl = listRef.current?.children[activeIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  const t_local = (es: string, en: string) => (lang === 'es' ? es : en);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-gray-900/90 dark:bg-gray-950/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh] transition-all scale-100 animate-in fade-in zoom-in-95 duration-150 theme-terminal-border">
        {/* Search Input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 shrink-0">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t_local('¿Qué estás buscando? Escribe un comando...', 'What are you looking for? Type a command...')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-gray-100 border-none outline-none focus:ring-0 placeholder-gray-500"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-950/20"
        >
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              {t_local('No se encontraron comandos para tu búsqueda.', 'No commands found for your search.')}
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-400 border-l-2 border-sky-500 pl-2.5 font-medium' 
                      : 'text-gray-300 hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500/10' : 'bg-white/5'}`}>
                      {cmd.icon}
                    </span>
                    <span className="text-sm">
                      {lang === 'es' ? cmd.labelEs : cmd.labelEn}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400/80 bg-sky-500/10 px-2 py-0.5 rounded">
                      {t_local('Ejecutar', 'Run')} ↵
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-gray-950/60 border-t border-white/5 text-[10px] text-gray-500 flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-4">
            <span>↑↓ {t_local('Navegar', 'Navigate')}</span>
            <span>↵ {t_local('Seleccionar', 'Select')}</span>
            <span>esc {t_local('Cerrar', 'Close')}</span>
          </div>
          <div>
            <span>MGA Tech Consulting</span>
          </div>
        </div>
      </div>
    </div>
  );
}
