import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.mgatc.com';

function getBlogSlugs(): string[] {
  try {
    const postsDir = path.join(process.cwd(), 'content/posts');
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
    return files.map((f) => f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getBlogSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recursos/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
