"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Clock, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabaseData } from "@/contexts/SupabaseDataContext";
import { events } from "@/lib/gtag";

const MAX_VISIBLE_VIDEOS = 6;
const VISIBLE_VIDEO_ROWS = 2;

export default function VideoSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const videosGridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { videos, loading } = useSupabaseData();
  const [videosMaxHeight, setVideosMaxHeight] = useState<number | null>(null);
  const [visibleVideoCount, setVisibleVideoCount] = useState<number>(MAX_VISIBLE_VIDEOS);

  const featuredVideos = videos
    .filter((v) => v.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const hasVideosOverflow = featuredVideos.length > visibleVideoCount;

  useEffect(() => {
    if (loading) {
      setVideosMaxHeight(null);
      setVisibleVideoCount(MAX_VISIBLE_VIDEOS);
      return;
    }

    const grid = videosGridRef.current;
    if (!grid) return;

    let rafId: number | null = null;
    const updateLayoutMetrics = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const gridStyles = getComputedStyle(grid);
        const cards = Array.from(grid.children) as HTMLElement[];
        if (!cards.length) {
          setVideosMaxHeight(null);
          return;
        }
        const firstTop = cards[0].offsetTop;
        const columns = cards.reduce((count, card) => {
          if (Math.abs(card.offsetTop - firstTop) <= 1) return count + 1;
          return count;
        }, 0) || 1;
        const nextVisibleCount = Math.min(
          MAX_VISIBLE_VIDEOS,
          columns * VISIBLE_VIDEO_ROWS
        );
        setVisibleVideoCount(nextVisibleCount);

        const rowGap = parseFloat(gridStyles.rowGap || "0") || 0;
        const totalRows = Math.ceil(cards.length / columns);
        const visibleRows = Math.min(VISIBLE_VIDEO_ROWS, totalRows);
        const cardHeight = cards[0].offsetHeight;
        const totalRowsHeight = cardHeight * visibleRows;
        const totalGapHeight = rowGap * Math.max(visibleRows - 1, 0);
        setVideosMaxHeight(totalRowsHeight + totalGapHeight);
      });
    };

    updateLayoutMetrics();

    const resizeObserver = new ResizeObserver(updateLayoutMetrics);
    resizeObserver.observe(grid);
    window.addEventListener("resize", updateLayoutMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayoutMetrics);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [featuredVideos.length, lang, loading]);

  return (
    <section
      id="videos"
      data-section="videos"
      className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Youtube size={24} className="text-red-400" />
          <h2 className="section-title mb-0">{t("blog_videos_title")}</h2>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-24" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div
            className={hasVideosOverflow ? "rounded-2xl border-2 border-red-500/35 bg-red-950/15 shadow-[0_0_0_1px_rgba(239,68,68,0.18),0_20px_45px_rgba(0,0,0,0.35)] p-2" : ""}
          >
            <div
              className={hasVideosOverflow ? "overflow-y-auto blog-scroll-container pr-1" : ""}
              style={hasVideosOverflow && videosMaxHeight ? { maxHeight: `${videosMaxHeight}px` } : undefined}
            >
              <div ref={videosGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    events.youtubeVideoClick(
                      lang === "es" ? video.titleEs : video.titleEn,
                      video.youtubeId
                    )
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="group glass rounded-2xl overflow-hidden glow-border hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="relative aspect-video bg-gray-800 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={lang === "es" ? video.titleEs : video.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock size={10} />
                      {video.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-red-400 font-medium">
                        {video.channel}
                      </span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(video.date).toLocaleDateString(
                          lang === "es" ? "es-AR" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-100 text-sm leading-snug group-hover:text-sky-400 transition-colors mb-2">
                      {lang === "es" ? video.titleEs : video.titleEn}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {lang === "es" ? video.descriptionEs : video.descriptionEn}
                    </p>
                  </div>
                </motion.a>
              ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
