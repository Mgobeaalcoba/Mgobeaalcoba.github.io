'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Clock, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import videosData from '@/data/videos.json';

interface Video {
  id: string;
  youtubeId: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  category: string;
  duration: string;
  date: string;
  channel: string;
  featured: boolean;
  tags: string[];
}

export default function VideoSection() {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const videos = (videosData.videos as Video[]).filter((v) => v.featured);

  return (
    <section id="videos" data-section="videos" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Youtube size={24} className="text-red-400" />
          <h2 className="section-title mb-0">{t('blog_videos_title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden glow-border hover:scale-[1.02] transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-800 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.title[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
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
                  <span className="text-xs text-red-400 font-medium">{video.channel}</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(video.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
                      year: 'numeric', month: 'short'
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-100 text-sm leading-snug group-hover:text-sky-400 transition-colors mb-2">
                  {video.title[lang]}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {video.description[lang]}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
