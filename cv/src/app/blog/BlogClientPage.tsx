'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PostCard from '@/components/blog/PostCard';
import VideoSection from '@/components/blog/VideoSection';
import type { PostMeta } from '@/lib/blog';

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  'data-engineering': { es: 'Data Engineering', en: 'Data Engineering' },
  'python': { es: 'Python', en: 'Python' },
  'automation': { es: 'Automatización', en: 'Automation' },
  'business-intelligence': { es: 'Business Intelligence', en: 'Business Intelligence' },
};

interface BlogClientPageProps {
  posts: PostMeta[];
  categories: string[];
}

export default function BlogClientPage({ posts, categories }: BlogClientPageProps) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={28} className="text-sky-400" />
            <h1 className="text-4xl font-black gradient-text">{t('blog_title')}</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">{t('blog_subtitle')}</p>
        </motion.div>
      </section>

      {/* Category filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === 'all'
                ? 'bg-sky-500 text-white border-sky-500'
                : 'glass border-white/10 text-gray-400 hover:text-sky-400'
            }`}
          >
            {t('blog_filter_all')} ({posts.length})
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'glass border-white/10 text-gray-400 hover:text-sky-400'
                }`}
              >
                {CATEGORY_LABELS[cat]?.[lang] ?? cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No hay artículos en esta categoría aún.
          </div>
        )}
      </section>

      {/* Videos section */}
      <VideoSection />
    </>
  );
}
