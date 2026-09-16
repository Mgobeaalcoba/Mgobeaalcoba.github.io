"use client";

import { useEffect, useRef } from "react";
import { events } from "@/lib/gtag";

interface YouTubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YouTubePlayerEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: { onReady: () => void; onStateChange: (event: YouTubePlayerEvent) => void };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => {
      apiPromise = null;
      reject(new Error("youtube_api_timeout"));
    }, 12_000);

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      window.clearTimeout(timeout);
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("youtube_api_unavailable"));
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timeout);
        apiPromise = null;
        reject(new Error("youtube_api_load_error"));
      };
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

export default function TrackedYouTubePlayer({
  videoId,
  title,
  source,
  autoplay = true,
}: {
  videoId: string;
  title: string;
  source: string;
  autoplay?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
      events.appError("youtube_player", "initialize", "invalid_video_id", false, "blog");
      return;
    }

    let disposed = false;
    let player: YouTubePlayer | null = null;
    let progressTimer: number | null = null;
    let started = false;
    let completed = false;
    const milestones = new Set<number>();

    const stopProgressTimer = () => {
      if (progressTimer !== null) window.clearInterval(progressTimer);
      progressTimer = null;
    };

    const sampleProgress = () => {
      if (!player) return;
      const duration = player.getDuration();
      if (!Number.isFinite(duration) || duration <= 0) return;
      const percent = (player.getCurrentTime() / duration) * 100;
      ([25, 50, 75] as const).forEach((milestone) => {
        if (percent >= milestone && !milestones.has(milestone)) {
          milestones.add(milestone);
          events.videoProgress(videoId, milestone, source);
        }
      });
    };

    loadYouTubeApi()
      .then((YT) => {
        if (disposed) return;
        player = new YT.Player(host, {
          host: "https://www.youtube-nocookie.com",
          videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => undefined,
            onStateChange: (event) => {
              if (event.data === 1) {
                if (!started) {
                  started = true;
                  events.videoStart(videoId, source);
                }
                if (progressTimer === null) {
                  progressTimer = window.setInterval(sampleProgress, 1_000);
                }
              } else if (event.data === 0) {
                sampleProgress();
                stopProgressTimer();
                if (!completed) {
                  completed = true;
                  events.videoComplete(videoId, source);
                }
              } else if (event.data === 2) {
                sampleProgress();
                stopProgressTimer();
              }
            },
          },
        });
      })
      .catch(() => {
        if (!disposed) events.appError("youtube_player", "initialize", "api_load_error", true, "blog");
      });

    return () => {
      disposed = true;
      stopProgressTimer();
      player?.destroy();
    };
  }, [autoplay, source, videoId]);

  return <div ref={hostRef} className="h-full w-full" aria-label={title} />;
}
