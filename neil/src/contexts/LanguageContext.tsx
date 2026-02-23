'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LangCode, Translation } from '@/types/content';
import { useNeilData } from '@/contexts/NeilDataContext';

interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'neil_lang';
const DEFAULT_LANG: LangCode = 'es';
const AVAILABLE_LANGS: LangCode[] = ['es', 'en', 'it', 'fr', 'pt', 'de'];

function detectBrowserLang(): LangCode {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const nav = navigator.language?.toLowerCase() ?? '';
  for (const lang of AVAILABLE_LANGS) {
    if (nav.startsWith(lang)) return lang;
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { translations } = useNeilData();
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && AVAILABLE_LANGS.includes(stored)) {
      setLangState(stored);
    } else {
      setLangState(detectBrowserLang());
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const currentLang = mounted ? lang : DEFAULT_LANG;
  const translation = (translations[currentLang] ?? translations[DEFAULT_LANG] ?? {}) as unknown as Translation;

  return (
    <LanguageContext.Provider value={{ lang: currentLang, setLang, t: translation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
