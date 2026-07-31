'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PostCard from '@/components/blog/PostCard';
import SpecialReportsSection from '@/components/blog/SpecialReportsSection';
import VideoSection from '@/components/blog/VideoSection';
import type { PostMeta } from '@/lib/blog';
import { events } from '@/lib/gtag';

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  'data-engineering': { es: 'Data engineering', en: 'Data engineering' },
  python: { es: 'Python', en: 'Python' },
  automation: { es: 'Automatización', en: 'Automation' },
  'business-intelligence': { es: 'Business intelligence', en: 'Business intelligence' },
  General: { es: 'General', en: 'General' },
};

export default function BlogClientPage({ posts, categories }: { posts: PostMeta[]; categories: string[] }) {
  const { lang } = useLanguage();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(12);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('category');
    if (value && (categories.includes(value) || value === 'all')) setCategory(value);
  }, [categories]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === 'all' || post.category === category;
      const searchable = `${post.title[lang]} ${post.excerpt[lang]} ${post.tags.join(' ')}`.toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [posts, category, query, lang]);

  const updateCategory = (value: string) => {
    setCategory(value);
    setVisible(12);
    events.blogCategoryFilter(value);
    const url = value === 'all' ? '/blog/' : `/blog/?category=${encodeURIComponent(value)}`;
    window.history.replaceState(null, '', url);
  };

  return (
    <>
      <section className="signal-editorial-hero">
        <span className="signal-eyebrow">MGA / Field notes</span>
        <div className="signal-editorial-hero__grid">
          <h1>{lang === 'es' ? <>Ideas para construir<br /><em>mejores sistemas.</em></> : <>Ideas for building<br /><em>better systems.</em></>}</h1>
          <div>
            <p>{lang === 'es' ? 'Análisis, aprendizajes y herramientas sobre Data Engineering, IA aplicada y automatización desde la práctica.' : 'Analysis, lessons and tools about Data Engineering, applied AI and automation from the field.'}</p>
            <div className="signal-editorial-count"><strong>{posts.length}</strong><span>{lang === 'es' ? 'notas publicadas' : 'published notes'}</span></div>
          </div>
        </div>
      </section>

      <SpecialReportsSection />
      <VideoSection />

      <section id="posts" className="signal-editorial-index">
        <div className="signal-editorial-index__top">
          <div><span className="signal-eyebrow">{lang === 'es' ? 'Archivo' : 'Archive'}</span><h2>{lang === 'es' ? 'Notas técnicas' : 'Technical notes'}</h2></div>
          <label className="signal-blog-search">
            <Search size={18} />
            <span className="sr-only">{lang === 'es' ? 'Buscar artículos' : 'Search articles'}</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(12); }} placeholder={lang === 'es' ? 'Buscar por tema, tecnología…' : 'Search by topic, technology…'} />
          </label>
        </div>

        <div className="signal-blog-filters" aria-label={lang === 'es' ? 'Filtrar por categoría' : 'Filter by category'}>
          <button className={category === 'all' ? 'is-active' : ''} onClick={() => updateCategory('all')}>{lang === 'es' ? 'Todas' : 'All'} <span>{posts.length}</span></button>
          {categories.map((value) => <button key={value} className={category === value ? 'is-active' : ''} onClick={() => updateCategory(value)}>{CATEGORY_LABELS[value]?.[lang] ?? value} <span>{posts.filter((post) => post.category === value).length}</span></button>)}
        </div>

        <div className="signal-post-grid">
          {filtered.slice(0, visible).map((post, index) => <PostCard key={post.slug} post={post} index={index} />)}
        </div>

        {!filtered.length && <p className="signal-empty-state">{lang === 'es' ? 'No encontramos notas con ese criterio.' : 'No notes match that criteria.'}</p>}
        {visible < filtered.length && <button className="signal-load-more" onClick={() => setVisible((count) => count + 12)}>{lang === 'es' ? 'Cargar 12 notas más' : 'Load 12 more notes'}<ArrowDown size={16} /></button>}
      </section>
    </>
  );
}
