'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

export default function Gamification() {
  const { lang } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-2 pb-2 border-b border-white/10">
          🎮 {lang === 'es' ? 'Gamificación: El Futuro del Aprendizaje' : 'Gamification: The Future of Learning'}
        </h2>
        <p className="text-sm text-gray-400 italic mb-4">
          {lang === 'es' ? 'Revolucionando la Educación en la Era de la IA' : 'Revolutionizing Education in the AI Era'}
        </p>

        {/* Context */}
        <p className="text-gray-400 leading-relaxed mb-4">
          {lang === 'es'
            ? 'Como docente en Soy Henry y la Universidad Argentina de la Empresa (UADE), he observado un contraste fascinante: mientras el mundo ha cambiado radicalmente desde 1900, nuestros métodos educativos permanecen prácticamente intactos. Clases magistrales, memorización, evaluaciones estandarizadas... el modelo sigue siendo el mismo.'
            : 'As an instructor at Soy Henry and the Argentine University of Enterprise (UADE), I\'ve observed a fascinating contrast: while the world has changed radically since 1900, our educational methods remain virtually unchanged. Lectures, memorization, standardized exams... the model is the same.'}
        </p>

        {/* Vision */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-4 mb-4 border-l-4 border-indigo-500">
          <h3 className="font-semibold text-lg mb-2">
            {lang === 'es' ? 'Learning by Playing: Una Visión Diferente' : 'Learning by Playing: A Different Vision'}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {lang === 'es'
              ? 'La inteligencia artificial no solo nos permite automatizar tareas; nos da la oportunidad de reimaginar completamente cómo aprendemos. El concepto de gamificación y aprendizaje experiencial no es nuevo, pero la IA lo hace escalable, personalizable y medible de formas antes imposibles.'
              : 'Artificial intelligence doesn\'t just let us automate tasks; it gives us the opportunity to completely reimagine how we learn. Gamification and experiential learning are not new concepts, but AI makes them scalable, personalizable, and measurable in previously impossible ways.'}
          </p>
        </div>

        {/* Why it matters */}
        <h3 className="font-semibold mb-3">
          {lang === 'es' ? '¿Por Qué Importa Esto?' : 'Why Does This Matter?'}
        </h3>
        <ul className="space-y-2 mb-4 text-sm text-gray-400">
          {[
            {
              es: '<strong>Engagement:</strong> Un estudiante jugando aprende sin darse cuenta, motivado por la curiosidad y el desafío, no por la nota.',
              en: '<strong>Engagement:</strong> A student who is playing learns without realizing it, motivated by curiosity and challenge, not by grades.',
            },
            {
              es: '<strong>Retención:</strong> La práctica activa en contextos realistas genera memoria a largo plazo, no solo para el examen.',
              en: '<strong>Retention:</strong> Active practice in realistic contexts creates long-term memory, not just exam preparation.',
            },
            {
              es: '<strong>Feedback Inmediato:</strong> Los juegos enseñan por iteración: fallas, entiendes por qué, y vuelves a intentarlo al instante.',
              en: '<strong>Immediate Feedback:</strong> Games teach through iteration: you fail, understand why, and try again instantly.',
            },
          ].map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: lang === 'es' ? point.es : point.en }} />
            </li>
          ))}
        </ul>

        {/* Game example */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-gray-400 leading-relaxed mb-2">
            {lang === 'es'
              ? 'Como ejemplo de esta filosofía, desarrollé ReqQuest 3D: Office Edition:'
              : 'As an example of this philosophy, I developed ReqQuest 3D: Office Edition:'}
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            {lang === 'es'
              ? 'Un juego interactivo en 3D donde practicás conceptos de Ingeniería de Requerimientos mientras explorás una oficina virtual y resolvés desafíos con diferentes stakeholders. No hay slides. No hay memorización. Solo práctica, decisiones y aprendizaje natural.'
              : 'A 3D interactive game where you practice Requirements Engineering concepts while exploring a virtual office and solving challenges with different stakeholders. No slides. No memorization. Just practice, decisions, and natural learning.'}
          </p>

          {/* Game feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { emoji: '🕵️‍♂️', title: lang === 'es' ? 'Rol de Analista' : 'Analyst Role', sub: lang === 'es' ? 'Resuelve desafíos' : 'Solve challenges' },
              { emoji: '🏢', title: lang === 'es' ? 'Oficina 3D' : '3D Office', sub: lang === 'es' ? 'Mundo interactivo' : 'Interactive world' },
              { emoji: '🎓', title: lang === 'es' ? '13 Desafíos' : '13 Challenges', sub: lang === 'es' ? 'Aprendizaje práctico' : 'Hands-on learning' },
            ].map((card, i) => (
              <div key={i} className="text-center p-3 bg-gray-800/30 rounded-lg">
                <div className="text-3xl mb-2">{card.emoji}</div>
                <div className="text-sm font-medium">{card.title}</div>
                <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>

          <a
            href="https://mgobeaalcoba.github.io/ing_req_game.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🎮 {lang === 'es' ? 'Jugar Ahora' : 'Play Now'}
          </a>

          <p className="text-xs text-gray-500 italic text-center mt-3">
            {lang === 'es'
              ? 'Esta es mi contribución desde la docencia: experimentar con nuevas formas de enseñar para un mundo que ya no es el de 1900.'
              : 'This is my contribution as an educator: experimenting with new ways of teaching for a world that is no longer the one of 1900.'}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
