'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from './TransitionLink';
import { CONSENT_STORAGE_KEY, ConsentChoice, updateConsent } from '@/lib/gtag';

export const CONSENT_SETTINGS_EVENT = 'mga:open-consent-settings';

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(!localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, reopen);
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Consent still applies for this page when storage is unavailable.
    }
    updateConsent(choice);
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <section className="signal-consent" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="signal-consent__copy">
        <span>Privacidad / medición</span>
        <h2 id="consent-title">Vos elegís cómo medimos la experiencia.</h2>
        <p>
          Las cookies analíticas ayudan a mejorar el sitio. Google Signals agrega medición entre dispositivos
          y personalización. Nunca enviamos a Analytics tu nombre, email ni mensajes.
          {' '}<Link href="/privacidad/">Ver política</Link>
        </p>
      </div>
      <div className="signal-consent__actions">
        <button type="button" className="signal-consent__primary" onClick={() => choose('analytics')}>
          Aceptar analítica
        </button>
        <button type="button" onClick={() => choose('all')}>Analítica + Signals</button>
        <button type="button" onClick={() => choose('essential')}>Solo esenciales</button>
      </div>
    </section>
  );
}
