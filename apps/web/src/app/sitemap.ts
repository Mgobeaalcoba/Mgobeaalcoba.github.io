import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import fs from 'fs';
import path from 'path';
import { OFFERS } from '@/lib/offers';
import { SITE_URL } from '@/lib/site';

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
      alternates: { languages: { es: SITE_URL, en: `${SITE_URL}/en/` } },
    },
    // English home: same consulting landing with English metadata and JSON-LD.
    {
      url: `${SITE_URL}/en/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: { languages: { es: SITE_URL, en: `${SITE_URL}/en/` } },
    },
    {
      url: `${SITE_URL}/servicios/`,
      lastModified: new Date('2026-08-05'),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { es: `${SITE_URL}/servicios/`, en: `${SITE_URL}/en/servicios/` } },
    },
    ...OFFERS.map((offer) => ({
      url: `${SITE_URL}/servicios/${offer.slug}/`,
      lastModified: new Date('2026-08-05'),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
      alternates: { languages: { es: `${SITE_URL}/servicios/${offer.slug}/`, en: `${SITE_URL}/en/servicios/${offer.slug}/` } },
    })),
    // English counterparts of the on-demand services pages.
    {
      url: `${SITE_URL}/en/servicios/`,
      lastModified: new Date('2026-08-05'),
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: { languages: { es: `${SITE_URL}/servicios/`, en: `${SITE_URL}/en/servicios/` } },
    },
    ...OFFERS.map((offer) => ({
      url: `${SITE_URL}/en/servicios/${offer.slug}/`,
      lastModified: new Date('2026-08-05'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: { es: `${SITE_URL}/servicios/${offer.slug}/`, en: `${SITE_URL}/en/servicios/${offer.slug}/` } },
    })),
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
    {
      url: `${SITE_URL}/privacidad/`,
      lastModified: new Date('2026-08-05'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog/special/layoffs-genai/`,
      lastModified: new Date('2026-04-03'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/special/layoffs-genai/methodology/`,
      lastModified: new Date('2026-04-03'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/special/funnel-hipotecario-bna/`,
      lastModified: new Date('2026-04-13'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/special/funnel-hipotecario-bna/methodology/`,
      lastModified: new Date('2026-04-13'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/special/reqquest-3d/`,
      lastModified: new Date('2026-04-03'),
      changeFrequency: 'monthly',
      priority: 0.85,
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
