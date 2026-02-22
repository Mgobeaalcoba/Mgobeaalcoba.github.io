import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ScrollTracker from '@/components/shared/ScrollTracker';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title.es,
    description: post.excerpt.es,
    openGraph: {
      title: post.title.es,
      description: post.excerpt.es,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Post no encontrado</h1>
            <Link href="/blog/" className="text-sky-400 hover:text-sky-300">
              ← Volver al blog
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <ScrollTracker />
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back link */}
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-sky-400 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-100 leading-tight mb-4">
            {post.title.es}
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-6">{post.excerpt.es}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('es-AR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-gray-400">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-sky max-w-none
            prose-headings:text-gray-100 prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-sky-300 prose-code:bg-sky-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-sky-500 prose-blockquote:text-gray-400
            prose-strong:text-gray-100
            prose-li:text-gray-300
            prose-hr:border-white/10
            prose-table:border-collapse
            prose-thead:bg-gray-800/60
            prose-th:text-gray-200 prose-th:font-semibold prose-th:border prose-th:border-white/10 prose-th:px-4 prose-th:py-2
            prose-td:text-gray-300 prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-4">
            Escrito por <span className="text-sky-400 font-medium">{post.author}</span>
          </p>
          <div className="flex gap-4">
            <Link
              href="/blog/"
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              ← Otros artículos
            </Link>
            <Link
              href="/consulting/"
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              Consultoría →
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
