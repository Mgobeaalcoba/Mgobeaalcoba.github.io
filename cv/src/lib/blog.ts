import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import blogIndex from '@/data/blog-index.json';

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

export function getAllPostsMeta(): PostMeta[] {
  return blogIndex.posts as PostMeta[];
}

export function getFeaturedPosts(): PostMeta[] {
  return (blogIndex.posts as PostMeta[]).filter((p) => p.featured);
}

export function getCategories(): string[] {
  return blogIndex.categories;
}

export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  const postMeta = (blogIndex.posts as PostMeta[]).find((p) => p.slug === slug);
  if (!postMeta) return null;

  // Normalize file field — some entries include "blog/posts/" prefix
  const fileName = postMeta.file.replace(/^blog\/posts\//, '').replace(/^blog\//, '');
  const filePath = path.join(POSTS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return {
      ...postMeta,
      contentHtml: '<p>Content coming soon...</p>',
      rawContent: '',
    };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return { ...postMeta, contentHtml, rawContent: content };
}

export function getAllSlugs(): string[] {
  return (blogIndex.posts as PostMeta[]).map((p) => p.slug);
}
