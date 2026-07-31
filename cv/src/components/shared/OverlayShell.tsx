'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type OverlayShellProps = {
  isOpen: boolean;
  onClose: () => void;
  layer: string;
  title: string;
  eyebrow?: string;
  meta?: string;
  variant?: 'drawer' | 'dialog' | 'fullscreen';
  children: React.ReactNode;
};

export default function OverlayShell({
  isOpen,
  onClose,
  layer,
  title,
  eyebrow,
  meta,
  variant = 'drawer',
  children,
}: OverlayShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (window.history.state?.mgaLayer !== layer) {
      window.history.pushState({ ...window.history.state, mgaLayer: layer }, '', window.location.href);
    }

    const closeFromHistory = () => {
      if (window.history.state?.mgaLayer !== layer) onCloseRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const requestClose = () => {
      onCloseRef.current();
      if (window.history.state?.mgaLayer === layer) window.history.back();
    };

    window.addEventListener('popstate', closeFromHistory);
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('popstate', closeFromHistory);
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, layer]);

  const requestClose = () => {
    onClose();
    if (typeof window !== 'undefined' && window.history.state?.mgaLayer === layer) window.history.back();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`signal-overlay signal-overlay--${variant}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="signal-overlay__panel"
            initial={variant === 'drawer' ? { x: 60, opacity: 0 } : { y: 24, scale: .98, opacity: 0 }}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={variant === 'drawer' ? { x: 60, opacity: 0 } : { y: 24, scale: .98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          >
            <header className="signal-overlay__header">
              <div>
                {eyebrow && <span>{eyebrow}</span>}
                <h2>{title}</h2>
                {meta && <p>{meta}</p>}
              </div>
              <button type="button" onClick={requestClose} aria-label="Cerrar">
                <X size={20} />
              </button>
            </header>
            <div className="signal-overlay__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
