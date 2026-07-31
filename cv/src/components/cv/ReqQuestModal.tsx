'use client';

import { useEffect, useCallback } from 'react';
import { Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import OverlayShell from '@/components/shared/OverlayShell';

const GAME_URL = 'https://mgobeaalcoba.github.io/ing_req_game.html';

export default function ReqQuestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const handleMessage = useCallback((event: MessageEvent) => { if (event.data === 'closeGame') onClose(); }, [onClose]);
  useEffect(() => { window.addEventListener('message', handleMessage); return () => window.removeEventListener('message', handleMessage); }, [handleMessage]);

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={onClose}
      layer="reqquest"
      variant="fullscreen"
      eyebrow={lang === 'es' ? 'Experimento educativo' : 'Learning experiment'}
      title="ReqQuest 3D: Office Edition"
      meta={lang === 'es' ? 'Ingeniería de Requerimientos · Experiencia interactiva' : 'Requirements Engineering · Interactive experience'}
    >
      <div className="signal-game-shell">
        <button onClick={() => window.open(GAME_URL, '_blank', 'noopener,noreferrer')}><Maximize2 size={15} />{lang === 'es' ? 'Abrir en pestaña completa' : 'Open in full tab'}</button>
        <iframe src={isOpen ? GAME_URL : undefined} title="ReqQuest 3D: Office Edition" allow="autoplay" loading="lazy" />
      </div>
    </OverlayShell>
  );
}
