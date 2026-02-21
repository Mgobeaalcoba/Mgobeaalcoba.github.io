'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LangCode, Translation } from '@/types/content';
import ContentRepository from '@/services/contentService';

interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'neil_lang';
const DEFAULT_LANG: LangCode = 'es';

function detectBrowserLang(): LangCode {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const available: LangCode[] = ['es', 'en', 'it', 'fr', 'pt', 'de'];
  const nav = navigator.language?.toLowerCase() ?? '';
  for (const lang of available) {
    if (nav.startsWith(lang)) return lang;
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    const available = ContentRepository.getAvailableLangs();
    if (stored && available.includes(stored)) {
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

  const translation = ContentRepository.getTranslation(lang);

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: DEFAULT_LANG, setLang, t: ContentRepository.getTranslation(DEFAULT_LANG) }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translation }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
