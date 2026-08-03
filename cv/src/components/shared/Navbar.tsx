'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Command, Globe2, Menu, Moon, Search, Sun, Terminal, X } from 'lucide-react';
import Link from './TransitionLink';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';

const LINKS = [
  { href: '/#soluciones', es: 'Soluciones', en: 'Solutions' },
  { href: '/#casos', es: 'Casos', en: 'Cases' },
  { href: '/portfolio/', es: 'Mariano', en: 'Mariano' },
  { href: '/blog/', es: 'Blog', en: 'Blog' },
  { href: '/recursos/', es: 'Herramientas', en: 'Tools' },
];

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  dark: <Moon size={17} />,
  light: <Sun size={17} />,
  terminal: <Terminal size={17} />,
};

const MOBILE_TITLES: Record<string, { es: string; en: string }> = {
  '/': { es: 'Inicio', en: 'Home' },
  '/portfolio': { es: 'Mariano', en: 'Mariano' },
  '/blog': { es: 'Blog', en: 'Blog' },
  '/recursos': { es: 'Herramientas', en: 'Tools' },
};

export default function Navbar() {
  const pathname = usePathname();
  const { theme, cycleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href.replace(/\/$/, ''));
  };

  const switchLanguage = () => {
    const next = lang === 'es' ? 'en' : 'es';
    events.languageSwitch(lang, next);
    setLang(next);
  };

  const mobileTitle = Object.entries(MOBILE_TITLES).find(([route]) => route === '/' ? pathname === '/' : pathname.startsWith(route))?.[1]?.[lang] ?? 'MGA';

  return (
    <nav className={`signal-nav ${scrolled ? 'signal-nav--scrolled' : ''}`} aria-label="Navegación principal">
      <div className="signal-nav__inner">
        <Link href="/" className="signal-brand" aria-label="MGA Tech Consulting — Inicio">
          <Image src={theme === 'light' ? '/images/consulting-logo-light.png' : '/images/consulting-logo-dark.png'} alt="MGA Tech Consulting" width={176} height={74} priority />
          <span className="signal-brand__descriptor">Systems for growth</span>
        </Link>
        <strong className="signal-mobile-page-title">{mobileTitle}</strong>

        <div className="signal-nav__links">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => events.navClick(link.href, link[lang])}
              className={isActive(link.href) ? 'is-active' : ''}
            >
              {link[lang]}
            </Link>
          ))}
        </div>

        <div className="signal-nav__actions">
          <button
            className="signal-icon-button signal-search-button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
            aria-label={lang === 'es' ? 'Abrir búsqueda rápida' : 'Open quick search'}
          >
            <Search size={16} />
            <span>{lang === 'es' ? 'Buscar' : 'Search'}</span>
            <kbd><Command size={10} />K</kbd>
          </button>
          <button className="signal-icon-button" onClick={switchLanguage} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>
            <Globe2 size={16} />
            <span>{lang.toUpperCase()}</span>
          </button>
          <button className="signal-icon-button signal-theme-button" onClick={cycleTheme} aria-label={`${lang === 'es' ? 'Cambiar tema' : 'Change theme'}: ${theme}`}>
            {THEME_ICONS[theme]}
          </button>
          <button
            className="signal-icon-button signal-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="signal-mobile-menu">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? 'is-active' : ''}>
              <span>{link[lang]}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
