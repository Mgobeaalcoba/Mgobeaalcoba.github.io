'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { History as HistoryData } from '@/types/content';

interface HistoryProps {
  data: HistoryData;
}

export default function History({ data }: HistoryProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="historia" ref={ref} className="py-24 bg-[#0B1120] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#2D4F8F]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#0CC1C1]" />
            <span className="section-label">{data.sectionLabel}</span>
            <div className="h-px w-8 bg-[#0CC1C1]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            {data.description}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#0CC1C1] via-[#2D4F8F] to-transparent" />

          <div className="flex flex-col gap-12">
            {data.timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex gap-8 ${
                  i % 2 === 0
                    ? 'md:flex-row md:pr-[50%]'
                    : 'md:flex-row-reverse md:pl-[50%]'
                } flex-row pl-12 md:pl-0 md:pr-0`}
              >
                {/* Dot */}
                <div
                  className={`absolute left-0 md:left-1/2 top-2 w-9 h-9 -translate-x-[14px] md:-translate-x-1/2 rounded-full border-2 flex items-center justify-center z-10 ${
                    item.year === 'HOY'
                      ? 'border-[#0CC1C1] bg-[#0CC1C1] shadow-lg shadow-cyan-accent/50'
                      : 'border-[#0CC1C1]/60 bg-[#0B1120]'
                  }`}
                >
                  {item.year === 'HOY' ? (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0CC1C1]" />
                  )}
                </div>

                {/* Card */}
                <div className="glass rounded-xl p-6 flex-1 hover:border-[#0CC1C1]/40 transition-colors duration-300">
                  <div className="text-[#0CC1C1] font-black text-xl mb-2">{item.year}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-8">Nuestra Flota y Operaciones</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.galleryImages.map((src, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden aspect-video group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`El Portugués - imagen ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#0CC1C1]/30 rounded-xl transition-colors duration-300" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
