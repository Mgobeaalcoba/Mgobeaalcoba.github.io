'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const pathname = usePathname();
  const isDark = theme === 'dark' || theme === 'terminal';
  const isConsultingPage = pathname.includes('/consulting') ||
    pathname.includes('/blog') ||
    pathname.includes('/recursos');

  const logoSrc = isConsultingPage
    ? (isDark ? '/images/consulting-logo-dark.png' : '/images/consulting-logo-light.png')
    : (isDark ? '/images/portfolio-logo-dark.png' : '/images/portfolio-logo.png');

  const logoAlt = isConsultingPage ? 'MGA Tech Consulting' : 'MGA Portfolio';

  return (
    <footer className="glass border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand with logo */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={180}
                height={75}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Data & Analytics Technical Leader at MercadoLibre.
              <br />
              Buenos Aires, Argentina.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Portfolio / CV
                </Link>
              </li>
              <li>
                <Link href="/consulting/" className="text-gray-400 hover:text-sky-400 transition-colors">
                  {t('nav_consulting')}
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/recursos/" className="text-gray-400 hover:text-sky-400 transition-colors">
                  {t('nav_recursos')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Contacto</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/mariano-gobea-alcoba/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
              <a
                href="https://github.com/Mgobeaalcoba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href="https://twitter.com/MGobeaAlcoba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Twitter size={14} />
                Twitter/X
              </a>
              <a
                href="mailto:gobeamariano@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors"
              >
                <Mail size={14} />
                gobeamariano@gmail.com
              </a>
            </div>
          </div>

          {/* Legal / Stack */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-3">Tecnología</h4>
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <span>Next.js 14 · TypeScript</span>
              <span>Tailwind CSS · Framer Motion</span>
              <span>GitHub Pages · GA4</span>
              <span className="mt-2 text-gray-600">© 2026 Mariano Gobea Alcoba</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            {t('footer_design')} <Heart size={14} className="text-red-400" /> {t('footer_location')} · 2026
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <a href="https://github.com/Mgobeaalcoba" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              GitHub
            </a>
            <span>·</span>
            <a href="https://www.linkedin.com/in/mariano-gobea-alcoba/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
              LinkedIn
            </a>
            <span>·</span>
            <a href="mailto:gobeamariano@gmail.com" className="hover:text-sky-400 transition-colors">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
