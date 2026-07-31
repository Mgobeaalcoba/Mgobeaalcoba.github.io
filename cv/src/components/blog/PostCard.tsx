'use client';

import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PostMeta } from '@/lib/blog';
import { events } from '@/lib/gtag';

export default function PostCard({ post }: { post: PostMeta; index: number }) {
  const { lang } = useLanguage();
  const date = new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <Link href={`/blog/${post.slug}/`} className="signal-post-card" onClick={() => events.blogPostCardClick(post.slug, post.title[lang], post.category)}>
      <div className="signal-post-card__meta"><span>{post.category.replaceAll('-', ' ')}</span><span>{date}</span></div>
      <h3>{post.title[lang]}</h3>
      <p>{post.excerpt[lang]}</p>
      <div className="signal-post-card__footer"><span><Clock size={13} />{post.readTime}</span><span>{post.tags.slice(0, 2).join(' · ')}</span><ArrowUpRight size={17} /></div>
    </Link>
  );
}
