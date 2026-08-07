'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, CheckCircle2, ArrowRight, Cpu } from 'lucide-react';
import type { AutomationEntry } from '@/types/content';

interface AutomationBadgeProps {
  automation: AutomationEntry;
}

export default function AutomationBadge({ automation }: AutomationBadgeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0CC1C1]/10 border border-[#0CC1C1]/30 text-[#0CC1C1] text-xs font-semibold hover:bg-[#0CC1C1]/20 hover:border-[#0CC1C1]/60 transition-all duration-200 group"
        title="Ver automatización asociada"
      >
        <Zap size={12} className="group-hover:animate-pulse" />
        <span>Automatización</span>
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B1120] border border-[#0CC1C1]/30 rounded-2xl shadow-2xl shadow-black/60"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-[#0B1120] border-b border-white/5 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-[#0CC1C1]/20 border border-[#0CC1C1]/30 flex items-center justify-center">
                        <Zap size={12} className="text-[#0CC1C1]" />
                      </div>
                      <span className="text-[#0CC1C1] text-xs font-semibold tracking-widest uppercase">n8n Workflow</span>
                    </div>
                    <h3 className="text-white font-black text-xl leading-tight">{automation.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{automation.description}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-6 py-6 flex flex-col gap-8">
                  {/* Trigger label */}
                  <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <ArrowRight size={14} className="text-[#0CC1C1]" />
                    {automation.triggerLabel}
                  </div>

                  {/* Flow steps */}
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#0CC1C1] rounded-full inline-block" />
                      Flujo de automatización
                    </h4>
                    <ol className="flex flex-col gap-3">
                      {automation.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#0CC1C1]/30 to-[#2D4F8F]/30 border border-[#0CC1C1]/30 flex items-center justify-center text-[#0CC1C1] text-xs font-bold">
                            {i + 1}
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed pt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tech stack */}
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#2D4F8F] rounded-full inline-block" />
                      <Cpu size={14} className="text-slate-400" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {automation.techStack.map((tech) => (
                        <div
                          key={tech.name}
                          className="flex flex-col px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#0CC1C1]/30 transition-colors"
                        >
                          <span className="text-white text-xs font-bold">{tech.name}</span>
                          <span className="text-slate-500 text-xs">{tech.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-green-500 rounded-full inline-block" />
                      Ventajas del negocio
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {automation.benefits.map((benefit, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-300 text-sm leading-relaxed">{benefit}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer note */}
                  <div className="glass rounded-xl p-4 flex items-start gap-3">
                    <Zap size={16} className="text-[#0CC1C1] flex-shrink-0 mt-0.5" />
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Esta automatización se activa configurando la variable{' '}
                      <code className="text-[#0CC1C1] bg-black/30 px-1 py-0.5 rounded text-xs">NEXT_PUBLIC_N8N_CONTACT_WEBHOOK</code>{' '}
                      en el archivo <code className="text-[#0CC1C1] bg-black/30 px-1 py-0.5 rounded text-xs">.env.local</code>{' '}
                      con la URL del workflow de n8n correspondiente.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
