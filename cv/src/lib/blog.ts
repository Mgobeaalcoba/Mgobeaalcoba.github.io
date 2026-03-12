import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { fetchBlogPosts, fetchBlogCategories } from '@/lib/queries';
import type { BlogPostMeta } from '@/lib/queries';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

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

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function getPostMetaFromFile(fileName: string): Promise<PostMeta | null> {
  const filePath = path.join(POSTS_DIR, fileName);
  if (!fs.existsSync(filePath) || !fileName.endsWith('.md')) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Default values from filename: YYYY-MM-DD-slug.md
  const fileDateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  const defaultDate = fileDateMatch ? fileDateMatch[1] : new Date().toISOString().split('T')[0];
  const defaultSlug = fileDateMatch ? fileDateMatch[2] : fileName.replace('.md', '');

  // Extract title from content if not in frontmatter
  let title = data.title || '';
  if (!title) {
    const titleMatch = content.match(/^#+\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : defaultSlug.replace(/-/g, ' ');
  }

  // Extract excerpt from content if not in frontmatter
  let excerpt = data.excerpt || '';
  if (!excerpt) {
    const paragraphs = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    excerpt = paragraphs.length > 0 ? paragraphs[0].slice(0, 160) + '...' : '';
  }

  return {
    slug: data.slug || defaultSlug,
    file: fileName,
    title: typeof title === 'object' ? title : { es: title, en: title },
    excerpt: typeof excerpt === 'object' ? excerpt : { es: excerpt, en: excerpt },
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : defaultDate,
    category: data.category || 'General',
    tags: data.tags || [],
    featured: !!data.featured,
    readTime: data.readTime || calculateReadTime(content),
    author: data.author || 'Mariano Gobea Alcoba',
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];
  
  const files = fs.readdirSync(POSTS_DIR);
  const postsPromises = files.map(file => getPostMetaFromFile(file));
  const posts = (await Promise.all(postsPromises)).filter((p): p is PostMeta => p !== null);
  
  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getFeaturedPosts(): Promise<PostMeta[]> {
  const posts = await getAllPostsMeta();
  return posts.filter((p) => p.featured);
}

export async function getCategories(): Promise<string[]> {
  const posts = await getAllPostsMeta();
  const categories = new Set(posts.map(p => p.category));
  return Array.from(categories);
}

export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  const posts = await getAllPostsMeta();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return null;

  const filePath = path.join(POSTS_DIR, meta.file);
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
  const posts = await getAllPostsMeta();
  return posts.map((p) => p.slug);
}
