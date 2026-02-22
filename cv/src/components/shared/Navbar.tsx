'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Monitor, Sun, Moon, Globe, Menu, X, Terminal } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Theme } from '@/contexts/ThemeContext';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/cv-site/', labelKey: 'nav_portfolio' },
  { href: '/cv-site/consulting/', labelKey: 'nav_consulting' },
  { href: '/cv-site/blog/', labelKey: 'nav_blog' },
  { href: '/cv-site/recursos/', labelKey: 'nav_recursos' },
];

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  dark: <Moon size={16} />,
  light: <Sun size={16} />,
  terminal: <Terminal size={16} />,
};

export default function Navbar() {
  const { theme, cycleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname === href.replace('/cv-site', '');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/cv-site/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-sky-500/30">
              <Image
                src="/cv-site/favicon.png"
                alt="MGA Logo"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
              MGA
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-sky-400 ${
                  isActive(link.href)
                    ? 'text-sky-400'
                    : 'text-gray-300 dark:text-gray-300'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="hidden sm:flex items-center gap-1 glass rounded-lg px-2 py-1">
              <Globe size={12} className="text-gray-400" />
              <button
                onClick={() => setLang('es')}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  lang === 'es' ? 'text-sky-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                ES
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => setLang('en')}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  lang === 'en' ? 'text-sky-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors"
              title={`Theme: ${theme}`}
            >
              {THEME_ICONS[theme]}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden glass p-2 rounded-lg text-gray-400 hover:text-sky-400 transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass rounded-xl mb-4 p-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-sky-400 bg-sky-500/10'
                    : 'text-gray-300 hover:text-sky-400 hover:bg-white/5'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Globe size={14} className="text-gray-400" />
              <button
                onClick={() => setLang('es')}
                className={`text-sm px-2 py-1 rounded ${lang === 'es' ? 'text-sky-400 font-bold' : 'text-gray-400'}`}
              >
                Español
              </button>
              <span className="text-gray-600">/</span>
              <button
                onClick={() => setLang('en')}
                className={`text-sm px-2 py-1 rounded ${lang === 'en' ? 'text-sky-400 font-bold' : 'text-gray-400'}`}
              >
                English
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
