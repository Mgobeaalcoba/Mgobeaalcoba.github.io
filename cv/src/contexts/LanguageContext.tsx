'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  nav_portfolio: { es: 'Portfolio', en: 'Portfolio' },
  nav_consulting: { es: 'Consultoría', en: 'Consulting' },
  nav_blog: { es: 'Blog', en: 'Blog' },
  nav_recursos: { es: 'Recursos', en: 'Resources' },
  nav_contact: { es: 'Contacto', en: 'Contact' },
  hero_available: { es: 'Disponible para proyectos', en: 'Available for projects' },
  hero_cta_consulting: { es: 'Ver Consultoría', en: 'See Consulting' },
  hero_cta_download: { es: 'Descargar CV', en: 'Download CV' },
  about_title: { es: 'Sobre mí', en: 'About Me' },
  experience_title: { es: 'Experiencia Profesional', en: 'Professional Experience' },
  projects_title: { es: 'Proyectos Destacados', en: 'Featured Projects' },
  education_title: { es: 'Educación', en: 'Education' },
  certifications_title: { es: 'Certificaciones', en: 'Certifications' },
  skills_title: { es: 'Stack Tecnológico', en: 'Tech Stack' },
  contact_title: { es: 'Contacto', en: 'Contact' },
  view_repo: { es: 'Ver Repositorio', en: 'View Repository' },
  see_more: { es: 'Ver más', en: 'See more' },
  filter_all: { es: 'Todos', en: 'All' },
  load_more: { es: 'Ver más proyectos', en: 'Load more projects' },
  footer_design: { es: 'Diseñado con', en: 'Designed with' },
  footer_location: { es: 'en Buenos Aires', en: 'in Buenos Aires' },
  consulting_hero_title: { es: 'Tecnología que impulsa tu negocio', en: 'Technology that drives your business' },
  consulting_hero_sub: { es: 'Automatización IA y Business Intelligence para PyMEs', en: 'AI Automation and Business Intelligence for SMEs' },
  consulting_cta: { es: 'Diagnóstico Gratuito', en: 'Free Diagnosis' },
  consulting_services_title: { es: 'Nuestros Packs', en: 'Our Packs' },
  consulting_examples_title: { es: 'Casos de Éxito', en: 'Case Studies' },
  consulting_process_title: { es: 'Nuestro Proceso', en: 'Our Process' },
  consulting_contact_title: { es: 'Agendá tu diagnóstico', en: 'Schedule your diagnosis' },
  blog_title: { es: 'Blog Técnico', en: 'Technical Blog' },
  blog_subtitle: { es: 'Data Engineering en las Trincheras', en: 'Data Engineering in the Trenches' },
  blog_read_more: { es: 'Leer más', en: 'Read more' },
  blog_videos_title: { es: 'Videos & Masterclasses', en: 'Videos & Masterclasses' },
  blog_filter_all: { es: 'Todos', en: 'All' },
  recursos_title: { es: 'Recursos Útiles', en: 'Useful Resources' },
  recursos_subtitle: { es: 'Herramientas financieras y calculadoras para Argentina', en: 'Financial tools and calculators for Argentina' },
  recursos_tab_calculator: { es: 'Calculadora Ganancias', en: 'Income Tax Calculator' },
  recursos_tab_salary: { es: 'Simulador Sueldo', en: 'Salary Simulator' },
  recursos_tab_dashboard: { es: 'Dashboard Inversiones', en: 'Investment Dashboard' },
  recursos_tab_rates: { es: 'Cotizaciones', en: 'Exchange Rates' },
  recursos_calc_btn: { es: 'Calcular', en: 'Calculate' },
  recursos_result_tax: { es: 'Impuesto estimado', en: 'Estimated tax' },
  recursos_salary_gross: { es: 'Sueldo Bruto', en: 'Gross Salary' },
  recursos_salary_net: { es: 'Sueldo Neto', en: 'Net Salary' },
  recursos_salary_deductions: { es: 'Deducciones', en: 'Deductions' },
  recursos_rates_official: { es: 'Dólar Oficial', en: 'Official Dollar' },
  recursos_rates_blue: { es: 'Dólar Blue', en: 'Blue Dollar' },
  recursos_rates_mep: { es: 'Dólar MEP', en: 'MEP Dollar' },
  recursos_rates_ccl: { es: 'Dólar CCL', en: 'CCL Dollar' },
  recursos_loading: { es: 'Cargando...', en: 'Loading...' },
  recursos_error: { es: 'Error al cargar datos', en: 'Error loading data' },
  newsletter_title: { es: 'The Data Digest', en: 'The Data Digest' },
  newsletter_sub: { es: 'Data + Finanzas Argentina, cada semana', en: 'Data + Argentina Finance, every week' },
  newsletter_btn: { es: 'Suscribirse gratis', en: 'Subscribe free' },
  newsletter_placeholder: { es: 'tu@email.com', en: 'your@email.com' },
  terminal_welcome: { es: 'Bienvenido a mi CV interactivo. Escribe "help" para ver los comandos.', en: 'Welcome to my interactive CV. Type "help" to see commands.' },
  terminal_help: { es: 'Comandos: about, experience, education, projects [--tag <tech>], contact, neofetch, matrix, clear, gui', en: 'Commands: about, experience, education, projects [--tag <tech>], contact, neofetch, matrix, clear, gui' },
  terminal_not_found: { es: 'bash: command not found: {cmd}', en: 'bash: command not found: {cmd}' },
  contact_send: { es: 'Enviar mensaje', en: 'Send message' },
  contact_name: { es: 'Nombre', en: 'Name' },
  contact_email: { es: 'Email', en: 'Email' },
  contact_message: { es: 'Mensaje', en: 'Message' },
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'en' || saved === 'es') {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem('language', l);
    document.documentElement.lang = l;
  }

  function t(key: string): string {
    return translations[key]?.[lang] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
