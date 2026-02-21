'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { FooterLink } from '@/types/content';

interface NavbarProps {
  links: FooterLink[];
  brandName: string;
  logo: string;
}

export default function Navbar({ links, brandName, logo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-cyan-accent/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#inicio" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={brandName}
            className="h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.anchor}
              href={link.anchor}
              className="text-sm text-slate-400 hover:text-[#0CC1C1] transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold bg-[#0CC1C1] text-black hover:bg-[#14e8e8] transition-colors duration-200"
          >
            Cotizar
          </a>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-cyan-accent/10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.anchor}
                  href={link.anchor}
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-[#0CC1C1] transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-5 py-3 rounded-full text-sm font-semibold bg-[#0CC1C1] text-black text-center"
              >
                Cotizar ahora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
