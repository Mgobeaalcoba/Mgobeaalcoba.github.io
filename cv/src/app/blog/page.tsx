import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import NewsletterBanner from '@/components/shared/NewsletterBanner';
import ScrollTracker from '@/components/shared/ScrollTracker';
import BlogClientPage from './BlogClientPage';
import FloatingCTA from '@/components/shared/FloatingCTA';
import { getAllPostsMeta, getCategories } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog Técnico | Data Engineering en las Trincheras',
  description:
    'Artículos técnicos sobre Data Engineering, Python, Automatización con IA y Business Intelligence. Experiencias reales desde MercadoLibre.',
  alternates: {
    canonical: 'https://mgobeaalcoba.github.io/blog/',
  },
  openGraph: {
    title: 'Blog Técnico - Mariano Gobea Alcoba',
    description: 'Data Engineering en las Trincheras: artículos técnicos sobre IA, Python y datos.',
    url: 'https://mgobeaalcoba.github.io/blog/',
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPostsMeta(), getCategories()]);

  return (
    <main className="min-h-screen">
      <ScrollTracker />
      <Navbar />
      <BlogClientPage posts={posts} categories={categories} />
      <NewsletterBanner />
      <Footer />
      <FloatingCTA labelKey="floating_cta_blog" site_section="blog" />
    </main>
  );
}
