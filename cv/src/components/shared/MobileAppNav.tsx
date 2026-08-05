'use client';

import { Blocks, Newspaper, ShoppingBag, UserRound, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from './TransitionLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/gtag';

const ITEMS = [
  { href: '/', icon: Blocks, es: 'Soluciones', en: 'Solutions', match: (path: string) => path === '/' },
  { href: '/servicios/', icon: ShoppingBag, es: 'Servicios', en: 'Services', match: (path: string) => path.startsWith('/servicios') },
  { href: '/portfolio/', icon: UserRound, es: 'Mariano', en: 'Mariano', match: (path: string) => path.startsWith('/portfolio') },
  { href: '/blog/', icon: Newspaper, es: 'Blog', en: 'Blog', match: (path: string) => path.startsWith('/blog') },
  { href: '/recursos/', icon: Wrench, es: 'Herramientas', en: 'Tools', match: (path: string) => path.startsWith('/recursos') },
] as const;

export default function MobileAppNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  return (
    <nav className="signal-mobile-tabs" aria-label={lang === 'es' ? 'Navegación principal mobile' : 'Mobile primary navigation'}>
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            href={item.href}
            key={item.href}
            className={active ? 'is-active' : ''}
            aria-current={active ? 'page' : undefined}
            onClick={() => events.navClick(item.href, item[lang])}
          >
            <span><Icon size={20} strokeWidth={active ? 2.4 : 1.8} /></span>
            <small>{item[lang]}</small>
          </Link>
        );
      })}
    </nav>
  );
}
