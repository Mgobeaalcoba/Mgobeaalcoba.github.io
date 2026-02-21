'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Globe, Wrench, ShoppingCart, BarChart2, Users, FileText, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContentRepository from '@/services/contentService';
import { trackProposalView, trackConsultingClick } from '@/lib/gtag';

const proposal = ContentRepository.getSalesProposal();

const deptIconMap: Record<string, LucideIcon> = {
  Globe: Globe as LucideIcon,
  Wrench: Wrench as LucideIcon,
  ShoppingCart: ShoppingCart as LucideIcon,
  BarChart: BarChart2 as LucideIcon,
  Users: Users as LucideIcon,
  FileText: FileText as LucideIcon,
};

export default function SalesProposal() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          trackProposalView();
          tracked.current = true;
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const sp = t.salesProposal;

  return (
    <section id="propuesta" ref={ref} className="py-20 lg:py-28 bg-navy-900 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-neil/5 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Warning banner */}
        <div className="mb-10 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">⚠ {sp.badge}</span>
          <span className="text-amber-400/70 text-xs mx-2">—</span>
          <span className="text-amber-400/70 text-xs">{sp.disclaimer}</span>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">{sp.headline}</h2>
        </motion.div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Legacy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
          >
            <h3 className="text-red-400 font-bold text-lg mb-4">
              ✗ {sp.legacyTitle}
            </h3>
            <ul className="space-y-3">
              {proposal.comparison.legacy.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                  <X size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* New */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-cyan-accent/5 border border-cyan-accent/20"
          >
            <h3 className="text-cyan-accent font-bold text-lg mb-4">
              ✓ {sp.newTitle}
            </h3>
            <ul className="space-y-3">
              {proposal.comparison.new.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <Check size={14} className="text-cyan-accent flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Impact stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-white font-bold text-2xl text-center mb-8">{proposal.impactTitle}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {proposal.impactItems.map((item) => (
              <div key={item.label} className="p-6 rounded-2xl bg-orange-neil/10 border border-orange-neil/20 text-center">
                <p className="text-4xl font-black text-orange-neil mb-2">{item.value}</p>
                <p className="text-slate-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-white font-bold text-2xl text-center mb-8">{sp.automationsTitle}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposal.departments.map((dept, i) => {
              const Icon = deptIconMap[dept.icon] ?? Globe as LucideIcon;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 flex items-center justify-center">
                      <Icon className="text-cyan-accent" size={18} />
                    </div>
                    <h4 className="text-white font-semibold">{dept.name}</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {dept.automations.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-slate-400 text-xs">
                        <div className="w-1 h-1 rounded-full bg-orange-neil flex-shrink-0 mt-1.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA + Signature */}
        <div className="text-center space-y-6">
          <a
            href={proposal.consultingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackConsultingClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-neil text-white font-bold hover:bg-orange-light transition-all shadow-[0_0_30px_rgba(255,107,53,0.3)]"
          >
            {sp.consultingCta}
            <ExternalLink size={18} />
          </a>

          <div className="border-t border-white/10 pt-6">
            <p className="text-slate-500 text-sm">{sp.signatureLabel}</p>
            <a
              href={proposal.signatureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 font-semibold hover:text-cyan-accent transition-colors"
            >
              {proposal.signature}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
