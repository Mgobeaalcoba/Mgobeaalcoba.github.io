'use client';

import OverlayShell from '@/components/shared/OverlayShell';
import TrackedYouTubePlayer from './TrackedYouTubePlayer';

export default function EmbeddedVideoModal({ videoId, title, onClose }: { videoId: string | null; title: string; onClose: () => void }) {
  return (
    <OverlayShell isOpen={Boolean(videoId)} onClose={onClose} layer="video-player" variant="fullscreen" eyebrow="MGA / Video" title={title} meta="YouTube · Reproducción integrada">
      {videoId && <div className="signal-embedded-player"><TrackedYouTubePlayer videoId={videoId} title={title} source="video_library" /></div>}
    </OverlayShell>
  );
}
