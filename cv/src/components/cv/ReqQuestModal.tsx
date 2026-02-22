'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Production URL for the game (served as static file from GitHub Pages root)
const GAME_URL = 'https://mgobeaalcoba.github.io/ing_req_game.html';

interface ReqQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReqQuestModal({ isOpen, onClose }: ReqQuestModalProps) {
  const { lang } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for postMessage from the iframe's "Volver al Portfolio" button
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data === 'closeGame') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const openFullscreen = () => {
    window.open(GAME_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-2 sm:inset-4 lg:inset-8 z-50 flex flex-col rounded-2xl overflow-hidden border border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.4)]"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">🕵️‍♂️</span>
                <div>
                  <p className="text-white font-bold text-sm leading-none">ReqQuest 3D: Office Edition</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {lang === 'es'
                      ? 'Juego educativo · Ingeniería de Requerimientos'
                      : 'Educational game · Requirements Engineering'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Open in full tab */}
                <button
                  onClick={openFullscreen}
                  title={lang === 'es' ? 'Abrir en nueva pestaña' : 'Open in new tab'}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <Maximize2 size={16} />
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  title={lang === 'es' ? 'Cerrar juego (Esc)' : 'Close game (Esc)'}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Game iframe */}
            <iframe
              ref={iframeRef}
              src={isOpen ? GAME_URL : undefined}
              title="ReqQuest 3D: Office Edition"
              className="flex-1 w-full border-0 bg-slate-900"
              allow="autoplay"
              loading="lazy"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
