'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Play, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { events } from '@/lib/gtag';
import EmbeddedVideoModal from './EmbeddedVideoModal';

export default function VideoLibrary() {
  const { lang } = useLanguage();
  const { videos, loading } = useSupabaseData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[number] | null>(null);
  const categories = useMemo(() => ['all', ...Array.from(new Set(videos.map((video) => video.category))).filter(Boolean)], [videos]);
  const filtered = useMemo(() => videos.filter((video) => {
    const matchesCategory = category === 'all' || video.category === category;
    const text = `${video.titleEs} ${video.titleEn} ${video.descriptionEs} ${video.descriptionEn} ${video.tags.join(' ')}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [videos, query, category]);

  return (
    <>
      <section className="signal-video-library-hero"><div className="signal-video-library-hero__kicker"><Link href="/blog/#videos"><ArrowLeft size={15} />{lang === 'es' ? 'Volver al Blog' : 'Back to Blog'}</Link><span className="signal-eyebrow">MGA / Video library</span></div><div><h1>{lang === 'es' ? <>Todas las ideas,<br /><em>en movimiento.</em></> : <>Every idea,<br /><em>in motion.</em></>}</h1><p>{lang === 'es' ? 'Masterclasses, demostraciones y conversaciones técnicas reunidas en un solo lugar.' : 'Masterclasses, demos and technical conversations gathered in one place.'}</p></div></section>
      <section className="signal-video-library">
        <div className="signal-video-library__tools"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === 'es' ? 'Buscar videos…' : 'Search videos…'} /></label><div>{categories.map((value) => <button key={value} className={category === value ? 'is-active' : ''} onClick={() => setCategory(value)}>{value === 'all' ? (lang === 'es' ? 'Todos' : 'All') : value}</button>)}</div></div>
        {loading ? <div className="signal-video-loading" /> : <div className="signal-video-library__grid">{filtered.map((video, index) => <button type="button" key={video.id} onClick={() => { events.youtubeVideoClick(lang === 'es' ? video.titleEs : video.titleEn, video.youtubeId); setSelectedVideo(video); }}><div className="signal-video-library__thumb"><img src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt="" onError={(event) => { event.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }} /><span><Play size={18} fill="currentColor" /></span><small><Clock size={10} />{video.duration}</small></div><div className="signal-video-library__copy"><span>{String(index + 1).padStart(2, '0')} / {video.category}</span><h2>{lang === 'es' ? video.titleEs : video.titleEn}</h2><p>{lang === 'es' ? video.descriptionEs : video.descriptionEn}</p><strong>{lang === 'es' ? 'Reproducir video' : 'Play video'}<Play size={14} /></strong></div></button>)}</div>}
        {!loading && !filtered.length && <p className="signal-empty-state">{lang === 'es' ? 'No encontramos videos con ese criterio.' : 'No videos match that criteria.'}</p>}
      </section>
      <EmbeddedVideoModal videoId={selectedVideo?.youtubeId ?? null} title={selectedVideo ? (lang === 'es' ? selectedVideo.titleEs : selectedVideo.titleEn) : ''} onClose={() => setSelectedVideo(null)} />
    </>
  );
}
