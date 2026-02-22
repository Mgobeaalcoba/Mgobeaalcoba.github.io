'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'terminal';

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

const THEMES: Theme[] = ['dark', 'light', 'terminal'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && THEMES.includes(saved)) {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      applyTheme('dark');
    }
    setMounted(true);
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'terminal', 'light-mode', 'terminal-mode');
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.add('light', 'light-mode');
    } else {
      root.classList.add('dark', 'terminal-mode');
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

  if (!mounted) {
    return (
      <div className="bg-gray-900 min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
