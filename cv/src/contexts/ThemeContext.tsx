'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  cycleTheme: () => {},
});

const THEMES: Theme[] = ['dark', 'light'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const savedTheme = THEMES.find((candidate) => candidate === saved);
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else if (saved === 'terminal') {
      setThemeState('dark');
      localStorage.setItem('theme', 'dark');
      applyTheme('dark');
    } else {
      const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      setThemeState(preferred);
      applyTheme(preferred);
    }
    setMounted(true);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'terminal', 'light-mode', 'terminal-mode');
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light', 'light-mode');
    }
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('theme', t);
    applyTheme(t);
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
  }

  if (!mounted) return <div className="min-h-screen bg-[#070b12]">{children}</div>;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
