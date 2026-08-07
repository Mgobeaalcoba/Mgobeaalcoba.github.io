'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Search } from 'lucide-react';
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
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const latest = posts.slice(0, 6);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('category');
    if (value && (categories.includes(value) || value === 'all')) setCategory(value);
  }, [categories]);

  useEffect(() => {
    const loadSaved = () => {
      try { setSavedSlugs(JSON.parse(localStorage.getItem('mga_saved_articles') ?? '[]')); }
      catch { setSavedSlugs([]); }
    };
    loadSaved();
    window.addEventListener('mga-saved-articles-change', loadSaved);
    return () => window.removeEventListener('mga-saved-articles-change', loadSaved);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === 'all' || (category === 'saved' ? savedSlugs.includes(post.slug) : post.category === category);
      const searchable = `${post.title[lang]} ${post.excerpt[lang]} ${post.tags.join(' ')}`.toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [posts, category, query, lang, savedSlugs]);

  const updateCategory = (value: string) => {
    setCategory(value);
    setVisible(12);
    events.blogCategoryFilter(value);
    const url = value === 'all' || value === 'saved' ? '/blog/' : `/blog/?category=${encodeURIComponent(value)}`;
    window.history.replaceState(null, '', url);
  };

  return (
    <>
      <section className="signal-editorial-hero">
        <span className="signal-eyebrow">MGA / Insights &amp; field notes</span>
        <div className="signal-editorial-hero__grid">
          <h1>{lang === 'es' ? <>Ideas, análisis y<br /><em>mejores sistemas.</em></> : <>Ideas, analysis and<br /><em>better systems.</em></>}</h1>
          <div>
            <p>{lang === 'es' ? 'Análisis, aprendizajes y herramientas sobre Data Engineering, IA aplicada y automatización desde la práctica.' : 'Analysis, lessons and tools about Data Engineering, applied AI and automation from the field.'}</p>
            <div className="signal-editorial-count"><strong>{posts.length}</strong><span>{lang === 'es' ? 'notas publicadas' : 'published notes'}</span></div>
          </div>
        </div>
      </section>

      <nav className="signal-blog-nav" aria-label={lang === 'es' ? 'Secciones del blog' : 'Blog sections'}>
        <a href="#videos">{lang === 'es' ? 'Videos' : 'Videos'}</a>
        <a href="#latest">{lang === 'es' ? 'Últimas notas' : 'Latest'}</a>
        <a href="#research">{lang === 'es' ? 'Investigaciones' : 'Research'}</a>
        <a href="#posts">{lang === 'es' ? 'Archivo' : 'Archive'}</a>
      </nav>

      <VideoSection />

      <section id="latest" className="signal-blog-latest">
        <div className="signal-blog-section-heading"><div><span className="signal-eyebrow">02 / {lang === 'es' ? 'Ahora' : 'Now'}</span><h2>{lang === 'es' ? 'Últimas notas.' : 'Latest notes.'}</h2></div><p>{lang === 'es' ? 'Ideas recientes sobre sistemas de datos, IA aplicada y decisiones técnicas.' : 'Recent ideas about data systems, applied AI and technical decisions.'}</p></div>
        {!!latest.length && (
          <div className="signal-latest-grid">
            <Link href={`/blog/${latest[0].slug}/`} className="signal-latest-feature" onClick={() => events.blogPostCardClick(latest[0].slug, latest[0].title[lang], latest[0].category)}>
              <div className="signal-latest-feature__meta"><span>FEATURE / 01</span><span>{latest[0].category.replaceAll('-', ' ')}</span></div>
              <h3>{latest[0].title[lang]}</h3><p>{latest[0].excerpt[lang]}</p>
              <div className="signal-latest-feature__footer"><span>{latest[0].readTime}</span><span>{lang === 'es' ? 'Leer nota' : 'Read note'} <ArrowUpRight size={16} /></span></div>
            </Link>
            <div className="signal-latest-list">
              {latest.slice(1).map((post, index) => <Link key={post.slug} href={`/blog/${post.slug}/`} onClick={() => events.blogPostCardClick(post.slug, post.title[lang], post.category)}><span>{String(index + 2).padStart(2, '0')}</span><div><small>{post.category.replaceAll('-', ' ')}</small><h3>{post.title[lang]}</h3></div><ArrowUpRight size={16} /></Link>)}
            </div>
          </div>
        )}
      </section>

      <SpecialReportsSection />

      <section id="posts" className="signal-editorial-index">
        <div className="signal-editorial-index__top">
          <div><span className="signal-eyebrow">04 / {lang === 'es' ? 'Archivo' : 'Archive'}</span><h2>{lang === 'es' ? 'Todas las notas.' : 'All notes.'}</h2></div>
          <label className="signal-blog-search">
            <Search size={18} />
            <span className="sr-only">{lang === 'es' ? 'Buscar artículos' : 'Search articles'}</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(12); }} placeholder={lang === 'es' ? 'Buscar por tema, tecnología…' : 'Search by topic, technology…'} />
          </label>
        </div>

        <div className="signal-blog-filters" aria-label={lang === 'es' ? 'Filtrar por categoría' : 'Filter by category'}>
          <button className={category === 'all' ? 'is-active' : ''} onClick={() => updateCategory('all')}>{lang === 'es' ? 'Todas' : 'All'} <span>{posts.length}</span></button>
          <button className={category === 'saved' ? 'is-active' : ''} onClick={() => updateCategory('saved')}>{lang === 'es' ? 'Guardadas' : 'Saved'} <span>{savedSlugs.length}</span></button>
          {categories.map((value) => <button key={value} className={category === value ? 'is-active' : ''} onClick={() => updateCategory(value)}>{CATEGORY_LABELS[value]?.[lang] ?? value} <span>{posts.filter((post) => post.category === value).length}</span></button>)}
        </div>

        <div className="signal-post-grid">
          {filtered.slice(0, visible).map((post, index) => <PostCard key={post.slug} post={post} index={index} />)}
        </div>

        {!filtered.length && <p className="signal-empty-state">{lang === 'es' ? 'No encontramos notas con ese criterio.' : 'No notes match that criteria.'}</p>}
        {visible < filtered.length && <button className="signal-load-more" onClick={() => { const next = visible + 12; events.contentLoadMore('article', next); setVisible(next); }}>{lang === 'es' ? 'Cargar 12 notas más' : 'Load 12 more notes'}<ArrowDown size={16} /></button>}
      </section>
    </>
  );
}
