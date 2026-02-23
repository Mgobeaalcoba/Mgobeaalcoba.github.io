import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/queries';
import type { BlogPostMeta } from '@/lib/queries';

const POSTS_DIR = path.join(process.cwd(), '..', 'blog', 'posts');

export interface PostMeta {
  slug: string;
  file: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  author: string;
}

export interface PostWithContent extends PostMeta {
  contentHtml: string;
  rawContent: string;
}

function toPostMeta(p: BlogPostMeta): PostMeta {
  return {
    slug: p.slug,
    file: p.file,
    title: { es: p.titleEs, en: p.titleEn },
    excerpt: { es: p.excerptEs, en: p.excerptEn },
    date: p.date,
    category: p.category,
    tags: p.tags,
    featured: p.featured,
    readTime: p.readTime,
    author: p.author,
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const posts = await fetchBlogPosts();
  return posts.map(toPostMeta);
}

export async function getFeaturedPosts(): Promise<PostMeta[]> {
  const posts = await fetchBlogPosts();
  return posts.filter((p) => p.featured).map(toPostMeta);
}

export async function getCategories(): Promise<string[]> {
  return fetchBlogCategories();
}

export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  const posts = await fetchBlogPosts();
  const postMeta = posts.find((p) => p.slug === slug);
  if (!postMeta) return null;

  const meta = toPostMeta(postMeta);

  const fileName = postMeta.file.replace(/^blog\/posts\//, '').replace(/^blog\//, '');
  const filePath = path.join(POSTS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return { ...meta, contentHtml: '<p>Content coming soon...</p>', rawContent: '' };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return { ...meta, contentHtml, rawContent: content };
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await fetchBlogPosts();
  return posts.map((p) => p.slug);
}
