'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Building2, GraduationCap, Trophy, Calendar, ArrowRight, Gift, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
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

// Fixed positions — avoids hydration mismatch with Math.random()
const PARTICLES = [
  { left: '6%',  top: '18%', size: 2,   dur: 4.2, delay: 0   },
  { left: '20%', top: '70%', size: 1.5, dur: 3.1, delay: 0.7 },
  { left: '35%', top: '28%', size: 3,   dur: 5.0, delay: 1.2 },
  { left: '52%', top: '82%', size: 1,   dur: 3.8, delay: 0.3 },
  { left: '65%', top: '22%', size: 2.5, dur: 4.5, delay: 1.8 },
  { left: '78%', top: '58%', size: 1.5, dur: 3.3, delay: 0.9 },
  { left: '88%', top: '38%', size: 2,   dur: 4.8, delay: 2.1 },
  { left: '12%', top: '52%', size: 1,   dur: 3.6, delay: 1.5 },
  { left: '44%', top: '12%', size: 2,   dur: 5.2, delay: 0.4 },
  { left: '81%', top: '78%', size: 1.5, dur: 4.0, delay: 1.1 },
  { left: '29%', top: '88%', size: 1,   dur: 3.5, delay: 2.5 },
  { left: '70%', top: '44%', size: 2.5, dur: 4.3, delay: 0.6 },
];

interface ConsultingHeroProps {
  onOpenProposal?: () => void;
}

// Per-theme visual config — background matches the page bg of each mode
const THEME_CONFIG = {
  dark: {
    bgGradient:  'linear-gradient(to bottom, #020617, #0f172a, #111827)',
    topGlow:     'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(56,189,248,0.12) 0%, transparent 60%)',
    bottomFade:  'linear-gradient(to top, #111827, transparent)',
    gridColor:   'rgba(56,189,248,0.10)',
    glowBg:      'radial-gradient(circle, rgba(56,189,248,0.13) 0%, transparent 70%)',
    rocketClass: 'text-sky-400 drop-shadow-[0_0_28px_rgba(56,189,248,0.65)]',
    bloomBg:     'radial-gradient(circle, rgba(251,146,60,0.55) 0%, transparent 70%)',
    particle:    'bg-sky-400',
  },
  light: {
    bgGradient:  'linear-gradient(to bottom, #f8fafc, #f1f5f9, #f3f4f6)',
    topGlow:     'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(14,165,233,0.10) 0%, transparent 60%)',
    bottomFade:  'linear-gradient(to top, #f3f4f6, transparent)',
    gridColor:   'rgba(2,132,199,0.09)',
    glowBg:      'radial-gradient(circle, rgba(2,132,199,0.09) 0%, transparent 70%)',
    rocketClass: 'text-sky-600 drop-shadow-[0_0_28px_rgba(2,132,199,0.45)]',
    bloomBg:     'radial-gradient(circle, rgba(251,146,60,0.40) 0%, transparent 70%)',
    particle:    'bg-sky-500',
  },
  terminal: {
    bgGradient:  'linear-gradient(to bottom, #000000, #040d04, #0a0a0a)',
    topGlow:     'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(0,255,0,0.09) 0%, transparent 60%)',
    bottomFade:  'linear-gradient(to top, #0a0a0a, transparent)',
    gridColor:   'rgba(0,255,0,0.08)',
    glowBg:      'radial-gradient(circle, rgba(0,255,0,0.10) 0%, transparent 70%)',
    rocketClass: 'text-green-400 drop-shadow-[0_0_28px_rgba(0,255,0,0.65)]',
    bloomBg:     'radial-gradient(circle, rgba(0,200,0,0.40) 0%, transparent 70%)',
    particle:    'bg-green-400',
  },
} as const;

export default function ConsultingHero({ onOpenProposal }: ConsultingHeroProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const tc = THEME_CONFIG[theme];
  const [typingText, setTypingText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Scroll parallax
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY       = useTransform(scrollYProgress, [0, 1],                  ['0%', '30%']);
  const gridY     = useTransform(scrollYProgress, [0, 1],                  ['0%', '15%']);
  // Vertical launch: bottom → top
  const rocketY   = useTransform(scrollYProgress, [0, 0.55],               ['30px', '-310px']);
  // Fades in when scrolling starts (launch visible), disappears at top
  const rocketOpa = useTransform(scrollYProgress, [0, 0.06, 0.42, 0.55],  [0.18, 0.82, 0.82, 0]);
  // Fire trail goes downward — grows as rocket accelerates
  const trailH    = useTransform(scrollYProgress, [0, 0.05, 0.48],         [0, 80, 260]);
  const trailOpa  = useTransform(scrollYProgress, [0, 0.05, 0.42, 0.55],  [0, 1, 1, 0]);

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
    { value: '×3',   label: { es: 'ROI promedio',         en: 'Average ROI' } },
    { value: '$0',   label: { es: '1ª automatización',    en: '1st automation' } },
    { value: '6+',   label: { es: 'Años MercadoLibre',    en: 'Years at MercadoLibre' } },
  ];

  const TRUST_BADGES = [
    { icon: Building2,     text: { es: '6 años MercadoLibre',    en: '6 years at MercadoLibre' } },
    { icon: GraduationCap, text: { es: 'Docente Henry & UADE',   en: 'Teacher at Henry & UADE' } },
    { icon: Trophy,        text: { es: '15+ proyectos exitosos', en: '15+ successful projects' } },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* ── Layer 1: Background with parallax — color matches current theme ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0" style={{ background: tc.bgGradient }} />
        {/* Top glow */}
        <div className="absolute inset-0" style={{ background: tc.topGlow }} />
        {/* Bottom fade — blends seamlessly into page bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28"
          style={{ background: tc.bottomFade }}
        />
      </motion.div>

      {/* ── Layer 2: Perspective grid ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: gridY }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${tc.gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${tc.gridColor} 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 85% 75% at 50% 35%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 75% at 50% 35%, black 20%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* ── Layer 3: Rocket + downward fire trail (real launch) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Scroll-driven vertical lift */}
        <motion.div
          className="flex flex-col items-center"
          style={{ y: rocketY, opacity: rocketOpa }}
        >
          {/* Glow halo behind rocket — color matches theme accent */}
          <div
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: tc.glowBg,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          {/* Rocket icon — gentle float at rest, rotated to point upward */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ rotate: -45 }}
          >
            <Rocket
              size={116}
              strokeWidth={1.1}
              className={tc.rocketClass}
            />
          </motion.div>

          {/*
            Fire trail — goes DOWNWARD from the engine (real rocket launch).
            Gradient: white-hot core at top → orange → red → transparent at bottom.
          */}
          <motion.div
            style={{
              width: 18,
              height: trailH,
              borderRadius: '999px',
              marginTop: -6,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(251,191,36,0.88), rgba(251,146,60,0.70), rgba(239,68,68,0.40), transparent)',
              opacity: trailOpa,
            }}
          />

          {/* Engine bloom — flickers during flight, color adapts to theme */}
          <motion.div
            style={{
              position: 'absolute',
              top: '62%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: tc.bloomBg,
              opacity: trailOpa,
            }}
            animate={{ scale: [1, 1.25, 0.9, 1.15, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* ── Layer 4: Ambient particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${tc.particle}`}
            style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
            animate={{ y: [0, -24, 0], opacity: [0, 0.5, 0] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Layer 5: Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black mb-4 leading-tight">
            <span className="gradient-text">
              {lang === 'es' ? 'Consultoría Tech 360°' : 'Tech Consulting 360°'}
            </span>
            <br />
            <span className="text-white">
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

          <p className="text-gray-300 text-base max-w-2xl mx-auto mb-8">
            {lang === 'es'
              ? 'Transforme su negocio con tecnología y desarrolle talento tech de clase mundial. Desde automatización de procesos hasta reclutamiento especializado.'
              : 'Transform your business with technology and develop world-class tech talent. From process automation to specialized recruiting.'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="glass rounded-xl px-6 py-4 text-center glow-border"
              >
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-300 mt-1">{stat.label[lang]}</div>
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
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-300">
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
