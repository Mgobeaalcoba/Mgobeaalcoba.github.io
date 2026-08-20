'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowUpRight, Clock, Play, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { events } from '@/lib/gtag';
import TrackedYouTubePlayer from './TrackedYouTubePlayer';

export default function VideoSection() {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { videos, loading } = useSupabaseData();
  const featured = videos.filter((video) => video.featured).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const main = featured.find((video) => video.id === selectedId) ?? featured[0];
  const playlist = featured.filter((video) => video.id !== main?.id).slice(0, 5);
  const track = (video: typeof featured[number]) => events.youtubeVideoClick(lang === 'es' ? video.titleEs : video.titleEn, video.youtubeId);
  const play = (video: typeof featured[number]) => { setPlayingId(video.id); track(video); };

  return (
    <section id="videos" data-section="videos" className="signal-blog-video">
      <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}>
        <div className="signal-blog-section-heading"><div><span className="signal-eyebrow">01 / Watch &amp; learn</span><h2>{lang === 'es' ? 'Aprender en video.' : 'Learn on video.'}</h2></div><p>{lang === 'es' ? 'Masterclasses, demostraciones y conversaciones técnicas para pasar de la idea a la práctica.' : 'Masterclasses, demos and technical conversations to move from ideas to practice.'}</p></div>
        {loading ? <div className="signal-video-loading" /> : main && (
          <div className="signal-video-stage">
            <AnimatePresence mode="wait">
              <motion.div key={main.id} className="signal-video-feature" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }}>
                <div className="signal-video-feature__media">{playingId === main.id ? <TrackedYouTubePlayer videoId={main.youtubeId} title={lang === 'es' ? main.titleEs : main.titleEn} source="featured_video" /> : <button type="button" onClick={() => play(main)} aria-label={lang === 'es' ? `Reproducir ${main.titleEs}` : `Play ${main.titleEn}`}><img src={`https://img.youtube.com/vi/${main.youtubeId}/maxresdefault.jpg`} alt="" onError={(event) => { event.currentTarget.src = `https://img.youtube.com/vi/${main.youtubeId}/hqdefault.jpg`; }} /><span><Play size={22} fill="currentColor" /></span><small><Clock size={11} />{main.duration}</small></button>}</div>
                <div className="signal-video-feature__copy"><span>{main.channel} / {new Date(main.date).getFullYear()}</span><h3>{lang === 'es' ? main.titleEs : main.titleEn}</h3><p>{lang === 'es' ? main.descriptionEs : main.descriptionEn}</p><button type="button" onClick={() => play(main)}>{lang === 'es' ? 'Reproducir masterclass' : 'Play masterclass'} <Play size={15} /></button></div>
              </motion.div>
            </AnimatePresence>
            <div className="signal-video-playlist">
              <header><span>{lang === 'es' ? 'A continuación' : 'Up next'}</span><strong>{playlist.length} {lang === 'es' ? 'episodios' : 'episodes'}</strong></header>
              {playlist.map((video, index) => <button key={video.id} type="button" onClick={() => { events.videoSelect(video.youtubeId, 'featured_playlist'); setPlayingId(null); setSelectedId(video.id); }}><span>{String(index + 2).padStart(2, '0')}</span><div><small>{video.channel} · {video.duration}</small><h3>{lang === 'es' ? video.titleEs : video.titleEn}</h3></div><Play size={15} /></button>)}
              <Link className="signal-video-youtube" href="/blog/videos/"><Youtube size={16} />{lang === 'es' ? 'Explorar todos los videos' : 'Explore all videos'}<ArrowUpRight size={14} /></Link>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
