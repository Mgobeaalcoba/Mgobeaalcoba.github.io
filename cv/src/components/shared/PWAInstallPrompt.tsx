'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { events } from '@/lib/gtag';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export default function PWAInstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visits = Number(localStorage.getItem('mga_mobile_visits') ?? '0') + 1;
    localStorage.setItem('mga_mobile_visits', String(visits));
    const capture = (incoming: Event) => {
      incoming.preventDefault();
      events.pwaInstallEligible();
      setEvent(incoming as InstallEvent);
      if (visits >= 2 && localStorage.getItem('mga_install_dismissed') !== 'true') {
        window.setTimeout(() => {
          setVisible(true);
          events.pwaInstallPromptView();
        }, 4500);
      }
    };
    const installed = () => events.pwaInstalled();
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const dismiss = () => {
    events.pwaInstallResult('dismissed');
    setVisible(false);
    localStorage.setItem('mga_install_dismissed', 'true');
  };

  const install = async () => {
    if (!event) return;
    events.pwaInstallClick();
    await event.prompt();
    const choice = await event.userChoice;
    events.pwaInstallResult(choice.outcome);
    setVisible(false);
    if (choice.outcome === 'dismissed') localStorage.setItem('mga_install_dismissed', 'true');
    setEvent(null);
  };

  if (!visible || !event) return null;
  return (
    <aside className="signal-install-prompt" aria-label="Instalar MGA como aplicación">
      <span><Download size={18} /></span>
      <div><strong>Instalar MGA</strong><small>Acceso rápido y contenido disponible offline.</small></div>
      <button onClick={install}>Instalar</button>
      <button onClick={dismiss} aria-label="Cerrar"><X size={17} /></button>
    </aside>
  );
}
