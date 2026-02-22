'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Trophy, Calendar, ArrowRight, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CalendlyButton from '@/components/shared/CalendlyButton';

const TYPING_WORDS = [
  'Automatización de Procesos',
  'Inteligencia Artificial',
  'Business Intelligence',
  'Mentorías Tech',
  'Cursos para Equipos',
  'Reclutamiento Tech',
  'Transformación Digital',
  'ROI en semanas',
];

const TYPING_WORDS_EN = [
  'Process Automation',
  'Artificial Intelligence',
  'Business Intelligence',
  'Tech Mentoring',
  'Team Courses',
  'Tech Recruiting',
  'Digital Transformation',
  'ROI in weeks',
];

interface ConsultingHeroProps {
  onOpenProposal?: () => void;
}

export default function ConsultingHero({ onOpenProposal }: ConsultingHeroProps) {
  const { lang } = useLanguage();
  const [typingText, setTypingText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = lang === 'es' ? TYPING_WORDS : TYPING_WORDS_EN;

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const delay = isDeleting ? 50 : charIndex === currentWord.length ? 1800 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setTypingText(currentWord.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setTypingText(currentWord.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setWordIndex((w) => (w + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typingText, charIndex, isDeleting, wordIndex, words]);

  const STATS = [
    { value: '−80%', label: { es: 'Reducción de costos', en: 'Cost reduction' } },
    { value: '×3', label: { es: 'ROI promedio', en: 'Average ROI' } },
    { value: '$0', label: { es: '1ª automatización', en: '1st automation' } },
    { value: '6+', label: { es: 'Años MercadoLibre', en: 'Years at MercadoLibre' } },
  ];

  const TRUST_BADGES = [
    { icon: Building2, text: { es: '6 años MercadoLibre', en: '6 years at MercadoLibre' } },
    { icon: GraduationCap, text: { es: 'Docente Henry & UADE', en: 'Teacher at Henry & UADE' } },
    { icon: Trophy, text: { es: '15+ proyectos exitosos', en: '15+ successful projects' } },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black mb-4 leading-tight">
            <span className="gradient-text">
              {lang === 'es'
                ? 'Consultoría Tech 360°'
                : 'Tech Consulting 360°'}
            </span>
            <br />
            <span className="text-gray-100">
              {lang === 'es'
                ? 'para Empresas y Profesionales'
                : 'for Businesses and Professionals'}
            </span>
          </h1>

          <p className="text-sky-400 text-xl mb-2 font-medium">
            {lang === 'es'
              ? 'Automatización • IA Aplicada • Business Intelligence • Mentorías • Cursos • Recruiting Tech'
              : 'Automation • Applied AI • Business Intelligence • Mentoring • Courses • Tech Recruiting'}
          </p>

          <div className="h-10 flex items-center justify-center mb-4">
            <span className="text-lg text-gray-300">
              {typingText}
              <span className="inline-block w-0.5 h-5 bg-sky-400 ml-0.5 animate-pulse" />
            </span>
          </div>

          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-8">
            {lang === 'es'
              ? 'Transforme su negocio con tecnología y desarrolle talento tech de clase mundial. Desde automatización de procesos hasta reclutamiento especializado.'
              : 'Transform your business with technology and develop world-class tech talent. From process automation to specialized recruiting.'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {STATS.map((stat) => (
              <div key={stat.value} className="glass rounded-xl px-6 py-4 text-center glow-border">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label[lang]}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a
              href="#servicios"
              className="flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:scale-105"
            >
              <ArrowRight size={18} />
              {lang === 'es' ? 'Ver Todos los Servicios' : 'View All Services'}
            </a>
            {onOpenProposal && (
              <button
                onClick={onOpenProposal}
                className="flex items-center gap-2 px-8 py-4 glass border-2 border-green-400/50 text-green-400 rounded-xl font-semibold hover:bg-green-400/10 transition-all"
              >
                <Gift size={18} />
                {lang === 'es' ? 'Automatización Gratis' : 'Free Automation'}
              </button>
            )}
            <CalendlyButton className="flex items-center gap-2 px-8 py-4 glass border border-sky-500/30 text-sky-400 rounded-xl font-semibold hover:bg-sky-500/10 transition-all">
              <Calendar size={18} />
              {lang === 'es' ? 'Agendar Consulta' : 'Schedule a Call'}
            </CalendlyButton>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.text.es} className="flex items-center gap-2">
                <badge.icon size={16} className="text-sky-400" />
                <span>{badge.text[lang]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
