'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AboutConsultingProps {
  onOpenProposal?: () => void;
}

const METRICS = [
  { value: '6+', label: { es: 'Años en MercadoLibre', en: 'Years at MercadoLibre' } },
  { value: '$500K+', label: { es: 'Procesados', en: 'Processed' } },
  { value: '80%', label: { es: 'Reducción de costos', en: 'Cost reduction' } },
  { value: '15+', label: { es: 'Proyectos exitosos', en: 'Successful projects' } },
];

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 40);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutConsulting({ onOpenProposal }: AboutConsultingProps) {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-8 md:p-12 glow-border"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Photo + Metrics */}
          <div className="text-center md:text-left">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sky-500/30 mx-auto md:mx-0">
                <Image
                  src="/images/profile.png"
                  alt="Mariano Gobea Alcoba"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                MercadoLibre
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              Mariano Gobea Alcoba
            </h2>
            <p className="text-sky-400 font-medium mb-4">
              {lang === 'es' ? 'Data & Analytics Technical Leader' : 'Data & Analytics Technical Leader'}
            </p>

            {/* Animated Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {METRICS.map((m) => (
                <div key={m.value} className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black gradient-text">{m.value}</p>
                  <p className="text-xs text-gray-400">{m.label[lang]}</p>
                </div>
              ))}
            </div>

            {onOpenProposal && (
              <button
                onClick={onOpenProposal}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-all mx-auto md:mx-0"
              >
                <Gift size={18} />
                {lang === 'es' ? 'Solicitar Mi Automatización Gratis' : 'Request My Free Automation'}
              </button>
            )}
          </div>

          {/* Right: Description */}
          <div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {lang === 'es'
                ? 'Con 6+ años de experiencia en MercadoLibre como Technical Leader de Data & Analytics, pasé de ingeniero a líder de equipos de datos a escala. Fui docente en Henry Bootcamp y la Universidad UADE, formando a la próxima generación de profesionales tech.'
                : 'With 6+ years of experience at MercadoLibre as Data & Analytics Technical Leader, I went from engineer to data team leader at scale. I was a teacher at Henry Bootcamp and UADE University, training the next generation of tech professionals.'}
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              {lang === 'es'
                ? 'Hoy aplico ese expertise para ayudar a PyMEs y profesionales a transformar sus operaciones con tecnología de clase mundial, accesible y con ROI comprobado. Cada proyecto comienza con un diagnóstico gratuito para entender exactamente qué necesita tu negocio.'
                : 'Today I apply that expertise to help SMBs and professionals transform their operations with world-class technology, accessible and with proven ROI. Each project starts with a free diagnosis to understand exactly what your business needs.'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold text-sky-400 mb-1">🎓 Educación</p>
                <p className="text-xs text-gray-400">UBA / UAI / UADE</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold text-purple-400 mb-1">🏢 Experiencia</p>
                <p className="text-xs text-gray-400">MercadoLibre, Henry, UADE</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold text-green-400 mb-1">🛠 Stack</p>
                <p className="text-xs text-gray-400">Python, SQL, GenAI, n8n, BI</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-400 mb-1">📍 Ubicación</p>
                <p className="text-xs text-gray-400">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
