'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Truck, Warehouse, FileText, Users, BarChart2, Calculator,
  CheckCircle2, XCircle, ExternalLink, Zap, TrendingUp, AlertTriangle,
  type LucideProps,
} from 'lucide-react';
import { trackConsultingClick } from '@/lib/gtag';
import type { SalesProposal as SalesProposalData } from '@/types/content';

interface SalesProposalProps {
  data: SalesProposalData;
}

type LucideIcon = React.FC<LucideProps>;

const iconMap: Record<string, LucideIcon> = {
  Truck: Truck as LucideIcon,
  Warehouse: Warehouse as LucideIcon,
  FileText: FileText as LucideIcon,
  Users: Users as LucideIcon,
  BarChart2: BarChart2 as LucideIcon,
  Calculator: Calculator as LucideIcon,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function SalesProposal({ data }: SalesProposalProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      id="propuesta"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000 0%, #050D1A 40%, #0B1120 100%)' }}
    >
      {/* Temporal banner */}
      <div className="sticky top-0 z-40 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-3">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-xs font-medium">
            <span className="font-bold">{data.badge}</span>
            {' — '}{data.disclaimer}
          </p>
        </div>
      </div>

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(12,193,193,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,193,193,0.8) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0CC1C1]/10 border border-[#0CC1C1]/30 mb-6">
            <TrendingUp size={14} className="text-[#0CC1C1]" />
            <span className="text-[#0CC1C1] text-xs font-semibold tracking-widest uppercase">Propuesta de Valor</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {data.headline}
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {data.subheadline}
          </p>
        </motion.div>

        {/* Legacy vs New comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-20"
        >
          <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-8 font-semibold">
            Comparativa de plataformas
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Legacy */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <XCircle size={16} className="text-red-400" />
                </div>
                <h4 className="text-red-300 font-bold">{data.comparison.legacyLabel}</h4>
              </div>
              <ul className="flex flex-col gap-3">
                {data.comparison.legacyItems.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <XCircle size={14} className="text-red-500/60 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* New */}
            <div className="rounded-2xl border border-[#0CC1C1]/30 bg-[#0CC1C1]/5 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#0CC1C1]/10 border border-[#0CC1C1]/30 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-[#0CC1C1]" />
                </div>
                <h4 className="text-[#0CC1C1] font-bold">{data.comparison.newLabel}</h4>
              </div>
              <ul className="flex flex-col gap-3">
                {data.comparison.newItems.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <CheckCircle2 size={14} className="text-[#0CC1C1]/70 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Impact stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-8 font-semibold">
            {data.impactTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.impactItems.map((item, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 text-center hover:border-[#0CC1C1]/40 transition-colors duration-300"
              >
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{item.stat}</div>
                <div className="text-white font-semibold text-sm mb-2">{item.label}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Department automation catalog */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#0CC1C1]" />
              <span className="section-label">// Automatizaciones por área</span>
              <div className="h-px w-8 bg-[#0CC1C1]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
              Potencial de automatización para cada departamento
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Cada una de estas automatizaciones puede implementarse de forma independiente con n8n, conectando los sistemas que ya usa la empresa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.departments.map((dept, i) => {
              const Icon = iconMap[dept.icon] ?? Zap;
              return (
                <motion.div
                  key={dept.name}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="glass rounded-2xl p-6 hover:border-[#0CC1C1]/30 hover:shadow-lg hover:shadow-black/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${dept.color}20`, border: `1px solid ${dept.color}40` }}
                    >
                      <Icon size={18} style={{ color: dept.color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{dept.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Zap size={10} style={{ color: dept.color }} />
                        <span className="text-xs" style={{ color: dept.color }}>{dept.automations.length} automatizaciones</span>
                      </div>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {dept.automations.map((auto, j) => (
                      <li key={j} className="flex gap-2.5 items-start">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: dept.color }}
                        />
                        <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{auto}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA to consulting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex flex-col items-center gap-4 glass rounded-2xl px-10 py-8 border border-[#0CC1C1]/20 max-w-xl mx-auto">
            <p className="text-slate-300 text-sm leading-relaxed">
              Estas son solo algunas de las posibilidades. Para conocer el catálogo completo de servicios, integraciones y propuestas de valor que puedo ofrecer a la organización:
            </p>
            <a
              href={data.consultingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackConsultingClick}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0CC1C1] text-black font-bold text-sm hover:bg-[#14e8e8] transition-colors duration-200 shadow-lg shadow-cyan-accent/20"
            >
              {data.consultingCta}
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="border-t border-white/5 pt-8 text-center"
        >
          <a
            href={data.signatureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 text-xs hover:text-slate-400 transition-colors duration-200"
          >
            {data.signature}
          </a>
        </motion.div>

      </div>
    </section>
  );
}
