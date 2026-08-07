'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Bot,
  ArrowRight,
  Gamepad2,
  GraduationCap,
  Brain,
  Zap,
  Home,
  Landmark,
  Users,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportCard {
  href: string;
  badge: string;
  badgeColor: string;
  dateLine: { es: string; en: string };
  title: { es: string; en: string };
  description: { es: string; en: string };
  cta: { es: string; en: string };
  accentColor: string;
  borderColor: string;
  bgClass: string;
  kpis: {
    value: string;
    labelEs: string;
    labelEn: string;
    color: string;
    bgColor: string;
    icon: React.ElementType;
  }[];
  sources?: { es: string; en: string };
}

const REPORTS: ReportCard[] = [
  {
    href: '/blog/special/layoffs-genai',
    badge: 'Special Report',
    badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    dateLine: { es: 'Abril 2026 · Data-Driven', en: 'April 2026 · Data-Driven' },
    title: {
      es: 'Layoffs, Contratación & GenAI: El Gran Reajuste Laboral',
      en: 'Layoffs, Hiring & GenAI: The Great Labor Reset',
    },
    description: {
      es: 'Análisis 100% data-driven sobre despidos masivos en IT y sectores white collar, tendencias de contratación y su correlación con los hitos de la IA Generativa.',
      en: '100% data-driven analysis of massive IT and white collar layoffs, hiring trends, and their correlation with Generative AI milestones.',
    },
    cta: { es: 'Ver informe completo', en: 'View full report' },
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    borderColor: 'border-amber-500/30',
    bgClass: 'special-report-bg',
    kpis: [
      { value: '265K', labelEs: 'Pico layoffs tech 2023', labelEn: 'Peak tech layoffs 2023', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20', icon: TrendingDown },
      { value: '1.2M', labelEs: 'Anuncios despido 2025', labelEn: 'Layoff announcements 2025', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
      { value: '55K+', labelEs: 'Layoffs atribuidos a IA', labelEn: 'Layoffs attributed to AI', color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20', icon: Bot },
      { value: '+163%', labelEs: 'Roles AI/ML vs 2024', labelEn: 'AI/ML roles vs 2024', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', icon: TrendingUp },
    ],
    sources: {
      es: 'Fuentes: layoffs.fyi · Challenger, Gray & Christmas · Indeed Hiring Lab · WEF · Goldman Sachs · McKinsey',
      en: 'Sources: layoffs.fyi · Challenger, Gray & Christmas · Indeed Hiring Lab · WEF · Goldman Sachs · McKinsey',
    },
  },
  {
    href: '/blog/special/funnel-hipotecario-bna',
    badge: 'Special Report',
    badgeColor: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
    dateLine: { es: 'Abril 2026 · Data-Driven', en: 'April 2026 · Data-Driven' },
    title: {
      es: 'Funnel Hipotecario BNA: Del Sueño a la Escritura',
      en: 'BNA Mortgage Funnel: From Dream to Deed',
    },
    description: {
      es: 'Análisis del funnel de acceso al crédito hipotecario del Banco Nación Argentina. De 3.2M de familias con necesidad habitacional a ~33.700 créditos otorgados: dónde se caen y por qué.',
      en: 'Analysis of Banco Nación Argentina\'s mortgage access funnel. From 3.2M families with housing needs to ~33,700 loans granted: where they drop off and why.',
    },
    cta: { es: 'Ver informe completo', en: 'View full report' },
    accentColor: 'text-sky-400 group-hover:text-sky-300',
    borderColor: 'border-sky-500/30',
    bgClass: 'special-report-bg',
    kpis: [
      { value: '3.2M', labelEs: 'Déficit habitacional', labelEn: 'Housing deficit', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10 border-indigo-500/20', icon: Home },
      { value: '192K', labelEs: 'Solicitudes BNA', labelEn: 'BNA applications', color: 'text-sky-400', bgColor: 'bg-sky-500/10 border-sky-500/20', icon: Landmark },
      { value: '~17%', labelEs: 'Tasa de conversión', labelEn: 'Conversion rate', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', icon: BarChart3 },
      { value: '76%', labelEs: 'Market share BNA', labelEn: 'BNA market share', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', icon: Users },
    ],
    sources: {
      es: 'Fuentes: BCRA · BNA · INDEC · Col. Escribanos · Infobae · Ámbito · Cronista',
      en: 'Sources: BCRA · BNA · INDEC · Notary Assoc. · Infobae · Ámbito · Cronista',
    },
  },
  {
    href: '/blog/special/reqquest-3d',
    badge: 'Special Report',
    badgeColor: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    dateLine: { es: 'Abril 2026 · Interactivo', en: 'April 2026 · Interactive' },
    title: {
      es: 'Gamificación: El Futuro del Aprendizaje',
      en: 'Gamification: The Future of Learning',
    },
    description: {
      es: 'Un juego 3D interactivo para aprender Ingeniería de Requerimientos. Explorá una oficina virtual, resolvé desafíos con stakeholders y dominá conceptos de software sin memorizar.',
      en: 'A 3D interactive game for learning Requirements Engineering. Explore a virtual office, solve challenges with stakeholders and master software concepts without memorization.',
    },
    cta: { es: 'Ver y jugar', en: 'View & play' },
    accentColor: 'text-indigo-400 group-hover:text-indigo-300',
    borderColor: 'border-indigo-500/30',
    bgClass: 'special-report-bg',
    kpis: [
      { value: '3D', labelEs: 'Oficina interactiva', labelEn: 'Interactive office', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10 border-indigo-500/20', icon: Gamepad2 },
      { value: '13', labelEs: 'Desafíos progresivos', labelEn: 'Progressive challenges', color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/20', icon: GraduationCap },
      { value: 'IA', labelEs: 'Asistida por IA generativa', labelEn: 'Generative AI-assisted', color: 'text-sky-400', bgColor: 'bg-sky-500/10 border-sky-500/20', icon: Brain },
      { value: '∞', labelEs: 'Feedback inmediato', labelEn: 'Instant feedback', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', icon: Zap },
    ],
  },
];

export default function SpecialReportsSection() {
  const { lang } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="research" className="signal-blog-research scroll-mt-24">
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="signal-blog-section-heading"><div><span className="signal-eyebrow">03 / Research desk</span><h2>{lang === 'es' ? 'Investigaciones.' : 'Research.'}</h2></div><p>{lang === 'es' ? 'Informes data-driven y experiencias interactivas para entender sistemas complejos.' : 'Data-driven reports and interactive experiences for understanding complex systems.'}</p></div>
        <div className="signal-research-grid">
              {REPORTS.map((report, idx) => (
                <motion.div
                  key={report.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.15 }}
                  className={idx === 0 ? 'signal-research-card-wrap--featured' : ''}
                >
                  <Link href={report.href} className="signal-research-card group">
                    <div className="signal-research-card__meta"><span>REPORT / {String(idx + 1).padStart(2, '0')}</span><time>{lang === 'es' ? report.dateLine.es : report.dateLine.en}</time></div>
                    <div className="signal-research-card__content"><h3>{lang === 'es' ? report.title.es : report.title.en}</h3><p>{lang === 'es' ? report.description.es : report.description.en}</p></div>
                    <div className="signal-research-card__signal"><strong>{report.kpis[0].value}</strong><span>{lang === 'es' ? report.kpis[0].labelEs : report.kpis[0].labelEn}</span></div>
                    <div className="signal-research-card__footer"><span>{lang === 'es' ? report.cta.es : report.cta.en}</span><ArrowRight size={16} /></div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </motion.div>
    </section>
  );
}
