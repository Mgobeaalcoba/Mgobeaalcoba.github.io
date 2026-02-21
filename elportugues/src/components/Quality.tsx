'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle2 } from 'lucide-react';
import type { Quality as QualityData } from '@/types/content';

interface QualityProps {
  data: QualityData;
}

export default function Quality({ data }: QualityProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0CC1C1]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#0CC1C1]" />
              <span className="section-label">{data.sectionLabel}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              {data.title}
            </h2>

            <div className="flex flex-col gap-6">
              {data.commitments.map((commitment, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 size={20} className="text-[#0CC1C1] flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-relaxed text-sm">{commitment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: ISO Cert display */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Main cert */}
            <div className="relative glass rounded-2xl p-8 w-full max-w-sm mx-auto text-center border border-[#0CC1C1]/30 shadow-xl shadow-cyan-accent/10">
              <Award size={48} className="text-[#0CC1C1] mx-auto mb-4" />
              <div className="text-3xl font-black gradient-text mb-2">ISO 9001:2015</div>
              <div className="text-slate-400 text-sm">Certificación de Calidad</div>
              <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                Transporte El Portugués Logística y Distribución S.A. certifica sus procesos de almacenamiento y transporte de alimentos
              </div>
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none" />
            </div>

            {/* Cert images */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {data.certImages.map((src, i) => (
                <div key={i} className="glass rounded-xl overflow-hidden aspect-square p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Certificación ISO ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>

            {/* System image */}
            <div className="glass rounded-xl overflow-hidden w-full max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.systemImage} alt="Sistema de Gestión de Calidad" className="w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
