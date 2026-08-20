'use client';

import { useEffect, useState } from 'react';
import { CONSENT_STORAGE_KEY, type ConsentChoice, updateConsent } from '@/lib/gtag';

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setOpen(!localStorage.getItem(CONSENT_STORAGE_KEY)); }
      catch { setOpen(true); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (choice: ConsentChoice) => {
    try { localStorage.setItem(CONSENT_STORAGE_KEY, choice); } catch { /* Applies to this page only. */ }
    updateConsent(choice);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <section role="dialog" aria-modal="true" aria-labelledby="neil-consent-title" className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-navy-950/95 p-5 text-white shadow-2xl backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-6">
      <div><h2 id="neil-consent-title" className="font-bold">Vos elegís cómo medimos la experiencia.</h2><p className="mt-1 text-sm text-slate-300">La analítica nos ayuda a mejorar el sitio. Nunca enviamos a Google tu nombre, email, teléfono ni mensaje. <a className="text-cyan-accent underline" href="https://www.mgatc.com/privacidad/">Política de privacidad</a>.</p></div>
      <div className="mt-4 flex shrink-0 flex-wrap gap-2 md:mt-0"><button className="rounded-xl bg-cyan-accent px-4 py-2 text-sm font-bold text-navy-950" onClick={() => choose('analytics')}>Aceptar analítica</button><button className="rounded-xl border border-white/20 px-4 py-2 text-sm" onClick={() => choose('essential')}>Solo esenciales</button></div>
    </section>
  );
}
