'use client';

import OverlayShell from '@/components/shared/OverlayShell';

export default function EmbeddedVideoModal({ videoId, title, onClose }: { videoId: string | null; title: string; onClose: () => void }) {
  return (
    <OverlayShell isOpen={Boolean(videoId)} onClose={onClose} layer="video-player" variant="fullscreen" eyebrow="MGA / Video" title={title} meta="YouTube · Reproducción integrada">
      {videoId && <div className="signal-embedded-player"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}
    </OverlayShell>
  );
}
