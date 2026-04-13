'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Bot,
  ArrowRight,
  Sparkles,
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

const VISIBLE_ROWS = 1;

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
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(REPORTS.length);

  const hasOverflow = REPORTS.length > visibleCount;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let rafId: number | null = null;
    const update = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cards = Array.from(grid.children) as HTMLElement[];
        if (!cards.length) { setMaxHeight(null); return; }
        const gridStyles = getComputedStyle(grid);
        const firstTop = cards[0].offsetTop;
        const columns = cards.reduce((c, card) => (Math.abs(card.offsetTop - firstTop) <= 1 ? c + 1 : c), 0) || 1;
        setVisibleCount(columns * VISIBLE_ROWS);
        const rowGap = parseFloat(gridStyles.rowGap || '0') || 0;
        const totalRows = Math.ceil(cards.length / columns);
        const visibleRows = Math.min(VISIBLE_ROWS, totalRows);
        const cardH = cards[0].offsetHeight;
        setMaxHeight(cardH * visibleRows + rowGap * Math.max(visibleRows - 1, 0));
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(grid);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); if (rafId !== null) cancelAnimationFrame(rafId); };
  }, []);

  return (
    <section
      id="special-report"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 scroll-mt-24"
    >
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={24} className="text-amber-400" />
          <h2 className="section-title mb-0">Special Reports</h2>
        </div>

        <div
          className={hasOverflow
            ? 'rounded-2xl border-2 border-amber-500/35 bg-amber-950/10 shadow-[0_0_0_1px_rgba(245,158,11,0.18),0_20px_45px_rgba(0,0,0,0.35)] p-2'
            : ''}
        >
          <div
            className={hasOverflow ? 'overflow-y-auto blog-scroll-container pr-1' : ''}
            style={hasOverflow && maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
          >
            <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {REPORTS.map((report, idx) => (
                <motion.div
                  key={report.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Link href={report.href} className="block group h-full">
                    <div className={`relative overflow-hidden rounded-2xl border ${report.borderColor} ${report.bgClass} h-full`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none" />

                      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">
                        {/* Badge + date */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[11px] font-bold tracking-wider uppercase ${report.badgeColor}`}>
                            {report.badge}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {lang === 'es' ? report.dateLine.es : report.dateLine.en}
                          </span>
                        </div>

                        {/* Title + description */}
                        <h3 className="text-lg sm:text-xl font-black leading-tight mb-2 special-report-title">
                          {lang === 'es' ? report.title.es : report.title.en}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                          {lang === 'es' ? report.description.es : report.description.en}
                        </p>

                        {/* KPIs */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {report.kpis.map((kpi, i) => {
                            const Icon = kpi.icon;
                            return (
                              <div key={i} className={`rounded-lg border p-2.5 ${kpi.bgColor} transition-all`}>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Icon size={12} className={kpi.color} />
                                  <span className={`text-lg font-black ${kpi.color}`}>{kpi.value}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 leading-tight block">
                                  {lang === 'es' ? kpi.labelEs : kpi.labelEn}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Sources + CTA */}
                        {report.sources && (
                          <p className="text-[10px] text-gray-600 mb-3">
                            {lang === 'es' ? report.sources.es : report.sources.en}
                          </p>
                        )}

                        <div className={`flex items-center gap-2 text-sm font-semibold ${report.accentColor} transition-colors`}>
                          <span>{lang === 'es' ? report.cta.es : report.cta.en}</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
