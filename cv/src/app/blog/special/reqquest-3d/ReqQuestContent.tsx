'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, CheckCircle, Gamepad2, GraduationCap, Brain, Zap, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ReqQuestModal from '@/components/cv/ReqQuestModal';

const GAME_URL = 'https://mgobeaalcoba.github.io/ing_req_game.html';

function Section({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/25 shrink-0">
          <Icon size={16} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold report-heading">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-6 mb-6 ${className}`}>{children}</div>;
}

export default function ReqQuestContent() {
  const { lang } = useLanguage();
  const [gameOpen, setGameOpen] = useState(false);
  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'page_view', {
        page_title: 'Special Report: ReqQuest 3D — Gamification',
        page_location: window.location.href,
        content_group: 'Special Report',
        content_type: 'interactive-game',
      });
    }
  }, []);

  return (
    <div className="pt-28 pb-12">
      {/* Hero */}
      <section className="report-hero border-b border-white/10 px-4 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase mb-5">
            Special Report · {t('Educación & IA', 'Education & AI')}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎮 {t('Gamificación: El Futuro del Aprendizaje', 'Gamification: The Future of Learning')}
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            {t(
              'Revolucionando la educación en la era de la IA. Un juego 3D interactivo para aprender Ingeniería de Requerimientos donde el aula es una oficina virtual y el examen es una aventura.',
              'Revolutionizing education in the AI era. A 3D interactive game for learning Requirements Engineering where the classroom is a virtual office and the exam is an adventure.'
            )}
          </p>

          {/* Game feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { emoji: '🕵️‍♂️', label: t('Rol de Analista', 'Analyst Role') },
              { emoji: '🏢', label: t('Oficina 3D', '3D Office') },
              { emoji: '🎓', label: t('13 Desafíos', '13 Challenges') },
              { emoji: '⚡', label: t('Feedback Inmediato', 'Instant Feedback') },
            ].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs">
                {p.emoji} {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-10 transition-colors">
          <ArrowLeft size={14} />
          {t('Volver al Blog', 'Back to Blog')}
        </Link>

        {/* Play CTA */}
        <Card className="border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none" />
          <div className="relative z-10 text-center">
            <h3 className="text-lg font-bold report-heading mb-2">ReqQuest 3D: Office Edition</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-lg mx-auto">
              {t(
                'Practicá Ingeniería de Requerimientos explorando una oficina 3D y resolviendo desafíos con stakeholders. Sin slides, sin memorización — solo práctica y aprendizaje natural.',
                'Practice Requirements Engineering exploring a 3D office and solving challenges with stakeholders. No slides, no memorization — just practice and natural learning.'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setGameOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm"
              >
                <Gamepad2 size={18} />
                {t('Jugar Ahora', 'Play Now')}
              </button>
              <a
                href={GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-all text-sm"
              >
                {t('Abrir en nueva pestaña', 'Open in new tab')} ↗
              </a>
            </div>
          </div>
        </Card>

        {/* Context */}
        <Section icon={GraduationCap} title={t('El Problema', 'The Problem')} subtitle={t('La educación no cambió desde 1900', 'Education hasn\'t changed since 1900')}>
          <Card>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t(
                'Como docente en Soy Henry y la Universidad Argentina de la Empresa (UADE), he observado un contraste fascinante: mientras el mundo ha cambiado radicalmente desde 1900, nuestros métodos educativos permanecen prácticamente intactos. Clases magistrales, memorización, evaluaciones estandarizadas... el modelo sigue siendo el mismo.',
                'As an instructor at Soy Henry and the Argentine University of Enterprise (UADE), I\'ve observed a fascinating contrast: while the world has changed radically since 1900, our educational methods remain virtually unchanged. Lectures, memorization, standardized exams... the model is the same.'
              )}
            </p>
            <div className="rounded-xl border-l-[3px] border-indigo-500 bg-indigo-500/5 px-5 py-4">
              <h4 className="text-sm font-bold text-indigo-400 mb-2">
                {t('Learning by Playing: Una Visión Diferente', 'Learning by Playing: A Different Vision')}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t(
                  'La inteligencia artificial no solo nos permite automatizar tareas; nos da la oportunidad de reimaginar completamente cómo aprendemos. El concepto de gamificación y aprendizaje experiencial no es nuevo, pero la IA lo hace escalable, personalizable y medible de formas antes imposibles.',
                  'Artificial intelligence doesn\'t just let us automate tasks; it gives us the opportunity to completely reimagine how we learn. Gamification and experiential learning are not new concepts, but AI makes them scalable, personalizable, and measurable in previously impossible ways.'
                )}
              </p>
            </div>
          </Card>
        </Section>

        {/* Why it matters */}
        <Section icon={Brain} title={t('¿Por Qué Importa?', 'Why Does It Matter?')} subtitle={t('Engagement, retención y feedback', 'Engagement, retention and feedback')}>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: 'Engagement',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                desc: t(
                  'Un estudiante jugando aprende sin darse cuenta, motivado por la curiosidad y el desafío, no por la nota.',
                  'A student who is playing learns without realizing it, motivated by curiosity and challenge, not by grades.'
                ),
              },
              {
                icon: Target,
                title: t('Retención', 'Retention'),
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                desc: t(
                  'La práctica activa en contextos realistas genera memoria a largo plazo, no solo para el examen.',
                  'Active practice in realistic contexts creates long-term memory, not just exam preparation.'
                ),
              },
              {
                icon: CheckCircle,
                title: 'Feedback',
                color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
                desc: t(
                  'Los juegos enseñan por iteración: fallas, entendés por qué, y volvés a intentarlo al instante.',
                  'Games teach through iteration: you fail, understand why, and try again instantly.'
                ),
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`rounded-xl border p-5 ${item.color}`}>
                  <Icon size={20} className="mb-3" />
                  <h4 className="text-sm font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* The Game */}
        <Section icon={Gamepad2} title={t('El Juego: ReqQuest 3D', 'The Game: ReqQuest 3D')} subtitle={t('Ingeniería de Requerimientos gamificada', 'Gamified Requirements Engineering')}>
          <Card>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t(
                'Un juego interactivo en 3D donde practicás conceptos de Ingeniería de Requerimientos mientras explorás una oficina virtual y resolvés desafíos con diferentes stakeholders. No hay slides. No hay memorización. Solo práctica, decisiones y aprendizaje natural.',
                'A 3D interactive game where you practice Requirements Engineering concepts while exploring a virtual office and solving challenges with different stakeholders. No slides. No memorization. Just practice, decisions, and natural learning.'
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { emoji: '🕵️‍♂️', title: t('Rol de Analista', 'Analyst Role'), sub: t('Asumís el rol de un analista de requerimientos recién contratado', 'You take the role of a newly hired requirements analyst') },
                { emoji: '🏢', title: t('Oficina 3D Interactiva', '3D Interactive Office'), sub: t('Explorá libremente un mundo virtual con múltiples áreas', 'Freely explore a virtual world with multiple areas') },
                { emoji: '🎓', title: t('13 Desafíos Progresivos', '13 Progressive Challenges'), sub: t('Desde elicitación hasta validación, cada desafío escala en complejidad', 'From elicitation to validation, each challenge scales in complexity') },
              ].map((card, i) => (
                <div key={i} className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-4xl mb-3">{card.emoji}</div>
                  <div className="text-sm font-semibold report-heading mb-1">{card.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{card.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setGameOpen(true)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Gamepad2 size={18} />
              {t('Jugar Ahora', 'Play Now')}
            </button>
          </Card>
        </Section>

        {/* Educator note */}
        <Section icon={Users} title={t('Mi Contribución', 'My Contribution')} subtitle={t('Desde la docencia', 'From teaching')}>
          <Card className="report-conclusion-card border-indigo-500/25">
            <p className="text-sm text-gray-400 leading-relaxed italic">
              {t(
                'Esta es mi contribución desde la docencia: experimentar con nuevas formas de enseñar para un mundo que ya no es el de 1900. La IA generativa nos permite crear experiencias de aprendizaje que antes requerían equipos enteros de desarrollo. Un solo docente con las herramientas adecuadas puede revolucionar cómo sus estudiantes aprenden.',
                'This is my contribution as an educator: experimenting with new ways of teaching for a world that is no longer the one of 1900. Generative AI allows us to create learning experiences that previously required entire development teams. A single teacher with the right tools can revolutionize how students learn.'
              )}
            </p>
          </Card>
        </Section>

        {/* Bottom nav */}
        <div className="text-center mt-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            <ArrowLeft size={16} />
            {t('Volver al Blog', 'Back to Blog')}
          </Link>
        </div>
      </div>

      <ReqQuestModal isOpen={gameOpen} onClose={() => setGameOpen(false)} />
    </div>
  );
}
