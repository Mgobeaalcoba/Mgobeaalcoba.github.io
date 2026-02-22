'use client';

import Link from 'next/link';
import { Clock, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PostMeta } from '@/lib/blog';

const CATEGORY_COLORS: Record<string, string> = {
  'data-engineering': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'python': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'automation': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'business-intelligence': 'bg-green-500/20 text-green-300 border-green-500/30',
};

interface PostCardProps {
  post: PostMeta;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const { lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/cv-site/blog/${post.slug}/`} className="block group">
        <article className="glass rounded-2xl p-6 glow-border hover:scale-[1.01] transition-all duration-200 h-full flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                CATEGORY_COLORS[post.category] ?? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              }`}
            >
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-100 leading-snug group-hover:text-sky-400 transition-colors text-lg">
            {post.title[lang]}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            {post.excerpt[lang]}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readTime}
            </span>
            <div className="flex gap-1 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="flex items-center gap-0.5">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sky-400 text-sm font-medium group-hover:text-sky-300 transition-colors">
            Leer artículo →
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
