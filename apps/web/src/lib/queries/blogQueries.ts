import { supabase } from '@/lib/supabase';
import { groupBy } from './_helpers';

export interface BlogPostMeta {
  slug: string;
  file: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  date: string;
  category: string;
  featured: boolean;
  readTime: string;
  author: string;
  tags: string[];
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: string;
  duration: string;
  date: string;
  channel: string;
  featured: boolean;
  tags: string[];
}

export async function fetchBlogPosts(): Promise<BlogPostMeta[]> {
  const [{ data: posts, error: e1 }, { data: tags, error: e2 }] = await Promise.all([
    supabase.from('blog_posts').select('*').order('sort_order'),
    supabase.from('blog_post_tags').select('post_id, tag').order('id'),
  ]);
  if (e1 || e2) throw e1 ?? e2;
  const tagMap = groupBy(tags ?? [], (r) => r.post_id as number);
  return (posts ?? []).map((p) => ({
    slug: p.slug,
    file: p.file,
    titleEs: p.title_es,
    titleEn: p.title_en,
    excerptEs: p.excerpt_es,
    excerptEn: p.excerpt_en,
    date: p.date,
    category: p.category,
    featured: p.featured,
    readTime: p.read_time,
    author: p.author,
    tags: (tagMap.get(p.id) ?? []).map((t) => t.tag),
  }));
}

export async function fetchBlogCategories(): Promise<string[]> {
  const { data, error } = await supabase.from('blog_categories').select('name').order('sort_order');
  if (error) throw error;
  return (data ?? []).map((c) => c.name);
}

export async function fetchVideos(): Promise<VideoItem[]> {
  const [{ data: videos, error: e1 }, { data: tags, error: e2 }] = await Promise.all([
    supabase.from('videos').select('*').order('sort_order'),
    supabase.from('video_tags').select('video_id, tag').order('id'),
  ]);
  if (e1 || e2) throw e1 ?? e2;
  const tagMap = groupBy(tags ?? [], (r) => r.video_id as string);
  return (videos ?? []).map((v) => ({
    id: v.id,
    youtubeId: v.youtube_id,
    titleEs: v.title_es,
    titleEn: v.title_en,
    descriptionEs: v.description_es,
    descriptionEn: v.description_en,
    category: v.category,
    duration: v.duration,
    date: v.date,
    channel: v.channel,
    featured: v.featured,
    tags: (tagMap.get(v.id) ?? []).map((t) => t.tag),
  }));
}
