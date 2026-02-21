'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { About as AboutData } from '@/types/content';

interface AboutProps {
  data: AboutData;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function About({ data }: AboutProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="nosotros" ref={ref} className="py-24 bg-[#0B1120] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(12,193,193,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,193,193,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.image}
                alt={data.imageAlt}
                className="w-full h-[480px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 glass rounded-xl px-4 py-3">
                <div className="text-2xl font-black gradient-text">80+</div>
                <div className="text-xs text-slate-400">Años de experiencia</div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full bg-[#0CC1C1]/10 blur-3xl pointer-events-none" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#0CC1C1]" />
              <span className="section-label">{data.sectionLabel}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {data.title}
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              {data.description}
            </p>

            {/* Pillars */}
            <div className="flex flex-col gap-6">
              {data.pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                  className="flex gap-4 items-start glass rounded-xl p-4 hover:border-[#0CC1C1]/40 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0CC1C1]/10 border border-[#0CC1C1]/30 flex items-center justify-center">
                    <span className="text-[#0CC1C1] text-xs font-bold">{pillar.number}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{pillar.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
