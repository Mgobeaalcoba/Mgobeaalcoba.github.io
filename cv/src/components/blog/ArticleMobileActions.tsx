'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Check, Share2 } from 'lucide-react';
import { events } from '@/lib/gtag';

const SAVED_KEY = 'mga_saved_articles';
const RECENT_KEY = 'mga_recent_articles';

function readList(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
}

export default function ArticleMobileActions({ slug, title }: { slug: string; title: string }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setSaved(readList(SAVED_KEY).includes(slug));
    const recent = [slug, ...readList(RECENT_KEY).filter((value) => value !== slug)].slice(0, 12);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [slug]);

  const toggleSaved = () => {
    const current = readList(SAVED_KEY);
    const next = current.includes(slug) ? current.filter((value) => value !== slug) : [slug, ...current];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    const isSaved = next.includes(slug);
    setSaved(isSaved);
    events.contentAction(isSaved ? 'save' : 'unsave', 'article', slug);
    window.dispatchEvent(new Event('mga-saved-articles-change'));
  };

  const share = async () => {
    const data = { title, text: title, url: window.location.href };
    try {
      const canNativeShare = 'share' in navigator;
      const method = canNativeShare ? 'native_share' : 'clipboard';
      if (canNativeShare) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
      events.contentAction('share', 'article', slug, method);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch { /* User cancelled the native share sheet. */ }
  };

  return (
    <div className="signal-article-mobile-actions" aria-label="Acciones del artículo">
      <button onClick={toggleSaved} aria-pressed={saved}>
        {saved ? <Check size={18} /> : <Bookmark size={18} />}
        <span>{saved ? 'Guardada' : 'Guardar'}</span>
      </button>
      <button onClick={share}>
        {shared ? <Check size={18} /> : <Share2 size={18} />}
        <span>{shared ? 'Link copiado' : 'Compartir'}</span>
      </button>
    </div>
  );
}
