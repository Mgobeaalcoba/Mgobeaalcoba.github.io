'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, BookOpen, Briefcase, Calculator, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PAGES = [
  {
    href: '/',
    icon: Home,
    label: { es: 'Portfolio', en: 'Portfolio' },
    desc: { es: 'Experiencia, proyectos y certificaciones', en: 'Experience, projects and certifications' },
    accent: 'sky',
  },
  {
    href: '/consulting/',
    icon: Briefcase,
    label: { es: 'Consultoría', en: 'Consulting' },
    desc: { es: 'Automatización e IA para tu empresa', en: 'Automation and AI for your business' },
    accent: 'violet',
  },
  {
    href: '/blog/',
    icon: BookOpen,
    label: { es: 'Blog', en: 'Blog' },
    desc: { es: 'Data Engineering en las Trincheras', en: 'Data Engineering in the Trenches' },
    accent: 'emerald',
  },
  {
    href: '/recursos/',
    icon: Calculator,
    label: { es: 'Recursos', en: 'Resources' },
    desc: { es: 'Calculadoras y cotizaciones financieras', en: 'Financial calculators and quotes' },
    accent: 'amber',
  },
];

const ACCENT_CLASSES: Record<string, { border: string; icon: string; hover: string }> = {
  sky:     { border: 'border-sky-500/30',    icon: 'text-sky-400',    hover: 'hover:border-sky-500/60 hover:bg-sky-500/5' },
  violet:  { border: 'border-violet-500/30', icon: 'text-violet-400', hover: 'hover:border-violet-500/60 hover:bg-violet-500/5' },
  emerald: { border: 'border-emerald-500/30',icon: 'text-emerald-400',hover: 'hover:border-emerald-500/60 hover:bg-emerald-500/5' },
  amber:   { border: 'border-amber-500/30',  icon: 'text-amber-400',  hover: 'hover:border-amber-500/60 hover:bg-amber-500/5' },
};

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-8xl sm:text-9xl font-black gradient-text leading-none select-none">
          404
        </p>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-12 max-w-lg"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3">
          {lang === 'es' ? 'Página no encontrada' : 'Page not found'}
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          {lang === 'es'
            ? 'La dirección que buscás no existe o fue movida. Podés ir a cualquiera de estas secciones:'
            : "The address you're looking for doesn't exist or has been moved. You can navigate to any of these sections:"}
        </p>
      </motion.div>

      {/* Page cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10"
      >
        {PAGES.map((page) => {
          const Icon = page.icon;
          const ac = ACCENT_CLASSES[page.accent];
          return (
            <Link
              key={page.href}
              href={page.href}
              className={`glass border ${ac.border} ${ac.hover} rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 group`}
            >
              <div className={`mt-0.5 ${ac.icon} shrink-0`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-100 group-hover:text-white transition-colors">
                  {page.label[lang]}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">{page.desc[lang]}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <button
          onClick={() => history.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft size={14} />
          {lang === 'es' ? 'Volver a la página anterior' : 'Go back to the previous page'}
        </button>
      </motion.div>
    </main>
  );
}
