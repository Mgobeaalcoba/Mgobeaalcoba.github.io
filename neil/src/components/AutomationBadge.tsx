'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, CheckCircle } from 'lucide-react';
import type { AutomationEntry } from '@/types/content';

interface Props {
  automation: AutomationEntry;
}

export default function AutomationBadge({ automation }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-neil/10 border border-orange-neil/30 text-orange-neil text-xs font-semibold hover:bg-orange-neil/20 transition-all cursor-pointer"
      >
        <Zap size={12} />
        Automatización
      </button>

      <AnimatePresence>
        {open && typeof document !== 'undefined' && createPortal(
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
              onClick={() => setOpen(false)}
            />

            {/* Modal — centered via portal, no parent transform interference */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, width: '100%', maxWidth: '32rem', padding: '0 1rem' }}
            >
              <div className="bg-navy-800 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/60 max-h-[85vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-neil/20 flex items-center justify-center">
                      <Zap className="text-orange-neil" size={18} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{automation.title}</h3>
                      <p className="text-slate-500 text-xs">n8n · Automatización activa</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-500 hover:text-white transition-colors p-1"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Steps */}
                <div className="mb-5">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Flujo automático</p>
                  <div className="space-y-2">
                    {automation.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-neil/20 border border-orange-neil/30 flex items-center justify-center">
                          <span className="text-orange-neil text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech stack */}
                <div className="mb-5">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Stack tecnológico</p>
                  <div className="flex flex-wrap gap-2">
                    {automation.techStack.map((tech) => (
                      <div key={tech.name} className="px-3 py-1.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 text-xs">
                        <span className="text-cyan-accent font-semibold">{tech.name}</span>
                        <span className="text-slate-400 ml-1">· {tech.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Beneficios</p>
                  <div className="space-y-2">
                    {automation.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-cyan-accent flex-shrink-0" />
                        <p className="text-slate-300 text-sm">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
